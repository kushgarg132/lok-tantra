import { create } from "zustand";
import type { LiveEvent, EventCategory } from "@/data/live";
import { EVENT_POOL } from "@/data/live";

export interface TimelineEvent extends LiveEvent {
  addedAt: number;
  seqId: number;
}

export interface ToastItem {
  seqId: number;
  event: LiveEvent;
}

interface LiveStore {
  timeline: TimelineEvent[];
  toasts: ToastItem[];
  isLive: boolean;
  poolIndex: number;
  seqCounter: number;
  filterCategory: EventCategory | "all";

  tick: () => void;
  dismissToast: (seqId: number) => void;
  toggleLive: () => void;
  setFilter: (cat: EventCategory | "all") => void;
}

function makeInitialTimeline(): TimelineEvent[] {
  const now = Date.now();
  return EVENT_POOL.slice(0, 10).map((e, i) => ({
    ...e,
    addedAt: now - (10 - i) * 10 * 60 * 1000,
    seqId: i,
  }));
}

export const useLiveStore = create<LiveStore>((set) => ({
  timeline: makeInitialTimeline(),
  toasts: [],
  isLive: true,
  poolIndex: 10,
  seqCounter: 10,
  filterCategory: "all",

  tick: () => {
    set((state) => {
      const event = EVENT_POOL[state.poolIndex % EVENT_POOL.length];
      const seqId = state.seqCounter + 1;
      const entry: TimelineEvent = { ...event, addedAt: Date.now(), seqId };
      const shouldToast = event.priority === "breaking" || event.priority === "high";
      return {
        timeline: [entry, ...state.timeline].slice(0, 60),
        toasts: shouldToast
          ? [{ seqId, event }, ...state.toasts].slice(0, 3)
          : state.toasts,
        poolIndex: (state.poolIndex + 1) % EVENT_POOL.length,
        seqCounter: seqId,
      };
    });
  },

  dismissToast: (seqId) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.seqId !== seqId) })),

  toggleLive: () => set((state) => ({ isLive: !state.isLive })),

  setFilter: (cat) => set({ filterCategory: cat }),
}));

export function timeAgo(addedAt: number, now: number = Date.now()): string {
  const diff = Math.floor((now - addedAt) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
