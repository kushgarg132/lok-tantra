import type { Client } from "@elastic/elasticsearch";
import { IDX } from "../indices";
import { embedTexts } from "../embeddings";
import type { IndexedDocument } from "../types";
import { INSTITUTIONS_KNOWLEDGE } from "@/data/governance/institutions";
import { GOVERNANCE_PROCESSES } from "@/data/governance/processes";
import { prisma } from "@/lib/db";

async function bulkIndex(client: Client, docs: IndexedDocument[], vectors: (number[] | null)[]): Promise<number> {
  if (docs.length === 0) return 0;
  const body: unknown[] = [];
  docs.forEach((doc, i) => {
    body.push({ index: { _index: IDX.institution, _id: doc.id } });
    body.push({ ...doc, vector: vectors[i] ?? undefined });
  });
  const res = await client.bulk({ body, refresh: true });
  return docs.length - res.items.filter((it) => it.index?.error).length;
}

export async function indexInstitutions(client: Client): Promise<{ indexed: number }> {
  let total = 0;

  // ── 1. Static institutional knowledge chunks ─────────────────────────────
  const instDocs: IndexedDocument[] = INSTITUTIONS_KNOWLEDGE.map((k) => ({
    id:      k.id,
    domain:  "institution",
    subtype: "knowledge",
    title:   k.title,
    content: k.content,
    snippet: k.content.slice(0, 280),
    metadata: {
      category:        k.category,
      keywords:        k.keywords,
      relatedArticles: k.articleRefs,
    },
  }));

  // ── 2. Governance processes ───────────────────────────────────────────────
  const procDocs: IndexedDocument[] = GOVERNANCE_PROCESSES.map((p) => ({
    id:      p.id,
    domain:  "institution",
    subtype: "process",
    title:   p.title,
    content: p.content,
    snippet: p.content.slice(0, 280),
    metadata: {
      category:        p.category,
      keywords:        p.keywords,
      relatedArticles: p.articleRefs,
    },
  }));

  const allDocs = [...instDocs, ...procDocs];
  const texts = allDocs.map((d) => d.content);
  const vectors = await embedTexts(texts) ?? texts.map(() => null);
  total += await bulkIndex(client, allDocs, vectors);
  console.log(`[institutions.indexer] Static: ${allDocs.length}`);

  // ── 3. DB Institutions ────────────────────────────────────────────────────
  try {
    const institutions = await prisma.institution.findMany({
      select: {
        id: true, name: true, slug: true, type: true, level: true,
        description: true, powers: true, parentId: true,
      },
      take: 500,
    });

    const dbDocs: IndexedDocument[] = institutions.map((inst) => ({
      id:      `inst-db-${inst.id}`,
      domain:  "institution",
      subtype: inst.type?.toLowerCase() ?? "institution",
      title:   inst.name,
      content: [
        inst.name,
        inst.description ?? "",
        inst.type ? `Type: ${inst.type}` : "",
        inst.level ? `Level: ${inst.level}` : "",
        inst.powers?.length ? `Powers: ${(inst.powers as string[]).join("; ")}` : "",
      ].filter(Boolean).join("\n\n"),
      snippet: (inst.description ?? inst.name).slice(0, 280),
      metadata: {
        branch: inst.type ?? undefined,
        level:  inst.level ?? undefined,
      },
    }));

    const dbTexts   = dbDocs.map((d) => d.content);
    const dbVectors = await embedTexts(dbTexts) ?? dbTexts.map(() => null);
    total += await bulkIndex(client, dbDocs, dbVectors);
    console.log(`[institutions.indexer] DB institutions: ${dbDocs.length}`);
  } catch {
    console.warn("[institutions.indexer] DB unavailable — skipping DB institutions");
  }

  // ── 4. DB Ministries ─────────────────────────────────────────────────────
  try {
    const ministries = await prisma.ministry.findMany({
      select: { id: true, name: true, department: true, departments: { select: { name: true } } },
      take: 100,
    });

    const minDocs: IndexedDocument[] = ministries.map((m) => ({
      id:      `ministry-${m.id}`,
      domain:  "institution",
      subtype: "ministry",
      title:   m.name,
      content: [
        `Ministry: ${m.name}`,
        m.department ? `Department: ${m.department}` : "",
        m.departments.length ? `Departments: ${m.departments.map((d) => d.name).join(", ")}` : "",
      ].filter(Boolean).join("\n"),
      snippet: m.name,
      metadata: { branch: "executive", level: "national" },
    }));

    const mTexts   = minDocs.map((d) => d.content);
    const mVectors = await embedTexts(mTexts) ?? mTexts.map(() => null);
    total += await bulkIndex(client, minDocs, mVectors);
    console.log(`[institutions.indexer] DB ministries: ${minDocs.length}`);
  } catch {
    console.warn("[institutions.indexer] DB unavailable — skipping ministries");
  }

  return { indexed: total };
}
