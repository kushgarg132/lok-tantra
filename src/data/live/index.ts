export type EventCategory =
  | "parliament"
  | "court"
  | "election"
  | "cabinet"
  | "governor"
  | "ordinance";

export type EventPriority = "breaking" | "high" | "medium" | "low";

export interface LiveEvent {
  id: string;
  category: EventCategory;
  priority: EventPriority;
  title: string;
  detail: string;
  source: string;
  tags: string[];
  articleRef?: string;
}

export const CATEGORY_META: Record<
  EventCategory,
  { label: string; color: string; bg: string; border: string; icon: string; dot: string }
> = {
  parliament: {
    label: "Parliament",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: "🏛️",
    dot: "bg-blue-500",
  },
  court: {
    label: "Supreme Court",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-800",
    icon: "⚖️",
    dot: "bg-violet-500",
  },
  election: {
    label: "Elections",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: "🗳️",
    dot: "bg-emerald-500",
  },
  cabinet: {
    label: "Cabinet",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    icon: "🏢",
    dot: "bg-amber-500",
  },
  governor: {
    label: "Governor",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-800",
    icon: "🔱",
    dot: "bg-rose-500",
  },
  ordinance: {
    label: "Ordinance",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    icon: "📜",
    dot: "bg-red-500",
  },
};

export const PRIORITY_META: Record<
  EventPriority,
  { dot: string; label: string; text: string; ring: string }
> = {
  breaking: {
    dot: "bg-red-500 animate-pulse",
    label: "BREAKING",
    text: "text-red-600 dark:text-red-400",
    ring: "ring-red-400",
  },
  high: {
    dot: "bg-amber-500",
    label: "HIGH",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-400",
  },
  medium: {
    dot: "bg-blue-400",
    label: "",
    text: "text-blue-500 dark:text-blue-400",
    ring: "ring-blue-300",
  },
  low: {
    dot: "bg-slate-300 dark:bg-slate-600",
    label: "",
    text: "text-slate-400",
    ring: "ring-slate-200",
  },
};

// ─── Parliament ─────────────────────────────────────────────────────────────

export interface ParliamentSession {
  id: string;
  type: "Budget" | "Winter" | "Monsoon" | "Special";
  year: number;
  startDate: string;
  endDate?: string;
  status: "ongoing" | "adjourned" | "concluded" | "scheduled";
  daysHeld: number;
  billsIntroduced: number;
  billsPassed: number;
  questionsAnswered: number;
  sittingHours: number;
}

export const PARLIAMENT_SESSIONS: ParliamentSession[] = [
  {
    id: "monsoon-2026",
    type: "Monsoon",
    year: 2026,
    startDate: "21 Jul 2026",
    status: "scheduled",
    daysHeld: 0,
    billsIntroduced: 0,
    billsPassed: 0,
    questionsAnswered: 0,
    sittingHours: 0,
  },
  {
    id: "budget-2026",
    type: "Budget",
    year: 2026,
    startDate: "31 Jan 2026",
    endDate: "8 May 2026",
    status: "concluded",
    daysHeld: 58,
    billsIntroduced: 14,
    billsPassed: 10,
    questionsAnswered: 874,
    sittingHours: 258,
  },
  {
    id: "winter-2025",
    type: "Winter",
    year: 2025,
    startDate: "24 Nov 2025",
    endDate: "19 Dec 2025",
    status: "concluded",
    daysHeld: 20,
    billsIntroduced: 7,
    billsPassed: 5,
    questionsAnswered: 518,
    sittingHours: 82,
  },
  {
    id: "monsoon-2025",
    type: "Monsoon",
    year: 2025,
    startDate: "21 Jul 2025",
    endDate: "12 Aug 2025",
    status: "concluded",
    daysHeld: 17,
    billsIntroduced: 5,
    billsPassed: 4,
    questionsAnswered: 292,
    sittingHours: 68,
  },
  {
    id: "budget-2025",
    type: "Budget",
    year: 2025,
    startDate: "31 Jan 2025",
    endDate: "9 May 2025",
    status: "concluded",
    daysHeld: 61,
    billsIntroduced: 16,
    billsPassed: 11,
    questionsAnswered: 892,
    sittingHours: 270,
  },
];

export type BillStatus =
  | "introduced"
  | "committee"
  | "passed-ls"
  | "passed-rs"
  | "enacted"
  | "lapsed"
  | "withdrawn";

