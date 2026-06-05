import Redis from "ioredis";

export interface DiagnosticCheck {
  name:       string;
  status:     "ok" | "warn" | "error";
  message:    string;
  latencyMs?: number;
  detail?:    unknown;
}

export interface SystemDiagnostics {
  overall: "healthy" | "degraded" | "critical";
  checks:  DiagnosticCheck[];
  ts:      number;
}

async function checkRedis(): Promise<DiagnosticCheck> {
  const t0 = Date.now();
  let r: Redis | null = null;
  try {
    r = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      connectTimeout: 3000, lazyConnect: false, maxRetriesPerRequest: 1,
    });
    await r.ping();
    return { name: "Redis", status: "ok", message: "Connected", latencyMs: Date.now() - t0 };
  } catch (err) {
    return { name: "Redis", status: "error", message: `Unreachable: ${(err as Error).message}`, latencyMs: Date.now() - t0 };
  } finally {
    try { r?.disconnect(); } catch {}
  }
}

async function checkDatabase(): Promise<DiagnosticCheck> {
  const t0 = Date.now();
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.$queryRaw`SELECT 1`;
    return { name: "PostgreSQL", status: "ok", message: "Connected", latencyMs: Date.now() - t0 };
  } catch (err) {
    return { name: "PostgreSQL", status: "error", message: `Unreachable: ${(err as Error).message}`, latencyMs: Date.now() - t0 };
  }
}

async function checkElasticSearch(): Promise<DiagnosticCheck> {
  const t0 = Date.now();
  try {
    const { getESClient } = await import("@/lib/search/client");
    const client = getESClient();
    if (!client) return { name: "ElasticSearch", status: "warn", message: "ELASTICSEARCH_URL not configured" };
    const health = await client.cluster.health({ timeout: "3s" });
    const status = health.status === "red" ? "error" : health.status === "yellow" ? "warn" : "ok";
    return {
      name:      "ElasticSearch",
      status,
      message:   `Cluster ${health.status}, ${health.number_of_nodes} node(s)`,
      latencyMs: Date.now() - t0,
      detail:    { activeShards: health.active_shards },
    };
  } catch (err) {
    return { name: "ElasticSearch", status: "error", message: `Unreachable: ${(err as Error).message}`, latencyMs: Date.now() - t0 };
  }
}

async function checkQueues(): Promise<DiagnosticCheck> {
  const t0 = Date.now();
  try {
    const { apiFetchQueue, scrapeHtmlQueue, pdfOcrQueue, imageIngestQueue } = await import("@/lib/etl/queue");
    const [api, scrape, pdf, img] = await Promise.all([
      apiFetchQueue.getJobCounts(),
      scrapeHtmlQueue.getJobCounts(),
      pdfOcrQueue.getJobCounts(),
      imageIngestQueue.getJobCounts(),
    ]);

    const totalFailed  = (api.failed  ?? 0) + (scrape.failed  ?? 0) + (pdf.failed  ?? 0) + (img.failed  ?? 0);
    const totalWaiting = (api.waiting ?? 0) + (scrape.waiting ?? 0) + (pdf.waiting ?? 0) + (img.waiting ?? 0);
    const status: DiagnosticCheck["status"] = totalFailed > 100 ? "error" : totalFailed > 20 ? "warn" : "ok";

    return {
      name:      "BullMQ Queues",
      status,
      message:   `${totalWaiting} waiting, ${totalFailed} failed across 4 queues`,
      latencyMs: Date.now() - t0,
      detail:    { "api-fetch": api, "scrape-html": scrape, "pdf-ocr": pdf, "image-ingest": img },
    };
  } catch (err) {
    return { name: "BullMQ Queues", status: "error", message: `Queue check failed: ${(err as Error).message}` };
  }
}

async function checkDataFreshness(): Promise<DiagnosticCheck> {
  try {
    const { getDataFreshness } = await import("./freshness");
    const entries = await getDataFreshness();
    if (entries.length === 0) return { name: "Data Freshness", status: "warn", message: "No data sources registered" };
    const stale = entries.filter((e) => e.status === "stale" || e.status === "never");
    return {
      name:    "Data Freshness",
      status:  stale.length > 3 ? "error" : stale.length > 0 ? "warn" : "ok",
      message: stale.length > 0 ? `${stale.length} source(s) are stale or never fetched` : `All ${entries.length} sources fresh`,
      detail:  { stale: stale.map((s) => s.source) },
    };
  } catch (err) {
    return { name: "Data Freshness", status: "warn", message: `Could not check: ${(err as Error).message}` };
  }
}

export async function runDiagnostics(): Promise<SystemDiagnostics> {
  const checks = await Promise.all([
    checkRedis(),
    checkDatabase(),
    checkElasticSearch(),
    checkQueues(),
    checkDataFreshness(),
  ]);

  const critCount = checks.filter((c) => c.status === "error").length;
  const warnCount = checks.filter((c) => c.status === "warn").length;

  const overall: SystemDiagnostics["overall"] =
    critCount >= 2 ? "critical" :
    critCount >= 1 || warnCount >= 3 ? "degraded" :
    "healthy";

  return { overall, checks, ts: Date.now() };
}
