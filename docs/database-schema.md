# Database & Graph Schemas

LokTantra uses a dual-database architecture: **PostgreSQL** as the absolute source of truth for structured entity data, and **Neo4j** as a derived read-optimized projection for complex relationship traversal.

## 1. PostgreSQL Schema (Prisma)

The Prisma schema is divided into distinct domain models.

### 1.1 Data Provenance [NEW]
To ensure source verifiability, every ingested entity must track its origin.
- **DataSource**: Represents an official source (e.g., ECI, PRS, India Code).
- **DataProvenance**: Tracks which source provided a specific entity, at what time, and assigns a confidence score.

### 1.2 Constitution Domain
- **ConstitutionPart**: High-level groups of articles (e.g., Part III: Fundamental Rights).
- **ConstitutionArticle**: The individual articles, categorized and indexed.
- **Amendment**: Constitutional amendments with Many-to-Many relations to Articles.
- **Schedule**: The 12 schedules of the constitution.

### 1.3 Institutional Domain
- **Institution**: Represents any branch, department, or body. Self-referential to build the hierarchy tree. Indexed heavily on `slug` and `(branch, level)`.
- **Position**: Specific roles within an institution (e.g., Chief Justice, Prime Minister).

### 1.4 Electoral Domain
- **Constituency**: Represents electoral boundaries (Lok Sabha, Vidhan Sabha).
- **ElectionResult**: Individual constituency-level results.
- **ElectionSummary**: Macro-level election stats.
- **PartyElectionResult**: Multi-party seat and vote share data.

### 1.5 Legal & Judicial Domain
- **Court**: Hierarchy of Indian courts.
- **LandmarkCase**: Critical Supreme Court cases with M2M relations to Constitution Articles.
- **Bill**: Tracks legislative progression.

### Indexing Strategy
- Heavy use of compound indexes for frequent query patterns.
- `ConstitutionArticle` indexed by `category`.
- `Institution` indexed by `(branch, level)` for rapid tree construction.
- `Person` indexed by `(stateCode, chamber)` and `partyId`.

---

## 2. Neo4j Graph Ontology

While PostgreSQL stores the entities, Neo4j models the dense, highly-connected relationships between them.

### 2.1 Node Labels (16 Types)
`Person`, `Institution`, `Position`, `Article`, `Party`, `Constituency`, `State`, `Court`, `Case`, `Bill`, `Amendment`, `Committee`, `Ministry`, `Department`, `Scheme`, `Election`.

### 2.2 Edge Types (24 Types)
Relationships are the core of Neo4j. Example edges include:
- **Hierarchical**: `[:REPORTS_TO]`, `[:PART_OF]`, `[:HEADS]`
- **Power dynamics**: `[:APPOINTS]`, `[:REMOVES]`, `[:SUPERVISES]`, `[:OVERRULES]`
- **Legislative**: `[:LEGISLATES]`, `[:AMENDED_BY]`, `[:IMPLEMENTS]`
- **Judicial**: `[:INTERPRETS]`, `[:DECIDED_BY]`, `[:JUDICIAL_REVIEW_OVER]`
- **Electoral**: `[:ELECTED_FROM]`, `[:REPRESENTS]`, `[:BELONGS_TO_PARTY]`

### 2.3 Key Cypher Query Patterns
- **Path of Appointment**: Who has the ultimate power to appoint a given position?
  `MATCH path = (a:Position)-[:APPOINTS*]->(b:Position) RETURN path`
- **Constitutional Impact**: What articles were interpreted by a specific court case?
  `MATCH (c:Case)-[:INTERPRETS]->(a:Article) RETURN a`
- **Checks and Balances**: Which institution exercises judicial review over another?
  `MATCH (i1:Institution)<-[:JUDICIAL_REVIEW_OVER]-(i2:Institution) RETURN i1, i2`
