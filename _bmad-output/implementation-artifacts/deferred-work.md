# Deferred Work

## Deferred from: code review of 1-1-tenure-data-model-and-test-harness (2026-06-09)

- **Seed tenures hardcoded to single date and mechanism** — All seed tenure records use startDate 2024-06-10 and mechanism "appointed" regardless of actual position type (elected officials like PM shown as "appointed"). Derive dates from person/position metadata and mechanism from branch.
- **API routes return 200 with null instead of 404** — `/api/institutions?slug=...` and `/api/representatives?id=...` return `{ data: null }` with HTTP 200 for non-existent resources. Should return 404.
- **Promise.all without error isolation** — `getInstitutionTree()`, `getInstitutionBySlug()`, and the institutions API route use `Promise.all` for tenure resolution. A single `getActiveTenure` failure causes the entire request to 500. Use `Promise.allSettled` or per-position try-catch.
- **Institution positions/children silently truncated** — `take: 10` on positions and `take: 20` on children in the institutions API route silently drops data without signaling incompleteness. Consider pagination or removing limits.
- **DB-backed getActiveTenure not directly tested** — Only the pure `resolveActiveTenure` function is tested. The DB wrapper `getActiveTenure` is untested — if the Prisma query drifts from the pure function's logic, tests would still pass.
- **Duplicate tenure resolution logic in API route vs data layer** — The institutions API route (`route.ts`) reimplements the currentHolder mapping that already exists in `institutions.ts` data layer, with slightly different party field selection. Should call data layer and reshape at the API boundary.
- **Migration parity integration test** — AC #8 migration parity test deferred because old `currentHolderId` path was removed, leaving no comparison target. Add an integration test when a test-DB strategy is established to verify `getActiveTenure` DB queries match `resolveActiveTenure` pure function results.
