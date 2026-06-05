import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { retrieveRelevantChunks } from "@/lib/rag/knowledge";
import { generateResponse } from "@/lib/rag/generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  message: z.string().min(1).max(2000).trim(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(12)
    .optional()
    .default([]),
});

// Simple rate limit: track requests per IP (in-memory, resets on restart)
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // per minute
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const existing = requestCounts.get(ip);
  if (!existing || existing.resetAt < now) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (existing.count >= RATE_LIMIT) return false;
  existing.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.issues }, { status: 400 });
  }

  const { message, history } = parsed.data;

  // Retrieve relevant knowledge chunks
  const chunks = retrieveRelevantChunks(message, 5);

  // Generate response
  const response = await generateResponse(message, history, chunks);

  return NextResponse.json(response);
}
