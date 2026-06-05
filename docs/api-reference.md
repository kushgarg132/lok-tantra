# API Reference

LokTantra exposes REST API routes at `/api/*`. All routes are implemented as Next.js Route Handlers.

## Conventions

### Response Envelope

All list endpoints return:
```json
{ "data": [...], "total": 100, "limit": 50, "offset": 0 }
```

Single-resource and aggregate endpoints return:
```json
{ "data": { ... } }
```

Error responses:
```json
{ "error": "Human-readable message", "details": [...] }
```
HTTP status codes: `400` (bad input), `401` (unauthenticated), `403` (forbidden), `429` (rate limited), `500` (server error).

### Pagination

All list endpoints accept:

| Param | Type | Default | Max | Description |
|-------|------|---------|-----|-------------|
| `limit` | integer | 50 | 100 | Records per page |
| `offset` | integer | 0 | — | Records to skip |

### Rate Limiting

| Route class | Limit | Window |
|-------------|-------|--------|
| `/api/assistant` | 10 req | 60s |
| `/api/search` | 60 req | 60s |
| `/api/admin/*` | 300 req | 60s |
| `/api/*` (general) | 200 req | 60s |

Rate-limited responses return HTTP 429 with `Retry-After: 60` header.

---

## Core Data APIs

### `GET /api/institutions`

Retrieves institutional nodes from the governance hierarchy.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | Fetch a single institution by slug (returns full detail with positions and children) |
| `level` | string | Filter by level (e.g., `union`, `state`, `local`) |
| `branch` | `legislative \| executive \| judicial \| independent` | Filter by branch |
| `q` | string (max 200) | Full-text search on name and description |
| `limit` | integer | Default 50, max 100 |
| `offset` | integer | Default 0 |

**Response** (list): `{ data: Institution[], total, limit, offset }`  
**Response** (slug): `{ data: Institution }` — includes `children` (up to 20), `parent`, `positions` (up to 10, each with `currentHolder` and party).

---

### `GET /api/constitution`

Retrieves constitutional content.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `type` | `parts \| amendments \| cases \| writs` | Selects the content type (default: articles) |
| `q` | string (max 200) | Search query (applies to title, text, number for articles; name/summary for cases; description for amendments) |
| `category` | string | Filter articles by category (e.g., `fundamental_rights`, `dpsp`) |
| `limit` | integer | Default 50, max 100 |
| `offset` | integer | Default 0 |

**Note**: Article list responses intentionally omit `text` (full article body) to reduce payload size. Fetch a single article via its `id` through a dedicated endpoint or include it via the `/api/constitution/explain` route.

---

### `GET /api/elections`

Retrieves election data.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `type` | `current \| party-results \| history \| states` | Selects data type |
| `year` | integer (1952–2030) | Filter `current`/`party-results` to a specific election year |

**Responses by type**:
- `current` / `party-results` → `{ data: PartyElectionResult[] }` (sorted by seats desc)
- `history` → `{ data: ElectionSummary[] }` (all Lok Sabha elections asc)
- `states` → `{ data: StateUT[] }` (sorted by LS seats desc)
- *(no type)* → `{ data: { history, partyResults, states } }` — aggregate (partyResults capped at 500)

---

### `GET /api/representatives`

Retrieves MPs and MLAs.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `id` | CUID | Fetch a single representative by ID (returns full detail with party and current position) |
| `state` | string | Filter by state name |
| `party` | string | Filter by party name or abbreviation |
| `chamber` | `lok_sabha \| rajya_sabha \| state_assembly \| state_council` | Filter by chamber |
| `q` | string (max 200) | Search name, constituency, state, designation |
| `limit` | integer | Default 50, max 100 |
| `offset` | integer | Default 0 |

**Response** (list): `{ data: PersonSummary[], total, limit, offset }` — includes `party` (id, name, abbreviation, color).  
**Response** (id): `{ data: Person }` — includes `party` and `currentPosition.institution`.

---

### `GET /api/parties`

Retrieves political party profiles.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `abbr` | string (max 20) | Fetch a single party by abbreviation (returns up to 50 members) |
| `type` | `ideology` | Returns the ideology spectrum instead of parties |

**Response** (list): `{ data: PartySummary[] }` — includes `_count.members`, excludes full member list.  
**Response** (abbr): `{ data: PoliticalParty }` — includes up to 50 members (id, name, designation, constituency, state, thumbnailUrl).

---

### `GET /api/judiciary`

Retrieves judicial entities.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `type` | `courts \| cases \| writs` | Selects content type (default: all three combined) |
| `limit` | integer | Default 100, max 200 (applies to cases) |
| `offset` | integer | Default 0 |

**Response** (type=cases): `{ data: LandmarkCase[], total, limit, offset }` — each case includes `court` (id, name, type) and `articlesInterpreted` (id, number, title).

