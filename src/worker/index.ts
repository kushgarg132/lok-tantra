import { Worker } from "bullmq";
import { redisConnection } from "../lib/etl/queue";
import { ADRIngestor } from "../lib/etl/ingestors/adr.ingestor";
import { ECIIngestor } from "../lib/etl/ingestors/eci.ingestor";
import { PRSIngestor } from "../lib/etl/ingestors/prs.ingestor";
import { IndiaCodeIngestor } from "../lib/etl/ingestors/india-code.ingestor";
import { SupremeCourtIngestor } from "../lib/etl/ingestors/supreme-court.ingestor";
import { ingestEntityMedia, refreshStaleAssets } from "../lib/media/ingestion";
import type { IngestJobData } from "../lib/media/types";

console.log("Starting LokTantra ETL Worker Process...");

// 1. API Fetch Worker
const apiFetchWorker = new Worker(
  "api-fetch",
  async (job) => {
    console.log(`[API-FETCH] Processing job ${job.id}: ${job.name}`);
    
    if (job.name === "prs-mp-track") {
      const ingestor = new PRSIngestor();
      await ingestor.processMPPerformance(job.data.url);
      return { success: true, processed: job.data.url };
    }

    if (job.name === "india-code-act") {
      const ingestor = new IndiaCodeIngestor();
      await ingestor.processActAPI(job.data.actId);
      return { success: true };
    }

    if (job.name === "dummy-job") {
      console.log("[API-FETCH] Executing dummy job payload:", job.data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true, processed: job.data };
    }

    throw new Error(`Unknown job name: ${job.name}`);
  },
  { connection: redisConnection, concurrency: 5 }
);

// 2. HTML Scraper Worker
const scrapeHtmlWorker = new Worker(
  "scrape-html",
  async (job) => {
    console.log(`[SCRAPE] Processing job ${job.id}: ${job.name}`);
    
    if (job.name === "adr-myneta") {
      const ingestor = new ADRIngestor();
      await ingestor.processCandidatePage(job.data.url);
      return { success: true };
    }

    if (job.name === "eci-results") {
      const ingestor = new ECIIngestor();
      await ingestor.processConstituencyResults(job.data.url, job.data.year, job.data.type);
      return { success: true };
    }

    throw new Error(`Unknown job name: ${job.name}`);
  },
  { connection: redisConnection, concurrency: 2 } // Lower concurrency for heavy Puppeteer
);

// 3. PDF OCR Worker
const pdfOcrWorker = new Worker(
  "pdf-ocr",
  async (job) => {
    console.log(`[OCR] Processing job ${job.id}: ${job.name}`);
    
    if (job.name === "supreme-court-judgment") {
      const ingestor = new SupremeCourtIngestor();
      await ingestor.processJudgmentPDF(job.data.pdfUrl, job.data.caseName, job.data.year, job.data.citation);
      return { success: true };
    }

    throw new Error(`Unknown job name: ${job.name}`);
  },
  { connection: redisConnection, concurrency: 1 } // CPU bound, limit to 1 per core
);

// 4. Image Ingest Worker
const imageIngestWorker = new Worker(
  "image-ingest",
  async (job) => {
    console.log(`[IMAGE] Processing job ${job.id}: ${job.name}`);

    if (job.name === "ingest-entity") {
      const data = job.data as IngestJobData;
      const result = await ingestEntityMedia(data);
      if (!result.success) {
        console.warn(`[IMAGE] No image found for ${data.entityType}:${data.entityId} — ${result.error}`);
      }
      return result;
    }

    if (job.name === "refresh-stale") {
      const { olderThanDays = 30 } = job.data as { olderThanDays?: number };
      return refreshStaleAssets(olderThanDays);
    }

    throw new Error(`Unknown image-ingest job name: ${job.name}`);
  },
  {
    connection: redisConnection,
    concurrency: 3, // Limited: downloads + Sharp processing are I/O + CPU heavy
  }
);

// Event Listeners for Observability
apiFetchWorker.on("completed", (job) => {
  console.log(`[API-FETCH] Job ${job.id} completed.`);
});

apiFetchWorker.on("failed", (job, err) => {
  console.error(`[API-FETCH] Job ${job?.id} failed:`, err.message);
});

imageIngestWorker.on("completed", (job, result) => {
  const r = result as { success: boolean; assetId?: string };
  if (r?.success) {
    console.log(`[IMAGE] Job ${job.id} completed — asset ${r.assetId}`);
  }
});

imageIngestWorker.on("failed", (job, err) => {
  console.error(`[IMAGE] Job ${job?.id} failed:`, err.message);
});

// Graceful Shutdown Handler
process.on("SIGINT", async () => {
  console.log("Shutting down workers gracefully...");
  await apiFetchWorker.close();
  await scrapeHtmlWorker.close();
  await pdfOcrWorker.close();
  await imageIngestWorker.close();
  redisConnection.disconnect();
  process.exit(0);
});
