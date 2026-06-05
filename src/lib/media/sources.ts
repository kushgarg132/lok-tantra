import type { EntityType, SourceTrust } from "./types";

// Canonical domain → trust level mapping
// Subdomain matching is applied automatically (e.g., "ministry.gov.in" → matches "gov.in")
const TRUSTED_DOMAIN_MAP: Record<string, SourceTrust> = {
  "sansad.in": "official_govt",
  "loksabha.nic.in": "official_govt",
  "rajyasabha.nic.in": "official_govt",
  "eci.gov.in": "official_govt",
  "pib.gov.in": "official_govt",
  "india.gov.in": "official_govt",
  "sci.gov.in": "official_govt",
  "mha.gov.in": "official_govt",
  "mea.gov.in": "official_govt",
  "finance.gov.in": "official_govt",
  "gov.in": "official_govt",          // Catch-all for any *.gov.in
  "nic.in": "official_govt",          // National Informatics Centre
  "upload.wikimedia.org": "trusted_fallback",
  "commons.wikimedia.org": "trusted_fallback",
};

export function getSourceTrust(url: string): SourceTrust {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");

    // Exact match first
    if (TRUSTED_DOMAIN_MAP[hostname]) return TRUSTED_DOMAIN_MAP[hostname];

    // Suffix match: "ministry.gov.in" should match "gov.in"
    for (const [domain, trust] of Object.entries(TRUSTED_DOMAIN_MAP)) {
      if (hostname === domain || hostname.endsWith(`.${domain}`)) {
        return trust;
      }
    }

    return "unknown";
  } catch {
    return "unknown";
  }
}

export function isTrustedSource(url: string): boolean {
  return getSourceTrust(url) !== "unknown";
}

// ─── URL Builders ─────────────────────────────────────────────
// These construct ranked candidate URLs for each entity type.
// The ingestor tries them in order and uses the first that succeeds.

export interface PersonImageHints {
  name: string;
  sansadId?: string;    // Numeric ID used by Sansad/LS/RS portals
  stateCode?: string;
  chamber?: string;     // "lok_sabha" | "rajya_sabha"
  wikiTitle?: string;   // Wikipedia article title for fallback
}

export function buildPersonImageCandidates(hints: PersonImageHints): string[] {
  const candidates: string[] = [];

  // Lok Sabha (sansad.in) — official member portrait
  if (hints.sansadId) {
    candidates.push(
      `https://sansad.in/images/members/${hints.sansadId}.jpg`,
      `https://sansad.in/images/members/photos/${hints.sansadId}.jpg`,
      `https://loksabha.nic.in/Members/Images/${hints.sansadId}.jpg`
    );

    if (hints.chamber === "rajya_sabha") {
      candidates.push(
        `https://rajyasabha.nic.in/rsnew/member_site/photo/${hints.sansadId}.jpg`,
        `https://rajyasabha.nic.in/images/members/${hints.sansadId}.jpg`
      );
    }
  }

  // Wikimedia Commons (explicit title fallback — only when wikiTitle is provided)
  if (hints.wikiTitle) {
    const encoded = encodeURIComponent(hints.wikiTitle.replace(/ /g, "_"));
    candidates.push(
      `https://upload.wikimedia.org/wikipedia/commons/thumb/search/${encoded}/200px.jpg`
    );
  }

  return candidates;
}

export interface PartyLogoHints {
  abbreviation: string;
  name: string;
  wikiTitle?: string;
}

export function buildPartyLogoCandidates(hints: PartyLogoHints): string[] {
  const candidates: string[] = [];

  // Election Commission of India party symbols
  candidates.push(
    `https://eci.gov.in/candidate-corner/party-symbols/images/${hints.abbreviation.toLowerCase()}.png`,
    `https://eci.gov.in/images/parties/${hints.abbreviation.toLowerCase()}.png`
  );

  if (hints.wikiTitle) {
    const encoded = encodeURIComponent(hints.wikiTitle.replace(/ /g, "_"));
    candidates.push(
      `https://upload.wikimedia.org/wikipedia/commons/thumb/search/${encoded}/200px.png`
    );
  }

  return candidates;
}

export interface InstitutionLogoHints {
  slug: string;
  website?: string;
  wikiTitle?: string;
}

export function buildInstitutionLogoCandidates(
  hints: InstitutionLogoHints
): string[] {
  const candidates: string[] = [];

  // PIB press-release imagery often has official logos
  candidates.push(
    `https://pib.gov.in/images/${hints.slug.replace(/-/g, "_")}_logo.png`
  );

  if (hints.wikiTitle) {
    const encoded = encodeURIComponent(hints.wikiTitle.replace(/ /g, "_"));
    candidates.push(
      `https://upload.wikimedia.org/wikipedia/commons/thumb/search/${encoded}/200px.png`
    );
  }

  return candidates;
}

// Build candidates by entity type using a unified interface
export function buildCandidateUrls(
  entityType: EntityType,
  hints: Record<string, string | undefined>
): string[] {
  switch (entityType) {
    case "person":
      return buildPersonImageCandidates({
        name: hints.name ?? "",
        sansadId: hints.sansadId,
        chamber: hints.chamber,
        wikiTitle: hints.wikiTitle,
      });
    case "party":
      return buildPartyLogoCandidates({
        abbreviation: hints.abbreviation ?? "",
        name: hints.name ?? "",
        wikiTitle: hints.wikiTitle,
      });
    case "institution":
      return buildInstitutionLogoCandidates({
        slug: hints.slug ?? "",
        website: hints.website,
        wikiTitle: hints.wikiTitle,
      });
    default:
      return [];
  }
}
