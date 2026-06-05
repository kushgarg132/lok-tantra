# Contributing to LokTantra

Thank you for your interest in contributing to LokTantra. We welcome contributions from developers, researchers, designers, and domain experts in Indian governance.

Please read these guidelines before opening a pull request.

---

## 1. Core Principles

Every contribution — code, data, or documentation — must adhere to:

- **Absolute Political Neutrality** — Present facts, structures, and processes without injecting personal or political opinions. Never advocate for a party, politician, or ideology.
- **Source Verifiability** — All data must be traceable to official sources: ECI, Supreme Court, Parliament of India, India Code, PRS, or ADR.
- **Accessibility** — UI changes must support screen readers and meet WCAG 2.1 AA standards.

---

## 2. Development Workflow

1. **Fork the repository** and clone it locally.
2. **Create a branch** using a descriptive name:
   - `feat/feature-name`
   - `fix/bug-name`
   - `docs/doc-update`
   - `refactor/component-name`
   - `etl/source-name`
3. **Write code** following the standards below.
4. **Test your changes** — ensure `npm run build` passes and linting is clean (`npm run lint`).
5. **Open a pull request** to `main` with a clear description.

---

## 3. Coding Standards

### TypeScript
- Strict mode must be enabled for all new code.
- **Never use `any`** — define explicit interfaces or types in `src/types/`. Use Prisma-generated types for database models.
- Use the `@/` path alias for all internal imports.

### React & Next.js
- **Server Components first** — default to Next.js Server Components for data fetching via `src/lib/data/` query functions. Only use `"use client"` when hooks, state, or browser APIs are strictly necessary.
- **Component composition** — keep page files thin. Extract heavy UI logic into components inside `src/components/`.
- **Zustand for client state** — use domain slices (`useFilterStore`, `useGraphStore`, etc.). Avoid React Context unless absolutely required.
- **No god components** — aim for files under 400 lines. Split complex components into sub-components.

### API Routes (`src/app/api/`)
Every API route handler must follow the contract established after the June 2026 audit:

```typescript
// ✅ Correct pattern
export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = MyQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    const { param1, limit, offset } = parsed.data;

    const [results, total] = await prisma.$transaction([
      prisma.model.findMany({ where: {…}, take: limit, skip: offset }),
      prisma.model.count({ where: {…} }),
    ]);

    return NextResponse.json({ data: results, total, limit, offset });
  } catch (error) {
    console.error("[API:route-name]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

Requirements:
1. **try-catch** — never let raw Prisma/database errors reach the client
2. **Zod schema** — parse and validate all query params before use; `safeParse` + 400 on failure
3. **Pagination** — `limit` (max 100) and `offset` on any list endpoint that could grow unboundedly
4. **Selective `select`** — list queries must avoid fetching large text columns unless explicitly needed

### Styling (Tailwind CSS)
- Use utility classes over custom CSS wherever possible.
- Use the `cn()` utility (`clsx` + `tailwind-merge`) for conditional classes.
- Follow the custom tri-color theme tokens: `saffron`, `navy`, `chakra` (defined in `tailwind.config.ts`).

### Data & ETL
- Never hard-code civic data — all facts come from the database (seeded from official sources) or ETL ingestors.
- New ingestors in `src/lib/etl/ingestors/` must wrap multi-step DB operations in `prisma.$transaction()`.
- Every ingested entity must create a `DataProvenance` record linking it to a `DataSource`.

### Graph Queries (Neo4j)
- All Cypher variable-length paths must specify a maximum hop count — never use `[*]` without a limit.
- Use `GraphService` in `src/lib/services/graph.service.ts` for all Neo4j access — do not create ad-hoc driver sessions in routes.

---

## 4. Submitting a Pull Request

Your pull request must include:

1. **Summary** — what does this PR change and why?
2. **Linked issue** — reference the issue number (e.g., `Closes #42`).
3. **Verification** — how did you test this? (`npm run build` passing is the minimum bar.)
4. **Screenshots** — required for all visual (UI) changes.
5. **Data source** — if adding or changing civic data, cite the official source URL.

---

## 5. Environment Setup

See [README.md](README.md) for full setup instructions. The minimum to start contributing:

```bash
cp .env.example .env
# Set: DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY
docker-compose up -d       # starts PostgreSQL, Neo4j, Redis, Elasticsearch
npm run db:push            # creates tables
npm run db:seed            # loads initial data
npm run dev                # starts Next.js at localhost:3000
```

For ETL work, run the worker in a separate terminal:
```bash
npm run worker
```

---

## 6. Adding New Data

If your contribution adds a new civic fact, entity type, or relationship:

1. Add the Prisma model to `prisma/schema.prisma` — include appropriate indexes and cascade rules.
2. Run `npm run db:generate` to regenerate the Prisma client.
3. Add the corresponding seed entry or ETL ingestor.
4. Add a typed query function in `src/lib/data/` for the new model.
5. Document the new entity in `docs/database-schema.md`.

---

## 7. Code of Conduct

Be respectful, constructive, and collaborative. Harassment, discrimination, or abusive behavior of any kind will not be tolerated. When in doubt, focus on the facts and the code — not the people.
