import { NextResponse } from "next/server";
import { evaluateAlerts, getRecentAlerts, ALERT_RULES } from "@/lib/observability/alert-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const [active, history] = await Promise.allSettled([evaluateAlerts(), getRecentAlerts(50)]);

  return NextResponse.json({
    active:  active.status  === "fulfilled" ? active.value.filter((a) => a.fired)   : [],
    history: history.status === "fulfilled" ? history.value : [],
    rules:   ALERT_RULES.map((r) => ({ id: r.id, name: r.name, severity: r.severity })),
  });
}
