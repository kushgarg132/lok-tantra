# Neo4j Governance Ontology

While PostgreSQL is the definitive source of record, Neo4j models the dense web of Indian governance relationships. This "graph-first" layer enables complex queries like tracing the shortest path of constitutional influence between two politicians, or discovering how a specific article was interpreted across landmark cases over time.

**Important**: All Cypher queries using variable-length paths must specify a maximum hop count. Use `[*..N]` — never bare `[*]`. The `GraphService` enforces this (default max hops: 6).

---

## 1. Node Labels

Each node type maps to its PostgreSQL counterpart by `id` (CUID).

| Label | Description | PG Model |
|-------|-------------|----------|
| `Person` | Politician, judge, or senior bureaucrat | `Person` |
| `Party` | Political party | `PoliticalParty` |
| `Constituency` | Electoral district boundary | `Constituency` |
| `State` | State or Union Territory | `StateUT` |
| `District` | Administrative district | `District` |
| `Institution` | Government body (branch, department, tribunal, commission) | `Institution` |
| `Ministry` | Union or State Ministry | `Ministry` |
| `Department` | Sub-division of a Ministry | `Department` |
| `Committee` | Legislative or executive committee | `Committee` |
| `Position` | Specific role (e.g., "Prime Minister of India") | `Position` |
| `Election` | An election event | `Election` |
| `Article` | Constitutional article | `ConstitutionArticle` |
| `Amendment` | Constitutional amendment | `Amendment` |
| `Bill` | Proposed legislation | `Bill` |
| `Act` | Enacted law | `Act` |
| `Court` | Judicial body | `Court` |
| `Case` | Landmark judicial case | `LandmarkCase` |

---

## 2. Relationship Types (Edges)

Edges are the core of the governance graph. Temporal edges carry `startDate` and `endDate` properties for point-in-time traversal.

### 2.1 Power & Hierarchy

| Relationship | Source → Target | Temporal | Description |
|---|---|---|---|
| `APPOINTS` | `Position` → `Position` | — | Constitutional power of appointment |
| `REMOVES` | `Position` → `Position` | — | Constitutional power of removal |
| `SUPERVISES` | `Position` → `Position` | — | Direct oversight chain |
| `REPORTS_TO` | `Institution` → `Institution` | — | Institutional hierarchy |
| `PART_OF` | `Position` → `Institution` | — | Linking roles to bodies |
| `HEADS_MINISTRY` | `Position` → `Ministry` | `startDate, endDate` | Executive leadership |
| `MEMBER_OF` | `Person` → `Committee` | `startDate, endDate` | Committee assignments |
| `HOLDS_POSITION` | `Person` → `Position` | `startDate, endDate` | Tracks who holds a role over time |
| `ADMINISTRATIVE_CONTROL_OVER` | `Ministry` → `Department` | — | Ministry controls department |

### 2.2 Legislative & Judicial

| Relationship | Source → Target | Temporal | Description |
|---|---|---|---|
| `INTRODUCED` | `Person` → `Bill` | `date` | Bill authorship |
| `BECAME_ACT` | `Bill` → `Act` | `dateEnacted` | Legislative success |
| `MODIFIED_ARTICLE` | `Amendment` → `Article` | `action` (Insert/Repeal) | Constitutional changes |
| `INTERPRETED` | `Case` → `Article` | `significance` | Case law impact on articles |
| `STRUCK_DOWN` | `Case` → `Act` | `date` | Judicial review outcomes |
| `DECIDED_BY` | `Case` → `Court` | `dateDecided` | Venue of the ruling |
| `JUDICIAL_REVIEW_OVER` | `Court` → `Institution` | — | Checks and balances |

### 2.3 Electoral & Political

| Relationship | Source → Target | Temporal | Description |
|---|---|---|---|
| `BELONGS_TO` | `Person` → `Party` | `startDate, endDate` | Party membership (tracks defections) |
| `ELECTED_FROM` | `Person` → `Constituency` | `year, votes, margin` | Electoral victories |
| `HELD_IN` | `Election` → `Constituency` | — | Link election events to constituencies |
| `ALLIED_WITH` | `Party` → `Party` | `startDate, endDate` | Coalition tracking (NDA, INDIA Alliance) |
| `LOCATED_IN` | `Constituency` → `State` | — | Geographical mapping |
| `GOVERNS` | `Department` → entity | — | Administrative jurisdiction |

---

## 3. Key Cypher Query Patterns

All examples use bounded path lengths — adjust `N` for your depth requirement but never omit the limit.

### 3.1 Trace Appointment Power
"Show every position the President of India can constitutionally appoint."
```cypher
MATCH (p:Position {title: "President of India"})-[:APPOINTS]->(target:Position)
RETURN target.title
ORDER BY target.title
```

