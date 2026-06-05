import type { Client } from "@elastic/elasticsearch";
import { IDX } from "../indices";
import { embedTexts } from "../embeddings";
import type { IndexedDocument } from "../types";
import { ARTICLES_DATA } from "@/data/constitution/articles-data";
import { DOCTRINES_DATA } from "@/data/constitution/doctrines-data";
import { prisma } from "@/lib/db";

// ── Text builders ─────────────────────────────────────────────────────────────
function articleText(a: (typeof ARTICLES_DATA)[number]): string {
  return [
    `Article ${a.number} of the Indian Constitution — ${a.title}`,
    `Full text: ${a.text}`,
    `Plain language explanation: ${a.explanation}`,
    a.keywords?.length ? `Key concepts: ${a.keywords.join(", ")}` : "",
    a.relatedArticles?.length ? `Related articles: ${a.relatedArticles.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function doctrineText(d: (typeof DOCTRINES_DATA)[number]): string {
  return [
    d.name,
    d.description,
    `Detail: ${d.detail}`,
    `Landmark case: ${d.landmarkCase} (${d.caseYear})`,
    d.keywords?.length ? `Keywords: ${d.keywords.join(", ")}` : "",
    d.relatedArticles?.length ? `Related articles: ${d.relatedArticles.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

// ── Bulk helper ───────────────────────────────────────────────────────────────
async function bulkIndex(client: Client, index: string, docs: IndexedDocument[], vectors: (number[] | null)[]): Promise<number> {
  if (docs.length === 0) return 0;

  const body: unknown[] = [];
  docs.forEach((doc, i) => {
    body.push({ index: { _index: index, _id: doc.id } });
    body.push({ ...doc, vector: vectors[i] ?? undefined });
  });

  const res = await client.bulk({ body, refresh: true });
  const errors = res.items.filter((it) => it.index?.error).length;
  if (errors > 0) console.warn(`[constitution.indexer] ${errors} bulk errors`);
  return docs.length - errors;
}

// ── Main indexer ──────────────────────────────────────────────────────────────
export async function indexConstitution(client: Client): Promise<{ indexed: number }> {
  let total = 0;

  // ── 1. Articles ──────────────────────────────────────────────────────────
  const articleDocs: IndexedDocument[] = ARTICLES_DATA.map((a) => ({
    id:      `article-${a.number}`,
    domain:  "constitution",
    subtype: "article",
    title:   `Article ${a.number} — ${a.title}`,
    content: articleText(a),
    snippet: a.explanation.slice(0, 280),
    metadata: {
      articleNumber:  a.number,
      partNum:        a.partNum,
      category:       a.category,
      relatedArticles: a.relatedArticles,
      keywords:       a.keywords,
    },
  }));

  const articleTexts = articleDocs.map((d) => d.content);
  const articleVectors = await embedTexts(articleTexts) ?? articleTexts.map(() => null);
  total += await bulkIndex(client, IDX.constitution, articleDocs, articleVectors);
  console.log(`[constitution.indexer] Articles: ${articleDocs.length}`);

  // ── 2. Doctrines ─────────────────────────────────────────────────────────
  const doctrineDocs: IndexedDocument[] = DOCTRINES_DATA.map((d) => ({
    id:      `doctrine-${d.id}`,
    domain:  "constitution",
    subtype: "doctrine",
    title:   d.name,
    content: doctrineText(d),
    snippet: d.description.slice(0, 280),
    metadata: {
      category:        "constitutional-doctrine",
      relatedArticles: d.relatedArticles,
      keywords:        d.keywords,
      year:            d.caseYear,
    },
  }));

  const docTexts = doctrineDocs.map((d) => d.content);
  const docVectors = await embedTexts(docTexts) ?? docTexts.map(() => null);
  total += await bulkIndex(client, IDX.constitution, doctrineDocs, docVectors);
  console.log(`[constitution.indexer] Doctrines: ${doctrineDocs.length}`);

  // ── 3. DB — Amendments ───────────────────────────────────────────────────
  try {
    const amendments = await prisma.amendment.findMany({
      select: { id: true, number: true, year: true, description: true, significance: true, dateEnacted: true },
    });

    const amendDocs: IndexedDocument[] = amendments.map((a) => ({
      id:      `amendment-${a.id}`,
      domain:  "constitution",
      subtype: "amendment",
      title:   `${a.number}th Amendment (${a.year})`,
      content: [
        `Constitutional Amendment No. ${a.number}, enacted in ${a.year}`,
        a.description ?? "",
        a.significance ? `Significance: ${a.significance}` : "",
      ].filter(Boolean).join("\n\n"),
      snippet: (a.description ?? a.significance ?? "").slice(0, 280),
      metadata: { year: a.year, category: "amendment" },
    }));

    const aTexts  = amendDocs.map((d) => d.content);
    const aVectors = await embedTexts(aTexts) ?? aTexts.map(() => null);
    total += await bulkIndex(client, IDX.constitution, amendDocs, aVectors);
    console.log(`[constitution.indexer] Amendments: ${amendDocs.length}`);
  } catch {
    console.warn("[constitution.indexer] DB unavailable — skipping amendments");
  }

  // ── 4. DB — Landmark Cases ───────────────────────────────────────────────
  try {
    const cases = await prisma.landmarkCase.findMany({
      select: {
        id: true, name: true, citation: true, year: true, summary: true, significance: true,
        articlesInterpreted: { select: { number: true } },
      },
    });

    const caseDocs: IndexedDocument[] = cases.map((c) => {
      const artNums = c.articlesInterpreted.map((a) => a.number);
      return {
        id:      `case-${c.id}`,
        domain:  "constitution",
        subtype: "case",
        title:   c.name,
        content: [
          `Landmark Case: ${c.name}`,
          c.citation    ? `Citation: ${c.citation}` : "",
          c.year        ? `Year: ${c.year}` : "",
          c.significance ? `Significance: ${c.significance}` : "",
          c.summary     ? `Summary: ${c.summary}` : "",
          artNums.length ? `Articles interpreted: ${artNums.join(", ")}` : "",
        ].filter(Boolean).join("\n\n"),
        snippet: (c.significance ?? c.summary ?? "").slice(0, 280),
        metadata: {
          year:            c.year ?? undefined,
          category:        "landmark-case",
          relatedArticles: artNums,
        },
      };
    });

    const cTexts   = caseDocs.map((d) => d.content);
    const cVectors = await embedTexts(cTexts) ?? cTexts.map(() => null);
    total += await bulkIndex(client, IDX.constitution, caseDocs, cVectors);
    console.log(`[constitution.indexer] Cases: ${caseDocs.length}`);
  } catch {
    console.warn("[constitution.indexer] DB unavailable — skipping cases");
  }

  return { indexed: total };
}
