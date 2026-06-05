import type { Client } from "@elastic/elasticsearch";
import { IDX } from "../indices";
import { embedTexts } from "../embeddings";
import type { IndexedDocument } from "../types";
import { prisma } from "@/lib/db";

async function bulkIndex(client: Client, docs: IndexedDocument[], vectors: (number[] | null)[]): Promise<number> {
  if (docs.length === 0) return 0;
  const body: unknown[] = [];
  docs.forEach((doc, i) => {
    body.push({ index: { _index: IDX.representative, _id: doc.id } });
    body.push({ ...doc, vector: vectors[i] ?? undefined });
  });
  const res = await client.bulk({ body, refresh: true });
  return docs.length - res.items.filter((it) => it.index?.error).length;
}

export async function indexRepresentatives(client: Client): Promise<{ indexed: number }> {
  let total = 0;

  try {
    // Person with current direct party relation + current roles + recent election candidacies
    const people = await prisma.person.findMany({
      select: {
        id:          true,
        name:        true,
        designation: true,
        stateCode:   true,
        state:       true,
        constituency: true,
        chamber:     true,
        level:       true,
        party: {
          select: { name: true, abbreviation: true },
        },
        // Temporal role — current assignment
        roles: {
          where:  { validTo: null },
          select: { title: true, institution: { select: { name: true } } },
          take: 1,
          orderBy: { validFrom: "desc" },
        },
        // Most recent election candidacy
        elections: {
          select: {
            votes:   true,
            isWinner: true,
            election: { select: { year: true, type: true } },
            constituency: { select: { name: true, stateCode: true } },
          },
          orderBy: { election: { year: "desc" } },
          take: 1,
        },
      },
      take: 2000,
    });

    const docs: IndexedDocument[] = people.map((p) => {
      const recentElection  = p.elections[0];
      const currentRole     = p.roles[0];
      const cname           = recentElection?.constituency?.name ?? p.constituency ?? "";

      const contentParts = [
        `${p.name}${p.designation ? ` — ${p.designation}` : ""}`,
        p.party ? `Party: ${p.party.name} (${p.party.abbreviation ?? ""})` : "",
        (p.stateCode ?? p.state) ? `State: ${p.stateCode ?? p.state}` : "",
        cname ? `Constituency: ${cname}` : "",
        p.chamber ? `Chamber: ${p.chamber}` : "",
        p.level  ? `Level: ${p.level}` : "",
        currentRole?.title ? `Current role: ${currentRole.title}${currentRole.institution ? ` at ${currentRole.institution.name}` : ""}` : "",
        recentElection
          ? `${recentElection.isWinner ? "Won" : "Contested"} ${recentElection.election.type} ${recentElection.election.year} with ${recentElection.votes} votes`
          : "",
      ].filter(Boolean);

      return {
        id:      `person-${p.id}`,
        domain:  "representative",
        subtype: determineSubtype(p.chamber, p.designation),
        title:   p.name,
        content: contentParts.join("\n"),
        snippet: [
          p.designation ?? "Representative",
          p.party?.abbreviation ?? "Independent",
          p.stateCode ?? p.state ?? "",
        ].filter(Boolean).join(" · "),
        metadata: {
          state:       p.stateCode ?? p.state ?? undefined,
          party:       p.party?.abbreviation ?? undefined,
          chamber:     p.chamber ?? undefined,
          constituency: cname || undefined,
          designation: p.designation ?? undefined,
        },
      };
    });

    const texts   = docs.map((d) => d.content);
    const vectors = await embedTexts(texts) ?? texts.map(() => null);
    total += await bulkIndex(client, docs, vectors);
    console.log(`[representatives.indexer] People: ${docs.length}`);
  } catch (err) {
    console.warn("[representatives.indexer] DB unavailable:", err);
  }

  return { indexed: total };
}

function determineSubtype(chamber: string | null, designation: string | null): string {
  if (chamber === "LS" || chamber === "RS") return "mp";
  const d = (designation ?? "").toLowerCase();
  if (d.includes("minister")) return "minister";
  if (d.includes("chief minister")) return "cm";
  if (d.includes("governor")) return "governor";
  return "representative";
}
