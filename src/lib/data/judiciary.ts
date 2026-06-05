import { prisma } from "@/lib/db";

export async function getCourts() {
  return prisma.court.findMany({ orderBy: { type: "asc" } });
}

export async function getCourtByName(name: string) {
  return prisma.court.findUnique({
    where: { name },
    include: { cases: { include: { articlesInterpreted: true } } },
  });
}
