// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServiceRank {
  level: number;
  rank: string;
  abbr: string;
  payLevel: string;
  payRange: string;
  yearsRange: string;
  typicalPostings: string[];
  role: string;
  powers: string[];
}

export interface PolicyFlowStep {
  level: number;
  title: string;
  body: string;
  actors: string[];
  instrument: string;
  duration: string;
  color: string;
  bg: string;
  detail: string;
  examples: string[];
}

export interface OrgNode {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  basis: string;
  children: string[];
  parent?: string;
}

export interface DistrictUnit {
  id: string;
  title: string;
  abbr: string;
  track: "revenue" | "development" | "police" | "dept";
  depth: number;
  count: string;
  role: string;
  powers: string[];
  parent?: string;
}

export interface AllIndiaService {
  id: string;
  name: string;
  abbr: string;
  cadre: string;
  exam: string;
  intake: string;
  color: string;
  bg: string;
  role: string;
  topPost: string;
  description: string;
  keyFacts: string[];
}

export interface CentralService {
  name: string;
  abbr: string;
  ministry: string;
  role: string;
  topPost: string;
}

export interface MinistryCluster {
  cluster: string;
  color: string;
  ministries: string[];
}

// ─── IAS Rank Structure ───────────────────────────────────────────────────────

export const IAS_RANKS: ServiceRank[] = [
  {
    level: 1,
    rank: "Probationer / Sub-Divisional Magistrate",
    abbr: "SDM",
    payLevel: "Level 10",
    payRange: "₹56,100 – ₹1,77,500",
    yearsRange: "Years 1–4",
    typicalPostings: ["Sub-Divisional Magistrate (SDM)", "Assistant Collector", "Probationer at LBSNAA Mussoorie"],
    role: "Entry-level field posting. Manages a sub-division (3–5 tehsils) under the Collector. Revenue administration, law & order, certificates.",
    powers: [
      "Executive Magistrate powers under CrPC",
      "Revenue record management",
      "Issuance of income/caste/domicile certificates",
      "Section 144 orders (preventive action)",
      "Land acquisition proceedings",
    ],
  },
  {
    level: 2,
    rank: "Senior Scale / Additional District Magistrate",
    abbr: "ADM",
    payLevel: "Level 11",
    payRange: "₹67,700 – ₹2,08,700",
    yearsRange: "Years 4–9",
    typicalPostings: ["Additional Collector / ADM", "Deputy Secretary (State Secretariat)", "Director (State Govt)"],
    role: "Second-in-command at district level. Handles revenue appeals, development coordination, and deputizes for the Collector.",
    powers: [
      "Revisional powers in revenue matters",
      "Land acquisition compensation disputes",
      "Arms licence administration",
      "Manages district treasury in Collector's absence",
    ],
  },
  {
    level: 3,
    rank: "Junior Administrative Grade / District Collector",
    abbr: "DC / DM",
    payLevel: "Level 12",
    payRange: "₹78,800 – ₹2,09,200",
    yearsRange: "Years 9–13",
    typicalPostings: ["District Collector / District Magistrate", "Joint Secretary (State Secretariat)", "Director (State Govt)"],
    role: "The pivotal field post. The Collector is the face of the government at district level — revenue authority, law & order coordinator, development supervisor, and disaster manager.",
    powers: [
      "Overall revenue administration of district (~1,500 villages)",
      "Magistrate powers (Section 144, preventive detention)",
      "Disaster management authority",
      "Electoral officer for Lok Sabha / Vidhan Sabha elections",
      "Liaison between state government and local administration",
    ],
  },
  {
    level: 4,
    rank: "Selection Grade / Divisional Commissioner",
    abbr: "Commissioner",
    payLevel: "Level 13",
    payRange: "₹1,23,100 – ₹2,15,900",
    yearsRange: "Years 13–18",
    typicalPostings: ["Divisional Commissioner", "Principal Secretary (State)", "Joint Secretary (GoI)", "Head of Department"],
    role: "Heads a division of 3–6 districts. Appellate authority for Collector decisions. At Centre, drives major policy as Joint Secretary.",
    powers: [
      "Appellate authority for Collector orders in revenue matters",
      "Coordination of law & order across division",
      "Annual inspection of district officers",
      "Approval of major land acquisition proposals",
    ],
  },
  {
    level: 5,
    rank: "Super Time Scale / Secretary (State) / Director (Centre)",
    abbr: "Secretary",
    payLevel: "Level 14",
    payRange: "₹1,44,200 – ₹2,18,200",
    yearsRange: "Years 18–24",
    typicalPostings: ["Secretary to State Govt", "Additional Secretary (GoI)", "Director (GoI)", "State Department Head"],
    role: "Runs a major state department or drives significant central policy dossiers. Top administrative generalist.",
    powers: [
      "File noting and policy formulation",
      "Budget estimation and financial powers",
      "Approves postings of subordinate officers",
      "Inter-department coordination",
    ],
  },
  {
    level: 6,
    rank: "Above Super Time Scale / Additional Chief Secretary",
    abbr: "ACS",
    payLevel: "Level 15",
    payRange: "₹1,82,200 – ₹2,24,100",
    yearsRange: "Years 24–28",
    typicalPostings: ["Additional Chief Secretary (State)", "Special Secretary / Additional Secretary (GoI)", "Chairman of Statutory Bodies"],
    role: "Senior state government administrator, next below Chief Secretary. At Centre, drives ministry policy as Additional Secretary.",
    powers: [
      "All financial powers short of Chief Secretary",
      "Representation in state cabinet committee meetings",
      "Heads state's major departments (Finance, Home, Revenue)",
    ],
  },
  {
    level: 7,
    rank: "Apex Scale / Chief Secretary / Secretary (GoI)",
    abbr: "CS / Secretary",
    payLevel: "Level 17",
    payRange: "₹2,25,000 (fixed)",
    yearsRange: "Years 28–35",
    typicalPostings: ["Chief Secretary of State", "Secretary to Government of India", "Principal Secretary to CM"],
    role: "Most senior IAS officer in a state. The administrative head of the state, coordinator between elected government and bureaucracy.",
    powers: [
      "Heads all departments in the state",
      "Presides over state-level coordination committees",
      "Liaises with Cabinet on all administrative matters",
      "At Centre: runs a full ministry as Secretary",
    ],
  },
  {
    level: 8,
    rank: "Cabinet Secretary Grade",
    abbr: "Cab. Sec.",
    payLevel: "Level 18",
    payRange: "₹2,50,000 (fixed)",
    yearsRange: "Years 35+ (1 person in India)",
    typicalPostings: ["Cabinet Secretary of India (sole post in this grade)"],
    role: "The most senior IAS officer and the most senior civil servant in India. Head of the Indian Administrative Service; de facto head of all central government departments.",
    powers: [
      "Presides over all Secretaries' Committee meetings",
      "Coordinates all Cabinet meetings under PM's direction",
      "Crisis management coordinator (national disasters, security crises)",
      "Annual Confidential Report review for senior IAS officers",
      "Advises PM on all major administrative decisions",
    ],
  },
];

