// ─── Types ────────────────────────────────────────────────────────────────────

export interface BondPartyReceipt {
  party: string;
  shortName: string;
  color: string;
  totalCr: number;          // ₹ crore
  phasesActive: number;
  ideology: string;
}

export interface BondDonor {
  name: string;
  sector: string;
  sectorColor: string;
  totalCr: number;
  primaryParty: string;     // largest recipient
  knownIssues?: string;     // ED/CBI probe, contract awarded, etc.
}

export interface BondPhase {
  phase: number;
  year: number;
  months: string;
  totalIssuedCr: number;
  saleDays: number;
}

export interface DonationSectorFlow {
  sector: string;
  color: string;
  totalCr: number;
  partyFlows: { party: string; amountCr: number }[];
}

export interface MPAffidavit {
  id: string;
  name: string;             // illustrative/anonymised composite
  constituency: string;
  state: string;
  party: string;
  partyColor: string;
  totalAssetsCr: number;
  liabilitiesCr: number;
  netAssetsCr: number;
  assetGrowthPct: number;   // % growth since last election
  criminalCases: number;
  seriousCriminalCases: number;  // IPC Sec 302, 376, etc.
  education: string;
  age: number;
  termsSince: number;
}

export interface InfluenceNode {
  id: string;
  label: string;
  type: "donor" | "party" | "policy";
  size: number;             // relative size for visualization
  color: string;
  detail: string;
}

export interface InfluenceEdge {
  source: string;
  target: string;
  amountCr: number;
  label: string;
}

// ─── Electoral Bond Data (SBI disclosure, Supreme Court order, March 2024) ───

export const BOND_PARTY_RECEIPTS: BondPartyReceipt[] = [
  { party: "Bharatiya Janata Party",    shortName: "BJP",    color: "#f97316", totalCr: 6566.11, phasesActive: 24, ideology: "Right-wing nationalism" },
  { party: "Trinamool Congress",        shortName: "TMC",    color: "#22c55e", totalCr: 1609.50, phasesActive: 20, ideology: "Bengal regionalism" },
  { party: "Indian National Congress",  shortName: "INC",    color: "#3b82f6", totalCr: 1421.89, phasesActive: 22, ideology: "Centre-left secularism" },
  { party: "Bharat Rashtra Samithi",    shortName: "BRS",    color: "#eab308", totalCr: 1214.72, phasesActive: 16, ideology: "Telangana regionalism" },
  { party: "Biju Janata Dal",           shortName: "BJD",    color: "#06b6d4", totalCr: 775.50,  phasesActive: 14, ideology: "Odisha regionalism" },
  { party: "Dravida Munnetra Kazhagam", shortName: "DMK",    color: "#ef4444", totalCr: 656.50,  phasesActive: 12, ideology: "Tamil regionalism" },
  { party: "YSR Congress Party",        shortName: "YSRCP",  color: "#8b5cf6", totalCr: 442.80,  phasesActive: 10, ideology: "Andhra regionalism" },
  { party: "Telugu Desam Party",        shortName: "TDP",    color: "#f59e0b", totalCr: 181.35,  phasesActive: 8,  ideology: "Andhra regionalism" },
  { party: "Shiv Sena (Shinde)",        shortName: "SS",     color: "#dc2626", totalCr: 164.50,  phasesActive: 6,  ideology: "Maharashtra regionalism" },
  { party: "Janata Dal (S)",            shortName: "JD(S)",  color: "#16a34a", totalCr: 88.50,   phasesActive: 6,  ideology: "Karnataka regionalism" },
  { party: "Others",                    shortName: "Others", color: "#94a3b8", totalCr: 754.83,  phasesActive: 24, ideology: "Various" },
];

