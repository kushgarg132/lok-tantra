"use client";

import { useEffect } from "react";
import { useLiveStore, type ToastItem } from "@/store/liveStore";
import { CATEGORY_META, PRIORITY_META } from "@/data/live";

function ToastCard({ item }: { item: ToastItem }) {
  const dismissToast = useLiveStore((s) => s.dismissToast);
  const cat = CATEGORY_META[item.event.category];
  const pri = PRIORITY_META[item.event.priority];

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(item.seqId), 7_000);
    return () => clearTimeout(timer);
  }, [item.seqId, dismissToast]);

  return (
    <div
      className={`rounded-xl border shadow-xl p-3.5 ${cat.bg} ${cat.border} pointer-events-auto cursor-pointer max-w-xs w-full`}
      onClick={() => dismissToast(item.seqId)}
    >
      <div className="flex items-start gap-2.5">
        {/* Priority dot */}
        <div className="mt-1 shrink-0">
          <span className={`inline-block w-2 h-2 rounded-full ${pri.dot}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base leading-none">{cat.icon}</span>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${cat.color}`}>
              {cat.label}
            </span>
            {item.event.priority === "breaking" && (
              <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest animate-pulse">
                Breaking
              </span>
            )}
          </div>
          <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
            {item.event.title}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {item.event.source}
          </p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); dismissToast(item.seqId); }}
          className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mt-0.5"
          aria-label="Dismiss"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${cat.dot} rounded-full`}
          style={{ animation: "toast-drain 7s linear forwards" }}
        />
      </div>
      <style>{`@keyframes toast-drain { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}

export function NotificationToast() {
  const toasts = useLiveStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastCard key={t.seqId} item={t} />
      ))}
    </div>
  );
}