// ─── IPS Rank Structure ───────────────────────────────────────────────────────

export const IPS_RANKS: ServiceRank[] = [
  {
    level: 1,
    rank: "Probationer / Assistant Superintendent of Police",
    abbr: "ASP / Probationer",
    payLevel: "Level 10",
    payRange: "₹56,100 – ₹1,77,500",
    yearsRange: "Years 1–4",
    typicalPostings: ["ASP / Dy.SP under training", "SDPO (Sub-Divisional Police Officer)"],
    role: "Trains at SVPNPA Hyderabad and state police academies. Posted as SDPO in charge of a police sub-division.",
    powers: [
      "Command of police in sub-division",
      "CrPC investigation powers",
      "Inspection of police stations",
    ],
  },
  {
    level: 2,
    rank: "Deputy Superintendent of Police",
    abbr: "Dy.SP / DSP",
    payLevel: "Level 11",
    payRange: "₹67,700 – ₹2,08,700",
    yearsRange: "Years 4–9",
    typicalPostings: ["SDPO", "CBI / Special Branch", "District Head of Special Units"],
    role: "Manages a sub-division with 3–5 police stations. Supervises Inspectors and Sub-Inspectors.",
    powers: [
      "Investigation of heinous offences",
      "Grant of bail in cognizable cases",
      "Direction to local police on law & order",
    ],
  },
  {
    level: 3,
    rank: "Superintendent of Police",
    abbr: "SP / DCP",
    payLevel: "Level 12",
    payRange: "₹78,800 – ₹2,09,200",
    yearsRange: "Years 9–14",
    typicalPostings: ["SP of district", "DCP in commissionerate cities", "SP CBI / NIA", "SP (Special Branch)"],
    role: "Head of police in a district. Responsible for law & order, crime detection, and overall police administration of the district.",
    powers: [
      "Overall command of district police",
      "Suspension of constables and sub-inspectors",
      "Recommendation of preventive detention",
      "Manages district Armed Reserve",
    ],
  },
  {
    level: 4,
    rank: "Senior Superintendent of Police",
    abbr: "SSP / Addl. DCP",
    payLevel: "Level 13",
    payRange: "₹1,23,100 – ₹2,15,900",
    yearsRange: "Years 14–18",
    typicalPostings: ["SSP (large district)", "Additional CP in commissionerates", "SSP CBI"],
    role: "Commands large districts or specific wings in big cities. Handles major crime investigations.",
    powers: [
      "All powers of SP with enhanced financial delegation",
      "Acts as SP in serious law & order situations",
    ],
  },
  {
    level: 5,
    rank: "Deputy Inspector General",
    abbr: "DIG",
    payLevel: "Level 14",
    payRange: "₹1,44,200 – ₹2,18,200",
    yearsRange: "Years 18–22",
    typicalPostings: ["DIG of Police Range (3–5 districts)", "IG of a specific wing (CID/SB/Railways)", "Dy. DG CISF / CRPF"],
    role: "Heads a police range comprising several districts. Supervisory role over SPs. Also commands specialized wings.",
    powers: [
      "Departmental enquiry against SPs and lower",
      "Range-level crime review",
      "Anti-terrorism coordination within range",
    ],
  },
  {
    level: 6,
    rank: "Inspector General of Police",
    abbr: "IG",
    payLevel: "Level 15",
    payRange: "₹1,82,200 – ₹2,24,100",
    yearsRange: "Years 22–26",
    typicalPostings: ["IG Police Zone", "IG CBI / NIA", "DIG in central armed forces", "IG (Prisons/Traffic/Law)"],
    role: "Heads a police zone. Senior operational commander. At central level, leads wings of major agencies.",
    powers: [
      "Suspension of officers up to SSP level",
      "Approval of major operations",
      "Zone-level security coordination",
    ],
  },
  {
    level: 7,
    rank: "Additional Director General of Police",
    abbr: "ADG / Spl. DG",
    payLevel: "Level 16-17",
    payRange: "₹2,05,400 – ₹2,24,100",
    yearsRange: "Years 26–30",
    typicalPostings: ["ADG (Intelligence / Law & Order / Traffic)", "ADG Central Armed Police Forces", "Director CISF / CRPF"],
    role: "Senior state police commander. Heads major wings. At Centre, commands entire Central Armed Police Force.",
    powers: [
      "Full operational command of assigned wing",
      "Department inquiry against IG-level officers",
    ],
  },
  {
    level: 8,
    rank: "Director General of Police",
    abbr: "DGP",
    payLevel: "Level 17",
    payRange: "₹2,25,000 (fixed)",
    yearsRange: "Years 30+ (state head)",
    typicalPostings: ["DGP (head of state police)", "Director CRPF / BSF / CISF / ITBP / SSB", "Director IB", "Director CBI"],
    role: "Highest police officer in a state. Head of state police force. Commands lakhs of police personnel.",
    powers: [
      "Overall command of entire state police",
      "All departmental proceedings against officers",
      "Liaison with CM and Home Minister on security matters",
      "Deployment of state police for central duties (elections, security)",
    ],
  },
];