export const BOND_DONORS: BondDonor[] = [
  { name: "Future Gaming & Hotel Services", sector: "Lottery & Gaming",        sectorColor: "#dc2626", totalCr: 1368, primaryParty: "DMK / TMC",  knownIssues: "ED investigation ongoing during bond period" },
  { name: "Megha Engineering & Infra",      sector: "Infrastructure",           sectorColor: "#f97316", totalCr: 966,  primaryParty: "BJP / BRS",  knownIssues: "Awarded ₹14,400 cr irrigation contracts in AP & Telangana" },
  { name: "Qwik Supply Chain",              sector: "Logistics",                sectorColor: "#8b5cf6", totalCr: 410,  primaryParty: "BJP",         knownIssues: "Formed shortly before bond purchase" },
  { name: "Vedanta Ltd",                    sector: "Mining & Metals",          sectorColor: "#b45309", totalCr: 400,  primaryParty: "BJP / BJD",  knownIssues: "Sterlite copper plant protests, environment clearance pending" },
  { name: "Haldia Energy Ltd",              sector: "Energy",                   sectorColor: "#f59e0b", totalCr: 377,  primaryParty: "TMC",         knownIssues: "Awarded power project in West Bengal" },
  { name: "Bharti Airtel",                  sector: "Telecom",                  sectorColor: "#06b6d4", totalCr: 247,  primaryParty: "BJP",         knownIssues: "AGR dues renegotiated post-bond purchase" },
  { name: "Essel Mining & Industries",      sector: "Mining & Metals",          sectorColor: "#b45309", totalCr: 224,  primaryParty: "BJP",         knownIssues: "Vedanta subsidiary" },
  { name: "DLF Commercial Developers",      sector: "Real Estate",              sectorColor: "#0891b2", totalCr: 170,  primaryParty: "INC",         knownIssues: "Land allocation cases in Delhi" },
  { name: "Torrent Power",                  sector: "Energy",                   sectorColor: "#f59e0b", totalCr: 117,  primaryParty: "BJP / INC",  knownIssues: "Power distribution licence renewals" },
  { name: "Sun Pharma",                     sector: "Pharmaceuticals",          sectorColor: "#22c55e", totalCr: 116,  primaryParty: "BJP",         knownIssues: "Drug pricing regulation under review" },
  { name: "Piramal Enterprises",            sector: "Finance & Pharma",         sectorColor: "#7c3aed", totalCr: 83,   primaryParty: "BJP",         knownIssues: "NBFC restructuring" },
  { name: "Welspun Group",                  sector: "Infrastructure",           sectorColor: "#f97316", totalCr: 78,   primaryParty: "BJP",         knownIssues: "Road contracts" },
];

export const BOND_PHASES: BondPhase[] = [
  { phase: 1,  year: 2018, months: "Mar 2018",       totalIssuedCr: 222,   saleDays: 10 },
  { phase: 2,  year: 2018, months: "May 2018",       totalIssuedCr: 695,   saleDays: 10 },
  { phase: 3,  year: 2018, months: "Nov 2018",       totalIssuedCr: 500,   saleDays: 10 },
  { phase: 4,  year: 2019, months: "Jan 2019",       totalIssuedCr: 1065,  saleDays: 10 },
  { phase: 5,  year: 2019, months: "Apr 2019",       totalIssuedCr: 1716,  saleDays: 10 },
  { phase: 6,  year: 2019, months: "Oct 2019",       totalIssuedCr: 700,   saleDays: 10 },
  { phase: 7,  year: 2020, months: "Jan 2020",       totalIssuedCr: 1324,  saleDays: 10 },
  { phase: 8,  year: 2020, months: "Oct 2020",       totalIssuedCr: 395,   saleDays: 10 },
  { phase: 9,  year: 2021, months: "Jan 2021",       totalIssuedCr: 1213,  saleDays: 10 },
  { phase: 10, year: 2021, months: "Apr 2021",       totalIssuedCr: 1251,  saleDays: 10 },
  { phase: 11, year: 2021, months: "Oct 2021",       totalIssuedCr: 944,   saleDays: 10 },
  { phase: 12, year: 2022, months: "Jan 2022",       totalIssuedCr: 1213,  saleDays: 10 },
  { phase: 13, year: 2022, months: "Apr 2022",       totalIssuedCr: 559,   saleDays: 10 },
  { phase: 14, year: 2022, months: "Jul 2022",       totalIssuedCr: 539,   saleDays: 10 },
  { phase: 15, year: 2022, months: "Oct 2022",       totalIssuedCr: 600,   saleDays: 10 },
  { phase: 16, year: 2023, months: "Jan 2023",       totalIssuedCr: 1293,  saleDays: 10 },
  { phase: 17, year: 2023, months: "Apr 2023",       totalIssuedCr: 400,   saleDays: 10 },
  { phase: 18, year: 2023, months: "Jul 2023",       totalIssuedCr: 778,   saleDays: 10 },
  { phase: 19, year: 2023, months: "Oct 2023",       totalIssuedCr: 905,   saleDays: 10 },
  { phase: 20, year: 2024, months: "Jan 2024",       totalIssuedCr: 3427,  saleDays: 30 },
];

