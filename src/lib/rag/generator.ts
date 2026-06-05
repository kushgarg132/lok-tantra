import type { KnowledgeChunk, Citation, AssistantResponse } from "./types";

const CLAUDE_API = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are LokTantra's governance assistant — an expert on Indian democracy, constitutional law, governance, and public institutions. You answer questions accurately, citing specific constitutional articles, laws, and landmark Supreme Court cases.

RULES:
1. ACCURACY: Only state facts you are confident about. If uncertain, say so explicitly.
2. CITATIONS: Always cite relevant constitutional articles (e.g., Art 74, Art 356) and landmark cases (e.g., Bommai 1994). Use the format [Art. 21], [Bommai, 1994], [42nd Amendment].
3. NEUTRALITY: Be strictly politically neutral. Do not favor any political party, government, or ideology. Describe constitutional provisions and legal positions only.
4. HALLUCINATION PREVENTION: If the context doesn't cover the question, say "I don't have detailed information on this specific topic" rather than inventing facts.
5. FEDERALISM: Respect that India has both Union and State governments with defined powers. Don't imply one is superior unless the Constitution says so.
6. PLAIN LANGUAGE: Explain complex governance in simple terms. Use examples when helpful.
7. FORMAT: Use markdown — bold key terms, use bullet points for lists, keep answers focused and 200-400 words unless complexity requires more.

WHAT YOU COVER:
- Constitutional provisions and their interpretation
- Governance processes (how laws are made, how emergencies work, how PIL is filed)
- Institutional hierarchy and powers (President, PM, Governor, CM, Parliament, Courts)
- Federal structure (who controls what — police, taxation, health)
- Judicial system and appointments
- Elections and electoral processes
- Citizens' rights and remedies (RTI, PIL, Lokpal, writs)

