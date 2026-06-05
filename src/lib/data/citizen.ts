import { prisma } from "@/lib/db";

export async function getCitizenActions() {
  return prisma.citizenAction.findMany({ orderBy: { title: "asc" } });
}

export async function getCitizenActionBySlug(slug: string) {
  return prisma.citizenAction.findUnique({ where: { slug } });
}
