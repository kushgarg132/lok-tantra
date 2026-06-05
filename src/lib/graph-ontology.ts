export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  properties: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: RelationshipType;
  properties?: Record<string, unknown>;
}

export type NodeType =
  | "Person"
  | "Institution"
  | "Position"
  | "ConstitutionalArticle"
  | "PoliticalParty"
  | "Constituency"
  | "State"
  | "Court"
  | "LandmarkCase"
  | "Bill"
  | "Amendment"
  | "Committee"
  | "Ministry"
  | "Department"
  | "Scheme"
  | "Election";

export type RelationshipType =
  | "REPORTS_TO"
  | "APPOINTS"
  | "REMOVES"
  | "SUPERVISES"
  | "LEGISLATES"
  | "OVERRULES"
  | "INTERPRETS"
  | "GOVERNS"
  | "ELECTED_FROM"
  | "BELONGS_TO_PARTY"
  | "MEMBER_OF_COMMITTEE"
  | "CONSTITUTIONAL_AUTHORITY_OVER"
  | "ADMINISTRATIVE_CONTROL_OVER"
  | "JUDICIAL_REVIEW_OVER"
  | "ALLIANCE_WITH"
  | "CONFLICTS_WITH"
  | "AMENDED_BY"
  | "ESTABLISHED_BY"
  | "PART_OF"
  | "HEADS"
  | "HOLDS_POSITION"
  | "REPRESENTS"
  | "DECIDED_BY"
  | "FUNDS"
  | "IMPLEMENTS";

export const CYPHER_SCHEMA = `
// Neo4j Graph Schema for Indian Democracy Knowledge Graph

// Node labels and properties:
// (:Person {id, name, dob, gender, education, photoUrl})
// (:Institution {id, name, type, branch, level, description, established})
// (:Position {id, title, constitutionalBasis, tenure, powers[]})
// (:ConstitutionalArticle {id, number, title, text, part, category})
// (:PoliticalParty {id, name, abbreviation, ideology[], color, type})
// (:Constituency {id, name, type, stateCode, reservedFor})
// (:State {id, name, code, type, capital, lsSeats, rsSeats, assemblySeats})
// (:Court {id, name, type, jurisdiction})
// (:LandmarkCase {id, name, citation, year, summary, significance})
// (:Bill {id, title, type, status, introducedIn})
// (:Amendment {id, number, year, description, significance})
// (:Committee {id, name, type, chamber})
// (:Ministry {id, name, department})
// (:Scheme {id, name, ministry, budget, beneficiaries})
// (:Election {id, year, type, state})

// Relationship types:
// (p:Person)-[:HOLDS_POSITION]->(pos:Position)
// (pos:Position)-[:PART_OF]->(i:Institution)
// (i:Institution)-[:REPORTS_TO]->(i2:Institution)
// (i:Institution)-[:ESTABLISHED_BY]->(a:ConstitutionalArticle)
// (p:Person)-[:BELONGS_TO_PARTY]->(party:PoliticalParty)
// (p:Person)-[:ELECTED_FROM]->(c:Constituency)
// (p:Person)-[:REPRESENTS]->(s:State)
// (pos:Position)-[:APPOINTS]->(pos2:Position)
// (pos:Position)-[:REMOVES]->(pos2:Position)
// (pos:Position)-[:SUPERVISES]->(pos2:Position)
// (i:Institution)-[:LEGISLATES]->(b:Bill)
// (court:Court)-[:JUDICIAL_REVIEW_OVER]->(i:Institution)
// (court:Court)-[:INTERPRETS]->(a:ConstitutionalArticle)
// (case:LandmarkCase)-[:DECIDED_BY]->(court:Court)
// (case:LandmarkCase)-[:INTERPRETS]->(a:ConstitutionalArticle)
// (a:Amendment)-[:AMENDED_BY]->(art:ConstitutionalArticle)
// (party:PoliticalParty)-[:ALLIANCE_WITH]->(party2:PoliticalParty)
// (m:Ministry)-[:ADMINISTRATIVE_CONTROL_OVER]->(d:Department)
// (s:Scheme)-[:IMPLEMENTS]->(m:Ministry)
// (p:Person)-[:MEMBER_OF_COMMITTEE]->(c:Committee)
// (i:Institution)-[:CONSTITUTIONAL_AUTHORITY_OVER]->(i2:Institution)
`;

