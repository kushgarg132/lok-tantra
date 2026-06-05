import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createFlag, hasDuplicateFlag } from "@/lib/moderation/service";
import { enforceRateLimit } from "@/lib/security/rate-limiter";
import { auditEvent, extractIp } from "@/lib/audit/service";
import { sanitizeQuery } from "@/lib/security/sanitizer";
import { z } from "zod";

const FlagSchema = z.object({
  contentType:    z.string().min(1).max(50),
  contentId:      z.string().min(1).max(200),
  reason:         z.enum(["INACCURATE", "POLITICALLY_BIASED", "MISLEADING", "MISSING_SOURCE", "OUTDATED", "INAPPROPRIATE", "OTHER"]),
  details:        z.string().max(2000).optional(),
  contentSnippet: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const ip      = extractIp(req.headers) ?? "unknown";
  const session = await getServerSession(authOptions);

  const rl = await enforceRateLimit(ip, "write");
  if (rl.blocked) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: rl.headers });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = FlagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid flag data.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { contentType, contentId, reason, details, contentSnippet } = parsed.data;

  // Deduplicate: same IP + same content within 1 hour
  const isDuplicate = await hasDuplicateFlag(contentType, contentId, ip);
  if (isDuplicate) {
    return NextResponse.json({ error: "You have already flagged this content recently." }, { status: 409 });
  }

  const { id } = await createFlag({
    contentType,
    contentId,
    reason,
    details:        details ? sanitizeQuery(details, 2000) : undefined,
    contentSnippet: contentSnippet ? sanitizeQuery(contentSnippet, 500) : undefined,
    userId:         session?.user?.id,
    ipAddress:      ip,
  });

  await auditEvent({
    action:     "flag.create",
    userId:     session?.user?.id,
    resource:   "ContentFlag",
    resourceId: id,
    ipAddress:  ip,
    payload:    { contentType, contentId, reason },
    result:     "success",
  });

  return NextResponse.json({ id, message: "Thank you for your report. Our team will review it." }, { status: 201 });
}
