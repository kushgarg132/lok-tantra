import { Queue, QueueOptions } from "bullmq";
import Redis from "ioredis";

// Centralized Redis connection for BullMQ
export const redisConnection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null, // Required by BullMQ
});

const defaultQueueOptions: QueueOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, // Wait 5s, 25s, 125s on failures
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 1000,    // Keep last 1000 failed jobs for debugging
  },
};

// Queue for simple API polling and JSON responses (PRS, India Code)
export const apiFetchQueue = new Queue("api-fetch", defaultQueueOptions);

// Queue for heavy DOM parsing and Cheerio/Puppeteer scraping (ECI, Rajya Sabha)
export const scrapeHtmlQueue = new Queue("scrape-html", defaultQueueOptions);

// Queue for extremely CPU-intensive PDF parsing and OCR (Supreme Court, Affidavits)
export const pdfOcrQueue = new Queue("pdf-ocr", defaultQueueOptions);

// Queue for media ingestion: image fetch, validate, process, and store
export const imageIngestQueue = new Queue("image-ingest", {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    attempts: 2,               // Images fail for many reasons; 2 tries is enough
    backoff: { type: "exponential", delay: 10_000 },
    removeOnComplete: 200,
    removeOnFail: 500,
  },
});

/**
 * Utility to gracefully close all queues (used in worker shutdown)
 */
export async function closeQueues() {
  await apiFetchQueue.close();
  await scrapeHtmlQueue.close();
  await pdfOcrQueue.close();
  await imageIngestQueue.close();
  redisConnection.disconnect();
}
