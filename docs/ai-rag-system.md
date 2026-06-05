# AI & RAG System

LokTantra features an integrated AI explainer chatbot designed to simplify complex governance concepts without introducing political bias. It uses a Retrieval-Augmented Generation (RAG) architecture.

## 1. Vector Embeddings

We use OpenAI's `text-embedding-3-small` (or Claude equivalent) to generate vectors for textual data. These vectors are stored in PostgreSQL using the `pgvector` extension.

### Chunking Strategy
- **Constitution**: One chunk per Article, plus separate chunks for official explanations/sub-clauses.
- **Landmark Cases**: One chunk for the summary, one for the legal significance.
- **Bills**: Chunked by section/chapter to fit within the embedding context window.

## 2. Retrieval Pipeline

When a user asks a question (e.g., *"What is an electoral bond?"*):
1. **Intent Classifier**: Determines if the query is factual, comparative, or out-of-scope.
2. **Entity Extractor**: Identifies key entities (e.g., "Electoral Bond").
3. **Multi-modal Search**: 
   - Vector Search (pgvector) for semantic matches.
   - Keyword Search (ElasticSearch) for exact terminology.
   - Graph Traversal (Neo4j) to pull neighboring context.
4. **Reranker**: Cross-encoder ranks the retrieved contexts.
5. **Context Window Builder**: Assembles the top contexts into the LLM prompt.

## 3. Anthropic Claude Generation

We use the Anthropic Claude API for its strong reasoning capabilities and steerability. Responses are streamed back to the client via Server-Sent Events (SSE).

### System Prompt & Guardrails

The LLM is governed by a strict system prompt enforcing absolute neutrality:

> "You are an expert, politically neutral explainer of Indian democracy. Your goal is to educate. 
> 1. You MUST NOT express any political opinions, endorse any party, or criticize any official.
> 2. You MUST cite the provided sources for every factual claim using [Source Name] format.
> 3. If the answer is not in the provided context, you MUST state that you do not know.
> 4. Do not answer questions unrelated to Indian governance, law, or civics."

## 4. Specialized AI Tools

Aside from the general chatbot, the AI layer powers specific UI tools:
- **Bill Simplifier**: "Explain this 100-page bill like I'm 15."
- **Claim Verifier**: Cross-references a user's statement against the database.
