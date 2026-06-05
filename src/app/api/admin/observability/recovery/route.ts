import { NextRequest, NextResponse } from "next/server";
import { requeueFailed, requeueAllFailed, drainQueue, type QueueName } from "@/lib/observability/recovery";

const VALID_QUEUES = new Set<QueueName>(["api-fetch", "scrape-html", "pdf-ocr", "image-ingest"]);

export async function POST(req: NextRequest) {
  const body: Record<string, unknown> = await req.json().catch(() => ({}));
  const action = String(body.action ?? "");
  const queue  = String(body.queue  ?? "") as QueueName;

  if (action === "requeue-all") {
    const results = await requeueAllFailed(Number(body.limit) || 50);
    return NextResponse.json({ results });
  }

  if (action === "requeue") {
    if (!VALID_QUEUES.has(queue)) {
      return NextResponse.json({ error: "Invalid queue name" }, { status: 400 });
    }
    const result = await requeueFailed(queue, Number(body.limit) || 50);
    return NextResponse.json({ result });
  }

  if (action === "drain") {
    if (!VALID_QUEUES.has(queue)) {
      return NextResponse.json({ error: "Invalid queue name" }, { status: 400 });
    }
    const result = await drainQueue(queue);
    return NextResponse.json({ result });
  }

  return NextResponse.json({ error: "Unknown action. Use: requeue-all | requeue | drain" }, { status: 400 });
}