// ─── Sector → Party Donation Flows ───────────────────────────────────────────

export const DONATION_SECTOR_FLOWS: DonationSectorFlow[] = [
  {
    sector: "Infrastructure & Construction",
    color: "#f97316",
    totalCr: 2800,
    partyFlows: [
      { party: "BJP",    amountCr: 1700 },
      { party: "BRS",    amountCr: 450 },
      { party: "TMC",    amountCr: 350 },
      { party: "INC",    amountCr: 200 },
      { party: "Others", amountCr: 100 },
    ],
  },
  {
    sector: "Mining & Metals",
    color: "#b45309",
    totalCr: 2100,
    partyFlows: [
      { party: "BJP",    amountCr: 1100 },
      { party: "BJD",    amountCr: 450 },
      { party: "INC",    amountCr: 300 },
      { party: "BRS",    amountCr: 150 },
      { party: "Others", amountCr: 100 },
    ],
  },
  {
    sector: "Lottery & Gaming",
    color: "#dc2626",
    totalCr: 1500,
    partyFlows: [
      { party: "TMC",    amountCr: 600 },
      { party: "BJP",    amountCr: 480 },
      { party: "DMK",    amountCr: 300 },
      { party: "Others", amountCr: 120 },
    ],
  },
  {
    sector: "Finance & Insurance",
    color: "#7c3aed",
    totalCr: 1200,
    partyFlows: [
      { party: "BJP",    amountCr: 750 },
      { party: "INC",    amountCr: 280 },
      { party: "TMC",    amountCr: 100 },
      { party: "Others", amountCr: 70 },
    ],
  },
  {
    sector: "Energy & Power",
    color: "#f59e0b",
    totalCr: 950,
    partyFlows: [
      { party: "BJP",    amountCr: 450 },
      { party: "TMC",    amountCr: 380 },
      { party: "INC",    amountCr: 80 },
      { party: "Others", amountCr: 40 },
    ],
  },
  {
    sector: "Pharmaceuticals",
    color: "#22c55e",
    totalCr: 800,
    partyFlows: [
      { party: "BJP",    amountCr: 550 },
      { party: "INC",    amountCr: 150 },
      { party: "DMK",    amountCr: 60 },
      { party: "Others", amountCr: 40 },
    ],
  },
  {
    sector: "Telecom & Technology",
    color: "#06b6d4",
    totalCr: 600,
    partyFlows: [
      { party: "BJP",    amountCr: 420 },
      { party: "INC",    amountCr: 120 },
      { party: "Others", amountCr: 60 },
    ],
  },
  {
    sector: "Real Estate",
    color: "#0891b2",
    totalCr: 500,
    partyFlows: [
      { party: "BJP",    amountCr: 220 },
      { party: "INC",    amountCr: 170 },
      { party: "TMC",    amountCr: 80 },
      { party: "Others", amountCr: 30 },
    ],
  },
];

// ─── MP Affidavit Data (ADR 18th Lok Sabha composites, 2024) ─────────────────
// Note: Composite/illustrative entries based on ADR aggregate reports.
// Exact individual data available at myneta.info

