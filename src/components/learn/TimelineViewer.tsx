"use client";

import { useState } from "react";
import { getTimeline, TIMELINES } from "@/data/learn/timelines";

interface TimelineViewerProps {
  timelineId?: string;
  onClose?: () => void;
}

export function TimelineViewer({ timelineId, onClose }: TimelineViewerProps) {
  const [activeId, setActiveId] = useState(timelineId || TIMELINES[0].id);
  const [selected, setSelected] = useState<number | null>(null);
  const timeline = getTimeline(activeId)!;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
        )}
        <div>
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">{timeline.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{timeline.description}</p>
        </div>
      </div>

      {/* Timeline selector */}
      <div className="flex gap-2 flex-wrap">
        {TIMELINES.map((t) => (
          <button key={t.id} onClick={() => { setActiveId(t.id); setSelected(null); }}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${activeId === t.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
            {t.title.split("(")[0].trim()}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Vertical timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[28px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700" />

          <div className="space-y-3">
            {timeline.events.map((event, i) => (
              <button
                key={i}
                onClick={() => setSelected(selected === i ? null : i)}
                className={`relative w-full text-left flex gap-3 items-start group transition-all ${selected === i ? "opacity-100" : "hover:opacity-90"}`}
              >
                {/* Year dot */}
                <div
                  className={`shrink-0 w-14 h-14 rounded-full border-4 border-white dark:border-slate-900 flex flex-col items-center justify-center text-white z-10 transition-all ${selected === i ? "scale-110 shadow-lg" : "group-hover:scale-105"}`}
                  style={{ backgroundColor: event.color }}
                >
                  <div className="text-[9px] font-bold leading-none">{event.year}</div>
                  {event.month && <div className="text-[8px] opacity-80 mt-0.5">{event.month.slice(0, 3)}</div>}
                </div>

                {/* Content */}
                <div className={`flex-1 card p-3.5 transition-all ${selected === i ? "ring-2 shadow-md" : ""}`}
                  style={selected === i ? { ["--tw-ring-color" as string]: event.color } : {}}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">{event.title}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full font-medium text-white" style={{ backgroundColor: event.color }}>
                        {event.tag}
                      </span>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`shrink-0 mt-0.5 text-slate-400 transition-transform ${selected === i ? "rotate-180" : ""}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  {selected === i && (
                    <div className="mt-3 border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2">
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{event.description}</p>
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Significance</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic">{event.significance}</p>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary panel */}
        <div className="space-y-4 self-start">
          <div className="card p-5">
            <h4 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">Event Summary</h4>
            {selected !== null ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: timeline.events[selected].color }}>
                    {timeline.events[selected].year.toString().slice(-2)}
                  </div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{timeline.events[selected].title}</div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{timeline.events[selected].description}</p>
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase mb-1">Why it matters</div>
                  <p className="text-xs text-amber-800 dark:text-amber-400">{timeline.events[selected].significance}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Click any event on the timeline to see details here.</p>
            )}
          </div>

          {/* Quick stats */}
          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Timeline Stats</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="font-display font-bold text-slate-900 dark:text-slate-100 text-lg">{timeline.events.length}</div>
                <div className="text-[10px] text-slate-400">Events</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-slate-900 dark:text-slate-100 text-lg">
                  {timeline.events[timeline.events.length - 1].year - timeline.events[0].year}y
                </div>
                <div className="text-[10px] text-slate-400">Span</div>
              </div>
            </div>
            {/* Tag distribution */}
            <div className="mt-3 flex flex-wrap gap-1">
              {Array.from(new Set(timeline.events.map((e) => e.tag))).map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
