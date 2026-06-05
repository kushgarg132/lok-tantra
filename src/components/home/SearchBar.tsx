"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const suggestions = [
  { text: "Who is my MP?", href: "/representatives" },
  { text: "How is the PM elected?", href: "/learn/executive" },
  { text: "Article 370", href: "/constitution/article/370" },
  { text: "How to file RTI", href: "/citizen-action#rti" },
  { text: "Lok Sabha seats", href: "/elections" },
  { text: "Supreme Court", href: "/judiciary" },
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const filteredSuggestions = query
    ? suggestions.filter((s) =>
        s.text.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div
          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 transition-all shadow-lg ${
            focused
              ? "border-saffron-400 shadow-saffron-500/10"
              : "border-slate-200 dark:border-slate-700"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-400 flex-shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Ask anything about Indian democracy..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 font-mono">
            Ctrl+K
          </kbd>
        </div>
      </form>

      {focused && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl glass-strong shadow-xl p-2 z-10 animate-fade-in">
          <div className="px-3 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">
            {query ? "Results" : "Try asking"}
          </div>
          {filteredSuggestions.map((s) => (
            <button
              key={s.text}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-left transition-colors"
              onClick={() => {
                setQuery(s.text);
                router.push(s.href);
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-saffron-500 flex-shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="text-sm text-slate-700 dark:text-slate-200">
                {s.text}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
