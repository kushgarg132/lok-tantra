import { NextResponse } from "next/server";
import { runDiagnostics } from "@/lib/observability/diagnostics";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await runDiagnostics();
  const httpStatus =
    result.overall === "healthy"  ? 200 :
    result.overall === "degraded" ? 207 :
    503;
  return NextResponse.json(result, { status: httpStatus });
}
