import { getSourceCredibility, type SourceTier } from "./source-registry";

export type DataOrigin =
  | "constitution_text"   // Direct constitutional text
  | "official_api"        // Government API response
  | "official_scrape"     // Scraped from .gov.in
  | "research_scrape"     // Scraped from research institution
  | "manual_entry"        // Manually entered by admin
  | "community"           // Community-contributed
  | "ai_generated"        // AI-generated / inferred
  | "unknown";

const ORIGIN_SCORES: Record<DataOrigin, number> = {
  constitution_text: 1.00,
  official_api:      0.95,
  official_scrape:   0.88,
  research_scrape:   0.80,
  manual_entry:      0.75,
  community:         0.50,
  ai_generated:      0.40,
  unknown:           0.30,
};

export interface ConfidenceResult {
  score:          number;   // 0.0–1.0
  label:          "verified" | "high" | "medium" | "low" | "unverified";
  factors:        string[];
  requiresReview: boolean;
}

export function scoreConfidence(opts: {
  origin:       DataOrigin;
  sourceUrl?:   string;
  ageHours?:    number;     // How old is the data?
  verificationStatus?: string; // "VERIFIED" | "PENDING" | "REJECTED"
  crossVerified?: boolean;  // Confirmed by multiple sources?
}): ConfidenceResult {
  let score = ORIGIN_SCORES[opts.origin] ?? ORIGIN_SCORES.unknown;
  const factors: string[] = [`Origin: ${opts.origin} (${(score * 100).toFixed(0)}%)`];

  // Source domain credibility
  if (opts.sourceUrl) {
    const srcCred = getSourceCredibility(opts.sourceUrl);
    if (srcCred > 0) {
      score = (score + srcCred) / 2;
      factors.push(`Source credibility: ${(srcCred * 100).toFixed(0)}%`);
    } else {
      score *= 0.7;
      factors.push("Source not in trusted registry — penalized");
    }
  }

  // Data age decay (constitutional text never decays, other data does)
  if (opts.ageHours != null && opts.origin !== "constitution_text") {
    if (opts.ageHours > 8760) { // >1 year
      score *= 0.6;
      factors.push("Data is over 1 year old — staleness penalty");
    } else if (opts.ageHours > 720) { // >30 days
      score *= 0.85;
      factors.push("Data is over 30 days old");
    }
  }

  // Cross-verification bonus
  if (opts.crossVerified) {
    score = Math.min(1.0, score + 0.08);
    factors.push("Cross-verified by multiple sources (+8%)");
  }

  // Manual verification override
  if (opts.verificationStatus === "VERIFIED") {
    score = Math.min(1.0, score + 0.1);
    factors.push("Manually verified by editorial team (+10%)");
  } else if (opts.verificationStatus === "REJECTED") {
    score = 0.0;
    factors.push("Source verification REJECTED — do not display");
  }

  const label: ConfidenceResult["label"] =
    score >= 0.9 ? "verified" :
    score >= 0.75 ? "high" :
    score >= 0.55 ? "medium" :
    score >= 0.35 ? "low" :
    "unverified";

  const requiresReview = score < 0.6 || opts.verificationStatus === "PENDING";

  return { score, label, factors, requiresReview };
}

// Tier-to-origin mapping (for use in indexers)
const TIER_ORIGIN: Record<SourceTier, DataOrigin> = {
  "official":       "official_api",
  "quasi-official": "official_scrape",
  "research":       "research_scrape",
  "media":          "research_scrape",
  "community":      "community",
};

export function originFromTier(tier: SourceTier): DataOrigin {
  return TIER_ORIGIN[tier] ?? "unknown";
}
