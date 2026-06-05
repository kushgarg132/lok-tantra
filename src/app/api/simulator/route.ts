import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const process = await prisma.governanceProcess.findUnique({
      where: { slug },
      include: { steps: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ data: process });
  }

  const processes = await prisma.governanceProcess.findMany({
    include: { steps: { orderBy: { order: "asc" } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: processes });
}
