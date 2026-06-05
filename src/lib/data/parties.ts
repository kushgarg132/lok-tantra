import { prisma } from "@/lib/db";

export async function getAllParties() {
  return prisma.politicalParty.findMany({
    include: { _count: { select: { members: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getPartyByAbbreviation(abbr: string) {
  return prisma.politicalParty.findUnique({
    where: { abbreviation: abbr },
    include: { members: true },
  });
}

export async function getIdeologySpectrum() {
  return prisma.ideologyPosition.findMany({ orderBy: { order: "asc" } });
}
