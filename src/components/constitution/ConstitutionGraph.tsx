"use client";

import { useEffect, useRef, useState } from "react";
import { ARTICLES_DATA } from "@/data/constitution/articles-data";
import { DOCTRINES_DATA } from "@/data/constitution/doctrines-data";

// ─── Node/Link data ───────────────────────────────────────────────────────────
const NODE_COLORS: Record<string, string> = {
  article: "#F97316",    // saffron
  doctrine: "#1E3A5F",   // navy
  case: "#10B981",       // emerald
  amendment: "#8B5CF6",  // purple
};

type NodeType = "article" | "doctrine" | "case" | "amendment";

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  description?: string;
}

interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

// Build the graph data from static knowledge
function buildGraphData(): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeIds = new Set<string>();

  const addNode = (node: GraphNode) => {
    if (!nodeIds.has(node.id)) {
      nodes.push(node);
      nodeIds.add(node.id);
    }
  };

  // Key articles
  const keyArticles = ["21", "14", "19", "32", "368", "356", "226", "141", "124", "80", "81", "74"];
  for (const num of keyArticles) {
    const a = ARTICLES_DATA.find((x) => x.number === num);
    if (a) {
      addNode({ id: `art-${num}`, label: `Art. ${num}`, type: "article", description: a.title });
    }
  }

  // Key doctrines
  const keyDoctrines = ["basic-structure", "pith-and-substance", "due-process", "proportionality", "eclipse", "harmonious-construction"];
  for (const id of keyDoctrines) {
    const d = DOCTRINES_DATA.find((x) => x.id === id);
    if (d) {
      addNode({ id: `doc-${id}`, label: d.shortName || d.name, type: "doctrine", description: d.description });
    }
  }

  // Key cases
  const cases = [
    { id: "case-kesavananda", label: "Kesavananda Bharati (1973)", description: "Established Basic Structure Doctrine" },
    { id: "case-maneka", label: "Maneka Gandhi (1978)", description: "Expanded Art. 21 — due process" },
    { id: "case-puttaswamy", label: "Puttaswamy (2017)", description: "Right to privacy under Art. 21" },
    { id: "case-bommai", label: "SR Bommai (1994)", description: "Restricted misuse of Art. 356" },
    { id: "case-minerva", label: "Minerva Mills (1980)", description: "FR and DPSP must be harmonized" },
    { id: "case-vishaka", label: "Vishaka (1997)", description: "Sexual harassment guidelines via Art. 142" },
  ];
  for (const c of cases) {
    addNode({ id: c.id, label: c.label, type: "case", description: c.description });
  }

  // Key amendments
  const amendments = [
    { id: "am-42", label: "42nd Amendment (1976)" },
    { id: "am-44", label: "44th Amendment (1978)" },
    { id: "am-86", label: "86th Amendment (2002)" },
  ];
  for (const a of amendments) {
    addNode({ id: a.id, label: a.label, type: "amendment" });
  }

  // Links
  const addLink = (src: string, tgt: string, label?: string) => {
    if (nodeIds.has(src) && nodeIds.has(tgt)) {
      links.push({ source: src, target: tgt, label });
    }
  };

  // Art 21 connections
  addLink("art-21", "case-maneka", "expanded by");
  addLink("art-21", "case-puttaswamy", "includes privacy");
  addLink("art-21", "case-vishaka", "enforcement");
  addLink("art-21", "doc-due-process", "interpreted as");
  addLink("art-21", "doc-proportionality", "tested by");
  addLink("art-21", "art-14", "read with");
  addLink("art-21", "art-19", "read with");

  // Art 14 connections
  addLink("art-14", "doc-proportionality", "standard");
  addLink("art-14", "art-21", "read with");

  // Art 32 connections
  addLink("art-32", "art-226", "concurrent with");
  addLink("art-32", "art-141", "binding precedent");

  // Art 368 connections
  addLink("art-368", "doc-basic-structure", "limited by");
  addLink("art-368", "case-kesavananda", "interpreted in");
  addLink("art-368", "am-42", "exercise of");
  addLink("art-368", "am-44", "exercise of");

  // Art 356 connections
  addLink("art-356", "case-bommai", "restricted by");

  // Kesavananda connections
  addLink("case-kesavananda", "doc-basic-structure", "established");
  addLink("case-kesavananda", "case-minerva", "reaffirmed in");
  addLink("doc-basic-structure", "art-368", "limits");
  addLink("doc-basic-structure", "case-minerva", "reaffirmed");

  // Amendment connections
  addLink("am-42", "art-368", "amends");
  addLink("am-44", "art-74", "mandates advice follow");
  addLink("am-86", "art-21", "adds 21A");

  // Doctrine connections
  addLink("doc-harmonious-construction", "art-14", "resolves");
  addLink("doc-harmonious-construction", "art-19", "resolves");
  addLink("doc-pith-and-substance", "art-81", "resolves");
  addLink("doc-eclipse", "art-19", "applies to");

  // SC connections
  addLink("art-124", "art-141", "declares law");
  addLink("art-141", "case-kesavananda", "binding");
  addLink("art-141", "case-maneka", "binding");

  return { nodes, links };
}

