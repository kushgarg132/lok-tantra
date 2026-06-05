import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const QuerySchema = z.object({
  abbr: z.string().max(20).optional(),
  type: z.enum(["ideology"]).optional(),
});

export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = QuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    const { abbr, type } = parsed.data;

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

    const parties = await prisma.politicalParty.findMany({
      select: {
        id: true, name: true, abbreviation: true, ideology: true, color: true,
        type: true, logoUrl: true, currentSeats: true, founded: true,
        _count: { select: { members: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: parties });
  } catch (error) {
    console.error("[API:parties]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
