import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { retrieveRelevantChunks } from "@/lib/rag/knowledge";
import { generateResponse } from "@/lib/rag/generator";
import { enforceRateLimit } from "@/lib/security/rate-limiter";
import { sanitizeQuery } from "@/lib/security/sanitizer";
import { autoCheckResponse } from "@/lib/moderation/service";
import { auditEvent, extractIp } from "@/lib/audit/service";
import { getRateMultiplier } from "@/lib/auth/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  message: z.string().min(1).max(2000).trim(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(12)
    .optional()
    .default([]),
});

export async function POST(request: NextRequest) {
  const ip      = extractIp(request.headers) ?? "unknown";
  const session = await getServerSession(authOptions);
  const role    = (session?.user as { role?: string })?.role;

  // Redis-backed rate limit — authenticated users get multiplied limits
  const rlId = session?.user?.id ?? ip;
  const rl   = await enforceRateLimit(rlId, "ai", getRateMultiplier(role));
  if (rl.blocked) {
    return NextResponse.json(
      { error: "AI assistant rate limit reached. Please wait a moment." },
      { status: 429, headers: rl.headers },
    );
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.issues }, { status: 400 });
  }

  const { message, history } = parsed.data;
  const sanitizedMessage = sanitizeQuery(message, 2000);

  // Retrieve relevant knowledge chunks
  const chunks = retrieveRelevantChunks(sanitizedMessage, 5);

  // Generate response
  const response = await generateResponse(sanitizedMessage, history, chunks);

  // Neutrality check on AI response before returning
  const check = autoCheckResponse(response.answer ?? "");
  if (!check.safe) {
    await auditEvent({
      action:    "assistant.neutrality_block",
      userId:    session?.user?.id,
      ipAddress: ip,
      payload:   { issues: check.issues.slice(0, 3), score: check.neutralityScore },
      result:    "blocked",
      reason:    "Neutrality scanner flagged response",
    });
    return NextResponse.json({
      ...response,
      answer:    "I can provide factual constitutional information on this topic. Please ask about a specific constitutional article, law, or official government process.",
      disclaimer: "LokTantra only provides constitutionally grounded, politically neutral civic information.",
    });
  }

  // Append disclaimer if issues were found (but not severe enough to block)
  const finalResponse = check.disclaimer
    ? { ...response, disclaimer: check.disclaimer }
    : response;

  return NextResponse.json(finalResponse);
}
