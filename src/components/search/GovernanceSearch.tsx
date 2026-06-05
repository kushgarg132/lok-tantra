"use client";

import { useState, useEffect, useCallback, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SearchHit, SearchDomain, SearchMode, SearchAnswer } from "@/lib/search/types";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SearchState {
  hits:    SearchHit[];
  total:   number;
  took:    number;
  query:   string;
  intent?: string;
  answer?: SearchAnswer;
}

// ── Domain config ─────────────────────────────────────────────────────────────
const DOMAINS: { id: SearchDomain | "all"; label: string; icon: string; color: string }[] = [
  { id: "all",            label: "All",             icon: "🔍", color: "bg-slate-700 text-white" },
  { id: "constitution",   label: "Constitution",    icon: "📜", color: "bg-amber-600 text-white" },
  { id: "representative", label: "Representatives", icon: "🏛️", color: "bg-blue-600 text-white" },
  { id: "institution",    label: "Institutions",    icon: "🏢", color: "bg-emerald-600 text-white" },
  { id: "election",       label: "Elections",       icon: "🗳️", color: "bg-purple-600 text-white" },
];

const DOMAIN_ACCENT: Record<string, string> = {
  constitution:   "border-amber-400 bg-amber-50 dark:bg-amber-950/20",
  representative: "border-blue-400 bg-blue-50 dark:bg-blue-950/20",
  institution:    "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20",
  election:       "border-purple-400 bg-purple-50 dark:bg-purple-950/20",
};

const DOMAIN_BADGE: Record<string, string> = {
  constitution:   "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  representative: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  institution:    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  election:       "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
};

const SUBTYPE_ICON: Record<string, string> = {
  article: "§",
  doctrine: "⚖",
  amendment: "✏",
  case: "🔖",
  mp: "🏅",
  minister: "🎖",
  cm: "👤",
  knowledge: "📚",
  process: "⚙",
  ministry: "🏢",
  "state-result": "🗺",
  "party-result": "🏴",
  coalition: "🤝",
  historical: "📅",
};

const EXAMPLE_QUERIES = [
  "Who controls police in India?",
  "How does a bill become law?",
  "What is the Basic Structure Doctrine?",
  "Who won most seats in 2024 Lok Sabha?",
  "How to file an RTI application?",
  "What are the powers of the President?",
  "How is the Chief Minister appointed?",
  "Article 21 right to life",
];

// ── Highlight renderer ────────────────────────────────────────────────────────
function Snippet({ text, highlight }: { text: string; highlight?: string[] }) {
  const raw = highlight?.[0] ?? text;
  return (
    <p
      className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed"
      // highlight tags are safe — only <mark> inserted by our ES config
      dangerouslySetInnerHTML={{ __html: raw.replace(/<mark>/g, '<mark class="bg-yellow-200 dark:bg-yellow-900/50 rounded px-0.5">').replace(/<\/mark>/g, "</mark>") }}
    />
  );
}

// ── Domain badge ──────────────────────────────────────────────────────────────
function DomainBadge({ domain, subtype }: { domain: string; subtype: string }) {
  const cls = DOMAIN_BADGE[domain] ?? "bg-slate-100 text-slate-600";
  const icon = SUBTYPE_ICON[subtype] ?? "·";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}>
      <span>{icon}</span>
      <span className="capitalize">{subtype.replace(/-/g, " ")}</span>
    </span>
  );
}

