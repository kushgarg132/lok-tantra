---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-06-09'
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-lok-tantra-2026-06-08/prd.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-lok-tantra-2026-06-08/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-lok-tantra-2026-06-08/EXPERIENCE.md"
  - "_bmad-output/project-context.md"
  - "docs/database-schema.md"
  - "docs/graph-ontology.md"
  - "docs/api-reference.md"
  - "docs/etl-pipelines.md"
  - "docs/ai-rag-system.md"
  - "docs/deployment.md"
workflowType: 'architecture'
project_name: 'lok-tantra'
user_name: 'Kush'
date: '2026-06-09'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## 2. Project Context Analysis

### 2.1 Functional Requirements → Architectural Components

| FR | Capability | Primary Components | Key Architectural Implications |
|---|---|---|---|
| **FR-1** View national power graph | Initial graph load, centered on PM Office | Graph data API (Neo4j temporal query → JSON subgraph), Cytoscape.js renderer, layout engine | First load must fetch and lay out 50–100+ Nodes — no precedent in this codebase for a Cytoscape graph of this density. Layout algorithm choice (force-directed vs. hierarchical vs. pre-computed) is load-bearing. |
| **FR-2** Drill through connections | Expand a Node's neighbors in place | Client-side graph expansion, incremental data fetch, Cytoscape `graph-traverse` animation | Needs a lazy-expansion API: given a Node ID + date, return its 1-hop neighbors with edges. Must merge into the client-side graph without re-fetching the whole subgraph. |
| **FR-3** Person's career path | Chronological Tenure sequence | Tenure query (all Tenures for a PersonId, ordered by startDate), profile-sheet UI | Requires a **Tenure** concept in the data model — `PersonRole` is close but `Position.currentHolderId` (singular unique FK) contradicts multi-holder-over-time. See §2.4 Constraint #1. |
| **FR-4** Office powers & responsibilities | Constitutional grounding per Office | Position → ConstitutionArticle link, plain-language explainer | Relatively simple join; the `/api/constitution/explain` Claude-backed route already exists. Need a FK from `Position` to one or more `ConstitutionArticle` records (or Edge in Neo4j). |
| **FR-5** Accountability Data | ADR/MyNeta per Person | Person profile enrichment, source attribution | Data already partially modeled (`Person.criminalCases`, `Person.declaredAssets` as JSON). Template-enforced symmetry (§5 Neutrality) is a UI concern, but the API must return identical field shapes regardless of Person. |
| **FR-6** Constitutional citation inline | Tap citation → overlay explainer | Citation panel component, `ConstitutionArticle` fetch, links to `/constitution` | Low architectural risk — piggybacks on existing `/api/constitution` route. |
| **FR-7** Time Travel scrubber | Re-render full graph for any date 1947–present | **Temporal graph resolution engine** — the single hardest architectural problem. Must resolve, for every Office visible in the current viewport, which Tenure is active on the selected date. Three Office states: occupied, vacant, not-yet-established. | Drives the Tenure data model, the Neo4j temporal query pattern (§3.6 in graph-ontology.md already demonstrates this with `HOLDS_POSITION`), and the rendering performance budget. See §2.4 Constraints #1–#3. |
| **FR-8** Search the power graph | Jump to a Node by Person/Office/party, respecting Time Travel date | Graph-aware search API | Not a reuse of `/api/search` (which does BM25+KNN document retrieval). Needs a new endpoint: text query → candidate Node IDs → filter by temporal validity on the active date → return Node positions for graph centering. |

### 2.2 Non-Functional Requirements

| NFR | Source | Target | Architectural Impact |
|---|---|---|---|
| **Performance — initial load** | FR-1, Open Question #1 | Interactive on mobile within "existing performance expectations" (TBD via spike) | Graph data payload size, SSR vs. CSR strategy for the graph canvas, code-splitting Cytoscape.js (~400KB gzipped). |
| **Performance — continuous scrub** | FR-7, Open Question #1 | Re-render keeps pace with drag gesture (~16ms frame budget for 60fps, realistically ~400ms motion budget per the UX spec) | Three options: (A) full Neo4j round-trip per scrub tick — almost certainly too slow; (B) prefetch a temporal snapshot array on initial load — trades memory for latency; (C) client-side Tenure resolution from a preloaded Tenure table — fastest scrub but largest initial payload and duplicates resolution logic. |
| **Neutrality** | §5, SM-C2 | Structural/chronological treatment only; no editorial prominence | Enforced primarily at the data/template layer — API must never sort by popularity/trending; UI templates must be Person-agnostic. Architectural surface: the graph layout algorithm must not inadvertently give more visual space to one party's members. |
| **Source-verifiability** | §5, CLAUDE.md | Every fact carries provenance inline | `DataProvenance` model exists. API responses must include source + lastUpdated per field, not just per entity. |
| **Accessibility** | UX EXPERIENCE.md | Connections list (screen-reader graph traversal), 44px tap targets, reduced-motion support | Connections list needs a DOM structure that coexists with Cytoscape's `<canvas>` — either a live-region, ARIA tree, or companion list panel. Architectural because it shapes the rendering approach (pure canvas vs. canvas+DOM hybrid). |

### 2.3 Scale & Complexity Assessment

**Complexity: HIGH** — full-stack, touches every layer.

- **Data model**: Requires a new temporal concept (Tenure) that doesn't exist yet, plus rethinking `Position.currentHolderId`.
- **Dual database**: PostgreSQL as source of truth, Neo4j as derived graph projection — with no automated sync today (manual seed only). Power Explorer can't ship without a reliable PG→Neo4j sync path for Tenure data.
- **Frontend**: Cytoscape.js at a density and interactivity level never attempted in this codebase. Continuous re-rendering during scrub is an open research question for this stack.
- **New API surface**: At minimum 3 new endpoints (graph subgraph with temporal resolution, Node expansion, graph-aware search). Existing `/api/graph/hierarchy` and `/api/graph/path` are starting points but don't handle temporal resolution.
- **Historical data**: MVP scope hinges on Open Question #3 (1947 vs. ~1990 start date) — a multi-month sourcing effort, not a build task.

