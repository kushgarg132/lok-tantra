import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getPendingFlags, resolveFlag, getFlagStats } from "@/lib/moderation/service";
import { auditEvent, extractIp } from "@/lib/audit/service";
import { isModerator } from "@/lib/auth/permissions";

async function requireModerator(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isModerator(session.user.role)) {
    return { session: null, error: NextResponse.json({ error: "Moderator access required." }, { status: 403 }) };
  }
  return { session, error: null };
}

export async function GET(req: NextRequest) {
  const { session, error } = await requireModerator(req);
  if (error) return error;

  const params = req.nextUrl.searchParams;
  const limit  = Math.min(parseInt(params.get("limit") ?? "50", 10), 200);
  const offset = parseInt(params.get("offset") ?? "0", 10);
  const view   = params.get("view") ?? "queue";

  if (view === "stats") {
    const stats = await getFlagStats();
    return NextResponse.json(stats);
  }

  const flags = await getPendingFlags(limit, offset);
  return NextResponse.json({ flags, count: flags.length });
}

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireModerator(req);
  if (error) return error;

  const ip = extractIp(req.headers) ?? "unknown";

  let body: { flagId?: string; status?: string; note?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const { flagId, status, note } = body;
  if (!flagId || !status) {
    return NextResponse.json({ error: "flagId and status required." }, { status: 400 });
  }

  const validStatuses = ["RESOLVED_VALID", "RESOLVED_INVALID", "ESCALATED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await resolveFlag(flagId, session!.user!.id!, status as "RESOLVED_VALID" | "RESOLVED_INVALID" | "ESCALATED", note);

  await auditEvent({
    action:     "moderation.resolve_flag",
    userId:     session!.user!.id,
    resource:   "ContentFlag",
    resourceId: flagId,
    ipAddress:  ip,
    payload:    { status, note },
    result:     "success",
  });

  return NextResponse.json({ ok: true });
}
