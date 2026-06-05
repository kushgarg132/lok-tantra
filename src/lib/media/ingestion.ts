import { prisma } from "@/lib/db";
import { validateImageBuffer, validateSourceUrl } from "./validator";
import { processOriginal, generateVariant } from "./processor";
import { uploadObject, buildStorageKey } from "./storage";
import { buildCandidateUrls, getSourceTrust, isTrustedSource } from "./sources";
import {
  invalidateMediaCache,
  setCachedMediaUrl,
  setCachedMediaMiss,
  setCachedVariants,
} from "./cache";
import type {
  EntityType,
  MediaType,
  IngestJobData,
  IngestResult,
  MediaVariants,
} from "./types";

const FETCH_TIMEOUT_MS = 20_000;
const USER_AGENT = "LokTantra/1.0 (+https://loktantra.in; media-crawler)";

// ─── Public entry point ───────────────────────────────────────

export async function ingestEntityMedia(
  job: IngestJobData
): Promise<IngestResult> {
  const { entityType, entityId, entityName, mediaType, hints = {} } = job;

  const candidates = buildCandidateUrls(entityType, {
    name: entityName,
    ...hints,
  });

  for (const url of candidates) {
    if (!validateSourceUrl(url) || !isTrustedSource(url)) continue;

    try {
      const result = await downloadValidateStore(
        entityType,
        entityId,
        mediaType,
        url
      );
      if (result) {
        await invalidateMediaCache(entityType, entityId);
        await setCachedMediaUrl(entityType, entityId, result.publicUrl ?? "");
        await setCachedVariants(entityType, entityId, result.variants ?? {});
        return {
          success: true,
          assetId: result.id,
          publicUrl: result.publicUrl ?? undefined,
          variants: (result.variants as MediaVariants) ?? undefined,
        };
      }
    } catch (err) {
      console.warn(
        `[media] Failed ${url}: ${(err as Error).message}`
      );
    }
  }

  await setCachedMediaMiss(entityType, entityId);
  return {
    success: false,
    error: `No valid image found from ${candidates.length} candidate URL(s)`,
  };
}

// ─── Batch ingestion ─────────────────────────────────────────

export async function batchIngestPersonMedia(
  personIds?: string[]
): Promise<{ queued: number }> {
  const persons = await prisma.person.findMany({
    where: personIds
      ? { id: { in: personIds } }
      : { photoUrl: null },
    select: { id: true, name: true },
    take: 500,
  });

  const { imageIngestQueue } = await import("@/lib/etl/queue");

  for (const person of persons) {
    await imageIngestQueue.add(
      "ingest-entity",
      {
        entityType: "person",
        entityId: person.id,
        entityName: person.name,
        mediaType: "profile",
      } satisfies IngestJobData,
      { jobId: `person:${person.id}:profile` } // dedup by jobId
    );
  }

  return { queued: persons.length };
}

export async function batchIngestPartyMedia(
  partyIds?: string[]
): Promise<{ queued: number }> {
  const parties = await prisma.politicalParty.findMany({
    where: partyIds ? { id: { in: partyIds } } : { logoUrl: null },
    select: { id: true, name: true, abbreviation: true },
    take: 200,
  });

  const { imageIngestQueue } = await import("@/lib/etl/queue");

  for (const party of parties) {
    await imageIngestQueue.add(
      "ingest-entity",
      {
        entityType: "party",
        entityId: party.id,
        entityName: party.name,
        mediaType: "logo",
        hints: { partyAbbr: party.abbreviation },
      } satisfies IngestJobData,
      { jobId: `party:${party.id}:logo` }
    );
  }

  return { queued: parties.length };
}

// ─── Core download → validate → process → store ───────────────

