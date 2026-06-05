export type Branch = "legislature" | "executive" | "judiciary";
export type GovernmentLevel = "central" | "state" | "district" | "local";
export type InstitutionType =
  | "constitutional_body"
  | "statutory_body"
  | "executive_body"
  | "judicial_body"
  | "legislative_body"
  | "local_body";

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  branch: Branch;
  level: GovernmentLevel;
  parentId: string | null;
  constitutionalBasis: string;
  description: string;
  powers: string[];
  currentHead?: PersonBrief;
  website?: string;
  established?: string;
}

export interface PersonBrief {
  id: string;
  name: string;
  designation: string;
  party?: string;
  photoUrl?: string;
  state?: string;
  constituency?: string;
}

export interface Representative {
  id: string;
  name: string;
  designation: string;
  party: string;
  partyColor: string;
  constituency: string;
  state: string;
  level: GovernmentLevel;
  chamber?: "lok_sabha" | "rajya_sabha" | "state_assembly";
  contact: ContactInfo;
  profile: RepresentativeProfile;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  twitter?: string;
  constituencyOffice?: string;
}

export interface RepresentativeProfile {
  education?: string;
  age?: number;
  gender?: string;
  termStart?: string;
  termEnd?: string;
  attendance?: number;
  questionsAsked?: number;
  debatesParticipated?: number;
  billsIntroduced?: number;
  assetsValue?: number;
  criminalCases?: number;
}

export interface ConstitutionArticle {
  id: string;
  number: string;
  title: string;
  part: string;
  partName: string;
  text: string;
  explanation?: string;
  amendments: Amendment[];
  relatedArticles: string[];
  landmarkCases: LandmarkCase[];
  category: ArticleCategory;
}

export type ArticleCategory =
  | "fundamental_rights"
  | "dpsp"
  | "fundamental_duties"
  | "union_executive"
  | "parliament"
  | "state_executive"
  | "state_legislature"
  | "judiciary"
  | "union_territories"
  | "panchayats"
  | "municipalities"
  | "elections"
  | "finance"
  | "emergency"
  | "amendment"
  | "schedules"
  | "other";

export interface Amendment {
  id: string;
  number: number;
  year: number;
  description: string;
  articlesAffected: string[];
  significance: "minor" | "moderate" | "major" | "landmark";
}

export interface LandmarkCase {
  id: string;
  name: string;
  year: number;
  citation: string;
  summary: string;
  significance: string;
  articlesInterpreted: string[];
  impact: string;
}

export interface PoliticalParty {
  id: string;
  name: string;
  abbreviation: string;
  founded: number;
  ideology: string[];
  president: string;
  headquarters: string;
  color: string;
  type: "national" | "state" | "registered";
  states: string[];
  currentSeats: {
    lokSabha: number;
    rajyaSabha: number;
    stateAssemblies: number;
  };
  alliances: string[];
  symbol: string;
}

export interface ElectionResult {
  id: string;
  year: number;
  type: "lok_sabha" | "state_assembly" | "rajya_sabha" | "local";
  state?: string;
  constituency: string;
  winner: PersonBrief;
  winnerParty: string;
  winnerVotes: number;
  runnerUp: PersonBrief;
  runnerUpParty: string;
  runnerUpVotes: number;
  totalVoters: number;
  turnout: number;
  margin: number;
}

export interface PowerNode {
  id: string;
  name: string;
  type: "person" | "institution" | "body" | "position";
  level: GovernmentLevel;
  branch?: Branch;
  parent?: string;
  children?: string[];
  currentHolder?: PersonBrief;
  powers: string[];
  constitutionalArticle?: string;
  appointedBy?: string;
  removableBy?: string;
  reportsTo?: string;
  supervises?: string[];
}

export interface GovernanceProcess {
  id: string;
  name: string;
  description: string;
  steps: ProcessStep[];
  category: "legislative" | "executive" | "judicial" | "electoral" | "administrative";
  constitutionalBasis: string;
  estimatedDuration?: string;
}

export interface ProcessStep {
  id: string;
  order: number;
  title: string;
  description: string;
  actor: string;
  institution: string;
  constitutionalArticle?: string;
  duration?: string;
  isOptional?: boolean;
  outcomes?: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: "constitutional" | "political" | "judicial" | "electoral" | "social" | "economic";
  significance: "minor" | "moderate" | "major" | "landmark";
  relatedArticles?: string[];
  relatedPersons?: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced" | "upsc" | "research";
  modules: LearningModule[];
  estimatedHours: number;
  prerequisites: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: "explainer" | "interactive" | "quiz" | "simulation" | "case_study";
  content: string;
  estimatedMinutes: number;
  order: number;
}
