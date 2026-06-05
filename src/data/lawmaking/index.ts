// ─── Types ────────────────────────────────────────────────────────────────────

export type BillType = "ordinary" | "money" | "constitutional" | "private-member";
export type Controversy = "low" | "medium" | "high";

export interface BillScenario {
  id: string;
  title: string;
  shortTitle: string;
  type: BillType;
  ministry: string;
  description: string;
  constitutionalBasis: string[];
  controversy: Controversy;
  govSeats: number;      // ruling coalition total
  totalSeats: number;    // always 543 (Lok Sabha)
  threshold: number;     // seats needed to pass (272 ordinary, 362 constitutional)
  startingScores: { constitutional: number; political: number; public: number };
}

export interface Party {
  id: string;
  name: string;
  shortName: string;
  seats: number;
  ideology: string;
  color: string;
  stance: "ruling" | "ally" | "neutral" | "opposition";
}

// ─── Bill Scenarios ────────────────────────────────────────────────────────────

export const BILL_SCENARIOS: BillScenario[] = [
  {
    id: "data-protection",
    title: "Digital Personal Data Protection Bill, 2024",
    shortTitle: "Data Protection Bill",
    type: "ordinary",
    ministry: "Ministry of Electronics & IT",
    description:
      "Creates a framework for processing digital personal data in India — establishing a Data Protection Board, rights of data principals, and obligations on data fiduciaries.",
    constitutionalBasis: [
      "Art. 21 — Right to Privacy (Puttaswamy judgment)",
      "Art. 19(1)(g) — Freedom of trade",
      "Entry 97, List I — Parliament's residuary power",
    ],
    controversy: "medium",
    govSeats: 302,
    totalSeats: 543,
    threshold: 272,
    startingScores: { constitutional: 72, political: 68, public: 55 },
  },
  {
    id: "ucc",
    title: "Uniform Civil Code Bill, 2025",
    shortTitle: "UCC Bill",
    type: "ordinary",
    ministry: "Ministry of Law & Justice",
    description:
      "Implements Art. 44 (DPSP) to provide uniform personal laws for marriage, divorce, inheritance, and adoption for all citizens irrespective of religion.",
    constitutionalBasis: [
      "Art. 44 — DPSP: Uniform Civil Code",
      "Art. 14 — Right to Equality",
      "Art. 25–28 — Freedom of Religion",
      "Entry 5, List III — Marriage and divorce (Concurrent List)",
    ],
    controversy: "high",
    govSeats: 264,
    totalSeats: 543,
    threshold: 272,
    startingScores: { constitutional: 60, political: 45, public: 48 },
  },
  {
    id: "finance",
    title: "Finance Bill, 2025",
    shortTitle: "Finance Bill",
    type: "money",
    ministry: "Ministry of Finance",
    description:
      "Implements the Union Budget — levying new taxes, amending the Income Tax Act and GST provisions, and authorising expenditure for fiscal year 2025-26.",
    constitutionalBasis: [
      "Art. 110 — Money Bill definition",
      "Art. 109 — Rajya Sabha cannot reject money bills",
      "Art. 265 — No tax without authority of law",
      "Art. 112 — Annual Financial Statement",
    ],
    controversy: "low",
    govSeats: 302,
    totalSeats: 543,
    threshold: 272,
    startingScores: { constitutional: 85, political: 72, public: 60 },
  },
];

// ─── Lok Sabha Composition (18th Lok Sabha, 2024) ─────────────────────────────

export const LOK_SABHA_PARTIES: Party[] = [
  { id: "bjp",         name: "Bharatiya Janata Party",    shortName: "BJP",     seats: 240, ideology: "Right-wing nationalism",        color: "#f97316", stance: "ruling"     },
  { id: "inc",         name: "Indian National Congress",  shortName: "INC",     seats: 99,  ideology: "Centre-left, secularism",        color: "#3b82f6", stance: "opposition" },
  { id: "sp",          name: "Samajwadi Party",           shortName: "SP",      seats: 37,  ideology: "Socialist, OBC politics",         color: "#ef4444", stance: "opposition" },
  { id: "tmc",         name: "Trinamool Congress",        shortName: "TMC",     seats: 29,  ideology: "Regional, left-of-centre",       color: "#22c55e", stance: "opposition" },
  { id: "tdp",         name: "Telugu Desam Party",        shortName: "TDP",     seats: 16,  ideology: "Regional, centrist",             color: "#eab308", stance: "ally"       },
  { id: "jdu",         name: "Janata Dal (United)",       shortName: "JD(U)",   seats: 12,  ideology: "Regional, socialist",             color: "#16a34a", stance: "ally"       },
  { id: "ncp_sp",      name: "NCP (Sharad Pawar)",        shortName: "NCP-SP",  seats: 8,   ideology: "Centrist, Maharashtra",           color: "#f59e0b", stance: "opposition" },
  { id: "ss_ubt",      name: "Shiv Sena (UBT)",           shortName: "SS-UBT",  seats: 9,   ideology: "Regional nationalism",            color: "#dc2626", stance: "opposition" },
  { id: "others",      name: "Others & Independents",     shortName: "Others",  seats: 93,  ideology: "Varied",                          color: "#94a3b8", stance: "neutral"    },
];

