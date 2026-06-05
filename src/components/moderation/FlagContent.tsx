"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type FlagReason = "INACCURATE" | "POLITICALLY_BIASED" | "MISLEADING" | "MISSING_SOURCE" | "OUTDATED" | "INAPPROPRIATE" | "OTHER";

const REASONS: { value: FlagReason; label: string }[] = [
  { value: "INACCURATE",        label: "Factually inaccurate" },
  { value: "POLITICALLY_BIASED",label: "Politically biased" },
  { value: "MISLEADING",        label: "Misleading or deceptive" },
  { value: "MISSING_SOURCE",    label: "Missing source / citation" },
  { value: "OUTDATED",          label: "Outdated information" },
  { value: "INAPPROPRIATE",     label: "Inappropriate content" },
  { value: "OTHER",             label: "Other" },
];

interface Props {
  contentType:    string;
  contentId:      string;
  contentSnippet?: string;
  className?:     string;
}

export default function FlagContent({ contentType, contentId, contentSnippet, className }: Props) {
  const { status } = useSession();
  const [open,    setOpen]    = useState(false);
  const [reason,  setReason]  = useState<FlagReason>("INACCURATE");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);

    const res = await fetch("/api/moderation/flag", {
      method:  "POST",
      headers: { "content-type": "application/json" },
      body:    JSON.stringify({ contentType, contentId, reason, details, contentSnippet }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to submit report.");
    } else {
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); }, 2500);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <span className={`text-xs text-emerald-400 ${className}`}>
        ✓ Report submitted
      </span>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
        title="Report inaccuracy"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Report
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-8 z-50 w-72 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-4">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">Report inaccuracy</h3>

            {status === "unauthenticated" && (
              <p className="text-xs text-slate-500 mb-3 rounded bg-slate-800 p-2">
                You&apos;re reporting as a guest. <a href="/auth/signin" className="text-orange-400 hover:underline">Sign in</a> to track your reports.
              </p>
            )}

            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as FlagReason)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1.5"
                >
                  {REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Details (optional)</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="What's wrong? Please be specific…"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1.5 resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-1.5 text-xs rounded bg-orange-700 hover:bg-orange-600 disabled:opacity-50 text-white font-medium transition-colors"
                >
                  {loading ? "Sending…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