// ─── IFS (Foreign Service) Ranks ─────────────────────────────────────────────

export const IFS_RANKS: ServiceRank[] = [
  {
    level: 1,
    rank: "Third Secretary / Second Secretary",
    abbr: "3rd / 2nd Sec",
    payLevel: "Level 10-11",
    payRange: "₹56,100 – ₹2,08,700",
    yearsRange: "Years 1–5",
    typicalPostings: ["Embassy/HC (junior diplomatic role)", "MEA Headquarters (India Desk)"],
    role: "Drafted in substantive diplomatic work — note-taking, trade facilitation, visa section oversight, cultural events.",
    powers: ["Report preparation", "Consular functions"],
  },
  {
    level: 2,
    rank: "First Secretary / Under Secretary",
    abbr: "1st Sec",
    payLevel: "Level 12",
    payRange: "₹78,800 – ₹2,09,200",
    yearsRange: "Years 5–10",
    typicalPostings: ["First Secretary (Embassy)", "Under Secretary (MEA HQ)"],
    role: "Mid-level diplomat — desk officer for bilateral relations. Drafts diplomatic notes, manages trade/cultural desk.",
    powers: ["Bilateral desk management", "Conference delegation member"],
  },
  {
    level: 3,
    rank: "Counsellor / Deputy Secretary",
    abbr: "Counsellor",
    payLevel: "Level 13",
    payRange: "₹1,23,100 – ₹2,15,900",
    yearsRange: "Years 10–16",
    typicalPostings: ["Deputy Chief of Mission", "Counsellor (Political/Trade/Cultural)", "Director (MEA)"],
    role: "Senior embassy officer — runs specific sections (political, economic, cultural). Second or third in mission hierarchy.",
    powers: ["Acts as Chargé d'Affaires in Ambassador's absence", "Leads bilateral negotiations on assigned dossier"],
  },
  {
    level: 4,
    rank: "Minister / Joint Secretary",
    abbr: "Minister",
    payLevel: "Level 14",
    payRange: "₹1,44,200 – ₹2,18,200",
    yearsRange: "Years 16–20",
    typicalPostings: ["Deputy Chief of Mission (large embassy)", "Joint Secretary (MEA)", "Consul General"],
    role: "Number 2 in major embassies. In MEA, leads a geographical or functional division as Joint Secretary.",
    powers: ["Joint Secretary-level policy file decisions", "Leads multi-lateral delegations"],
  },
  {
    level: 5,
    rank: "Additional Secretary / Ambassador",
    abbr: "Addl. Sec. / Amb.",
    payLevel: "Level 15-17",
    payRange: "₹1,82,200 – ₹2,25,000",
    yearsRange: "Years 20–28",
    typicalPostings: ["Ambassador / High Commissioner", "Additional Secretary (MEA)"],
    role: "India's official representative to a country. Presents credentials to the Head of State. Conducts bilateral diplomacy.",
    powers: [
      "Represents India in the receiving state",
      "Signs bilateral agreements (if authorized)",
      "Accreditation of staff at mission",
      "Consular jurisdiction over Indian nationals",
    ],
  },
  {
    level: 6,
    rank: "Foreign Secretary",
    abbr: "FS",
    payLevel: "Level 17-18",
    payRange: "₹2,25,000 – ₹2,50,000",
    yearsRange: "Years 32+ (1 person)",
    typicalPostings: ["Foreign Secretary of India (sole post in this grade)"],
    role: "Administrative head of MEA. India's chief diplomatic official. Advises PM and EAM on foreign policy. Leads major bilateral and multilateral negotiations.",
    powers: [
      "Highest diplomatic representative of India",
      "Co-chairs bilateral joint commissions",
      "Advises PM on all foreign policy matters",
    ],
  },
];

// ─── Policy Flow ──────────────────────────────────────────────────────────────