// ─── Coalition partners for negotiation sim ────────────────────────────────────

export interface CoalitionPartner {
  id: string;
  name: string;
  shortName: string;
  seats: number;
  color: string;
  ideology: string;
  demands: CoalitionDemand[];
  mood: "friendly" | "neutral" | "wary";
}

export interface CoalitionDemand {
  id: string;
  label: string;
  type: "portfolio" | "policy" | "funds" | "seat-sharing";
  description: string;
  cost: number;  // portfolio cost (1=cabinet, 2=senior cabinet) or policy cost (1-3)
  isRedline: boolean; // must accept or they walk
}

export const COALITION_PARTNERS: CoalitionPartner[] = [
  {
    id: "tdp",
    name: "Telugu Desam Party",
    shortName: "TDP",
    seats: 16,
    color: "#eab308",
    ideology: "Andhra regionalism, development",
    mood: "friendly",
    demands: [
      { id: "tdp-1", label: "Cabinet berth for TDP leader", type: "portfolio", description: "Wants a senior Cabinet Minister position for their party president", cost: 2, isRedline: true },
      { id: "tdp-2", label: "Andhra Special Status", type: "policy", description: "Demands special category status for Andhra Pradesh", cost: 3, isRedline: false },
      { id: "tdp-3", label: "Polavaram Project funds", type: "funds", description: "Central funding acceleration for Polavaram irrigation project", cost: 1, isRedline: false },
    ],
  },
  {
    id: "jdu",
    name: "Janata Dal (United)",
    shortName: "JD(U)",
    seats: 12,
    color: "#16a34a",
    ideology: "Bihar development, socialist",
    mood: "neutral",
    demands: [
      { id: "jdu-1", label: "Cabinet berth for JD(U)", type: "portfolio", description: "At least one Cabinet Ministry for the party", cost: 1, isRedline: true },
      { id: "jdu-2", label: "Bihar Special Package", type: "funds", description: "₹1 lakh crore special infrastructure package for Bihar", cost: 2, isRedline: false },
      { id: "jdu-3", label: "Caste Census", type: "policy", description: "Commitment to conduct a nationwide caste census", cost: 2, isRedline: false },
    ],
  },
  {
    id: "shiv_sena",
    name: "Shiv Sena (Shinde)",
    shortName: "SS",
    seats: 7,
    color: "#f97316",
    ideology: "Maharashtra regionalism",
    mood: "friendly",
    demands: [
      { id: "ss-1", label: "MoS Cabinet post", type: "portfolio", description: "A Minister of State (Independent Charge) position", cost: 1, isRedline: false },
      { id: "ss-2", label: "Mumbai Metro funding", type: "funds", description: "Central funding for Mumbai Metro Phase 3 expansion", cost: 1, isRedline: false },
    ],
  },
  {
    id: "ljp",
    name: "Lok Jan Shakti Party",
    shortName: "LJP",
    seats: 5,
    color: "#8b5cf6",
    ideology: "Dalit welfare, Bihar",
    mood: "wary",
    demands: [
      { id: "ljp-1", label: "Dalit welfare ministry", type: "portfolio", description: "Specific ministry focused on Scheduled Caste welfare", cost: 1, isRedline: true },
      { id: "ljp-2", label: "SC/ST sub-categorisation", type: "policy", description: "Support Supreme Court order on SC/ST sub-categorisation", cost: 2, isRedline: false },
    ],
  },
  {
    id: "ncp",
    name: "NCP (Ajit Pawar)",
    shortName: "NCP",
    seats: 4,
    color: "#0891b2",
    ideology: "Maharashtra, centrist",
    mood: "neutral",
    demands: [
      { id: "ncp-1", label: "Maharashtra Cabinet seat", type: "portfolio", description: "One cabinet position with Maharashtra-relevant portfolio", cost: 1, isRedline: false },
      { id: "ncp-2", label: "Sugar industry relief", type: "policy", description: "FRP revision and export subsidy for Maharashtra sugar cooperatives", cost: 1, isRedline: false },
    ],
  },
  {
    id: "apna_dal",
    name: "Apna Dal (Sonelal)",
    shortName: "AD-S",
    seats: 2,
    color: "#ec4899",
    ideology: "OBC, UP regional",
    mood: "friendly",
    demands: [
      { id: "ad-1", label: "MoS position", type: "portfolio", description: "A Minister of State position for UP OBC representation", cost: 1, isRedline: false },
    ],
  },
];