async function downloadValidateStore(
  entityType: EntityType,
  entityId: string,
  mediaType: MediaType,
  sourceUrl: string
): Promise<{ id: string; publicUrl: string | null; variants: unknown } | null> {
  // Download with timeout
  const res = await fetch(sourceUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    console.debug(`[media] HTTP ${res.status} for ${sourceUrl}`);
    return null;
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  // Validate
  const validation = await validateImageBuffer(buffer);
  if (!validation.valid) {
    console.debug(`[media] Invalid image at ${sourceUrl}: ${validation.reason}`);
    return null;
  }

  const sourceTrust = getSourceTrust(sourceUrl);
  const isLogo = mediaType === "logo" || mediaType === "symbol";

  // Process and generate all variants in parallel
  const [original, thumbVariant, avatarVariant, cardVariant] =
    await Promise.all([
      processOriginal(buffer),
      generateVariant(buffer, "thumb", isLogo),
      generateVariant(buffer, "avatar", isLogo),
      generateVariant(buffer, "card", isLogo),
    ]);

  // Build storage keys
  const originalKey = buildStorageKey(entityType, entityId, mediaType, "original", "webp");
  const thumbKey = buildStorageKey(entityType, entityId, mediaType, "thumb", "webp");
  const avatarKey = buildStorageKey(entityType, entityId, mediaType, "avatar", "webp");
  const cardKey = buildStorageKey(entityType, entityId, mediaType, "card", "webp");

  // Upload all variants in parallel
  const [originalUrl, thumbUrl, avatarUrl, cardUrl] = await Promise.all([
    uploadObject(originalKey, original.buffer),
    uploadObject(thumbKey, thumbVariant.buffer),
    uploadObject(avatarKey, avatarVariant.buffer),
    uploadObject(cardKey, cardVariant.buffer),
  ]);

  const variants: MediaVariants = {
    original: originalUrl,
    thumb: thumbUrl,
    avatar: avatarUrl,
    card: cardUrl,
  };

  const sourceDomain = new URL(sourceUrl).hostname;
  const isVerified = sourceTrust === "official_govt";

  // Upsert — one record per (entityType, entityId, mediaType)
  const asset = await prisma.mediaAsset.upsert({
    where: {
      entityType_entityId_mediaType: { entityType, entityId, mediaType },
    },
    create: {
      entityType,
      entityId,
      mediaType,
      storageKey: originalKey,
      publicUrl: originalUrl,
      width: original.width,
      height: original.height,
      format: "webp",
      fileSize: original.fileSize,
      checksum: original.checksum,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variants: variants as any,
      sourceUrl,
      sourceDomain,
      sourceTrust,
      isVerified,
      isActive: true,
      fetchedAt: new Date(),
      verifiedAt: isVerified ? new Date() : null,
      lastCheckedAt: new Date(),
    },
    update: {
      storageKey: originalKey,
      publicUrl: originalUrl,
      width: original.width,
      height: original.height,
      format: "webp",
      fileSize: original.fileSize,
      checksum: original.checksum,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variants: variants as any,
      sourceUrl,
      sourceDomain,
      sourceTrust,
      isVerified,
      fetchedAt: new Date(),
      lastCheckedAt: new Date(),
    },
  });

  // Propagate avatar URL to the entity's own photoUrl/logoUrl field
  await updateEntityPrimaryMedia(entityType, entityId, avatarUrl, isVerified);

  return { id: asset.id, publicUrl: originalUrl, variants };
}

// ─── Entity primary URL update ────────────────────────────────

async function updateEntityPrimaryMedia(
  entityType: EntityType,
  entityId: string,
  avatarUrl: string,
  verified: boolean
): Promise<void> {
  const now = new Date();
  try {
    switch (entityType) {
      case "person":
        await prisma.person.update({
          where: { id: entityId },
          data: { photoUrl: avatarUrl, mediaVerified: verified, mediaUpdatedAt: now },
        });
        break;
      case "party":
        await prisma.politicalParty.update({
          where: { id: entityId },
          data: { logoUrl: avatarUrl, mediaUpdatedAt: now },
        });
        break;
      case "institution":
        await prisma.institution.update({
          where: { id: entityId },
          data: { logoUrl: avatarUrl, mediaUpdatedAt: now },
        });
        break;
      case "ministry":
        await prisma.ministry.update({
          where: { id: entityId },
          data: { logoUrl: avatarUrl, mediaUpdatedAt: now },
        });
        break;
      case "court":
        await prisma.court.update({
          where: { id: entityId },
          data: { logoUrl: avatarUrl, mediaUpdatedAt: now },
        });
        break;
    }
  } catch (err) {
    // Non-fatal — asset is still stored, just entity link failed
    console.error(
      `[media] Failed to update ${entityType}.${entityId} primary URL:`,
      (err as Error).message
    );
  }
}

// ─── Staleness refresh ────────────────────────────────────────

export async function refreshStaleAssets(
  olderThanDays = 30
): Promise<{ refreshed: number; failed: number }> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - olderThanDays);

  const stale = await prisma.mediaAsset.findMany({
    where: { isActive: true, lastCheckedAt: { lt: cutoff } },
    select: { id: true, entityType: true, entityId: true, mediaType: true, sourceUrl: true },
    take: 100,
  });

  const { imageIngestQueue } = await import("@/lib/etl/queue");
  let refreshed = 0;
  let failed = 0;

  for (const asset of stale) {
    try {
      const person = asset.entityType === "person"
        ? await prisma.person.findUnique({ where: { id: asset.entityId }, select: { name: true } })
        : null;

      await imageIngestQueue.add(
        "ingest-entity",
        {
          entityType: asset.entityType as EntityType,
          entityId: asset.entityId,
          entityName: person?.name ?? asset.entityId,
          mediaType: asset.mediaType as MediaType,
        } satisfies IngestJobData,
        { jobId: `refresh:${asset.id}` }
      );
      refreshed++;
    } catch {
      failed++;
    }
  }

  return { refreshed, failed };
}
