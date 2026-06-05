import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const QuerySchema = z.object({
  state:   z.string().max(100).optional(),
  party:   z.string().max(100).optional(),
  chamber: z.enum(["lok_sabha", "rajya_sabha", "state_assembly", "state_council"]).optional(),
  q:       z.string().max(200).optional(),
  id:      z.string().cuid().optional(),
  limit:   z.coerce.number().int().min(1).max(100).default(50),
  offset:  z.coerce.number().int().min(0).default(0),
});

export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = QuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    const { state, party, chamber, q: search, id, limit, offset } = parsed.data;

    if (id) {
      const person = await prisma.person.findUnique({
        where: { id },
        include: {
          party:           { select: { id: true, name: true, abbreviation: true, color: true, logoUrl: true } },
          currentPosition: { include: { institution: { select: { id: true, name: true, slug: true } } } },
        },
      });
      return NextResponse.json({ data: person });
    }

    const where: Record<string, unknown> = {};
    if (state)   where.state   = state;
    if (chamber) where.chamber = chamber;

    if (party) {
      const partyRecord = await prisma.politicalParty.findFirst({
        where: { OR: [{ abbreviation: party }, { name: party }] },
        select: { id: true },
      });
      if (partyRecord) where.partyId = partyRecord.id;
    }

    if (search) {
      const [results, total] = await prisma.$transaction([
        prisma.person.findMany({
          where: {
            ...where,
            OR: [
              { name:         { contains: search, mode: "insensitive" } },
              { constituency: { contains: search, mode: "insensitive" } },
              { state:        { contains: search, mode: "insensitive" } },
              { designation:  { contains: search, mode: "insensitive" } },
            ],
          },
          select: {
            id: true, name: true, designation: true, state: true, constituency: true,
            chamber: true, thumbnailUrl: true, photoUrl: true,
            party: { select: { id: true, name: true, abbreviation: true, color: true } },
          },
          orderBy: { name: "asc" },
          take:    limit,
          skip:    offset,
        }),
        prisma.person.count({
          where: {
            ...where,
            OR: [
              { name:         { contains: search, mode: "insensitive" } },
              { constituency: { contains: search, mode: "insensitive" } },
              { state:        { contains: search, mode: "insensitive" } },
              { designation:  { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      ]);
      return NextResponse.json({ data: results, total, limit, offset });
    }

    const [results, total] = await prisma.$transaction([
      prisma.person.findMany({
        where,
        select: {
          id: true, name: true, designation: true, state: true, constituency: true,
          chamber: true, thumbnailUrl: true, photoUrl: true,
          party: { select: { id: true, name: true, abbreviation: true, color: true } },
        },
        orderBy: { name: "asc" },
        take:    limit,
        skip:    offset,
      }),
      prisma.person.count({ where }),
    ]);

    return NextResponse.json({ data: results, total, limit, offset });
  } catch (error) {
    console.error("[API:representatives]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
