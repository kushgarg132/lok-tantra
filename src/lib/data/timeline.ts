import { prisma } from "@/lib/db";

export async function getTimelineEvents(category?: string) {
  return prisma.timelineEvent.findMany({
    where: category ? { category } : undefined,
    orderBy: { date: "asc" },
  });
}