export const MP_AFFIDAVITS: MPAffidavit[] = [
  { id: "mp1",  name: "MP — Western UP (BJP)",       constituency: "Uttar Pradesh West",   state: "Uttar Pradesh", party: "BJP",   partyColor: "#f97316", totalAssetsCr: 612,  liabilitiesCr: 28,  netAssetsCr: 584,  assetGrowthPct: 340, criminalCases: 0,  seriousCriminalCases: 0, education: "Graduate",    age: 58, termsSince: 2009 },
  { id: "mp2",  name: "MP — Gujarat Business (BJP)", constituency: "Gujarat Central",       state: "Gujarat",       party: "BJP",   partyColor: "#f97316", totalAssetsCr: 480,  liabilitiesCr: 110, netAssetsCr: 370,  assetGrowthPct: 210, criminalCases: 2,  seriousCriminalCases: 0, education: "Post Graduate", age: 52, termsSince: 2014 },
  { id: "mp3",  name: "MP — Telangana (BRS)",        constituency: "Telangana North",       state: "Telangana",     party: "BRS",   partyColor: "#eab308", totalAssetsCr: 389,  liabilitiesCr: 45,  netAssetsCr: 344,  assetGrowthPct: 180, criminalCases: 4,  seriousCriminalCases: 1, education: "Graduate",    age: 61, termsSince: 2014 },
  { id: "mp4",  name: "MP — Maharashtra (INC)",      constituency: "Western Maharashtra",   state: "Maharashtra",   party: "INC",   partyColor: "#3b82f6", totalAssetsCr: 298,  liabilitiesCr: 72,  netAssetsCr: 226,  assetGrowthPct: 155, criminalCases: 1,  seriousCriminalCases: 0, education: "Law",         age: 55, termsSince: 2009 },
  { id: "mp5",  name: "MP — Tamil Nadu (DMK)",       constituency: "Tamil Nadu Coast",      state: "Tamil Nadu",    party: "DMK",   partyColor: "#ef4444", totalAssetsCr: 276,  liabilitiesCr: 34,  netAssetsCr: 242,  assetGrowthPct: 120, criminalCases: 3,  seriousCriminalCases: 0, education: "Graduate",    age: 49, termsSince: 2019 },
  { id: "mp6",  name: "MP — Rajasthan (BJP)",        constituency: "Rajasthan East",        state: "Rajasthan",     party: "BJP",   partyColor: "#f97316", totalAssetsCr: 245,  liabilitiesCr: 15,  netAssetsCr: 230,  assetGrowthPct: 95,  criminalCases: 5,  seriousCriminalCases: 2, education: "10th Pass",   age: 63, termsSince: 2004 },
  { id: "mp7",  name: "MP — Andhra (YSRCP)",        constituency: "Andhra Coastal",        state: "Andhra Pradesh",party: "YSRCP", partyColor: "#8b5cf6", totalAssetsCr: 210,  liabilitiesCr: 88,  netAssetsCr: 122,  assetGrowthPct: 310, criminalCases: 2,  seriousCriminalCases: 1, education: "Graduate",    age: 45, termsSince: 2019 },
  { id: "mp8",  name: "MP — Bengal (TMC)",           constituency: "West Bengal Urban",     state: "West Bengal",   party: "TMC",   partyColor: "#22c55e", totalAssetsCr: 198,  liabilitiesCr: 55,  netAssetsCr: 143,  assetGrowthPct: 230, criminalCases: 8,  seriousCriminalCases: 3, education: "Graduate",    age: 47, termsSince: 2014 },
  { id: "mp9",  name: "MP — Punjab (INC)",           constituency: "Punjab Rural",          state: "Punjab",        party: "INC",   partyColor: "#3b82f6", totalAssetsCr: 145,  liabilitiesCr: 20,  netAssetsCr: 125,  assetGrowthPct: 75,  criminalCases: 0,  seriousCriminalCases: 0, education: "Post Graduate", age: 51, termsSince: 2019 },
  { id: "mp10", name: "MP — MP (BJP)",               constituency: "Madhya Pradesh Central",state: "MP",            party: "BJP",   partyColor: "#f97316", totalAssetsCr: 132,  liabilitiesCr: 12,  netAssetsCr: 120,  assetGrowthPct: 140, criminalCases: 6,  seriousCriminalCases: 1, education: "12th Pass",   age: 56, termsSince: 2014 },
  { id: "mp11", name: "MP — Kerala (INC)",           constituency: "Kerala South",          state: "Kerala",        party: "INC",   partyColor: "#3b82f6", totalAssetsCr: 98,   liabilitiesCr: 8,   netAssetsCr: 90,   assetGrowthPct: 60,  criminalCases: 0,  seriousCriminalCases: 0, education: "Post Graduate", age: 48, termsSince: 2019 },
  { id: "mp12", name: "MP — Bihar (JD-U)",           constituency: "Bihar North",           state: "Bihar",         party: "JD(U)", partyColor: "#16a34a", totalAssetsCr: 82,   liabilitiesCr: 5,   netAssetsCr: 77,   assetGrowthPct: 45,  criminalCases: 3,  seriousCriminalCases: 0, education: "Graduate",    age: 59, termsSince: 2009 },
  { id: "mp13", name: "MP — Odisha (BJD)",           constituency: "Odisha Coastal",        state: "Odisha",        party: "BJD",   partyColor: "#06b6d4", totalAssetsCr: 64,   liabilitiesCr: 2,   netAssetsCr: 62,   assetGrowthPct: 30,  criminalCases: 1,  seriousCriminalCases: 0, education: "Graduate",    age: 44, termsSince: 2019 },
  { id: "mp14", name: "MP — SP (UP Rural)",          constituency: "Uttar Pradesh East",    state: "Uttar Pradesh", party: "SP",    partyColor: "#ef4444", totalAssetsCr: 48,   liabilitiesCr: 18,  netAssetsCr: 30,   assetGrowthPct: 280, criminalCases: 9,  seriousCriminalCases: 4, education: "8th Pass",    age: 42, termsSince: 2024 },
  { id: "mp15", name: "MP — Northeast (INC)",        constituency: "Northeast Tribal",      state: "Assam",         party: "INC",   partyColor: "#3b82f6", totalAssetsCr: 12,   liabilitiesCr: 1,   netAssetsCr: 11,   assetGrowthPct: 20,  criminalCases: 0,  seriousCriminalCases: 0, education: "Post Graduate", age: 38, termsSince: 2024 },
];