export interface Bill {
  id: string;
  number: string;
  title: string;
  ministry: string;
  status: BillStatus;
  type: "ordinary" | "money" | "constitutional" | "finance" | "private";
  introducedDate: string;
  lastAction: string;
  lastActionDate: string;
  controversy: "low" | "medium" | "high";
}

export const BILL_STATUS_META: Record<BillStatus, { label: string; color: string }> = {
  introduced:  { label: "Introduced",  color: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
  committee:   { label: "In Committee", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  "passed-ls": { label: "Passed LS",   color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
  "passed-rs": { label: "Passed RS",   color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30" },
  enacted:     { label: "Enacted",     color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
  lapsed:      { label: "Lapsed",      color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
  withdrawn:   { label: "Withdrawn",   color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30" },
};

export const BILLS: Bill[] = [
  { id: "onoe-const", number: "129/2024", title: "Constitution (One Hundred and Twenty-ninth Amendment) Bill", ministry: "Law & Justice", status: "committee", type: "constitutional", introducedDate: "17 Dec 2024", lastAction: "Referred to Joint Parliamentary Committee", lastActionDate: "19 Dec 2024", controversy: "high" },
  { id: "immigration", number: "15/2025", title: "Immigration and Foreigners Bill, 2025", ministry: "Home Affairs", status: "passed-ls", type: "ordinary", introducedDate: "11 Mar 2025", lastAction: "Passed Lok Sabha — 312:89", lastActionDate: "19 Mar 2025", controversy: "medium" },
  { id: "waqf", number: "12/2024", title: "Waqf (Amendment) Bill, 2024", ministry: "Minority Affairs", status: "enacted", type: "ordinary", introducedDate: "8 Aug 2024", lastAction: "Received Presidential Assent — Act No. 40/2024", lastActionDate: "10 Apr 2025", controversy: "high" },
  { id: "banking", number: "3/2025", title: "Banking Laws (Amendment) Bill, 2025", ministry: "Finance", status: "enacted", type: "ordinary", introducedDate: "2 Feb 2025", lastAction: "Received Presidential Assent", lastActionDate: "28 Feb 2025", controversy: "low" },
  { id: "disaster", number: "18/2025", title: "Disaster Management (Amendment) Bill, 2025", ministry: "Home Affairs", status: "passed-rs", type: "ordinary", introducedDate: "14 Mar 2025", lastAction: "Passed Rajya Sabha — voice vote", lastActionDate: "2 Apr 2025", controversy: "low" },
  { id: "vayuyan", number: "22/2024", title: "Bharatiya Vayuyan Vidheyak (Indian Aircraft Bill), 2024", ministry: "Civil Aviation", status: "enacted", type: "ordinary", introducedDate: "9 Dec 2024", lastAction: "Received Presidential Assent — Act No. 41/2024", lastActionDate: "8 Jan 2025", controversy: "low" },
  { id: "boilers", number: "28/2025", title: "Boilers Bill, 2025", ministry: "Commerce & Industry", status: "introduced", type: "ordinary", introducedDate: "18 Feb 2025", lastAction: "Introduced in Lok Sabha", lastActionDate: "18 Feb 2025", controversy: "low" },
  { id: "telecom-amend", number: "6/2026", title: "Telecommunications (Amendment) Bill, 2026", ministry: "Telecom", status: "committee", type: "ordinary", introducedDate: "3 Feb 2026", lastAction: "Referred to Standing Committee on Communications", lastActionDate: "6 Feb 2026", controversy: "medium" },
  { id: "data-2026", number: "9/2026", title: "Digital Personal Data Protection (Amendment) Bill, 2026", ministry: "Electronics & IT", status: "introduced", type: "ordinary", introducedDate: "10 Feb 2026", lastAction: "Introduced in Lok Sabha (replaces Ordinance)", lastActionDate: "10 Feb 2026", controversy: "medium" },
  { id: "gig", number: "11/2026", title: "Gig Workers (Welfare and Social Security) Bill, 2026", ministry: "Labour & Employment", status: "committee", type: "ordinary", introducedDate: "14 Feb 2026", lastAction: "Referred to Standing Committee on Labour", lastActionDate: "17 Feb 2026", controversy: "low" },
];

// ─── Supreme Court ───────────────────────────────────────────────────────────

export interface SCCase {
  id: string;
  title: string;
  petitionNumber: string;
  caseType: "PIL" | "Writ" | "Appeal" | "SLP" | "Reference";
  topic: string;
  status: "filed" | "listed" | "hearing" | "reserved" | "decided" | "sent-back";
  bench: string;
  lastHearing: string;
  significance: "landmark" | "major" | "routine";
  articlesChallenged: string[];
  summary: string;
}

export const SC_CASE_STATUS: Record<SCCase["status"], { label: string; color: string }> = {
  filed:     { label: "Filed",      color: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
  listed:    { label: "Listed",     color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  hearing:   { label: "In Hearing", color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
  reserved:  { label: "Reserved",   color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30" },
  decided:   { label: "Decided",    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
  "sent-back": { label: "Sent Back", color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30" },
};

export const SC_CASES: SCCase[] = [
  { id: "waqf-challenge", title: "In re: Waqf (Amendment) Act, 2024", petitionNumber: "WP(C) 714/2024", caseType: "Writ", topic: "Constitutional validity of Waqf Amendment", status: "hearing", bench: "CJI Sanjiv Khanna, JJ Sanjay Kumar, KV Viswanathan", lastHearing: "15 May 2025", significance: "landmark", articlesChallenged: ["Art. 14", "Art. 25", "Art. 26", "Art. 300A"], summary: "Batch of 140+ petitions challenging Waqf Amendment Act. Petitioners allege it violates the secular character and property rights of Muslims. Centre defends it as a regulatory reform." },
  { id: "onoe-challenge", title: "CPIL v. Union of India (ONOE)", petitionNumber: "WP(C) 1285/2024", caseType: "PIL", topic: "One Nation One Election — basic structure", status: "listed", bench: "CJI Sanjiv Khanna, JJ BR Gavai, AS Oka", lastHearing: "8 Jan 2025", significance: "landmark", articlesChallenged: ["Art. 83", "Art. 172", "Art. 368"], summary: "Challenge to Constitution 129th Amendment on grounds that simultaneous elections undermine federal structure and democracy — both recognised as basic structure elements." },
  { id: "sub-classification", title: "Pujari Suresh Kumar v. State of Tamil Nadu", petitionNumber: "CA 6398/2022", caseType: "Appeal", topic: "Sub-classification within SC/ST reservations", status: "decided", bench: "7-judge Constitution Bench — CJI DY Chandrachud (led)", lastHearing: "1 Aug 2024", significance: "landmark", articlesChallenged: ["Art. 341", "Art. 342", "Art. 15", "Art. 16"], summary: "7-judge bench held 6:1 that States can sub-classify within SC/ST categories for reservation purposes. Overruled EV Chinnaiah (2004). States may now prioritise the most backward within SC/ST." },
  { id: "bulldozer", title: "In re: Demolitions without notice", petitionNumber: "SMW(Crl) 1/2024", caseType: "Writ", topic: "Due process — bulldozer demolitions — Art. 21", status: "decided", bench: "JJ BR Gavai, KV Viswanathan", lastHearing: "13 Nov 2024", significance: "landmark", articlesChallenged: ["Art. 14", "Art. 21", "Art. 300A"], summary: "SC issued nationwide guidelines: 15-day notice mandatory, designated officer must decide, personal hearing required. Contempt proceedings ongoing against non-compliant DMs." },
  { id: "evm-vvpat", title: "ADR v. ECI (EVM-VVPAT verification)", petitionNumber: "WP(C) 434/2023", caseType: "PIL", topic: "EVM reliability — 100% VVPAT cross-verification", status: "decided", bench: "JJ Sanjiv Khanna, Dipankar Datta", lastHearing: "26 Apr 2024", significance: "major", articlesChallenged: ["Art. 324", "Art. 19(1)(a)"], summary: "SC dismissed petitions seeking 100% VVPAT slip count. Held EVMs are reliable and mandated post-election audit protocol. Reaffirmed ECI's independence under Art. 324." },
  { id: "electoral-bonds", title: "ADR v. SBI — Electoral Bond Compliance", petitionNumber: "WP(C) 880/2017", caseType: "PIL", topic: "Electoral Bond Scheme — unconstitutional", status: "decided", bench: "5-judge Constitution Bench — CJI DY Chandrachud (led)", lastHearing: "26 Feb 2024", significance: "landmark", articlesChallenged: ["Art. 19(1)(a)", "Art. 324"], summary: "5-judge bench unanimously struck down Electoral Bond Scheme as unconstitutional. Directed SBI to disclose all bond data. ECI published full data on 21 Mar 2024 (₹16,518 cr total)." },
  { id: "manipur", title: "In re: Situation in Manipur", petitionNumber: "WP(Crl) 36/2023", caseType: "Writ", topic: "State violence, rehabilitation — Art. 21", status: "hearing", bench: "CJI Sanjiv Khanna, JJ Sanjay Kumar, KV Viswanathan", lastHearing: "22 Apr 2025", significance: "major", articlesChallenged: ["Art. 21", "Art. 22"], summary: "SC monitoring rehabilitation and FIR registration in Manipur ethnic violence cases. Government filed compliance report with 18,200 persons rehabilitated, 4,800 FIRs registered." },
  { id: "telecom-surveillance", title: "IFF v. Union of India (Telecom Act)", petitionNumber: "WP(C) 3291/2024", caseType: "PIL", topic: "Telecom Act surveillance provisions — Art. 21", status: "listed", bench: "JJ PS Narasimha, Aravind Kumar", lastHearing: "14 Mar 2025", significance: "major", articlesChallenged: ["Art. 19(1)(a)", "Art. 21"], summary: "Challenge to interception and surveillance provisions of Telecommunications Act, 2023 on privacy and proportionality grounds. Notices issued to MoT and CERT-In." },
];

// ─── Elections ───────────────────────────────────────────────────────────────

export interface ElectionUpdate {
  id: string;
  state: string;
  electionType: "Assembly" | "Lok Sabha" | "By-election" | "Council";
  status: "announced" | "campaigning" | "voting" | "counting" | "declared";
  dates: string;
  seats: number;
  turnout?: number;
  winner?: string;
  mccActive: boolean;
  phases?: number;
}

export const ELECTION_STATUS_META: Record<ElectionUpdate["status"], { label: string; color: string }> = {
  announced:   { label: "Announced",   color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  campaigning: { label: "Campaigning", color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
  voting:      { label: "Voting",      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
  counting:    { label: "Counting",    color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30" },
  declared:    { label: "Declared",    color: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
};

export const ELECTION_UPDATES: ElectionUpdate[] = [
  { id: "by-2026", state: "Multiple States", electionType: "By-election", status: "announced", dates: "15 Aug 2026", seats: 11, mccActive: true },
  { id: "hp-council-2026", state: "Himachal Pradesh", electionType: "Council", status: "campaigning", dates: "20 Jun 2026", seats: 6, mccActive: true },
  { id: "jammu-2026", state: "Jammu (UT)", electionType: "By-election", status: "voting", dates: "5 Jun 2026", seats: 2, turnout: 42.1, mccActive: true },
  { id: "bihar-2025", state: "Bihar", electionType: "Assembly", status: "declared", dates: "Oct–Nov 2025", seats: 243, turnout: 56.4, winner: "NDA — JDU-BJP (159 seats)", mccActive: false, phases: 5 },
  { id: "delhi-2025", state: "Delhi", electionType: "Assembly", status: "declared", dates: "5 Feb 2025", seats: 70, turnout: 60.4, winner: "BJP (48 seats)", mccActive: false },
  { id: "jharkhand-2024", state: "Jharkhand", electionType: "Assembly", status: "declared", dates: "Nov 2024", seats: 81, turnout: 67.7, winner: "JMM-INC (56 seats)", mccActive: false, phases: 2 },
  { id: "maharashtra-2024", state: "Maharashtra", electionType: "Assembly", status: "declared", dates: "20 Nov 2024", seats: 288, turnout: 65.0, winner: "Mahayuti (231 seats)", mccActive: false },
];

// ─── Cabinet ─────────────────────────────────────────────────────────────────

export interface CabinetEvent {
  id: string;
  type: "reshuffle" | "new-minister" | "resignation" | "expansion" | "portfolio-change";
  date: string;
  minister: string;
  ministry: string;
  detail: string;
  significance: "high" | "medium" | "low";
}

export const CABINET_EVENTS: CabinetEvent[] = [
  { id: "cab-6", type: "resignation", date: "15 Mar 2026", minister: "Anurag Thakur", ministry: "I&B", detail: "Resigned citing personal reasons; IB portfolio held by PM temporarily. Scindia given additional charge.", significance: "high" },
  { id: "cab-5", type: "expansion", date: "28 Feb 2026", minister: "3 new ministers", ministry: "Tourism, Fisheries, Tribal Affairs", detail: "3 new Ministers of State inducted at Rashtrapati Bhavan swearing ceremony.", significance: "medium" },
  { id: "cab-4", type: "portfolio-change", date: "3 Jan 2026", minister: "Nirmala Sitharaman", ministry: "Finance + Corporate Affairs", detail: "Sitharaman given additional charge of Corporate Affairs on Goyal's brief medical leave.", significance: "low" },
  { id: "cab-3", type: "new-minister", date: "14 Oct 2025", minister: "Samrat Choudhary", ministry: "Skill Development (MoS)", detail: "Bihar Deputy CM inducted into Union Cabinet as Minister of State. Political significance for Bihar elections.", significance: "medium" },
  { id: "cab-2", type: "portfolio-change", date: "8 Jun 2025", minister: "Jyotiraditya Scindia", ministry: "External Affairs (Addl. charge)", detail: "Scindia given additional charge of MEA alongside Telecom after EAM's medical leave.", significance: "high" },
  { id: "cab-1", type: "reshuffle", date: "9 Jun 2024", minister: "18 Cabinet + 41 MoS", ministry: "Various", detail: "Largest cabinet formation — 59 ministers sworn in after NDA's 3rd consecutive victory. 8 first-timers.", significance: "high" },
];

// ─── Governors ───────────────────────────────────────────────────────────────

export interface GovernorChange {
  id: string;
  type: "appointed" | "transferred" | "additional-charge" | "resigned";
  date: string;
  governor: string;
  state: string;
  previousState?: string;
  detail: string;
}

export const GOVERNOR_CHANGES: GovernorChange[] = [
  { id: "gov-7", type: "transferred", date: "5 May 2026", governor: "Gulab Chand Kataria", state: "Punjab", previousState: "Assam", detail: "Transferred to Punjab amid political controversy in Assam. New Assam Governor to be announced." },
  { id: "gov-6", type: "additional-charge", date: "22 Mar 2026", governor: "Santosh Kumar Gangwar", state: "Maharashtra (addl.)", previousState: "Jharkhand", detail: "Gangwar given additional charge of Maharashtra pending permanent appointment." },
  { id: "gov-5", type: "appointed", date: "8 Jan 2025", governor: "Rajendra Vishwanath Arlekar", state: "Kerala", previousState: "Bihar", detail: "Transferred from Bihar to Kerala. Took charge on 10 Jan following predecessor's resignation." },
  { id: "gov-4", type: "resigned", date: "2 Dec 2024", governor: "Arif Mohammed Khan", state: "Kerala", detail: "Resigned after prolonged standoff with state government on university appointments and bill assents." },
  { id: "gov-3", type: "appointed", date: "18 Aug 2024", governor: "R.L. Bhatia", state: "Tamil Nadu", detail: "New Governor appointed following R.N. Ravi's recall after 18-month standoff with DMK government." },
  { id: "gov-2", type: "transferred", date: "28 Jul 2024", governor: "R.N. Ravi", state: "Tamil Nadu", detail: "Recalled after prolonged dispute with DMK government — 17 bills pending assent, UC address dispute." },
  { id: "gov-1", type: "appointed", date: "18 Feb 2024", governor: "C.V. Ananda Bose", state: "West Bengal", detail: "Reappointed for second term. Ongoing dispute with Trinamool government on bills and appointments." },
];

// ─── Ordinances ──────────────────────────────────────────────────────────────

export interface Ordinance {
  id: string;
  number: string;
  title: string;
  ministry: string;
  promulgatedDate: string;
  reason: string;
  status: "active" | "replaced-by-act" | "lapsed" | "withdrawn";
  controversy: "low" | "medium" | "high";
}

export const ORDINANCES: Ordinance[] = [
  { id: "ord-5", number: "Ord. 7/2026", title: "Seeds (Amendment) Ordinance, 2026", ministry: "Agriculture", promulgatedDate: "22 Mar 2026", reason: "Urgent seed quality certification regime before kharif season. 3 states have filed objections.", status: "active", controversy: "low" },
  { id: "ord-4", number: "Ord. 5/2026", title: "Enemy Property (Amendment) Ordinance, 2026", ministry: "Home Affairs", promulgatedDate: "12 Feb 2026", reason: "Expedite disposal of enemy property cases; corresponding Bill not yet passed in Rajya Sabha.", status: "active", controversy: "high" },
  { id: "ord-3", number: "Ord. 2/2026", title: "Banking Laws (Second Amendment) Ordinance, 2026", ministry: "Finance", promulgatedDate: "4 Jan 2026", reason: "Urgent cooperative bank governance norms during Parliament recess.", status: "active", controversy: "low" },
  { id: "ord-2", number: "Ord. 8/2025", title: "Digital Personal Data Protection (Amendment) Ordinance, 2025", ministry: "Electronics & IT", promulgatedDate: "3 Dec 2025", reason: "Urgency in data localisation and consent framework changes; replaced by Bill in Budget Session.", status: "replaced-by-act", controversy: "medium" },
  { id: "ord-1", number: "Ord. 3/2025", title: "J&K Reservation (Amendment) Ordinance, 2025", ministry: "Home Affairs", promulgatedDate: "15 Jan 2025", reason: "Urgency to implement SC direction on OBC survey results before state session.", status: "replaced-by-act", controversy: "medium" },
];

// ─── Live Event Pool ──────────────────────────────────────────────────────────

export const EVENT_POOL: LiveEvent[] = [
  { id: "ev1",  category: "parliament", priority: "breaking", title: "Lok Sabha passes Immigration & Foreigners Bill — 312 ayes vs 89 noes", detail: "The Bill consolidating 4 colonial-era laws sailed through after a 6-hour debate. Opposition staged walkout citing detention provisions as draconian.", source: "Lok Sabha Secretariat", tags: ["Lok Sabha", "Home Affairs", "18th LS"], articleRef: "Art. 246" },
  { id: "ev2",  category: "court",      priority: "breaking", title: "SC 5-bench admits Waqf Amendment challenge; 3 provisions stayed", detail: "CJI Sanjiv Khanna's bench admitted the batch of 140 petitions and stayed implementation of Sec. 3C, 3D and 9A pending further hearing. Centre given 4 weeks.", source: "Supreme Court of India", tags: ["Waqf", "Minorities", "Art. 25"], articleRef: "Art. 25–26" },
  { id: "ev3",  category: "election",   priority: "breaking", title: "ECI announces Bihar Assembly Election — 5 phases, Oct 15 to Nov 12", detail: "Chief Election Commissioner announced the schedule. MCC in force immediately. 7.5 crore voters eligible. Results Nov 15. Security forces from CRPF and SSB to be deployed.", source: "Election Commission of India", tags: ["Bihar", "Assembly", "ECI"], articleRef: "Art. 324" },
  { id: "ev4",  category: "cabinet",    priority: "breaking", title: "Cabinet reshuffle: Anurag Thakur resignation accepted; Scindia gets I&B charge", detail: "President Droupadi Murmu accepted resignation of Anurag Thakur. Jyotiraditya Scindia given additional charge of I&B alongside existing Telecom and MEA portfolios.", source: "Rashtrapati Bhavan", tags: ["Cabinet", "Reshuffle", "I&B"], articleRef: "Art. 75" },
  { id: "ev5",  category: "ordinance",  priority: "breaking", title: "President promulgates Digital Personal Data Protection (Amendment) Ordinance, 2026", detail: "Ordinance promulgated on advice of Council of Ministers while Parliament is in summer recess. Parliament notification issued. Bill to replace it in Monsoon Session.", source: "Ministry of Electronics & IT", tags: ["Ordinance", "Data Protection", "Privacy"], articleRef: "Art. 123" },
  { id: "ev6",  category: "governor",   priority: "high",     title: "West Bengal Governor returns state Appropriation Bill for 3rd time", detail: "Governor C.V. Ananda Bose returned the Appropriation Bill citing procedural irregularities. CM Mamata Banerjee convened emergency cabinet meet and called it 'unconstitutional interference'.", source: "Raj Bhavan, Kolkata", tags: ["West Bengal", "Governor", "Art. 200"], articleRef: "Art. 200" },
  { id: "ev7",  category: "parliament", priority: "high",     title: "ONOE Constitutional Amendment Bill: Opposition motion to refer to Select Committee fails 322:138", detail: "Government defeated the motion comfortably. Bill proceeds to clause-by-clause consideration. BJP says it will secure special majority across both sessions.", source: "Lok Sabha Secretariat", tags: ["ONOE", "Amendment", "Art. 368"], articleRef: "Art. 368" },
  { id: "ev8",  category: "court",      priority: "high",     title: "SC extends stay on bulldozer demolitions in UP — contempt notice to DM Mathura", detail: "Bench noted DM of Mathura carried out 17 demolitions post-November 2024 guidelines. Personal appearance ordered in 2 weeks. State filed compliance report showing 142 post-order demolitions nationwide.", source: "Supreme Court of India", tags: ["Demolitions", "Art. 21", "UP"], articleRef: "Art. 21" },
  { id: "ev9",  category: "election",   priority: "high",     title: "MCC in force for 3 constituencies — Jammu UT by-election, HP Council, Assam by-poll", detail: "Election Commission says any new government schemes announced during MCC period will be reviewed. Central transfers require EC permission. Political parties notified.", source: "Election Commission of India", tags: ["MCC", "By-elections", "Model Code"] },
  { id: "ev10", category: "cabinet",    priority: "high",     title: "Cabinet approves PM-GATI Shakti 2.0 — ₹2.1 lakh crore infrastructure plan for FY2026-27", detail: "Union Cabinet approved extension covering roads, railways, ports and digital connectivity. Expenditure over 3 years. 68 new infrastructure projects identified under the PM's flagship scheme.", source: "PIB India", tags: ["Cabinet", "Infrastructure", "GATI Shakti"], articleRef: "Art. 77" },
  { id: "ev11", category: "parliament", priority: "high",     title: "Waqf Amendment Bill referred to JPC — 31-member committee constituted", detail: "Lok Sabha Speaker O.M. Birla constituted 21+10 member JPC. Opposition elected 10 members. JPC directed to submit report within 90 days or before next Budget Session.", source: "Lok Sabha Secretariat", tags: ["Waqf", "JPC", "Parliament"] },
  { id: "ev12", category: "court",      priority: "high",     title: "SC refers ONOE validity to 7-judge Constitution bench — federal structure at stake", detail: "3-judge bench held questions of federal structure, right to vote at fixed intervals, and democracy as a basic feature are 'sufficiently profound' for a 7-judge bench.", source: "Supreme Court of India", tags: ["ONOE", "Constitution Bench", "Basic Structure"], articleRef: "Art. 368" },
  { id: "ev13", category: "ordinance",  priority: "high",     title: "Enemy Property Ordinance 2026 challenged in Delhi HC — notice to Centre", detail: "PIL filed by minority organisations citing Art. 14 violation. HC issued notice to Centre and tagged with pending Rajya Sabha bill proceedings. 6-week return date.", source: "Delhi High Court", tags: ["Enemy Property", "Ordinance", "Art. 14"], articleRef: "Art. 14" },
  { id: "ev14", category: "governor",   priority: "high",     title: "Telangana Governor appoints inquiry into Speaker's inaction on 10 defection petitions", detail: "Governor designated retired HC judge to probe Speaker's 18-month delay on BRS MLA petitions. Speaker's office disputes constitutional competence of Governor to make such appointments.", source: "Raj Bhavan, Hyderabad", tags: ["Telangana", "Defection", "10th Schedule"], articleRef: "10th Schedule" },
  { id: "ev15", category: "election",   priority: "medium",   title: "Bihar Phase 2: 58.3% turnout by 5 PM across 52 constituencies", detail: "Voting peaceful in most districts. Sec. 144 in Muzaffarpur and Saran. 2 EVMs replaced in Patna Sahib after technical faults. Voter turnout higher than 2020 Phase 2 (54.1%).", source: "ECI Bihar Observer", tags: ["Bihar", "Phase 2", "Turnout"] },
  { id: "ev16", category: "parliament", priority: "medium",   title: "Question Hour: Home Minister answers on border roads — 1,840 km completed by BRO", detail: "Home Minister informed Lok Sabha that BRO completed 1,840 km of border roads in FY2025-26 against target of 2,000 km. 420 km remaining in Arunachal Pradesh segment.", source: "Lok Sabha Secretariat", tags: ["Question Hour", "Border Roads", "BRO"] },
  { id: "ev17", category: "court",      priority: "medium",   title: "SC hears Manipur case — state files 312-page rehabilitation status report", detail: "Report shows 18,200 displaced persons rehabilitated, 4,800 FIRs registered, 241 persons chargesheeted. Bench not satisfied with pace of trial in special court. Next date July 15.", source: "Supreme Court of India", tags: ["Manipur", "Art. 21", "Rehabilitation"], articleRef: "Art. 21" },
  { id: "ev18", category: "cabinet",    priority: "medium",   title: "Cabinet Committee on Security meets — decisions on MRFA and submarine programme", detail: "PM chaired 3-hour CCS meeting. Sources indicate in-principle approval for MRFA fighter jets and next submarine class. Official PIB release expected within 48 hours.", source: "PMO India", tags: ["CCS", "Defence", "Security"] },
  { id: "ev19", category: "election",   priority: "medium",   title: "ECI adds 1.4 crore new voters in Special Summary Revision 2026", detail: "Largest single revision in Maharashtra, Rajasthan and Gujarat. Final electoral rolls to be published by 30 June. Photo voter ID cards dispatched from Booth Level Officers.", source: "Election Commission of India", tags: ["Voter Roll", "EPIC", "Summary Revision"] },
  { id: "ev20", category: "governor",   priority: "medium",   title: "Kerala Governor signs University Amendment Ordinance despite CM's objection", detail: "New Governor signed the ordinance amending University Acts, restoring gubernatorial VC appointment powers. CM Pinarayi Vijayan called it 'unconstitutional overreach' and will challenge in HC.", source: "Raj Bhavan, Thiruvananthapuram", tags: ["Kerala", "University", "VC Appointment"], articleRef: "Art. 200" },
  { id: "ev21", category: "parliament", priority: "medium",   title: "Gig Workers Welfare Bill: Standing Committee hears Zomato, Swiggy, Ola workers", detail: "Labour Standing Committee held 4th hearing session. Worker unions demanded mandatory ESIC, EPF. Platform companies argued for a separate social security framework. Report expected pre-Winter Session.", source: "Lok Sabha Secretariat", tags: ["Gig Economy", "Labour", "Standing Committee"] },
  { id: "ev22", category: "court",      priority: "medium",   title: "Delhi HC grants interim bail to ex-AAP leader in liquor policy case — ED to approach SC", detail: "HC held continued detention no longer warranted after 22 months. ED counsel stated agency will file urgent SLP in SC. Bail with ₹50 lakh surety and passport deposit.", source: "Delhi High Court", tags: ["Liquor Policy", "ED", "Bail"], articleRef: "Art. 22" },
  { id: "ev23", category: "ordinance",  priority: "medium",   title: "Seeds Ordinance 2026: Punjab, Telangana, Kerala file objections to Centre", detail: "3 state governments wrote to Ministry of Agriculture citing federal overreach. Seeds regulation under Concurrent List. Centre says ordinance needed before kharif sowing season.", source: "Ministry of Agriculture", tags: ["Seeds", "Agriculture", "Federalism"], articleRef: "Art. 246" },
  { id: "ev24", category: "parliament", priority: "low",      title: "Rajya Sabha Zero Hour: 12 members raise Uttarakhand flood relief delay", detail: "Members from 7 parties cited NDRF deployment lags. MHA confirmed Rs 980 crore SDRF released. Minister of State assured a special committee to review relief disbursement pace.", source: "Rajya Sabha TV", tags: ["Rajya Sabha", "Zero Hour", "NDRF"] },
  { id: "ev25", category: "election",   priority: "low",      title: "HP Vidhan Parishad: 28 candidates for 6 Council seats — polling June 20", detail: "28 candidates in the fray. Electorate includes MLAs, MPs and registered graduates. Counting on the same day. BJP fields all 6 seats; Congress and AAP in alliance for 3.", source: "ECI Himachal Pradesh", tags: ["HP Council", "Vidhan Parishad"] },
  { id: "ev26", category: "cabinet",    priority: "low",      title: "Cabinet approves 100% FDI under automatic route for satellite manufacturing", detail: "Union Cabinet liberalised FDI in space sector. Satellite manufacturing, launch vehicles and ground stations now open to full foreign investment. Expected to boost ISRO commercial launches.", source: "DPIIT", tags: ["FDI", "Space", "ISRO"] },
  { id: "ev27", category: "court",      priority: "low",      title: "SC registry lists 3 new constitutional matters — Telecom Act, OBC creamy layer, forest rights", detail: "Matters listed for admission hearing next week. 2-judge bench to decide whether reference to Constitution bench is warranted for OBC creamy layer revision petition.", source: "Supreme Court of India", tags: ["SC Causelist", "Constitutional", "Forest Rights"] },
  { id: "ev28", category: "parliament", priority: "low",      title: "Budget Session 2026 concludes — 93% productivity, 10 bills enacted in 58 sittings", detail: "Lok Sabha Speaker noted 93% productivity against 15-year average of 76%. 10 bills enacted, 2,100+ starred questions answered. Opposition participated in 82% of debates.", source: "Lok Sabha Secretariat", tags: ["Budget Session", "Productivity", "Statistics"] },
  { id: "ev29", category: "governor",   priority: "low",      title: "Nagaland Governor addresses state legislature on 63rd Statehood Day", detail: "Governor La. Ganesan's customary address highlighted peace talks progress, Naga political dialogue status and infrastructure gains under NEDP. 85% of address focused on development.", source: "Raj Bhavan, Kohima", tags: ["Nagaland", "Statehood Day", "Governor Address"], articleRef: "Art. 176" },
  { id: "ev30", category: "ordinance",  priority: "low",      title: "Banking Ordinance 2026: 6 cooperative banks file compliance within 45-day window", detail: "RBI confirmed receipt of compliance reports from 6 cooperative banks. 14 banks still pending. RBI issued advisory that non-compliance will invite supervisory action.", source: "Reserve Bank of India", tags: ["Banking", "Cooperative", "RBI", "Compliance"] },
];
