export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const QuerySchema = z.object({
  slug:   z.string().max(100).optional(),
  limit:  z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = QuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    const { slug, limit, offset } = parsed.data;

    if (slug) {
      const path = await prisma.learningPath.findUnique({
        where:   { slug },
        include: { modules: { orderBy: { order: "asc" } } },
      });
      return NextResponse.json({ data: path });
    }

    // List view: omit heavy module content, only return metadata for each path
    const [paths, total] = await prisma.$transaction([
      prisma.learningPath.findMany({
        select: {
          id: true, slug: true, title: true, description: true,
          level: true, estimatedHours: true, color: true, prerequisites: true,
          modules: {
            select: { id: true, title: true, type: true, estimatedMinutes: true, order: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { estimatedHours: "asc" },
        take:    limit,
        skip:    offset,
      }),
      prisma.learningPath.count(),
    ]);

    return NextResponse.json({ data: paths, total, limit, offset });
  } catch (error) {
    console.error("[API:learn]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
