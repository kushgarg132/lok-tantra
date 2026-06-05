"use client";

import { useState, useRef, useEffect } from "react";
import { DONATION_SECTOR_FLOWS } from "@/data/funding";

// ─── Party palette ────────────────────────────────────────────────────────────

const PARTY_COLORS: Record<string, string> = {
  BJP:    "#f97316",
  TMC:    "#22c55e",
  INC:    "#3b82f6",
  BRS:    "#eab308",
  BJD:    "#06b6d4",
  DMK:    "#ef4444",
  Others: "#94a3b8",
};

const ALL_PARTIES = ["BJP", "TMC", "INC", "BRS", "BJD", "DMK", "Others"];

// ─── Sankey layout helpers ────────────────────────────────────────────────────

const SVG_W = 620;
const SVG_H = 380;
const LEFT_X = 155;
const RIGHT_X = 465;
const NODE_W = 14;
const PAD = 6;

interface LayoutNode {
  id: string;
  label: string;
  color: string;
  y: number;
  h: number;
  total: number;
}

interface LayoutEdge {
  srcId: string;
  dstId: string;
  srcY: number;  // absolute y start on source node
  dstY: number;  // absolute y start on dest node
  h: number;
  color: string;
  amountCr: number;
}

function buildLayout(sectorFilter: string | null, partyFilter: string | null) {
  const TOTAL_H = SVG_H - 40;

  // Filter data
  const sectors = DONATION_SECTOR_FLOWS.filter((s) => !sectorFilter || s.sector === sectorFilter);

  // Compute party totals from filtered sectors
  const partyTotals: Record<string, number> = {};
  for (const s of sectors) {
    for (const f of s.partyFlows) {
      if (!partyFilter || f.party === partyFilter) {
        partyTotals[f.party] = (partyTotals[f.party] ?? 0) + f.amountCr;
      }
    }
  }

  const totalAmount = sectors.reduce((a, s) => a + s.partyFlows.filter((f) => !partyFilter || f.party === partyFilter).reduce((b, f) => b + f.amountCr, 0), 0);
  if (totalAmount === 0) return { leftNodes: [], rightNodes: [], edges: [] };

  // Layout left nodes (sectors)
  const leftNodes: LayoutNode[] = [];
  let y = 20;
  for (const s of sectors) {
    const filteredTotal = s.partyFlows.filter((f) => !partyFilter || f.party === partyFilter).reduce((a, f) => a + f.amountCr, 0);
    if (filteredTotal === 0) continue;
    const h = Math.max(16, (filteredTotal / totalAmount) * TOTAL_H) - PAD;
    leftNodes.push({ id: s.sector, label: s.sector, color: s.color, y, h, total: filteredTotal });
    y += h + PAD;
  }

  // Layout right nodes (parties)
  const rightNodes: LayoutNode[] = [];
  y = 20;
  const sortedParties = ALL_PARTIES.filter((p) => partyTotals[p] && (!partyFilter || p === partyFilter));
  for (const p of sortedParties) {
    const total = partyTotals[p] ?? 0;
    const h = Math.max(16, (total / totalAmount) * TOTAL_H) - PAD;
    rightNodes.push({ id: p, label: p, color: PARTY_COLORS[p] ?? "#94a3b8", y, h, total });
    y += h + PAD;
  }

  // Build edges
  const edges: LayoutEdge[] = [];
  const srcOffsets: Record<string, number> = {};
  const dstOffsets: Record<string, number> = {};

  for (const s of sectors) {
    const srcNode = leftNodes.find((n) => n.id === s.sector);
    if (!srcNode) continue;

    for (const f of s.partyFlows) {
      if (partyFilter && f.party !== partyFilter) continue;
      const dstNode = rightNodes.find((n) => n.id === f.party);
      if (!dstNode) continue;

      const edgeH = Math.max(1, (f.amountCr / totalAmount) * TOTAL_H);
      const srcY = srcNode.y + (srcOffsets[s.sector] ?? 0);
      const dstY = dstNode.y + (dstOffsets[f.party] ?? 0);

      edges.push({
        srcId: s.sector, dstId: f.party,
        srcY, dstY, h: edgeH,
        color: s.color, amountCr: f.amountCr,
      });

      srcOffsets[s.sector] = (srcOffsets[s.sector] ?? 0) + edgeH;
      dstOffsets[f.party] = (dstOffsets[f.party] ?? 0) + edgeH;
    }
  }

  return { leftNodes, rightNodes, edges };
}

// ─── Bezier path for an edge ──────────────────────────────────────────────────

