import { NextResponse } from "next/server";
import { getScraperHealth } from "@/lib/observability/scraper-run";
import { getDataFreshness } from "@/lib/observability/freshness";
import { evaluateAlerts } from "@/lib/observability/alert-engine";
import { getQueueDepths } from "@/lib/observability/recovery";
import { getMultiCounters } from "@/lib/observability/metrics";

export const dynamic = "force-dynamic";

const SOURCES = ["ADR_MYNETA", "ECI_PORTAL", "PRS_INDIA", "SUPREME_COURT", "INDIA_CODE_API", "IMAGE_INGEST"];
const COUNTER_KEYS = SOURCES.flatMap((s) => [
  `scraper.${s}.runs.success`,
  `scraper.${s}.runs.failed`,
]);

export async function GET() {
  const [healthRes, freshnessRes, alertsRes, depthsRes, counters] = await Promise.allSettled([
    getScraperHealth(),
    getDataFreshness(),
    evaluateAlerts(),
    getQueueDepths(),
    getMultiCounters(COUNTER_KEYS),
  ]);

  return NextResponse.json({
    ts:           Date.now(),
    scraperHealth: healthRes.status   === "fulfilled" ? healthRes.value   : [],
    freshness:     freshnessRes.status === "fulfilled" ? freshnessRes.value : [],
    alerts:        alertsRes.status   === "fulfilled" ? alertsRes.value   : [],
    queueDepths:   depthsRes.status   === "fulfilled" ? depthsRes.value   : {},
    counters:      counters.status    === "fulfilled" ? counters.value    : {},
  });
}
