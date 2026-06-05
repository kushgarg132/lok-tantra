import { GovernanceSearch } from "@/components/search/GovernanceSearch";

export const metadata = {
  title: "Governance Search | LokTantra",
  description:
    "Semantic search across Indian constitutional articles, representatives, institutions, and election data. Powered by vector embeddings, hybrid retrieval, and AI-generated answers.",
};

const STATS = [
  { value: "450+",   label: "Constitutional articles" },
  { value: "40+",    label: "Governance doctrines" },
  { value: "36",     label: "States & UTs indexed" },
  { value: "4",      label: "Search domains" },
];

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 uppercase tracking-wide">
              Semantic Search
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase tracking-wide">
              RAG-Powered
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Governance Intelligence Search
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Natural language queries across India's constitutional corpus, representatives, institutions, and election analytics — with AI-synthesised answers and source citations.
          </p>

          {/* Capability badges */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            {[
              "ElasticSearch BM25",
              "Voyage AI Embeddings",
              "Hybrid RRF Retrieval",
              "Claude RAG Generation",
              "Intent Detection",
              "Citation Extraction",
            ].map((b) => (
              <span
                key={b}
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="card p-3 text-center">
              <div className="text-xl font-display font-bold text-indigo-600 dark:text-indigo-400">
                {s.value}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search UI */}
        <GovernanceSearch />

        {/* Architecture note */}
        <div className="mt-10 p-4 card bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-500">Search Architecture</p>
          <p>
            <strong>Hybrid retrieval:</strong> BM25 lexical + KNN dense vector search merged via
            Reciprocal Rank Fusion (RRF). Falls back to Fuse.js if ElasticSearch is unavailable.
          </p>
          <p>
            <strong>Embeddings:</strong> 1024-dimensional Voyage AI{" "}
            <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">voyage-3</code> model.
            Falls back to lexical-only if{" "}
            <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">VOYAGE_API_KEY</code>{" "}
            is not set.
          </p>
          <p>
            <strong>RAG generation:</strong> Top-8 retrieved chunks used as context for Claude{" "}
            <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">haiku-4-5</code> with
            strict citation and neutrality constraints.
          </p>
          <p>
            <strong>Index:</strong> Trigger re-indexing via{" "}
            <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">
              POST /api/search/index
            </code>
            . Check status at{" "}
            <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">
              GET /api/search/index
            </code>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
