# AI & RAG System

LokTantra features a politically neutral governance AI assistant powered by Anthropic Claude and a Retrieval-Augmented Generation (RAG) pipeline grounded in constitutional text and official civic data.

---

## 1. Architecture Overview

```
User Message
    │
    ▼
Sanitize (src/lib/security/sanitizer.ts)
    │  max 2000 chars, strip injection patterns
    ▼
Retrieve Knowledge Chunks (src/lib/rag/knowledge.ts)
    │  Fuse.js fuzzy search over 200+ pre-built article chunks
    ▼
Generate Response (src/lib/rag/generator.ts)
    │  Anthropic Claude API — system prompt + retrieved context + conversation history
    ▼
Neutrality Check (src/lib/moderation/service.ts)
    │  auto-scan for political bias keywords; score < threshold → rewrite with safe fallback
    ▼
Return JSON { answer, sources, disclaimer? }
```

---

## 2. Knowledge Base (`src/lib/rag/knowledge.ts`)

The primary knowledge source is a static corpus of pre-built chunks derived from:
- Constitutional articles (Part III Fundamental Rights, Part IV DPSP, key institutional articles)
- Landmark Supreme Court cases (summaries and significance)
- Governance process explanations (how bills become acts, RTI process, etc.)
- Institutional overviews (Parliament, Presidency, Judiciary, Cabinet)

### Chunking Strategy
- **Constitution**: One chunk per Article, plus separate chunks for official explanations and key sub-clauses
- **Landmark Cases**: One chunk for the case summary, one for legal significance and constitutional impact
- **Processes**: One chunk per governance process step (typically 5–10 chunks per process)

### Retrieval
`retrieveRelevantChunks(query, limit=5)` uses Fuse.js fuzzy matching against the pre-built chunk corpus:
- Fuse.js index is built once at module load (singleton)
- Returns top `limit` chunks ranked by relevance score
- Result set is deterministic for the same query

**Current limitation**: Fuse.js is lexical — it cannot handle paraphrases or semantic variants (e.g., "right to live" vs "Article 21"). Full semantic retrieval via Voyage AI embeddings + Elasticsearch KNN is the planned upgrade path (see AUDIT.md).

---

## 3. Embeddings & Semantic Search (`src/lib/search/rag-pipeline.ts`)

For the unified `/api/search` endpoint, LokTantra uses semantic vector embeddings:

- **Provider**: Voyage AI (`voyage-3` model, 1024-dimensional vectors)
- **API key**: `VOYAGE_API_KEY` env var
- **Indexing**: Vectors stored in Elasticsearch using the dense vector field type
- **Query**: Hybrid BM25 + KNN search combining keyword relevance with semantic similarity

The RAG pipeline in `src/lib/search/rag-pipeline.ts` handles embedding generation, Elasticsearch indexing, and hybrid retrieval. The `/api/assistant` route currently uses Fuse.js retrieval (not this pipeline) — migrating assistant retrieval to this semantic pipeline is planned.

---

## 4. Response Generation (`src/lib/rag/generator.ts`)

### Model
Anthropic Claude (model selected by `ANTHROPIC_API_KEY` availability; falls back to graceful error if key is absent).

### System Prompt (~500 tokens)
```
You are an expert, politically neutral explainer of Indian democracy, law, and governance.
Your mission is to educate citizens about constitutional rights, government processes, and civic participation.

Rules:
1. You MUST NOT express political opinions, endorse any party, or criticize any official.
2. You MUST cite the provided sources for every factual claim using [Source] format.
3. If the answer is not in the provided context, state clearly that you do not have information on this.
4. Do not answer questions unrelated to Indian governance, law, or civics.
5. Use simple language. Explain concepts as if talking to an educated non-lawyer.
```

### Request Structure
```typescript
{
  model: "claude-haiku-4-5-20251001",
  max_tokens: 900,
  system: SYSTEM_PROMPT,
  messages: [
    ...history,  // up to 12 prior turns
    { role: "user", content: `${sanitizedMessage}\n\nContext:\n${chunks.map(c => c.text).join('\n\n')}` }
  ]
}
```

**Current limitation**: Responses are fully buffered before returning to the client. For 600+ token responses, this creates a 3–8 second wait with no progressive feedback. Planned fix: stream via SSE (`text/event-stream`).

**Cost note**: The ~500-token system prompt is sent on every request. Using Anthropic's prompt caching (`cache_control: { type: "ephemeral" }`) on the system block would cache it for 5 minutes and reduce repeated token costs by ~90% for busy periods (see AUDIT.md).

---

## 5. Neutrality Check (`src/lib/moderation/service.ts`)

Before every AI response is returned to the user, it passes through an automated neutrality scanner:

1. Score the response for political bias keywords (party names in advocacy context, inflammatory language, partisan framing)
2. If `neutralityScore < threshold` → **block** the response and substitute a safe fallback:
   ```
   "I can provide factual constitutional information on this topic. Please ask about a specific constitutional article, law, or official government process."
   ```
3. If minor issues found but not severe → **append disclaimer**: `"LokTantra only provides constitutionally grounded, politically neutral civic information."`
4. Clean responses pass through unchanged

Blocked responses are audit-logged with the issues and neutrality score for review.

---

## 6. Rate Limiting

The `/api/assistant` route uses Redis-backed rate limiting (independent of the middleware in-memory limiter):

| User type | Limit | Window |
|-----------|-------|--------|
| Unauthenticated | 10 req | 60s |
| Authenticated (USER) | 15 req | 60s |
| Authenticated (RESEARCHER) | 30 req | 60s |
| Authenticated (ADMIN) | 60 req | 60s |

Rate limit headers: `X-RateLimit-Remaining`, `Retry-After`.

---

## 7. Constitution Explain Route (`/api/constitution/explain`)

A specialized Claude route for generating simplified explanations of individual constitutional articles:

1. Fetches the article text from PostgreSQL
2. Retrieves related amendment history and landmark cases
3. Builds a focused prompt: "Explain Article X in plain language, citing [Y amendments] and [Z cases]"
4. Returns `{ explanation, sources, simplified, layman_summary }`

Falls back to a local template explanation if `ANTHROPIC_API_KEY` is not set.

---

## 8. Guardrails Summary

| Layer | Mechanism |
|-------|-----------|
| Input sanitization | Strip injection patterns, cap at 2000 chars |
| Conversation limit | Max 12-turn history per request |
| Zod validation | Type-safe request body parsing at the route level |
| System prompt | Strict neutrality instructions baked into every request |
| Output neutrality check | Automated keyword-based bias scanner |
| Rate limiting | Redis-backed per-user/IP limits |
| Audit logging | Blocked responses logged with score and issues |

---

## 9. Planned Improvements

See [AUDIT.md](../AUDIT.md) for the full roadmap. Key AI improvements:

| Improvement | Impact | Effort |
|-------------|--------|--------|
| Stream responses via SSE | Eliminates 3–8s wait; better UX | Medium |
| Anthropic prompt caching on system block | ~90% token cost reduction | Low |
| Upgrade retrieval to Voyage AI KNN (Elasticsearch) | Semantic "right to live" → Article 21 matching | High |
| LRU cache for repeated Fuse.js queries | Avoid re-searching identical questions | Low |
| Dynamic `max_tokens` based on estimated input size | Prevents truncated responses on long inputs | Low |
