import { NextRequest, NextResponse } from "next/server";
import { ARTICLES_DATA } from "@/data/constitution/articles-data";
import { DOCTRINES_DATA } from "@/data/constitution/doctrines-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

// Build a short context snippet for the query
function buildContext(query: string): string {
  const q = query.toLowerCase();
  const parts: string[] = [];

  // Find relevant articles
  const relatedArticles = ARTICLES_DATA.filter(
    (a) =>
      q.includes(`article ${a.number.toLowerCase()}`) ||
      q.includes(`art ${a.number.toLowerCase()}`) ||
      q.includes(`art. ${a.number.toLowerCase()}`) ||
      a.keywords?.some((k) => q.includes(k.toLowerCase())) ||
      a.title.toLowerCase().split(" ").some((w) => w.length > 5 && q.includes(w))
  ).slice(0, 3);

  for (const a of relatedArticles) {
    parts.push(
      `Article ${a.number} — ${a.title}:\n${a.explanation}`
    );
  }

  // Find relevant doctrines
  const relatedDoctrines = DOCTRINES_DATA.filter(
    (d) =>
      d.keywords.some((k) => q.includes(k.toLowerCase())) ||
      q.includes(d.shortName?.toLowerCase() || "") ||
      q.includes(d.name.toLowerCase())
  ).slice(0, 2);

  for (const d of relatedDoctrines) {
    parts.push(`${d.name}:\n${d.description}\n${d.detail.slice(0, 500)}`);
  }

  return parts.join("\n\n---\n\n");
}

// Local fallback — structured explanation from static data
function generateLocalExplanation(query: string): string | null {
  const q = query.toLowerCase();

  // Try article number match
  const articleMatch = query.match(/\bart(?:icle)?\.?\s*(\d+[A-Za-z]?)/i);
  if (articleMatch) {
    const num = articleMatch[1].toUpperCase();
    const article = ARTICLES_DATA.find((a) => a.number.toUpperCase() === num);
    if (article) {
      return `**Article ${article.number} — ${article.title}**\n\n${article.explanation}`;
    }
  }

  // Try doctrine match
  const doctrine = DOCTRINES_DATA.find(
    (d) =>
      q.includes(d.name.toLowerCase()) ||
      (d.shortName && q.includes(d.shortName.toLowerCase())) ||
      d.keywords.some((k) => q.includes(k.toLowerCase()))
  );
  if (doctrine) {
    return `**${doctrine.name}**\n\n${doctrine.description}\n\n${doctrine.detail}`;
  }

  return null;
}

export async function POST(request: NextRequest) {
  let query = "";
  try {
    const body = await request.json();
    query = (body.query || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  // Check if Claude API key is configured
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Graceful fallback: return structured static explanation
    const local = generateLocalExplanation(query);
    return NextResponse.json({
      explanation: local || "This concept isn't in our current database. Please check our article and doctrine explorers for related information.",
      source: "local",
      query,
    });
  }

  const context = buildContext(query);
  const systemPrompt = `You are LokTantra's constitutional AI assistant — an expert on the Indian Constitution. You explain constitutional provisions clearly, accurately, and in a way that is accessible to citizens with varying levels of legal knowledge.

Rules:
- Be accurate and cite specific Articles, Amendments, and landmark Supreme Court cases when relevant
- Explain the practical impact, not just the text
- Keep responses concise (150-300 words)
- Use bullet points for lists
- If asked about something outside the Indian Constitution, say so politely
- Never express personal political opinions or advocate for any political party
- Format key terms in **bold**

${context ? `Reference material (from the Indian Constitution):\n\n${context}` : ""}`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: "user", content: query }],
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Claude API returned ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    return NextResponse.json({
      explanation: text,
      source: "claude",
      query,
    });
  } catch (err) {
    // Claude API failed — fall back to local
    const local = generateLocalExplanation(query);
    return NextResponse.json({
      explanation: local || "Unable to generate an explanation at this time. Please browse our Article and Doctrine explorers.",
      source: "local_fallback",
      query,
    });
  }
}
