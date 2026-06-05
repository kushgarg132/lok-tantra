import Fuse from "fuse.js";
import { ARTICLES_DATA } from "@/data/constitution/articles-data";
import { DOCTRINES_DATA } from "@/data/constitution/doctrines-data";
import { GOVERNANCE_PROCESSES } from "@/data/governance/processes";
import { INSTITUTIONS_KNOWLEDGE } from "@/data/governance/institutions";
import type { KnowledgeChunk } from "./types";

// Convert article data to knowledge chunks
const ARTICLE_CHUNKS: KnowledgeChunk[] = ARTICLES_DATA.map((a) => ({
  id: `article-${a.number}`,
  title: `Article ${a.number} — ${a.title}`,
  content: `Article ${a.number}: ${a.title}\n\nText: ${a.text}\n\nExplanation: ${a.explanation}`,
  category: "constitutional" as const,
  keywords: [`article ${a.number}`, `art ${a.number}`, `art. ${a.number}`, ...(a.keywords || []), a.title.toLowerCase()],
  articleRefs: [a.number, ...a.relatedArticles],
  confidence: "high" as const,
}));

// Convert doctrine data to knowledge chunks
const DOCTRINE_CHUNKS: KnowledgeChunk[] = DOCTRINES_DATA.map((d) => ({
  id: `doctrine-${d.id}`,
  title: d.name,
  content: `${d.name}\n\n${d.description}\n\nDetailed explanation: ${d.detail}\n\nLandmark case: ${d.landmarkCase} (${d.caseYear})`,
  category: "constitutional" as const,
  keywords: [...d.keywords, d.name.toLowerCase(), (d.shortName || "").toLowerCase(), d.landmarkCase.toLowerCase()],
  articleRefs: d.relatedArticles,
  caseRefs: [d.landmarkCase],
  confidence: "high" as const,
}));

// Full corpus
const ALL_CHUNKS: KnowledgeChunk[] = [
  ...GOVERNANCE_PROCESSES,
  ...INSTITUTIONS_KNOWLEDGE,
  ...ARTICLE_CHUNKS,
  ...DOCTRINE_CHUNKS,
];

// ─── Fuse.js index (singleton) ─────────────────────────────────────────────────
let fuseIndex: Fuse<KnowledgeChunk> | null = null;

export function getKnowledgeFuse(): Fuse<KnowledgeChunk> {
  if (!fuseIndex) {
    fuseIndex = new Fuse(ALL_CHUNKS, {
      keys: [
        { name: "title", weight: 3 },
        { name: "keywords", weight: 2.5 },
        { name: "content", weight: 1 },
      ],
      threshold: 0.45,
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }
  return fuseIndex;
}

// ─── Article number extraction ─────────────────────────────────────────────────
const ART_RE = /\bart(?:icle)?\.?\s*(\d+[A-Za-z]?)/gi;

export function extractArticleNumbers(query: string): string[] {
  const nums: string[] = [];
  for (const m of Array.from(query.matchAll(ART_RE))) {
    nums.push(m[1].toUpperCase());
  }
  return Array.from(new Set(nums));
}

// ─── Intent detection ──────────────────────────────────────────────────────────
export type QueryIntent =
  | "constitutional"
  | "governance_process"
  | "institutional"
  | "judiciary"
  | "elections"
  | "federal"
  | "citizen_rights"
  | "general";

const INTENT_PATTERNS: Record<QueryIntent, RegExp[]> = {
  constitutional: [
    /\bart(?:icle)?\s*\d/i,
    /fundamental right/i,
    /basic structure/i,
    /constitution/i,
    /DPSP|directive principle/i,
    /preamble/i,
    /amendment/i,
    /writ/i,
    /habeas corpus|mandamus|certiorari/i,
  ],
  governance_process: [
    /how does.*(work|happen|process)/i,
    /\bprocess\b/i,
    /\bprocedure\b/i,
    /how.*bill.*law|bill become law/i,
    /PIL|public interest litigation/i,
    /RTI|right to information/i,
    /\bimpeach/i,
    /\bbudget\b/i,
    /emergency.*declar/i,
    /vote.*confidence|no confidence/i,
    /floor test/i,
  ],
  institutional: [
    /who controls|who commands|who runs/i,
    /who appoints|appoints.*(judge|governor|CEC)/i,
    /\bpolice\b/i,
    /\bCBI\b/i,
    /\bpresident\b.*power|power.*\bpresident\b/i,
    /\bgovernor\b.*role|role.*\bgovernor\b/i,
    /Prime Minister.*remove|PM.*dismiss/i,
    /\bCAG\b/i,
    /\bUPSC\b/i,
  ],
  judiciary: [
    /\bjudge\b/i,
    /\bsupreme court\b/i,
    /\bhigh court\b/i,
    /\bcollegium\b/i,
    /\bNJAC\b/i,
    /jurisdiction/i,
    /judicial.*review/i,
    /appeal.*court|court.*appeal/i,
  ],
  elections: [
    /\belection\b/i,
    /\bvoting\b/i,
    /\belectoral\b/i,
    /\bECI\b|election commission/i,
    /\bMCC\b|model code/i,
    /\bEVM\b/i,
  ],
  federal: [
    /federal|federalism/i,
    /centre.*state|state.*centre/i,
    /\bunion list\b|\bstate list\b|\bconcurrent list\b/i,
    /7th schedule/i,
    /cooperative federalism/i,
    /\bGST council\b/i,
    /state.*rights?|states.*power/i,
  ],
  citizen_rights: [
    /\bRTI\b/i,
    /\bgrievance\b/i,
    /\bcitizen\b.*right/i,
    /Lokpal|Lokayukta/i,
    /consumer court/i,
    /\bombudsman\b/i,
  ],
  general: [],
};

export function detectIntent(query: string): QueryIntent {
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS) as [QueryIntent, RegExp[]][]) {
    if (intent === "general") continue;
    if (patterns.some((p) => p.test(query))) return intent;
  }
  return "general";
}

// ─── Retrieval ──────────────────────────────────────────────────────────────────
export function retrieveRelevantChunks(
  query: string,
  limit = 5
): KnowledgeChunk[] {
  const fuse = getKnowledgeFuse();
  const artNums = extractArticleNumbers(query);
  const intent = detectIntent(query);

  const seen = new Set<string>();
  const results: KnowledgeChunk[] = [];

  // 1. Exact article number matches (highest priority)
  for (const num of artNums) {
    const chunk = ALL_CHUNKS.find((c) => c.id === `article-${num}`);
    if (chunk && !seen.has(chunk.id)) {
      results.push(chunk);
      seen.add(chunk.id);
    }
  }

  // 2. Fuse.js search
  const fuseResults = fuse.search(query, { limit: limit * 3 });
  for (const r of fuseResults) {
    if (!seen.has(r.item.id) && results.length < limit * 2) {
      results.push(r.item);
      seen.add(r.item.id);
    }
  }

  // 3. Intent-based boosting — prioritize matching categories at front
  const intentMatching = results.filter((c) => {
    if (intent === "general") return true;
    return c.category === intent || c.category === "constitutional";
  });
  const others = results.filter((c) => !intentMatching.includes(c));

  return [...intentMatching, ...others].slice(0, limit);
}
