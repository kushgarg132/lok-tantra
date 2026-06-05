import { prisma } from "@/lib/db";

export async function getLearningPaths() {
  return prisma.learningPath.findMany({
    include: { modules: { orderBy: { order: "asc" } } },
    orderBy: { estimatedHours: "asc" },
  });
}

export async function getLearningPathBySlug(slug: string) {
  return prisma.learningPath.findUnique({
    where: { slug },
    include: { modules: { orderBy: { order: "asc" } } },
  });
}
