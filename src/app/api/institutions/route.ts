import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const QuerySchema = z.object({
  level:  z.string().optional(),
  branch: z.enum(["legislative", "executive", "judicial", "independent"]).optional(),
  q:      z.string().max(200).optional(),
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
    const { level, branch, q: search, slug, limit, offset } = parsed.data;

    if (slug) {
      const institution = await prisma.institution.findUnique({
        where: { slug },
        include: {
          children: { take: 20 },
          parent:   true,
          positions: {
            take: 10,
            include: { currentHolder: { include: { party: { select: { id: true, name: true, abbreviation: true, color: true } } } } },
          },
        },
      });
      return NextResponse.json({ data: institution });
    }

    const where: Record<string, unknown> = {};
    if (level)  where.level  = level;
    if (branch) where.branch = branch;

    if (search) {
      const [results, total] = await prisma.$transaction([
        prisma.institution.findMany({
          where: {
            ...where,
            OR: [
              { name:        { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          },
          select: { id: true, slug: true, name: true, type: true, branch: true, level: true, description: true, _count: { select: { children: true } } },
          orderBy: { name: "asc" },
          take:    limit,
          skip:    offset,
        }),
        prisma.institution.count({
          where: {
            ...where,
            OR: [
              { name:        { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      ]);
      return NextResponse.json({ data: results, total, limit, offset });
    }

    const [results, total] = await prisma.$transaction([
      prisma.institution.findMany({
        where,
        select: { id: true, slug: true, name: true, type: true, branch: true, level: true, description: true, _count: { select: { children: true } } },
        orderBy: { name: "asc" },
        take:    limit,
        skip:    offset,
      }),
      prisma.institution.count({ where }),
    ]);

    return NextResponse.json({ data: results, total, limit, offset });
  } catch (error) {
    console.error("[API:institutions]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
