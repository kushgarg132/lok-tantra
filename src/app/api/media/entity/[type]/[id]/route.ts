import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCachedVariants, setCachedVariants } from "@/lib/media/cache";
import type { EntityType, MediaVariants } from "@/lib/media/types";

const VALID_ENTITY_TYPES = new Set<EntityType>([
  "person",
  "party",
  "institution",
  "ministry",
  "court",
  "constituency",
]);

export async function GET(
  _req: Request,
  { params }: { params: { type: string; id: string } }
) {
  const entityType = params.type as EntityType;
  const entityId = params.id;

  if (!VALID_ENTITY_TYPES.has(entityType)) {
    return NextResponse.json(
      { error: `Invalid entity type: ${entityType}` },
      { status: 400 }
    );
  }

  // Cache hit
  const cached = await getCachedVariants(entityType, entityId);
  if (cached) {
    return NextResponse.json({ entityType, entityId, variants: cached, cached: true });
  }

  // DB lookup — always return the most recently updated active asset
  const asset = await prisma.mediaAsset.findFirst({
    where: { entityType, entityId, isActive: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      publicUrl: true,
      variants: true,
      mediaType: true,
      sourceTrust: true,
      isVerified: true,
      width: true,
      height: true,
      format: true,
      fetchedAt: true,
    },
  });

  if (!asset) {
    return NextResponse.json(
      { entityType, entityId, variants: null, hasMedia: false },
      { status: 404 }
    );
  }

  const variants = (asset.variants ?? {}) as MediaVariants;

  // Warm cache
  await setCachedVariants(entityType, entityId, variants);

  return NextResponse.json({
    entityType,
    entityId,
    hasMedia: true,
    mediaType: asset.mediaType,
    publicUrl: asset.publicUrl,
    variants,
    sourceTrust: asset.sourceTrust,
    isVerified: asset.isVerified,
    dimensions: { width: asset.width, height: asset.height },
    format: asset.format,
    fetchedAt: asset.fetchedAt,
  });
}

// DELETE — mark asset as inactive (soft delete)
export async function DELETE(
  _req: Request,
  { params }: { params: { type: string; id: string } }
) {
  const entityType = params.type as EntityType;
  const entityId = params.id;

  if (!VALID_ENTITY_TYPES.has(entityType)) {
    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  }

  await prisma.mediaAsset.updateMany({
    where: { entityType, entityId },
    data: { isActive: false },
  });

  const { invalidateMediaCache } = await import("@/lib/media/cache");
  await invalidateMediaCache(entityType, entityId);

  return NextResponse.json({ success: true, entityType, entityId });
}
