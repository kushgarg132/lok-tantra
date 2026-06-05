import { NextResponse } from "next/server";
import { z } from "zod";
import { imageIngestQueue } from "@/lib/etl/queue";
import {
  batchIngestPersonMedia,
  batchIngestPartyMedia,
  refreshStaleAssets,
} from "@/lib/media/ingestion";
import type { IngestJobData } from "@/lib/media/types";

const SingleIngestSchema = z.object({
  entityType: z.enum(["person", "party", "institution", "ministry", "court", "constituency"]),
  entityId: z.string().min(1),
  entityName: z.string().min(1),
  mediaType: z
    .enum(["profile", "thumbnail", "logo", "banner", "map", "portrait", "symbol"])
    .default("profile"),
  hints: z
    .object({
      sansadId: z.string().optional(),
      stateCode: z.string().optional(),
      partyAbbr: z.string().optional(),
      websiteUrl: z.string().url().optional(),
      wikiTitle: z.string().optional(),
    })
    .optional(),
});

const BatchIngestSchema = z.object({
  batch: z.enum(["persons", "parties", "refresh"]),
  ids: z.array(z.string()).optional(),
  olderThanDays: z.number().int().positive().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Try batch first
  const batchParsed = BatchIngestSchema.safeParse(body);
  if (batchParsed.success) {
    const { batch, ids, olderThanDays } = batchParsed.data;

    if (batch === "persons") {
      const { queued } = await batchIngestPersonMedia(ids);
      return NextResponse.json({ queued, batch: "persons" });
    }

    if (batch === "parties") {
      const { queued } = await batchIngestPartyMedia(ids);
      return NextResponse.json({ queued, batch: "parties" });
    }

    if (batch === "refresh") {
      const result = await refreshStaleAssets(olderThanDays ?? 30);
      return NextResponse.json(result);
    }
  }

  // Single entity ingestion
  const parsed = SingleIngestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const jobData: IngestJobData = parsed.data;

  await imageIngestQueue.add("ingest-entity", jobData, {
    jobId: `${jobData.entityType}:${jobData.entityId}:${jobData.mediaType}`,
  });

  return NextResponse.json({
    queued: true,
    entityType: jobData.entityType,
    entityId: jobData.entityId,
    mediaType: jobData.mediaType,
  });
}
