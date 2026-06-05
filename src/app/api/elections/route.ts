import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const year = searchParams.get("year");

  if (type === "current" || type === "party-results") {
    const targetYear = year ? parseInt(year) : undefined;
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

  // Return all
  const [history, partyResults, states] = await Promise.all([
    prisma.electionSummary.findMany({ where: { type: "lok_sabha" }, orderBy: { year: "asc" } }),
    prisma.partyElectionResult.findMany({ orderBy: [{ year: "desc" }, { seats: "desc" }] }),
    prisma.stateUT.findMany({ orderBy: { lsSeats: "desc" } }),
  ]);

  return NextResponse.json({ data: { history, partyResults, states } });
}
