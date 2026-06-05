export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { normalizeEmail, sanitizeName, checkPasswordStrength } from "@/lib/security/sanitizer";
import { enforceRateLimit } from "@/lib/security/rate-limiter";
import { auditEvent, extractIp } from "@/lib/audit/service";

export async function POST(req: NextRequest) {
  const ip = extractIp(req.headers) ?? "unknown";

  // Rate-limit registration (prevent mass account creation)
  const rl = await enforceRateLimit(ip, "auth");
  if (rl.blocked) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429, headers: rl.headers },
    );
  }

  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email    = normalizeEmail(body.email ?? "");
  const name     = sanitizeName(body.name ?? "");
  const password = body.password ?? "";

  if (!email) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const strength = checkPasswordStrength(password);
  if (!strength.valid) {
    return NextResponse.json({ error: strength.feedback }, { status: 400 });
  }

  // Check for existing user
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await auditEvent({ action: "auth.register_duplicate", ipAddress: ip, result: "blocked", reason: "Email already registered" });
    // Return same message as success to prevent email enumeration
    return NextResponse.json({ message: "If this email is available, your account has been created." });
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name: name || null, email, password: hash },
  });

  await auditEvent({
    action:     "auth.register",
    userId:     user.id,
    resource:   "User",
    resourceId: user.id,
    ipAddress:  ip,
    result:     "success",
  });

  return NextResponse.json({ message: "Account created. You can now sign in." }, { status: 201 });
}
