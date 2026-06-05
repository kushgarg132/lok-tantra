import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const path = await prisma.learningPath.findUnique({
      where: { slug },
      include: { modules: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ data: path });
  }

  const paths = await prisma.learningPath.findMany({
    include: { modules: { orderBy: { order: "asc" } } },
    orderBy: { estimatedHours: "asc" },
  });

  return NextResponse.json({ data: paths });
}
