import { getESClient } from "./client";
import { embedText } from "./embeddings";
import { IDX } from "./indices";
import { detectIntent, retrieveRelevantChunks } from "@/lib/rag/knowledge";
import type {
  SearchOptions, SearchResponse, SearchHit, SearchDomain, IndexedDocument,
} from "./types";

// ── Domain priority by intent ─────────────────────────────────────────────────
const INTENT_DOMAIN_PRIORITY: Record<string, SearchDomain[]> = {
  constitutional:    ["constitution"],
  governance_process: ["institution", "constitution"],
  institutional:     ["institution", "representative"],
  judiciary:         ["institution", "constitution"],
  elections:         ["election", "representative"],
  federal:           ["institution", "constitution"],
  citizen_rights:    ["constitution", "institution"],
  general:           ["constitution", "institution", "representative", "election"],
};

function resolveDomains(intent: string, requested: SearchDomain[]): SearchDomain[] {
  const priority = INTENT_DOMAIN_PRIORITY[intent] ?? requested;
  // Keep only requested domains but in intent-priority order
  return [
    ...priority.filter((d) => requested.includes(d)),
    ...requested.filter((d) => !priority.includes(d)),
  ];
}

// ── Reciprocal Rank Fusion ─────────────────────────────────────────────────────
function rrfMerge(bm25: SearchHit[], knn: SearchHit[], k = 60): SearchHit[] {
  const scores = new Map<string, { hit: SearchHit; score: number }>();

  const credit = (list: SearchHit[]) => {
    list.forEach((hit, rank) => {
      const w = 1 / (k + rank + 1);
      const prev = scores.get(hit.id);
      if (prev) {
        prev.score += w;
      } else {
        scores.set(hit.id, { hit, score: w });
      }
    });
  };

  credit(bm25);
  credit(knn);

  return Array.from(scores.values())
    .sort((a, b) => b.score - a.score)
    .map(({ hit, score }) => ({ ...hit, score }));
}

// ── ES BM25 search ────────────────────────────────────────────────────────────
async function bm25Search(
  q: string,
  domains: SearchDomain[],
  limit: number,
  filters: SearchOptions["filters"],
): Promise<SearchHit[]> {
  const client = getESClient()!;
  const indices = domains.map((d) => IDX[d]).join(",");

  const must: unknown[] = [
    {
      multi_match: {
        query: q,
        fields: ["title^3", "content^1.5", "metadata.keywords^2"],
        type: "best_fields",
        fuzziness: "AUTO",
        minimum_should_match: "60%",
      },
    },
  ];

  const filterClauses: unknown[] = [];
  if (filters?.state)    filterClauses.push({ term: { "metadata.state":    filters.state } });
  if (filters?.party)    filterClauses.push({ term: { "metadata.party":    filters.party } });
  if (filters?.chamber)  filterClauses.push({ term: { "metadata.chamber":  filters.chamber } });
  if (filters?.branch)   filterClauses.push({ term: { "metadata.branch":   filters.branch } });
  if (filters?.category) filterClauses.push({ term: { "metadata.category": filters.category } });
  if (filters?.year)     filterClauses.push({ term: { "metadata.year":     filters.year } });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await (client.search as any)({
    index: indices,
    size: limit,
    query: {
      bool: {
        must,
        ...(filterClauses.length ? { filter: filterClauses } : {}),
      },
    },
    highlight: {
      pre_tags: ["<mark>"],
      post_tags: ["</mark>"],
      fields: {
        title:   { number_of_fragments: 1 },
        content: { number_of_fragments: 2, fragment_size: 160 },
      },
    },
  }) as { hits: { hits: Array<{ _source: unknown; _score?: number; highlight?: Record<string, string[]> }> } };

  return (res.hits.hits ?? []).map((h) => ({
    ...(h._source as IndexedDocument),
    score:     h._score ?? 0,
    highlight: h.highlight as SearchHit["highlight"],
  }));
}

// ── ES KNN (vector) search ────────────────────────────────────────────────────
async function knnSearch(
  vector: number[],
  domains: SearchDomain[],
  limit: number,
): Promise<SearchHit[]> {
  const client = getESClient()!;
  const indices = domains.map((d) => IDX[d]).join(",");

  // knn is a top-level ES 8.x param; cast to bypass strict overload checking
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await (client.search as any)({
    index: indices,
    size: limit,
    knn: {
      field: "vector",
      query_vector: vector,
      k: limit,
      num_candidates: limit * 5,
    },
  }) as { hits: { hits: Array<{ _source: unknown; _score?: number }> } };

  return (res.hits.hits ?? []).map((h) => ({
    ...(h._source as IndexedDocument),
    score: h._score ?? 0,
  }));
}

// ── Fuse.js fallback ─────────────────────────────────────────────────────────
function fuseFallback(q: string, limit: number): SearchHit[] {
  const chunks = retrieveRelevantChunks(q, limit);
  return chunks.map((c, i) => ({
    id:      c.id,
    domain:  "constitution" as SearchDomain,
    subtype: c.category,
    title:   c.title,
    content: c.content,
    snippet: c.content.slice(0, 280),
    score:   1 - i / Math.max(limit, 1),
    metadata: {
      category:        c.category,
      relatedArticles: c.articleRefs,
      keywords:        c.keywords,
    },
  }));
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function search(opts: SearchOptions): Promise<SearchResponse> {
  const {
    q,
    domains = ["constitution", "institution", "representative", "election"],
    limit   = 10,
    mode    = "hybrid",
    filters,
  } = opts;

  const t0     = Date.now();
  const intent = detectIntent(q);
  const ordered = resolveDomains(intent, domains);

  const client = getESClient();

  if (!client) {
    // No ES — Fuse.js fallback (constitution only)
    const hits = fuseFallback(q, limit);
    return { hits, total: hits.length, took: Date.now() - t0, query: q, domains, intent };
  }

  try {
    // Generate query embedding for semantic modes
    let vector: number[] | null = null;
    if (mode === "semantic" || mode === "hybrid") {
      vector = await embedText(q);
    }

    let hits: SearchHit[];

    if (mode === "lexical" || !vector) {
      hits = await bm25Search(q, ordered, limit * 2, filters);
    } else if (mode === "semantic") {
      hits = await knnSearch(vector, ordered, limit * 2);
    } else {
      // Hybrid: run both in parallel, then RRF
      const [bm25, knn] = await Promise.all([
        bm25Search(q, ordered, limit * 2, filters),
        knnSearch(vector, ordered, limit * 2),
      ]);
      hits = rrfMerge(bm25, knn);
    }

    return {
      hits:   hits.slice(0, limit),
      total:  hits.length,
      took:   Date.now() - t0,
      query:  q,
      domains: ordered,
      intent,
    };
  } catch (err) {
    console.error("[retriever] ES error, falling back to Fuse:", err);
    const hits = fuseFallback(q, limit);
    return { hits, total: hits.length, took: Date.now() - t0, query: q, domains, intent };
  }
}
