export type KnowledgeCategory =
  | "constitutional"
  | "governance_process"
  | "institutional"
  | "judiciary"
  | "elections"
  | "federal"
  | "citizen_rights";

export interface KnowledgeChunk {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  keywords: string[];
  articleRefs: string[];
  caseRefs?: string[];
  confidence: "high" | "medium";
}

export interface RetrievedChunk extends KnowledgeChunk {
  relevanceScore: number;
}

export interface Citation {
  type: "article" | "case" | "amendment" | "act" | "schedule";
  ref: string;
  label: string;
}

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  suggestedFollowUps?: string[];
  retrievedSources?: { id: string; title: string; category: KnowledgeCategory }[];
  timestamp: number;
}

export interface AssistantRequest {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface AssistantResponse {
  answer: string;
  citations: Citation[];
  suggestedFollowUps: string[];
  sources: { id: string; title: string; category: KnowledgeCategory }[];
  confidence: "high" | "medium" | "low";
}