// ─── Constitutional Amendment Scenarios ───────────────────────────────────────

export interface AmendmentScenario {
  id: string;
  articleToAmend: string;
  title: string;
  description: string;
  amendmentType: "simple" | "special" | "special-plus-states";
  isBasicStructure: boolean;
  govSeatsLS: number;  // Lok Sabha seats
  govSeatsRS: number;  // Rajya Sabha seats
  totalLS: number;
  totalRS: number;
  states: number;      // states that need to ratify
}

export const AMENDMENT_SCENARIOS: AmendmentScenario[] = [
  {
    id: "art-368-itself",
    title: "Strengthen the CAG's Independence",
    articleToAmend: "Article 148 — Comptroller & Auditor General",
    description: "Amend Art. 148 to give the CAG constitutional tenure protection and bar post-retirement appointments in any government body. Does NOT touch basic structure.",
    amendmentType: "special",
    isBasicStructure: false,
    govSeatsLS: 302, totalLS: 543,
    govSeatsRS: 112, totalRS: 245,
    states: 0,
  },
  {
    id: "concurrent-list",
    title: "Add 'Agriculture' to Concurrent List",
    articleToAmend: "7th Schedule — Legislative Lists",
    description: "Move agriculture from State List (Entry 14, List II) to the Concurrent List, allowing Parliament to legislate directly on farm laws. Changes federal balance — requires state ratification.",
    amendmentType: "special-plus-states",
    isBasicStructure: false,
    govSeatsLS: 302, totalLS: 543,
    govSeatsRS: 112, totalRS: 245,
    states: 28,
  },
  {
    id: "fundamental-rights",
    title: "Restrict Right to Property (Art. 300A)",
    articleToAmend: "Article 300A — Right to Property",
    description: "Amend Art. 300A to allow easier land acquisition for infrastructure by removing judicial review of compensation. Opposition argues this violates basic structure by impairing Art. 14.",
    amendmentType: "special",
    isBasicStructure: true, // will trigger basic structure challenge
    govSeatsLS: 302, totalLS: 543,
    govSeatsRS: 112, totalRS: 245,
    states: 0,
  },
];

// ─── Confidence Motion Scenario ───────────────────────────────────────────────

export interface FloorPartner {
  id: string;
  name: string;
  shortName: string;
  seats: number;
  color: string;
  currentSupport: "supporting" | "neutral" | "abstaining" | "opposing";
  mood: number;       // 0-100, higher = easier to win over
  demands: string;
  susceptibleTo: ("funds" | "portfolio" | "ideology" | "regional" | "legal")[];
}

export const FLOOR_PARTNERS: FloorPartner[] = [
  { id: "bsp",  name: "Bahujan Samaj Party",    shortName: "BSP",  seats: 10, color: "#3b82f6", currentSupport: "neutral",    mood: 40, demands: "Dalit rights provisions, ministry",          susceptibleTo: ["portfolio", "ideology"] },
  { id: "ysrcp",name: "YSR Congress Party",     shortName: "YSRCP",seats: 4,  color: "#22c55e", currentSupport: "abstaining", mood: 55, demands: "Andhra special package",                     susceptibleTo: ["funds", "regional"] },
  { id: "bvrd", name: "Bharat Rashtra Samithi", shortName: "BRS",  seats: 9,  color: "#f59e0b", currentSupport: "neutral",    mood: 35, demands: "Telangana irrigation funds, political truce", susceptibleTo: ["funds", "regional", "ideology"] },
  { id: "ind1", name: "Independent MPs (Group A)", shortName: "IND-A", seats: 6, color: "#8b5cf6", currentSupport: "neutral", mood: 60, demands: "Constituency development funds",              susceptibleTo: ["funds", "legal"] },
  { id: "ind2", name: "Independent MPs (Group B)", shortName: "IND-B", seats: 3, color: "#94a3b8", currentSupport: "abstaining", mood: 30, demands: "Strong ideology concerns",                susceptibleTo: ["ideology", "legal"] },
];