export const POLICY_FLOW_STEPS: PolicyFlowStep[] = [
  {
    level: 1,
    title: "Prime Minister's Office (PMO)",
    body: "Policy mandate is set through PM's vision, election manifesto commitments, or national emergency. The PMO acts as the command centre — the Principal Secretary to PM coordinates with Ministries.",
    actors: ["Prime Minister", "Principal Secretary to PM", "NSA (security)", "PMO Joint Secretaries"],
    instrument: "Policy Note / Cabinet Note / PM's directive",
    duration: "Days to weeks",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800",
    detail: "The PMO is the apex of the executive branch. It does not administer programmes directly but sets direction and monitors implementation. All Cabinet notes are processed through the PMO. The Principal Secretary to PM is the critical link between elected PM and the bureaucratic machinery.",
    examples: ["PM announces ₹20 lakh crore COVID relief package", "National Education Policy 2020 directive", "Jan Dhan Yojana announcement"],
  },
  {
    level: 2,
    title: "Union Cabinet & Cabinet Secretariat",
    body: "Major policy decisions must be approved by the Cabinet (Council of Ministers). The Cabinet Secretariat, headed by the Cabinet Secretary, orchestrates this and ensures inter-ministerial coordination.",
    actors: ["Cabinet Secretary", "Union Ministers", "Cabinet Committees (CCEA, CCS, etc.)", "Secretaries to Cabinet committees"],
    instrument: "Cabinet Resolution / Cabinet Committee Decision",
    duration: "Weeks to months",
    color: "text-red-700 dark:text-red-300",
    bg: "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800",
    detail: "The Cabinet is the apex decision-making body. Cabinet Committees (CCEA for economic, CCS for security) handle routine decisions. The Cabinet Secretary — the most senior IAS officer — ensures that Cabinet decisions are recorded, communicated, and implemented. He chairs Secretaries' Committee meetings that coordinate between ministries.",
    examples: ["Cabinet approves PM Awas Yojana (housing for all)", "CCEA approves MSP for Kharif crops", "CCS decides on defence procurement"],
  },
  {
    level: 3,
    title: "Ministry / Department Secretary",
    body: "Once Cabinet approves, the nodal Ministry translates the decision into an administrative programme. The Secretary drafts guidelines, allocates funds through the budget, and coordinates with states.",
    actors: ["Secretary to Government of India", "Additional Secretary / Joint Secretary", "Directors / Deputy Secretaries", "Under Secretaries"],
    instrument: "Scheme Guidelines / Office Memorandum / Sanction Order",
    duration: "1–6 months",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800",
    detail: "This is where policy becomes a 'scheme' with a name, budget allocation, eligible beneficiaries, and implementation guidelines. The Ministry issues Detailed Guidelines or Implementation Guidelines to state governments. Financial resources are routed either directly (CSS — Centrally Sponsored Schemes) or via Finance Commission devolution.",
    examples: ["MGNREGS operational guidelines issued by MoRD", "PMJAY scheme details issued by MoHFW", "Pradhan Mantri Gram Sadak Yojana guidelines"],
  },
  {
    level: 4,
    title: "State Government (Chief Secretary / State Ministry)",
    body: "In India's federal structure, most implementation happens through state governments. The Chief Secretary coordinates. The State Ministry may adapt the central scheme within parameters and sometimes add state funds (flexi-pool).",
    actors: ["Chief Minister", "Chief Secretary", "State Ministry Secretaries", "State Finance Department"],
    instrument: "Government Order (GO) / State Gazette Notification / Scheme Adaptation",
    duration: "1–3 months after central guidelines",
    color: "text-purple-700 dark:text-purple-300",
    bg: "bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800",
    detail: "States may issue their own Government Orders adapting the central scheme to local needs (e.g. additional beneficiary categories, higher compensation). State budgets must match central funds (typically 60:40 for general states, 90:10 for special category states). Some states add their own top-ups.",
    examples: ["Rajasthan adds its own 'Indira Gandhi Urban Employment Guarantee' on top of MGNREGS", "Kerala's own health insurance supplements Ayushman Bharat"],
  },
  {
    level: 5,
    title: "Divisional Commissioner",
    body: "The Commissioner oversees 3–6 districts. They monitor implementation, resolve inter-district issues, hear appeals from Collector orders, and report to the state government on progress.",
    actors: ["Divisional Commissioner (IAS)", "Joint Commissioner", "Divisional-level department heads"],
    instrument: "Divisional Orders / Review Meetings / Inspection Reports",
    duration: "Ongoing monitoring",
    color: "text-indigo-700 dark:text-indigo-300",
    bg: "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800",
    detail: "The Commissioner is the first-tier review authority for most Collector actions. They chair Division-level review meetings, conduct surprise inspections, and submit monthly progress reports to the State Secretariat. The Commissioner is also the appellate authority for revenue disputes from district level.",
    examples: ["Commissioner chairs monthly MGNREGS review for 5 districts", "Hears appeal against Collector's land acquisition order"],
  },
  {
    level: 6,
    title: "District Collector / District Magistrate",
    body: "The Collector is India's most powerful field officer. They translate programme guidelines into district-level plans, coordinate all department heads, and are accountable for outcomes. The 'face of government' for citizens.",
    actors: ["District Collector / DC / DM", "Additional Collectors", "District-level department heads (SP, CMO, DEO)", "District Planning Committee"],
    instrument: "District Action Plan / Collector's order / DPC resolution",
    duration: "Ongoing; monthly reporting",
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800",
    detail: "A typical district has 1–5 million people. The Collector chairs weekly/monthly meetings of all department heads. They prepare the District Action Plan (DAP) for each scheme, allocate block-level targets, and monitor the District Management Information System (DMIS). They are directly accountable to the Commissioner and state government for their district's performance on health, education, poverty, infrastructure, and law & order indicators.",
    examples: ["Collector chairs DISHA (Integrated Development of Strategic Hinterland Areas) meeting", "District Annual Plan prepared and submitted", "Collector visits blocks to review PMAY housing construction"],
  },
  {
    level: 7,
    title: "Block Development Officer (BDO) / Tehsildar",
    body: "Block is the critical 'last administrative mile'. The BDO manages development schemes. The Tehsildar manages revenue. Together they are the primary interface between government and village-level institutions.",
    actors: ["Block Development Officer (BDO)", "Tehsildar / Tahasildar", "Gram Panchayat Officers", "Agriculture / Health Extension Workers"],
    instrument: "Block Action Plan / Revenue Records / Panchayat Resolutions",
    duration: "Weekly execution",
    color: "text-teal-700 dark:text-teal-300",
    bg: "bg-teal-50 dark:bg-teal-950/20 border-teal-300 dark:border-teal-800",
    detail: "A block has 50–100 villages and a population of 50,000–3,00,000. The BDO manages all development schemes (MGNREGS job cards, PMAY housing, health infrastructure). The Tehsildar manages land records, crop loans, and revenue collections. Both report to the SDM (Sub-Divisional Magistrate) who reports to the Collector. Block-level officers interact directly with Gram Panchayats.",
    examples: ["BDO reviews MGNREGS muster rolls for 60 panchayats", "Tehsildar updates land mutation records", "BDO disburses PMAY installments to beneficiaries"],
  },
  {
    level: 8,
    title: "Gram Panchayat & Village Level Workers",
    body: "The constitutional local self-government (73rd Amendment). Elected Gram Panchayat implements schemes, maintains records, and channels citizen demands upward. Village Level Workers (VLW/Aaganwadi/ASHAs) are the final delivery point.",
    actors: ["Gram Pradhan / Sarpanch (elected)", "Gram Panchayat Secretary", "Aaganwadi Worker (ICDS)", "ASHA Worker (Health)", "Agriculture Extension Worker / VLW"],
    instrument: "Panchayat Resolutions / Village Action Plans / Job Cards",
    duration: "Daily service delivery",
    color: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800",
    detail: "At the bottom of the pyramid are ~2.5 lakh Gram Panchayats covering ~6 lakh villages. The Gram Panchayat Secretary (a state government employee) is the critical link — they maintain job cards, beneficiary lists, and scheme records. VLWs (Village Level Workers) in agriculture, Aaganwadi workers in nutrition/early childhood, and ASHAs in health are the actual 'last mile' delivery agents. The 15th Finance Commission provided ₹2.36 lakh crore directly to local bodies (2021–26).",
    examples: ["ASHA worker identifies PMAY-eligible families in village", "Aaganwadi distributes Poshan Abhiyaan nutritional supplements", "Gram Sabha passes resolution for road construction under MGNREGS"],
  },
];

