import { prisma } from "@/lib/db";
import { scanForNeutrality } from "@/lib/integrity/neutrality-scanner";
import { safeSnippet } from "@/lib/security/sanitizer";

export type FlagReason = "INACCURATE" | "POLITICALLY_BIASED" | "MISLEADING" | "MISSING_SOURCE" | "OUTDATED" | "INAPPROPRIATE" | "OTHER";
export type FlagStatus = "PENDING" | "REVIEWING" | "RESOLVED_VALID" | "RESOLVED_INVALID" | "ESCALATED";

export interface CreateFlagInput {
  contentType:    string;
  contentId:      string;
  reason:         FlagReason;
  details?:       string;
  contentSnippet?: string;
  userId?:        string;
  ipAddress?:     string;
}

export async function createFlag(input: CreateFlagInput): Promise<{ id: string }> {
  const flag = await prisma.contentFlag.create({
    data: {
      contentType:    input.contentType,
      contentId:      input.contentId,
      reason:         input.reason,
      details:        input.details ? safeSnippet(input.details, 1000) : null,
      contentSnippet: input.contentSnippet ? safeSnippet(input.contentSnippet, 500) : null,
      userId:         input.userId ?? null,
      ipAddress:      input.ipAddress ?? null,
      status:         "PENDING",
    },
  });
  return { id: flag.id };
}

export async function getPendingFlags(limit = 50, offset = 0) {
  return prisma.contentFlag.findMany({
    where:   { status: { in: ["PENDING", "REVIEWING"] } },
    orderBy: { createdAt: "asc" },
    skip:    offset,
    take:    limit,
    include: { user: { select: { name: true, email: true, role: true } } },
  });
}

export async function resolveFlag(
  flagId: string,
  reviewedBy: string,
  status: "RESOLVED_VALID" | "RESOLVED_INVALID" | "ESCALATED",
  note?: string,
): Promise<void> {
  await prisma.contentFlag.update({
    where: { id: flagId },
    data: {
      status:     status,
      reviewedBy,
      reviewNote: note ?? null,
      updatedAt:  new Date(),
    },
  });
}

export async function getFlagStats() {
  const [total, pending, reviewing, resolvedValid, resolvedInvalid, escalated] = await Promise.all([
    prisma.contentFlag.count(),
    prisma.contentFlag.count({ where: { status: "PENDING" } }),
    prisma.contentFlag.count({ where: { status: "REVIEWING" } }),
    prisma.contentFlag.count({ where: { status: "RESOLVED_VALID" } }),
    prisma.contentFlag.count({ where: { status: "RESOLVED_INVALID" } }),
    prisma.contentFlag.count({ where: { status: "ESCALATED" } }),
  ]);

  const byReason = await prisma.contentFlag.groupBy({
    by:     ["reason"],
    _count: { _all: true },
  });

  return {
    total, pending, reviewing, resolvedValid, resolvedInvalid, escalated,
    byReason: Object.fromEntries(byReason.map((r) => [r.reason, r._count._all])),
  };
}

// Auto-check AI response before it's returned to user
export interface AutoCheckResult {
  safe:        boolean;
  neutralityScore: number;
  issues:      string[];
  disclaimer?: string;
}

export function autoCheckResponse(text: string): AutoCheckResult {
  const scan = scanForNeutrality(text);

  return {
    safe:            scan.recommendation !== "block",
    neutralityScore: scan.score,
    issues:          scan.issues.map((i) => i.detail),
    disclaimer:      scan.disclaimer,
  };
}

// Detect duplicate flags (rate-limit flagging of same content)
export async function hasDuplicateFlag(
  contentType: string,
  contentId:   string,
  ipAddress:   string,
  windowMs = 3600000, // 1 hour
): Promise<boolean> {
  const since = new Date(Date.now() - windowMs);
  const count = await prisma.contentFlag.count({
    where: {
      contentType,
      contentId,
      ipAddress,
      createdAt: { gte: since },
    },
  });
  return count > 0;
}
