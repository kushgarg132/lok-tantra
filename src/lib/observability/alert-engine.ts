import Redis from "ioredis";

export interface AlertRule {
  id:       string;
  name:     string;
  severity: "critical" | "warning" | "info";
  check:    () => Promise<{ fired: boolean; message?: string; context?: Record<string, unknown> }>;
}

let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (_redis) return _redis;
  try {
    _redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      lazyConnect: true, connectTimeout: 2000, enableOfflineQueue: false, maxRetriesPerRequest: 1,
    });
    _redis.on("error", () => {});
    return _redis;
  } catch { return null; }
}

export const ALERT_RULES: AlertRule[] = [
  {
    id: "scraper-down",
    name: "Scraper Source Down",
    severity: "critical",
    check: async () => {
      const { getScraperHealth } = await import("./scraper-run");
      const health = await getScraperHealth();
      const down = health.filter((h) => h.status === "down");
      if (down.length === 0) return { fired: false };
      return {
        fired:   true,
        message: `${down.length} scraper source(s) are down: ${down.map((d) => d.source).join(", ")}`,
        context: { sources: down.map((d) => d.source) },
      };
    },
  },
  {
    id: "scraper-degraded",
    name: "Scraper Degraded",
    severity: "warning",
    check: async () => {
      const { getScraperHealth } = await import("./scraper-run");
      const health = await getScraperHealth();
      const degraded = health.filter((h) => h.status === "degraded");
      if (degraded.length === 0) return { fired: false };
      return {
        fired:   true,
        message: `${degraded.length} source(s) degraded: ${degraded.map((d) => d.source).join(", ")}`,
        context: { sources: degraded.map((d) => d.source) },
      };
    },
  },
  {
    id: "high-error-rate",
    name: "High Job Error Rate",
    severity: "warning",
    check: async () => {
      try {
        const { prisma } = await import("@/lib/db");
        const since = new Date(Date.now() - 3600000);
        const [failed, total] = await Promise.all([
          (prisma as any).scraperRun.count({ where: { status: "failed", startedAt: { gte: since } } }),
          (prisma as any).scraperRun.count({ where: { startedAt: { gte: since } } }),
        ]);
        if (total > 5 && failed / total > 0.3) {
          return {
            fired:   true,
            message: `Job error rate is ${((failed / total) * 100).toFixed(0)}% (${failed}/${total} in last hour)`,
            context: { failed, total },
          };
        }
      } catch {}
      return { fired: false };
    },
  },
  {
    id: "stale-data",
    name: "Stale Data Sources",
    severity: "info",
    check: async () => {
      try {
        const { prisma } = await import("@/lib/db");
        const cutoff = new Date(Date.now() - 7 * 24 * 3600000);
        const stale = await prisma.dataSource.findMany({
          where: {
            OR: [{ lastFetchedAt: null }, { lastFetchedAt: { lt: cutoff } }],
          },
        });
        if (stale.length === 0) return { fired: false };
        return {
          fired:   true,
          message: `${stale.length} data source(s) not refreshed in 7+ days`,
          context: { sources: stale.map((s) => s.name) },
        };
      } catch {}
      return { fired: false };
    },
  },
  {
    id: "queue-backlog",
    name: "Queue Backlog",
    severity: "warning",
    check: async () => {
      try {
        const { getQueueDepths } = await import("./recovery");
        const depths = await getQueueDepths();
        let totalWaiting = 0;
        for (const counts of Object.values(depths)) {
          totalWaiting += (counts.waiting ?? 0) + (counts.delayed ?? 0);
        }
        if (totalWaiting > 500) {
          return {
            fired:   true,
            message: `Queue backlog: ${totalWaiting} jobs waiting across all queues`,
            context: { totalWaiting, depths },
          };
        }
      } catch {}
      return { fired: false };
    },
  },
];

export type AlertEvaluation = {
  rule:     AlertRule;
  fired:    boolean;
  message?: string;
  context?: Record<string, unknown>;
};

export async function evaluateAlerts(): Promise<AlertEvaluation[]> {
  const settled = await Promise.allSettled(
    ALERT_RULES.map(async (rule) => {
      const result = await rule.check();
      return { rule, ...result };
    })
  );

  const results: AlertEvaluation[] = settled
    .filter((r): r is PromiseFulfilledResult<AlertEvaluation> => r.status === "fulfilled")
    .map((r) => r.value);

  const r = getRedis();
  for (const ev of results) {
    const stateKey = `obs:alert:active:${ev.rule.id}`;
    if (!ev.fired) {
      if (r) await r.del(stateKey).catch(() => {});
      continue;
    }
    const existing = r ? await r.get(stateKey).catch(() => null) : null;
    if (!existing) {
      if (r) await r.set(stateKey, "1", "EX", 900).catch(() => {});
      try {
        const { prisma } = await import("@/lib/db");
        await (prisma as any).alertEvent.create({
          data: {
            rule:     ev.rule.id,
            severity: ev.rule.severity,
            message:  ev.message ?? ev.rule.name,
            context:  ev.context ?? null,
          },
        });
      } catch {}
    }
  }

  return results;
}

export async function getRecentAlerts(limit = 50): Promise<Array<{
  id: string; rule: string; severity: string; message: string;
  context: unknown; resolvedAt: Date | null; createdAt: Date;
}>> {
  try {
    const { prisma } = await import("@/lib/db");
    return await (prisma as any).alertEvent.findMany({
      orderBy: { createdAt: "desc" },
      take:    limit,
    });
  } catch { return []; }
}
