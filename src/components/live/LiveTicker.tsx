"use client";

import { useLiveStore } from "@/store/liveStore";
import { CATEGORY_META } from "@/data/live";

export function LiveTicker() {
  const timeline = useLiveStore((s) => s.timeline);
  const isLive = useLiveStore((s) => s.isLive);

  const items = timeline.slice(0, 20);

  const Separator = () => (
    <span className="mx-6 text-slate-600" aria-hidden>●</span>
  );

  const TickerContent = () => (
    <>
      {items.map((e) => (
        <span key={e.seqId} className="inline-flex items-center gap-2 shrink-0">
          <span className="shrink-0">{CATEGORY_META[e.category].icon}</span>
          <span className="text-slate-200">{e.title}</span>
          <Separator />
        </span>
      ))}
    </>
  );

  return (
    <div className="bg-slate-900 dark:bg-black text-white text-[11px] leading-none overflow-hidden select-none">
      <style>{`
        @keyframes lk-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .lk-ticker { animation: lk-scroll 100s linear infinite; }
        .lk-ticker:hover { animation-play-state: paused; }
        .lk-ticker-paused { animation-play-state: paused !important; }
      `}</style>
      <div className="flex items-stretch">
        {/* Live badge */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-red-600 font-bold text-xs uppercase tracking-widest z-10">
          <span
            className={`w-2 h-2 rounded-full bg-white ${isLive ? "animate-pulse" : "opacity-40"}`}
          />
          {isLive ? "LIVE" : "PAUSED"}
        </div>

        {/* Scrolling content */}
        <div className="overflow-hidden flex-1 py-2.5 min-w-0">
          <div className={`lk-ticker whitespace-nowrap inline-flex ${!isLive ? "lk-ticker-paused" : ""}`}>
            <TickerContent />
            <TickerContent />
          </div>
        </div>
      </div>
    </div>
  );
}
