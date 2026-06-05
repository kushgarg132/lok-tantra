import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  const party = searchParams.get("party");
  const chamber = searchParams.get("chamber");
  const search = searchParams.get("q");
  const id = searchParams.get("id");

  if (id) {
    const person = await prisma.person.findUnique({
      where: { id },
      include: {
        party: true,
        currentPosition: { include: { institution: true } },
      },
    });
    return NextResponse.json({ data: person });
  }

  const where: Record<string, unknown> = {};
  if (state) where.state = state;
  if (chamber) where.chamber = chamber;

  if (party) {
    const partyRecord = await prisma.politicalParty.findFirst({
      where: { OR: [{ abbreviation: party }, { name: party }] },
    });
    if (partyRecord) where.partyId = partyRecord.id;
  }

  if (search) {
    const results = await prisma.person.findMany({
      where: {
        ...where,
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { constituency: { contains: search, mode: "insensitive" } },
          { state: { contains: search, mode: "insensitive" } },
          { designation: { contains: search, mode: "insensitive" } },
        ],
      },
      include: { party: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: results, total: results.length });
  }

  const results = await prisma.person.findMany({
    where,
    include: { party: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: results, total: results.length });
}
