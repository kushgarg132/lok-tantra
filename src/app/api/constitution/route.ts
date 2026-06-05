import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const search = searchParams.get("q");
  const category = searchParams.get("category");

  if (type === "parts") {
    const parts = await prisma.constitutionPart.findMany({ orderBy: { number: "asc" } });
    return NextResponse.json({ data: parts });
  }

  if (type === "amendments") {
    const where = search
      ? { OR: [{ description: { contains: search, mode: "insensitive" as const } }] }
      : {};
    const amendments = await prisma.amendment.findMany({ where, orderBy: { number: "asc" } });
    return NextResponse.json({ data: amendments });
  }

  if (type === "cases") {
    const where = search
      ? { OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { summary: { contains: search, mode: "insensitive" as const } },
        ] }
      : {};
    const cases = await prisma.landmarkCase.findMany({
      where,
      include: { court: true, articlesInterpreted: true },
      orderBy: { year: "asc" },
    });
    return NextResponse.json({ data: cases });
  }

  if (type === "writs") {
    const writs = await prisma.writ.findMany();
    return NextResponse.json({ data: writs });
  }

  // Default: articles
  const articleWhere: Record<string, unknown> = {};
  if (category) articleWhere.category = category;

  if (search) {
    const articles = await prisma.constitutionArticle.findMany({
      where: {
        ...articleWhere,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { text: { contains: search, mode: "insensitive" } },
          { number: { contains: search } },
        ],
      },
      include: { amendments: true, cases: true, part: true },
      orderBy: { number: "asc" },
    });
    return NextResponse.json({ data: articles, total: articles.length });
  }

  const articles = await prisma.constitutionArticle.findMany({
    where: articleWhere,
    include: { amendments: true, cases: true, part: true },
    orderBy: { number: "asc" },
  });
  return NextResponse.json({ data: articles, total: articles.length });
}
