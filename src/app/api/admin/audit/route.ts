import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { queryAuditLog, getAuditStats } from "@/lib/audit/service";
import { isAdmin } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const params  = req.nextUrl.searchParams;
  const view    = params.get("view") ?? "logs";

  if (view === "stats") {
    const since = params.get("since") ? new Date(params.get("since")!) : undefined;
    const stats = await getAuditStats(since);
    return NextResponse.json(stats);
  }

  const logs = await queryAuditLog({
    userId:   params.get("userId")   ?? undefined,
    action:   params.get("action")   ?? undefined,
    resource: params.get("resource") ?? undefined,
    result:   (params.get("result") ?? undefined) as "success" | "failure" | "blocked" | undefined,
    since:    params.get("since") ? new Date(params.get("since")!) : undefined,
    until:    params.get("until") ? new Date(params.get("until")!) : undefined,
    limit:    Math.min(parseInt(params.get("limit") ?? "100", 10), 500),
    offset:   parseInt(params.get("offset") ?? "0", 10),
  });

  return NextResponse.json(logs);
}