---

### `GET /api/timeline`

Retrieves political history events.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `category` | `constitution \| elections \| legislation \| judiciary \| foreign_policy \| emergency \| governance \| independence` | Filter by category |
| `limit` | integer | Default 200, max 500 |
| `offset` | integer | Default 0 |

**Response**: `{ data: TimelineEvent[], total, limit, offset }`

---

### `GET /api/learn`

Retrieves learning paths and modules.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `slug` | string (max 100) | Fetch a single learning path with all modules |

**Response** (slug): `{ data: LearningPath }` — includes modules ordered by `order`.  
**Response** (list): `{ data: LearningPath[] }` — all paths with modules ordered by `estimatedHours`.

---

## Search API

### `GET /api/search`

Unified search across all entity types using Elasticsearch.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query (required) |
| `type` | string | Optional entity type filter |
| `domain` | string | Optional domain filter |

**Response**: `{ hits: SearchResult[], total, took, query, domains, intent?, answer? }`

---

## AI / RAG API

### `POST /api/assistant`

Generates a civic governance response via Anthropic Claude with RAG retrieval.

**Auth**: Optional — authenticated users receive higher rate limits.

**Request body**
```json
{
  "message": "What is Article 21?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

| Field | Type | Constraints |
|-------|------|------------|
| `message` | string | Required; 1–2000 chars |
| `history` | array | Optional; max 12 turns; each turn has `role` and `content` |

**Response**
```json
{
  "answer": "Article 21 guarantees the Right to Life and Personal Liberty...",
  "sources": ["Article 21, Constitution of India", "Maneka Gandhi v. Union of India (1978)"],
  "disclaimer": "LokTantra provides constitutionally grounded, politically neutral civic information."
}
```

**Error responses**: 400 (invalid JSON or schema), 429 (rate limit), 500 (generation failure).

**Note**: Responses are not currently streamed — the full response is buffered before returning. Streaming via SSE is on the roadmap (see AUDIT.md).

---

### `GET /api/constitution/explain`

Generates a simplified, politically neutral explanation of a specific constitutional article using Claude.

**Query params**: article `id` or `number`.

---

## Graph APIs

### `GET /api/graph/hierarchy`

Returns the Neo4j institutional hierarchy subgraph for a given institution.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Institution ID |
| `depth` | integer | Traversal depth (default 3, max 5) |

**Response**: `{ data: GraphPath[] }`

---

### `GET /api/graph/path`

Returns the shortest path between two nodes in the governance graph.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `from` | string | Start node ID |
| `to` | string | End node ID |

**Response**: `{ data: GraphPath[] }` — path bounded to max 6 hops.

---

## Admin APIs (ADMIN role required)

All admin routes are protected by the middleware ADMIN role check. Requests without a valid ADMIN session token receive HTTP 403.

### `GET /api/admin/audit`

Returns paginated audit log entries.

**Query params**: `limit` (default 50), `offset`, `action`, `userId`, `resource`.

### `GET /api/admin/observability`

Returns scraper health, data freshness, active alerts, queue depths, and run counters in one response.

### `GET /api/admin/observability/logs`

Streams recent log entries from Redis (`obs:logs` list).

**Query params**: `limit` (max 500), `level`, `source`.

### `GET /api/admin/observability/alerts`

Returns active and historical alert evaluations.

### `POST /api/admin/observability/recovery`

Triggers manual queue recovery for a stalled ETL source.

### `GET /api/admin/observability/diagnostics`

Returns system diagnostics (database connectivity, Redis ping, Elasticsearch status).

---

## Moderation APIs

### `GET /api/moderation/queue`

Returns content flags pending review. Requires MODERATOR or ADMIN role.

**Query params**: `status`, `reason`, `limit` (default 50), `offset`.

### `POST /api/moderation/flag`

Submits a content flag from any user.

**Request body**: `{ contentType, contentId, reason, details?, contentSnippet? }`.

---

## Auth APIs

### `GET/POST /api/auth/[...nextauth]`

Standard NextAuth.js handlers for OAuth sign-in, sign-out, session, and CSRF.

### `POST /api/auth/register`

Email/password registration.

**Request body**: `{ name, email, password }`. Returns `{ message: "Account created" }`.

---

## Utility APIs

### `GET /api/health`

Returns service health status for load balancer probes and monitoring.

**Response**: `{ status: "ok" | "degraded" | "down", version, checks: { db, redis, ... }, ts }`.

No auth required. Used by Kubernetes liveness and readiness probes.

### `GET /api/sources/verify`

Returns trusted data source status.

### `GET/DELETE /api/media/entity/[type]/[id]`

Media asset management for an entity.

### `POST /api/media/ingest`

Triggers a media ingestion job for an entity. Requires auth.
