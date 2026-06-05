import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const QuerySchema = z.object({
  type:     z.enum(["parts", "amendments", "cases", "writs"]).optional(),
  q:        z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  limit:    z.coerce.number().int().min(1).max(100).default(50),
  offset:   z.coerce.number().int().min(0).default(0),
});

export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = QuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    const { type, q: search, category, limit, offset } = parsed.data;

    if (type === "parts") {
      const parts = await prisma.constitutionPart.findMany({ orderBy: { number: "asc" } });
      return NextResponse.json({ data: parts });
    }

    if (type === "amendments") {
      const where = search
        ? { OR: [{ description: { contains: search, mode: "insensitive" as const } }] }
        : {};
      const [amendments, total] = await prisma.$transaction([
        prisma.amendment.findMany({ where, orderBy: { number: "asc" }, take: limit, skip: offset }),
        prisma.amendment.count({ where }),
      ]);
      return NextResponse.json({ data: amendments, total, limit, offset });
    }

    if (type === "cases") {
      const where = search
        ? { OR: [
            { name:    { contains: search, mode: "insensitive" as const } },
            { summary: { contains: search, mode: "insensitive" as const } },
          ] }
        : {};
      const [cases, total] = await prisma.$transaction([
        prisma.landmarkCase.findMany({
          where,
          include: {
            court:               { select: { id: true, name: true, type: true } },
            articlesInterpreted: { select: { id: true, number: true, title: true } },
          },
          orderBy: { year: "asc" },
          take:    limit,
          skip:    offset,
        }),
        prisma.landmarkCase.count({ where }),
      ]);
      return NextResponse.json({ data: cases, total, limit, offset });
    }

    if (type === "writs") {
      const writs = await prisma.writ.findMany();
      return NextResponse.json({ data: writs });
    }

    // Default: articles — select only needed fields to avoid over-fetching full text in lists
    const articleWhere: Record<string, unknown> = {};
    if (category) articleWhere.category = category;

    if (search) {
      const [articles, total] = await prisma.$transaction([
        prisma.constitutionArticle.findMany({
          where: {
            ...articleWhere,
            OR: [
              { title:  { contains: search, mode: "insensitive" } },
              { text:   { contains: search, mode: "insensitive" } },
              { number: { contains: search } },
            ],
          },
          select: {
            id: true, number: true, title: true, category: true, isRepealed: true, partId: true,
            part:       { select: { id: true, number: true, name: true } },
            amendments: { select: { id: true, number: true, year: true, description: true } },
            cases:      { select: { id: true, name: true, year: true, significance: true } },
          },
          orderBy: { number: "asc" },
          take:    limit,
          skip:    offset,
        }),
        prisma.constitutionArticle.count({
          where: {
            ...articleWhere,
            OR: [
              { title:  { contains: search, mode: "insensitive" } },
              { text:   { contains: search, mode: "insensitive" } },
              { number: { contains: search } },
            ],
          },
        }),
      ]);
      return NextResponse.json({ data: articles, total, limit, offset });
    }

    const [articles, total] = await prisma.$transaction([
      prisma.constitutionArticle.findMany({
        where: articleWhere,
        select: {
          id: true, number: true, title: true, category: true, isRepealed: true, partId: true,
          part: { select: { id: true, number: true, name: true } },
        },
        orderBy: { number: "asc" },
        take:    limit,
        skip:    offset,
      }),
      prisma.constitutionArticle.count({ where: articleWhere }),
    ]);

    return NextResponse.json({ data: articles, total, limit, offset });
  } catch (error) {
    console.error("[API:constitution]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
