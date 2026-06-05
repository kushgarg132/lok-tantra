import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const branch = searchParams.get("branch");
  const search = searchParams.get("q");
  const slug = searchParams.get("slug");

  if (slug) {
    const institution = await prisma.institution.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
        positions: { include: { currentHolder: { include: { party: true } } } },
      },
    });
    return NextResponse.json({ data: institution });
  }

  const where: Record<string, unknown> = {};
  if (level) where.level = level;
  if (branch) where.branch = branch;

  if (search) {
    const results = await prisma.institution.findMany({
      where: {
        ...where,
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
      include: { children: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: results, total: results.length });
  }

  const results = await prisma.institution.findMany({
    where,
    include: { children: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: results, total: results.length });
}
