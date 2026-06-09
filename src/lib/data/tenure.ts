import { prisma } from "@/lib/db";
import type { Tenure, Person, PoliticalParty } from "@prisma/client";

// ── Types ────────────────────────────────────────────────────

export type TenureWithPerson = Tenure & {
  person: Person & { party: PoliticalParty | null };
};

export type ActiveTenureResult =
  | TenureWithPerson
  | "not-yet-established"
  | null; // null = vacant

// ── Pure resolution logic (testable without DB) ─────────────

/**
 * Resolve the active tenure for a position at a given date from a
 * pre-loaded array of tenures.  Implements the 5 temporal resolution rules:
 *
 *   1. startDate is INCLUSIVE
 *   2. endDate is INCLUSIVE
 *   3. No match = vacant (null)
 *   4. Before earliest tenure = "not-yet-established"
 *   5. Overlapping tenures = latest startDate wins
 */
export function resolveActiveTenure<T extends { positionId: string; startDate: Date; endDate: Date | null }>(
  tenures: T[],
  positionId: string,
  date: Date,
): T | "not-yet-established" | null {
  const positionTenures = tenures.filter((t) => t.positionId === positionId);

  if (positionTenures.length === 0) return null; // Rule 3: vacant (no tenures at all)

  // Find tenures active at the query date
  const active = positionTenures
    .filter((t) => {
      const startOk = t.startDate <= date; // Rule 1: startDate inclusive
      const endOk = t.endDate === null || t.endDate >= date; // Rule 2: endDate inclusive
      return startOk && endOk;
    })
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime()); // Rule 5: latest startDate first

  if (active.length > 0) return active[0];

  // Rule 4: if query date is before all tenures, not-yet-established
  const earliest = positionTenures.reduce((min, t) =>
    t.startDate < min.startDate ? t : min,
  );
  if (date < earliest.startDate) return "not-yet-established";

  return null; // Rule 3: vacant (gap between tenures)
}

// ── Database-backed functions ────────────────────────────────

/**
 * Get the active tenure for a position at a given date.
 * Defaults to today if no date is provided.
 */
export async function getActiveTenure(
  positionId: string,
  date?: Date,
): Promise<ActiveTenureResult> {
  const queryDate = date ?? new Date();

  // Query tenures active at the target date
  const tenures = await prisma.tenure.findMany({
    where: {
      positionId,
      startDate: { lte: queryDate },
      OR: [
        { endDate: null },
        { endDate: { gte: queryDate } },
      ],
    },
    orderBy: { startDate: "desc" },
    take: 1,
    include: { person: { include: { party: true } } },
  });

  if (tenures.length > 0) return tenures[0];

  // Check if position has any tenures — if all are after queryDate, not-yet-established
  const earliest = await prisma.tenure.findFirst({
    where: { positionId },
    orderBy: { startDate: "asc" },
    select: { startDate: true },
  });

  if (earliest && queryDate < earliest.startDate) {
    return "not-yet-established";
  }

  return null; // vacant
}

/**
 * Get all tenures for a position, ordered by startDate descending (most recent first).
 */
export async function getTenuresForPosition(positionId: string) {
  return prisma.tenure.findMany({
    where: { positionId },
    orderBy: { startDate: "desc" },
    include: { person: { include: { party: true } } },
  });
}

/**
 * Get all tenures for a person, ordered by startDate ascending (chronological).
 */
export async function getTenuresForPerson(personId: string) {
  return prisma.tenure.findMany({
    where: { personId },
    orderBy: { startDate: "asc" },
    include: { position: { include: { institution: true } } },
  });
}
