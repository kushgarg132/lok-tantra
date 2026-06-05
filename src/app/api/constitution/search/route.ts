import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";
import { ARTICLES_DATA, ArticleData } from "@/data/constitution/articles-data";
import { DOCTRINES_DATA, DoctrineData } from "@/data/constitution/doctrines-data";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── Article number extraction ────────────────────────────────────────────────
const ARTICLE_RE = /\bart(?:icle)?\.?\s*(\d+[A-Z]?(?:\(\d+\))?(?:\([a-z]\))?)/gi;

function extractArticleNumbers(query: string): string[] {
  const matches = Array.from(query.matchAll(ARTICLE_RE));
  return matches.map((m) => m[1].toUpperCase().replace(/\s/g, ""));
}

// ─── Build search corpus (merge DB + static) ─────────────────────────────────
type SearchResult = {
  id: string;
  type: "article" | "doctrine" | "case" | "amendment";
  title: string;
  number?: string;
  snippet: string;
  relevanceScore: number;
  category?: string;
  partNum?: number;
  relatedArticles?: string[];
  caseYear?: number;
};

let fuseArticles: Fuse<ArticleData> | null = null;
let fuseDocs: Fuse<DoctrineData> | null = null;

function getArticleFuse(): Fuse<ArticleData> {
  if (!fuseArticles) {
    fuseArticles = new Fuse(ARTICLES_DATA, {
      keys: [
        { name: "number", weight: 2.5 },
        { name: "title", weight: 2 },
        { name: "keywords", weight: 1.8 },
        { name: "explanation", weight: 1 },
        { name: "text", weight: 0.5 },
      ],
      threshold: 0.45,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }
  return fuseArticles;
}

function getDocFuse(): Fuse<DoctrineData> {
  if (!fuseDocs) {
    fuseDocs = new Fuse(DOCTRINES_DATA, {
      keys: [
        { name: "name", weight: 2.5 },
        { name: "shortName", weight: 2 },
        { name: "keywords", weight: 2 },
        { name: "description", weight: 1 },
        { name: "detail", weight: 0.5 },
        { name: "landmarkCase", weight: 1.5 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 3,
    });
  }
  return fuseDocs;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") || "").trim();
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") || 10), 30);
  const results: SearchResult[] = [];

  // 1. Exact article number matches (highest priority)
  const articleNums = extractArticleNumbers(q);
  if (articleNums.length > 0) {
    for (const num of articleNums) {
      const normalized = num.replace(/[()]/g, "").toUpperCase();
      // Match e.g. "21", "21A", "21(1)"
      const exact = ARTICLES_DATA.filter(
        (a) =>
          a.number.toUpperCase() === normalized ||
          a.number.toUpperCase() === normalized.replace(/\([^)]*\)$/g, "")
      );
      for (const a of exact) {
        results.push({
          id: `article-${a.number}`,
          type: "article",
          title: `Article ${a.number} — ${a.title}`,
          number: a.number,
          snippet: a.explanation.slice(0, 300),
          relevanceScore: 1.0,
          category: a.category,
          partNum: a.partNum,
          relatedArticles: a.relatedArticles,
        });
      }
    }
  }

  // 2. Fuzzy article search
  const existingIds = new Set(results.map((r) => r.id));
  const articleResults = getArticleFuse().search(q, { limit: 8 });
  for (const r of articleResults) {
    const id = `article-${r.item.number}`;
    if (!existingIds.has(id)) {
      results.push({
        id,
        type: "article",
        title: `Article ${r.item.number} — ${r.item.title}`,
        number: r.item.number,
        snippet: r.item.explanation.slice(0, 300),
        relevanceScore: r.score != null ? 1 - r.score : 0.5,
        category: r.item.category,
        partNum: r.item.partNum,
        relatedArticles: r.item.relatedArticles,
      });
      existingIds.add(id);
    }
  }

  // 3. Doctrine fuzzy search
  const docResults = getDocFuse().search(q, { limit: 5 });
  for (const r of docResults) {
    const id = `doctrine-${r.item.id}`;
    if (!existingIds.has(id)) {
      results.push({
        id,
        type: "doctrine",
        title: r.item.name,
        snippet: r.item.description,
        relevanceScore: r.score != null ? 1 - r.score : 0.5,
        relatedArticles: r.item.relatedArticles,
        caseYear: r.item.caseYear,
      });
      existingIds.add(id);
    }
  }

  // 4. DB search for amendments and cases (if DB is available)
  try {
    if (q.length >= 3) {
      const [amendments, cases] = await Promise.all([
        prisma.amendment.findMany({
          where: {
            OR: [
              { description: { contains: q, mode: "insensitive" } },
              { significance: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 4,
          select: { id: true, number: true, description: true, year: true, significance: true },
        }),
        prisma.landmarkCase.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { summary: { contains: q, mode: "insensitive" } },
              { significance: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 4,
          select: { id: true, name: true, year: true, summary: true, significance: true },
        }),
      ]);

      for (const a of amendments) {
        const id = `amendment-${a.id}`;
        if (!existingIds.has(id)) {
          results.push({
            id,
            type: "amendment",
            title: `${a.number}th Amendment (${a.year})`,
            snippet: (a.description || a.significance || "").slice(0, 300),
            relevanceScore: 0.7,
          });
          existingIds.add(id);
        }
      }

      for (const c of cases) {
        const id = `case-${c.id}`;
        if (!existingIds.has(id)) {
          results.push({
            id,
            type: "case",
            title: c.name,
            snippet: (c.significance || c.summary || "").slice(0, 300),
            relevanceScore: 0.65,
            caseYear: c.year ?? undefined,
          });
          existingIds.add(id);
        }
      }
    }
  } catch {
    // DB unavailable — static search results are sufficient
  }

  // Sort by relevance, exact matches first
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return NextResponse.json({ results: results.slice(0, limit), query: q });
}
