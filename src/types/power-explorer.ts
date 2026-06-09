// ── Power Explorer Graph Data Contracts ──────────────────────
// These interfaces define the typed contracts for all graph API
// responses.  The Cytoscape renderer maps these directly — no
// adapter layer that could silently reshape the contract.

export interface GraphNodeData {
  id: string;
  type: "person" | "office" | "institution";
  label: string;
  state: "occupied" | "vacant" | "not-established" | "discontinued";
  // Person-specific (present only when type === "person")
  personId?: string;
  photoUrl?: string;
  partyAbbreviation?: string;
  partyTagSlot?: number;
  // Office-specific
  positionId?: string;
  constitutionalBasis?: string;
  // Tenure context (present when temporal resolution has run)
  tenureStartDate?: string;
  tenureEndDate?: string | null;
  tenureMechanism?: string;
  startDateApproximate?: boolean;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  type: "reports_to" | "appoints" | "supervises" | "elected_from" | "part_of";
  label: string;
  citationArticle?: string;
  citationId?: string;
}

// ── Neo4j Sync Event ─────────────────────────────────────────
// Published to BullMQ `neo4j-sync` queue on Tenure create/update/delete.
// Consumed by the sync worker (Story 1.2).

export interface Neo4jSyncEvent {
  action: "upsert" | "delete";
  entityType: "tenure" | "person" | "position" | "institution";
  entityId: string;
  timestamp: string;
  data?: Record<string, unknown>;
}
