"use client";

import { useState } from "react";
import { INFLUENCE_NODES, INFLUENCE_EDGES } from "@/data/funding";
import type { InfluenceNode } from "@/data/funding";

// ─── Pre-calculated SVG layout positions ─────────────────────────────────────

const SVG_W = 720;
const SVG_H = 480;

// Column x-centres
const COL_X: Record<"donor" | "party" | "policy", number> = {
  donor:  120,
  party:  360,
  policy: 600,
};

// Node sizes (radius)
const maxNodeSize = Math.max(...INFLUENCE_NODES.map((n) => n.size));

function nodeRadius(n: InfluenceNode): number {
  return 16 + (n.size / maxNodeSize) * 28;
}

// Pre-calculated y positions for each column
const DONOR_IDS  = ["infra-sector", "mining-sector", "gaming-sector", "finance-sector", "pharma-sector"];
const PARTY_IDS  = ["bjp", "tmc", "inc", "brs", "bjd"];
const POLICY_IDS = ["infra-contracts", "mining-policy", "drug-pricing", "banking-regs", "gaming-regs"];

function columnY(ids: string[], idx: number): number {
  const spacing = SVG_H / (ids.length + 1);
  return spacing * (idx + 1);
}

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {};
DONOR_IDS.forEach((id, i)  => { NODE_POSITIONS[id] = { x: COL_X.donor,  y: columnY(DONOR_IDS,  i) }; });
PARTY_IDS.forEach((id, i)  => { NODE_POSITIONS[id] = { x: COL_X.party,  y: columnY(PARTY_IDS,  i) }; });
POLICY_IDS.forEach((id, i) => { NODE_POSITIONS[id] = { x: COL_X.policy, y: columnY(POLICY_IDS, i) }; });

const MAX_EDGE_AMOUNT = Math.max(...INFLUENCE_EDGES.map((e) => e.amountCr));