// ─── PMO Structure ────────────────────────────────────────────────────────────

export const PMO_NODES: OrgNode[] = [
  {
    id: "pm",
    title: "Prime Minister",
    subtitle: "Constitutional head of govt (Art. 75)",
    role: "Sets policy direction, chairs Cabinet, leads external affairs",
    basis: "Art. 74, 75 — Council of Ministers; Art. 78 — PM's duties to President",
    children: ["principal-sec", "nsa", "psa", "eac"],
  },
  {
    id: "principal-sec",
    title: "Principal Secretary to PM",
    subtitle: "Most senior IAS officer in PMO",
    role: "Coordinates all ministerial and administrative work reaching PM. De facto head of PMO. Critical link between PM and bureaucracy.",
    basis: "IAS officer deputed to PMO",
    children: ["js-economic", "js-infra", "js-social", "js-coord"],
    parent: "pm",
  },
  {
    id: "nsa",
    title: "National Security Advisor (NSA)",
    subtitle: "Heads National Security Council Secretariat",
    role: "Coordinates intelligence, foreign policy, defence, and internal security for PM. Chairs Strategic Policy Group.",
    basis: "Executive order; heads NSC Secretariat (1999)",
    children: ["dep-nsa"],
    parent: "pm",
  },
  {
    id: "psa",
    title: "Principal Scientific Advisor",
    subtitle: "Science & Technology policy",
    role: "Advises PM on science, technology, innovation, and deep-tech policy. Coordinates with DST, DRDO, CSIR.",
    basis: "Executive appointment",
    children: [],
    parent: "pm",
  },
  {
    id: "eac",
    title: "Economic Advisory Council to PM",
    subtitle: "PM-EAC (Economic advisors)",
    role: "Provides independent economic analysis and advice. Prepares Economic White Papers. Members are eminent economists.",
    basis: "Executive order",
    children: [],
    parent: "pm",
  },
  {
    id: "dep-nsa",
    title: "Deputy NSA (3 posts)",
    subtitle: "NSC Secretariat",
    role: "Handles specific security dossiers — cyber, nuclear, counter-terror, China, Pakistan. One Deputy NSA oversees Pakistan/Afghanistan; another handles economic/energy security.",
    basis: "NSC Secretariat",
    children: [],
    parent: "nsa",
  },
  {
    id: "js-economic",
    title: "Joint Secretary (Economic Division)",
    subtitle: "Monitors economic ministries",
    role: "Tracks Finance, Commerce, Industry, MSME ministries. Processes inter-ministerial references for PM's intervention.",
    basis: "IAS/IES officer deputed to PMO",
    children: [],
    parent: "principal-sec",
  },
  {
    id: "js-infra",
    title: "Joint Secretary (Infrastructure)",
    subtitle: "Monitors infra sectors",
    role: "Tracks Railways, Roads, Ports, Civil Aviation, Power, Petroleum. Monitors flagship infra programmes.",
    basis: "IAS officer",
    children: [],
    parent: "principal-sec",
  },
  {
    id: "js-social",
    title: "Joint Secretary (Social Sectors)",
    subtitle: "Health, Education, Rural Development",
    role: "Monitors MoHFW, MoE, MoRD, MoSJE. Reviews implementation of flagship social schemes (PMAY, Swachh Bharat, etc.).",
    basis: "IAS officer",
    children: [],
    parent: "principal-sec",
  },
  {
    id: "js-coord",
    title: "OSD / Joint Secretary (Coordination)",
    subtitle: "Cabinet coordination, RTI, public grievances",
    role: "Manages PM's public interface — CPGRAMS grievances, PMO's own RTI replies, press coordination, protocol.",
    basis: "IAS / IIS officer",
    children: [],
    parent: "principal-sec",
  },
];

