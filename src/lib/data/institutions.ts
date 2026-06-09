import { prisma } from "@/lib/db";
import { getActiveTenure } from "@/lib/data/tenure";

export async function getAllInstitutions() {
  return prisma.institution.findMany({
    include: { children: true },
    orderBy: { name: "asc" },
  });
}

export async function getInstitutionBySlug(slug: string) {
  const institution = await prisma.institution.findUnique({
    where: { slug },
    include: {
      children: true,
      parent: true,
      positions: true,
    },
  });

  if (!institution) return null;

  // Resolve current holders via Tenure for each position
  const positionsWithHolders = await Promise.all(
    institution.positions.map(async (position) => {
      const activeTenure = await getActiveTenure(position.id);
      const currentHolder =
        activeTenure && activeTenure !== "not-yet-established"
          ? {
              id: activeTenure.person.id,
              name: activeTenure.person.name,
              designation: activeTenure.person.designation,
              photoUrl: activeTenure.person.photoUrl,
              party: activeTenure.person.party,
            }
          : null;
      return { ...position, currentHolder };
    }),
  );

  return { ...institution, positions: positionsWithHolders };
}

export async function getInstitutionTree() {
  const all = await prisma.institution.findMany({
    include: {
      positions: true,
    },
    orderBy: { name: "asc" },
  });

  // Resolve current holders via Tenure for each position across all institutions
  const result = await Promise.all(
    all.map(async (inst) => {
      const positionsWithHolders = await Promise.all(
        inst.positions.map(async (position) => {
          const activeTenure = await getActiveTenure(position.id);
          const currentHolder =
            activeTenure && activeTenure !== "not-yet-established"
              ? {
                  id: activeTenure.person.id,
                  name: activeTenure.person.name,
                  designation: activeTenure.person.designation,
                  photoUrl: activeTenure.person.photoUrl,
                  party: activeTenure.person.party,
                }
              : null;
          return { ...position, currentHolder };
        }),
      );
      return { ...inst, positions: positionsWithHolders };
    }),
  );

  return result;
}

export async function searchInstitutions(query: string) {
  return prisma.institution.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { powers: { hasSome: [query] } },
      ],
    },
    include: { children: true },
  });
}

export async function getInstitutionsByLevel(level: string) {
  return prisma.institution.findMany({
    where: { level },
    include: { children: true },
  });
}

export async function getInstitutionsByBranch(branch: string) {
  return prisma.institution.findMany({
    where: { branch },
    include: { children: true },
  });
}

export async function getMinistries() {
  return prisma.ministry.findMany({ orderBy: { name: "asc" } });
}

export async function getBureaucraticLevels(hierarchy: string) {
  return prisma.bureaucraticLevel.findMany({
    where: { hierarchy },
    orderBy: { level: "asc" },
  });
}

export async function getCivilServices() {
  return prisma.civilService.findMany({ orderBy: { name: "asc" } });
}
