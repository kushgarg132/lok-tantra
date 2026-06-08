interface ParliamentSeat { party: string; abbr: string; color: string; seats: number; alliance: "NDA" | "INDIA" | "Other" }

const PARLIAMENT_2024: ParliamentSeat[] = [
  { party: "JMM",        abbr: "JMM",    color: "#2E7D32", seats: 3,   alliance: "INDIA" },
  { party: "AAP",        abbr: "AAP",    color: "#06B6D4", seats: 3,   alliance: "INDIA" },
  { party: "Left",       abbr: "Left",   color: "#B91C1C", seats: 5,   alliance: "INDIA" },
  { party: "RJD",        abbr: "RJD",    color: "#7F1D1D", seats: 4,   alliance: "INDIA" },
  { party: "NCP (SP)",   abbr: "NCP-SP", color: "#7C3AED", seats: 8,   alliance: "INDIA" },
  { party: "SS (UBT)",   abbr: "SS-UBT", color: "#F97316", seats: 9,   alliance: "INDIA" },
  { party: "TMC",        abbr: "TMC",    color: "#059669", seats: 29,  alliance: "INDIA" },
  { party: "DMK",        abbr: "DMK",    color: "#DC143C", seats: 22,  alliance: "INDIA" },
  { party: "SP",         abbr: "SP",     color: "#EF4444", seats: 37,  alliance: "INDIA" },
  { party: "INC",        abbr: "INC",    color: "#1565C0", seats: 99,  alliance: "INDIA" },
  { party: "INDIA Oth.", abbr: "I-Oth",  color: "#475569", seats: 15,  alliance: "INDIA" },
  { party: "YSRCP",      abbr: "YSRCP",  color: "#F59E0B", seats: 4,   alliance: "Other" },
  { party: "Ind./Oth.",  abbr: "Oth",    color: "#9CA3AF", seats: 12,  alliance: "Other" },
  { party: "NDA Oth.",   abbr: "NDA-O",  color: "#94A3B8", seats: 11,  alliance: "NDA"   },
  { party: "LJP-RV",     abbr: "LJP",    color: "#FBBF24", seats: 5,   alliance: "NDA"   },
  { party: "RLD",        abbr: "RLD",    color: "#34D399", seats: 2,   alliance: "NDA"   },
  { party: "SS",         abbr: "SS",     color: "#EA580C", seats: 7,   alliance: "NDA"   },
  { party: "JDU",        abbr: "JDU",    color: "#0891B2", seats: 12,  alliance: "NDA"   },
  { party: "TDP",        abbr: "TDP",    color: "#D97706", seats: 16,  alliance: "NDA"   },
  { party: "BJP",        abbr: "BJP",    color: "#FF9933", seats: 240, alliance: "NDA"   },
];

const COALITIONS_2024 = [
  { name: "National Democratic Alliance", shortName: "NDA",   totalSeats: 293, color: "#FF9933", parties: [{ abbr: "BJP" }, { abbr: "TDP" }, { abbr: "JDU" }, { abbr: "SS" }, { abbr: "LJP" }, { abbr: "RLD" }, { abbr: "Oth" }] },
  { name: "INDIA Alliance",              shortName: "INDIA", totalSeats: 234, color: "#1565C0", parties: [{ abbr: "INC" }, { abbr: "SP" }, { abbr: "TMC" }, { abbr: "DMK" }, { abbr: "SS-UBT" }, { abbr: "NCP-SP" }, { abbr: "RJD" }, { abbr: "JMM" }, { abbr: "AAP" }, { abbr: "Left" }, { abbr: "Oth" }] },
  { name: "Unaffiliated",                shortName: "Others",totalSeats: 16,  color: "#64748B", parties: [{ abbr: "YSRCP" }, { abbr: "Oth" }] },
];

export type NodeType = "alliance" | "party";

export interface PoliticalNode {
  id: string;
  label: string;
  type: NodeType;
  seats: number;
  color: string;
  alliance: "NDA" | "INDIA" | "Other";
}

export interface PoliticalEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  strength: number; // seats
}

// Alliance containers
export const ALLIANCE_NODES: PoliticalNode[] = [
  { id: "nda",   label: "NDA",   type: "alliance", seats: COALITIONS_2024[0].totalSeats, color: "#FF9933", alliance: "NDA"   },
  { id: "india", label: "INDIA", type: "alliance", seats: COALITIONS_2024[1].totalSeats, color: "#1565C0", alliance: "INDIA" },
  { id: "other", label: "Others", type: "alliance", seats: 16,                            color: "#64748B",  alliance: "Other" },
];

