# Neo4j Governance Ontology

While PostgreSQL acts as the definitive system of record, Neo4j models the dense web of Indian governance relationships. This "Graph-First" design allows complex queries like mapping the shortest path of influence between two politicians or discovering how a constitutional article was interpreted across different landmark cases over time.

## 1. Node Labels

Nodes represent the core entities in the governance system.

| Label | Description | Primary Key Property |
|---|---|---|
| `Person` | Any politician, judge, or bureaucrat | `id` (matches PG cuid) |
| `Party` | Political party | `id` |
| `Constituency`| Electoral district boundary | `id` |
| `State` | State or Union Territory | `id` |
| `District` | Administrative district | `id` |
| `Institution` | Branch, level, or body of government | `id` |
| `Ministry` | Union or State Ministry | `id` |
| `Department` | Sub-division of a Ministry | `id` |
| `Committee` | Legislative or Executive committee | `id` |
| `Position` | Specific role (e.g., "Prime Minister") | `id` |
| `Election` | A specific election event | `id` |
| `Article` | Constitution Article | `id` |
| `Amendment` | Constitutional Amendment | `id` |
| `Bill` | Proposed legislation | `id` |
| `Act` | Enacted law | `id` |
| `Court` | Judicial body | `id` |
| `Case` | Landmark Supreme Court or High Court case | `id` |

---

## 2. Relationship Types (Edges)

Edges define how entities interact. Edges frequently carry properties for temporal versioning (`startDate`, `endDate`), enabling point-in-time graph traversal.

### 2.1 Power & Hierarchy Dynamics

| Relationship | Source | Target | Temporal Properties | Description |
|---|---|---|---|---|
| `APPOINTS` | `Position` | `Position` | — | Who has the power to appoint whom |
| `REMOVES` | `Position` | `Position` | — | Who has the power to remove whom |
| `SUPERVISES` | `Position` | `Position` | — | Direct oversight chain |
| `REPORTS_TO` | `Institution`| `Institution`| — | Institutional hierarchy |
| `PART_OF` | `Position` | `Institution`| — | Linking roles to bodies |
| `HEADS_MINISTRY`| `Position` | `Ministry` | `startDate`, `endDate` | Executive leadership |
| `MEMBER_OF` | `Person` | `Committee` | `startDate`, `endDate` | Committee assignments |
| `HOLDS_POSITION`| `Person` | `Position` | `startDate`, `endDate` | Tracks term limits |

### 2.2 Legislative & Judicial Dynamics

| Relationship | Source | Target | Temporal Properties | Description |
|---|---|---|---|---|
| `INTRODUCED` | `Person` | `Bill` | `date` | Legislative authorship |
| `BECAME_ACT` | `Bill` | `Act` | `dateEnacted` | Legislative success |
| `MODIFIED_ARTICLE`|`Amendment` | `Article` | `action` (Insert/Repeal) | Constitutional changes |
| `INTERPRETED` | `Case` | `Article` | `significance` | Case law affecting rights |
| `STRUCK_DOWN` | `Case` | `Act` | `date` | Judicial review outcomes |
| `DECIDED_BY` | `Case` | `Court` | `dateDecided` | Venue of the ruling |
| `JUDICIAL_REVIEW_OVER` | `Court` | `Institution` | — | Checks and balances |

### 2.3 Electoral & Political Dynamics

| Relationship | Source | Target | Temporal Properties | Description |
|---|---|---|---|---|
| `BELONGS_TO` | `Person` | `Party` | `startDate`, `endDate` | Tracks party switching |
| `ELECTED_FROM`| `Person` | `Constituency`| `year`, `votes`, `margin`| Electoral victories |
| `HELD_IN` | `Election` | `Constituency`| — | Link election events |
| `ALLIED_WITH` | `Party` | `Party` | `startDate`, `endDate` | Tracks coalitions (NDA/INDIA) |
| `LOCATED_IN` | `Constituency`| `State` | — | Geographical mapping |

---

## 3. Key Graph Traversal Queries (Cypher)

These queries drive the interactive features in the `src/components/graph/` client-side visualizations.

### 3.1 Trace the Power of Appointment
"Show me every position that the President of India has the constitutional power to appoint."
```cypher
MATCH (p:Position {title: "President of India"})-[:APPOINTS]->(target:Position)
RETURN target.title
```

### 3.2 Constitutional Case Law Discovery
"Which articles were interpreted by cases that struck down an Act?"
```cypher
MATCH (a:Article)<-[:INTERPRETED]-(c:Case)-[:STRUCK_DOWN]->(act:Act)
RETURN a.number, c.name, act.title
```

### 3.3 Temporal Coalition and Defection Tracker
"Find politicians who switched parties between 2014 and 2024, and trace their electoral victories."
```cypher
MATCH (person:Person)-[mem1:BELONGS_TO]->(party1:Party),
      (person)-[mem2:BELONGS_TO]->(party2:Party)
WHERE party1 <> party2
  AND mem1.endDate > date("2014-01-01") 
  AND mem2.startDate < date("2024-12-31")
MATCH (person)-[elec:ELECTED_FROM]->(c:Constituency)
RETURN person.name, party1.name, party2.name, c.name, elec.year
```

### 3.4 Governance Hierarchy Subgraph
"Generate the hierarchical tree for the Union Executive branch."
```cypher
MATCH path = (root:Institution {branch: "EXECUTIVE", level: "UNION"})<-[:REPORTS_TO*]-(child:Institution)
RETURN path
```

---

## 4. Neo4j Indexing Strategy

To guarantee rapid traversal across the 100k+ nodes and 500k+ edges in production:

```cypher
// Uniqueness constraints
CREATE CONSTRAINT ON (p:Person) ASSERT p.id IS UNIQUE;
CREATE CONSTRAINT ON (i:Institution) ASSERT i.id IS UNIQUE;
CREATE CONSTRAINT ON (c:Constituency) ASSERT c.id IS UNIQUE;
CREATE CONSTRAINT ON (a:Article) ASSERT a.id IS UNIQUE;

// Full-text search index for fast entity lookups before traversal
CREATE FULLTEXT INDEX entity_names FOR (n:Person|Party|Institution|Bill|Act|Case) ON EACH [n.name, n.title];
```
