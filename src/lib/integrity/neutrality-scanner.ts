/**
 * Political neutrality scanner for AI-generated responses.
 * Ensures LokTantra remains constitutionally grounded and politically neutral.
 */

// Charged adjectives — flag if applied directly to politicians/parties
const LOADED_ADJECTIVES = [
  "corrupt", "criminal", "dictator", "tyrant", "puppet", "stooge",
  "traitor", "terrorist", "fascist", "communist", "extremist",
  "incompetent", "illegitimate", "evil", "dangerous", "anti-national",
  "divisive", "appeasement", "nepotistic", "dynastic", "authoritarian",
];

// Indian political entities (neutral — their mere mention is OK, but framing matters)
const POLITICAL_PARTIES = [
  "bjp", "bharatiya janata party",
  "inc", "indian national congress", "congress party",
  "aap", "aam aadmi party",
  "sp", "samajwadi party",
  "bsp", "bahujan samaj party",
  "tmc", "trinamool congress",
  "cpim", "cpi", "communist party",
  "dmk", "admk", "aiadmk",
  "rjd", "ncp", "shiv sena",
  "ysrcp", "tdp", "brs", "trs",
];

const POLITICAL_FIGURES = [
  "narendra modi", "rahul gandhi", "amit shah", "sonia gandhi",
  "arvind kejriwal", "mamata banerjee", "yogi adityanath",
  "sharad pawar", "nitish kumar", "uddhav thackeray",
];

// Patterns that signal unsourced absolute claims
const UNSOURCED_CLAIM_PATTERNS = [
  /\b(is|are|was|were)\s+(definitely|certainly|obviously|clearly|undeniably)\b/gi,
  /\b(always|never|everyone knows|it's well-known|it's a fact)\b/gi,
  /\b(proved|proven|confirmed|established)\s+(that|to be)\b/gi,
];

// Balanced language indicators (good — these suggest neutrality)
const NEUTRAL_INDICATORS = [
  /\baccording to\b/gi,
  /\bthe constitution (states|provides|mandates|says)\b/gi,
  /\bunder article\s+\d/gi,
  /\bthe supreme court\s+(held|ruled|observed)\b/gi,
  /\bas per\b/gi,
  /\bsources (indicate|suggest|report)\b/gi,
];

export interface NeutralityScan {
  score:        number;        // 0.0–1.0, where 1.0 = perfectly neutral
  issues:       NeutralityIssue[];
  recommendation: "pass" | "review" | "block";
  disclaimer?:  string;        // Optional disclaimer to append to response
}

export interface NeutralityIssue {
  type:    "loaded_language" | "unsourced_claim" | "partisan_framing" | "missing_attribution";
  excerpt: string;
  detail:  string;
}

function findLoadedLanguage(text: string): NeutralityIssue[] {
  const issues: NeutralityIssue[] = [];
  const lower = text.toLowerCase();

  for (const adj of LOADED_ADJECTIVES) {
    const idx = lower.indexOf(adj);
    if (idx === -1) continue;

    const excerpt = text.slice(Math.max(0, idx - 30), idx + adj.length + 30).trim();
    // Check if it's near a political entity (amplifies the issue)
    const nearPolitical = POLITICAL_PARTIES.some((p) => lower.includes(p)) ||
                          POLITICAL_FIGURES.some((f) => lower.includes(f));

    if (nearPolitical) {
      issues.push({
        type:    "loaded_language",
        excerpt,
        detail:  `Loaded adjective "${adj}" used near political entity. Use factual, neutral language instead.`,
      });
    }
  }

  return issues;
}

function findUnsourcedClaims(text: string): NeutralityIssue[] {
  const issues: NeutralityIssue[] = [];

  for (const pattern of UNSOURCED_CLAIM_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      issues.push({
        type:    "unsourced_claim",
        excerpt: matches[0],
        detail:  "Absolute claim without citation. Prefer 'according to [source]' or cite a constitutional article.",
      });
    }
  }

  return issues;
}

function checkMissingAttribution(text: string): NeutralityIssue[] {
  const issues: NeutralityIssue[] = [];

  // Statistical claims should have attribution
  const statsPattern = /\b\d+(\.\d+)?%|\d+\s+(lakh|crore|million|billion)\b/gi;
  const statsMatches = text.match(statsPattern);

  if (statsMatches && statsMatches.length > 0) {
    const hasAttribution = NEUTRAL_INDICATORS.some((p) => p.test(text));
    if (!hasAttribution) {
      issues.push({
        type:    "missing_attribution",
        excerpt: statsMatches[0],
        detail:  "Statistical data cited without source attribution. Add 'according to [official source]'.",
      });
    }
  }

  return issues;
}

export function scanForNeutrality(text: string): NeutralityScan {
  const issues: NeutralityIssue[] = [
    ...findLoadedLanguage(text),
    ...findUnsourcedClaims(text),
    ...checkMissingAttribution(text),
  ];

  // Count neutral indicators (positive signals)
  const neutralCount = NEUTRAL_INDICATORS.filter((p) => p.test(text)).length;

  // Score: start at 1.0, deduct per issue, add back for neutral indicators
  const deduction = issues.length * 0.12;
  const bonus     = Math.min(neutralCount * 0.05, 0.2);
  const score     = Math.max(0, Math.min(1, 1.0 - deduction + bonus));

  const recommendation: NeutralityScan["recommendation"] =
    score >= 0.7           ? "pass"   :
    score >= 0.4           ? "review" :
    "block";

  const disclaimer = issues.length > 0
    ? "This information is based on constitutional provisions and official sources. LokTantra presents governance information neutrally across all political perspectives."
    : undefined;

  return { score, issues, recommendation, disclaimer };
}

// Quick check — true if content passes neutrality (no block)
export function isNeutral(text: string): boolean {
  return scanForNeutrality(text).recommendation !== "block";
}
