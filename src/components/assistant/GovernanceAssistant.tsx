"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import type { AssistantMessage, Citation } from "@/lib/rag/types";
import FlagContent from "@/components/moderation/FlagContent";

// ─── Example queries ───────────────────────────────────────────────────────────
const EXAMPLE_QUERIES = [
  { label: "Who controls police?", category: "Institutional" },
  { label: "Can PM remove CM?", category: "Federal" },
  { label: "How does PIL work?", category: "Process" },
  { label: "Who appoints judges?", category: "Judiciary" },
  { label: "How is a bill passed?", category: "Process" },
  { label: "What is Basic Structure Doctrine?", category: "Constitutional" },
  { label: "How does Article 356 work?", category: "Emergency" },
  { label: "What are my RTI rights?", category: "Citizen Rights" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Institutional: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Federal: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Process: "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300",
  Judiciary: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Constitutional: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Emergency: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "Citizen Rights": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
};

// ─── Citation chip ─────────────────────────────────────────────────────────────
function CitationChip({ citation }: { citation: Citation }) {
  const colorMap: Record<string, string> = {
    article: "bg-saffron-50 border-saffron-200 text-saffron-700 dark:bg-saffron-900/20 dark:border-saffron-800 dark:text-saffron-300",
    case: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300",
    amendment: "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300",
    act: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
    schedule: "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold ${colorMap[citation.type] || colorMap.article}`}>
      {citation.label}
    </span>
  );
}

// ─── Source pill ───────────────────────────────────────────────────────────────
function SourcePill({ title, category }: { title: string; category: string }) {
  const c = CATEGORY_COLORS[category] || CATEGORY_COLORS.Institutional;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${c}`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {title}
    </span>
  );
}

// ─── Markdown renderer ─────────────────────────────────────────────────────────
function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;

        // Heading
        if (line.startsWith("### ")) {
          return <h4 key={i} className="font-bold text-slate-800 dark:text-slate-200 mt-2 mb-1">{parseInline(line.slice(4))}</h4>;
        }
        if (line.startsWith("## ")) {
          return <h3 key={i} className="font-bold text-slate-800 dark:text-slate-200 text-base mt-2 mb-1">{parseInline(line.slice(3))}</h3>;
        }

        // Bullet
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2 items-baseline">
              <span className="text-saffron-400 shrink-0 mt-0.5">•</span>
              <span className="text-sm">{parseInline(line.slice(2))}</span>
            </div>
          );
        }

        // Numbered
        const numMatch = line.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          return (
            <div key={i} className="flex gap-2 items-baseline">
              <span className="text-saffron-500 text-xs font-bold shrink-0 w-4">{numMatch[1]}.</span>
              <span className="text-sm">{parseInline(numMatch[2])}</span>
            </div>
          );
        }

        // Normal paragraph
        return <p key={i} className="text-sm leading-relaxed">{parseInline(line)}</p>;
      })}
    </div>
  );
}

function parseInline(text: string): ReactNode {
  // Bold, italic, code inline
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    // Citation-like brackets — render as citation chip
    if (part.startsWith("[") && part.endsWith("]")) {
      const inner = part.slice(1, -1);
      return (
        <span key={i} className="inline-flex items-center mx-0.5 px-1.5 py-0.5 rounded bg-saffron-50 dark:bg-saffron-900/20 border border-saffron-200 dark:border-saffron-800 text-saffron-700 dark:text-saffron-300 text-[10px] font-semibold">
          {inner}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Single chat message ───────────────────────────────────────────────────────
function ChatBubble({ msg, msgIndex, onFollowUp }: { msg: AssistantMessage; msgIndex: number; onFollowUp: (q: string) => void }) {
  const [showSources, setShowSources] = useState(false);
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-saffron-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-saffron-400 to-navy-600 flex items-center justify-center mt-0.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card p-4 rounded-2xl rounded-tl-sm">
          <div className="text-slate-700 dark:text-slate-300">
            <MarkdownText text={msg.content} />
          </div>

          {/* Citations */}
          {msg.citations && msg.citations.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {msg.citations.map((c, i) => (
                <CitationChip key={i} citation={c} />
              ))}
            </div>
          )}

          {/* Sources toggle */}
          {msg.retrievedSources && msg.retrievedSources.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowSources(!showSources)}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
              >
                <svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`transition-transform ${showSources ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
                {showSources ? "Hide" : "Show"} {msg.retrievedSources.length} source{msg.retrievedSources.length !== 1 ? "s" : ""}
              </button>

              {showSources && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.retrievedSources.map((s) => (
                    <SourcePill
                      key={s.id}
                      title={s.title}
                      category={s.category === "governance_process" ? "Process" :
                                s.category === "constitutional" ? "Constitutional" :
                                s.category === "institutional" ? "Institutional" :
                                s.category === "judiciary" ? "Judiciary" :
                                s.category === "elections" ? "Elections" :
                                s.category === "federal" ? "Federal" : "Citizen Rights"}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1 gap-2">
          {/* Follow-up suggestions */}
          {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {msg.suggestedFollowUps.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onFollowUp(q)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-saffron-300 dark:hover:border-saffron-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <FlagContent
            contentType="assistant_response"
            contentId={`assistant-msg-${msgIndex}`}
            contentSnippet={msg.content.slice(0, 200)}
            className="ml-auto shrink-0"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-saffron-400 to-navy-600 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="card px-4 py-3 rounded-2xl rounded-tl-sm">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function GovernanceAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setHasStarted(true);
    setInput("");

    const userMsg: AssistantMessage = {
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      const assistantMsg: AssistantMessage = {
        role: "assistant",
        content: data.answer || "I couldn't generate a response. Please try again.",
        citations: data.citations || [],
        suggestedFollowUps: data.suggestedFollowUps || [],
        retrievedSources: data.sources || [],
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please check your connection and try again.",
          citations: [],
          suggestedFollowUps: [],
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleFollowUp = (q: string) => {
    sendMessage(q);
  };

  const resetConversation = () => {
    setMessages([]);
    setHasStarted(false);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[500px] max-h-[800px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {!hasStarted ? (
          <WelcomeScreen onQuery={(q) => { setInput(q); sendMessage(q); }} />
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} msgIndex={i} onFollowUp={handleFollowUp} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
        <div className="flex gap-3">
          {hasStarted && (
            <button
              onClick={resetConversation}
              className="shrink-0 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="New conversation"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
          )}

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Indian governance, Constitution, institutions..."
              rows={1}
              className="w-full resize-none px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-saffron-400 dark:focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 dark:focus:ring-saffron-900 transition-all leading-relaxed"
              style={{ minHeight: "48px", maxHeight: "140px" }}
              onInput={(e) => {
                const target = e.currentTarget;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 140) + "px";
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-saffron-500 text-white hover:bg-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m22 2-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          AI assistant grounded in the Indian Constitution. Not legal advice. Press Enter to send, Shift+Enter for newline.
        </p>
      </div>
    </div>
  );
}

// ─── Welcome screen ────────────────────────────────────────────────────────────
function WelcomeScreen({ onQuery }: { onQuery: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-400 to-navy-700 flex items-center justify-center mb-6 shadow-lg">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      <h2 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100 mb-2">
        Governance Assistant
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        Ask anything about Indian democracy — constitutional provisions, governance processes,
        institutional powers, or citizens' rights. Answers grounded in the Constitution and law.
      </p>

      {/* Capability badges */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { icon: "📜", label: "Constitutional provisions" },
          { icon: "🏛️", label: "Institutional powers" },
          { icon: "⚖️", label: "Judiciary & courts" },
          { icon: "🔄", label: "Governance processes" },
          { icon: "🗳️", label: "Elections" },
          { icon: "🛡️", label: "Citizens' rights" },
        ].map((cap) => (
          <span
            key={cap.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          >
            <span>{cap.icon}</span>
            {cap.label}
          </span>
        ))}
      </div>

      {/* Example queries */}
      <div className="w-full max-w-2xl">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Try asking
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q.label}
              onClick={() => onQuery(q.label)}
              className="flex items-center gap-3 p-3 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-saffron-300 dark:hover:border-saffron-700 hover:bg-saffron-50 dark:hover:bg-saffron-900/10 transition-all group"
            >
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${CATEGORY_COLORS[q.category] || ""}`}>
                {q.category}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                {q.label}
              </span>
              <svg className="ml-auto shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-saffron-400 transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
