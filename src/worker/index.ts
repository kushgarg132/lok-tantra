import { Worker } from "bullmq";
import { redisConnection } from "../lib/etl/queue";
import { ADRIngestor } from "../lib/etl/ingestors/adr.ingestor";
import { ECIIngestor } from "../lib/etl/ingestors/eci.ingestor";
import { PRSIngestor } from "../lib/etl/ingestors/prs.ingestor";
import { IndiaCodeIngestor } from "../lib/etl/ingestors/india-code.ingestor";
import { SupremeCourtIngestor } from "../lib/etl/ingestors/supreme-court.ingestor";
import { ingestEntityMedia, refreshStaleAssets } from "../lib/media/ingestion";
import type { IngestJobData } from "../lib/media/types";
import { createLogger } from "../lib/observability/logger";
import { withJobInstrumentation } from "../lib/observability/instrumentation";

const log = createLogger("WORKER");
log.info("Starting LokTantra ETL Worker Process");

// ── 1. API Fetch Worker ──────────────────────────────────────────────────────
const apiFetchWorker = new Worker(
  "api-fetch",
  async (job) => {
    if (job.name === "prs-mp-track") {
      return withJobInstrumentation(
        async () => {
          const ingestor = new PRSIngestor();
          await ingestor.processMPPerformance(job.data.url);
          return { success: true };
        },
        { source: "PRS_INDIA", jobId: job.id },
      );
    }

    if (job.name === "india-code-act") {
      return withJobInstrumentation(
        async () => {
          const ingestor = new IndiaCodeIngestor();
          await ingestor.processActAPI(job.data.actId);
          return { success: true };
        },
        { source: "INDIA_CODE_API", jobId: job.id },
      );
    }

    if (job.name === "dummy-job") {
      log.info("Executing dummy job", { payload: job.data }, { jobId: job.id });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true, processed: job.data };
    }

    throw new Error(`Unknown api-fetch job: ${job.name}`);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { connection: redisConnection as any, concurrency: 5 },
);

// ── 2. HTML Scraper Worker ───────────────────────────────────────────────────
const scrapeHtmlWorker = new Worker(
  "scrape-html",
  async (job) => {
    if (job.name === "adr-myneta") {
      return withJobInstrumentation(
        async () => {
          const ingestor = new ADRIngestor();
          await ingestor.processCandidatePage(job.data.url);
          return { success: true };
        },
        { source: "ADR_MYNETA", jobId: job.id },
      );
    }

    if (job.name === "eci-results") {
      return withJobInstrumentation(
        async () => {
          const ingestor = new ECIIngestor();
          await ingestor.processConstituencyResults(job.data.url, job.data.year, job.data.type);
          return { success: true };
        },
        { source: "ECI_PORTAL", jobId: job.id },
      );
    }

    throw new Error(`Unknown scrape-html job: ${job.name}`);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { connection: redisConnection as any, concurrency: 2 },
);

// ── 3. PDF OCR Worker ────────────────────────────────────────────────────────
const pdfOcrWorker = new Worker(
  "pdf-ocr",
  async (job) => {
    if (job.name === "supreme-court-judgment") {
      return withJobInstrumentation(
        async () => {
          const ingestor = new SupremeCourtIngestor();
          await ingestor.processJudgmentPDF(
            job.data.pdfUrl, job.data.caseName, job.data.year, job.data.citation,
          );
          return { success: true };
        },
        { source: "SUPREME_COURT", jobId: job.id },
      );
    }

    throw new Error(`Unknown pdf-ocr job: ${job.name}`);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { connection: redisConnection as any, concurrency: 1 },
);

// ── 4. Image Ingest Worker ───────────────────────────────────────────────────
const imageIngestWorker = new Worker(
  "image-ingest",
  async (job) => {
    if (job.name === "ingest-entity") {
      const data = job.data as IngestJobData;
      return withJobInstrumentation(
        async () => {
          const result = await ingestEntityMedia(data);
          if (!result.success) {
            log.warn(`No image found for ${data.entityType}:${data.entityId}`, { error: result.error }, { jobId: job.id });
          }
          return result;
        },
        { source: "IMAGE_INGEST", jobId: job.id },
      );
    }

    if (job.name === "refresh-stale") {
      const { olderThanDays = 30 } = job.data as { olderThanDays?: number };
      return withJobInstrumentation(
        () => refreshStaleAssets(olderThanDays),
        { source: "IMAGE_INGEST", jobId: job.id },
      );
    }

    throw new Error(`Unknown image-ingest job: ${job.name}`);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { connection: redisConnection as any, concurrency: 3 },
);

// ── Structured event logging for all workers ─────────────────────────────────
for (const [worker, name] of [
  [apiFetchWorker,    "api-fetch"   ],
  [scrapeHtmlWorker,  "scrape-html" ],
  [pdfOcrWorker,      "pdf-ocr"     ],
  [imageIngestWorker, "image-ingest"],
] as const) {
  const wlog = createLogger(`QUEUE:${name}`);
  worker.on("completed", (job)      => wlog.info("Job completed", { jobId: job.id,  jobName: job.name }));
  worker.on("failed",    (job, err) => wlog.error("Job failed",   { jobId: job?.id, jobName: job?.name, error: err.message }));
  worker.on("stalled",   (jobId)    => wlog.warn("Job stalled",   { jobId }));
}

// ── Graceful Shutdown ────────────────────────────────────────────────────────
process.on("SIGINT", async () => {
  log.info("Shutting down workers gracefully");
  await Promise.allSettled([
    apiFetchWorker.close(),
    scrapeHtmlWorker.close(),
    pdfOcrWorker.close(),
    imageIngestWorker.close(),
  ]);
  redisConnection.disconnect();
  process.exit(0);
});