function edgePath(edge: LayoutEdge): string {
  const x1 = LEFT_X + NODE_W;
  const x2 = RIGHT_X;
  const cy1 = edge.srcY + edge.h / 2;
  const cy2 = edge.dstY + edge.h / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${edge.srcY} C ${mx} ${edge.srcY}, ${mx} ${edge.dstY}, ${x2} ${edge.dstY} L ${x2} ${edge.dstY + edge.h} C ${mx} ${edge.dstY + edge.h}, ${mx} ${edge.srcY + edge.h}, ${x1} ${edge.srcY + edge.h} Z`;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DonationFlowPanel() {
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [partyFilter, setPartyFilter] = useState<string | null>(null);
  const [hovered, setHovered] = useState<{ label: string; amountCr: number; src: string; dst: string } | null>(null);
  const [view, setView] = useState<"sankey" | "matrix">("sankey");

  const { leftNodes, rightNodes, edges } = buildLayout(sectorFilter, partyFilter);

  const totalCr = DONATION_SECTOR_FLOWS
    .filter((s) => !sectorFilter || s.sector === sectorFilter)
    .reduce((a, s) => a + s.partyFlows.filter((f) => !partyFilter || f.party === partyFilter).reduce((b, f) => b + f.amountCr, 0), 0);

  return (
    <div className="space-y-5">
      {/* Explainer */}
      <div className="card p-4 border-l-4 border-blue-400 bg-blue-50/40 dark:bg-blue-950/10">
        <div className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">Political funding — the money trail</div>
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          This visualises the flow of corporate donations from industrial sectors to political parties, based on electoral bond data and ADR-tracked direct donations. The width of each flow is proportional to the amount donated. <strong>Source:</strong> SBI (SC-mandated disclosure, 2024), ADR political funding database.
        </p>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        <button onClick={() => setView("sankey")} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${view === "sankey" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>Flow diagram</button>
        <button onClick={() => setView("matrix")} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${view === "matrix" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>Matrix view</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-[10px] text-slate-400">Sector:</span>
          {["All", ...DONATION_SECTOR_FLOWS.map((s) => s.sector)].map((s) => (
            <button key={s} onClick={() => setSectorFilter(s === "All" ? null : s)}
              className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${(s === "All" && !sectorFilter) || sectorFilter === s ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
              {s === "All" ? "All" : s.split(" ")[0]}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap items-center ml-auto">
          <span className="text-[10px] text-slate-400">Party:</span>
          {["All", ...ALL_PARTIES].map((p) => (
            <button key={p} onClick={() => setPartyFilter(p === "All" ? null : p)}
              className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${(p === "All" && !partyFilter) || partyFilter === p ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Total badge */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500">Showing:</span>
        <span className="font-display font-bold text-slate-900 dark:text-slate-100">₹{totalCr.toLocaleString("en-IN")} crore</span>
        {(sectorFilter || partyFilter) && (
          <button onClick={() => { setSectorFilter(null); setPartyFilter(null); }} className="text-indigo-500 underline">Reset filters</button>
        )}
      </div>

      {/* ── Sankey view ── */}
      {view === "sankey" && (
        <div className="card p-4 overflow-x-auto">
          {/* Hover tooltip */}
          {hovered && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs inline-flex gap-2 items-center">
              <span className="font-bold">{hovered.src}</span>
              <span className="text-slate-400 dark:text-slate-500">→</span>
              <span className="font-bold">{hovered.dst}</span>
              <span className="text-slate-300 dark:text-slate-600">₹{hovered.amountCr.toLocaleString("en-IN")} cr</span>
            </div>
          )}

          <svg width={SVG_W} height={SVG_H} className="overflow-visible min-w-[400px]">
            {/* Edges (flows) */}
            {edges.map((edge, i) => (
              <path key={i} d={edgePath(edge)}
                fill={edge.color} opacity={hovered ? (hovered.src === edge.srcId && hovered.dst === edge.dstId ? 0.7 : 0.12) : 0.35}
                className="transition-opacity cursor-pointer"
                onMouseEnter={() => setHovered({ label: `${edge.srcId} → ${edge.dstId}`, amountCr: edge.amountCr, src: edge.srcId, dst: edge.dstId })}
                onMouseLeave={() => setHovered(null)} />
            ))}

            {/* Left nodes (sectors) */}
            {leftNodes.map((node) => (
              <g key={node.id}>
                <rect x={LEFT_X} y={node.y} width={NODE_W} height={node.h} fill={node.color} rx={3}
                  className="cursor-pointer"
                  onClick={() => setSectorFilter(node.id === sectorFilter ? null : node.id)}
                  opacity={sectorFilter && node.id !== sectorFilter ? 0.3 : 1} />
                <text x={LEFT_X - 6} y={node.y + node.h / 2 + 4} textAnchor="end"
                  fill="currentColor" style={{ fontSize: "9px" }} className="text-slate-600 dark:text-slate-400 pointer-events-none">
                  {node.label.split(" ")[0]}
                </text>
                <text x={LEFT_X - 6} y={node.y + node.h / 2 + 14} textAnchor="end"
                  fill="#94a3b8" style={{ fontSize: "8px" }} className="pointer-events-none">
                  ₹{(node.total / 100).toFixed(0)}B
                </text>
              </g>
            ))}

            {/* Right nodes (parties) */}
            {rightNodes.map((node) => (
              <g key={node.id}>
                <rect x={RIGHT_X} y={node.y} width={NODE_W} height={node.h} fill={node.color} rx={3}
                  className="cursor-pointer"
                  onClick={() => setPartyFilter(node.id === partyFilter ? null : node.id)}
                  opacity={partyFilter && node.id !== partyFilter ? 0.3 : 1} />
                <text x={RIGHT_X + NODE_W + 6} y={node.y + node.h / 2 + 4} textAnchor="start"
                  fill={node.color} style={{ fontSize: "9px", fontWeight: 600 }} className="pointer-events-none">
                  {node.label}
                </text>
                <text x={RIGHT_X + NODE_W + 6} y={node.y + node.h / 2 + 14} textAnchor="start"
                  fill="#94a3b8" style={{ fontSize: "8px" }} className="pointer-events-none">
                  ₹{(node.total / 100).toFixed(0)}B
                </text>
              </g>
            ))}

            {/* Header labels */}
            <text x={LEFT_X + NODE_W / 2} y={12} textAnchor="middle" fill="#94a3b8" style={{ fontSize: "9px", fontWeight: 600 }}>DONORS</text>
            <text x={RIGHT_X + NODE_W / 2} y={12} textAnchor="middle" fill="#94a3b8" style={{ fontSize: "9px", fontWeight: 600 }}>PARTIES</text>
          </svg>

          <div className="mt-3 text-[10px] text-slate-400">
            Click a sector or party node to filter. Hover flows to see exact amounts.
          </div>
        </div>
      )}

      {/* ── Matrix view ── */}
      {view === "matrix" && (
        <div className="card p-4 overflow-x-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Sector × Party Matrix (₹ crore)</div>
          <table className="text-[10px] w-full border-collapse min-w-[500px]">
            <thead>
              <tr>
                <th className="text-left py-2 pr-3 text-slate-400 font-medium w-36">Sector</th>
                {ALL_PARTIES.map((p) => (
                  <th key={p} className="text-center px-2 py-2 font-semibold" style={{ color: PARTY_COLORS[p] }}>{p}</th>
                ))}
                <th className="text-right px-2 py-2 text-slate-400 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {DONATION_SECTOR_FLOWS.map((sector) => {
                const flowMap: Record<string, number> = {};
                sector.partyFlows.forEach((f) => { flowMap[f.party] = f.amountCr; });
                const max = Math.max(...sector.partyFlows.map((f) => f.amountCr));
                return (
                  <tr key={sector.sector} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-2 pr-3 font-medium text-slate-700 dark:text-slate-300">{sector.sector}</td>
                    {ALL_PARTIES.map((p) => {
                      const amt = flowMap[p] ?? 0;
                      const intensity = amt ? (amt / max) : 0;
                      return (
                        <td key={p} className="text-center px-1 py-1.5">
                          {amt > 0 ? (
                            <div className="mx-auto rounded text-white font-mono px-1.5 py-0.5 text-center"
                              style={{ backgroundColor: PARTY_COLORS[p], opacity: 0.3 + intensity * 0.7 }}>
                              <span style={{ color: intensity > 0.5 ? "white" : "#1e293b" }}>{amt.toLocaleString("en-IN")}</span>
                            </div>
                          ) : <span className="text-slate-300 dark:text-slate-700">—</span>}
                        </td>
                      );
                    })}
                    <td className="text-right px-2 font-bold text-slate-700 dark:text-slate-300">₹{sector.totalCr.toLocaleString("en-IN")}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                <td className="py-2 font-bold text-slate-700 dark:text-slate-300">Total</td>
                {ALL_PARTIES.map((p) => {
                  const total = DONATION_SECTOR_FLOWS.reduce((a, s) => a + (s.partyFlows.find((f) => f.party === p)?.amountCr ?? 0), 0);
                  return (
                    <td key={p} className="text-center px-2 py-2 font-bold" style={{ color: PARTY_COLORS[p] }}>
                      {total > 0 ? `₹${total.toLocaleString("en-IN")}` : "—"}
                    </td>
                  );
                })}
                <td className="text-right font-bold text-slate-700 dark:text-slate-300">
                  ₹{DONATION_SECTOR_FLOWS.reduce((a, s) => a + s.totalCr, 0).toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="mt-2 text-[9px] text-slate-400">Amounts in ₹ crore. Darker shading = higher flow relative to sector maximum.</div>
        </div>
      )}
    </div>
  );
}
