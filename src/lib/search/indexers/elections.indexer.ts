import type { Client } from "@elastic/elasticsearch";
import { IDX } from "../indices";
import { embedTexts } from "../embeddings";
import type { IndexedDocument } from "../types";
import { INDIA_STATES } from "@/data/atlas/india";
import { PARLIAMENT_2024, COALITIONS_2024 } from "@/data/elections/intelligence";
import { prisma } from "@/lib/db";

async function bulkIndex(client: Client, docs: IndexedDocument[], vectors: (number[] | null)[]): Promise<number> {
  if (docs.length === 0) return 0;
  const body: unknown[] = [];
  docs.forEach((doc, i) => {
    body.push({ index: { _index: IDX.election, _id: doc.id } });
    body.push({ ...doc, vector: vectors[i] ?? undefined });
  });
  const res = await client.bulk({ body, refresh: true });
  return docs.length - res.items.filter((it) => it.index?.error).length;
}

export async function indexElections(client: Client): Promise<{ indexed: number }> {
  let total = 0;

  // ── 1. State-level 2024 Lok Sabha results ────────────────────────────────
  const stateDocs: IndexedDocument[] = INDIA_STATES.map((s) => ({
    id:      `election-state-${s.code}-2024`,
    domain:  "election",
    subtype: "state-result",
    title:   `${s.state} — 2024 Lok Sabha Results`,
    content: [
      `2024 Lok Sabha election results for ${s.state} (${s.code})`,
      `Total Lok Sabha seats: ${s.seats}`,
      `NDA seats: ${s.ndaSeats} (${Math.round(s.ndaSeats / s.seats * 100)}%)`,
      `INDIA bloc seats: ${s.indiaSeats} (${Math.round(s.indiaSeats / s.seats * 100)}%)`,
      `Other seats: ${s.otherSeats}`,
      `Dominant party: ${s.dominant} with ${s.dominantSeats} seats`,
      `Winning alliance: ${s.alliance}`,
      `Voter turnout: ${s.turnout}%`,
      `State capital: ${s.capital}`,
      `Region: ${s.region}`,
    ].join("\n"),
    snippet: `${s.alliance} won ${s.ndaSeats > s.indiaSeats ? s.ndaSeats : s.indiaSeats} of ${s.seats} seats · Turnout ${s.turnout}%`,
    metadata: {
      state:       s.code,
      alliance:    s.alliance,
      seats:       s.seats,
      turnout:     s.turnout,
      ndaSeats:    s.ndaSeats,
      indiaSeats:  s.indiaSeats,
      year:        2024,
      category:    "state-result",
    },
  }));

  // ── 2. Party-level standings ──────────────────────────────────────────────
  const partyDocs: IndexedDocument[] = PARLIAMENT_2024.map((p) => ({
    id:      `election-party-${p.abbr.toLowerCase()}-2024`,
    domain:  "election",
    subtype: "party-result",
    title:   `${p.party} (${p.abbr}) — 2024 Lok Sabha`,
    content: [
      `${p.party} (abbreviated: ${p.abbr}) in 2024 Lok Sabha election`,
      `Seats won: ${p.seats} out of 543 total seats`,
      `Percentage of house: ${((p.seats / 543) * 100).toFixed(1)}%`,
      `Alliance: ${p.alliance}`,
      p.seats >= 272 ? "Majority party in Lok Sabha" : "",
      p.seats >= 54 ? "Entitled to Leader of Opposition status" : "",
    ].filter(Boolean).join("\n"),
    snippet: `${p.seats} seats · ${p.alliance} · ${((p.seats / 543) * 100).toFixed(1)}% of house`,
    metadata: {
      party:    p.abbr,
      alliance: p.alliance,
      seats:    p.seats,
      year:     2024,
      category: "party-result",
    },
  }));

  // ── 3. Coalition summaries ────────────────────────────────────────────────
  const coalitionDocs: IndexedDocument[] = COALITIONS_2024.map((c) => ({
    id:      `election-coalition-${c.name.toLowerCase().replace(/\s+/g, "-")}-2024`,
    domain:  "election",
    subtype: "coalition",
    title:   `${c.name} Alliance — 2024 Lok Sabha`,
    content: [
      `${c.name} is a political alliance/coalition in India`,
      `Total seats in 2024 Lok Sabha: ${c.totalSeats}`,
      `Percentage of house: ${((c.totalSeats / 543) * 100).toFixed(1)}%`,
      c.totalSeats >= 272 ? "Holds ruling majority in the 18th Lok Sabha" : "Opposition alliance",
      `Member parties: ${c.parties.map((p: { abbr: string }) => p.abbr).join(", ")}`,
    ].filter(Boolean).join("\n"),
    snippet: `${c.totalSeats} seats · ${((c.totalSeats / 543) * 100).toFixed(1)}% of Lok Sabha`,
    metadata: {
      alliance: c.name,
      seats:    c.totalSeats,
      year:     2024,
      category: "coalition",
    },
  }));

  const allStatic = [...stateDocs, ...partyDocs, ...coalitionDocs];
  const sTexts  = allStatic.map((d) => d.content);
  const sVectors = await embedTexts(sTexts) ?? sTexts.map(() => null);
  total += await bulkIndex(client, allStatic, sVectors);
  console.log(`[elections.indexer] Static (states+parties+coalitions): ${allStatic.length}`);

  // ── 4. DB — ElectionSummary (historical) ─────────────────────────────────
  try {
    // ElectionSummary: year, type, totalSeats, majorWinner, majorSeats, turnout
    const summaries = await prisma.electionSummary.findMany({
      orderBy: { year: "desc" },
      take: 200,
    });

    const dbDocs: IndexedDocument[] = summaries.map((s) => ({
      id:      `election-summary-${s.id}`,
      domain:  "election",
      subtype: "historical",
      title:   `${s.type} Election ${s.year}`,
      content: [
        `${s.type} election held in ${s.year}`,
        `Total seats: ${s.totalSeats}`,
        `Major winner: ${s.majorWinner} with ${s.majorSeats} seats`,
        s.turnout ? `Turnout: ${s.turnout}%` : "",
      ].filter(Boolean).join("\n"),
      snippet: `${s.majorWinner} won ${s.majorSeats} of ${s.totalSeats} seats · ${s.type} ${s.year}`,
      metadata: {
        year:     s.year,
        alliance: s.majorWinner,
        seats:    s.majorSeats,
        turnout:  s.turnout ?? undefined,
        category: "historical-election",
      },
    }));

    // Also index party-level results
    const partyResults = await prisma.partyElectionResult.findMany({
      orderBy: [{ year: "desc" }, { seats: "desc" }],
      take: 300,
    });

    const partyDbs: IndexedDocument[] = partyResults.map((r) => ({
      id:      `party-result-${r.id}`,
      domain:  "election",
      subtype: "party-result",
      title:   `${r.party} — ${r.type} ${r.year}`,
      content: [
        `${r.party} in ${r.type} election ${r.year}`,
        `Seats won: ${r.seats}`,
        r.voteShare ? `Vote share: ${r.voteShare.toFixed(1)}%` : "",
      ].filter(Boolean).join("\n"),
      snippet: `${r.seats} seats · ${r.voteShare ? r.voteShare.toFixed(1) + "%" : ""} · ${r.year}`,
      metadata: { party: r.party, year: r.year, seats: r.seats, category: "party-result" },
    }));

    const allDb = [...dbDocs, ...partyDbs];
    if (allDb.length > 0) {
      const dbTexts   = allDb.map((d) => d.content);
      const dbVectors = await embedTexts(dbTexts) ?? dbTexts.map(() => null);
      total += await bulkIndex(client, allDb, dbVectors);
      console.log(`[elections.indexer] DB elections: ${allDb.length}`);
    }
  } catch {
    console.warn("[elections.indexer] DB unavailable — skipping historical elections");
  }

  return { indexed: total };
}