function edgeWidth(amountCr: number): number {
  return 1 + (amountCr / MAX_EDGE_AMOUNT) * 8;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InfluenceMapPanel() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "donor" | "party" | "policy">("all");

  const node = INFLUENCE_NODES.find((n) => n.id === selectedNode) ?? null;

  const connectedEdges = selectedNode
    ? INFLUENCE_EDGES.filter((e) => e.source === selectedNode || e.target === selectedNode)
    : INFLUENCE_EDGES;

  const connectedIds = new Set(connectedEdges.flatMap((e) => [e.source, e.target]));

  function isNodeVisible(id: string): boolean {
    if (!selectedNode) return true;
    return connectedIds.has(id) || id === selectedNode;
  }

  function isEdgeVisible(srcId: string, dstId: string): boolean {
    if (filterType !== "all") {
      const srcNode = INFLUENCE_NODES.find((n) => n.id === srcId);
      const dstNode = INFLUENCE_NODES.find((n) => n.id === dstId);
      if (filterType === "donor" && srcNode?.type !== "donor") return false;
      if (filterType === "policy" && dstNode?.type !== "policy") return false;
    }
    if (!selectedNode) return true;
    return srcId === selectedNode || dstId === selectedNode;
  }

  const totalDonorAmount = INFLUENCE_EDGES
    .filter((e) => {
      const src = INFLUENCE_NODES.find((n) => n.id === e.source);
      return src?.type === "donor";
    })
    .reduce((a, e) => a + e.amountCr, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-4 border-l-4 border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/10">
        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">Influence flow: Money → Power → Policy</div>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
          This network maps how corporate donations (via electoral bonds + direct contributions) flow to political parties and potentially shape regulatory and policy decisions in those sectors. <strong>Node size</strong> is proportional to donation amount. <strong>Edge width</strong> is proportional to flow. The connections between party receipts and policy domains are based on publicly known policy decisions and investigative journalism. Correlation is mapped — causation requires independent proof.
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-[10px] text-slate-400">Filter connections:</span>
        {(["all", "donor", "party", "policy"] as const).map((f) => (
          <button key={f} onClick={() => setFilterType(f)}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${filterType === f ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
            {f === "all" ? "All flows" : f === "donor" ? "Donor → Party" : f === "party" ? "Party flows" : "Party → Policy"}
          </button>
        ))}
        {selectedNode && (
          <button onClick={() => setSelectedNode(null)} className="ml-auto text-xs text-indigo-500 underline">
            Clear selection
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        {/* SVG Map */}
        <div className="card p-4 overflow-x-auto">
          <svg width={SVG_W} height={SVG_H} className="overflow-visible min-w-[400px]">
            {/* Column labels */}
            {(["CORPORATE DONORS", "POLITICAL PARTIES", "POLICY DOMAINS"] as const).map((label, i) => (
              <text key={label}
                x={[COL_X.donor, COL_X.party, COL_X.policy][i]}
                y={18} textAnchor="middle"
                fill="#94a3b8" style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
              </text>
            ))}

            {/* Edges */}
            {INFLUENCE_EDGES.map((edge) => {
              if (!isEdgeVisible(edge.source, edge.target)) return null;
              const src = NODE_POSITIONS[edge.source];
              const dst = NODE_POSITIONS[edge.target];
              if (!src || !dst) return null;
              const srcNode = INFLUENCE_NODES.find((n) => n.id === edge.source)!;
              const dstNode = INFLUENCE_NODES.find((n) => n.id === edge.target)!;
              const srcR = nodeRadius(srcNode);
              const dstR = nodeRadius(dstNode);
              const x1 = src.x + srcR;
              const x2 = dst.x - dstR;
              const mx = (x1 + x2) / 2;
              const edgeKey = `${edge.source}-${edge.target}`;
              const isHovered = hoveredEdge === edgeKey;
              const isDimmed = selectedNode && !connectedIds.has(edge.source) && !connectedIds.has(edge.target);

              return (
                <g key={edgeKey}>
                  <path
                    d={`M ${x1} ${src.y} C ${mx} ${src.y}, ${mx} ${dst.y}, ${x2} ${dst.y}`}
                    fill="none"
                    stroke={srcNode.color}
                    strokeWidth={isHovered ? edgeWidth(edge.amountCr) + 2 : edgeWidth(edge.amountCr)}
                    opacity={isDimmed ? 0.08 : isHovered ? 0.85 : 0.3}
                    className="transition-opacity cursor-pointer"
                    onMouseEnter={() => setHoveredEdge(edgeKey)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                  {isHovered && (
                    <text x={mx} y={Math.min(src.y, dst.y) - 6} textAnchor="middle"
                      fill={srcNode.color} style={{ fontSize: "8px", fontWeight: 600 }}>
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {INFLUENCE_NODES.map((n) => {
              const pos = NODE_POSITIONS[n.id];
              if (!pos) return null;
              const r = nodeRadius(n);
              const isDimmed = selectedNode && !isNodeVisible(n.id);
              const isSelected = selectedNode === n.id;
              const shape = n.type === "policy" ? "diamond" : "circle";

              return (
                <g key={n.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(isSelected ? null : n.id)}
                  opacity={isDimmed ? 0.15 : 1}>
                  {shape === "diamond" ? (
                    <polygon
                      points={`${pos.x},${pos.y - r} ${pos.x + r * 0.8},${pos.y} ${pos.x},${pos.y + r} ${pos.x - r * 0.8},${pos.y}`}
                      fill={n.color}
                      stroke={isSelected ? "white" : "none"}
                      strokeWidth={3}
                      className="transition-all"
                    />
                  ) : (
                    <circle
                      cx={pos.x} cy={pos.y} r={r}
                      fill={n.color}
                      stroke={isSelected ? "white" : "none"}
                      strokeWidth={3}
                      className="transition-all"
                    />
                  )}
                  <text x={pos.x} y={pos.y + 3} textAnchor="middle"
                    fill="white" style={{ fontSize: "8px", fontWeight: 700, pointerEvents: "none" }}>
                    {n.label.split("\n")[0]}
                  </text>
                  {n.label.includes("\n") && (
                    <text x={pos.x} y={pos.y + 13} textAnchor="middle"
                      fill="white" style={{ fontSize: "7px", opacity: 0.85, pointerEvents: "none" }}>
                      {n.label.split("\n")[1]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="mt-3 flex gap-4 text-[10px] text-slate-400 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />Circles = donors/parties</span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 12,6 6,12 0,6" fill="#94a3b8" /></svg>Diamonds = policy domains
            </span>
            <span>Edge width ∝ ₹ amount · Click a node to highlight connections</span>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          {/* Selected node detail */}
          {node ? (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: node.color }}>
                  {node.type === "donor" ? "₹" : node.type === "party" ? "🏛" : "⚙"}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{node.label.replace("\n", " ")}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{node.type}</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{node.detail}</p>
              {node.type === "party" && (
                <div className="text-xs">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Received from:</div>
                  {INFLUENCE_EDGES.filter((e) => e.target === node.id && INFLUENCE_NODES.find((n2) => n2.id === e.source)?.type === "donor").map((e) => {
                    const src = INFLUENCE_NODES.find((n2) => n2.id === e.source);
                    return src ? (
                      <div key={e.source} className="flex justify-between text-[10px] py-0.5">
                        <span className="text-slate-500 truncate">{src.label.replace("\n", " ")}</span>
                        <strong className="text-slate-700 dark:text-slate-300 shrink-0 ml-2">{e.label}</strong>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
              {node.type === "donor" && (
                <div className="text-xs">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Donated to:</div>
                  {INFLUENCE_EDGES.filter((e) => e.source === node.id).map((e) => {
                    const dst = INFLUENCE_NODES.find((n2) => n2.id === e.target);
                    return dst ? (
                      <div key={e.target} className="flex justify-between text-[10px] py-0.5">
                        <span className="font-medium" style={{ color: dst.color }}>{dst.label.replace("\n", " ")}</span>
                        <strong className="text-slate-700 dark:text-slate-300 ml-2">{e.label}</strong>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="card p-4">
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Network Summary</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Total mapped flows</span><strong>₹{(totalDonorAmount / 100).toFixed(0)}B cr</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Donor sectors</span><strong>{DONOR_IDS.length}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Political parties</span><strong>{PARTY_IDS.length}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Policy domains</span><strong>{POLICY_IDS.length}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Connections</span><strong>{INFLUENCE_EDGES.length}</strong></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                Click any node to highlight its connections and see detail.
              </p>
            </div>
          )}

          {/* Top flows */}
          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Largest Flows</div>
            <div className="space-y-1.5">
              {[...INFLUENCE_EDGES]
                .filter((e) => {
                  const src = INFLUENCE_NODES.find((n2) => n2.id === e.source);
                  return src?.type === "donor";
                })
                .sort((a, b) => b.amountCr - a.amountCr)
                .slice(0, 6)
                .map((e) => {
                  const src = INFLUENCE_NODES.find((n2) => n2.id === e.source)!;
                  const dst = INFLUENCE_NODES.find((n2) => n2.id === e.target)!;
                  return (
                    <div key={`${e.source}-${e.target}`} className="flex items-center gap-2 text-[10px]">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                      <span className="text-slate-500 truncate">{src.label.split("\n")[0]}</span>
                      <span className="text-slate-300 dark:text-slate-600 shrink-0">→</span>
                      <span className="font-medium shrink-0" style={{ color: dst.color }}>{dst.label}</span>
                      <span className="ml-auto font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">₹{e.amountCr.toLocaleString("en-IN")}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="card p-3 bg-slate-50 dark:bg-slate-800/60">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              <strong>Note:</strong> Party → Policy connections are analytical — they reflect publicly documented decisions (contracts awarded, regulations issued) in sectors that were top donors. They do not establish illegal quid pro quo. Source: ADR, CAG reports, investigative journalism (The Wire, Indian Express, Scroll).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
