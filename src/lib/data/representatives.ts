import { prisma } from "@/lib/db";
import { getTenuresForPerson } from "@/lib/data/tenure";

export async function getRepresentatives(filters?: {
  state?: string;
  party?: string;
  chamber?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.state) where.state = filters.state;
  if (filters?.chamber) where.chamber = filters.chamber;
  if (filters?.party) where.partyId = filters.party;

  if (filters?.search) {
    const q = filters.search;
    return prisma.person.findMany({
      where: {
        ...where,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { constituency: { contains: q, mode: "insensitive" } },
          { state: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { party: true },
      orderBy: { name: "asc" },
    });
  }

  return prisma.person.findMany({
    where,
    include: { party: true },
    orderBy: { name: "asc" },
  });
}

export async function getRepresentativeById(id: string) {
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      party: true,
      electionResults: { include: { constituency: true } },
    },
  });

  if (!person) return null;

  // Resolve current position via Tenure
  const tenures = await getTenuresForPerson(id);
  const activeTenure = tenures.find((t) => t.endDate === null) ?? null;
  const currentPosition = activeTenure
    ? { ...activeTenure.position, institution: activeTenure.position.institution }
    : null;

  return { ...person, currentPosition };
}

export async function getDistinctStates() {
  const results = await prisma.person.findMany({
    where: { state: { not: null } },
    distinct: ["state"],
    select: { state: true },
    orderBy: { state: "asc" },
  });
  return results.map((r) => r.state).filter(Boolean) as string[];
}
