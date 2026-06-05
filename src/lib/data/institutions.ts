import { prisma } from "@/lib/db";

export async function getAllInstitutions() {
  return prisma.institution.findMany({
    include: { children: true },
    orderBy: { name: "asc" },
  });
}

export async function getInstitutionBySlug(slug: string) {
  return prisma.institution.findUnique({
    where: { slug },
    include: {
      children: true,
      parent: true,
      positions: { include: { currentHolder: { include: { party: true } } } },
    },
  });
}

export async function getInstitutionTree() {
  const all = await prisma.institution.findMany({
    include: {
      positions: {
        include: { currentHolder: { include: { party: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  return all;
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