// ─── District Administration ──────────────────────────────────────────────────

export const DISTRICT_UNITS: DistrictUnit[] = [
  {
    id: "collector",
    title: "District Collector / District Magistrate (DM)",
    abbr: "DC / DM",
    track: "revenue",
    depth: 0,
    count: "1 per district",
    role: "Overall head of district administration. Revenue authority, law & order coordinator, development supervisor, disaster manager, and electoral officer.",
    powers: [
      "Head of district revenue administration",
      "Section 144 / preventive detention orders",
      "District Magistrate (criminal & executive magistracy)",
      "Disaster Management authority (NDMA framework)",
      "Returning Officer for parliamentary/assembly elections",
      "Chairs DISHA, DPSC, District Planning Committee",
    ],
  },
  {
    id: "adc-rev",
    title: "Additional District Collector (Revenue)",
    abbr: "ADC / ADM",
    track: "revenue",
    depth: 1,
    count: "1–2 per district",
    role: "Heads revenue administration. Handles land acquisition, court cases, revenue appeals. Deputizes for Collector.",
    powers: [
      "Appellate authority for tehsildar orders",
      "Land acquisition awards",
      "Arms licence scrutiny",
    ],
    parent: "collector",
  },
  {
    id: "sdm",
    title: "Sub-Divisional Magistrate",
    abbr: "SDM / SDO",
    track: "revenue",
    depth: 2,
    count: "3–6 per district (one per sub-division)",
    role: "Manages a sub-division comprising 3–5 tehsils. Revenue administration, law & order, and certification functions for the sub-division.",
    powers: [
      "Executive magistrate powers",
      "Revenue appeals from Tehsildar",
      "Income/caste/domicile certificate final authority",
      "Section 144 for sub-division",
    ],
    parent: "adc-rev",
  },
  {
    id: "tehsildar",
    title: "Tehsildar / Tahasildar",
    abbr: "Tehsildar",
    track: "revenue",
    depth: 3,
    count: "8–20 per district (one per tehsil)",
    role: "Head of revenue administration at tehsil level. Maintains land records, issues certificates, collects revenue, adjudicates disputes.",
    powers: [
      "Maintenance of cadastral (land) records",
      "Mutation (name change in records) orders",
      "Revenue collection authority",
      "Caste/income/residence certificate issuance",
      "First-level arbitrator in land disputes",
    ],
    parent: "sdm",
  },
  {
    id: "naib-tehsildar",
    title: "Naib Tehsildar",
    abbr: "Naib Tehsildar",
    track: "revenue",
    depth: 4,
    count: "2–3 per tehsil",
    role: "Assists Tehsildar. Prepares revenue records, manages patwari inspections, resolves minor land disputes.",
    powers: ["Revenue record management", "Minor land dispute resolution", "Patwari supervision"],
    parent: "tehsildar",
  },
  {
    id: "patwari",
    title: "Patwari / Lekhpal / Kanungo",
    abbr: "Patwari",
    track: "revenue",
    depth: 5,
    count: "1 per cluster of 5–10 villages",
    role: "Village-level revenue official. Maintains khasra (field register), khatauni (tenure record), girdawari (crop inspection). The custodian of land records.",
    powers: [
      "Maintains village land map (Naksha)",
      "Records crop details in girdawari",
      "Witnesses land transactions",
      "First contact for land record queries",
    ],
    parent: "naib-tehsildar",
  },
  {
    id: "adc-dev",
    title: "Additional Collector (Development) / CDO",
    abbr: "CDO / DDO",
    track: "development",
    depth: 1,
    count: "1 per district",
    role: "Heads district-level implementation of development schemes. Coordinates all department heads for development objectives.",
    powers: [
      "Chairs District Development Coordination & Monitoring Committee",
      "Oversees MGNREGS, PMAY, and rural development schemes",
      "District DPSP nodal officer",
    ],
    parent: "collector",
  },
  {
    id: "bdo",
    title: "Block Development Officer",
    abbr: "BDO",
    track: "development",
    depth: 2,
    count: "10–30 per district (one per block)",
    role: "Last administrative officer responsible for block-level development. Implements all Central and State schemes at block level. Primary interface with Gram Panchayats.",
    powers: [
      "Approval of MGNREGS muster rolls",
      "PMAY beneficiary final selection",
      "Pradhan Mantri Awas Gramin construction monitoring",
      "SHG (Self Help Group) formation and finance",
      "Panchayat Raj institutional support",
    ],
    parent: "adc-dev",
  },
  {
    id: "gp-sec",
    title: "Gram Panchayat Secretary",
    abbr: "GP Secretary",
    track: "development",
    depth: 3,
    count: "1 per Gram Panchayat (~2.5 lakh GPs in India)",
    role: "State government employee posted to Gram Panchayat. Maintains records, facilitates scheme implementation, acts as secretary to elected Gram Pradesh.",
    powers: [
      "Records maintenance of GP resolutions",
      "MGNREGS muster roll maintenance",
      "Beneficiary list management",
      "Liaises between GP and BDO",
    ],
    parent: "bdo",
  },
  {
    id: "sp",
    title: "Superintendent of Police",
    abbr: "SP",
    track: "police",
    depth: 1,
    count: "1 per district (coordinates with Collector, not under DC)",
    role: "Head of district police. Responsible for law & order, crime detection, traffic. Coordinates with Collector on law & order but is administratively under DIG/IG.",
    powers: [
      "Overall command of district police (~500–2000 officers)",
      "Suspension of Sub-Inspector and below",
      "Preventive detention recommendation",
      "Manages Armed Reserve and District Crime Branch",
    ],
    parent: "collector",
  },
  {
    id: "dysp",
    title: "Deputy Superintendent of Police",
    abbr: "Dy.SP / DSP",
    track: "police",
    depth: 2,
    count: "1 per sub-division (SDPO)",
    role: "Sub-Divisional Police Officer — head of police in a sub-division. Supervises Inspectors, manages stations.",
    powers: ["Investigation of serious crimes", "Inspection of police stations"],
    parent: "sp",
  },
  {
    id: "civil-surgeon",
    title: "Chief Medical Officer / Civil Surgeon",
    abbr: "CMO / CS",
    track: "dept",
    depth: 1,
    count: "1 per district",
    role: "Head of district health administration. Manages district hospital, PHCs, CHCs. Implements PMJAY, RCH, NMHP, NHM at district level.",
    powers: ["District health scheme implementation", "Drug procurement", "Medical officer transfers in district"],
    parent: "collector",
  },
  {
    id: "deo",
    title: "District Education Officer",
    abbr: "DEO",
    track: "dept",
    depth: 1,
    count: "1 per district",
    role: "Manages all government schools and teachers in the district. Implements Mid-Day Meal, PM POSHAN, Samagra Shiksha.",
    powers: ["Teacher transfers and appointments", "School inspection and recognition", "Mid-Day Meal monitoring"],
    parent: "collector",
  },
];

