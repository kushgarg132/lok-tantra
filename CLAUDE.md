# LokTantra — Indian Democracy Platform

## Project Overview
LokTantra is an interactive civic intelligence platform for understanding Indian democracy, governance, constitutional systems, political power structures, elections, judiciary, bureaucracy, and citizen participation.

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS with custom design system (saffron/navy/chakra theme) + Framer Motion
- **State**: Zustand
- **Visualization**: D3.js, Cytoscape.js, MapLibre GL (constituency maps — planned), Recharts (planned)
- **Database**: PostgreSQL + Prisma ORM (schema in `prisma/schema.prisma`)
- **Graph DB**: Neo4j (driver in `src/lib/neo4j/`, service in `src/lib/services/graph.service.ts`)
- **Search**: Fuse.js (client-side knowledge retrieval), Elasticsearch 9 (full-text + hybrid BM25+KNN)
- **Embeddings**: Voyage AI (`voyage-3`, 1024-dim) via `src/lib/search/rag-pipeline.ts`
- **AI**: Anthropic Claude API (`src/lib/rag/generator.ts`, route at `src/app/api/assistant/route.ts`)
- **Queue / ETL**: BullMQ + Redis (`src/worker/`, `src/lib/etl/`)
- **Auth**: NextAuth.js v4 — Google OAuth + bcrypt email/password
- **Storage**: Local / Cloudflare R2 / AWS S3 (controlled by `STORAGE_PROVIDER` env)
- **Validation**: Zod — required on ALL API routes (query params + request bodies)

## Project Structure
```
src/
  app/              # Next.js App Router pages
    api/            # REST API routes — ALL must have try-catch + Zod validation + pagination
    admin/          # Admin dashboard (moderation, observability)
    power-structure/  # Governance hierarchy explorer
    constitution/     # Interactive constitution browser
    representatives/  # Find-your-representative
    elections/        # Election analytics dashboard
    simulator/        # Governance process simulator
    citizen-action/   # RTI, PIL, grievance guides
    learn/            # Learning paths (beginner to UPSC)
    judiciary/        # Court system and landmark cases
    parties/          # Political party profiles
    bureaucracy/      # Administrative hierarchy
    timeline/         # Political history timeline
    auth/             # NextAuth sign-in page
  components/       # React components by feature
    admin/          # Observability dashboard, moderation queue, log stream, audit log
    assistant/      # GovernanceAssistant chatbot UI
    elections/      # Election dashboard, LokSabhaMap, CoalitionPanel
    graph/          # PoliticalRelationshipMap (Cytoscape.js)
    home/           # Landing page components
    layout/         # Header, Footer, MobileSidebar
    live/           # LiveDashboard, NotificationToast
    media/          # MediaImage, PartyLogo, EntityAvatar
    power-structure/  # Power hierarchy explorer
    constitution/     # Constitution explorer
    representatives/  # Representative discovery
    search/           # GovernanceSearch
    simulator/        # Governance simulator
    providers/        # ThemeProvider
  lib/
    auth/           # NextAuth options, permissions, role multipliers
    audit/          # Audit event service
    data/           # Typed Prisma query functions (data access layer)
    etl/            # BullMQ ingestors (adr, eci, prs, india-code) + normalization engine
    moderation/     # Auto-check AI response neutrality
    neo4j/          # Neo4j driver singleton
    observability/  # Scraper health, data freshness, alert engine, metrics, recovery
    rag/            # Knowledge retrieval (Fuse.js) + Claude generation
    search/         # Elasticsearch client, RAG pipeline (Voyage AI embeddings)
    security/       # Redis rate limiter, request sanitizer
    services/       # GraphService (Neo4j), DiscoveryService, ModerationService
  store/            # Zustand stores (useStore, useFilterStore, useLiveStore, learnStore)
  types/            # TypeScript type definitions
  worker/           # BullMQ worker entrypoint + cron scheduler
prisma/             # Prisma schema and seed
infra/
  k8s/              # Kubernetes manifests (app, worker, ingress, HPA, PDB, monitoring, backup)
  terraform/        # Infrastructure as code (GCP/AWS)
  scripts/          # Operational scripts (backup, restore, rollback, health-check)
```

## Key Design Principles
- **Politically neutral** — no party advocacy, constitutional grounding only
- **Source-verifiable** — every fact cites a constitutional article or official source
- **Mobile-first** — responsive design, works on all devices
- **Dark mode** — full dark mode support via `class` strategy
- **Beginner-friendly** — reduce jargon, explain visually first

## API Route Requirements (mandatory after audit 2026-06-05)
Every API route handler MUST have:
1. **try-catch** block — returns `{ error: "Internal server error" }` with HTTP 500 on failure; never expose raw Prisma errors
2. **Zod schema** — validates all query params with `safeParse`; returns 400 with `details` on failure
3. **Pagination** — `limit` (max 100) and `offset` params on any list endpoint that could grow unboundedly
4. **Selective `select`** — list queries must avoid fetching large text columns (e.g., article full text) unless specifically requested

## Graph Query Safety
- All variable-length Cypher paths must have a maximum hop count — never use unbounded `[*]`
- `GraphService.getShortestPath()` defaults to 6 hops, hard ceiling 10
- In-memory query cache is LRU-capped at 500 entries with 30-minute TTL

## Commands
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run worker` — Start BullMQ ETL worker
- `npm run db:generate` — Generate Prisma client
- `npm run db:push` — Push schema to database
- `npm run db:seed` — Seed database with initial data
- `npm run db:studio` — Open Prisma Studio

## Data Sources
- Election Commission of India (eci.gov.in)
- PRS Legislative Research (prsindia.org)
- India Code (indiacode.nic.in)
- Parliament of India (sansad.in)
- Supreme Court of India (sci.gov.in)
- ADR / MyNeta (myneta.info)
- Census of India

## Architecture Notes
- All data stored in PostgreSQL via Prisma ORM
- Server components query DB via `src/lib/data/` typed query functions; pages pass serialized props to client components
- API routes use the service layer (`src/lib/services/`) for graph and cross-entity logic
- Neo4j `GraphService` caches query results in-memory (LRU, 500-entry cap, 30-min TTL)
- ETL ingestors in `src/lib/etl/ingestors/` write to PostgreSQL; future: sync to Neo4j via Redis events
- `src/data/` contains legacy static data (retained as reference, superseded by DB)
- Admin routes at `/api/admin/*` are protected by middleware ADMIN role check
- Moderation routes at `/api/moderation/queue` are protected by MODERATOR or ADMIN role check

## Known Gaps (see AUDIT.md for full checklist and roadmap)
- Middleware rate limiter is in-memory — breaks under horizontal scale; must migrate to Redis
- ETL ingestors lack `prisma.$transaction()` wrapping — partial-ingest risk on job failure
- BullMQ has no dead-letter queue handler or alerting on exhausted retries
- `recharts`, `maplibre-gl`, `d3` have zero active imports — remove when features confirmed dropped
- Public civic pages (`/constitution`, `/elections`, etc.) have no `revalidate` — every request hits DB
- AI assistant response is not streamed — full buffer before returning (~3–8s latency for long answers)
