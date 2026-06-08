import { NextResponse } from "next/server";
import { z } from "zod";
import { apiFetchQueue } from "@/lib/etl/queue";

const SourceSchema = z.enum([
  "ADR_MYNETA",
  "ECI_PORTAL",
  "PRS_INDIA",
  "SUPREME_COURT",
  "INDIA_CODE_API",
  "IMAGE_INGEST",
]);

export async function POST(
  _req: Request,
  { params }: { params: { source: string } },
) {
  const parsed = SourceSchema.safeParse(params.source);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid source", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const job = await apiFetchQueue.add(
      "manual-sync",
      { source: parsed.data },
      { jobId: `manual-sync:${parsed.data}:${Date.now()}` },
    );
    return NextResponse.json({ jobId: job.id, source: parsed.data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
