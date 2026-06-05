# Database & Graph Schema

LokTantra uses a dual-database architecture: **PostgreSQL** as the absolute source of truth for all structured entity data, and **Neo4j** as a derived, read-optimized graph projection for complex relationship traversal.

---

## 1. PostgreSQL Schema (Prisma ORM)

The schema (`prisma/schema.prisma`) is divided into domain groups. All models use CUID primary keys.

### 1.1 Auth Domain (NextAuth)

| Model | Purpose |
|-------|---------|
| `User` | Platform user (Google OAuth or email/password). Roles: `USER`, `RESEARCHER`, `MODERATOR`, `ADMIN`. |
| `Account` | OAuth provider account linked to a User. |
| `Session` | Active user sessions (JWT strategy with NextAuth). |
| `VerificationToken` | Email verification tokens. |

**Key indexes**: `User(email)` unique, `User(role)`, `Account(userId)`, `Session(userId)`, `Session(expires)`.

---

### 1.2 Moderation & Audit

| Model | Purpose |
|-------|---------|
| `ContentFlag` | User-reported issues with AI responses, articles, or search results. Statuses: `PENDING`, `REVIEWING`, `RESOLVED_VALID`, `RESOLVED_INVALID`, `ESCALATED`. |
| `AuditLog` | Immutable event log for all significant platform actions (sign-in, flag creation, admin changes). |

**Key indexes**: `ContentFlag(contentType, contentId)`, `ContentFlag(status, createdAt)`, `ContentFlag(userId)`, `ContentFlag(reviewedBy)`, `AuditLog(action, createdAt)`, `AuditLog(userId, createdAt)`, `AuditLog(resource, resourceId)`.

**Cascade rules**: `ContentFlag.userId` → `onDelete: SetNull` (flags survive user deletion). `AuditLog.userId` → `onDelete: SetNull`.

---

### 1.3 Media Assets

| Model | Purpose |
|-------|---------|
| `MediaAsset` | Stores profile photos, logos, and banners for entities. Variants (thumb, avatar, card, original) stored as JSON. |

**Unique**: `(entityType, entityId, mediaType)` — one active asset per type per entity.  
**Key indexes**: `(entityType, entityId)`, `checksum`, `(isActive, entityType)`.

---

### 1.4 Data Provenance

| Model | Purpose |
|-------|---------|
| `DataSource` | Represents an official source (ECI, PRS, India Code, ADR). |
| `DataProvenance` | Tracks which source provided a specific entity, at what time, and with what confidence score. |
| `EntityEvent` | Append-only event log for entity mutations (event sourcing). |

**Key indexes**: `DataProvenance(entityType, entityId)`, `DataProvenance(sourceId)`, `EntityEvent(entityType, entityId)`, `EntityEvent(timestamp)`.

---

### 1.5 Constitutional Domain

| Model | Purpose |
|-------|---------|
| `ConstitutionPart` | Top-level parts of the Constitution (e.g., Part III: Fundamental Rights). |
| `ConstitutionArticle` | Individual articles with full text, explanations, category, and amendment/case relations. |
| `Amendment` | Constitutional amendments with their affected articles (M2M). |
| `Schedule` | The 12 schedules of the Constitution. |

**Key indexes**: `ConstitutionArticle(category)`, `ConstitutionArticle(partId)`.  
**Temporal fields**: `validFrom`, `validTo` on `ConstitutionArticle` (for tracking article validity through amendments).

---

### 1.6 Institutional Domain

| Model | Purpose |
|-------|---------|
| `Institution` | Any governmental body — branch, department, tribunal, or commission. Self-referential (parent/children) to build the hierarchy tree. |
| `Position` | Specific roles within an institution (e.g., Prime Minister, Chief Justice). |

**Key indexes**: `Institution(branch, level)`, `Institution(slug)`, `Institution(parentId)`.  
**Note**: `Position(currentHolderId)` is a unique FK — only one person can hold a position at a time. Also indexed on `institutionId`.

