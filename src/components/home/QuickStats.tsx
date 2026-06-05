const stats = [
  { label: "Lok Sabha Seats", value: "543", icon: "🏛️" },
  { label: "Rajya Sabha Seats", value: "245", icon: "🏛️" },
  { label: "States & UTs", value: "28 + 8", icon: "🗺️" },
  { label: "Constitutional Articles", value: "395+", icon: "📜" },
  { label: "High Courts", value: "25", icon: "⚖️" },
  { label: "Registered Parties", value: "2,700+", icon: "🏴" },
];

export function QuickStats() {
  return (
    <section className="relative -mt-8 z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card p-4 text-center hover:scale-[1.02] transition-transform"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