### 2.4 Technical Constraints

| # | Constraint | Source | Impact |
|---|---|---|---|
| 1 | **No `Tenure` model exists** in Prisma. `PersonRole(validFrom, validTo)` is the closest analog, but `Position.currentHolderId` is a unique FK — only one Person can hold a Position at a time, which structurally prevents historical Tenure tracking in PG. | `database-schema.md` §1.6–1.7 | Must either: (a) create a dedicated `Tenure` model, or (b) repurpose `PersonRole` + drop/rethink `Position.currentHolderId`. Option (b) is cleaner if `PersonRole` already carries the right fields — but it conflates "held a role" (generic) with "occupied a constitutional Office" (specific, tied to the graph). |
| 2 | **Neo4j `HOLDS_POSITION` edge already supports temporal queries** (§3.6 in graph-ontology.md). The Cypher pattern for point-in-time resolution exists. But Neo4j is manually seeded — no automated PG→Neo4j sync. | `graph-ontology.md` §6 | Power Explorer's Time Travel can query Neo4j for temporal resolution *if* the data is there. The sync gap is the real constraint — not the query capability. |
| 3 | **No continuous-scrub rendering precedent.** The only Cytoscape.js usage is `PoliticalRelationshipMap` — a small, static graph. Continuous re-rendering of 50–100+ Nodes during a drag gesture is uncharted territory. | PRD Open Question #1 | Requires a performance spike *before* architecture can commit to a rendering strategy. The PRD pre-approves a fallback: anchored-to-known-transitions scrubber instead of continuous. |
| 4 | **GraphService LRU cache (500 entries, 30-min TTL)** is in-memory — works for a single server pod but breaks under horizontal scaling. | `CLAUDE.md` Known Gaps, `graph-ontology.md` §5 | Power Explorer will hammer this cache with temporal queries. Must evaluate: is the cache even useful for temporal queries (where the date parameter changes continuously), or does it need a different caching strategy? |
| 5 | **Search infrastructure is document-oriented.** `/api/search` uses Elasticsearch BM25+KNN over text content. "Jump to a Node by name while preserving the active Time Travel date" is a temporal graph-resolution query — a different problem shape. | PRD Open Question #4, `api-reference.md` | New search endpoint needed. Can reuse ES for the text-matching step, then resolve temporal validity against Neo4j or PG. |
| 6 | **ETL ingestors lack `$transaction()` wrapping** — partial-ingest risk. No dead-letter queue handler. | `CLAUDE.md` Known Gaps | Tenure data ingestion (a new ingestor or extension of ADR/ECI) inherits this risk. Historical data is particularly sensitive to partial ingest — a half-loaded decade would silently produce wrong Time Travel results. |
| 7 | **`/power-structure` must be retired** — Power Explorer fully replaces it. Migration/redirect mechanics are an architecture concern. | PRD §6, Open Question #2 | Route redirect + component cleanup. Low risk but must be planned. |
| 8 | **Cytoscape.js is ~400KB gzipped.** Currently tree-shaken to near-zero because only `PoliticalRelationshipMap` uses it minimally. Power Explorer will be its first heavy consumer. | `CLAUDE.md` Known Gaps (lists Cytoscape as having minimal active imports) | Code-splitting strategy needed — Cytoscape should load only on the Power Explorer route, not bloat the global bundle. |

### 2.5 Cross-Cutting Concerns

| Concern | Surfaces In | Architectural Decision Needed |
|---|---|---|
| **Temporal resolution consistency** | FR-3, FR-7, FR-8 | Where does date→Tenure resolution happen? One canonical engine (Neo4j Cypher? PG query? Client-side JS?) — or does it differ by context (scrub = client, profile = server)? Inconsistent resolution across surfaces = different answers for the same date. |
| **PG↔Neo4j synchronization** | FR-1, FR-2, FR-7, data integrity | Automated sync path. Options: (a) write-through on Prisma mutations, (b) Redis event bus (planned Phase 3 per graph-ontology.md §6), (c) scheduled batch sync. Power Explorer can't tolerate stale graph data — a Person's Tenure ends in PG but Neo4j still shows them as incumbent = visually wrong graph. |
| **Accessibility DOM strategy** | FR-2 (screen-reader traversal), NFR-Accessibility | Cytoscape renders to `<canvas>` — inherently inaccessible. The UX spec's connections list needs a parallel DOM structure. Options: (a) ARIA live-region updated on focus change, (b) hidden companion `<ul>` synced with canvas state, (c) hybrid renderer (canvas for edges, DOM for Nodes). This shapes the entire rendering architecture. |
| **Neutrality at the data layer** | §5, FR-5 | API contracts must enforce template symmetry — same fields, same depth, same response shape for every Person regardless of who they are. No "featured" or "trending" sort. Layout algorithm must not cluster by party. These are API-design and algorithm-design constraints, not just UI rules. |
| **Caching strategy for temporal queries** | FR-7, NFR-Performance | The existing LRU cache keys on query string. Continuous scrubbing generates a unique date per frame — cache hit rate ≈ 0%. Need either: date-bucketing (round to nearest transition), preloaded temporal snapshots, or client-side resolution that avoids the cache entirely. |

---

## 3. Starter Template Evaluation

### Primary Technology Domain

Full-stack web application — existing, not new. Power Explorer is a feature addition to a production Next.js 14 App Router codebase.

### Starter Options Considered

| Option | Verdict |
|---|---|
| **New `create-next-app` project** | Rejected — Power Explorer inherits the existing auth, layout, design system, API conventions, DB connections, and ETL pipeline. Extracting it into a separate app would duplicate infrastructure. |
| **Monorepo extraction (Turborepo/Nx)** | Rejected — premature. Power Explorer shares pages, components, lib, and the Prisma client with the rest of the platform. No isolation boundary justifies the overhead. |
| **Build within existing `src/`** | ✅ Selected — Power Explorer lives at `src/app/power-structure/` (replacing the existing route), with feature-scoped components under `src/components/power-explorer/`, new API routes under `src/app/api/graph/`, and data-model changes in `prisma/schema.prisma`. |

