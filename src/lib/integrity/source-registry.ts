/**
 * Trusted source registry for Indian democracy data.
 * All data ingested into LokTantra must originate from registered sources.
 */

export type SourceTier = "official" | "quasi-official" | "research" | "media" | "community";

export interface TrustedSource {
  id:          string;
  name:        string;
  domain:      string;
  tier:        SourceTier;
  credibility: number;   // 0.0–1.0
  domains:     string[]; // All subdomains / related domains
  description: string;
  verifiedBy:  string;   // How we verify this source
}

export const TRUSTED_SOURCES: TrustedSource[] = [
  // ── Tier 1: Official Government ──────────────────────────────
  {
    id:          "eci",
    name:        "Election Commission of India",
    domain:      "eci.gov.in",
    tier:        "official",
    credibility: 1.0,
    domains:     ["eci.gov.in", "results.eci.gov.in", "voters.eci.gov.in"],
    description: "India's constitutional authority for elections",
    verifiedBy:  "Statutory body under Article 324 of the Constitution",
  },
  {
    id:          "sansad",
    name:        "Parliament of India",
    domain:      "sansad.in",
    tier:        "official",
    credibility: 1.0,
    domains:     ["sansad.in", "loksabha.nic.in", "rajyasabha.nic.in"],
    description: "Official Parliament of India portal",
    verifiedBy:  "Controlled by Parliament Secretariat",
  },
  {
    id:          "sci",
    name:        "Supreme Court of India",
    domain:      "sci.gov.in",
    tier:        "official",
    credibility: 1.0,
    domains:     ["sci.gov.in", "supremecourtofindia.nic.in"],
    description: "Supreme Court of India official portal",
    verifiedBy:  "Controlled by Supreme Court Registry",
  },
  {
    id:          "india-code",
    name:        "India Code",
    domain:      "indiacode.nic.in",
    tier:        "official",
    credibility: 1.0,
    domains:     ["indiacode.nic.in"],
    description: "Digital repository of all central laws of India",
    verifiedBy:  "Ministry of Law and Justice",
  },
  {
    id:          "india-gov",
    name:        "Government of India Portal",
    domain:      "india.gov.in",
    tier:        "official",
    credibility: 1.0,
    domains:     ["india.gov.in", "pib.gov.in", "mib.gov.in"],
    description: "National web portal of India",
    verifiedBy:  "NIC under Ministry of Electronics & IT",
  },
  {
    id:          "rbi",
    name:        "Reserve Bank of India",
    domain:      "rbi.org.in",
    tier:        "official",
    credibility: 1.0,
    domains:     ["rbi.org.in"],
    description: "India's central bank — monetary policy, financial data",
    verifiedBy:  "Statutory body under RBI Act 1934",
  },
  {
    id:          "mospi",
    name:        "Ministry of Statistics (MoSPI)",
    domain:      "mospi.gov.in",
    tier:        "official",
    credibility: 1.0,
    domains:     ["mospi.gov.in", "censusindia.gov.in"],
    description: "National statistical authority, Census data",
    verifiedBy:  "Government of India statistical office",
  },
  {
    id:          "president",
    name:        "President of India",
    domain:      "presidentofindia.gov.in",
    tier:        "official",
    credibility: 1.0,
    domains:     ["presidentofindia.gov.in", "rashtrapatibhavan.in"],
    description: "Official Rashtrapati Bhavan portal",
    verifiedBy:  "President's Secretariat",
  },

  // ── Tier 2: Quasi-Official / Statutory Bodies ─────────────
  {
    id:          "nhrc",
    name:        "National Human Rights Commission",
    domain:      "nhrc.nic.in",
    tier:        "quasi-official",
    credibility: 0.95,
    domains:     ["nhrc.nic.in"],
    description: "India's national human rights watchdog",
    verifiedBy:  "Statutory body under Protection of Human Rights Act 1993",
  },
  {
    id:          "cic",
    name:        "Central Information Commission",
    domain:      "cic.gov.in",
    tier:        "quasi-official",
    credibility: 0.95,
    domains:     ["cic.gov.in"],
    description: "RTI appellate authority",
    verifiedBy:  "Statutory body under RTI Act 2005",
  },

  // ── Tier 3: Research / Think-Tanks ────────────────────────
  {
    id:          "prs",
    name:        "PRS Legislative Research",
    domain:      "prsindia.org",
    tier:        "research",
    credibility: 0.92,
    domains:     ["prsindia.org"],
    description: "Non-partisan legislative research and analysis",
    verifiedBy:  "Independent research institution — methodology published",
  },
  {
    id:          "adr",
    name:        "Association for Democratic Reforms",
    domain:      "adrindia.org",
    tier:        "research",
    credibility: 0.90,
    domains:     ["adrindia.org", "myneta.info"],
    description: "Electoral transparency and candidate disclosure analysis",
    verifiedBy:  "Registered NGO — data sourced from ECI affidavits",
  },
  {
    id:          "vidhi",
    name:        "Vidhi Centre for Legal Policy",
    domain:      "vidhilegalpolicy.in",
    tier:        "research",
    credibility: 0.88,
    domains:     ["vidhilegalpolicy.in"],
    description: "Independent legal policy research",
    verifiedBy:  "Published methodology, peer-reviewed legal analysis",
  },
];

// Fast lookup by domain
const DOMAIN_INDEX = new Map<string, TrustedSource>();
for (const src of TRUSTED_SOURCES) {
  for (const domain of src.domains) {
    DOMAIN_INDEX.set(domain, src);
  }
}

export function getSourceByDomain(domain: string): TrustedSource | null {
  // Exact match first
  if (DOMAIN_INDEX.has(domain)) return DOMAIN_INDEX.get(domain)!;
  // Subdomain match: strip subdomains until we find a match
  const parts = domain.split(".");
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join(".");
    if (DOMAIN_INDEX.has(parent)) return DOMAIN_INDEX.get(parent)!;
  }
  return null;
}

export function getSourceByUrl(url: string): TrustedSource | null {
  try {
    const { hostname } = new URL(url);
    return getSourceByDomain(hostname);
  } catch { return null; }
}

export function isApprovedSource(url: string): boolean {
  return getSourceByUrl(url) !== null;
}

export function getSourceCredibility(url: string): number {
  return getSourceByUrl(url)?.credibility ?? 0;
}

export interface SourceVerificationResult {
  approved:    boolean;
  source:      TrustedSource | null;
  credibility: number;
  tier:        SourceTier | "unknown";
  warnings:    string[];
}

export function verifySource(url: string): SourceVerificationResult {
  const source  = getSourceByUrl(url);
  const warnings: string[] = [];

  if (!source) {
    warnings.push(`Domain not in trusted source registry. Data from this URL will be marked as unverified.`);
    return { approved: false, source: null, credibility: 0, tier: "unknown", warnings };
  }

  if (source.credibility < 0.8) {
    warnings.push(`Source credibility is ${(source.credibility * 100).toFixed(0)}% — treat data with caution.`);
  }

  return {
    approved:    true,
    source,
    credibility: source.credibility,
    tier:        source.tier,
    warnings,
  };
}

export function getAllSources(): TrustedSource[] {
  return TRUSTED_SOURCES;
}