export const GOVERNANCE_GRAPH: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    // Core constitutional positions
    { id: "people", label: "People of India", type: "Institution", properties: { level: "sovereign", description: "Ultimate source of all power" } },
    { id: "constitution", label: "Constitution of India", type: "Institution", properties: { level: "supreme_law", established: "1950-01-26" } },

    // Union Executive
    { id: "president", label: "President of India", type: "Position", properties: { article: "52-62", branch: "executive", level: "central" } },
    { id: "vice_president", label: "Vice President", type: "Position", properties: { article: "63-71", branch: "executive", level: "central" } },
    { id: "pm", label: "Prime Minister", type: "Position", properties: { article: "74-75", branch: "executive", level: "central" } },
    { id: "council_of_ministers", label: "Council of Ministers", type: "Institution", properties: { article: "74-75", branch: "executive", level: "central" } },
    { id: "cabinet_secretary", label: "Cabinet Secretary", type: "Position", properties: { branch: "executive", level: "central" } },
    { id: "pmo", label: "Prime Minister's Office", type: "Institution", properties: { branch: "executive", level: "central" } },

    // Parliament
    { id: "parliament", label: "Parliament of India", type: "Institution", properties: { article: "79", branch: "legislature", level: "central" } },
    { id: "lok_sabha", label: "Lok Sabha", type: "Institution", properties: { article: "81-82", branch: "legislature", seats: 543 } },
    { id: "rajya_sabha", label: "Rajya Sabha", type: "Institution", properties: { article: "80", branch: "legislature", seats: 245 } },
    { id: "speaker_ls", label: "Speaker of Lok Sabha", type: "Position", properties: { article: "93" } },
    { id: "chairman_rs", label: "Chairman of Rajya Sabha", type: "Position", properties: { article: "89" } },

    // Judiciary
    { id: "supreme_court", label: "Supreme Court of India", type: "Court", properties: { article: "124-147", level: "central" } },
    { id: "cji", label: "Chief Justice of India", type: "Position", properties: { article: "124" } },
    { id: "high_courts", label: "High Courts", type: "Court", properties: { article: "214-231", level: "state" } },
    { id: "district_courts", label: "District Courts", type: "Court", properties: { level: "district" } },

    // State Level
    { id: "governor", label: "Governor", type: "Position", properties: { article: "153-162", level: "state" } },
    { id: "cm", label: "Chief Minister", type: "Position", properties: { article: "163-164", level: "state" } },
    { id: "state_legislature", label: "State Legislature", type: "Institution", properties: { article: "168-212", level: "state" } },

    // District & Local
    { id: "district_collector", label: "District Collector/Magistrate", type: "Position", properties: { level: "district" } },
    { id: "panchayat", label: "Panchayati Raj", type: "Institution", properties: { article: "243-243O", level: "local" } },
    { id: "municipality", label: "Municipalities", type: "Institution", properties: { article: "243P-243ZG", level: "local" } },

    // Constitutional & Independent Bodies
    { id: "eci", label: "Election Commission of India", type: "Institution", properties: { article: "324", branch: "independent" } },
    { id: "cag", label: "Comptroller & Auditor General", type: "Institution", properties: { article: "148-151", branch: "independent" } },
    { id: "upsc", label: "UPSC", type: "Institution", properties: { article: "315-323", branch: "independent" } },
    { id: "finance_commission", label: "Finance Commission", type: "Institution", properties: { article: "280", branch: "independent" } },
    { id: "niti_aayog", label: "NITI Aayog", type: "Institution", properties: { branch: "executive", level: "central" } },
    { id: "attorney_general", label: "Attorney General", type: "Position", properties: { article: "76", branch: "executive" } },
  ],
  edges: [
    // Sovereign hierarchy
    { source: "people", target: "constitution", relationship: "ESTABLISHED_BY" },
    { source: "constitution", target: "president", relationship: "ESTABLISHES" as RelationshipType },
    { source: "constitution", target: "parliament", relationship: "ESTABLISHES" as RelationshipType },
    { source: "constitution", target: "supreme_court", relationship: "ESTABLISHES" as RelationshipType },

    // Executive chain
    { source: "pm", target: "president", relationship: "REPORTS_TO" },
    { source: "council_of_ministers", target: "pm", relationship: "REPORTS_TO" },
    { source: "cabinet_secretary", target: "pm", relationship: "REPORTS_TO" },
    { source: "pmo", target: "pm", relationship: "REPORTS_TO" },

    // Parliament structure
    { source: "lok_sabha", target: "parliament", relationship: "PART_OF" },
    { source: "rajya_sabha", target: "parliament", relationship: "PART_OF" },
    { source: "speaker_ls", target: "lok_sabha", relationship: "HEADS" },
    { source: "chairman_rs", target: "rajya_sabha", relationship: "HEADS" },
    { source: "vice_president", target: "chairman_rs", relationship: "HOLDS_POSITION" },

    // Appointments
    { source: "president", target: "pm", relationship: "APPOINTS" },
    { source: "president", target: "cji", relationship: "APPOINTS" },
    { source: "president", target: "governor", relationship: "APPOINTS" },
    { source: "president", target: "attorney_general", relationship: "APPOINTS" },
    { source: "president", target: "cag", relationship: "APPOINTS" },
    { source: "president", target: "eci", relationship: "APPOINTS" },
    { source: "president", target: "upsc", relationship: "APPOINTS" },
    { source: "president", target: "finance_commission", relationship: "APPOINTS" },
    { source: "governor", target: "cm", relationship: "APPOINTS" },

    // Judicial hierarchy
    { source: "high_courts", target: "supreme_court", relationship: "REPORTS_TO" },
    { source: "district_courts", target: "high_courts", relationship: "REPORTS_TO" },
    { source: "cji", target: "supreme_court", relationship: "HEADS" },

    // Checks and balances
    { source: "supreme_court", target: "parliament", relationship: "JUDICIAL_REVIEW_OVER" },
    { source: "supreme_court", target: "council_of_ministers", relationship: "JUDICIAL_REVIEW_OVER" },
    { source: "parliament", target: "council_of_ministers", relationship: "SUPERVISES" },

    // State hierarchy
    { source: "cm", target: "governor", relationship: "REPORTS_TO" },
    { source: "state_legislature", target: "parliament", relationship: "REPORTS_TO" },
    { source: "district_collector", target: "cm", relationship: "REPORTS_TO" },

    // Local governance
    { source: "panchayat", target: "district_collector", relationship: "REPORTS_TO" },
    { source: "municipality", target: "district_collector", relationship: "REPORTS_TO" },
  ],
};
