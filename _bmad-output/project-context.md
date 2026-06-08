---
project_name: 'lok-tantra'
user_name: 'Kush'
date: '2026-06-08'
sections_completed:
  ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 44
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Framework**: Next.js 14.2 (App Router, TypeScript, `output: "standalone"`) + React 18.3 + TypeScript 5.4 (strict mode)
- **Database**: PostgreSQL via Prisma 5.15 (`@prisma/client`) — primary data store
- **Graph DB**: Neo4j 5.20 driver — relationship layer via `GraphService` (`src/lib/services/graph.service.ts`)
- **Search**: Elasticsearch 9.4 (hybrid BM25+KNN) + Voyage AI embeddings (`voyage-3`, 1024-dim, `src/lib/search/rag-pipeline.ts`)
- **Queue**: Redis (ioredis 5.4) + BullMQ 5.7 — ETL jobs, worker entrypoint `src/worker/index.ts`
- **Validation**: Zod 3.23 — mandatory `safeParse` on every API route (query + body)
- **State**: Zustand 4.5 (client) · **Auth**: NextAuth 4.24 (Google OAuth + bcrypt)
- **Styling**: Tailwind 3.4 (custom `saffron`/`navy`/`chakra` palette, `darkMode: "class"`) + Framer Motion 11.2
- **Viz libs**: Cytoscape 3.30, D3 7.9, MapLibre GL 4.5, Recharts 2.12
- **Tooling**: vitest 1.6, tsx 4.15 (scripts/worker), cheerio 1.0 (ETL scraping)

**Version/compatibility gotchas:**
- `recharts`, `maplibre-gl`, `d3`, `react-map-gl` are installed with **zero active imports** in `src/` (per `AUDIT.md`) — don't assume they're wired up; confirm before building on them
- **vitest is installed but no `*.test.ts`/`*.test.tsx` files exist anywhere in `src/`** — testing is unconfigured; "add tests" means standing up the harness, not extending one
- Path alias `@/*` → `./src/*` (from `tsconfig.json`) — always use this for cross-feature imports, never deep relative paths
- No project-level `.eslintrc`/`.prettierrc` — relies on `eslint-config-next` defaults via `next lint`

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

