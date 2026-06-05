import { NextRequest, NextResponse } from "next/server";
import { searchAndAnswer } from "@/lib/search/rag-pipeline";
import { search }          from "@/lib/search/retriever";
import type { SearchDomain, SearchMode } from "@/lib/search/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_DOMAINS  = new Set<SearchDomain>(["constitution", "representative", "institution", "election"]);
const VALID_MODES    = new Set<SearchMode>(["hybrid", "semantic", "lexical"]);

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q  = (sp.get("q") ?? "").trim();
  if (!q) return NextResponse.json({ hits: [], total: 0, took: 0, query: "" });

  const limit   = Math.min(Number(sp.get("limit")  ?? 10), 30);
  const answer  = sp.get("answer") === "true";
  const rawMode = sp.get("mode") ?? "hybrid";
  const mode    = VALID_MODES.has(rawMode as SearchMode) ? (rawMode as SearchMode) : "hybrid";

  // Parse domain filter (comma-separated or "all")
  const rawDomains = sp.get("domains") ?? "all";
  const domains: SearchDomain[] =
    rawDomains === "all"
      ? ["constitution", "representative", "institution", "election"]
      : rawDomains
          .split(",")
          .map((d) => d.trim())
          .filter((d): d is SearchDomain => VALID_DOMAINS.has(d as SearchDomain));

  const filters = {
    state:    sp.get("state")    ?? undefined,
    party:    sp.get("party")    ?? undefined,
    chamber:  sp.get("chamber")  ?? undefined,
    category: sp.get("category") ?? undefined,
    branch:   sp.get("branch")   ?? undefined,
    year:     sp.get("year") ? Number(sp.get("year")) : undefined,
  };

  try {
    if (answer) {
      const result = await searchAndAnswer(q, domains, [], limit);
      return NextResponse.json({
        hits:   result.hits,
        total:  result.hits.length,
        took:   result.took,
        query:  q,
        domains,
        intent: result.intent,
        answer: result.answer,
      });
    } else {
      const result = await search({ q, domains, limit, mode, filters });
      return NextResponse.json(result);
    }
  } catch (err) {
    console.error("[/api/search] error:", err);
    return NextResponse.json({ error: "Search failed", hits: [], total: 0, took: 0, query: q }, { status: 500 });
  }
}
