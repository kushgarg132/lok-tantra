import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const action = await prisma.citizenAction.findUnique({ where: { slug } });
    return NextResponse.json({ data: action });
  }

  const actions = await prisma.citizenAction.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json({ data: actions });
}
