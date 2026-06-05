"use client";

interface QueueCounts {
  waiting?:   number;
  active?:    number;
  completed?: number;
  failed?:    number;
  delayed?:   number;
  paused?:    number;
}

interface Props {
  name:    string;
  counts:  QueueCounts;
  onRequeue: () => void;
  onDrain:   () => void;
  loading:   boolean;
}

export default function QueueHealthCard({ name, counts, onRequeue, onDrain, loading }: Props) {
  const failed  = counts.failed  ?? 0;
  const waiting = counts.waiting ?? 0;
  const active  = counts.active  ?? 0;
  const statusColor =
    failed > 100 ? "border-red-500 bg-red-950/20"   :
    failed > 20  ? "border-amber-500 bg-amber-950/20" :
    "border-slate-700 bg-slate-800/40";

  const badge = (label: string, value: number, color: string) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-semibold ${color}`}>
      {label} <span className="font-bold">{value}</span>
    </span>
  );

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 transition-colors ${statusColor}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-200 font-mono">{name}</h3>
        {failed > 0 && (
          <span className="text-xs text-red-400 font-medium">{failed} failed</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {badge("wait",   waiting,              "bg-slate-700 text-slate-300")}
        {badge("active", active,               "bg-blue-900/50 text-blue-300")}
        {badge("done",   counts.completed ?? 0,"bg-emerald-900/50 text-emerald-300")}
        {badge("fail",   failed,               failed > 0 ? "bg-red-900/50 text-red-300" : "bg-slate-700 text-slate-400")}
        {(counts.delayed ?? 0) > 0 && badge("delayed", counts.delayed!, "bg-amber-900/50 text-amber-300")}
      </div>

      <div className="flex gap-2 mt-1">
        <button
          onClick={onRequeue}
          disabled={loading || failed === 0}
          className="flex-1 px-2 py-1.5 text-xs rounded bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          Requeue failed
        </button>
        <button
          onClick={onDrain}
          disabled={loading || waiting === 0}
          className="flex-1 px-2 py-1.5 text-xs rounded bg-slate-600 hover:bg-slate-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 font-medium transition-colors"
        >
          Drain waiting
        </button>
      </div>
    </div>
  );
}