### Selected Starter: Existing LokTantra Codebase

**Rationale:** Every architectural decision a starter template normally makes — language, framework, styling, routing, auth, database, API patterns, deployment — is already made and running. Power Explorer extends this stack.

**Architectural Decisions Locked by the Existing Stack:**

| Category | Decision | Source |
|---|---|---|
| Language & Runtime | TypeScript (strict), Node.js ≥ 18 | `tsconfig.json`, `package.json` |
| Framework | Next.js 14, App Router | `next.config.js` |
| Styling | Tailwind CSS + custom design tokens (saffron/navy/chakra), Framer Motion | `tailwind.config.ts`, UX DESIGN.md |
| State Management | Zustand | `src/store/` |
| Database (relational) | PostgreSQL + Prisma ORM | `prisma/schema.prisma` |
| Database (graph) | Neo4j + custom GraphService | `src/lib/services/graph.service.ts` |
| Search | Elasticsearch 9 (BM25+KNN) + Fuse.js fallback | `src/lib/search/` |
| Auth | NextAuth.js v4 (Google OAuth + email/password) | `src/lib/auth/` |
| API conventions | REST, Zod validation, try-catch, pagination (limit/offset, max 100) | `CLAUDE.md` audit rules |
| Graph visualization | Cytoscape.js (existing but minimal usage) | `src/components/graph/` |
| ETL / Queue | BullMQ + Redis | `src/worker/`, `src/lib/etl/` |
| Deployment | Docker Compose (local), Kubernetes (prod) | `infra/k8s/`, `infra/terraform/` |

**Decisions NOT yet made (Power Explorer–specific):**

| Category | Open Question |
|---|---|
| Tenure data model | New `Tenure` model vs. extended `PersonRole` |
| Temporal resolution engine | Neo4j vs. PG vs. client-side |
| PG→Neo4j sync strategy | Write-through vs. event bus vs. batch |
| Cytoscape.js rendering strategy | Pure canvas vs. canvas+DOM hybrid |
| Scrub rendering approach | Continuous vs. anchored-to-transitions |
| Graph-aware search | New endpoint shape |
| Code-splitting for Cytoscape | Dynamic import strategy |

**Note:** There is no initialization command — the project is already initialized. The first implementation story should be the data-model migration (Tenure), not scaffolding.

---

## 4. Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Tenure data model shape (Decision 1)
2. Temporal resolution engine (Decision 2)
3. PG→Neo4j synchronization (Decision 3)
4. Cytoscape.js rendering strategy (Decision 4)
5. Scrub rendering approach (Decision 5)

**Important Decisions (Shape Architecture):**
6. Code-splitting for Cytoscape.js (Decision 6)
7. Graph-aware search (Decision 7)

**Deferred Decisions (Post-MVP):**
- Redis-backed rate limiter migration (existing Known Gap — not Power Explorer–specific)
- OpenTelemetry tracing integration (planned per AUDIT.md)
- State-level / MP-MLA graph expansion (PRD §8.2 — expansion wave 2–3)

### Data Architecture

#### Decision 1: Tenure Data Model — New `Tenure` Model ✅

**Decision:** Create a dedicated `Tenure` model in Prisma rather than extending `PersonRole`.

**Schema:**
```prisma
model Tenure {
  id                   String    @id @default(cuid())
  personId             String
  positionId           String
  startDate            DateTime
  endDate              DateTime?
  startDateApproximate Boolean   @default(false)
  mechanism            String?   // "elected", "appointed", "succeeded", "reshuffled"
  
  person               Person    @relation(fields: [personId], references: [id], onDelete: Cascade)
  position             Position  @relation(fields: [positionId], references: [id], onDelete: Restrict)
  
  @@index([personId])
  @@index([positionId])
  @@index([positionId, startDate, endDate])  // temporal resolution index
  @@index([personId, startDate])             // career path index
}
```

**Rationale:** Tenure is the backbone of Time Travel (FR-7) and career paths (FR-3) — it deserves its own model with dedicated temporal indexes rather than being overloaded onto `PersonRole` (which also covers committee memberships, bureaucratic postings, and other non-constitutional roles). `Position.currentHolderId` (the existing unique FK) becomes a derived query: `SELECT * FROM Tenure WHERE positionId = X AND endDate IS NULL`.

**Affects:** Prisma schema migration, Neo4j `HOLDS_POSITION` sync, ETL ingestor for historical data, all Power Explorer API routes.

#### Decision 2: Temporal Resolution Engine — Hybrid (Client Optimistic + Server Authoritative) ✅

**Decision:** Preload the Tenure table to the client for continuous scrub rendering; validate against Neo4j on scrub release and for all server-rendered surfaces.

**How it works:**
- **Initial load:** Fetch all Tenures for visible Offices (national layer ≈ 60–80 Offices × avg 5 Tenures ≈ 300–400 rows, ~50KB payload). Client stores this in a Zustand slice.
- **During scrub (drag):** Client-side JS resolves `date → active Tenure` per Office. Cytoscape re-renders locally at 60fps. No server round-trips.
- **On scrub release:** Fire a server validation request. Neo4j runs the §3.6 Cypher pattern and returns the authoritative subgraph. Client corrects any discrepancies (covered by the `time-rewind` motion).
- **Profile sheets, career paths:** Always server-resolved via Neo4j for full accuracy.

**Rationale:** Continuous scrub at 60fps is the UX's emotional payload — can't sacrifice it to server round-trips (~50–200ms each). But duplicating resolution logic without validation is a consistency risk. The hybrid makes the client optimistic and the server authoritative. The Tenure payload is trivially small.