WHAT YOU DO NOT COVER:
- Current political news or recent events
- Speculative political analysis ("which party will win")
- Personal opinions on political matters
- Legal advice for specific personal cases`;

function buildContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return "";

  return (
    "REFERENCE MATERIAL FROM INDIAN CONSTITUTION AND GOVERNANCE:\n\n" +
    chunks
      .map((c, i) => `[SOURCE ${i + 1}]: ${c.title}\n${c.content}`)
      .join("\n\n---\n\n")
  );
}

function parseCitations(text: string): Citation[] {
  const citations: Citation[] = [];
  const seen = new Set<string>();

  // Article citations: [Art. 21], [Art 368], [Article 356]
  const artRe = /\[Art(?:icle)?\.?\s*(\d+[A-Za-z]?)\]/g;
  for (const m of Array.from(text.matchAll(artRe))) {
    const ref = m[1];
    if (!seen.has(`art-${ref}`)) {
      citations.push({ type: "article", ref, label: `Article ${ref}` });
      seen.add(`art-${ref}`);
    }
  }

  // Case citations: [Bommai, 1994], [Kesavananda, 1973]
  const caseRe = /\[([A-Za-z\s.]+),\s*(\d{4})\]/g;
  for (const m of Array.from(text.matchAll(caseRe))) {
    const ref = `${m[1].trim()} (${m[2]})`;
    if (!seen.has(`case-${ref}`)) {
      citations.push({ type: "case", ref, label: ref });
      seen.add(`case-${ref}`);
    }
  }

  // Amendment citations: [42nd Amendment], [44th Amendment]
  const amRe = /\[(\d+(?:st|nd|rd|th)?\s+Amendment[^[\]]*)\]/g;
  for (const m of Array.from(text.matchAll(amRe))) {
    const ref = m[1];
    if (!seen.has(`am-${ref}`)) {
      citations.push({ type: "amendment", ref, label: ref });
      seen.add(`am-${ref}`);
    }
  }

  // Act citations: [RTI Act, 2005], [PMLA]
  const actRe = /\[([A-Z][A-Za-z\s]+Act[^[\]]*)\]/g;
  for (const m of Array.from(text.matchAll(actRe))) {
    const ref = m[1];
    if (!seen.has(`act-${ref}`)) {
      citations.push({ type: "act", ref, label: ref });
      seen.add(`act-${ref}`);
    }
  }

  return citations;
}

function extractFollowUps(query: string, chunks: KnowledgeChunk[]): string[] {
  const q = query.toLowerCase();
  const suggestions: string[] = [];

  if (/police/.test(q)) {
    suggestions.push("What is the difference between CBI and state police?", "Who appoints the DGP of a state?");
  } else if (/pil|public interest/.test(q)) {
    suggestions.push("What are the grounds for filing a PIL?", "Can PIL be filed against private companies?");
  } else if (/president|art 352|emergency/.test(q)) {
    suggestions.push("What happens to Fundamental Rights during Emergency?", "How many times has National Emergency been declared?");
  } else if (/judge|collegium|njac/.test(q)) {
    suggestions.push("What is the Basic Structure Doctrine?", "How are High Court judges transferred?");
  } else if (/pm.*cm|cm.*pm|centre.*state|federal/.test(q)) {
    suggestions.push("What is the 7th Schedule of the Constitution?", "How does President's Rule work?");
  } else if (/rti|right to information/.test(q)) {
    suggestions.push("What information can be denied under RTI?", "What is Lokpal and how does it work?");
  } else if (/bill.*law|law.*making|parliament/.test(q)) {
    suggestions.push("What is the difference between a Money Bill and an ordinary bill?", "How does the Budget process work?");
  } else if (/article 21|life.*liberty/.test(q)) {
    suggestions.push("What rights flow from Article 21?", "What is the Basic Structure Doctrine?");
  }

  // Add general governance questions
  if (suggestions.length === 0) {
    suggestions.push(
      "How does the law-making process work?",
      "Who controls police in India?",
      "How does PIL work?"
    );
  }

  return suggestions.slice(0, 3);
}

export async function generateResponse(
  query: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  chunks: KnowledgeChunk[]
): Promise<AssistantResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const context = buildContext(chunks);
  const sources = chunks.map((c) => ({ id: c.id, title: c.title, category: c.category }));

  // Local fallback answer
  const fallbackAnswer = generateLocalAnswer(query, chunks);

  if (!apiKey) {
    return {
      answer: fallbackAnswer,
      citations: parseCitations(fallbackAnswer),
      suggestedFollowUps: extractFollowUps(query, chunks),
      sources,
      confidence: chunks.length > 0 ? "medium" : "low",
    };
  }

  const messages = [
    // Inject history (last 6 messages max)
    ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
    {
      role: "user" as const,
      content: query,
    },
  ];

  try {
    const response = await fetch(CLAUDE_API, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 900,
        system: context
          ? `${SYSTEM_PROMPT}\n\n${context}`
          : SYSTEM_PROMPT,
        messages,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const answer: string = data.content?.[0]?.text || fallbackAnswer;

    return {
      answer,
      citations: parseCitations(answer),
      suggestedFollowUps: extractFollowUps(query, chunks),
      sources,
      confidence: chunks.length >= 2 ? "high" : "medium",
    };
  } catch {
    return {
      answer: fallbackAnswer,
      citations: parseCitations(fallbackAnswer),
      suggestedFollowUps: extractFollowUps(query, chunks),
      sources,
      confidence: chunks.length > 0 ? "medium" : "low",
    };
  }
}

// ─── Local fallback ────────────────────────────────────────────────────────────
function generateLocalAnswer(query: string, chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) {
    return "I don't have specific information on this topic in my knowledge base. Please try rephrasing your question or browse the Constitution Explorer for relevant articles.";
  }

  const top = chunks[0];
  return `**${top.title}**\n\n${top.content.slice(0, 600)}${top.content.length > 600 ? "..." : ""}\n\n${
    top.articleRefs.length > 0
      ? `_Relevant Articles: ${top.articleRefs.map((a) => `[Art. ${a}]`).join(", ")}_`
      : ""
  }`;
}
