import { search } from "./retriever";
import { parseCitations } from "@/lib/rag/generator";
import type { SearchHit, SearchAnswer, SearchDomain } from "./types";

const CLAUDE_API = "https://api.anthropic.com/v1/messages";

// ── Context builder ────────────────────────────────────────────────────────────
function buildRAGContext(hits: SearchHit[]): string {
  if (hits.length === 0) return "";

  return (
    "RETRIEVED KNOWLEDGE — Indian Constitution, Governance & Democracy:\n\n" +
    hits
      .slice(0, 8)
      .map((h, i) => {
        const meta: string[] = [];
        if (h.domain === "constitution" && h.metadata.articleNumber)
          meta.push(`Art. ${h.metadata.articleNumber}`);
        if (h.metadata.year) meta.push(`${h.metadata.year}`);
        if (h.metadata.state) meta.push(`State: ${h.metadata.state}`);
        return `[SOURCE ${i + 1}${meta.length ? " — " + meta.join(", ") : ""}]: ${h.title}\n${h.content.slice(0, 600)}`;
      })
      .join("\n\n---\n\n")
  );
}

// ── Domain-aware follow-ups ────────────────────────────────────────────────────
function followUps(q: string, hits: SearchHit[]): string[] {
  const lq     = q.toLowerCase();
  const domains = Array.from(new Set(hits.map((h) => h.domain)));

  if (/article\s*21|right to life/i.test(q))
    return ["What rights flow from Article 21?", "What is the Basic Structure Doctrine?", "How do writs protect fundamental rights?"];
  if (/police|law enforcement/i.test(q))
    return ["Who controls CBI?", "Can states withdraw CBI consent?", "Who appoints the Director General of Police?"];
  if (/pil|public interest/i.test(q))
    return ["How to file a PIL in Supreme Court?", "Can PIL be filed in High Courts?", "What is the difference between PIL and writ petition?"];
  if (/election|voting|eci/i.test(q))
    return ["How are EVM and VVPAT connected?", "What is the Model Code of Conduct?", "How does delimitation work?"];
  if (/bill|parliament|lok sabha|rajya sabha/i.test(q))
    return ["What is a Money Bill vs ordinary bill?", "How does Rajya Sabha deal with Money Bills?", "What is the Budget process?"];
  if (/governor|president/i.test(q))
    return ["What happens when a Governor withholds assent?", "Can the President refuse to sign a Bill?", "What is President's Rule?"];
  if (/constitution|amendment/i.test(q))
    return ["What is the Basic Structure Doctrine?", "Which amendments changed Fundamental Rights?", "How does the amendment procedure work?"];
  if (/representative|mp|minister|cm/i.test(lq) || domains.includes("representative"))
    return ["How are ministers appointed?", "What is the anti-defection law?", "What are the powers of an MP?"];
  if (domains.includes("election"))
    return ["Which state had the highest turnout in 2024?", "How many seats did NDA win in 2024?", "What is the INDIA bloc?"];

  return ["How does law-making work in India?", "Who controls police in India?", "What are fundamental rights under Part III?"];
}

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM = `You are LokTantra's governance assistant — an expert on Indian democracy, constitutional law, governance, and public institutions. You answer questions accurately, citing specific constitutional articles, laws, and landmark Supreme Court cases.

RULES:
1. ACCURACY: Only state facts you are confident about. If uncertain, say so explicitly.
2. CITATIONS: Always cite [Art. X], [Bommai, 1994], [42nd Amendment] inline.
3. NEUTRALITY: Be strictly politically neutral. Describe constitutional provisions only.
4. SOURCES: When answering, draw from the retrieved sources provided. Do not contradict them.
5. FORMAT: Use markdown. Bold key terms, use bullets for lists. Keep answers to 200–400 words.
6. HALLUCINATION PREVENTION: Say "I don't have detailed information on this specific topic" rather than inventing facts.`;

// ── Main entry: search + generate answer ──────────────────────────────────────
export async function searchAndAnswer(
  q: string,
  domains: SearchDomain[],
  history: Array<{ role: "user" | "assistant"; content: string }> = [],
  limit = 10,
): Promise<{ hits: SearchHit[]; answer: SearchAnswer; took: number; intent?: string }> {
  const t0 = Date.now();

  // Retrieve top hits (hybrid where possible)
  const result = await search({ q, domains, limit, mode: "hybrid" });
  const hits   = result.hits;
  const context = buildRAGContext(hits);
  const sources = hits.slice(0, 6).map((h) => ({ id: h.id, title: h.title, domain: h.domain }));

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Local fallback answer from top hit
    const top = hits[0];
    const text = top
      ? `**${top.title}**\n\n${top.content.slice(0, 500)}${top.content.length > 500 ? "…" : ""}`
      : "I don't have specific information on this topic. Please try rephrasing or browse the Constitution Explorer.";

    return {
      hits,
      answer: {
        text,
        citations:  parseCitations(text),
        followUps:  followUps(q, hits),
        confidence: hits.length >= 2 ? "medium" : "low",
        sources,
      },
      took: Date.now() - t0,
      intent: result.intent,
    };
  }

  const messages = [
    ...history.slice(-6),
    { role: "user" as const, content: q },
  ];

  try {
    const res = await fetch(CLAUDE_API, {
      method: "POST",
      headers: {
        "x-api-key":        apiKey,
        "anthropic-version": "2023-06-01",
        "content-type":     "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 900,
        system: context ? `${SYSTEM}\n\n${context}` : SYSTEM,
        messages,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    const data = await res.json();
    const text: string = data.content?.[0]?.text ?? "";
    const confidence = hits.length >= 3 ? "high" : hits.length >= 1 ? "medium" : "low";

    return {
      hits,
      answer: {
        text,
        citations:  parseCitations(text),
        followUps:  followUps(q, hits),
        confidence: confidence as "high" | "medium" | "low",
        sources,
      },
      took: Date.now() - t0,
      intent: result.intent,
    };
  } catch {
    // Claude timeout / error — return best local answer
    const top = hits[0];
    const text = top
      ? `**${top.title}**\n\n${top.content.slice(0, 500)}`
      : "I couldn't generate an answer right now. Please try again.";
    return {
      hits,
      answer: {
        text,
        citations:  parseCitations(text),
        followUps:  followUps(q, hits),
        confidence: "low",
        sources,
      },
      took: Date.now() - t0,
      intent: result.intent,
    };
  }
}
