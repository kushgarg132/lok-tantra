# LokTantra — Architecture

> **Status**: Phase 2 (active development)  
> **Stack**: Next.js 14, TypeScript, Prisma, PostgreSQL, Neo4j, Elasticsearch, Redis, BullMQ, Anthropic Claude, Voyage AI

LokTantra uses a modular, layered architecture designed to scale in data volume and feature complexity. The platform is built around a "data-first" principle: all civic facts are sourced from official government portals, stored in PostgreSQL, and made traversable through a Neo4j governance graph.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Browser / Mobile                           │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS
┌────────────────────────────────▼────────────────────────────────────┐
│              Next.js 14 App (App Router — Server Components)        │
│   Pages → Server Components (DB queries via lib/data/)              │
│   Islands → Client Components ("use client", Zustand, fetch API)    │
└───────┬────────────────────┬────────────────────┬───────────────────┘
        │ API Routes         │ Service Layer       │ Direct DB (pages)
┌───────▼──────────┐ ┌───────▼──────────┐ ┌───────▼──────────┐
│  /api/* handlers │ │  lib/services/   │ │   lib/data/      │
│  (Zod + try-catch│ │  GraphService    │ │  Typed Prisma    │
│   + pagination)  │ │  DiscoveryService│ │  query functions │
└───────┬──────────┘ └───────┬──────────┘ └───────┬──────────┘
        │                    │                     │
┌───────▼──────────┐ ┌───────▼──────────┐ ┌───────▼──────────┐
│  PostgreSQL      │ │  Neo4j           │ │  Redis           │
│  (Prisma ORM)    │ │  (graph.service) │ │  (rate limit,    │
│  Source of Truth │ │  Relationship    │ │   BullMQ, logs)  │
│                  │ │  traversal       │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     ETL Worker (BullMQ)                             │
│  Extractors → Transformers → Loaders → Quality Gates               │
│  Sources: ECI, ADR/MyNeta, PRS, India Code, SCI                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ writes to PostgreSQL
┌──────────────────────────────▼──────────────────────────────────────┐
│                  Search Layer                                        │
│  Elasticsearch 9 (full-text, BM25+KNN hybrid search)               │
│  Voyage AI voyage-3 embeddings (1024-dim, indexed in Elasticsearch) │
│  Fuse.js (client-side fallback for constitution knowledge)          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Frontend Layer

### Server Components (default)
Next.js pages are Server Components by default. They fetch data from `src/lib/data/` typed query functions and pass serialized props to client components. Server Components never import `"use client"` code directly.

### Client Islands
Interactivity (search inputs, filters, maps, graphs, the AI assistant) lives in `"use client"` components. Client state is managed via Zustand stores (`src/store/`). API calls from client components go through the `/api/*` route handlers.

### Key Client Stores (Zustand)
| Store | Purpose |
|-------|---------|
| `useStore` | Global UI state (sidebar, dark mode) |
| `useFilterStore` | Cross-component filter state |
| `useLiveStore` | Real-time event feed and ticker |
| `learnStore` | Learning path progress (persisted to localStorage) |

---

## 2. API Layer (`src/app/api/`)

All API route handlers must follow the contract established after the June 2026 audit:

1. **Error handling** — `try { … } catch { return 500 }` — raw Prisma/database errors must never reach the client
2. **Zod validation** — all query params parsed through a Zod schema before use; return 400 on invalid input
3. **Pagination** — `limit` (max 100) + `offset` on any list endpoint
4. **Selective fields** — `select` only needed columns on list queries

### Route Inventory

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/institutions` | Institution hierarchy and search |
| GET | `/api/constitution` | Articles, parts, amendments, cases |
| GET | `/api/elections` | Election summaries and party results |
| GET | `/api/representatives` | MPs and MLAs by filter/search |
| GET | `/api/parties` | Political party profiles |
| GET | `/api/judiciary` | Courts, landmark cases, writs |
| GET | `/api/timeline` | Political history events |
| GET | `/api/learn` | Learning paths and modules |
| GET | `/api/search` | Unified Elasticsearch search |
| POST | `/api/assistant` | AI governance assistant (RAG + Claude) |
| GET | `/api/graph/hierarchy` | Neo4j institutional hierarchy |
| GET | `/api/graph/path` | Neo4j shortest path between nodes |
| GET | `/api/health` | Service health check |
| POST | `/api/auth/register` | Email registration |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth OAuth/session |
| GET | `/api/admin/audit` | Audit log (ADMIN only) |
| GET | `/api/admin/observability` | Scraper health + queue depths (ADMIN only) |
| GET | `/api/admin/observability/logs` | Redis log stream (ADMIN only) |
| GET | `/api/admin/observability/alerts` | Active alert evaluation (ADMIN only) |
| POST | `/api/admin/observability/recovery` | Trigger queue recovery (ADMIN only) |
| GET | `/api/moderation/queue` | Content flag queue (MODERATOR+) |
| POST | `/api/moderation/flag` | Submit a content flag |
| GET/DELETE | `/api/media/entity/[type]/[id]` | Entity media management |
| POST | `/api/media/ingest` | Trigger media ingestion job |
| POST | `/api/sources/verify` | Check data source status |

### Authentication & Authorization
- Admin routes (`/admin/*`, `/api/admin/*`) — ADMIN role required (enforced in middleware)
- Moderation routes (`/api/moderation/queue`) — MODERATOR or ADMIN role required (enforced in middleware)
- AI assistant — rate-limited by Redis; authenticated users get a multiplied limit
- All other routes — public (rate-limited by middleware)

---

## 3. Service Layer (`src/lib/services/`)

### GraphService
Wraps all Neo4j Cypher queries. Features:
- LRU in-memory cache (500 entries, 30-minute TTL)
- All variable-length paths are bounded (default `[*..3]` for hierarchy, `[*..6]` for shortest path)
- Methods: `getInstitutionalHierarchy`, `getPoliticalNetwork`, `getConstitutionalAuthority`, `getAdministrativeHierarchy`, `getJudicialImpact`, `getShortestPath`

### DiscoveryService
Locates a user's constituency and representatives from a PIN code or geo-coordinates. Uses PostGIS (when enabled) or coordinate-based lookup.

### ModerationService
Evaluates content flags from the admin queue.

---

## 4. Database Layer

### PostgreSQL (Source of Truth)
All civic data — persons, institutions, elections, constitutional text, legislation, judiciary — lives in PostgreSQL via Prisma ORM.

**Domain models**: Auth, Moderation, Audit, Media, Provenance, Constitution, Institutions, Persons, Parties, Elections, Geography, Judiciary, Legislation, Bureaucracy, Governance Processes, Timeline, Learning, Citizen Action, Observability.

**Indexing strategy** (as of June 2026):
- All foreign key columns are indexed
- Composite temporal indexes on `PersonRole(personId, validFrom, validTo)` and `PersonPartyHistory(personId, validFrom, validTo)` for point-in-time queries
- Compound indexes for election queries: `(year, type)` on `ElectionResult` and `ElectionSummary`
- Full-text search via Elasticsearch (not `ILIKE` — `contains` in Prisma is a full table scan)

**Cascade rules**:
- `onDelete: Cascade` — child records always deleted with parent (e.g., PersonRole on Person)
- `onDelete: SetNull` — optional FKs set to null on parent deletion (e.g., ContentFlag.userId)
- `onDelete: Restrict` — immutable historical data cannot be orphaned (e.g., ElectionCandidate FKs)

### Neo4j (Relationship Projection)
Neo4j models the dense governance relationship graph. It is populated asynchronously from PostgreSQL data (sync pipeline is a future planned step; currently seeded manually). See `docs/graph-ontology.md` for the full ontology.

---

## 5. Search Layer

### Elasticsearch 9
Used for:
- Unified search across all entity types (`/api/search`)
- Hybrid BM25 + KNN vector search using Voyage AI embeddings
- The `/api/search/index` endpoint triggers indexing jobs

### Fuse.js
Used for:
- Client-side fuzzy search within the constitution knowledge base (`src/lib/rag/knowledge.ts`)
- Available as an offline-capable fallback when Elasticsearch is unavailable

### Voyage AI Embeddings
`voyage-3` model (1024-dim vectors) generates semantic embeddings for constitutional articles, landmark cases, and legislation. Used by the RAG pipeline to retrieve relevant chunks for AI responses.

---

## 6. AI / RAG Layer (`src/lib/rag/`)

The AI assistant uses a Retrieval-Augmented Generation pipeline:

```
User Query
    ↓
Sanitize (sanitizer.ts)
    ↓
Retrieve relevant knowledge chunks (knowledge.ts — Fuse.js over 200+ article chunks)
    ↓
Generate response (generator.ts — Anthropic Claude API, ~500-token system prompt)
    ↓
Neutrality check (moderation/service.ts — auto-check for political bias)
    ↓
Return JSON { answer, sources, disclaimer? }
```

Known improvements planned (see AUDIT.md):
- Stream response as SSE instead of buffering (reduces perceived latency 3–8s → near-instant)
- Use Anthropic prompt caching on the system block (~90% cost reduction on repeated calls)
- Upgrade knowledge retrieval to Voyage AI semantic search (pgvector or Elasticsearch KNN)

---

## 7. ETL Layer (`src/lib/etl/`, `src/worker/`)

Automated data ingestion is orchestrated via BullMQ workers:

```
Cron Scheduler (src/worker/scheduler.ts)
    ↓ enqueues jobs
BullMQ Queue (Redis-backed)
    ↓ consumes jobs
ETL Worker (src/worker/index.ts)
    ↓ runs ingestors
Ingestors (src/lib/etl/ingestors/)
  ├── adr.ingestor.ts     — MP/MLA criminal records and assets
  ├── eci.ingestor.ts     — Election results
  ├── prs.ingestor.ts     — Bills and legislation
  └── india-code.ingestor.ts — Acts and rules
    ↓ normalize
NormalizationEngine (src/lib/etl/normalization.ts)
    ↓ upsert
PostgreSQL
```

Known gaps (see AUDIT.md): no `prisma.$transaction()` on ingestors, no dead-letter queue, no checkpoint/resume on failure.

---

## 8. Observability Layer (`src/lib/observability/`)

| Module | Purpose |
|--------|---------|
| `scraper-run.ts` | Tracks ETL run health per source |
| `freshness.ts` | Evaluates data staleness per domain |
| `alert-engine.ts` | Rule-based alert evaluation and history |
| `metrics.ts` | Redis counter-based metrics (scraper run counts) |
| `recovery.ts` | Queue depth monitoring and recovery triggers |

Logs are written to Redis as JSON entries (`obs:logs` list key) and streamed to the admin dashboard via `/api/admin/observability/logs`.

---

## 9. Security

| Concern | Implementation |
|---------|---------------|
| Rate limiting | Middleware (in-memory, per-instance — planned: Redis distributed) |
| AI rate limiting | Redis-backed `enforceRateLimit()` in `src/lib/security/rate-limiter.ts` |
| Input sanitization | `sanitizeQuery()` in `src/lib/security/sanitizer.ts` |
| Auth | NextAuth.js v4 with JWT strategy |
| CSP | Set in middleware; `unsafe-eval` excluded in production |
| Role enforcement | Middleware checks ADMIN/MODERATOR roles on protected routes |
| Input validation | Zod schemas on all API routes |

---

## Module Boundaries

Domains are isolated to prevent spaghetti dependencies:

| Domain | Key Files |
|--------|-----------|
| Constitution | `src/lib/data/constitution.ts`, `src/app/api/constitution/` |
| Institutions | `src/lib/data/institutions.ts`, `src/app/api/institutions/` |
| Elections | `src/lib/data/elections.ts` (if present), `src/app/api/elections/` |
| Representatives | `src/lib/data/representatives.ts`, `src/app/api/representatives/` |
| Judiciary | `src/lib/data/judiciary.ts`, `src/app/api/judiciary/` |
| Parties | `src/app/api/parties/` |
| Graph | `src/lib/services/graph.service.ts`, `src/app/api/graph/` |
| AI | `src/lib/rag/`, `src/app/api/assistant/` |
| Admin | `src/lib/observability/`, `src/app/api/admin/` |
| ETL | `src/lib/etl/`, `src/worker/` |

Cross-domain queries use `GraphService` (Neo4j traversal) or dedicated service classes rather than tight Prisma coupling between domains.

---

## Further Documentation

- [API Reference](docs/api-reference.md)
- [Database & Graph Schema](docs/database-schema.md)
- [Neo4j Graph Ontology](docs/graph-ontology.md)
- [ETL Pipelines](docs/etl-pipelines.md)
- [AI / RAG System](docs/ai-rag-system.md)
- [Deployment Strategy](docs/deployment.md)
- [Platform Audit & Roadmap](AUDIT.md)
