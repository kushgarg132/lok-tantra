"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const ROLE_BADGE: Record<string, string> = {
  ADMIN:      "bg-red-900/60 text-red-300 border-red-700",
  MODERATOR:  "bg-amber-900/60 text-amber-300 border-amber-700",
  RESEARCHER: "bg-violet-900/60 text-violet-300 border-violet-700",
  USER:       "bg-slate-800 text-slate-400 border-slate-700",
};

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />;
  }

  if (!session) {
    return (
      <Link
        href="/auth/signin"
        className="px-3 py-1.5 text-sm rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition-colors"
      >
        Sign in
      </Link>
    );
  }

  const role   = (session.user as { role?: string }).role ?? "USER";
  const initials = session.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : session.user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 focus:outline-none"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold select-none">
          {initials}
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-xl p-1">
            <div className="px-3 py-2 border-b border-slate-700 mb-1">
              <div className="text-sm font-semibold text-slate-200 truncate">{session.user?.name ?? "User"}</div>
              <div className="text-xs text-slate-500 truncate">{session.user?.email}</div>
              <span className={`inline-block mt-1 px-1.5 py-0.5 rounded border text-[10px] font-semibold ${ROLE_BADGE[role] ?? ROLE_BADGE.USER}`}>
                {role}
              </span>
            </div>

            {["ADMIN", "MODERATOR"].includes(role) && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Admin Panel
              </Link>
            )}

            {["ADMIN", "MODERATOR"].includes(role) && (
              <Link
                href="/admin/moderation"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Moderation Queue
              </Link>
            )}

            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition-colors mt-1"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
