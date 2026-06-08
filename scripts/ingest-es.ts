/**
 * Elasticsearch ingestion runner — indexes all LokTantra knowledge into ES with Voyage AI vectors.
 *
 * Usage:
 *   npm run ingest:es            # incremental (creates indices if missing)
 *   npm run ingest:es -- --reset # wipe + rebuild all indices
 */

import { config } from "dotenv"; config({ path: ".env.local" }); config();
import { Client } from "@elastic/elasticsearch";
import { ensureIndices, dropAndRecreate } from "../src/lib/search/indices";
import { indexConstitution }   from "../src/lib/search/indexers/constitution.indexer";
import { indexInstitutions }   from "../src/lib/search/indexers/institutions.indexer";
import { indexRepresentatives } from "../src/lib/search/indexers/representatives.indexer";
import { indexElections }      from "../src/lib/search/indexers/elections.indexer";

const RESET = process.argv.includes("--reset");

async function main() {
  const esUrl = process.env.ELASTICSEARCH_URL;
  if (!esUrl) {
    console.error("ELASTICSEARCH_URL not set — exiting.");
    process.exit(1);
  }

  const client = new Client({
    node: esUrl,
    ...(process.env.ELASTICSEARCH_API_KEY
      ? { auth: { apiKey: process.env.ELASTICSEARCH_API_KEY } }
      : {}),
    tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
  });

  // Health check
  try {
    const health = await client.cluster.health({});
    console.log(`[ES] Cluster: ${health.cluster_name} · status: ${health.status}`);
  } catch (err) {
    console.error("[ES] Cannot reach Elasticsearch:", err);
    process.exit(1);
  }

  // Prepare indices
  if (RESET) {
    console.log("[ES] --reset: dropping and recreating all indices...");
    await dropAndRecreate(client);
  } else {
    await ensureIndices(client);
  }

  const results: Record<string, number> = {};
  const t0 = Date.now();

  // 1. Constitutional articles, doctrines, amendments, landmark cases
  console.log("\n── Constitution ─────────────────────────────────");
  const { indexed: c } = await indexConstitution(client);
  results.constitution = c;

  // 2. Institutions knowledge + governance processes + DB institutions + ministries
  console.log("\n── Institutions & Governance ────────────────────");
  const { indexed: i } = await indexInstitutions(client);
  results.institutions = i;

  // 3. Representatives (persons from DB)
  console.log("\n── Representatives ──────────────────────────────");
  const { indexed: r } = await indexRepresentatives(client);
  results.representatives = r;

  // 4. Elections — state results, party standings, coalitions, historical
  console.log("\n── Elections ────────────────────────────────────");
  const { indexed: e } = await indexElections(client);
  results.elections = e;

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const total   = Object.values(results).reduce((a, b) => a + b, 0);

  console.log(`
╔═══════════════════════════════════════════════╗
║         Elasticsearch Ingestion Complete      ║
╠═══════════════════════════════════════════════╣
║  Constitution     : ${String(results.constitution).padEnd(6)} documents         ║
║  Institutions     : ${String(results.institutions).padEnd(6)} documents         ║
║  Representatives  : ${String(results.representatives).padEnd(6)} documents         ║
║  Elections        : ${String(results.elections).padEnd(6)} documents         ║
╠═══════════════════════════════════════════════╣
║  TOTAL            : ${String(total).padEnd(6)} documents         ║
║  Time             : ${elapsed.padEnd(6)}s                    ║
╚═══════════════════════════════════════════════╝
`);

  if (!process.env.VOYAGE_API_KEY) {
    console.warn("⚠  VOYAGE_API_KEY not set — documents indexed without vectors.");
    console.warn("   Semantic/KNN search will be unavailable; BM25 keyword search still works.");
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
