"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { NAVIGATION } from "@/lib/constants";

export function MobileSidebar() {
  const { sidebarOpen, toggleSidebar } = useStore();

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleSidebar} />
      <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl animate-slide-in-right overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="font-display font-bold text-lg">
            Lok<span className="text-saffron-500">Tantra</span>
          </span>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-6">
          {NAVIGATION.map((section) => (
            <div key={section.label}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                {section.label}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={toggleSidebar}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500">
                      {item.icon.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