**Consistency contract:** The client resolver must implement the exact same rules as Neo4j's Cypher: startDate inclusive, last-known-state for gaps, three Office states (occupied/vacant/not-yet-established). Tests must prove parity.

**Affects:** New Zustand store slice (`useTenureStore`), client-side resolver module, `/api/graph/temporal` endpoint, profile-sheet data fetching.

#### Decision 3: PG→Neo4j Synchronization — Redis Event Bus (Async) ✅

**Decision:** Prisma write → publish event to Redis → sync worker consumes and updates Neo4j.

**How it works:**
- Every Tenure create/update/delete in Prisma publishes a `tenure:changed` event to a BullMQ queue.
- A new sync worker (`src/worker/neo4j-sync.ts`) consumes these events and runs Cypher `MERGE` statements to upsert `HOLDS_POSITION` edges.
- Same pattern extends to other entity changes (Person, Position, Institution) as needed.

**Rationale:** The BullMQ/Redis infrastructure already exists. Seconds-level eventual consistency is fine — Tenure data changes infrequently (cabinet reshuffles, not real-time events). Write-through would couple every write to Neo4j availability. Batch sync is too slow for demo workflows.

**Failure handling:** Failed sync events retry via BullMQ's built-in retry mechanism. After exhausted retries, events land in a dead-letter queue (addresses the existing Known Gap about missing DLQ handling). Admin dashboard shows sync lag.

**Affects:** New BullMQ queue (`neo4j-sync`), new worker file, Prisma middleware or service-layer hook to publish events, admin observability for sync health.

### Frontend Architecture

#### Decision 4: Cytoscape.js Rendering — Pure Canvas + Hidden Companion DOM List ✅

**Decision:** Cytoscape.js renders the graph to `<canvas>` (its native mode). A hidden companion `<ul>` provides screen-reader accessibility.

**How it works:**
- Cytoscape handles all visual rendering on `<canvas>` — Nodes, Edges, layout, zoom, pan.
- A hidden (visually off-screen, not `display: none`) `<ul>` element mirrors the currently focused Node's connections. Updated via Cytoscape `tap`/`select` events.
- Screen readers navigate the list; activating an item triggers the same `graph-traverse` a sighted tap does.
- ARIA live-region announces state changes (date change, Node expansion) without requiring the user to navigate to the list.

**Rationale:** Canvas is Cytoscape's performant path — DOM overlay for 50–100+ Nodes during continuous scrub would cause layout thrashing. The companion list pattern is the standard accessibility approach for canvas visualizations. Resolves the UX spec's `[ASSUMPTION — open for architecture]` on DOM structure.

**Affects:** `PowerExplorerGraph` component, `AccessibilityCompanionList` component, Cytoscape event wiring.

#### Decision 5: Scrub Rendering — Continuous with Anchored Fallback ✅

**Decision:** Build for continuous scrub rendering. If the performance spike shows mobile can't sustain the ~400ms motion budget, degrade to anchored-to-transitions.

**Continuous mode:** Client-side Tenure resolution (Decision 2) + Cytoscape `ele.data()` batch updates per animation frame. Node positions held stable by layout; only occupant data (name, photo, party tag, state badge) changes.

**Anchored fallback:** Extract transition dates from the preloaded Tenure table. Scrubber snaps to these dates. Graph updates only on snap — server round-trip is acceptable at this lower frequency.

