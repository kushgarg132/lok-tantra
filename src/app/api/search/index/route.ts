import { NextRequest, NextResponse } from "next/server";
import { getESClient } from "@/lib/search/client";
import { ensureIndices, dropAndRecreate } from "@/lib/search/indices";
import { indexConstitution }   from "@/lib/search/indexers/constitution.indexer";
import { indexInstitutions }   from "@/lib/search/indexers/institutions.indexer";
import { indexRepresentatives } from "@/lib/search/indexers/representatives.indexer";
import { indexElections }      from "@/lib/search/indexers/elections.indexer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple bearer-token guard (set SEARCH_INDEX_SECRET in env)
function authorised(request: NextRequest): boolean {
  const secret = process.env.SEARCH_INDEX_SECRET;
  if (!secret) return true; // No secret configured → open (dev only)
  const auth = request.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getESClient();
  if (!client) {
    return NextResponse.json(
      { error: "Elasticsearch not configured. Set ELASTICSEARCH_URL in environment." },
      { status: 503 },
    );
  }

  const body  = await request.json().catch(() => ({}));
  const reset = body?.reset === true;

  const t0 = Date.now();

  try {
    if (reset) {
      await dropAndRecreate(client);
    } else {
      await ensureIndices(client);
    }

    // Run all four indexers; failures are isolated so one domain error doesn't kill the rest
    const [constitution, institutions, representatives, elections] = await Promise.allSettled([
      indexConstitution(client),
      indexInstitutions(client),
      indexRepresentatives(client),
      indexElections(client),
    ]);

    const summary = {
      constitution:   constitution.status   === "fulfilled" ? constitution.value   : { indexed: 0, error: String((constitution  as PromiseRejectedResult).reason) },
      institutions:   institutions.status   === "fulfilled" ? institutions.value   : { indexed: 0, error: String((institutions  as PromiseRejectedResult).reason) },
      representatives: representatives.status === "fulfilled" ? representatives.value : { indexed: 0, error: String((representatives as PromiseRejectedResult).reason) },
      elections:      elections.status      === "fulfilled" ? elections.value      : { indexed: 0, error: String((elections     as PromiseRejectedResult).reason) },
    };

    const total = Object.values(summary).reduce(
      (sum, v) => sum + (("indexed" in v) ? v.indexed : 0),
      0,
    );

    return NextResponse.json({
      ok:    true,
      took:  Date.now() - t0,
      total,
      reset,
      summary,
    });
  } catch (err) {
    console.error("[/api/search/index] fatal error:", err);
    return NextResponse.json(
      { error: String(err), took: Date.now() - t0 },
      { status: 500 },
    );
  }
}

export async function GET() {
  const client = getESClient();
  if (!client) {
    return NextResponse.json({ status: "unconfigured", elasticsearch: false });
  }

  try {
    const health = await client.cluster.health();
    return NextResponse.json({
      status:         "ok",
      elasticsearch:  true,
      clusterStatus:  health.status,
      voyageEmbeddings: !!process.env.VOYAGE_API_KEY,
    });
  } catch {
    return NextResponse.json({ status: "error", elasticsearch: false });
  }
}