// ─── All India Services ───────────────────────────────────────────────────────

export const ALL_INDIA_SERVICES: AllIndiaService[] = [
  {
    id: "ias",
    name: "Indian Administrative Service",
    abbr: "IAS",
    cadre: "State/Central cadres (27+1)",
    exam: "UPSC Civil Services (CSE)",
    intake: "~180 per year",
    color: "#1565C0",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    role: "Administrative generalists who run the district and secretariat machinery of India",
    topPost: "Cabinet Secretary of India",
    description: "The 'steel frame' of India. IAS officers serve alternately in field postings (Collector, Commissioner) and secretariat postings (Director, JS, Secretary). They manage revenue administration, development, law & order, elections, and disaster management.",
    keyFacts: [
      "~5,000 IAS officers for a country of 140 crore — ratio of 1:28,000",
      "Serve both state governments and Central government (on deputation)",
      "Each officer is allocated a cadre (state) at joining — serves that state for their career",
      "Trained at LBSNAA, Mussoorie (Foundation Course 4 months, then 2-year probation)",
      "Average age of IAS entrants: 28 years (max age 32 for general category)",
    ],
  },
  {
    id: "ips",
    name: "Indian Police Service",
    abbr: "IPS",
    cadre: "State cadres (27+1) + Central APOs",
    exam: "UPSC Civil Services (CSE)",
    intake: "~150 per year",
    color: "#991B1B",
    bg: "bg-red-50 dark:bg-red-950/20",
    role: "Professional police leadership — from district SP to DGP and central police organisations",
    topPost: "Director General of Police (State) / Director IB / Director CBI",
    description: "IPS officers command district police as SP, then senior roles as DIG/IG/ADG/DGP. They also lead central police organisations — CBI, NIA, IB, BSF, CRPF, CISF, ITBP, SSB. Trained at SVPNPA Hyderabad and then in state police academies.",
    keyFacts: [
      "~3,500 IPS officers across India",
      "Typically command 500–2,000+ officers as district SP",
      "10% of IPS serve in central police organisations at any time",
      "States have their own Provincial Police Service (PPS) below IPS",
      "NSG, SPG are specialised units with IPS leadership",
    ],
  },
  {
    id: "ifos",
    name: "Indian Forest Service",
    abbr: "IFoS",
    cadre: "State cadres",
    exam: "UPSC IFoS Examination (separate from CSE)",
    intake: "~100 per year",
    color: "#065F46",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    role: "Management and protection of India's forests, wildlife, and environmental resources",
    topPost: "Director General of Forests & Special Secretary (GoI)",
    description: "IFoS officers manage India's 7.12 lakh sq km of forest land (21.7% of territory). They serve as DFO (Divisional Forest Officer) at district level, leading to PCCF (Principal Chief Conservator of Forests) at state level. They also serve in MoEFCC and international bodies (CITES, CBD).",
    keyFacts: [
      "~3,200 IFoS officers for 80+ crore hectares of forest",
      "Project Tiger and Project Elephant are managed by IFoS officers",
      "Training at IGNFA, Dehradun (Forest Research Institute)",
      "IFoS officers lead India's climate change forestry commitments (NDC)",
      "Wildlife Institute of India (WII), FSI — headed by IFoS officers",
    ],
  },
];

