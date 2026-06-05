import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Political History",
  description: "Interactive timeline of Indian democracy — from independence to present day",
};

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  constitutional: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  political: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  judicial: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  electoral: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-500" },
  economic: { bg: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-700 dark:text-rose-400", dot: "bg-rose-500" },
  social: { bg: "bg-teal-50 dark:bg-teal-900/20", text: "text-teal-700 dark:text-teal-400", dot: "bg-teal-500" },
};

export default async function TimelinePage() {
  const events = await prisma.timelineEvent.findMany({ orderBy: { date: "asc" } });

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Political History of India
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            An interactive timeline of the key moments that shaped Indian democracy.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(categoryColors).map(([cat, colors]) => (
              <span key={cat} className={`badge text-[10px] ${colors.bg} ${colors.text} capitalize`}>{cat}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="relative">
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-6">
            {events.map((event) => {
              const colors = categoryColors[event.category] ?? categoryColors.political;
              return (
                <div key={event.id} className="relative flex items-start gap-6">
                  <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 z-10 border-4 border-white dark:border-slate-900`}>
                    <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  </div>
                  <div className={`card p-5 flex-1 border-l-4 ${event.significance === "landmark" ? "border-l-saffron-500" : "border-l-slate-200 dark:border-l-slate-700"}`}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">{event.displayDate}</span>
                      <span className={`badge text-[10px] ${colors.bg} ${colors.text} capitalize`}>{event.category}</span>
                      {event.significance === "landmark" && <span className="badge-saffron text-[10px]">Landmark</span>}
                    </div>
                    <h3 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100">{event.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