// Derive party nodes from PARLIAMENT_2024
export const PARTY_NODES: PoliticalNode[] = PARLIAMENT_2024
  .filter((p) => p.seats >= 3 && !["NDA Oth.", "INDIA Oth.", "Ind./Oth."].includes(p.party))
  .map((p) => ({
    id: `party-${p.abbr.toLowerCase()}`,
    label: `${p.abbr}\n${p.seats}`,
    type: "party" as NodeType,
    seats: p.seats,
    color: p.color,
    alliance: p.alliance,
  }));

// Smaller parties grouped
const NDA_OTHER_SEATS  = PARLIAMENT_2024.find((p) => p.party === "NDA Oth.")?.seats ?? 0;
const INDIA_OTHER_SEATS = PARLIAMENT_2024.find((p) => p.party === "INDIA Oth.")?.seats ?? 0;
const IND_SEATS         = PARLIAMENT_2024.find((p) => p.party === "Ind./Oth.")?.seats ?? 0;

if (NDA_OTHER_SEATS > 0) PARTY_NODES.push({ id: "party-nda-others", label: `Others\n${NDA_OTHER_SEATS}`, type: "party", seats: NDA_OTHER_SEATS, color: "#94A3B8", alliance: "NDA" });
if (INDIA_OTHER_SEATS > 0) PARTY_NODES.push({ id: "party-india-others", label: `Others\n${INDIA_OTHER_SEATS}`, type: "party", seats: INDIA_OTHER_SEATS, color: "#94A3B8", alliance: "INDIA" });
if (IND_SEATS > 0) PARTY_NODES.push({ id: "party-ind", label: `Ind.\n${IND_SEATS}`, type: "party", seats: IND_SEATS, color: "#9CA3AF", alliance: "Other" });

// Edges: party → alliance membership
export const PARTY_EDGES: PoliticalEdge[] = PARTY_NODES.map((p) => ({
  id: `edge-${p.id}`,
  source: p.id,
  target: p.alliance === "NDA" ? "nda" : p.alliance === "INDIA" ? "india" : "other",
  label: p.alliance,
  strength: p.seats,
}));

// Pre-compute circular positions for Cytoscape preset layout
const NDA_CX = 200, NDA_CY = 250, NDA_R = 140;
const INDIA_CX = 640, INDIA_CY = 250, INDIA_R = 140;
const OTHER_CX = 420, OTHER_CY = 430, OTHER_R = 80;

function circlePos(count: number, cx: number, cy: number, r: number) {
  return Array.from({ length: count }, (_, i) => ({
    x: cx + r * Math.cos((2 * Math.PI * i) / count - Math.PI / 2),
    y: cy + r * Math.sin((2 * Math.PI * i) / count - Math.PI / 2),
  }));
}

const ndaParties   = PARTY_NODES.filter((p) => p.alliance === "NDA");
const indiaParties = PARTY_NODES.filter((p) => p.alliance === "INDIA");
const otherParties = PARTY_NODES.filter((p) => p.alliance === "Other");

const ndaPositions   = circlePos(ndaParties.length,   NDA_CX,   NDA_CY,   NDA_R);
const indiaPositions = circlePos(indiaParties.length,  INDIA_CX, INDIA_CY, INDIA_R);
const otherPositions = circlePos(otherParties.length,  OTHER_CX, OTHER_CY, OTHER_R);

export const PRESET_POSITIONS: Record<string, { x: number; y: number }> = {
  nda:   { x: NDA_CX,   y: NDA_CY   },
  india: { x: INDIA_CX, y: INDIA_CY  },
  other: { x: OTHER_CX, y: OTHER_CY  },
  ...Object.fromEntries(ndaParties.map((p, i)   => [p.id, ndaPositions[i]])),
  ...Object.fromEntries(indiaParties.map((p, i)  => [p.id, indiaPositions[i]])),
  ...Object.fromEntries(otherParties.map((p, i)  => [p.id, otherPositions[i]])),
};

export const CYTOSCAPE_ELEMENTS = [
  ...ALLIANCE_NODES.map((n) => ({ data: { id: n.id, label: n.label, type: n.type, seats: n.seats, color: n.color, alliance: n.alliance } })),
  ...PARTY_NODES.map((n)    => ({ data: { id: n.id, label: n.label, type: n.type, seats: n.seats, color: n.color, alliance: n.alliance } })),
  ...PARTY_EDGES.map((e)    => ({ data: { id: e.id, source: e.source, target: e.target, label: e.label, strength: e.strength } })),
];
