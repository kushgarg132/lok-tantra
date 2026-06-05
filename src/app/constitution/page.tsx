import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ConstitutionExplorer } from "@/components/constitution/ConstitutionExplorer";

export const revalidate = 86400; // Constitution text changes at most once per day

export const metadata: Metadata = {
  title: "Constitution of India — LokTantra",
  description:
    "Interactive constitutional intelligence: explore every article, amendment, fundamental right, DPSP, constitutional doctrine, and landmark judgment.",
};

export default async function ConstitutionPage() {
  const [parts, articles, amendments, cases] = await Promise.all([
    prisma.constitutionPart.findMany({ orderBy: { number: "asc" } }),
    prisma.constitutionArticle.findMany({
      include: { amendments: true, cases: true, part: true },
      orderBy: { number: "asc" },
    }),
    prisma.amendment.findMany({
      include: { articlesAffected: { select: { number: true } } },
      orderBy: { number: "asc" },
    }),
    prisma.landmarkCase.findMany({
      include: { articlesInterpreted: { select: { number: true } } },
      orderBy: { year: "asc" },
    }),
  ]);

  const serializedArticles = articles.map((a) => ({
    id: a.id,
    number: a.number,
    title: a.title,
    text: a.text,
    explanation: a.explanation,
    category: a.category,
    partNum: a.part.number,
    relatedArticles: a.relatedArticles,
    amendments: a.amendments.map((am) => ({
      id: am.id,
      number: am.number,
      year: am.year,
      description: am.description,
      significance: am.significance,
    })),
    cases: a.cases.map((c) => ({ id: c.id, name: c.name })),
  }));

  const serializedAmendments = amendments.map((a) => ({
    id: a.id,
    number: a.number,
    year: a.year,
    title: `${a.number}${a.number === 1 ? "st" : a.number === 2 ? "nd" : a.number === 3 ? "rd" : "th"} Amendment`,
    description: a.description,
    significance: a.significance,
    articlesAmended: a.articlesAffected.map((x) => x.number),
  }));

  const serializedCases = cases.map((c) => ({
    id: c.id,
    name: c.name,
    citation: c.citation,
    year: c.year,
    summary: c.summary,
    significance: c.significance,
    impact: c.impact,
    articlesInterpreted: c.articlesInterpreted.map((a) => a.number),
  }));

  const serializedParts = parts.map((p) => ({
    number: p.number,
    name: p.name,
    articles: p.articles,
  }));

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-saffron">AI-Powered</span>
            <span className="badge-navy">{articles.length}+ Articles</span>
            <span className="badge-chakra">{amendments.length} Amendments</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Constitutional Intelligence
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Ask any question about the Indian Constitution in plain English. Explore every article,
            amendment, fundamental right, directive principle, landmark judgment, and constitutional doctrine.
          </p>
        </div>
      </section>

      <ConstitutionExplorer
        parts={serializedParts}
        articles={serializedArticles}
        amendments={serializedAmendments}
        cases={serializedCases}
      />
    </div>
  );
}
