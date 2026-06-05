import { PARLIAMENT_2024, COALITIONS_2024 } from "@/data/elections/intelligence";

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
