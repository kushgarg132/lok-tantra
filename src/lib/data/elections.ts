import { prisma } from "@/lib/db";

export async function getElectionSummaries(type?: string) {
  return prisma.electionSummary.findMany({
    where: type ? { type } : undefined,
    orderBy: { year: "asc" },
  });
}

export async function getPartyElectionResults(year?: number, type?: string) {
  return prisma.partyElectionResult.findMany({
    where: {
      ...(year ? { year } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { seats: "desc" },
  });
}

export async function getLatestPartyResults() {
  const latest = await prisma.electionSummary.findFirst({
    where: { type: "lok_sabha" },
    orderBy: { year: "desc" },
  });
  if (!latest) return [];
  return prisma.partyElectionResult.findMany({
    where: { year: latest.year, type: "lok_sabha" },
    orderBy: { seats: "desc" },
  });
}

export async function getStateUTs() {
  return prisma.stateUT.findMany({ orderBy: { lsSeats: "desc" } });
}

export async function getStateByCode(code: string) {
  return prisma.stateUT.findUnique({ where: { code } });
}
