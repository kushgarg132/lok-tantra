import { prisma } from "@/lib/db";

export interface AuditEventInput {
  action:     string;     // e.g., "auth.signin", "flag.create", "admin.update_user"
  userId?:    string;
  resource?:  string;     // e.g., "User", "ContentFlag", "DataSource"
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  payload?:   Record<string, unknown>; // sanitized context (no passwords, tokens)
  result:     "success" | "failure" | "blocked";
  reason?:    string;     // why blocked or failed
}

export async function auditEvent(input: AuditEventInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action:     input.action,
        userId:     input.userId     ?? null,
        resource:   input.resource   ?? null,
        resourceId: input.resourceId ?? null,
        ipAddress:  input.ipAddress  ?? null,
        userAgent:  input.userAgent  ?? null,
        payload:    (input.payload ?? null) as never,
        result:     input.result,
        reason:     input.reason     ?? null,
      },
    });
  } catch { /* audit must never crash the caller */ }
}

export interface AuditQuery {
  userId?:    string;
  action?:    string;
  resource?:  string;
  result?:    "success" | "failure" | "blocked";
  since?:     Date;
  until?:     Date;
  limit?:     number;
  offset?:    number;
}

export async function queryAuditLog(q: AuditQuery) {
  const where: Record<string, unknown> = {};

  if (q.userId)   where.userId   = q.userId;
  if (q.resource) where.resource = q.resource;
  if (q.result)   where.result   = q.result;
  if (q.action)   where.action   = { contains: q.action };

  if (q.since || q.until) {
    where.createdAt = {
      ...(q.since ? { gte: q.since } : {}),
      ...(q.until ? { lte: q.until } : {}),
    };
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip:    q.offset ?? 0,
      take:    q.limit  ?? 100,
      include: { user: { select: { name: true, email: true, role: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}

export async function getAuditStats(since?: Date) {
  const from = since ?? new Date(Date.now() - 7 * 24 * 3600000);

  const [byAction, byResult, total] = await Promise.all([
    prisma.auditLog.groupBy({
      by: ["action"],
      where: { createdAt: { gte: from } },
      _count: { _all: true },
      orderBy: { _count: { action: "desc" } },
      take: 20,
    }),
    prisma.auditLog.groupBy({
      by: ["result"],
      where: { createdAt: { gte: from } },
      _count: { _all: true },
    }),
    prisma.auditLog.count({ where: { createdAt: { gte: from } } }),
  ]);

  return {
    total,
    byAction: Object.fromEntries(byAction.map((r) => [r.action, r._count._all])),
    byResult: Object.fromEntries(byResult.map((r) => [r.result, r._count._all])),
  };
}

// Helper: extract a safe IP from Next.js request headers
export function extractIp(headers: Headers): string | undefined {
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("x-real-ip") ??
    undefined
  );
}
