# ETL Pipelines & Data Ingestion

LokTantra does not rely on user-generated content. All data is scraped, parsed, and ingested from official government sources using automated ETL (Extract, Transform, Load) pipelines orchestrated by BullMQ.

## 1. Pipeline Architecture

The ETL system is split into four distinct phases:
1. **Extractors**: Source-specific scrapers/API clients.
2. **Transformers**: Normalization, deduplication, and AI-powered entity extraction.
3. **Loaders**: Idempotent upserts to PostgreSQL, triggering Redis events.
4. **Quality Gates**: Bias detection, confidence scoring, and source attribution.

## 2. Data Sources & Schedules

| Data Domain | Primary Source | Extraction Frequency | Tech Used |
|---|---|---|---|
| **Election Results** | ECI (results.eci.gov.in) | On election / Daily | Puppeteer / API |
| **Legislation/Bills** | PRS Legislative Research | Every 6 hours | RSS / Cheerio |
| **Parliament Sessions** | sansad.in | Hourly during session | Cheerio |
| **Supreme Court** | sci.gov.in | Daily | PDF Parser |
| **Acts & Rules** | indiacode.nic.in | Weekly | API |
| **MP/MLA Profiles** | ADR / PRS | Monthly | Scraper |

## 3. The Provenance Engine

Every fact in LokTantra must be traceable. When the `PostgresLoader` inserts or updates an entity, it creates a `DataProvenance` record.

### Provenance Schema Example
```json
{
  "entityType": "Person",
  "entityId": "per_12345",
  "sourceId": "src_adr",
  "fetchedAt": "2026-06-05T10:00:00Z",
  "confidence": 0.95,
  "rawData": { "criminal_cases": 2, "assets": "5 Cr" }
}
```

## 4. Conflict Resolution

When multiple sources provide conflicting data (e.g., Lok Sabha website vs. ADR data regarding an MP's educational qualification):
1. The Transformer flags a **Conflict Event**.
2. A predefined hierarchy of source authority is applied (e.g., ECI > PRS > News).
3. If the conflict is unresolved, the entity is flagged for manual review in the Admin Dashboard, but the higher-confidence data is temporarily loaded.