### 3.2 Constitutional Case Law Discovery
"Which articles were interpreted by cases that struck down an Act?"
```cypher
MATCH (a:Article)<-[:INTERPRETED]-(c:Case)-[:STRUCK_DOWN]->(act:Act)
RETURN a.number, c.name, act.title
ORDER BY c.name
```

### 3.3 Defection and Coalition Tracker
"Find politicians who switched parties between 2014 and 2024."
```cypher
MATCH (person:Person)-[mem1:BELONGS_TO]->(party1:Party),
      (person)-[mem2:BELONGS_TO]->(party2:Party)
WHERE party1 <> party2
  AND mem1.endDate > date("2014-01-01")
  AND mem2.startDate < date("2024-12-31")
OPTIONAL MATCH (person)-[elec:ELECTED_FROM]->(c:Constituency)
RETURN person.name, party1.name, party2.name, c.name, elec.year
ORDER BY person.name
```

### 3.4 Governance Hierarchy Subgraph
"Generate the institutional tree for the Union Executive."
```cypher
MATCH path = (root:Institution {branch: "EXECUTIVE", level: "UNION"})<-[:REPORTS_TO*1..3]-(child:Institution)
RETURN path
```

### 3.5 Shortest Governance Path (Bounded)
"What is the shortest relationship path between two politicians?"
```cypher
MATCH (start {id: $startId}), (end {id: $endId})
MATCH path = shortestPath((start)-[*..6]-(end))
RETURN path
```
Note: `GraphService.getShortestPath()` enforces the `[*..6]` bound automatically. The hard ceiling is 10 hops.

### 3.6 Point-in-Time Role Query
"Who held the position of Prime Minister on 1 January 2020?"
```cypher
MATCH (person:Person)-[role:HOLDS_POSITION]->(pos:Position {title: "Prime Minister of India"})
WHERE role.startDate <= date("2020-01-01")
  AND (role.endDate IS NULL OR role.endDate >= date("2020-01-01"))
RETURN person.name, role.startDate, role.endDate
```

---

## 4. Required Neo4j Indexes

Run these Cypher statements on the Neo4j database at setup (before loading data). These are not automatically created — they must be applied manually or via a startup script.

```cypher
// Uniqueness constraints (also create implicit indexes)
CREATE CONSTRAINT person_id    IF NOT EXISTS FOR (p:Person)       REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT inst_id      IF NOT EXISTS FOR (i:Institution)  REQUIRE i.id IS UNIQUE;
CREATE CONSTRAINT position_id  IF NOT EXISTS FOR (p:Position)     REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT party_id     IF NOT EXISTS FOR (p:Party)        REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT constituency_id IF NOT EXISTS FOR (c:Constituency) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT article_id   IF NOT EXISTS FOR (a:Article)      REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT court_id     IF NOT EXISTS FOR (c:Court)        REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT case_id      IF NOT EXISTS FOR (c:Case)         REQUIRE c.id IS UNIQUE;

// Full-text index for entity name lookups before traversal
CREATE FULLTEXT INDEX entity_names IF NOT EXISTS
  FOR (n:Person|Party|Institution|Bill|Act|Case|Position)
  ON EACH [n.name, n.title];

// Range index for temporal edge queries
CREATE INDEX belongs_to_start IF NOT EXISTS FOR ()-[r:BELONGS_TO]-() ON (r.startDate);
CREATE INDEX holds_position_dates IF NOT EXISTS FOR ()-[r:HOLDS_POSITION]-() ON (r.startDate, r.endDate);
```

**Note**: Without the uniqueness constraints, repeated sync runs will create duplicate nodes rather than updating existing ones.

---

## 5. Graph Service (`src/lib/services/graph.service.ts`)

All Neo4j interactions go through `GraphService`. Key behaviors:

- **LRU cache**: 500-entry in-memory cache with 30-minute TTL. Expired entries are pruned on access.
- **Bounded paths**: All traversal methods use explicit hop limits. `getShortestPath()` defaults to 6 hops, accepts `maxHops` option (ceiling: 10).
- **Session management**: Each query opens a read-only Neo4j session and closes it in a `finally` block.
- **Error handling**: Database errors are caught and rethrown as generic "Failed to execute graph query" to prevent Neo4j internals leaking to API callers.

---

## 6. Graph Sync Strategy

**Current state**: Neo4j is seeded manually from PostgreSQL data during initial setup. There is no automated real-time sync.

**Planned (Phase 3)**: When a PostgreSQL entity is mutated (via ETL or admin action), a Redis event is published. A sync worker subscribes to these events and updates the corresponding Neo4j nodes and edges. This will keep the graph projection eventually consistent with the source of truth.
