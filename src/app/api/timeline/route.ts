import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const events = await prisma.timelineEvent.findMany({
    where: category ? { category } : undefined,
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ data: events });
}
