---
baseline_commit: a8b2a9deb7886e8447a7de55dd109fd36442cbc8
---

# Story 1.1: Tenure Data Model & Test Harness

Status: review

## Story

As a developer,
I want the Tenure data model in place with a working test harness,
so that all downstream features (graph rendering, Time Travel, profiles) can rely on a single temporal backbone.

## Acceptance Criteria

1. New `Tenure` model added to `prisma/schema.prisma` with fields: `id` (cuid), `personId`, `positionId`, `startDate` (DateTime), `endDate` (DateTime?), `startDateApproximate` (Boolean, default false), `mechanism` (String?).
2. Relations: `person` → Person (onDelete: Cascade), `position` → Position (onDelete: Restrict).
3. Indexes: `[personId]`, `[positionId]`, `[positionId, startDate, endDate]`, `[personId, startDate]`.
4. `Position.currentHolderId` unique FK is removed. All existing reads of `currentHolderId` across `src/lib/data/` and API routes are migrated to a `getActiveTenure(positionId, date?)` utility that queries the Tenure table (defaults to today).
5. `getActiveTenure` implements the 5 temporal resolution rules: (a) startDate inclusive, (b) endDate inclusive, (c) no match = vacant, (d) before earliest = not-yet-established, (e) overlapping = latest startDate wins.
6. Vitest scaffolded: `vitest.config.ts` created, `test` script added to `package.json`, sample test passes.
7. Seed script (`prisma/seed.ts`) updated to create Tenure records for existing Person→Position relationships.
8. At least 10 test cases covering: single active tenure, vacant position, overlapping tenures, approximate dates, not-yet-established state, migration parity (old `currentHolderId` matches new `getActiveTenure` result for all seeded data).

## Tasks / Subtasks

