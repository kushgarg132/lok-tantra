import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const limit  = Math.min(parseInt(params.get("limit") ?? "100", 10), 500);
  const level  = params.get("level")  ?? "";
  const source = params.get("source") ?? "";

  let r: Redis | null = null;
  try {
    r = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      connectTimeout: 2000, maxRetriesPerRequest: 1,
    });

    const raw = await r.lrange("obs:logs", 0, Math.min(limit * 4, 3000) - 1);

    const entries = raw
      .map((s) => { try { return JSON.parse(s); } catch { return null; } })
      .filter(Boolean)
      .filter((e: Record<string, string>) => !level  || e.level  === level)
      .filter((e: Record<string, string>) => !source || String(e.source).includes(source))
      .slice(0, limit);

    return NextResponse.json({ entries, total: entries.length });
  } catch {
    return NextResponse.json({ entries: [], total: 0, error: "Redis unavailable" });
  } finally {
    try { r?.disconnect(); } catch {}
  }
}
