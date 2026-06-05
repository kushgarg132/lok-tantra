# ETL Pipelines & Data Ingestion

LokTantra does not rely on user-generated content. All civic data is sourced from official government portals using automated ETL pipelines orchestrated by BullMQ.

---

## 1. Pipeline Architecture

```
Cron Scheduler (src/worker/scheduler.ts)
    │  enqueues jobs on schedule
    ▼
BullMQ Queue  (Redis-backed — src/lib/etl/queue.ts)
    │  consume
    ▼
ETL Worker  (src/worker/index.ts)
    │  routes to ingestor by source
    ▼
Ingestor  (src/lib/etl/ingestors/)
    ├── Extract   (HTTP fetch / Puppeteer / PDF parser / RSS)
    ├── Transform (NormalizationEngine — dedup, fuzzy match, enrichment)
    └── Load      (Prisma upserts + DataProvenance record)
    │  writes to
    ▼
PostgreSQL (source of truth)
```

The worker process is started independently from the Next.js app:
```bash
npm run worker
```

---

## 2. Data Sources & Schedules

| Source | Domain | Frequency | Tech |
|--------|--------|-----------|------|
| **ADR / MyNeta** (myneta.info) | MP/MLA criminal records, assets | Monthly | Cheerio scraper |
| **ECI** (results.eci.gov.in) | Election results, constituency data | On election + daily | API + Puppeteer |
| **PRS Legislative Research** | Bills, legislation, Parliament sessions | Every 6 hours | RSS + Cheerio |
| **India Code** (indiacode.nic.in) | Acts and Rules | Weekly | REST API |
| **Supreme Court** (sci.gov.in) | Judgment metadata | Daily | PDF parser (`pdf-parse`) |
| **Image Ingest** | Entity profile photos and logos | On-demand | AWS S3 / Cloudflare R2 |

---

## 3. Queue Configuration (`src/lib/etl/queue.ts`)

Default job options for all ETL jobs:
```typescript
{
  attempts: 3,
  backoff: { type: "exponential", delay: 5000 },
  removeOnComplete: 100,  // keep last 100 completed jobs
  removeOnFail: 1000,     // keep last 1000 failed jobs for debugging
}
```

**Known gap**: There is no dead-letter queue (DLQ) handler. Failed jobs that exhaust all retries accumulate silently in the `removeOnFail` window with no alerting. A DLQ consumer with observability alerting is planned (see [AUDIT.md](../AUDIT.md)).

---

## 4. Ingestors

### `adr.ingestor.ts` — ADR / MyNeta
Scrapes criminal records and financial disclosures for MPs and MLAs.

Key steps:
1. Fetch candidate list from ADR CSV export
2. Match each candidate to existing `Person` record using `NormalizationEngine` (fuzzy name + state/constituency matching)
3. Upsert `Person` record with `criminalCases` and `assets` JSON fields
4. Create `DataProvenance` record linking to the ADR `DataSource`

**Known gap**: Multi-step upsert is not wrapped in `prisma.$transaction()`. If the provenance write fails, the person record is updated without a provenance trail.

---

### `eci.ingestor.ts` — Election Commission of India
Ingests election results for Lok Sabha and Vidhan Sabha elections.

Key steps:
1. Fetch constituency list and result data from ECI API or scraped HTML
2. Upsert `StateUT` and `Constituency` records
3. Upsert `Election` record
4. Loop through candidates: match `Person` via normalization, upsert `ElectionCandidate` and `ElectionResult`
5. Create `DataProvenance` records for the batch

**Known gap**: The candidate loop is not transactional — partial failure leaves the database in a partially-ingested state for the election. Checkpoint/resume is not implemented; retries restart from the beginning.

---

### `prs.ingestor.ts` — PRS Legislative Research
Ingests bills and legislative tracking data.

Key steps:
1. Fetch latest bills from PRS RSS feed or API
2. Parse bill metadata (title, type, chamber, status, ministry)
3. Match introducing person to `Person` record via normalization
4. Upsert `Bill` record

---

### `india-code.ingestor.ts` — India Code
Ingests enacted Acts and their textual content from the official India Code API.

Key steps:
1. Fetch act list from `indiacode.nic.in` API
2. Upsert `Act` records with enacted date
3. Link to related `Bill` where available

---

## 5. Normalization Engine (`src/lib/etl/normalization.ts`)

The NormalizationEngine resolves ambiguous entity references (e.g., "Narendra Modi" vs "Sh. Narendra Damodardas Modi") using fuzzy matching.

### Person Deduplication
1. Query candidate persons from PostgreSQL filtered by `stateCode` and `constituency`
2. Run Fuse.js fuzzy match on `name` field against the candidate set
3. Return the best match above a confidence threshold, or `null` (→ create new person)

**Known performance gap**: Fuse.js matching runs in-memory against a database-fetched result set. As the `Person` table grows to thousands of records, the `findMany` + in-memory match becomes an O(n) scan. Plan: add a `pg_trgm` GIN index on `Person.name` and replace with a native PostgreSQL `SIMILARITY` query.

### Conflict Resolution
When multiple sources provide conflicting data for the same entity:
1. Source authority hierarchy: `ECI > PRS > ADR > News`
2. Higher-confidence source data is applied
3. A `ConflictEvent` is flagged in `EntityEvent` for admin review
4. The conflicted entity is surfaced in the admin observability dashboard

---

## 6. Provenance Engine

Every ingested or updated entity must create a `DataProvenance` record:

```typescript
await prisma.dataProvenance.create({
  data: {
    entityType: "Person",
    entityId:   person.id,
    sourceId:   adrSource.id,
    fetchedAt:  new Date(),
    confidence: 0.95,
    rawData:    { criminal_cases: 2, assets: "5 Cr" },
  },
});
```

This ensures every fact in LokTantra is traceable to an official source with a timestamp and confidence score.

---

## 7. Scheduler (`src/worker/scheduler.ts`)

Repeatable cron jobs are registered at worker startup using BullMQ's `repeat` option with a stable `jobId` for deduplication:

```typescript
queue.add("scrape-adr",  {}, { repeat: { pattern: "0 2 1 * *" }, jobId: "cron-adr-myneta"  });
queue.add("scrape-eci",  {}, { repeat: { pattern: "0 0 * * *" }, jobId: "cron-eci-portal"  });
queue.add("scrape-prs",  {}, { repeat: { pattern: "0 */6 * * *" }, jobId: "cron-prs-india" });
```

**Known gap**: `jobId`-based deduplication is per-instance. In a multi-worker horizontal deployment, two workers may race to register the same repeatable job at startup. Plan: wrap scheduler startup in a Redlock distributed lock.

---

## 8. Observability

Each ETL run writes a `ScraperRun` record to PostgreSQL and a log entry to the Redis `obs:logs` list. The admin observability dashboard at `/admin/observability` surfaces:
- Last run timestamp and status per source
- Success/failure counters
- Data freshness evaluation (how stale is each domain's data?)
- Queue depth per BullMQ job type

---

## 9. Adding a New Ingestor

1. Create `src/lib/etl/ingestors/my-source.ingestor.ts` implementing the ingestor interface
2. Add a `DataSource` record in `prisma/seed.ts` for the new source
3. Register the job processor in `src/worker/index.ts`
4. Add a repeatable job in `src/worker/scheduler.ts`
5. Document the source and schedule in this file

**Required**: All new ingestors must wrap their multi-step DB operations in `prisma.$transaction()` to ensure atomicity.