// ── Metadata pills ────────────────────────────────────────────────────────────
function MetaPills({ hit }: { hit: SearchHit }) {
  const pills: string[] = [];
  if (hit.metadata.articleNumber) pills.push(`Art. ${hit.metadata.articleNumber}`);
  if (hit.metadata.state)         pills.push(hit.metadata.state as string);
  if (hit.metadata.party)         pills.push(hit.metadata.party as string);
  if (hit.metadata.chamber)       pills.push(hit.metadata.chamber as string);
  if (hit.metadata.year)          pills.push(`${hit.metadata.year}`);
  if (hit.metadata.seats)         pills.push(`${hit.metadata.seats} seats`);
  if (hit.metadata.alliance)      pills.push(hit.metadata.alliance as string);
  if (pills.length === 0)         return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {pills.map((p) => (
        <span key={p} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
          {p}
        </span>
      ))}
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────
function ResultCard({ hit }: { hit: SearchHit }) {
  const border = DOMAIN_ACCENT[hit.domain] ?? "";
  const highlightedContent = hit.highlight?.content;
  const highlightedTitle = hit.highlight?.title?.[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`card p-4 border-l-4 ${border} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <DomainBadge domain={hit.domain} subtype={hit.subtype} />
          </div>
          {highlightedTitle ? (
            <h3
              className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug"
              dangerouslySetInnerHTML={{
                __html: highlightedTitle.replace(/<mark>/g, '<mark class="bg-yellow-200 dark:bg-yellow-900/50 rounded px-0.5">').replace(/<\/mark>/g, "</mark>"),
              }}
            />
          ) : (
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug">
              {hit.title}
            </h3>
          )}
          <MetaPills hit={hit} />
          <div className="mt-2">
            <Snippet text={hit.snippet} highlight={highlightedContent} />
          </div>
        </div>
        <div className="text-[10px] text-slate-300 dark:text-slate-600 shrink-0 font-mono">
          {(hit.score * 100).toFixed(0)}
        </div>
      </div>
    </motion.div>
  );
}

// ── AI Answer panel ────────────────────────────────────────────────────────────
function AnswerPanel({ answer, query }: { answer: SearchAnswer; query: string }) {
  const [expanded, setExpanded] = useState(true);

  const conf = { high: "bg-emerald-500", medium: "bg-amber-500", low: "bg-slate-400" }[answer.confidence];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
            AI Answer
          </span>
          <span className={`w-2 h-2 rounded-full ${conf}`} title={`Confidence: ${answer.confidence}`} />
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Answer text rendered as plain paragraphs — markdown is from trusted Claude */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {answer.text.split("\n\n").map((para, i) => (
                <p key={i}>{para.replace(/\*\*(.+?)\*\*/g, "$1")}</p>
              ))}
            </div>

            {/* Citations */}
            {answer.citations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {answer.citations.map((c) => (
                  <span
                    key={`${c.type}-${c.ref}`}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            )}

            {/* Sources */}
            {answer.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-800/40">
                <p className="text-[10px] text-slate-400 mb-1.5">Sources used:</p>
                <div className="space-y-0.5">
                  {answer.sources.map((s) => (
                    <div key={s.id} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span className={`w-1.5 h-1.5 rounded-full ${DOMAIN_BADGE[s.domain]?.split(" ")[0] ?? "bg-slate-300"}`} />
                      {s.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follow-up suggestions */}
      {answer.followUps.length > 0 && (
        <div className="pt-2 border-t border-indigo-100 dark:border-indigo-800/40">
          <p className="text-[10px] text-slate-400 mb-1.5">Ask follow-up:</p>
          <div className="flex flex-wrap gap-1.5">
            {answer.followUps.map((fu) => (
              <span
                key={fu}
                className="px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                role="button"
                tabIndex={0}
                onClick={() => {
                  // Bubble up to parent via custom event
                  document.dispatchEvent(new CustomEvent("loktantra:search", { detail: { q: fu } }));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") document.dispatchEvent(new CustomEvent("loktantra:search", { detail: { q: fu } }));
                }}
              >
                {fu}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function GovernanceSearch() {
  const [query,    setQuery]    = useState("");
  const [domain,   setDomain]   = useState<SearchDomain | "all">("all");
  const [mode,     setMode]     = useState<SearchMode>("hybrid");
  const [state,    setState]    = useState<SearchState | null>(null);
  const [pending,  startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(
    async (q: string, dom: SearchDomain | "all", m: SearchMode, withAnswer = false) => {
      if (!q.trim()) { setState(null); return; }
      const params = new URLSearchParams({
        q,
        domains: dom === "all" ? "all" : dom,
        mode:    m,
        limit:   "12",
        answer:  String(withAnswer),
      });
      const res  = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setState(data);
    },
    [],
  );

  const handleInput = useCallback(
    (val: string) => {
      setQuery(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        startTransition(() => { doSearch(val, domain, mode, false); });
      }, 350);
    },
    [domain, mode, doSearch, startTransition],
  );

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    startTransition(() => { doSearch(query, domain, mode, true); });
  };

  // Listen for follow-up query events
  const handleFollowUp = useCallback(
    (e: Event) => {
      const q = (e as CustomEvent<{ q: string }>).detail.q;
      setQuery(q);
      startTransition(() => { doSearch(q, domain, mode, true); });
      inputRef.current?.focus();
    },
    [domain, mode, doSearch, startTransition],
  );

  // Attach follow-up listener — must be in useEffect (document is not available during SSR)
  useEffect(() => {
    document.addEventListener("loktantra:search", handleFollowUp);
    return () => document.removeEventListener("loktantra:search", handleFollowUp);
  }, [handleFollowUp]);

  const clear = () => {
    setQuery("");
    setState(null);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-5">
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 p-3 card bg-white dark:bg-slate-900 border-2 border-transparent focus-within:border-indigo-400 transition-colors rounded-2xl">
          <svg
            className="shrink-0 text-slate-400"
            width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Ask anything about Indian governance, constitution, elections…"
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
            autoComplete="off"
            aria-label="Search Indian governance"
          />
          {query && (
            <button type="button" onClick={clear} className="text-slate-300 hover:text-slate-500 p-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim()}
            className="shrink-0 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-medium transition-colors"
          >
            {pending ? "…" : "Search"}
          </button>
        </div>
      </form>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Domain selector */}
        <div className="flex gap-1 flex-wrap">
          {DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setDomain(d.id);
                if (query) startTransition(() => doSearch(query, d.id, mode, false));
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                domain === d.id
                  ? d.color
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {d.icon} {d.label}
            </button>
          ))}
        </div>

        {/* Mode selector */}
        <div className="ml-auto flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          {(["hybrid", "semantic", "lexical"] as SearchMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                if (query) startTransition(() => doSearch(query, domain, m, false));
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${
                mode === m
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
              title={
                m === "hybrid"   ? "BM25 + vector KNN combined with RRF" :
                m === "semantic" ? "Pure vector similarity (embedding-based)" :
                "BM25 keyword matching only"
              }
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {!query && !state && (
          <motion.div
            key="examples"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="text-xs text-slate-400 uppercase tracking-wide">Try asking</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {EXAMPLE_QUERIES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setQuery(ex);
                    startTransition(() => doSearch(ex, domain, mode, true));
                  }}
                  className="text-left px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors border border-slate-100 dark:border-slate-700"
                >
                  {ex}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {state && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Stats bar */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                {state.total} result{state.total !== 1 ? "s" : ""} for{" "}
                <strong className="text-slate-600 dark:text-slate-300">&ldquo;{state.query}&rdquo;</strong>
                {state.intent && state.intent !== "general" && (
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                    intent: {state.intent}
                  </span>
                )}
              </span>
              <span>{state.took}ms</span>
            </div>

            {/* AI answer */}
            {state.answer && <AnswerPanel answer={state.answer} query={state.query} />}

            {/* Hit list */}
            {state.hits.length > 0 ? (
              <div className="space-y-3">
                {state.hits.map((hit) => (
                  <ResultCard key={hit.id} hit={hit} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-sm">No results found for &ldquo;{state.query}&rdquo;</p>
                <p className="text-xs mt-1">Try different keywords or switch to Hybrid mode</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
