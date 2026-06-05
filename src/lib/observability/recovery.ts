import { apiFetchQueue, scrapeHtmlQueue, pdfOcrQueue, imageIngestQueue } from "@/lib/etl/queue";

export type QueueName = "api-fetch" | "scrape-html" | "pdf-ocr" | "image-ingest";

function resolveQueue(name: QueueName) {
  switch (name) {
    case "api-fetch":    return apiFetchQueue;
    case "scrape-html":  return scrapeHtmlQueue;
    case "pdf-ocr":      return pdfOcrQueue;
    case "image-ingest": return imageIngestQueue;
  }
}

export interface RecoveryResult {
  queue:    QueueName;
  requeued: number;
  errors:   number;
}

export async function requeueFailed(queueName: QueueName, limit = 50): Promise<RecoveryResult> {
  const queue = resolveQueue(queueName);
  let requeued = 0;
  let errors   = 0;

  try {
    const jobs = await queue.getFailed(0, limit - 1);
    const settled = await Promise.allSettled(jobs.map((j) => j.retry("failed")));
    for (const r of settled) {
      if (r.status === "fulfilled") requeued++;
      else errors++;
    }
  } catch { errors++; }

  return { queue: queueName, requeued, errors };
}

export async function requeueAllFailed(limit = 50): Promise<RecoveryResult[]> {
  const names: QueueName[] = ["api-fetch", "scrape-html", "pdf-ocr", "image-ingest"];
  return Promise.all(names.map((q) => requeueFailed(q, limit)));
}

export async function drainQueue(queueName: QueueName): Promise<{ drained: number }> {
  const queue = resolveQueue(queueName);
  let drained = 0;
  try {
    const waiting = await queue.getWaiting();
    const settled = await Promise.allSettled(waiting.map((j) => j.remove()));
    drained = settled.filter((r) => r.status === "fulfilled").length;
  } catch {}
  return { drained };
}

export async function getQueueDepths(): Promise<Record<QueueName, Record<string, number>>> {
  const [api, scrape, pdf, img] = await Promise.all([
    apiFetchQueue.getJobCounts(),
    scrapeHtmlQueue.getJobCounts(),
    pdfOcrQueue.getJobCounts(),
    imageIngestQueue.getJobCounts(),
  ]);
  return {
    "api-fetch":   api,
    "scrape-html": scrape,
    "pdf-ocr":     pdf,
    "image-ingest": img,
  };
}
