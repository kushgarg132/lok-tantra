"use client";

import { useState, useMemo } from "react";
import { GRAPH_NODES, GRAPH_EDGES, CASE_CATEGORY_CONFIG, type GraphNode } from "@/data/judiciary/intelligence";

const W = 760;
const H = 420;
const NODE_R: Record<GraphNode["size"], number> = { xl: 22, lg: 16, md: 12, sm: 8 };

// Cubic bezier control point offset for edge curves
function edgePath(from: GraphNode, to: GraphNode): string {
  const x1 = from.x, y1 = from.y;
  const x2 = to.x, y2 = to.y;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 30;
  return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
}

// Arrow head along the bezier at the endpoint direction
function arrowHead(from: GraphNode, to: GraphNode, r: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  // Offset back from node edge
  const ax = to.x - ux * (r + 4);
  const ay = to.y - uy * (r + 4);
  // Arrow perpendicular
  const px = -uy * 5, py = ux * 5;
  return `M ${ax - ux * 10} ${ay - uy * 10} L ${ax + px} ${ay + py} L ${ax} ${ay} L ${ax - px} ${ay - py} Z`;
}

export function JudgmentGraphPanel() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const activeId = selected || hovered;

  // Compute connected edges for highlighting
  const connectedIds = useMemo(() => {
    if (!activeId) return new Set<string>();
    const ids = new Set<string>();
    GRAPH_EDGES.forEach((e) => {
      if (e.from === activeId || e.to === activeId) {
        ids.add(e.from);
        ids.add(e.to);
      }
    });
    return ids;
  }, [activeId]);

  const activeCase = activeId ? GRAPH_NODES.find((n) => n.id === activeId) : null;
  const activeCaseData = activeId
    ? { node: activeCase!, edges: GRAPH_EDGES.filter((e) => e.from === activeId || e.to === activeId) }
    : null;

  const nodeById = useMemo(() => {
    const m: Record<string, GraphNode> = {};
    GRAPH_NODES.forEach((n) => { m[n.id] = n; });
    return m;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">Judgment Citation Network</h3>
        <span className="text-xs text-slate-400">Arrows show influence — click/hover a case to highlight connections</span>
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(CASE_CATEGORY_CONFIG) as [string, typeof CASE_CATEGORY_CONFIG[keyof typeof CASE_CATEGORY_CONFIG]][]).map(([key, cfg]) => {
          const hasNode = GRAPH_NODES.some((n) => n.category === key);
          if (!hasNode) return null;
          return (
            <span key={key} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.text}`}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
              {cfg.label}
            </span>
          );
        })}
      </div>

      {/* SVG graph */}
      <div className="card overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 520 }}>
          {/* Background timeline markers */}
          {[1950, 1960, 1970, 1980, 1990, 2000, 2010, 2018].map((yr) => {
            const x = 40 + ((yr - 1950) / 70) * 680;
            return (
              <g key={yr}>
                <line x1={x} y1={20} x2={x} y2={H - 20} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
                <text x={x} y={H - 8} textAnchor="middle" fontSize="8" fill="#94a3b8">{yr}</text>
              </g>
            );
          })}

          {/* Edges */}
          {GRAPH_EDGES.map((edge, i) => {
            const from = nodeById[edge.from];
            const to = nodeById[edge.to];
            if (!from || !to) return null;
            const isActive = activeId && (edge.from === activeId || edge.to === activeId);
            const r = NODE_R[to.size];
            const catColor = CASE_CATEGORY_CONFIG[from.category]?.color || "#94a3b8";
            return (
              <g key={i} opacity={activeId && !isActive ? 0.08 : isActive ? 0.9 : 0.35}>
                <path
                  d={edgePath(from, to)}
                  fill="none"
                  stroke={catColor}
                  strokeWidth={isActive ? 2 : 1.2}
                />
                <path
                  d={arrowHead(from, to, r)}
                  fill={catColor}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {GRAPH_NODES.map((node) => {
            const r = NODE_R[node.size];
            const catCfg = CASE_CATEGORY_CONFIG[node.category];
            const isActive = node.id === activeId;
            const isConnected = connectedIds.has(node.id);
            const isDimmed = activeId && !isActive && !isConnected;
            const lines = node.label.split("\n");
            return (
              <g
                key={node.id}
                onClick={() => setSelected(selected === node.id ? null : node.id)}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
                opacity={isDimmed ? 0.15 : 1}
              >
                {/* Selection ring */}
                {isActive && (
                  <circle cx={node.x} cy={node.y} r={r + 5} fill="none" stroke={catCfg.color} strokeWidth="2" opacity="0.4" />
                )}
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill={catCfg.color}
                  opacity={node.overruled ? 0.45 : 1}
                  stroke={node.overruled ? "#dc2626" : "white"}
                  strokeWidth={node.overruled ? "1.5" : "1"}
                  strokeDasharray={node.overruled ? "3 2" : undefined}
                />
                {/* Overruled X mark */}
                {node.overruled && (
                  <g>
                    <line x1={node.x - r * 0.4} y1={node.y - r * 0.4} x2={node.x + r * 0.4} y2={node.y + r * 0.4} stroke="#dc2626" strokeWidth="1.5" />
                    <line x1={node.x + r * 0.4} y1={node.y - r * 0.4} x2={node.x - r * 0.4} y2={node.y + r * 0.4} stroke="#dc2626" strokeWidth="1.5" />
                  </g>
                )}
                {/* Label */}
                {(node.size === "xl" || node.size === "lg" || isActive) && (
                  <text
                    x={node.x}
                    y={node.y + r + 10}
                    textAnchor="middle"
                    fontSize={node.size === "xl" ? "8" : "7"}
                    fontWeight="600"
                    fill="#475569"
                    className="dark:fill-slate-300"
                  >
                    {lines[0]}
                  </text>
                )}
                {(node.size === "xl" || node.size === "lg" || isActive) && lines[1] && (
                  <text
                    x={node.x}
                    y={node.y + r + 18}
                    textAnchor="middle"
                    fontSize="7"
                    fill="#94a3b8"
                  >
                    {lines[1]}
                  </text>
                )}
                {/* Tooltip for sm/md nodes */}
                {(node.size === "sm" || node.size === "md") && (
                  <title>{lines[0]} ({lines[1]})</title>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected node detail */}
      {activeCaseData && (
        <div className="card p-5 border-l-4" style={{ borderLeftColor: CASE_CATEGORY_CONFIG[activeCaseData.node.category].color }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">
                {activeCaseData.node.label.replace("\n", " ")}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${CASE_CATEGORY_CONFIG[activeCaseData.node.category].bg} ${CASE_CATEGORY_CONFIG[activeCaseData.node.category].text}`}>
                  {CASE_CATEGORY_CONFIG[activeCaseData.node.category].label}
                </span>
                {activeCaseData.node.overruled && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 uppercase">Overruled</span>
                )}
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              Close ×
            </button>
          </div>

          {activeCaseData.edges.length > 0 && (
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {/* Cases this one influenced */}
              {activeCaseData.edges.filter((e) => e.from === activeId).length > 0 && (
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Influenced →</div>
                  <div className="space-y-1">
                    {activeCaseData.edges.filter((e) => e.from === activeId).map((e) => {
                      const n = nodeById[e.to];
                      if (!n) return null;
                      return (
                        <button key={e.to} onClick={() => setSelected(e.to)}
                          className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CASE_CATEGORY_CONFIG[n.category].color }} />
                          {n.label.replace("\n", " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Cases that influenced this one */}
              {activeCaseData.edges.filter((e) => e.to === activeId).length > 0 && (
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">← Influenced by</div>
                  <div className="space-y-1">
                    {activeCaseData.edges.filter((e) => e.to === activeId).map((e) => {
                      const n = nodeById[e.from];
                      if (!n) return null;
                      return (
                        <button key={e.from} onClick={() => setSelected(e.from)}
                          className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CASE_CATEGORY_CONFIG[n.category].color }} />
                          {n.label.replace("\n", " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="text-xs text-slate-400 flex flex-wrap gap-4">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-400" />Larger circle = greater precedential importance</span>
        <span className="flex items-center gap-1.5">
          <svg width="20" height="10" viewBox="0 0 20 10">
            <path d="M 0 5 Q 10 0 20 5" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <polygon points="15,2 20,5 15,8" fill="#94a3b8" />
          </svg>
          Arrow = A influenced B
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 border border-red-400 border-dashed" />
          Dashed = Overruled
        </span>
      </div>
    </div>
  );
}
