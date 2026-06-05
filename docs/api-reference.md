# Internal API Reference

LokTantra relies on Next.js Route Handlers (`/api/*`) for client-side interactions (like search and filtering) and Server-Sent Events (SSE) for real-time updates.

> **Note**: Server Components query the database directly via the Service Layer. These API routes are purely for Client Components (islands of interactivity).

## 1. Core Data APIs (REST GET)

All core data APIs follow a standard response envelope:
`{ "data": [...], "total": 100, "meta": { ... } }`

### `GET /api/institutions`
Retrieves institutional hierarchies.
- **Params**: `level` (union/state/local), `branch` (exec/leg/jud), `q` (search)

### `GET /api/constitution`
Retrieves articles, amendments, and cases.
- **Params**: `type` (parts/amendments/cases), `category`

### `GET /api/elections`
Retrieves election summaries and constituency results.
- **Params**: `year`, `type` (ls/vs)

### `GET /api/representatives`
Retrieves MP/MLA details.
- **Params**: `state`, `party`, `chamber` (ls/rs/vs)

---

## 2. Graph & Search APIs [NEW]

### `GET /api/search` (Unified Search)
Searches across all entity types simultaneously using ElasticSearch.
- **Params**: `q` (query string), `type` (optional filter)
- **Response**: Array of `{ id, type, title, snippet, score }`

### `GET /api/graph/traverse`
Executes pre-defined Neo4j traversals (e.g., shortest path, appointment chains).
- **Params**: `fromId`, `toId`, `traversalType`

---

## 3. AI & RAG APIs [NEW]

### `POST /api/ai/chat`
Streaming endpoint for the AI Chatbot.
- **Body**: `{ "messages": [...], "contextFilters": {} }`
- **Response**: Server-Sent Events (SSE) stream of text tokens.

### `POST /api/ai/explain`
Generates a simplified, politically neutral explanation of a specific entity.
- **Body**: `{ "entityId": "art-356", "level": "beginner" }`
- **Response**: JSON with the simplified text and source citations.

---

## 4. Live / Real-Time APIs [NEW]

### `GET /api/live/feed`
An SSE endpoint that streams real-time events to the client dashboard.
- **Events**:
  - `parliament_update` (e.g., Bill passed in Lok Sabha)
  - `election_update` (e.g., Seat tally changed)
  - `judiciary_update` (e.g., SC delivered judgment)
