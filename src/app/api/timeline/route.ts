import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const VALID_CATEGORIES = [
  "constitution", "elections", "legislation", "judiciary",
  "foreign_policy", "emergency", "governance", "independence",
] as const;

const QuerySchema = z.object({
  category: z.enum(VALID_CATEGORIES).optional(),
  limit:    z.coerce.number().int().min(1).max(500).default(200),
  offset:   z.coerce.number().int().min(0).default(0),
});

export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = QuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    const { category, limit, offset } = parsed.data;

    const [events, total] = await prisma.$transaction([
      prisma.timelineEvent.findMany({
        where:   category ? { category } : undefined,
        orderBy: { date: "asc" },
        take:    limit,
        skip:    offset,
      }),
      prisma.timelineEvent.count({ where: category ? { category } : undefined }),
    ]);

    return NextResponse.json({ data: events, total, limit, offset });
  } catch (error) {
    console.error("[API:timeline]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
