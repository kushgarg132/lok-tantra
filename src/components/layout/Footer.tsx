import Link from "next/link";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { href: "/power-structure", label: "Power Structure" },
      { href: "/institutions", label: "Institutions" },
      { href: "/representatives", label: "Find Representatives" },
      { href: "/map", label: "Governance Map" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/constitution", label: "Constitution" },
      { href: "/learn", label: "Learning Paths" },
      { href: "/simulator", label: "Governance Simulator" },
      { href: "/timeline", label: "Political History" },
    ],
  },
  {
    title: "Analyze",
    links: [
      { href: "/elections", label: "Elections" },
      { href: "/parties", label: "Political Parties" },
      { href: "/judiciary", label: "Judiciary" },
      { href: "/bureaucracy", label: "Bureaucracy" },
    ],
  },
  {
    title: "Participate",
    links: [
      { href: "/citizen-action", label: "Citizen Action Center" },
      { href: "/dashboard", label: "Live Dashboard" },
      { href: "/citizen-action#rti", label: "File RTI" },
      { href: "/citizen-action#pil", label: "File PIL" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-saffron flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <span className="font-display font-bold">
                Lok<span className="text-saffron-500">Tantra</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              The operating system for understanding Indian democracy. Open, neutral, and built for every citizen.
            </p>
            <div className="mt-4 flex items-center gap-1">
              <div className="w-6 h-1 rounded-full bg-saffron-500" />
              <div className="w-6 h-1 rounded-full bg-slate-300 dark:bg-slate-500" />
              <div className="w-6 h-1 rounded-full bg-chakra-500" />
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            Built with constitutional accuracy. Data sourced from official government records.
          </p>
          <p>Politically neutral. No party affiliation.</p>
        </div>
      </div>
    </footer>
  );
}
