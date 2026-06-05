import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, "ok" | "error"> = {};
  let overall: "healthy" | "degraded" | "unhealthy" = "healthy";

  // PostgreSQL
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.postgres = "ok";
  } catch {
    checks.postgres = "error";
    overall = "unhealthy";
  }

  // Redis
  try {
    const { default: Redis } = await import("ioredis");
    const r = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      connectTimeout: 2000,
      maxRetriesPerRequest: 1,
      lazyConnect: false,
    });
    await r.ping();
    r.disconnect();
    checks.redis = "ok";
  } catch {
    checks.redis = "error";
    if (overall === "healthy") overall = "degraded";
  }

  const status = overall === "unhealthy" ? 503 : 200;

  return NextResponse.json(
    {
      status:  overall,
      version: process.env.npm_package_version ?? "unknown",
      checks,
      ts:      Date.now(),
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Health-Check": "true",
      },
    }
  );
}
