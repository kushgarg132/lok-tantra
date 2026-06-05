const VOYAGE_API = "https://api.voyageai.com/v1/embeddings";
const VOYAGE_MODEL = "voyage-3";
const MAX_BATCH_SIZE = 128;
const MAX_CHARS_PER_TEXT = 8000; // ~2000 tokens, well within voyage-3's 32k limit

export const EMBEDDING_DIMS = 1024;

interface VoyageResponse {
  object: "list";
  data: Array<{ object: "embedding"; embedding: number[]; index: number }>;
  model: string;
  usage: { total_tokens: number };
}

// Embed a single text; returns null if Voyage API is unavailable
export async function embedText(text: string): Promise<number[] | null> {
  const batch = await embedTexts([text]);
  return batch?.[0] ?? null;
}

// Embed multiple texts in API-size batches; returns null if unavailable
export async function embedTexts(texts: string[]): Promise<number[][] | null> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey || texts.length === 0) return null;

  const truncated = texts.map((t) => t.slice(0, MAX_CHARS_PER_TEXT));
  const results: number[][] = [];

  for (let i = 0; i < truncated.length; i += MAX_BATCH_SIZE) {
    const batch = truncated.slice(i, i + MAX_BATCH_SIZE);
    try {
      const res = await fetch(VOYAGE_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: batch, model: VOYAGE_MODEL }),
        signal: AbortSignal.timeout(30_000),
      });

      if (!res.ok) {
        console.error(`[embeddings] Voyage AI ${res.status}: ${await res.text()}`);
        return null;
      }

      const data: VoyageResponse = await res.json();
      // Sort by index to preserve order
      const sorted = [...data.data].sort((a, b) => a.index - b.index);
      results.push(...sorted.map((d) => d.embedding));
    } catch (err) {
      console.error("[embeddings] fetch error:", err);
      return null;
    }
  }

  return results;
}
