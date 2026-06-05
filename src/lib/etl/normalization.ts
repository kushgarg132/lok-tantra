import { z } from "zod";
import Fuse from "fuse.js";
import { prisma } from "../db";

// ─── VALIDATION SCHEMAS ──────────────────────────────────────────

/**
 * Standardized Politician Schema
 * All scrapers must resolve raw data into this schema before ingestion.
 */
export const NormalizedPoliticianSchema = z.object({
  name: z.string().min(2),
  partyAbbreviation: z.string().optional(),
  constituency: z.string().optional(),
  stateCode: z.string().length(2).optional(),
  assets: z.object({
    totalAssets: z.number().optional(),
    liabilities: z.number().optional(),
  }).optional(),
  criminalCasesCount: z.number().default(0),
  sourceUrl: z.string().url(),
});

export type NormalizedPolitician = z.infer<typeof NormalizedPoliticianSchema>;

// ─── NORMALIZATION UTILITIES ─────────────────────────────────────

export class NormalizationEngine {
  /**
   * Cleans names (e.g. "SHRI Narendra Modi" -> "Narendra Modi")
   */
  static cleanName(rawName: string): string {
    return rawName
      .replace(/^(Shri|Smt\.|Dr\.|Adv\.|Mr\.|Mrs\.)\s+/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Deduplication logic using Fuzzy matching.
   * Compares the incoming name against existing database records.
   */
  static async resolvePoliticianId(
    cleanName: string,
    stateCode?: string,
    constituency?: string
  ): Promise<string | null> {
    // Fetch potential matches from DB
    // In production, we would use a more targeted query or ElasticSearch.
    const candidates = await prisma.person.findMany({
      where: {
        OR: [
          { stateCode },
          { constituency },
        ],
      },
      select: { id: true, name: true, stateCode: true, constituency: true },
    });

    if (candidates.length === 0) return null;

    // Use Fuse.js for fuzzy string matching on the name
    const fuse = new Fuse(candidates, {
      keys: ["name"],
      threshold: 0.2, // Strict threshold: 0.0 is perfect match, 1.0 is anything
    });

    const results = fuse.search(cleanName);

    if (results.length > 0) {
      // Return the best match's database ID
      return results[0].item.id;
    }

    return null;
  }
}
