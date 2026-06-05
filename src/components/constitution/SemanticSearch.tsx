"use client";

import { useState, useRef, useEffect } from "react";

type ResultType = "article" | "doctrine" | "case" | "amendment";

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  number?: string;
  snippet: string;
  relevanceScore: number;
  category?: string;
  partNum?: number;
  relatedArticles?: string[];
  caseYear?: number;
}

const EXAMPLE_QUERIES = [
  "Explain Article 21",
  "What is Basic Structure Doctrine?",
  "How does Article 356 work?",
  "Difference between Fundamental Rights and DPSP",
  "What are the writs in Article 32?",
  "Kesavananda Bharati case",
  "Right to privacy",
  "Emergency provisions",
];

const TYPE_COLORS: Record<ResultType, string> = {
  article: "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300",
  doctrine: "bg-navy-100 text-navy-700 dark:bg-navy-900/30 dark:text-navy-300",
  case: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  amendment: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

export function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [explanation, setExplanation] = useState("");
  const [explanationSource, setExplanationSource] = useState<"claude" | "local" | "local_fallback">("local");
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setIsSearching(true);
    setHasSearched(true);
    setResults([]);
    setExplanation("");
    setSelectedResult(null);

    try {
      const res = await fetch(`/api/constitution/search?q=${encodeURIComponent(trimmed)}&limit=12`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExplain = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setIsExplaining(true);
    setExplanation("");

    try {
      const res = await fetch("/api/constitution/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      setExplanation(data.explanation || "");
      setExplanationSource(data.source || "local");
    } catch {
      setExplanation("Unable to generate explanation. Please try again.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSubmit = async (q: string) => {
    await Promise.all([handleSearch(q), handleExplain(q)]);
  };

  // Convert markdown bold to JSX
  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(query)}
              placeholder="Ask anything about the Indian Constitution..."
              className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-saffron-400 dark:focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 dark:focus:ring-saffron-900 transition-all"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <button
            onClick={() => handleSubmit(query)}
            disabled={isSearching || isExplaining || !query.trim()}
            className="px-6 py-3 rounded-xl bg-saffron-500 text-white font-medium text-sm hover:bg-saffron-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching || isExplaining ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Example queries */}
        {!hasSearched && (
          <div className="mt-4">
            <p className="text-xs text-slate-400 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuery(q);
                    handleSubmit(q);
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-saffron-50 dark:hover:bg-saffron-900/20 hover:text-saffron-600 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Explanation */}
      {(isExplaining || explanation) && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-saffron-400 to-navy-600 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              AI Explanation
            </span>
            {explanationSource === "claude" && (
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                Claude AI
              </span>
            )}
          </div>

          {isExplaining ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
                  style={{ width: `${85 - i * 10}%` }}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {explanation.split("\n").map((line, i) => (
                <p key={i} className={line.startsWith("**") || line === "" ? "mt-2" : ""}>
                  {renderMarkdown(line)}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div>
          {isSearching ? (
            <div className="grid gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full mb-1" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
              {results.map((result) => (
                <SearchResultCard
                  key={result.id}
                  result={result}
                  isSelected={selectedResult?.id === result.id}
                  onClick={() =>
                    setSelectedResult(selectedResult?.id === result.id ? null : result)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try rephrasing your query or browse articles by part below.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultCard({
  result,
  isSelected,
  onClick,
}: {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left card p-4 transition-all ${
        isSelected ? "border-saffron-400 dark:border-saffron-500 shadow-md" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${TYPE_COLORS[result.type]}`}
        >
          {result.type}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {result.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {result.snippet}
          </p>
          {result.relatedArticles && result.relatedArticles.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {result.relatedArticles.slice(0, 5).map((a) => (
                <span
                  key={a}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500"
                >
                  Art. {a}
                </span>
              ))}
            </div>
          )}
        </div>
        <svg
          className={`shrink-0 text-slate-400 transition-transform ${isSelected ? "rotate-180" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-left">
          {result.snippet}
        </div>
      )}
    </button>
  );
}
