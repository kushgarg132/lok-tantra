import { prisma } from "@/lib/db";

export async function getConstitutionParts() {
  return prisma.constitutionPart.findMany({ orderBy: { number: "asc" } });
}

export async function getArticles(category?: string) {
  return prisma.constitutionArticle.findMany({
    where: category ? { category } : undefined,
    include: {
      amendments: true,
      cases: true,
      part: true,
    },
    orderBy: { number: "asc" },
  });
}

export async function getArticleByNumber(number: string) {
  return prisma.constitutionArticle.findUnique({
    where: { number },
    include: {
      amendments: true,
      cases: true,
      part: true,
    },
  });
}

export async function searchArticles(query: string) {
  return prisma.constitutionArticle.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { text: { contains: query, mode: "insensitive" } },
        { number: { contains: query } },
      ],
    },
    include: { amendments: true, cases: true, part: true },
  });
}

export async function getAmendments() {
  return prisma.amendment.findMany({
    include: { articlesAffected: true },
    orderBy: { number: "asc" },
  });
}

export async function searchAmendments(query: string) {
  return prisma.amendment.findMany({
    where: {
      OR: [
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { number: "asc" },
  });
}

export async function getLandmarkCases() {
  return prisma.landmarkCase.findMany({
    include: { court: true, articlesInterpreted: true },
    orderBy: { year: "asc" },
  });
}

export async function searchCases(query: string) {
  return prisma.landmarkCase.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { summary: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { court: true, articlesInterpreted: true },
    orderBy: { year: "asc" },
  });
}

export async function getWrits() {
  return prisma.writ.findMany();
}
