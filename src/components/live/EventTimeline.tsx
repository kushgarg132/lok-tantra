"use client";

import { useState, useEffect } from "react";
import { useLiveStore, timeAgo } from "@/store/liveStore";
import { CATEGORY_META, PRIORITY_META, type EventCategory } from "@/data/live";

const FILTER_CATS: { id: EventCategory | "all"; label: string; icon: string }[] = [
  { id: "all",        label: "All",       icon: "📡" },
  { id: "parliament", label: "Parliament", icon: "🏛️" },
  { id: "court",      label: "Court",      icon: "⚖️" },
  { id: "election",   label: "Elections",  icon: "🗳️" },
  { id: "cabinet",    label: "Cabinet",    icon: "🏢" },
  { id: "governor",   label: "Governors",  icon: "🔱" },
  { id: "ordinance",  label: "Ordinances", icon: "📜" },
];

export function EventTimeline({ compact = false }: { compact?: boolean }) {
  const timeline = useLiveStore((s) => s.timeline);
  const filterCategory = useLiveStore((s) => s.filterCategory);
  const setFilter = useLiveStore((s) => s.setFilter);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const visible = filterCategory === "all"
    ? timeline
    : timeline.filter((e) => e.category === filterCategory);

  return (
    <div className="flex flex-col h-full">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5 pb-3 border-b border-slate-200 dark:border-slate-800 mb-3 shrink-0">
        {FILTER_CATS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              filterCategory === f.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span>{f.icon}</span>
            {!compact && <span>{f.label}</span>}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="text-[10px] text-slate-400 mb-2 shrink-0">
        {visible.length} event{visible.length !== 1 ? "s" : ""}
        {filterCategory !== "all" ? ` in ${CATEGORY_META[filterCategory].label}` : ""}
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {visible.map((e) => {
          const cat = CATEGORY_META[e.category];
          const pri = PRIORITY_META[e.priority];
          const isNew = now - e.addedAt < 30_000;
          return (
            <div
              key={e.seqId}
              className={`rounded-xl border p-3 transition-all ${cat.bg} ${cat.border} ${isNew ? "ring-1 " + pri.ring : ""}`}
            >
              <div className="flex items-start gap-2">
                {/* Timeline dot */}
                <div className="flex flex-col items-center mt-1 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${pri.dot}`} />
                </div>

                <div className="min-w-0 flex-1">
                  {/* Header row */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-sm leading-none">{cat.icon}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${cat.color}`}>
                      {cat.label}
                    </span>
                    {e.priority === "breaking" && (
                      <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase animate-pulse">
                        Breaking
                      </span>
                    )}
                    {e.priority === "high" && (
                      <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400 uppercase">
                        High
                      </span>
                    )}
                    {e.articleRef && (
                      <span className="ml-auto text-[9px] font-mono text-indigo-500 dark:text-indigo-400 shrink-0">
                        {e.articleRef}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {e.title}
                  </p>

                  {/* Detail (collapsed) */}
                  {!compact && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {e.detail}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-slate-400">{e.source}</span>
                    <span className={`text-[10px] font-medium ${isNew ? "text-emerald-500" : "text-slate-400"}`}>
                      {timeAgo(e.addedAt, now)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">
            No events in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