// ─── D3 simulation (dynamic import) ──────────────────────────────────────────
export function ConstitutionGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  const { nodes, links } = buildGraphData();

  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setDimensions({ width: w, height: Math.max(400, Math.min(600, w * 0.65)) });
      }
    };
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const { width, height } = dimensions;

    import("d3").then((d3) => {
      const svg = d3.select(svgRef.current!);
      svg.selectAll("*").remove();

      // Arrow marker
      svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 18)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#94A3B8");

      // Deep clone nodes/links for d3 mutation
      const simNodes = nodes.map((n) => ({ ...n, x: width / 2, y: height / 2 }));
      const simLinks = links.map((l) => ({ ...l }));

      const simulation = d3.forceSimulation(simNodes as any)
        .force("link", d3.forceLink(simLinks as any).id((d: any) => d.id).distance(120).strength(0.5))
        .force("charge", d3.forceManyBody().strength(-350))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide(45));

      const g = svg.append("g");

      // Zoom & pan
      svg.call(
        d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.3, 3])
          .on("zoom", (event) => {
            g.attr("transform", event.transform.toString());
          })
      );

      // Links
      const link = g.append("g")
        .selectAll("line")
        .data(simLinks)
        .join("line")
        .attr("stroke", "#CBD5E1")
        .attr("stroke-width", 1.5)
        .attr("marker-end", "url(#arrow)");

      // Link labels (small, not all)
      const linkLabel = g.append("g")
        .selectAll("text")
        .data(simLinks.filter((l) => l.label))
        .join("text")
        .attr("font-size", 8)
        .attr("fill", "#94A3B8")
        .attr("text-anchor", "middle")
        .text((d) => d.label || "");

      // Node groups
      const node = g.append("g")
        .selectAll("g")
        .data(simNodes)
        .join("g")
        .attr("cursor", "pointer")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .call((d3.drag<SVGGElement, any>()
            .on("start", (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on("drag", (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on("end", (event, d) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
          ) as any
        );

      // Circles
      node.append("circle")
        .attr("r", (d: any) => d.type === "doctrine" ? 28 : d.type === "article" ? 22 : 18)
        .attr("fill", (d: any) => NODE_COLORS[d.type as NodeType] + "20")
        .attr("stroke", (d: any) => NODE_COLORS[d.type as NodeType])
        .attr("stroke-width", 2);

      // Labels
      node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-size", (d: any) => d.type === "doctrine" ? 7 : 8)
        .attr("font-weight", "600")
        .attr("fill", (d: any) => NODE_COLORS[d.type as NodeType])
        .text((d: any) => d.label);

      // Click to select
      node.on("click", (_event: any, d: any) => {
        setSelectedNode(d);
      });

      // Tooltip on hover
      node.append("title").text((d: any) => `${d.label}\n${d.description || ""}`);

      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        linkLabel
          .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
          .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

        node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
      });

      setIsLoaded(true);
    });
  }, [dimensions]);

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="card p-4 flex flex-wrap gap-4 items-center">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Legend:</span>
        {(Object.entries(NODE_COLORS) as [NodeType, string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: color, background: color + "30" }} />
            <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">{type}</span>
          </div>
        ))}
        <span className="text-xs text-slate-400 ml-auto">Drag to rearrange · Scroll to zoom</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Graph */}
        <div ref={containerRef} className="flex-1 card overflow-hidden relative">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 z-10">
              <div className="text-sm text-slate-500">Loading constitutional graph...</div>
            </div>
          )}
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full"
          />
        </div>

        {/* Detail panel */}
        <div className="lg:w-72">
          {selectedNode ? (
            <div className="card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: NODE_COLORS[selectedNode.type],
                    background: NODE_COLORS[selectedNode.type] + "30",
                  }}
                />
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: NODE_COLORS[selectedNode.type] }}
                >
                  {selectedNode.type}
                </span>
              </div>
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">
                {selectedNode.label}
              </h3>
              {selectedNode.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedNode.description}
                </p>
              )}

              {/* Connections */}
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Connections
                </h5>
                <ul className="space-y-1">
                  {links
                    .filter(
                      (l) =>
                        (typeof l.source === "string" ? l.source : (l.source as any).id) === selectedNode.id ||
                        (typeof l.target === "string" ? l.target : (l.target as any).id) === selectedNode.id
                    )
                    .map((l, i) => {
                      const srcId = typeof l.source === "string" ? l.source : (l.source as any).id;
                      const tgtId = typeof l.target === "string" ? l.target : (l.target as any).id;
                      const otherId = srcId === selectedNode.id ? tgtId : srcId;
                      const other = nodes.find((n) => n.id === otherId);
                      return (
                        <li key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: NODE_COLORS[other?.type || "article"] }}
                          />
                          {other?.label}
                          {l.label && <span className="text-slate-400 italic">({l.label})</span>}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card p-5 text-center">
              <p className="text-sm text-slate-500">Click a node to explore its connections</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