**Rationale:** The PRD pre-approves this exact fallback (Open Question #1). The architecture supports both modes from the same data (preloaded Tenures). The spike determines which ships; no architectural rework needed either way.

**Affects:** `TimeTravel` component, `useTenureStore` (transition date extraction for fallback), performance spike story.

#### Decision 6: Code-Splitting — `next/dynamic` with `ssr: false` ✅

**Decision:** Dynamic import of the Power Explorer graph renderer with `ssr: false`.

```typescript
const PowerExplorerGraph = dynamic(
  () => import('@/components/power-explorer/PowerExplorerGraph'),
  { ssr: false, loading: () => <GraphSkeleton /> }
);
```

**Rationale:** Cytoscape.js requires `window`/DOM APIs — cannot SSR. `next/dynamic` with `ssr: false` gives both SSR safety and bundle isolation. The page shell (metadata, layout chrome, Time Travel scrubber) can still SSR. `<GraphSkeleton>` provides the cold-open shimmer treatment from the UX spec.

**Affects:** `src/app/power-structure/page.tsx`, `PowerExplorerGraph` component.

### API & Search

#### Decision 7: Graph-Aware Search — Neo4j Fulltext Index ✅

**Decision:** Use Neo4j's existing `entity_names` fulltext index for Power Explorer search, with temporal filtering in the same Cypher query.

**Query pattern:**
```cypher
CALL db.index.fulltext.queryNodes('entity_names', $query) YIELD node, score
WHERE node:Person OR node:Position OR node:Party
OPTIONAL MATCH (node)-[hp:HOLDS_POSITION]->(pos:Position)
WHERE hp.startDate <= date($selectedDate)
  AND (hp.endDate IS NULL OR hp.endDate >= date($selectedDate))
RETURN node, score, pos
ORDER BY score DESC
LIMIT 20
```

**Rationale:** Power Explorer search is name/title lookup, not document retrieval. Neo4j's fulltext index is adequate. Single database hop. No sync complexity. Temporal filtering is a natural `WHERE` clause. Reserve ES for the platform's broader `/api/search`.

**New endpoint:** `GET /api/graph/search?q=<query>&date=<ISO-date>&limit=20`

**Affects:** New API route, `GraphService` method, search-overlay component.

### Decision Impact Analysis

**Implementation Sequence:**
1. **Tenure model migration** (Decision 1) — everything else depends on this
2. **Neo4j sync worker** (Decision 3) — Tenure data must flow to Neo4j before the graph can render
3. **Temporal graph API** (Decision 2, server side) — `/api/graph/temporal` endpoint
4. **Graph renderer** (Decision 4) — Cytoscape canvas + companion list
5. **Client-side Tenure resolution** (Decision 2, client side) — preloaded Tenures + resolver
6. **Time Travel scrubber** (Decision 5) — continuous mode, spike to validate
7. **Graph search** (Decision 7) — Neo4j fulltext query
8. **Code-splitting** (Decision 6) — applied during component assembly

**Cross-Component Dependencies:**
- Decision 2 (hybrid resolution) depends on Decision 1 (Tenure model) for its data shape and Decision 3 (sync) for Neo4j data freshness.
- Decision 5 (scrub rendering) depends on Decision 2 (client-side resolution) and Decision 4 (canvas renderer).
- Decision 7 (search) depends on Decision 3 (sync) to ensure Neo4j has current data to search against.
- Decision 4 (canvas + companion list) is independent of data-layer decisions and can be built in parallel.

---

## 5. Implementation Patterns & Consistency Rules

_These patterns supplement the project-wide rules in `project-context.md` (44 rules). They apply specifically to the Power Explorer feature and exist because multiple agents working on different stories (data model, graph renderer, search, Time Travel) could otherwise make incompatible choices._

### 5.1 Temporal Data Contracts

**The core consistency risk:** Three surfaces resolve Tenure data (client scrubber, server graph API, profile sheet). If their date handling doesn't match exactly, the graph and the profile sheet show different occupants for the same date.

**Date format in APIs:** ISO 8601 date strings (`YYYY-MM-DD`), no time component. Tenure start/end dates are date-precision, not timestamp-precision.

```typescript
// ✅ Correct
{ startDate: "1991-06-21", endDate: "1996-05-16" }

// ❌ Wrong — timestamp precision invites timezone bugs
{ startDate: "1991-06-21T00:00:00.000Z", endDate: "1996-05-16T23:59:59.999Z" }
```

**Approximate dates:** The `startDateApproximate: boolean` flag on the Tenure model is the *only* signal. When `true`, the date is a convention (January 1 of that year). Never invent an `approximateDate` string field or a `~` prefix — the flag is the contract.

**Resolution rules (must be identical in client JS and server Cypher):**
1. Start date is **inclusive** — on the exact start date, the new Tenure is active.
2. End date is **inclusive** — on the exact end date, the outgoing Tenure is still active (the successor starts the next day).
3. If no Tenure resolves for an Office on a given date, the Office is **vacant**.
4. If the date falls before the Office's earliest Tenure *and* no "established" date exists, the Office is **not-yet-established**.
5. If multiple Tenures overlap (data error), the one with the latest `startDate` wins.

**Parity testing:** Any PR that modifies either the client resolver or the Neo4j Cypher temporal query must include a shared test fixture: a JSON file of `{ date, positionId, expectedPersonId, expectedState }` tuples that both resolvers are validated against.

### 5.2 Graph Element Data Contracts

**Cytoscape Node data shape** — every Node element passed to Cytoscape must conform to this interface:

```typescript
interface GraphNodeData {
  id: string;                          // CUID from PG
  type: 'person' | 'office' | 'institution';
  label: string;                       // display name
  state: 'occupied' | 'vacant' | 'not-established' | 'discontinued';
  // Person-specific (present only when type === 'person')
  personId?: string;
  photoUrl?: string;
  partyAbbreviation?: string;          // maps to party-tag-* color
  partyTagSlot?: number;               // 1–6, or 0 for overflow
  // Office-specific
  positionId?: string;
  constitutionalBasis?: string;        // article number or "convention"
  // Tenure context (present when temporal resolution has run)
  tenureStartDate?: string;            // ISO date
  tenureEndDate?: string | null;
  tenureMechanism?: string;
  startDateApproximate?: boolean;
}
```

**Cytoscape Edge data shape:**

```typescript
interface GraphEdgeData {
  id: string;
  source: string;                      // source Node id
  target: string;                      // target Node id
  type: 'reports_to' | 'appoints' | 'supervises' | 'elected_from' | 'part_of';
  label: string;                       // human-readable relationship
  citationArticle?: string;            // constitutional article number
  citationId?: string;                 // ConstitutionArticle CUID for fetch
}
```

**Rule:** All graph API responses return `{ nodes: GraphNodeData[], edges: GraphEdgeData[] }`. The Cytoscape renderer maps these directly — no adapter layer that could silently reshape the contract.

### 5.3 API Response Shapes (Power Explorer endpoints)

All new endpoints follow the existing `{ data, total, limit, offset }` envelope for lists and `{ data }` for single resources. Power Explorer–specific additions:

**`GET /api/graph/temporal?date=YYYY-MM-DD&depth=2`**
```json
{
  "data": {
    "nodes": ["GraphNodeData[]"],
    "edges": ["GraphEdgeData[]"],
    "resolvedDate": "2014-05-26",
    "tenures": [{ "positionId": "...", "personId": "...", "startDate": "...", "endDate": "..." }]
  }
}
```
The `tenures` array is the preloadable Tenure table for client-side resolution (Decision 2). It's returned alongside the graph so the client can hydrate its Zustand store in one fetch.

**`GET /api/graph/expand?nodeId=<id>&date=YYYY-MM-DD`**
```json
{
  "data": {
    "nodes": ["GraphNodeData[]"],
    "edges": ["GraphEdgeData[]"]
  }
}
```
Returns only the 1-hop neighbors of the specified Node. Client merges into existing Cytoscape graph — duplicates (by `id`) are ignored.

**`GET /api/graph/search?q=<query>&date=YYYY-MM-DD&limit=20`**
```json
{
  "data": [{ "nodeId": "...", "label": "...", "type": "person|office|party", "score": 0.95 }],
  "total": 3
}
```

### 5.4 Neo4j Sync Event Contract

**Queue name:** `neo4j-sync`

**Event payload:**

```typescript
interface Neo4jSyncEvent {
  action: 'upsert' | 'delete';
  entityType: 'tenure' | 'person' | 'position' | 'institution';
  entityId: string;                    // PG CUID
  timestamp: string;                   // ISO 8601 with time
  data?: Record<string, unknown>;      // full entity fields for upsert
}
```

**Rules:**
- Events are fire-and-forget from the Prisma service layer — never `await` the BullMQ `.add()` in the request path.
- The sync worker is idempotent — `MERGE` in Cypher, never `CREATE`. Duplicate events produce the same result.
- Failed events retry 3 times with exponential backoff (BullMQ defaults), then dead-letter to `neo4j-sync-dlq`.

### 5.5 Neutrality Enforcement Patterns

**API-layer rules (agents implementing any Person/Office endpoint must follow):**

- **No sort by popularity, trending, or recency of media mentions.** Default sort for Person lists is alphabetical by `label`. Default graph layout is hierarchical by constitutional rank.
- **Identical response shape per entity type.** A `GraphNodeData` for PM has exactly the same fields as one for a junior minister. No `featured`, `highlight`, `importance`, or `weight` fields — ever.
- **Party-tag slot assignment is deterministic.** Alphabetical order of party abbreviation → slots 1–6. Slot 0 = overflow (7th+ party). This runs once per graph load. Agents must not hardcode party→slot mappings.
- **Accountability Data response shape is fixed.** Every Person response includes `{ criminalCases: number | null, declaredAssets: object | null, electionHistory: object[] | null, source: string, lastUpdated: string }` — `null` means "not available," never omitted.

### 5.6 Component Organization & Naming

**File structure for Power Explorer:**

```
src/components/power-explorer/
  PowerExplorerGraph.tsx          # Cytoscape canvas wrapper (client component)
  AccessibilityCompanionList.tsx  # Hidden <ul> for screen readers
  TimeTravel.tsx                  # Scrubber component
  ProfileSheet.tsx                # Bottom-sheet for Person/Office details
  CitationPanel.tsx               # Constitutional citation overlay
  SearchOverlay.tsx               # Graph-aware search UI
  GraphSkeleton.tsx               # Loading placeholder for dynamic import
  nodes/
    PersonNode.tsx                # Cytoscape node renderer config for Person
    OfficeNode.tsx                # Cytoscape node renderer config for Office
  hooks/
    useTenureResolver.ts          # Client-side date→Tenure resolution
    useGraphExpansion.ts          # Lazy-load Node neighbors
    useTimeTravel.ts              # Scrubber state + debounced server validation
```

**Naming conventions (Power Explorer–specific):**
- Zustand store: `usePowerExplorerStore` in `src/store/powerExplorerStore.ts` — one store for graph state, Tenure cache, active date, focused Node.
- Data-access functions: `src/lib/data/tenure.ts` — `getTenuresForPosition()`, `getTenuresForPerson()`, `getActiveTenure()`. Named exports, camelCase verbs, typed return values.
- GraphService extensions: new methods on the existing `GraphService` class — `getTemporalSubgraph(date, depth)`, `expandNode(nodeId, date)`, `searchGraph(query, date)`. Not new service classes.

### Enforcement Summary

**All AI agents implementing Power Explorer stories MUST:**
1. Use `GraphNodeData` / `GraphEdgeData` interfaces for all graph data — no ad-hoc shapes.
2. Follow the 5 temporal resolution rules exactly — in both client and server code.
3. Return ISO date strings (`YYYY-MM-DD`) for all Tenure dates — no timestamps.
4. Use the `neo4j-sync` event contract for all PG→Neo4j sync — no direct Neo4j writes from API routes.
5. Never add `featured`, `trending`, `weight`, `importance`, or any editorial-sort field to graph data.
6. Place Power Explorer components under `src/components/power-explorer/` — not scattered across other feature directories.

---

## 6. Project Structure & Boundaries

### 6.1 New Files & Directories (Power Explorer Delta)

The existing project structure (`src/app/`, `src/components/`, `src/lib/`, etc.) remains unchanged. Power Explorer adds:

```
prisma/
  schema.prisma                          # ← MODIFIED: add Tenure model
  migrations/
    YYYYMMDDHHMMSS_add_tenure_model/     # ← NEW: Tenure migration

src/
  app/
    power-structure/
      page.tsx                           # ← MODIFIED: replace PowerHierarchyExplorer with PowerExplorer
      loading.tsx                        # ← NEW: Suspense fallback (GraphSkeleton)
    api/
      graph/
        temporal/
          route.ts                       # ← NEW: GET /api/graph/temporal (FR-1, FR-7)
        expand/
          route.ts                       # ← NEW: GET /api/graph/expand (FR-2)
        search/
          route.ts                       # ← NEW: GET /api/graph/search (FR-8)

  components/
    power-explorer/                      # ← NEW directory (entire feature)
      PowerExplorerGraph.tsx             # Cytoscape canvas wrapper ("use client", ssr: false)
      AccessibilityCompanionList.tsx     # Hidden <ul> for screen-reader traversal
      TimeTravel.tsx                     # Scrubber component + date state
      ProfileSheet.tsx                   # Bottom-sheet: Person/Office details (FR-3, FR-4, FR-5)
      CitationPanel.tsx                  # Constitutional citation overlay (FR-6)
      SearchOverlay.tsx                  # Graph-aware search UI (FR-8)
      GraphSkeleton.tsx                  # Loading placeholder for dynamic import
      AccountabilityBlock.tsx            # Templatized accountability data (FR-5, §5)
      nodes/
        PersonNode.tsx                   # Cytoscape style config for Person nodes
        OfficeNode.tsx                   # Cytoscape style config for Office/Institution nodes
      hooks/
        useTenureResolver.ts             # Client-side date→Tenure resolution
        useGraphExpansion.ts             # Lazy-load 1-hop neighbors
        useTimeTravel.ts                 # Scrubber state + debounced server validation

  lib/
    data/
      tenure.ts                          # ← NEW: Prisma queries for Tenure model
    services/
      graph.service.ts                   # ← MODIFIED: add getTemporalSubgraph, expandNode, searchGraph

  store/
    powerExplorerStore.ts                # ← NEW: Zustand store for graph/Tenure/date state

  types/
    power-explorer.ts                    # ← NEW: GraphNodeData, GraphEdgeData, Neo4jSyncEvent interfaces

  worker/
    neo4j-sync.ts                        # ← NEW: BullMQ consumer for PG→Neo4j sync events
```

### 6.2 FR → File Mapping

| FR | Primary Files | Secondary Files |
|---|---|---|
| **FR-1** View power graph | `api/graph/temporal/route.ts`, `PowerExplorerGraph.tsx`, `graph.service.ts` | `powerExplorerStore.ts`, `GraphSkeleton.tsx` |
| **FR-2** Drill through connections | `api/graph/expand/route.ts`, `useGraphExpansion.ts`, `graph.service.ts` | `AccessibilityCompanionList.tsx` |
| **FR-3** Career path | `ProfileSheet.tsx`, `tenure.ts` | `useTimeTravel.ts` (tap career step → scrub) |
| **FR-4** Office powers | `ProfileSheet.tsx`, `CitationPanel.tsx` | Existing `/api/constitution` route |
| **FR-5** Accountability Data | `AccountabilityBlock.tsx`, `ProfileSheet.tsx` | `tenure.ts` (Person query includes accountability) |
| **FR-6** Citation inline | `CitationPanel.tsx` | Existing `/api/constitution/explain` route |
| **FR-7** Time Travel | `TimeTravel.tsx`, `useTenureResolver.ts`, `useTimeTravel.ts`, `api/graph/temporal/route.ts` | `powerExplorerStore.ts`, `neo4j-sync.ts` |
| **FR-8** Search | `SearchOverlay.tsx`, `api/graph/search/route.ts`, `graph.service.ts` | `powerExplorerStore.ts` |

### 6.3 Architectural Boundaries

**API Boundary (server ↔ client):**

```
Client (browser)                          Server (Next.js API routes)
─────────────────                         ──────────────────────────
PowerExplorerGraph.tsx ──GET──→  /api/graph/temporal   → GraphService.getTemporalSubgraph()
useGraphExpansion.ts   ──GET──→  /api/graph/expand     → GraphService.expandNode()
SearchOverlay.tsx      ──GET──→  /api/graph/search     → GraphService.searchGraph()
ProfileSheet.tsx       ──GET──→  /api/representatives  → existing Prisma queries
CitationPanel.tsx      ──GET──→  /api/constitution     → existing Prisma queries
useTimeTravel.ts       ──GET──→  /api/graph/temporal   → validation on scrub release
```

All three new API routes follow the project convention: Zod validation, try-catch, pagination where applicable.

**Service Boundary (API routes ↔ data):**

```
API Routes                     Service Layer                Data Layer
──────────                     ─────────────                ──────────
/api/graph/temporal  ────→  GraphService (Neo4j)  ←────  Neo4j HOLDS_POSITION edges
/api/graph/expand    ────→  GraphService (Neo4j)  ←────  Neo4j neighbor traversal
/api/graph/search    ────→  GraphService (Neo4j)  ←────  Neo4j fulltext index
/api/representatives ────→  tenure.ts (Prisma)    ←────  PG Tenure + Person tables
                            ↑
                            │ sync events
                            │
neo4j-sync.ts worker ←── BullMQ queue ←── tenure.ts (on write)
```

API routes never call Neo4j or Prisma directly — they go through `GraphService` (for graph queries) or `src/lib/data/tenure.ts` (for relational queries).

**Data Boundary (PG ↔ Neo4j):**

```
PostgreSQL (source of truth)              Neo4j (derived projection)
────────────────────────────              ────────────────────────────
Tenure model (new)              ──sync──→  HOLDS_POSITION edges (existing)
Person model (existing)         ──sync──→  Person nodes (existing)
Position model (existing)       ──sync──→  Position nodes (existing)
Institution model (existing)    ──sync──→  Institution nodes (existing)
```

Sync direction is one-way: PG → Neo4j only. Neo4j is never written to directly from application code — only via the `neo4j-sync` worker.

**Component Boundary (frontend):**

```
PowerExplorerGraph (canvas)
  ├── reads from: usePowerExplorerStore (graph state, active date, focused node)
  ├── writes to: usePowerExplorerStore (on node tap, graph expansion)
  ├── emits Cytoscape events to: AccessibilityCompanionList
  └── triggers: useGraphExpansion (lazy load)

TimeTravel (scrubber)
  ├── reads from: usePowerExplorerStore (active date, tenure cache)
  ├── writes to: usePowerExplorerStore (date changes)
  ├── calls: useTenureResolver (client-side resolution during drag)
  └── calls: useTimeTravel (server validation on release)

ProfileSheet / CitationPanel / SearchOverlay
  ├── reads from: usePowerExplorerStore (focused node, active date)
  ├── fetches independently from: API routes (not through the store)
  └── writes to: usePowerExplorerStore (search result selection → graph centering)
```

All components share state through `usePowerExplorerStore`. Each component owns its own fetch lifecycle.

### 6.4 Data Flow: Time Travel Scrub (end-to-end)

```
1. User drags scrubber          → TimeTravel.tsx updates date in usePowerExplorerStore
2. Store date change            → useTenureResolver.ts resolves Tenure per Office (client-side)
3. Resolved tenures             → PowerExplorerGraph.tsx batch-updates Cytoscape node data
4. Cytoscape re-renders         → canvas updates at 60fps
5. User releases scrubber       → useTimeTravel.ts fires GET /api/graph/temporal?date=YYYY-MM-DD
6. Server responds              → usePowerExplorerStore updates with authoritative graph
7. Any discrepancies            → Cytoscape corrects (covered by time-rewind animation)
8. AccessibilityCompanionList   → re-reads focused node's connections from updated store
```

### 6.5 Data Flow: Node Expansion (end-to-end)

```
1. User taps a Node             → PowerExplorerGraph.tsx sets focusedNodeId in store
2. useGraphExpansion fires      → GET /api/graph/expand?nodeId=X&date=YYYY-MM-DD
3. Server returns neighbors     → { nodes: GraphNodeData[], edges: GraphEdgeData[] }
4. Store merges new elements    → usePowerExplorerStore adds nodes/edges (dedup by id)
5. Cytoscape re-renders         → graph-traverse animation to new focal node
6. CompanionList updates        → new focused node's connections announced to screen reader
7. ProfileSheet opens           → fetches Person/Office detail from /api/representatives
```

---

## 7. Architecture Validation Results

### 7.1 Coherence Validation ✅

**Decision Compatibility:**
- Tenure model (D1) ↔ Hybrid resolution (D2): Compatible — Prisma model is the data source; client receives a serialized subset with identical fields/types.
- Hybrid resolution (D2) ↔ Redis sync (D3): Compatible — client snapshot loaded at init; Neo4j kept current by sync worker for server validation on scrub release. Seconds-level eventual consistency acceptable for cabinet-level data.
- Canvas renderer (D4) ↔ Continuous scrub (D5): Compatible — canvas is the only path fast enough for batch `ele.data()` updates at 60fps.
- Neo4j search (D7) ↔ Redis sync (D3): Compatible — search queries Neo4j, kept current by sync worker.
- No contradictory decisions found.

**Pattern Consistency:**
- Temporal resolution rules (§5.1) specified as identical across client/server with parity testing requirement.
- `GraphNodeData`/`GraphEdgeData` (§5.2) are the single data contract for all graph surfaces.
- Naming conventions (§5.6) align with project-context.md (PascalCase components, camelCase functions, `@/*` imports).
- API response shapes (§5.3) follow existing `{ data }` envelope convention.

**Structure Alignment:**
- File structure (§6.1) places all files in convention-matching locations.
- Component boundaries (§6.3) use `usePowerExplorerStore` as single shared-state surface.
- Service boundary follows existing pattern: API routes → `GraphService`/`tenure.ts` → databases.

### 7.2 Requirements Coverage ✅

| FR | Supported | Decision(s) | Implementation |
|---|---|---|---|
| FR-1 View graph | ✅ | D1, D2, D4 | `/api/graph/temporal` + Cytoscape canvas |
| FR-2 Drill connections | ✅ | D4 | `/api/graph/expand` + `useGraphExpansion` |
| FR-3 Career path | ✅ | D1 | `tenure.ts` queries, `ProfileSheet.tsx` |
| FR-4 Office powers | ✅ | — | Existing `/api/constitution` reused |
| FR-5 Accountability | ✅ | — | `AccountabilityBlock.tsx`, fixed response shape (§5.5) |
| FR-6 Citation inline | ✅ | — | `CitationPanel.tsx`, existing `/api/constitution/explain` |
| FR-7 Time Travel | ✅ | D1, D2, D3, D5 | End-to-end data flow (§6.4) |
| FR-8 Search | ✅ | D7 | `/api/graph/search` + Neo4j fulltext |

| NFR | Addressed | How |
|---|---|---|
| Performance (load) | ✅ | Code-splitting (D6), SSR shell + dynamic graph |
| Performance (scrub) | ✅ | Client resolution (D2), canvas (D4), fallback (D5) |
| Neutrality | ✅ | API enforcement (§5.5), deterministic party-tag slots |
| Source-verifiability | ✅ | Accountability response includes `source` + `lastUpdated` |
| Accessibility | ✅ | Companion DOM list (D4), ARIA live-region, 44px targets |

### 7.3 Gap Analysis

**Critical Gaps: NONE**

**Important Gaps (non-blocking):**

| # | Gap | Recommendation |
|---|---|---|
| 1 | No test harness exists (vitest unconfigured, zero test files). Parity testing for Tenure resolver has no infrastructure to land in. | First implementation story includes vitest config scaffolding. |
| 2 | Historical Tenure dataset doesn't exist (PRD OQ#3 unresolved). Architecture supports both 1947 and ~1990 start dates. | Treat data sourcing as parallel workstream. Architecture is data-agnostic. |
| 3 | `Position.currentHolderId` migration path not specified. Existing code reads this FK; removing it requires a migration story. | Add story: replace `currentHolderId` reads with `getActiveTenure()`, then drop FK. |
| 4 | Cache invalidation for temporal queries unspecified. GraphService LRU is useless for continuous scrub (unique date per frame). | Pattern rule: temporal endpoints bypass LRU cache. Cache useful only for static structural queries. |

### 7.4 Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### 7.5 Readiness Assessment

**Overall Status: READY FOR IMPLEMENTATION**

All 16 checklist items checked. No critical gaps. 4 important gaps identified — none block implementation.

**Confidence Level: HIGH**

**Key Strengths:**
- Hybrid temporal resolution (D2) makes continuous scrub physically possible while maintaining server-authoritative consistency.
- One-way PG→Neo4j sync (D3) uses existing BullMQ infrastructure with clear failure/retry path.
- Companion DOM list (D4) solves accessibility without compromising canvas performance.
- Implementation sequence (§4) gives agents a dependency-aware build order.

**Areas for Future Enhancement:**
- Redis-backed GraphService cache (needed before horizontal scaling, not for demo)
- Streaming for profile-sheet data (reduces perceived latency for long career paths)
- State-level graph expansion (PRD §8.2 — architecture supports it, not specified here)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions (§4) exactly as documented
- Use `GraphNodeData`/`GraphEdgeData` interfaces (§5.2) for all graph data
- Follow the 5 temporal resolution rules (§5.1) in both client and server code
- Place all Power Explorer files in the structure defined in §6.1
- Temporal graph endpoints bypass the GraphService LRU cache

**First Implementation Priority:**
1. Scaffold vitest config (project-wide gap)
2. Add `Tenure` model to `prisma/schema.prisma` + migration
3. Replace `Position.currentHolderId` reads with `getActiveTenure()`
4. Implement `neo4j-sync` worker for Tenure events