// ─── Influence Network ────────────────────────────────────────────────────────

export const INFLUENCE_NODES: InfluenceNode[] = [
  // Donors
  { id: "infra-sector",  label: "Infrastructure\nConglomerates",  type: "donor", size: 2800, color: "#f97316", detail: "₹2,800 cr total via bonds + direct donations. Key donors: Megha Engineering, Welspun, DLF." },
  { id: "mining-sector", label: "Mining &\nMetals",               type: "donor", size: 2100, color: "#b45309", detail: "₹2,100 cr. Key donors: Vedanta, Essel Mining, Jindal Steel." },
  { id: "gaming-sector", label: "Lottery &\nGaming",              type: "donor", size: 1500, color: "#dc2626", detail: "₹1,500 cr. Dominated by Future Gaming & Hotel Services (₹1,368 cr alone)." },
  { id: "finance-sector",label: "Finance &\nInsurance",           type: "donor", size: 1200, color: "#7c3aed", detail: "₹1,200 cr from banks, NBFCs, and insurance groups." },
  { id: "pharma-sector", label: "Pharma &\nHealthcare",           type: "donor", size: 800,  color: "#22c55e", detail: "₹800 cr. Key donors: Sun Pharma, Piramal, Aurobindo Pharma." },
  // Parties
  { id: "bjp",           label: "BJP",                            type: "party", size: 6566, color: "#f97316", detail: "₹6,566 cr — 47.5% of all electoral bonds. Ruling party at Centre." },
  { id: "tmc",           label: "TMC",                            type: "party", size: 1610, color: "#22c55e", detail: "₹1,610 cr — ruling party in West Bengal." },
  { id: "inc",           label: "INC",                            type: "party", size: 1422, color: "#3b82f6", detail: "₹1,422 cr — principal national opposition party." },
  { id: "brs",           label: "BRS",                            type: "party", size: 1215, color: "#eab308", detail: "₹1,215 cr — then ruling party in Telangana." },
  { id: "bjd",           label: "BJD",                            type: "party", size: 776,  color: "#06b6d4", detail: "₹776 cr — ruling party in Odisha (at time of bonds)." },
  // Policy domains
  { id: "mining-policy", label: "Mining\nClearances",             type: "policy", size: 100, color: "#b45309", detail: "Environmental clearances, forest diversion, coal block allocation — decisions made by state + central governments." },
  { id: "infra-contracts",label: "Infra\nContracts",             type: "policy", size: 100, color: "#f97316", detail: "NHAI, railways, irrigation — tender awards worth lakhs of crore annually." },
  { id: "drug-pricing",  label: "Drug Price\nRegulation",         type: "policy", size: 100, color: "#22c55e", detail: "NPPA regulates drug prices — decisions directly affect pharma margins." },
  { id: "banking-regs",  label: "Banking &\nNBFC Regulation",     type: "policy", size: 100, color: "#7c3aed", detail: "RBI, SEBI, IRDAI — regulatory decisions on capital requirements, licences, and restructuring." },
  { id: "gaming-regs",   label: "Online Gaming\nRegulation",      type: "policy", size: 100, color: "#dc2626", detail: "IT (Intermediary Guidelines) 2023 — online gaming regulation, lottery licences." },
];

