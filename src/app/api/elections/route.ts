export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const QuerySchema = z.object({
  type: z.enum(["current", "party-results", "history", "states"]).optional(),
  year: z.coerce.number().int().min(1952).max(2030).optional(),
});

export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = QuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    const { type, year: targetYear } = parsed.data;

    if (type === "current" || type === "party-results") {
      let results;
      if (targetYear) {
        results = await prisma.partyElectionResult.findMany({
          where: { year: targetYear, type: "lok_sabha" },
          orderBy: { seats: "desc" },
        });
      } else {
        const latest = await prisma.electionSummary.findFirst({
          where: { type: "lok_sabha" },
          orderBy: { year: "desc" },
        });
        results = latest
          ? await prisma.partyElectionResult.findMany({
              where: { year: latest.year, type: "lok_sabha" },
              orderBy: { seats: "desc" },
            })
          : [];
      }
      return NextResponse.json({ data: results });
    }

    if (type === "history") {
      const history = await prisma.electionSummary.findMany({
        where: { type: "lok_sabha" },
        orderBy: { year: "asc" },
      });
      return NextResponse.json({ data: history });
    }

    if (type === "states") {
      const states = await prisma.stateUT.findMany({ orderBy: { lsSeats: "desc" } });
      return NextResponse.json({ data: states });
    }

    const [history, partyResults, states] = await Promise.all([
      prisma.electionSummary.findMany({ where: { type: "lok_sabha" }, orderBy: { year: "asc" } }),
      prisma.partyElectionResult.findMany({
        orderBy: [{ year: "desc" }, { seats: "desc" }],
        take: 500, // cap to prevent unbounded result
      }),
      prisma.stateUT.findMany({ orderBy: { lsSeats: "desc" } }),
    ]);

    return NextResponse.json({ data: { history, partyResults, states } });
  } catch (error) {
    console.error("[API:elections]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