export const CENTRAL_SERVICES: CentralService[] = [
  { name: "Indian Foreign Service", abbr: "IFS", ministry: "Ministry of External Affairs", role: "India's diplomatic corps — ambassadors, high commissioners, consular officers", topPost: "Foreign Secretary of India" },
  { name: "Indian Revenue Service (IT)", abbr: "IRS (IT)", ministry: "Ministry of Finance (CBDT)", role: "Income tax collection, tax policy, DTAA, prosecution", topPost: "Chairman, CBDT" },
  { name: "Indian Revenue Service (C&CE)", abbr: "IRS (C&CE)", ministry: "Ministry of Finance (CBIC)", role: "GST, customs, central excise, DGGI anti-evasion", topPost: "Chairman, CBIC" },
  { name: "Indian Audit & Accounts Service", abbr: "IAAS", ministry: "CAG of India", role: "Government audit, accounts, financial reporting", topPost: "Comptroller & Auditor General" },
  { name: "Indian Railway Traffic Service", abbr: "IRTS", ministry: "Ministry of Railways", role: "Railway operations, traffic management, freight", topPost: "Member (Traffic), Railway Board" },
  { name: "Indian Information Service", abbr: "IIS", ministry: "Ministry of Information & Broadcasting", role: "Media relations, PIB, Doordarshan, AIR administration", topPost: "DG (M&C) / DG, AIR" },
  { name: "Indian Postal Service", abbr: "IPoS", ministry: "Ministry of Communications", role: "Postal network (1.65 lakh post offices), postal banking", topPost: "Director General, Postal Services" },
  { name: "Central Secretariat Service", abbr: "CSS", ministry: "DoPT (all ministries)", role: "Permanent secretariat staff in central ministries — Section Officers to Directors", topPost: "Senior Principal / Director" },
];

// ─── Ministry Clusters ────────────────────────────────────────────────────────

export const MINISTRY_CLUSTERS: MinistryCluster[] = [
  {
    cluster: "Core Governance",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    ministries: ["Prime Minister's Office", "Ministry of Home Affairs", "Ministry of Finance", "Ministry of External Affairs", "Ministry of Law & Justice", "Ministry of Defence"],
  },
  {
    cluster: "Economy & Industry",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    ministries: ["Ministry of Commerce & Industry", "Ministry of MSME", "Ministry of Corporate Affairs", "Ministry of Statistics & PI", "Ministry of Consumer Affairs"],
  },
  {
    cluster: "Infrastructure",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    ministries: ["Ministry of Railways", "Ministry of Road Transport", "Ministry of Ports & Shipping", "Ministry of Civil Aviation", "Ministry of Housing & Urban Affairs", "Ministry of Jal Shakti", "Ministry of Power", "Ministry of Petroleum & NG"],
  },
  {
    cluster: "Agriculture & Rural",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    ministries: ["Ministry of Agriculture & FW", "Ministry of Rural Development", "Ministry of Panchayati Raj", "Ministry of Fisheries", "Ministry of Food Processing"],
  },
  {
    cluster: "Social Sectors",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    ministries: ["Ministry of Health & Family Welfare", "Ministry of Education", "Ministry of Women & Child Development", "Ministry of Social Justice", "Ministry of Labour & Employment"],
  },
  {
    cluster: "Technology & Science",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    ministries: ["Ministry of Electronics & IT (MeitY)", "Department of Science & Technology", "Department of Space (ISRO)", "Ministry of Atomic Energy (DAE)"],
  },
];

// ─── Cabinet Secretariat Info ─────────────────────────────────────────────────

export const CABINET_SECRETARIAT = {
  roles: [
    { title: "Cabinet Secretary", desc: "Presides over Secretaries' Committee; coordinates Cabinet; seniormost civil servant" },
    { title: "Additional Cabinet Secretary", desc: "Assists in coordination; manages Cabinet Committees' secretarial work" },
    { title: "Secretaries (Cabinet Committees)", desc: "Secretaries to CCEA, CCS, CCI, CCLST and other Cabinet Committees" },
    { title: "Director (Cabinet)", desc: "Prepares Cabinet agenda, notes, and records decisions" },
    { title: "OSD (Cabinet)", desc: "Officers on Special Duty for specific Cabinet functions" },
  ],
  cabinetCommittees: [
    { name: "CCS", full: "Cabinet Committee on Security", desc: "Defence, national security, nuclear policy, intelligence. Chaired by PM." },
    { name: "CCEA", full: "Cabinet Committee on Economic Affairs", desc: "Major economic decisions, PSU pricing, MSP, investment approvals. Chaired by PM." },
    { name: "CCI", full: "Cabinet Committee on Investment", desc: "Major project approvals and investment facilitation." },
    { name: "CCA", full: "Cabinet Committee on Accommodation", desc: "Government residential accommodation." },
    { name: "CCLST", full: "Cabinet Committee on Employment & Skill Dev.", desc: "Employment and livelihood policies." },
    { name: "CCG", full: "Cabinet Committee on Political Affairs", desc: "Major political/governance decisions. Chaired by PM." },
  ],
  keyFunctions: [
    "Secretarial assistance to the Cabinet and its Committees",
    "Coordination between ministries on inter-ministerial matters",
    "Management of Crisis Management Group (CMG) for national emergencies",
    "Administration of IAS, IPS, and IFoS (through DOPT which is under PMO/Cabinet Secretary)",
    "Coordination with the President's Secretariat and Vice President's office",
    "National Archives and official records preservation",
  ],
};
