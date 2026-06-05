import type { Client } from "@elastic/elasticsearch";
import { EMBEDDING_DIMS } from "./embeddings";

export const IDX = {
  constitution:   "loktantra_constitution",
  representative: "loktantra_representative",
  institution:    "loktantra_institution",
  election:       "loktantra_election",
} as const;

// All indices in one array for multi-index searches
export const ALL_INDICES = Object.values(IDX).join(",");

// ── Common mapping shared by every index ──────────────────────────────────────
const SHARED_MAPPING = {
  dynamic: false as const,
  properties: {
    id:      { type: "keyword" as const },
    domain:  { type: "keyword" as const },
    subtype: { type: "keyword" as const },
    title: {
      type: "text" as const,
      analyzer: "english",
      fields: { raw: { type: "keyword" as const, ignore_above: 256 } },
    },
    content: { type: "text" as const, analyzer: "english" },
    snippet: { type: "text" as const, index: false as const },
    vector: {
      type: "dense_vector" as const,
      dims: EMBEDDING_DIMS,
      index: true,
      similarity: "cosine" as const,
    },
    // Metadata fields promoted to top-level for filtering
    "metadata.articleNumber":   { type: "keyword" as const },
    "metadata.partNum":         { type: "integer" as const },
    "metadata.category":        { type: "keyword" as const },
    "metadata.keywords":        { type: "keyword" as const },
    "metadata.year":            { type: "integer" as const },
    "metadata.state":           { type: "keyword" as const },
    "metadata.party":           { type: "keyword" as const },
    "metadata.chamber":         { type: "keyword" as const },
    "metadata.constituency":    { type: "keyword" as const },
    "metadata.designation":     { type: "keyword" as const },
    "metadata.branch":          { type: "keyword" as const },
    "metadata.level":           { type: "keyword" as const },
    "metadata.article":         { type: "keyword" as const },
    "metadata.alliance":        { type: "keyword" as const },
    "metadata.seats":           { type: "integer" as const },
    "metadata.turnout":         { type: "float" as const },
    "metadata.relatedArticles": { type: "keyword" as const },
  },
};

const SETTINGS = {
  number_of_shards: 1,
  number_of_replicas: 0,
};

export async function ensureIndices(client: Client): Promise<void> {
  for (const name of Object.values(IDX)) {
    const exists = await client.indices.exists({ index: name });
    if (!exists) {
      await client.indices.create({
        index: name,
        settings: SETTINGS,
        mappings: SHARED_MAPPING,
      });
      console.log(`[indices] Created: ${name}`);
    }
  }
}

export async function dropAndRecreate(client: Client): Promise<void> {
  for (const name of Object.values(IDX)) {
    const exists = await client.indices.exists({ index: name });
    if (exists) await client.indices.delete({ index: name });
    await client.indices.create({
      index: name,
      settings: SETTINGS,
      mappings: SHARED_MAPPING,
    });
    console.log(`[indices] Recreated: ${name}`);
  }
}
