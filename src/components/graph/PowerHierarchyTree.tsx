"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { POWER_HIERARCHY, BRANCH_COLORS, type HierarchyNode, type BranchType } from "@/data/graph/hierarchy";

const W = 1100;
const H = 620;
const DX = 22;   // node height
const DY = 220;  // column width

interface D3Node extends d3.HierarchyPointNode<HierarchyNode> {
  _children?: D3Node["children"];
  x0?: number;
  y0?: number;
}

function diagonal(s: D3Node, d: D3Node): string {
  return `M${s.y},${s.x}C${(s.y + d.y) / 2},${s.x} ${(s.y + d.y) / 2},${d.x} ${d.y},${d.x}`;
}

const BRANCH_LABEL: Record<BranchType, string> = {
  foundation:  "Constitutional",
  executive:   "Executive",
  legislative: "Legislative",
  judicial:    "Judicial",
  independent: "Independent",
};

export function PowerHierarchyTree() {
  const svgRef     = useRef<SVGSVGElement>(null);
  const gRef       = useRef<SVGGElement | null>(null);
  const treeRef    = useRef<d3.TreeLayout<HierarchyNode> | null>(null);
  const rootRef    = useRef<D3Node | null>(null);
  const [nodeCount, setNodeCount] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Zoom/pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 2.5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Initial pan — shift right to show root
    svg.call(zoom.transform, d3.zoomIdentity.translate(60, H / 2));

    const g = svg.append("g")
      .attr("transform", `translate(60,${H / 2})`);
    gRef.current = g.node();

    const tree = d3.tree<HierarchyNode>().nodeSize([DX, DY]);
    treeRef.current = tree;

    // Build hierarchy with _children for collapse
    const root = d3.hierarchy(POWER_HIERARCHY) as D3Node;
    root.x0 = 0;
    root.y0 = 0;

    // Collapse all except depth 0 and 1
    root.descendants().forEach((d: D3Node) => {
      if (d.depth >= 2 && d.children) {
        d._children = d.children;
        d.children  = undefined;
      }
    });

    rootRef.current = root;

    function update(source: D3Node) {
      const nodes = root.descendants() as D3Node[];
      const links = root.links() as d3.HierarchyPointLink<HierarchyNode>[];

      setNodeCount(nodes.length);
      tree(root);

      const duration = 350;

      // ── Links ─────────────────────────────────────────────────────────────
      const link = g
        .selectAll<SVGPathElement, d3.HierarchyPointLink<HierarchyNode>>("path.lk-link")
        .data(links, (d) => (d.target as D3Node).data.id);

      const linkEnter = link.enter()
        .append("path")
        .attr("class", "lk-link")
        .attr("fill", "none")
        .attr("stroke", "#CBD5E1")
        .attr("stroke-width", 1.2)
        .attr("stroke-opacity", 0.6)
        .attr("d", () => {
          const o = { x: source.x0 ?? 0, y: source.y0 ?? 0 } as D3Node;
          return diagonal(o, o);
        });

      linkEnter.merge(link)
        .transition().duration(duration)
        .attr("d", (d) => diagonal(d.source as D3Node, d.target as D3Node));

      link.exit()
        .transition().duration(duration)
        .attr("d", () => {
          const o = { x: source.x, y: source.y } as D3Node;
          return diagonal(o, o);
        })
        .remove();

      // ── Nodes ─────────────────────────────────────────────────────────────
      const node = g
        .selectAll<SVGGElement, D3Node>("g.lk-node")
        .data(nodes, (d) => d.data.id);

      const nodeEnter = node.enter()
        .append("g")
        .attr("class", "lk-node")
        .attr("transform", () => `translate(${source.y0 ?? 0},${source.x0 ?? 0})`)
        .style("cursor", (d) => (d.children || d._children ? "pointer" : "default"))
        .on("click", (_event, d) => {
          if (d.children) {
            d._children = d.children;
            d.children  = undefined;
          } else if (d._children) {
            d.children  = d._children;
            d._children = undefined;
          }
          update(d);
        });

      // Circles
      nodeEnter.append("circle")
        .attr("r", 0)
        .attr("fill", (d) => BRANCH_COLORS[d.data.branch].fill)
        .attr("stroke", (d) => BRANCH_COLORS[d.data.branch].stroke)
        .attr("stroke-width", (d) => (d._children ? 2.5 : 1.5));

      // Label
      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", (d) => (d.children || d._children ? -10 : 10))
        .attr("text-anchor", (d) => (d.children || d._children ? "end" : "start"))
        .attr("font-size", 10)
        .attr("font-weight", (d) => (d.depth <= 1 ? 700 : 400))
        .attr("fill", (d) => BRANCH_COLORS[d.data.branch].text)
        .text((d) => d.data.name)
        .clone(true).lower()
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr("fill", "none");

      const nodeMerge = nodeEnter.merge(node);

      nodeMerge.transition().duration(duration)
        .attr("transform", (d) => `translate(${d.y},${d.x})`);

      nodeMerge.select("circle")
        .transition().duration(duration)
        .attr("r", (d) => (d.depth === 0 ? 9 : d.depth === 1 ? 6 : 4))
        .attr("fill", (d) => d._children ? BRANCH_COLORS[d.data.branch].stroke : BRANCH_COLORS[d.data.branch].fill)
        .attr("stroke-width", (d) => (d._children ? 2.5 : 1.5));

      nodeMerge.select("text")
        .attr("x", (d) => (d.children || d._children ? -10 : 10))
        .attr("text-anchor", (d) => (d.children || d._children ? "end" : "start"));

      node.exit()
        .transition().duration(duration)
        .attr("transform", () => `translate(${source.y},${source.x})`)
        .remove()
        .select("circle").attr("r", 0);

      // Save positions for next transition
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);
  }, []);

  const expandAll = () => {
    if (!rootRef.current || !gRef.current || !treeRef.current) return;
    rootRef.current.descendants().forEach((d: D3Node) => {
      if (d._children) {
        d.children  = d._children;
        d._children = undefined;
      }
    });
    // Re-trigger by simulating click on root
    const root = rootRef.current;
    const tree = treeRef.current;
    const g    = d3.select(gRef.current);

    const nodes = root.descendants() as D3Node[];
    tree(root);
    setNodeCount(nodes.length);

    g.selectAll<SVGGElement, D3Node>("g.lk-node")
      .data(nodes, (d) => d.data.id)
      .transition().duration(450)
      .attr("transform", (d) => `translate(${d.y},${d.x})`);
  };

  const collapseAll = () => {
    if (!rootRef.current || !treeRef.current || !gRef.current) return;
    rootRef.current.descendants().forEach((d: D3Node) => {
      if (d.depth >= 2 && d.children) {
        d._children = d.children;
        d.children  = undefined;
      }
    });
    const root = rootRef.current;
    const tree = treeRef.current;
    const g    = d3.select(gRef.current);

    const nodes = root.descendants() as D3Node[];
    tree(root);
    setNodeCount(nodes.length);

    g.selectAll<SVGGElement, D3Node>("g.lk-node")
      .data(nodes, (d) => d.data.id)
      .transition().duration(450)
      .attr("transform", (d) => `translate(${d.y},${d.x})`);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={expandAll}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Collapse
        </button>
        <span className="text-xs text-slate-400 ml-1">{nodeCount} nodes visible · Click node to toggle children · Scroll to zoom</span>

        {/* Branch legend */}
        <div className="ml-auto flex flex-wrap gap-2">
          {(Object.entries(BRANCH_COLORS) as [BranchType, { stroke: string; fill: string; text: string }][]).map(([branch, col]) => (
            <span key={branch} className="flex items-center gap-1 text-[10px]">
              <span className="w-3 h-3 rounded-full border-2" style={{ background: col.fill, borderColor: col.stroke }} />
              <span style={{ color: col.text }}>{BRANCH_LABEL[branch]}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden p-0 bg-slate-50 dark:bg-slate-900">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Indian constitutional power hierarchy — collapsible tree"
          style={{ minHeight: 380 }}
        />
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        Coloured by constitutional branch · Filled circle = collapsed children · Click to expand/collapse
      </p>
    </div>
  );
}
