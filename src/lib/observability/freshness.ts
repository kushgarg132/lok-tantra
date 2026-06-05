const FRESH_H  = 24;
const AGING_H  = 72;

export interface FreshnessEntry {
  source:      string;
  url:         string;
  lastFetched: Date | null;
  ageHours:    number | null;
  status:      "fresh" | "aging" | "stale" | "never";
  fetchCount:  number;
  srcStatus:   string;
}

export async function getDataFreshness(): Promise<FreshnessEntry[]> {
  try {
    const { prisma } = await import("@/lib/db");
    const sources = await prisma.dataSource.findMany({ orderBy: { name: "asc" } });

    return sources.map((s): FreshnessEntry => {
      const ageMs    = s.lastFetchedAt ? Date.now() - s.lastFetchedAt.getTime() : null;
      const ageHours = ageMs != null ? ageMs / 3600000 : null;
      const status: FreshnessEntry["status"] =
        ageHours == null      ? "never"  :
        ageHours < FRESH_H   ? "fresh"  :
        ageHours < AGING_H   ? "aging"  :
        "stale";

      return {
        source:      s.name,
        url:         s.url,
        lastFetched: s.lastFetchedAt,
        ageHours,
        status,
        fetchCount:  s.fetchCount,
        srcStatus:   s.status,
      };
    });
  } catch { return []; }
}

export interface ProvenanceSummary {
  entityType: string;
  total:      number;
  verified:   number;
  pending:    number;
  rejected:   number;
}

export async function getProvenanceSummary(): Promise<ProvenanceSummary[]> {
  try {
    const { prisma } = await import("@/lib/db");
    const groups = await prisma.dataProvenance.groupBy({
      by:     ["entityType", "verificationStatus"],
      _count: { _all: true },
    });

    const byType = new Map<string, ProvenanceSummary>();
    for (const g of groups) {
      if (!byType.has(g.entityType)) {
        byType.set(g.entityType, { entityType: g.entityType, total: 0, verified: 0, pending: 0, rejected: 0 });
      }
      const entry = byType.get(g.entityType)!;
      entry.total += g._count._all;
      if (g.verificationStatus === "VERIFIED") entry.verified  += g._count._all;
      if (g.verificationStatus === "PENDING")  entry.pending   += g._count._all;
      if (g.verificationStatus === "REJECTED") entry.rejected  += g._count._all;
    }

    return Array.from(byType.values());
  } catch { return []; }
}