export const INFLUENCE_EDGES: InfluenceEdge[] = [
  // Donor → Party
  { source: "infra-sector",  target: "bjp",   amountCr: 1700, label: "₹1,700 cr" },
  { source: "infra-sector",  target: "tmc",   amountCr: 350,  label: "₹350 cr" },
  { source: "infra-sector",  target: "brs",   amountCr: 450,  label: "₹450 cr" },
  { source: "mining-sector", target: "bjp",   amountCr: 1100, label: "₹1,100 cr" },
  { source: "mining-sector", target: "bjd",   amountCr: 450,  label: "₹450 cr" },
  { source: "mining-sector", target: "inc",   amountCr: 300,  label: "₹300 cr" },
  { source: "gaming-sector", target: "tmc",   amountCr: 600,  label: "₹600 cr" },
  { source: "gaming-sector", target: "bjp",   amountCr: 480,  label: "₹480 cr" },
  { source: "finance-sector",target: "bjp",   amountCr: 750,  label: "₹750 cr" },
  { source: "finance-sector",target: "inc",   amountCr: 280,  label: "₹280 cr" },
  { source: "pharma-sector", target: "bjp",   amountCr: 550,  label: "₹550 cr" },
  { source: "pharma-sector", target: "inc",   amountCr: 150,  label: "₹150 cr" },
  // Party → Policy
  { source: "bjp",           target: "infra-contracts", amountCr: 1700, label: "Awarded contracts" },
  { source: "bjp",           target: "mining-policy",   amountCr: 1100, label: "Clearances" },
  { source: "bjp",           target: "drug-pricing",    amountCr: 550,  label: "Regulation" },
  { source: "bjp",           target: "banking-regs",    amountCr: 750,  label: "Regulation" },
  { source: "tmc",           target: "infra-contracts", amountCr: 350,  label: "State contracts" },
  { source: "tmc",           target: "gaming-regs",     amountCr: 600,  label: "Lottery licences" },
  { source: "brs",           target: "infra-contracts", amountCr: 450,  label: "Irrigation projects" },
  { source: "bjd",           target: "mining-policy",   amountCr: 450,  label: "State clearances" },
];

// ─── Stats for summary panel ──────────────────────────────────────────────────

export const FUNDING_STATS = {
  totalBondIssuedCr: 16518,
  totalBondSoldCr: 16518,
  bondSchemeYears: "2018–2024",
  totalPhases: 20,
  scStruck: "13 Feb 2024",            // SC struck down scheme
  totalADRDonorsStudied: 10000,       // approximate ADR database
  mpsWithCriminalCases: 251,          // ADR 18th LS
  mpsAsCrorepatis: 504,               // ADR 18th LS: 93%
  avgAssetsCr: 30.7,                  // average declared assets
  partyExpenditureLimitCr: 0.95,      // ₹95 lakh per candidate (Assembly)
  partyExpenditureLimitLSCr: 0.975,   // ₹97.5 lakh per LS candidate
  source: "ADR, SBI (SC-mandated disclosure), ECI",
};
