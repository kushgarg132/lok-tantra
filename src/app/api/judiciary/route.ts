import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "courts") {
    const courts = await prisma.court.findMany({ orderBy: { type: "asc" } });
    return NextResponse.json({ data: courts });
  }

  if (type === "cases") {
    const cases = await prisma.landmarkCase.findMany({
      include: { court: true, articlesInterpreted: true },
      orderBy: { year: "asc" },
    });
    return NextResponse.json({ data: cases });
  }

  if (type === "writs") {
    const writs = await prisma.writ.findMany();
    return NextResponse.json({ data: writs });
  }

  const [courts, cases, writs] = await Promise.all([
    prisma.court.findMany({ orderBy: { type: "asc" } }),
    prisma.landmarkCase.findMany({ include: { court: true, articlesInterpreted: true }, orderBy: { year: "asc" } }),
    prisma.writ.findMany(),
  ]);

  return NextResponse.json({ data: { courts, cases, writs } });
}
