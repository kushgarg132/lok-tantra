import Link from "next/link";

const features = [
  {
    title: "Interactive Power Structure",
    description: "Visualize how governance flows from the President to your local panchayat. See who reports to whom, who appoints whom, and how checks and balances work.",
    href: "/power-structure",
    color: "saffron",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="5" r="3" /><line x1="12" y1="8" x2="12" y2="14" />
        <circle cx="6" cy="19" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="12" y1="14" x2="6" y2="16" /><line x1="12" y1="14" x2="18" y2="16" />
      </svg>
    ),
  },
  {
    title: "Constitution Explorer",
    description: "Read every article, understand every amendment, explore fundamental rights — with plain language explanations and linked landmark judgments.",
    href: "/constitution",
    color: "blue",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" />
      </svg>
    ),
  },
  {
    title: "Find Your Representatives",
    description: "Discover your MP, MLA, and local councillor by entering your location. Get their profiles, contact details, and performance metrics.",
    href: "/representatives",
    color: "emerald",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Election Analytics",
    description: "Historical election data, seat-wise results, party performance, swing analysis, and constituency-level maps with demographic overlays.",
    href: "/elections",
    color: "purple",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    title: "Judiciary Intelligence",
    description: "Supreme Court hierarchy, 25 High Courts, landmark judgments, constitutional benches, PIL workflows, appeals flow, and the judgment citation network.",
    href: "/judiciary",
    color: "jade",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: "Bureaucracy Intelligence",
    description: "IAS/IPS/IFoS rank pyramids, PMO org chart, Cabinet Secretariat, district administration from Collector to Patwari, and how policy flows from PM to citizen in 8 steps.",
    href: "/bureaucracy",
    color: "slate",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        <line x1="6" y1="8" x2="18" y2="8" /><line x1="6" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    title: "Governance Simulator",
    description: "Simulate passing a bill, forming a coalition, declaring an emergency, or amending the Constitution. Learn by doing.",
    href: "/simulator",
    color: "rose",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
  {
    title: "Citizen Action Center",
    description: "Learn how to file RTI, PIL, public grievances. Templates, step-by-step guides, and escalation paths for every citizen tool.",
    href: "/citizen-action",
    color: "amber",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91" />
      </svg>
    ),
  },
  {
    title: "Governance Assistant",
    description: "Ask anything about Indian democracy in plain language. AI-powered Q&A grounded in the Constitution with article citations and case references.",
    href: "/assistant",
    color: "teal",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Political Funding & Transparency",
    description: "Follow the money — electoral bonds (₹16,518 cr), corporate donation flows, MP affidavits, and the influence network connecting donors to parties to policy.",
    href: "/funding",
    color: "red",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="8" y1="10" x2="16" y2="10" />
      </svg>
    ),
  },
];

const colorMap: Record<string, string> = {
  saffron: "bg-saffron-100 text-saffron-600 dark:bg-saffron-900/30 dark:text-saffron-400 group-hover:bg-saffron-200",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-200",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 group-hover:bg-emerald-200",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 group-hover:bg-purple-200",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 group-hover:bg-rose-200",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 group-hover:bg-amber-200",
  teal: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 group-hover:bg-teal-200",
  jade: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 group-hover:bg-emerald-200",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-slate-200",
  red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 group-hover:bg-red-200",
};

export function FeatureGrid() {
  return (
    <section className="py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-heading">
            Everything About Indian Governance
          </h2>
          <p className="section-subheading mx-auto mt-3">
            From the Constitution to your local ward — explore every layer of Indian democracy
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="card-interactive p-6 group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${colorMap[feature.color]}`}
              >
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-display font-bold text-slate-900 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-saffron-600 dark:text-saffron-400">
                Explore
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
