import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const abbr = searchParams.get("abbr");
  const type = searchParams.get("type");

  if (type === "ideology") {
    const spectrum = await prisma.ideologyPosition.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ data: spectrum });
  }

  if (abbr) {
    const party = await prisma.politicalParty.findUnique({
      where: { abbreviation: abbr },
      include: { members: true },
    });
    return NextResponse.json({ data: party });
  }

  const parties = await prisma.politicalParty.findMany({
    include: { _count: { select: { members: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: parties });
}
