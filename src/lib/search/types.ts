export type SearchDomain = "constitution" | "representative" | "institution" | "election";

export type SearchMode = "hybrid" | "semantic" | "lexical";

// ── Indexed document shape (stored in ES + returned from search) ─────────────
export interface IndexedDocument {
  id:      string;
  domain:  SearchDomain;
  subtype: string;           // e.g. "article" | "doctrine" | "mp" | "ministry"
  title:   string;
  content: string;           // Full text — used for BM25 + RAG context
  snippet: string;           // Short excerpt for UI (≤300 chars)
  // vector is NOT stored in this interface; it is added by the indexer before bulk insert
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  // Constitution
  articleNumber?:  string;
  partNum?:        number;
  category?:       string;
  relatedArticles?: string[];
  keywords?:       string[];
  year?:           number;
  // Representative
  state?:          string;
  party?:          string;
  chamber?:        string;
  constituency?:   string;
  designation?:    string;
  // Institution
  branch?:         string;
  level?:          string;
  article?:        string;
  // Election
  seats?:          number;
  alliance?:       string;
  turnout?:        number;
  ndaSeats?:       number;
  indiaSeats?:     number;
  [key: string]:   unknown;
}

// ── Search result from ES ──────────────────────────────────────────────────
export interface SearchHit extends IndexedDocument {
  score: number;
  highlight?: {
    title?:   string[];
    content?: string[];
  };
}

// ── Request / response shapes ─────────────────────────────────────────────
export interface SearchOptions {
  q:        string;
  domains?: SearchDomain[];
  limit?:   number;
  mode?:    SearchMode;
  filters?: {
    state?:    string;
    party?:    string;
    category?: string;
    year?:     number;
    chamber?:  string;
    branch?:   string;
  };
}

export interface SearchAnswer {
  text:        string;
  citations:   Array<{ type: string; ref: string; label: string }>;
  followUps:   string[];
  confidence:  "high" | "medium" | "low";
  sources:     Array<{ id: string; title: string; domain: SearchDomain }>;
}

export interface SearchResponse {
  hits:     SearchHit[];
  total:    number;
  took:     number;           // ms
  query:    string;
  domains:  SearchDomain[];
  intent?:  string;
  answer?:  SearchAnswer;     // Only present when generateAnswer=true
}
