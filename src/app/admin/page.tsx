import Link from "next/link";

export const metadata = { title: "Admin — LokTantra" };

const CARDS = [
  {
    href:  "/admin/moderation",
    title: "Moderation",
    desc:  "Review flagged content, resolve inaccuracy reports, and view the full audit log.",
    icon:  "🛡",
    color: "border-red-700/50 hover:border-red-600",
  },
  {
    href:  "/admin/observability",
    title: "Observability",
    desc:  "Scraper health, ETL runs, queue depths, alerts, logs, and data freshness monitoring.",
    icon:  "📊",
    color: "border-orange-700/50 hover:border-orange-600",
  },
  {
    href:  "/api/admin/queues",
    title: "Bull Board",
    desc:  "Low-level BullMQ queue inspector — view, retry, and remove individual jobs.",
    icon:  "🐂",
    color: "border-blue-700/50 hover:border-blue-600",
    external: true,
  },
  {
    href:  "/api/admin/observability/diagnostics",
    title: "System Diagnostics",
    desc:  "One-shot health check for Redis, PostgreSQL, ElasticSearch, queues, and data freshness.",
    icon:  "🩺",
    color: "border-emerald-700/50 hover:border-emerald-600",
    external: true,
  },
  {
    href:  "/api/search/index",
    title: "Search Index Health",
    desc:  "Check ElasticSearch index status. POST with bearer token to trigger full reindex.",
    icon:  "🔍",
    color: "border-violet-700/50 hover:border-violet-600",
    external: true,
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Internal tools for monitoring, data ingestion, and system health.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noreferrer" : undefined}
              className={`rounded-xl border bg-slate-900/60 p-5 flex gap-4 items-start transition-colors group ${c.color}`}
            >
              <span className="text-2xl mt-0.5 flex-shrink-0">{c.icon}</span>
              <div>
                <div className="font-semibold text-slate-200 group-hover:text-white transition-colors flex items-center gap-1">
                  {c.title}
                  {c.external && <span className="text-xs text-slate-500">↗</span>}
                </div>
                <p className="text-sm text-slate-500 mt-1 leading-snug">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-xs text-slate-600">
          <strong className="text-slate-500">API endpoints:</strong>
          <ul className="mt-2 space-y-1 font-mono">
            <li>GET  /api/admin/observability — dashboard snapshot</li>
            <li>GET  /api/admin/observability/diagnostics — system checks</li>
            <li>POST /api/admin/observability/recovery — requeue / drain</li>
            <li>GET  /api/moderation/queue — pending flags (requires MODERATOR)</li>
            <li>PATCH /api/moderation/queue — resolve flag</li>
            <li>POST /api/moderation/flag — submit a flag (any user)</li>
            <li>GET  /api/admin/audit — query audit log (requires ADMIN)</li>
            <li>GET  /api/sources/verify?url= — verify source credibility</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