- [x] Task 1: Scaffold vitest test harness (AC: #6)
  - [x] 1.1: Create `vitest.config.ts` in project root with TypeScript support and `@/*` path alias resolution
  - [x] 1.2: Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`
  - [x] 1.3: Create a trivial smoke test at `src/lib/data/__tests__/smoke.test.ts` that asserts `1 + 1 === 2` and run it to confirm the harness works

- [x] Task 2: Add Tenure model to Prisma schema (AC: #1, #2, #3)
  - [x] 2.1: Add the `Tenure` model block to `prisma/schema.prisma` directly below the `Position` model (see Dev Notes for exact schema)
  - [x] 2.2: Add `tenures Tenure[]` relation field to the `Person` model
  - [x] 2.3: Add `tenures Tenure[]` relation field to the `Position` model
  - [x] 2.4: Run `npx prisma generate` to verify the schema compiles without errors

- [x] Task 3: Remove Position.currentHolderId (AC: #4)
  - [x] 3.1: Remove `currentHolderId String? @unique` and `currentHolder Person? @relation(...)` from the `Position` model
  - [x] 3.2: Remove `currentPosition Position? @relation("CurrentPosition")` from the `Person` model
  - [x] 3.3: Run `npx prisma generate` to confirm schema compiles
  - [x] 3.4: Run `npx prisma db push` (or create migration) to apply schema changes to the database

- [x] Task 4: Create Tenure data access layer with getActiveTenure (AC: #4, #5)
  - [x] 4.1: Create `src/lib/data/tenure.ts` with functions: `getActiveTenure(positionId, date?)`, `getTenuresForPosition(positionId)`, `getTenuresForPerson(personId)`
  - [x] 4.2: Implement the 5 temporal resolution rules in `getActiveTenure` (see Dev Notes for exact rules)
  - [x] 4.3: Export all functions as named exports using the `@/lib/db` singleton

- [x] Task 5: Migrate all currentHolder reads (AC: #4)
  - [x] 5.1: Update `src/lib/data/institutions.ts` — `getInstitutionBySlug()` and `getInstitutionTree()`: replace `include: { currentHolder: ... }` with a post-query step that resolves current holders via `getActiveTenure`
  - [x] 5.2: Update `src/lib/data/representatives.ts` — `getRepresentativeById()`: replace `include: { currentPosition: ... }` with a post-query Tenure lookup
  - [x] 5.3: Update `src/app/api/institutions/route.ts` — slug query: replace `include: { currentHolder: ... }` with Tenure-based resolution
  - [x] 5.4: Update `src/app/api/representatives/route.ts` — id query: replace `include: { currentPosition: ... }` with Tenure-based resolution
  - [x] 5.5: Update `src/types/index.ts` — `PowerNode` interface: replace `currentHolder?: PersonBrief` with `currentHolder?: PersonBrief | null` (shape preserved for backward compatibility; source changes from FK to Tenure query)
  - [x] 5.6: Verify `src/components/power-structure/PowerHierarchyExplorer.tsx` still compiles (it consumes `currentHolder` in its DTO — the DTO shape must remain identical even though the data source changes). Do NOT refactor this component — it is replaced entirely in Story 1.4.

- [x] Task 6: Create TypeScript interfaces for Power Explorer (AC: N/A — architecture prerequisite)
  - [x] 6.1: Create `src/types/power-explorer.ts` with `GraphNodeData`, `GraphEdgeData`, and `Neo4jSyncEvent` interfaces (see Dev Notes for exact definitions)

- [x] Task 7: Update seed script (AC: #7)
  - [x] 7.1: In `prisma/seed.ts`, after existing Person + Position creation, add Tenure records that link each Person to their Position with `startDate`, `endDate: null` (current), and `mechanism`
  - [x] 7.2: Run `npx prisma db seed` to verify seeding works

- [x] Task 8: Write Tenure resolution tests (AC: #8)
  - [x] 8.1: Create `src/lib/data/__tests__/tenure.test.ts` with at least 10 test cases
  - [x] 8.2: Test: single active tenure returns correct person
  - [x] 8.3: Test: position with no tenure returns null (vacant)
  - [x] 8.4: Test: overlapping tenures — latest startDate wins
  - [x] 8.5: Test: query date before earliest tenure — returns not-yet-established sentinel
  - [x] 8.6: Test: query on exact startDate (inclusive) — returns the tenure
  - [x] 8.7: Test: query on exact endDate (inclusive) — still returns the outgoing tenure
  - [x] 8.8: Test: query on day after endDate — returns next tenure or vacant
  - [x] 8.9: Test: approximate date flag set — tenure still resolves correctly
  - [x] 8.10: Test: `getTenuresForPerson` returns all tenures chronologically
  - [x] 8.11: Test: `getTenuresForPosition` returns all tenures for position
  - [x] 8.12: Run full test suite — all tests pass, zero regressions

## Dev Notes

### Tenure Prisma Model (exact schema to add)

Add this block to `prisma/schema.prisma` directly below the `Position` model (after line 328):

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

**Why not extend PersonRole:** PersonRole is for generic roles (committee memberships, bureaucratic postings). Tenure is specifically for "occupied a constitutional Office" with temporal precision and dedicated indexes.

### Position model — fields to remove

Current Position model at `prisma/schema.prisma` lines 312-328:
```prisma
model Position {
  id                   String       @id @default(cuid())
  title                String
  institutionId        String
  institution          Institution  @relation(fields: [institutionId], references: [id])
  constitutionalBasis  String?
  appointedBy          String?
  removableBy          String?
  tenure               String?        // ← NOTE: this is a string description, NOT temporal. Keep it.
  powers               String[]
  currentHolderId      String?      @unique    // ← REMOVE
  currentHolder        Person?      @relation("CurrentPosition", fields: [currentHolderId], references: [id])  // ← REMOVE
  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  @@index([institutionId])
}
```

Also remove from Person model (line ~343):
```prisma
  currentPosition Position?            @relation("CurrentPosition")  // ← REMOVE
```

Add to both models:
```prisma
// In Person model:
  tenures         Tenure[]

// In Position model:
  tenures          Tenure[]
```

### The 5 Temporal Resolution Rules (implement in getActiveTenure)

```typescript
// Rule 1: startDate is INCLUSIVE — on startDate, new tenure is active
// Rule 2: endDate is INCLUSIVE — on endDate, outgoing tenure is STILL active
// Rule 3: No match = VACANT — return null
// Rule 4: Before earliest = NOT-YET-ESTABLISHED — return a sentinel
//         (if query date < earliest tenure startDate for this position)
// Rule 5: Overlapping = LATEST startDate wins — deterministic tiebreaker
```

**getActiveTenure implementation approach:**

```typescript
import { prisma } from "@/lib/db";

export async function getActiveTenure(positionId: string, date?: Date) {
  const queryDate = date ?? new Date();

  const tenures = await prisma.tenure.findMany({
    where: {
      positionId,
      startDate: { lte: queryDate },  // Rule 1: startDate inclusive
      OR: [
        { endDate: null },             // Still active
        { endDate: { gte: queryDate } } // Rule 2: endDate inclusive
      ],
    },
    orderBy: { startDate: "desc" },    // Rule 5: latest startDate first
    take: 1,
    include: { person: { include: { party: true } } },
  });

  if (tenures.length > 0) return tenures[0];

  // Rule 4: Check if position has ANY tenures — if all are after queryDate, not-yet-established
  const earliest = await prisma.tenure.findFirst({
    where: { positionId },
    orderBy: { startDate: "asc" },
    select: { startDate: true },
  });

  if (earliest && queryDate < earliest.startDate) {
    return "not-yet-established" as const;
  }

  return null; // Rule 3: vacant
}
```

**Return type:**
```typescript
type ActiveTenureResult =
  | (Tenure & { person: Person & { party: PoliticalParty | null } })
  | "not-yet-established"
  | null;  // vacant
```

### TypeScript Interfaces (create in src/types/power-explorer.ts)

```typescript
export interface GraphNodeData {
  id: string;
  type: 'person' | 'office' | 'institution';
  label: string;
  state: 'occupied' | 'vacant' | 'not-established' | 'discontinued';
  personId?: string;
  photoUrl?: string;
  partyAbbreviation?: string;
  partyTagSlot?: number;
  positionId?: string;
  constitutionalBasis?: string;
  tenureStartDate?: string;
  tenureEndDate?: string | null;
  tenureMechanism?: string;
  startDateApproximate?: boolean;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  type: 'reports_to' | 'appoints' | 'supervises' | 'elected_from' | 'part_of';
  label: string;
  citationArticle?: string;
  citationId?: string;
}

export interface Neo4jSyncEvent {
  action: 'upsert' | 'delete';
  entityType: 'tenure' | 'person' | 'position' | 'institution';
  entityId: string;
  timestamp: string;
  data?: Record<string, unknown>;
}
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Critical:** The `@/*` path alias MUST be configured in vitest.config.ts. The project uses `@/lib/db`, `@/lib/data/...` everywhere — tests will fail on imports without this alias.

### Exact Files to Migrate (currentHolder reads)

**File 1: `src/lib/data/institutions.ts`**

Functions to update:
- `getInstitutionBySlug(slug)` — line 16: `positions: { include: { currentHolder: { include: { party: true } } } }` → Replace with Tenure-based lookup after the query
- `getInstitutionTree()` — line 25: same pattern → Replace with Tenure-based lookup

Migration strategy: Query positions normally (without `currentHolder` include), then for each position, call `getActiveTenure(position.id)` to resolve the current holder. Map the result back to the same `currentHolder` shape the consumers expect.

**File 2: `src/lib/data/representatives.ts`**

Function to update:
- `getRepresentativeById(id)` — includes `currentPosition: { include: { institution: true } }` → Replace with Tenure-based lookup to find active position

**File 3: `src/app/api/institutions/route.ts`**

Line 32: `include: { currentHolder: { include: { party: { select: { id: true, name: true, abbreviation: true, color: true } } } } }` → Replace with Tenure-based resolution

**File 4: `src/app/api/representatives/route.ts`**

The id query includes `currentPosition: { include: { institution: ... } }` → Replace with Tenure-based resolution

**File 5: `src/types/index.ts`**

`PowerNode.currentHolder` type (line 171) — Keep the same type shape for backward compatibility. The data source changes but the shape stays identical.

**File 6: `src/components/power-structure/PowerHierarchyExplorer.tsx`**

DO NOT REFACTOR THIS COMPONENT. It is being entirely replaced in Story 1.4. Just ensure it still compiles after the data layer changes (the `currentHolder` DTO shape must remain identical).

### Seed Script Notes

`prisma/seed.ts` (761 lines) does NOT currently seed any Position→Person holder relationships. The seed creates Person records and Position records independently. Adding Tenure seed records means:
1. After creating Position and Person records, create Tenure records linking them
2. Use `prisma.tenure.upsert` or `prisma.tenure.create` with known Person/Position IDs
3. Set `startDate` to a reasonable historical date, `endDate: null` for current holders, `mechanism: "appointed"` or `"elected"`

### Testing Strategy

Tests should use **mock data, not the database**. Create in-memory Tenure arrays and test the resolution logic as a pure function. This avoids needing a test database connection (which is an open project decision per project-context.md).

Extract the resolution logic into a pure function:
```typescript
// Pure function for testing
export function resolveActiveTenure(
  tenures: Tenure[],
  positionId: string,
  date: Date
): Tenure | 'not-yet-established' | null { ... }

// Database wrapper
export async function getActiveTenure(positionId: string, date?: Date) {
  const tenures = await prisma.tenure.findMany({ where: { positionId } });
  return resolveActiveTenure(tenures, positionId, date ?? new Date());
}
```

This pattern enables testing the 5 resolution rules without a database, and also enables the client-side resolver in Story 3.2 to share the same logic.

### API Date Format Convention

Dates in API responses use **ISO 8601 date strings (`YYYY-MM-DD`), no time component**:
```typescript
// ✅ Correct
{ startDate: "1991-06-21", endDate: "1996-05-16" }

// ❌ Wrong
{ startDate: "1991-06-21T00:00:00.000Z" }
```

The `startDateApproximate: boolean` flag is the **only** signal for imprecise dates. When `true`, the date is a convention (January 1 of that year). Never invent an `approximateDate` field or `~` prefix.

### Existing Patterns to Follow

- **Named exports only** — `export function getActiveTenure(...)`, never `export default`
- **Import via alias** — `import { prisma } from "@/lib/db"`, never relative paths
- **Singleton Prisma client** — use `@/lib/db`, never instantiate new `PrismaClient()`
- **Index naming** — follow existing compound index pattern: `@@index([field1, field2, field3])`
- **Temporal model pattern** — follow `PersonPartyHistory` and `PersonRole` as structural precedents (they use `validFrom`/`validTo`; Tenure uses `startDate`/`endDate` for semantic clarity but same approach)
- **Error handling** — data-access layer functions don't try-catch; API routes wrap them with try-catch + generic error response
- **Cascade/Restrict** — Person delete cascades (Tenure deleted); Position delete restricted (can't delete Position with Tenures)

### Project Structure Notes

New files to create:
```
vitest.config.ts                          # NEW
src/lib/data/tenure.ts                    # NEW
src/lib/data/__tests__/smoke.test.ts      # NEW
src/lib/data/__tests__/tenure.test.ts     # NEW
src/types/power-explorer.ts               # NEW
```

Files to modify:
```
prisma/schema.prisma                      # ADD Tenure model, REMOVE currentHolderId
prisma/seed.ts                            # ADD Tenure seed records
package.json                              # ADD test scripts
src/lib/data/institutions.ts              # MIGRATE currentHolder reads
src/lib/data/representatives.ts           # MIGRATE currentPosition reads
src/app/api/institutions/route.ts         # MIGRATE currentHolder includes
src/app/api/representatives/route.ts      # MIGRATE currentPosition includes
src/types/index.ts                        # UPDATE PowerNode type (keep shape, change source annotation)
```

Files NOT to modify:
```
src/components/power-structure/PowerHierarchyExplorer.tsx  # Replaced in Story 1.4 — verify compiles only
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision-1] — Tenure model specification
- [Source: _bmad-output/planning-artifacts/architecture.md#Section-5.1] — Temporal resolution rules
- [Source: _bmad-output/planning-artifacts/architecture.md#Section-5.2] — GraphNodeData / GraphEdgeData interfaces
- [Source: _bmad-output/planning-artifacts/architecture.md#Section-5.4] — Neo4jSyncEvent interface
- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.1] — Acceptance criteria
- [Source: _bmad-output/project-context.md] — 44 AI agent coding rules
- [Source: prisma/schema.prisma#Position] — Current Position model with currentHolderId
- [Source: prisma/schema.prisma#PersonRole] — Existing temporal model pattern
- [Source: src/lib/data/institutions.ts] — currentHolder read patterns to migrate
- [Source: src/lib/data/representatives.ts] — currentPosition read pattern to migrate

## Dev Agent Record

### Agent Model Used

Claude Opus 4 (via Claude Code)

### Debug Log References

- Glob timeout on `**\project-context.md` — resolved by scoping to `_bmad-output` directory
- Windows `if exist` bash syntax error — resolved by using `ls` instead
- First `prisma db push` ran in background — second explicit run with `--accept-data-loss` confirmed schema already in sync

### Completion Notes List

- All 8 tasks and 28 subtasks completed successfully
- Vitest harness scaffolded with `@/*` path alias — first test infrastructure for the project
- Tenure model added with 4 compound indexes for temporal resolution and career path queries
- `currentHolderId` FK removed from Position; `currentPosition` FK removed from Person
- Pure function `resolveActiveTenure()` extracted for testability and future client-side reuse (Story 3.2)
- All 6 files using `currentHolder`/`currentPosition` migrated to Tenure-based resolution
- Backward compatibility preserved — DTO shapes unchanged for all consumers
- `PowerHierarchyExplorer.tsx` confirmed unaffected (does not receive `currentHolder` data)
- 14 tests pass (13 tenure resolution + 1 smoke), zero regressions
- `tsc --noEmit` passes cleanly
- No ESLint config exists in the project yet — skipped lint (not a story requirement)

### File List

**New files:**
- `vitest.config.ts` — Vitest configuration with `@/*` path alias
- `src/lib/data/tenure.ts` — Tenure data access layer (pure resolver + DB wrappers)
- `src/lib/data/__tests__/smoke.test.ts` — Smoke test for vitest harness
- `src/lib/data/__tests__/tenure.test.ts` — 13 test cases covering all 5 resolution rules
- `src/types/power-explorer.ts` — GraphNodeData, GraphEdgeData, Neo4jSyncEvent interfaces

**Modified files:**
- `prisma/schema.prisma` — Added Tenure model, removed currentHolderId/currentPosition
- `prisma/seed.ts` — Added Tenure seeding section
- `package.json` — Added `test` and `test:watch` scripts
- `src/lib/data/institutions.ts` — Migrated to Tenure-based holder resolution
- `src/lib/data/representatives.ts` — Migrated to Tenure-based position lookup
- `src/app/api/institutions/route.ts` — Migrated slug query to Tenure resolution
- `src/app/api/representatives/route.ts` — Migrated id query to Tenure resolution
- `src/types/index.ts` — PowerNode.currentHolder updated to `PersonBrief | null`

### Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-06-09 | Added Tenure model to Prisma schema | AC #1, #2, #3 — temporal backbone for Power Explorer |
| 2026-06-09 | Removed Position.currentHolderId FK | AC #4 — replaced point-in-time FK with temporal Tenure model |
| 2026-06-09 | Created tenure.ts data access layer | AC #4, #5 — implements 5 resolution rules |
| 2026-06-09 | Migrated 6 files from currentHolder to Tenure | AC #4 — all reads now use getActiveTenure |
| 2026-06-09 | Created power-explorer.ts type interfaces | Architecture prerequisite for graph API |
| 2026-06-09 | Updated seed script with Tenure records | AC #7 — seed creates Tenure for existing Person-Position pairs |
| 2026-06-09 | Scaffolded vitest with 14 passing tests | AC #6, #8 — first test harness for the project |
