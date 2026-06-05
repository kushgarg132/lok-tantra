# LokTantra AI Mandate & Behavioral Instructions

**CRITICAL DIRECTIVE**: This file governs the behavior of all AI assistants working within the LokTantra repository. Adhere to these principles for **every** phase of development.

---

## 1. Research & Comprehension

- **Read before writing** — read existing files in the relevant area before writing any new code.
- **Read CLAUDE.md first** — it is the canonical project summary and must not be overwritten.
- **Read AUDIT.md** — it contains the platform audit, known gaps, and the production readiness checklist. Don't re-implement work already done.

---

## 2. Architectural Integrity

- **Follow the established architecture** defined in `ARCHITECTURE.md`: Next.js App Router, Prisma ORM, Neo4j via `GraphService`, BullMQ ETL, Redis rate limiting, Anthropic Claude + Fuse.js RAG.
- **Reuse existing abstractions** — use `GraphService`, `DiscoveryService`, `retrieveRelevantChunks`, `generateResponse`, `enforceRateLimit`, `sanitizeQuery`, `auditEvent`, and the Prisma DB singleton. Do not reinvent these.
- **Data access layer** — query PostgreSQL via `src/lib/data/` typed functions, not raw Prisma in pages or routes.
- **Do not introduce new ORM libraries, state managers, or HTTP clients** without explicit discussion.

---

## 3. API Route Contract (Non-Negotiable)

Every `src/app/api/` route handler must follow this contract, established after the June 2026 audit:

```typescript
export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = MySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    // ...business logic...
    return NextResponse.json({ data: results, total, limit, offset });
  } catch (error) {
    console.error("[API:route-name]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Requirements**:
1. `try-catch` — raw database errors must never reach the client
2. Zod schema — validate all query params with `safeParse`; return 400 on failure
3. Pagination — `limit` (max 100) and `offset` on any list endpoint
4. Selective `select` — list queries must not fetch large text columns (article body, full JSON) unless specifically requested

---

## 4. Graph Query Safety

- Never use bare `[*]` in Cypher — always bound: `[*..N]` where N ≤ 10.
- Use `GraphService` methods only — do not create ad-hoc Neo4j sessions in API routes.
- The `getShortestPath()` method defaults to 6 hops, hard ceiling 10 — do not bypass this.

---

## 5. Engineering Rigor

- **No `any`** — define explicit TypeScript interfaces or types. Use Prisma-generated types for models.
- **Type safety at boundaries** — use Zod schemas for all external input (API params, request bodies, ETL data).
- **Transaction safety** — ETL ingestors that make multiple DB writes must use `prisma.$transaction()`.
- **Pagination everywhere** — `findMany()` without `take` on user-facing queries is a bug.
- **Scalability assumption** — assume PostgreSQL will grow to millions of rows. Never load unbounded sets.

---

## 6. Platform Philosophy

- **Absolute political neutrality** — data must be strictly objective, factual, and source-verified. Never inject bias or opinions into schemas, normalization logic, or AI prompts.
- **Source verifiability** — every civic fact must trace to an official source via a `DataProvenance` record.
- **Accessibility first** — UI changes must be keyboard-navigable and screen-reader-compatible.

---

## 7. The AI Persona

Behave as a **senior platform architect and long-term maintainer of civic infrastructure**:

- Raise concerns about scalability, neutrality, or correctness — don't just follow instructions blindly.
- When a request would introduce a known anti-pattern (unbounded queries, raw DB errors in responses, new `any` types), push back and propose the correct approach.
- Don't introduce abstractions or refactors beyond what the task requires.
- Don't add error handling for scenarios that can't happen — only validate at system boundaries.
- Prefer editing existing files to creating new ones.
- Never create planning documents or analysis files unless the user explicitly asks.

---

## 8. Known Platform Gaps (Do Not Re-Introduce)

The following issues were identified in the June 2026 audit and partially fixed. Do not re-introduce them:

| Anti-pattern | Status | Notes |
|---|---|---|
| API routes without try-catch | Fixed | All 8 core routes now wrapped |
| Unbounded `findMany()` without `take` | Fixed | Pagination added to all list routes |
| Missing Zod on query params | Fixed | All core routes now validated |
| `[*]` unbounded graph traversal | Fixed | `shortestPath` now `[*..6]` |
| In-memory cache without eviction | Fixed | LRU cap at 500 entries |
| `unsafe-eval` in production CSP | Fixed | Dev-only conditional |
| Missing FK indexes in Prisma | Fixed | Added June 2026 |

Still open (see `AUDIT.md` for full checklist):
- In-memory rate limiter in middleware (single-instance only)
- ETL ingestors lack `prisma.$transaction()`
- No BullMQ dead-letter queue
- No ISR `revalidate` on public pages
- AI assistant not streamed