---

### 1.7 People & Temporal Roles

| Model | Purpose |
|-------|---------|
| `Person` | Any politician, judge, or bureaucrat. Carries contact, profile JSON, criminal cases, and declared assets. |
| `PersonPartyHistory` | Temporal record of party memberships (supports tracking defections). |
| `PersonRole` | Temporal record of institutional roles a person has held. |

**Key indexes**:
- `Person(stateCode, chamber)`, `Person(partyId)`
- `PersonPartyHistory(personId)`, `PersonPartyHistory(partyId)`, `PersonPartyHistory(personId, validFrom, validTo)` ← composite temporal
- `PersonRole(personId)`, `PersonRole(validFrom, validTo)`, `PersonRole(personId, validFrom, validTo)` ← composite temporal, `PersonRole(institutionId)`, `PersonRole(committeeId)`

**Cascade rules**:
- `PersonPartyHistory.personId` → `onDelete: Cascade` (party history deleted with person)
- `PersonPartyHistory.partyId` → `onDelete: Restrict` (party cannot be deleted if members have history)
- `PersonRole.personId` → `onDelete: Cascade`
- `PersonRole.institutionId` → `onDelete: SetNull` (role survives institution deletion)
- `PersonRole.committeeId` → `onDelete: SetNull`

---

### 1.8 Political Parties

| Model | Purpose |
|-------|---------|
| `PoliticalParty` | Party profile with ideology, color, symbol, current seat data. |

**Unique**: `name`, `abbreviation`.  
**Temporal fields**: `foundedOn`, `disbandedOn`.

---

### 1.9 Elections & Geography

| Model | Purpose |
|-------|---------|
| `StateUT` | All 28 states and 8 Union Territories with seat allocations. |
| `District` | Administrative districts within a state. |
| `Constituency` | Electoral boundaries (Lok Sabha, Vidhan Sabha, Rajya Sabha, Vidhan Parishad). |
| `PinCode` | Maps PIN codes to constituencies and districts (used by DiscoveryService). |
| `ElectionResult` | Constituency-level election results (legacy model — winner, votes, turnout, margin). |
| `ElectionSummary` | Macro election statistics per election (total seats, winner, turnout). |
| `PartyElectionResult` | Party-level seat and vote-share data per election year. |
| `Election` | Comprehensive election event model (new). |
| `ElectionCandidate` | Full candidate data linked to Election, Constituency, Person, and Party (new). |

**Key indexes**: `District(stateId)`, `Constituency(stateCode, type)`, `ElectionResult(year, type)`, `ElectionResult(constituencyId)`, `ElectionResult(winnerId)`, `ElectionCandidate(electionId)`, `ElectionCandidate(constituencyId)`, `ElectionCandidate(personId)`, `ElectionCandidate(partyId)`.

**Cascade rules**: `ElectionCandidate` uses `onDelete: Restrict` on all FKs — historical election data must not be orphaned.

---

### 1.10 Judiciary

| Model | Purpose |
|-------|---------|
| `Court` | Judicial body (Supreme Court, High Courts, Tribunals). |
| `LandmarkCase` | Supreme Court and High Court landmark decisions with M2M links to interpreted articles. |
| `Writ` | Types of constitutional writs (Habeas Corpus, Mandamus, etc.). |

**Key indexes**: `LandmarkCase(courtId)`, `LandmarkCase(year)`.  
**Cascade rules**: `LandmarkCase.courtId` → `onDelete: Restrict` (cases cannot be orphaned if court record changes).

---

### 1.11 Legislation

| Model | Purpose |
|-------|---------|
| `Bill` | Tracks proposed legislation through Parliament. |
| `Act` | Enacted law derived from a Bill. |

**Key indexes**: `Bill(status, type)`.

---

### 1.12 Ministries & Bureaucracy

| Model | Purpose |
|-------|---------|
| `Ministry` | Union or State Ministry. |
| `Department` | Sub-division of a Ministry. |
| `Committee` | Parliamentary or executive committee. |
| `BureaucraticLevel` | IAS hierarchy levels (Secretary, Additional Secretary, etc.). |

