import { prisma } from "@/lib/db";

export async function getGovernanceProcesses() {
  return prisma.governanceProcess.findMany({
    include: { steps: { orderBy: { order: "asc" } } },
    orderBy: { name: "asc" },
  });
}

export async function getGovernanceProcessBySlug(slug: string) {
  return prisma.governanceProcess.findUnique({
    where: { slug },
    include: { steps: { orderBy: { order: "asc" } } },
  });
}