- `strict: true` — no implicit `any`, full null-safety expected; `moduleResolution: "bundler"`, `module: "esnext"`, `jsx: "preserve"`
- Always import via `@/*` alias (e.g. `@/lib/db`, `@/components/...`) — never deep relative paths like `../../../lib/...`
- Named exports only for components and lib functions (e.g. `export function PartyTracker`, `export async function getAllParties`) — no default exports in components/lib
- Singleton shared clients — `import { prisma } from "@/lib/db"`; never instantiate a new `PrismaClient` per file
- API route error handling: `try { ... } catch (error) { console.error("[API:<name>]", error); return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }` — never leak raw Prisma/driver errors to the client
- Server-component data fetches wrap Prisma calls with `.catch(() => [])` / `.catch(() => 0)` so one failed query doesn't blank the page (see `bureaucracy/page.tsx`)
- ETL ingestors: resolve async/network-bound IDs **outside** `prisma.$transaction()` first (network calls can't run inside a transaction), then perform all writes in one atomic `$transaction`

### Framework-Specific Rules (Next.js / React)

- Pages (`src/app/**/page.tsx`) are **async server components** — fetch via `prisma`/`Promise.all` or `src/lib/data/*` typed query functions, then pass serialized props to a `"use client"` dashboard component (e.g. `BureaucracyPage` → `<BureaucracyDashboard levels={...} services={...} />`)
- Client components start with `"use client"`, declare a typed `Props` interface, and own their interactivity state (`useState`/`useMemo` for charts, filters, tabs) — see `PartyTracker.tsx`
- Every page exports `metadata: Metadata` with `title`/`description` for SEO
- API routes: `export const dynamic = "force-dynamic"` + Zod `QuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams))`; list endpoints use `prisma.$transaction([findMany({ select, take: limit, skip: offset }), count()])` returning `{ data, total, limit, offset }`
- `select` is always explicit and minimal — never fetch large text columns (e.g. article full text) on list views, only on detail views
- `src/middleware.ts` applies security headers (CSP, X-Frame-Options, etc.) and route-class rate limits (auth/ai/search/admin/write/api/global, each with its own limit+window) to every request — don't duplicate auth/rate-limit checks ad-hoc in route handlers
- CSP `connect-src` is an explicit allow-list (`api.anthropic.com`, `api.voyageai.com`) — calling a new external API requires updating the CSP in `middleware.ts` or the request is silently blocked
- Admin (`/admin`, `/api/admin/*`) and moderation (`/api/moderation/queue`) routes are gated by role checks in middleware
- Zustand stores live in `src/store/`, one store per concern (`useStore`, `useFilterStore`, `useLiveStore`, `learnStore`) — not a single global store

### Testing Rules

- **No test harness exists**: `vitest` is a devDependency but there is no `vitest.config.ts`, no `test` script in `package.json`, and no `*.test.ts(x)` files anywhere in `src/`
- Don't assume a testing pattern to follow — if asked to add tests, scaffold the vitest config and `test` script first, and flag it to the user rather than inventing conventions silently
- Mocking vs. real-service integration testing (Prisma + Neo4j + Elasticsearch + Redis) is an open project decision — don't assume either approach

### Code Quality & Style Rules

- No project-level `.eslintrc`/`.prettierrc` — relies on `eslint-config-next` defaults via `npm run lint`
- No enforced formatter; match surrounding style — the codebase favors dense, aligned object literals and compact ternaries over verbose multi-line formatting (see `classifyRoute` in `middleware.ts`, `select` blocks in `parties/route.ts`)
- Feature-based organization mirrors routes: `src/components/<feature>/` ↔ `src/app/<feature>/page.tsx` (e.g. `components/elections/` ↔ `app/elections/`)
- Domain data-access lives in `src/lib/data/<domain>.ts` as named async exports (`getAllParties`, `getPartyByAbbreviation`); cross-entity/graph logic goes through `src/lib/services/` (`GraphService`, `DiscoveryService`) — never directly in routes/components
- Naming: components are PascalCase matching filename (`PartyTracker.tsx` → `export function PartyTracker`); data/lib functions are camelCase verbs (`getAllParties`, `resolvePoliticianId`); ingestor classes are `<Source>Ingestor` (`ECIIngestor`, `ADRIngestor`) with a `process*` entry method
- Section-banner comments (`// ── Title ─...─`) delimit logical blocks in larger files (`middleware.ts`, `eci.ingestor.ts`) — match this style there, but don't add explanatory comments for self-evident code elsewhere

### Development Workflow Rules

- All work happens directly on `main` (no feature-branch history, single contributor so far) — commits land as broad, multi-area changes
- Commit messages follow **conventional-commit style** (`feat: ...`) — match this prefix convention; e.g. "feat: implement core backend API routes and administrative dashboard for data management and graph visualization"
- No PR workflow evident yet (only `origin/main` exists)
- Deploys as `output: "standalone"` (self-contained Node server, matches `infra/k8s/` manifests)
- `next.config.mjs` defines explicit per-route-class Cache-Control tiers (immutable hashed assets, ISR-friendly short caches for civic pages, `private, no-store` for auth/AI/admin/representatives-discover) — new routes must be added to the matching cache tier, not left to defaults

### Critical Don't-Miss Rules

**Anti-patterns to avoid:**
- Skipping try-catch, Zod validation, or pagination on a new API route — mandatory per `CLAUDE.md` (audited 2026-06-05); list endpoints need `limit` (max 100) + `offset`
- Fetching large text columns (e.g. article full text) on list endpoints — `select` only what's needed; full text belongs on detail routes
- Unbounded variable-length Cypher paths (`[*]` with no hop cap) — forbidden; `GraphService.getShortestPath()` defaults to 6 hops, hard ceiling 10
- Instantiating new Prisma/Neo4j/Redis clients per request — always use the singletons (`@/lib/db`, `getNeo4jDriver()`)
- Adding ETL writes without `prisma.$transaction()` wrapping — existing ingestors have gaps here (known issue); don't replicate that in new ingestor code, always wrap multi-row writes atomically

**Security rules:**
- Never expose raw Prisma/driver error messages to clients — always generic `{ error: "Internal server error" }` + 500
- New external API calls need a `connect-src` entry in the CSP (`src/middleware.ts`) or the browser silently blocks them
- Admin (`ADMIN`) and moderation (`MODERATOR`/`ADMIN`) routes are gated centrally in middleware — don't add ad-hoc role checks in handlers that could drift out of sync

**Performance gotchas (known gaps — don't build new features that assume these are solved):**
- In-memory rate limiter and in-memory Neo4j query cache won't survive horizontal scaling — must migrate to Redis eventually
- Public civic pages (`/constitution`, `/elections`, etc.) have no `revalidate` — every request hits the DB directly; new pages in this family inherit that cost unless ISR is added
- `/api/assistant` buffers the full Claude response before returning (~3-8s latency) — not streamed; don't assume streaming is available there
- Neo4j query cache (LRU, 500 entries/30-min TTL) has no automatic invalidation on graph writes — don't bypass with `skipCache` without good reason, and be aware stale reads are possible after writes

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code in LokTantra
- Follow ALL rules exactly as documented — they reflect audited, established conventions, not suggestions
- When in doubt, prefer the more restrictive option (e.g. tighter `select`, lower rate limits, stricter validation)
- Update this file when new patterns emerge or a "known gap" gets fixed

**For Humans:**
- Keep this file lean and focused on agent needs — don't duplicate what's already in `CLAUDE.md` or `AUDIT.md`, link to them instead
- Update when the technology stack changes (especially if `recharts`/`maplibre-gl`/`d3`/`react-map-gl` get wired up or removed, or a test harness gets scaffolded)
- Review against `AUDIT.md`'s "Known Gaps" each time one is closed — several rules here exist specifically because a gap is still open

Last Updated: 2026-06-08