**Key indexes**: `Department(ministryId)`.  
**Cascade rules**: `Department.ministryId` → `onDelete: Cascade`.

---

### 1.13 Governance Processes, Timeline, Learning, Citizen Action

| Model | Purpose |
|-------|---------|
| `GovernanceProcess` | Step-by-step civic process (e.g., "How a Bill becomes an Act"). |
| `ProcessStep` | Individual step within a process (cascades with process). |
| `TimelineEvent` | Historical political events with date, category, significance. |
| `LearningPath` | Structured learning tracks with modules (cascades). |
| `LearningModule` | Individual learning unit within a path. |
| `CitizenAction` | RTI, PIL, grievance guide entry. |

**Key indexes**: `TimelineEvent(category, date)`.

---

### 1.14 Observability

| Model | Purpose |
|-------|---------|
| `ScraperRun` | Tracks each ETL run per source (status, duration, records processed). |
| `ObservabilityLog` | Structured log entries (mirrored to Redis for real-time streaming). |

---

## 2. Indexing Strategy Summary

All foreign key columns are indexed (PostgreSQL does not auto-index FKs unlike MySQL). Key compound indexes:

| Purpose | Index |
|---------|-------|
| Temporal role queries | `PersonRole(personId, validFrom, validTo)` |
| Temporal party queries | `PersonPartyHistory(personId, validFrom, validTo)` |
| Election filtering | `ElectionResult(year, type)`, `PartyElectionResult` unique `(year, type, party)` |
| Institution tree traversal | `Institution(branch, level)`, `Institution(parentId)` |
| Content moderation | `ContentFlag(status, createdAt)`, `ContentFlag(contentType, contentId)` |
| Audit trail | `AuditLog(action, createdAt)`, `AuditLog(userId, createdAt)` |
| Timeline browsing | `TimelineEvent(category, date)` |

---

## 3. Cascade Rules Summary

| Relation | Rule | Reason |
|----------|------|--------|
| `Account → User` | Cascade | OAuth accounts exist only for their user |
| `Session → User` | Cascade | Sessions are user-owned |
| `ContentFlag.userId` | SetNull | Flags survive user deletion (moderation record kept) |
| `AuditLog.userId` | SetNull | Audit trail preserved after user deletion |
| `PersonRole → Person` | Cascade | Role history meaningless without the person |
| `PersonRole.institutionId` | SetNull | Roles survive institution reorganisation |
| `PersonPartyHistory → Person` | Cascade | Party history meaningless without the person |
| `PersonPartyHistory → Party` | Restrict | Party cannot be deleted while members have history |
| `ElectionCandidate → *` | Restrict | Historical electoral records are immutable |
| `LandmarkCase → Court` | Restrict | Cases cannot be orphaned if court data changes |
| `Department → Ministry` | Cascade | Departments are sub-units of their ministry |
| `ProcessStep → GovernanceProcess` | Cascade | Steps are meaningless without the process |
| `LearningModule → LearningPath` | Cascade | Modules belong entirely to their path |

---

## 4. Soft Deletes (Planned)

Historical civic data should never be hard-deleted. The following models are candidates for a `deletedAt DateTime?` soft-delete pattern:

- `Person`, `Institution`, `PoliticalParty`
- `Amendment`, `LandmarkCase`, `Bill`, `Act`
- `ElectionResult`, `ElectionCandidate`, `Election`

This will be implemented as part of the Phase 2 performance sprint (see [AUDIT.md](../AUDIT.md)).

---

## 5. Neo4j Graph Schema

See [graph-ontology.md](graph-ontology.md) for the full Neo4j node label definitions, edge types, Cypher query patterns, and required index creation statements.

**Synchronization**: Neo4j is currently seeded manually from PostgreSQL data. Automated real-time sync via Redis event bus is planned for Phase 3.
