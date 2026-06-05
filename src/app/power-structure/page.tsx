import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PowerHierarchyExplorer } from "@/components/power-structure/PowerHierarchyExplorer";

export const metadata: Metadata = {
  title: "Power Structure",
  description:
    "Interactive visualization of India's governance hierarchy — from the people to local government",
};

export default async function PowerStructurePage() {
  const institutions = await prisma.institution.findMany({
    include: { children: { select: { slug: true } } },
    orderBy: { name: "asc" },
  });

  const nodes = institutions.map((inst) => ({
    id: inst.slug,
    name: inst.name,
    type: inst.type,
    level: inst.level,
    branch: inst.branch,
    parent: institutions.find((i) => i.id === inst.parentId)?.slug ?? null,
    children: inst.children.map((c) => c.slug),
    powers: inst.powers,
    constitutionalArticle: inst.constitutionalBasis,
    appointedBy: inst.appointedBy,
    removableBy: inst.removableBy,
    reportsTo: inst.reportsTo,
  }));

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-saffron">Interactive</span>
            <span className="badge-navy">Governance Graph</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Power Structure of India
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Explore how power flows from the People through the Constitution to every level of governance.
            Click any node to see powers, office holders, constitutional basis, and relationships.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-saffron-500" />
              <span className="text-slate-600 dark:text-slate-400">Legislature</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600 dark:text-slate-400">Executive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400">Judiciary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-slate-600 dark:text-slate-400">Independent Bodies</span>
            </div>
          </div>
        </div>
      </section>

      <PowerHierarchyExplorer initialNodes={nodes} />
    </div>
  );
}
