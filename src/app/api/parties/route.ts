export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const QuerySchema = z.object({
  abbr:   z.string().max(20).optional(),
  type:   z.enum(["ideology"]).optional(),
  limit:  z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = QuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    const { abbr, type, limit, offset } = parsed.data;

    if (type === "ideology") {
      const spectrum = await prisma.ideologyPosition.findMany({ orderBy: { order: "asc" } });
      return NextResponse.json({ data: spectrum });
    }

    if (abbr) {
      const party = await prisma.politicalParty.findUnique({
        where: { abbreviation: abbr },
        include: {
          members: {
            select: { id: true, name: true, designation: true, constituency: true, state: true, thumbnailUrl: true },
            take: 50,
          },
        },
      });
      return NextResponse.json({ data: party });
    }

    const [parties, total] = await prisma.$transaction([
      prisma.politicalParty.findMany({
        select: {
          id: true, name: true, abbreviation: true, ideology: true, color: true,
          type: true, logoUrl: true, currentSeats: true, founded: true,
          _count: { select: { members: true } },
        },
        orderBy: { name: "asc" },
        take:    limit,
        skip:    offset,
      }),
      prisma.politicalParty.count(),
    ]);

    return NextResponse.json({ data: parties, total, limit, offset });
  } catch (error) {
    console.error("[API:parties]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
