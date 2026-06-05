// ─── Types ────────────────────────────────────────────────────────────────────

export type CaseCategory =
  | "basic_structure"
  | "fundamental_rights"
  | "federalism"
  | "social_justice"
  | "environment"
  | "pil"
  | "gender"
  | "privacy"
  | "speech"
  | "criminal";

export interface LandmarkCase {
  id: string;
  name: string;
  short: string;
  year: number;
  citation: string;
  benchSize: number;
  category: CaseCategory;
  articles: string[];
  summary: string;
  impact: string;
  tags: string[];
  overruled?: boolean;
}

export interface HighCourtData {
  id: string;
  name: string;
  city: string;
  states: string[];
  established: number;
  sanctioned: number;
  region: "North" | "South" | "East" | "West" | "Northeast" | "Central";
  benches: string[];
  notable: string;
}

export interface ConstitutionalBenchCase {
  id: string;
  name: string;
  year: number;
  benchSize: number;
  articles: string[];
  outcome: string;
  significance: string;
  vote?: string;
  dissentBy?: string;
  overruled?: boolean;
}

export interface PILStep {
  step: number;
  title: string;
  actor: string;
  description: string;
  basis: string;
  duration: string;
  icon: string;
}

export interface AppealsRoute {
  id: string;
  name: string;
  color: string;
  icon: string;
  basis: string;
  stages: Array<{ court: string; basis: string }>;
}

export interface GraphNode {
  id: string;
  label: string;
  year: number;
  category: CaseCategory;
  x: number;
  y: number;
  size: "xl" | "lg" | "md" | "sm";
  overruled?: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface JudicialReviewPower {
  article: string;
  title: string;
  court: "sc" | "hc" | "both";
  description: string;
  grounds: string[];
  landmark: string;
}

export interface WritType {
  name: string;
  latin: string;
  against: string;
  purpose: string;
  example: string;
  article: string;
}

export interface CourtLevel {
  id: string;
  name: string;
  type: "supreme" | "high" | "district" | "subordinate" | "tribunal";
  basis: string;
  count: string;
  judges: string;
  jurisdiction: string;
  powers: string[];
  children: string[];
}

// ─── Court Hierarchy ──────────────────────────────────────────────────────────

export const COURT_LEVELS: CourtLevel[] = [
  {
    id: "sc",
    name: "Supreme Court of India",
    type: "supreme",
    basis: "Art. 124–147",
    count: "1",
    judges: "CJI + 33 Judges (sanctioned: 34)",
    jurisdiction: "Whole of India — original, appellate, advisory",
    powers: [
      "Original jurisdiction in inter-state and Centre–State disputes (Art. 131)",
      "Appellate jurisdiction via SLP (Art. 136)",
      "Constitutional interpretation (Art. 132–134)",
      "Advisory jurisdiction (Presidential Reference, Art. 143)",
      "Judicial review of legislation under Art. 13",
      "Enforcement of Fundamental Rights (Art. 32) — itself a Fundamental Right",
      "Complete justice under Art. 142",
    ],
    children: ["hc", "ngt", "nclt", "cat", "aft"],
  },
  {
    id: "hc",
    name: "High Courts (25)",
    type: "high",
    basis: "Art. 214–231",
    count: "25",
    judges: "Varies — Allahabad (160) to Sikkim (3)",
    jurisdiction: "Each state/UT — original, appellate, supervisory",
    powers: [
      "Writ jurisdiction under Art. 226 (broader than Art. 32)",
      "Superintendence over all subordinate courts (Art. 227)",
      "Original jurisdiction in matters of value above threshold",
      "Appellate jurisdiction over district/subordinate courts",
      "Reference jurisdiction from subordinate courts",
    ],
    children: ["district", "sessions"],
  },
  {
    id: "district",
    name: "District Courts (Civil)",
    type: "district",
    basis: "Code of Civil Procedure, 1908",
    count: "~672 districts",
    judges: "District Judge + Additional District Judges",
    jurisdiction: "District level — civil matters above threshold",
    powers: [
      "Original civil jurisdiction",
      "First appellate court for Civil Judge's decisions",
      "Matrimonial and succession matters",
      "Insolvency proceedings",
    ],
    children: ["civil_subordinate", "family"],
  },
  {
    id: "sessions",
    name: "District & Sessions Courts (Criminal)",
    type: "district",
    basis: "Code of Criminal Procedure, 1973",
    count: "~672 districts",
    judges: "Sessions Judge (also District Judge in most states)",
    jurisdiction: "District level — criminal matters",
    powers: [
      "Trial of cases under IPC and special laws",
      "Appellate court for Magistrate decisions",
      "Confirmation of death sentences from Magistrate courts",
      "Bail applications in serious cases",
    ],
    children: ["magistrate", "cjm"],
  },
  {
    id: "civil_subordinate",
    name: "Civil Judge Courts",
    type: "subordinate",
    basis: "State Civil Courts Acts",
    count: "Thousands",
    judges: "Civil Judge (Senior/Junior Division)",
    jurisdiction: "Civil matters up to prescribed value",
    powers: [
      "Suits for recovery of money",
      "Property disputes below value threshold",
      "Injunctions in civil matters",
    ],
    children: [],
  },
  {
    id: "family",
    name: "Family Courts",
    type: "subordinate",
    basis: "Family Courts Act, 1984",
    count: "~800+",
    judges: "Principal Judge / Judge, Family Court",
    jurisdiction: "Matrimonial disputes, guardianship, maintenance",
    powers: [
      "Divorce proceedings",
      "Child custody and guardianship",
      "Maintenance and alimony",
      "Restitution of conjugal rights",
    ],
    children: [],
  },
  {
    id: "magistrate",
    name: "Judicial Magistrate Courts",
    type: "subordinate",
    basis: "CrPC, 1973",
    count: "Thousands",
    judges: "JMFC / Magistrate 1st/2nd/3rd Class",
    jurisdiction: "Criminal matters — trial of offences up to 3 years imprisonment",
    powers: [
      "Summary trials for petty offences",
      "Remand of accused",
      "Bail applications for bailable offences",
      "Committal proceedings for Sessions Court",
    ],
    children: [],
  },
  {
    id: "ngt",
    name: "National Green Tribunal",
    type: "tribunal",
    basis: "NGT Act, 2010",
    count: "1 (+ regional benches)",
    judges: "Chairperson + expert members",
    jurisdiction: "Environmental disputes and cases",
    powers: [
      "Adjudication of environmental disputes",
      "Compensation for environmental damage",
      "Enforcement of environmental laws",
    ],
    children: [],
  },
  {
    id: "nclt",
    name: "NCLT / NCLAT",
    type: "tribunal",
    basis: "Companies Act, 2013",
    count: "16 Benches (NCLT)",
    judges: "President + Members (Judicial + Technical)",
    jurisdiction: "Corporate insolvency, mergers, winding-up",
    powers: [
      "Insolvency resolution under IBC, 2016",
      "Approval of mergers and demergers",
      "Winding up of companies",
    ],
    children: [],
  },
  {
    id: "cat",
    name: "Central Administrative Tribunal",
    type: "tribunal",
    basis: "Administrative Tribunals Act, 1985 / Art. 323A",
    count: "17 Benches",
    judges: "Chairman + Members (Judicial + Administrative)",
    jurisdiction: "Service matters of Central government employees",
    powers: [
      "Recruitment disputes",
      "Promotions, transfers, disciplinary matters",
      "Service conditions of Central government employees",
    ],
    children: [],
  },
];

// ─── Landmark Cases ───────────────────────────────────────────────────────────

export const LANDMARK_CASES: LandmarkCase[] = [
  {
    id: "ak-gopalan",
    name: "A.K. Gopalan v State of Madras",
    short: "A.K. Gopalan",
    year: 1950,
    citation: "AIR 1950 SC 27",
    benchSize: 6,
    category: "fundamental_rights",
    articles: ["19", "21", "22"],
    summary: "Held that fundamental rights must be read independently (silos approach). Art. 21 personal liberty does not include Art. 19 freedoms. Preventive detention is valid under its own Article. Later overruled by Maneka Gandhi (1978).",
    impact: "The narrow reading of Art. 21 enabled extensive preventive detention during the Emergency. Its overruling by Maneka Gandhi transformed Art. 21 into the most expansive fundamental right.",
    tags: ["personal liberty", "preventive detention", "silo approach"],
    overruled: true,
  },
  {
    id: "champakam",
    name: "State of Madras v Champakam Dorairajan",
    short: "Champakam",
    year: 1951,
    citation: "AIR 1951 SC 226",
    benchSize: 5,
    category: "social_justice",
    articles: ["15", "16", "29"],
    summary: "Communal reservation in state educational seats violated Art. 29(2) and Art. 15(1). Led to the First Constitutional Amendment (1951) adding Art. 15(4) to enable state-based reservation for backward classes.",
    impact: "Triggered the very first amendment to the Constitution. Established the legislative basis for affirmative action in education, which has been contested and refined ever since.",
    tags: ["reservation", "education", "1st Amendment"],
  },
  {
    id: "golaknath",
    name: "I.C. Golak Nath v State of Punjab",
    short: "Golaknath",
    year: 1967,
    citation: "AIR 1967 SC 1643",
    benchSize: 11,
    category: "basic_structure",
    articles: ["13", "368"],
    summary: "6:5 majority held that Parliament cannot amend fundamental rights under Art. 368. Constitution's Preamble and Part III are beyond Parliament's amendatory power. Overruled by Kesavananda Bharati (1973).",
    impact: "Sparked the fundamental rights vs parliamentary supremacy debate. Led to 24th & 25th Amendments, the Emergency, and ultimately the historic Kesavananda Bharati judgment.",
    tags: ["amendment power", "fundamental rights"],
    overruled: true,
  },
  {
    id: "kesavananda",
    name: "Kesavananda Bharati v State of Kerala",
    short: "Kesavananda Bharati",
    year: 1973,
    citation: "(1973) 4 SCC 225",
    benchSize: 13,
    category: "basic_structure",
    articles: ["13", "32", "368"],
    summary: "7:6 majority — Parliament can amend any part of the Constitution including fundamental rights, but cannot alter the 'Basic Structure' — the essential features defining the Constitution's identity. Overruled Golaknath.",
    impact: "The most consequential constitutional judgment ever delivered. Established the Basic Structure Doctrine protecting judicial review, federalism, democracy, and secularism from parliamentary majoritarian amending. The doctrine has shaped every major constitutional challenge since.",
    tags: ["basic structure doctrine", "largest bench ever", "7-6 majority"],
  },
  {
    id: "indira-gandhi",
    name: "Indira Nehru Gandhi v Raj Narain",
    short: "Indira Gandhi Election Case",
    year: 1975,
    citation: "AIR 1975 SC 2299",
    benchSize: 5,
    category: "basic_structure",
    articles: ["329A", "368"],
    summary: "Art. 329A inserted by the 39th Amendment (validating the PM's election from the backdoor) was struck down as destroying the Basic Structure — free and fair elections are a core constitutional feature.",
    impact: "First application of the Basic Structure Doctrine to strike down a constitutional amendment. Free and fair elections, democracy, and rule of law embedded in Basic Structure.",
    tags: ["elections", "39th Amendment", "Basic Structure application"],
  },
  {
    id: "adm-jabalpur",
    name: "ADM Jabalpur v Shivkant Shukla",
    short: "Habeas Corpus Case",
    year: 1976,
    citation: "AIR 1976 SC 1207",
    benchSize: 5,
    category: "fundamental_rights",
    articles: ["21", "359"],
    summary: "4:1 majority held that during Emergency, the right to move courts for Art. 21 (personal liberty) is completely suspended. Justice H.R. Khanna's lone dissent — that no law could take away life or liberty — cost him the Chief Justiceship.",
    impact: "Called the Supreme Court's darkest hour. Justice Khanna's dissent is a pillar of judicial independence. The 44th Amendment (1978) made Arts. 20 and 21 non-suspendable even during Emergency — ensuring this can never recur.",
    tags: ["Emergency 1975-77", "habeas corpus", "Justice Khanna", "darkest hour"],
    overruled: true,
  },
  {
    id: "maneka-gandhi",
    name: "Maneka Gandhi v Union of India",
    short: "Maneka Gandhi",
    year: 1978,
    citation: "AIR 1978 SC 597",
    benchSize: 7,
    category: "fundamental_rights",
    articles: ["14", "19", "21"],
    summary: "Art. 21's 'procedure established by law' must be just, fair, and reasonable — it cannot be arbitrary, fanciful, or oppressive. Overruled A.K. Gopalan. Fundamental rights must be read harmoniously, not in silos.",
    impact: "Transformed Art. 21 from a narrow anti-detention guarantee into India's most expansive fundamental right. Every subsequent right — to livelihood, education, health, privacy — traces its constitutional lineage to Maneka Gandhi.",
    tags: ["procedure established by law", "Art. 21 expansion", "harmonious reading"],
  },
  {
    id: "hussainara",
    name: "Hussainara Khatoon v State of Bihar",
    short: "Hussainara Khatoon",
    year: 1979,
    citation: "AIR 1979 SC 1360",
    benchSize: 3,
    category: "pil",
    articles: ["21", "39A"],
    summary: "First landmark PIL taken up via a newspaper article on Bihar's undertrials — 40,000+ prisoners languishing in jail longer than their maximum sentence. Court ordered mass release and recognized right to speedy trial and free legal aid.",
    impact: "Established PIL as a transformative tool for accessing justice for the marginalised. Right to speedy trial and free legal aid became fundamental rights under Art. 21.",
    tags: ["first PIL", "undertrials", "speedy trial", "legal aid"],
  },
  {
    id: "minerva-mills",
    name: "Minerva Mills Ltd v Union of India",
    short: "Minerva Mills",
    year: 1980,
    citation: "AIR 1980 SC 1789",
    benchSize: 5,
    category: "basic_structure",
    articles: ["31C", "368"],
    summary: "Struck down Sections 4 & 55 of the 42nd Amendment (1976) that excluded judicial review of Parliament's claim to be implementing Directive Principles. Harmony between Part III (Rights) and Part IV (Directives) is itself a Basic Structure feature.",
    impact: "Confirmed that judicial review of constitutional amendments and the balance between fundamental rights and directive principles cannot be destroyed. Parliament's amending power is limited and conditional.",
    tags: ["42nd Amendment", "rights vs directives", "judicial review of amendments"],
  },
  {
    id: "bandhua-mukti",
    name: "Bandhua Mukti Morcha v Union of India",
    short: "Bandhua Mukti Morcha",
    year: 1984,
    citation: "AIR 1984 SC 802",
    benchSize: 3,
    category: "pil",
    articles: ["21", "23", "32"],
    summary: "PIL by an NGO on behalf of bonded labourers in Faridabad quarries. Court issued comprehensive directions under Art. 32 and appointed a Commissioner to investigate, establishing PIL standing for organizations acting on behalf of those unable to approach courts.",
    impact: "Expanded PIL standing to organizations and third parties. Established use of fact-finding commissions in PILs. Strengthened enforcement of Art. 23 (prohibition of forced labour).",
    tags: ["bonded labour", "PIL standing", "NGO", "commissioners"],
  },
  {
    id: "mc-mehta-env",
    name: "M.C. Mehta v Union of India (Oleum Gas Leak)",
    short: "M.C. Mehta (Absolute Liability)",
    year: 1987,
    citation: "AIR 1987 SC 965",
    benchSize: 5,
    category: "environment",
    articles: ["21", "32"],
    summary: "Established the 'Absolute Liability' doctrine — enterprises engaged in inherently dangerous activities are absolutely liable for any harm, with no exceptions (stricter than England's Rylands v Fletcher rule which had the 'escape' exception).",
    impact: "India's indigenous tort law development. Absolute liability is the foundation of Indian environmental law. The Union Carbide Bhopal Gas Tragedy settlement was reached against this backdrop.",
    tags: ["absolute liability", "hazardous enterprise", "environment law"],
  },
  {
    id: "indra-sawhney",
    name: "Indra Sawhney v Union of India",
    short: "Mandal Commission Case",
    year: 1992,
    citation: "AIR 1993 SC 477",
    benchSize: 9,
    category: "social_justice",
    articles: ["16", "340"],
    summary: "9-judge bench upheld OBC reservations from the Mandal Commission (27%). Ruled: (1) total reservation cannot exceed 50% (the Indra Sawhney ceiling); (2) 'creamy layer' must be excluded; (3) no reservation in promotions (added later by 77th Amendment).",
    impact: "Defined the contours of affirmative action. The 50% ceiling and creamy layer exclusion remain the foundational principles of Indian reservation law, challenged repeatedly but consistently upheld.",
    tags: ["OBC reservation", "50% cap", "creamy layer", "Mandal Commission"],
  },
  {
    id: "bommai",
    name: "S.R. Bommai v Union of India",
    short: "S.R. Bommai",
    year: 1994,
    citation: "(1994) 3 SCC 1",
    benchSize: 9,
    category: "federalism",
    articles: ["356", "74", "75"],
    summary: "Presidential rule under Art. 356 is subject to full judicial review. Floor test is mandatory before dismissal of a state government. Secularism is part of the Basic Structure — a state government promoting communalism can be dismissed under Art. 356.",
    impact: "Drastically curtailed the misuse of Art. 356, which had been used 100+ times to dismiss state governments. Established federalism and secularism in the Basic Structure.",
    tags: ["President's Rule", "Art. 356", "federalism", "floor test"],
  },
  {
    id: "vishaka",
    name: "Vishaka v State of Rajasthan",
    short: "Vishaka",
    year: 1997,
    citation: "AIR 1997 SC 3011",
    benchSize: 3,
    category: "gender",
    articles: ["14", "19", "21"],
    summary: "Bhanwari Devi gang rape case led to PIL. Court laid down binding 'Vishaka Guidelines' on prevention of sexual harassment at workplace — mandatory committees, definitions, redressal mechanisms — drawing from CEDAW.",
    impact: "Created workplace sexual harassment law in India for 16 years, replaced by the POSH Act 2013. First time the SC used an international treaty to fill a domestic legislative vacuum under Art. 51(c).",
    tags: ["sexual harassment", "POSH Act", "international law", "PIL"],
  },
  {
    id: "nalsa",
    name: "National Legal Services Authority v Union of India",
    short: "NALSA (Transgender Rights)",
    year: 2014,
    citation: "(2014) 5 SCC 438",
    benchSize: 2,
    category: "gender",
    articles: ["14", "15", "16", "19", "21"],
    summary: "Unanimously recognized transgender persons as the 'third gender' with full fundamental rights protection. Directed the government to grant OBC status and reservations. Cited Puttaswamy's precursor — the right to self-identify gender flows from Art. 21.",
    impact: "Landmark transgender rights judgment. Led to the Transgender Persons (Protection of Rights) Act, 2019. Preceded and informed the Puttaswamy privacy judgment.",
    tags: ["transgender", "third gender", "gender identity", "social justice"],
  },
  {
    id: "shreya-singhal",
    name: "Shreya Singhal v Union of India",
    short: "Section 66A Case",
    year: 2015,
    citation: "(2015) 5 SCC 1",
    benchSize: 2,
    category: "speech",
    articles: ["19"],
    summary: "Section 66A of the IT Act (criminalising 'offensive' or 'menacing' online speech) struck down as unconstitutional — vague, overbroad, and chilling of free speech under Art. 19(1)(a). Section 69A (website blocking) upheld with safeguards.",
    impact: "India's defining internet free speech ruling. Online speech gets identical constitutional protection as offline speech. The judgment is still actively invoked whenever governments attempt to criminalise digital expression.",
    tags: ["internet freedom", "Section 66A", "IT Act", "free speech"],
  },
  {
    id: "puttaswamy",
    name: "Justice K.S. Puttaswamy v Union of India",
    short: "Right to Privacy",
    year: 2017,
    citation: "(2017) 10 SCC 1",
    benchSize: 9,
    category: "privacy",
    articles: ["14", "19", "21"],
    summary: "Unanimous 9-judge bench declared privacy a fundamental right under Art. 21. Overruled M.P. Sharma (1954) and Kharak Singh (1963) to the extent they denied privacy. Laid down a three-part test for permissible privacy infringements.",
    impact: "Foundational for data protection, bodily autonomy, sexual identity rights, and Aadhaar regulation. Directly enabled Navtej Johar (2018) decriminalising homosexuality. Triggered the Personal Data Protection Bill process.",
    tags: ["right to privacy", "Aadhaar", "data protection", "unanimous 9-judge bench"],
  },
  {
    id: "navtej-johar",
    name: "Navtej Singh Johar v Union of India",
    short: "Section 377 Case",
    year: 2018,
    citation: "(2018) 10 SCC 1",
    benchSize: 5,
    category: "fundamental_rights",
    articles: ["14", "15", "19", "21"],
    summary: "Unanimously struck down Section 377 IPC to the extent it criminalised consensual same-sex relations between adults. Constitutional morality must prevail over popular morality. Partially overruled Suresh Kumar Koushal (2013).",
    impact: "Decriminalised homosexuality after 157 years of British colonial law. Major victory for LGBTQ+ rights. Built on Puttaswamy's privacy guarantee and the concept of constitutional morality.",
    tags: ["LGBTQ+", "Section 377", "constitutional morality", "decriminalisation"],
  },
];

// ─── High Courts ──────────────────────────────────────────────────────────────

export const HIGH_COURTS: HighCourtData[] = [
  { id: "allahabad",   name: "Allahabad HC",          city: "Prayagraj",  states: ["Uttar Pradesh"],                        established: 1866, sanctioned: 160, region: "North",     benches: ["Lucknow"],            notable: "Largest HC by judge strength" },
  { id: "andhra",      name: "Andhra Pradesh HC",      city: "Amaravati",  states: ["Andhra Pradesh"],                       established: 2019, sanctioned: 37,  region: "South",     benches: [],                     notable: "Newest HC, successor to undivided Andhra HC" },
  { id: "bombay",      name: "Bombay HC",              city: "Mumbai",     states: ["Maharashtra", "Goa", "Dadra & NH", "Daman & Diu"], established: 1862, sanctioned: 94, region: "West",  benches: ["Nagpur", "Aurangabad", "Panaji"], notable: "One of three original Charter HCs (1862)" },
  { id: "calcutta",    name: "Calcutta HC",            city: "Kolkata",    states: ["West Bengal", "Andaman & Nicobar"],     established: 1862, sanctioned: 72,  region: "East",      benches: ["Port Blair"],         notable: "Oldest High Court in India" },
  { id: "chhattisgarh",name: "Chhattisgarh HC",        city: "Bilaspur",   states: ["Chhattisgarh"],                         established: 2000, sanctioned: 22,  region: "Central",   benches: [],                     notable: "Formed on Chhattisgarh statehood" },
  { id: "delhi",       name: "Delhi HC",               city: "New Delhi",  states: ["Delhi (NCT)"],                          established: 1966, sanctioned: 60,  region: "North",     benches: [],                     notable: "Jurisdiction over national capital" },
  { id: "gauhati",     name: "Gauhati HC",             city: "Guwahati",   states: ["Assam", "Nagaland", "Mizoram", "Arunachal Pradesh"], established: 1948, sanctioned: 24, region: "Northeast", benches: ["Kohima", "Aizawl", "Itanagar"], notable: "Principal HC for the Northeast" },
  { id: "gujarat",     name: "Gujarat HC",             city: "Ahmedabad",  states: ["Gujarat"],                              established: 1960, sanctioned: 52,  region: "West",      benches: [],                     notable: "Formed on Gujarat–Maharashtra bifurcation" },
  { id: "himachal",    name: "Himachal Pradesh HC",    city: "Shimla",     states: ["Himachal Pradesh"],                     established: 1971, sanctioned: 13,  region: "North",     benches: [],                     notable: "Situated at 7,000 ft altitude" },
  { id: "jk",          name: "J&K & Ladakh HC",        city: "Srinagar",   states: ["Jammu & Kashmir", "Ladakh"],            established: 1928, sanctioned: 17,  region: "North",     benches: ["Jammu"],              notable: "Serves two UTs post Art. 370 abrogation" },
  { id: "jharkhand",   name: "Jharkhand HC",           city: "Ranchi",     states: ["Jharkhand"],                            established: 2000, sanctioned: 25,  region: "East",      benches: [],                     notable: "Formed on Jharkhand statehood" },
  { id: "karnataka",   name: "Karnataka HC",           city: "Bengaluru",  states: ["Karnataka"],                            established: 1884, sanctioned: 62,  region: "South",     benches: ["Dharwad", "Kalaburagi"], notable: "Third busiest HC; over 1 lakh pending cases" },
  { id: "kerala",      name: "Kerala HC",              city: "Ernakulam",  states: ["Kerala", "Lakshadweep"],                established: 1958, sanctioned: 47,  region: "South",     benches: [],                     notable: "Known for high case disposal rate" },
  { id: "madras",      name: "Madras HC",              city: "Chennai",    states: ["Tamil Nadu", "Puducherry"],             established: 1862, sanctioned: 75,  region: "South",     benches: ["Madurai"],            notable: "One of three original Charter HCs" },
  { id: "manipur",     name: "Manipur HC",             city: "Imphal",     states: ["Manipur"],                              established: 2013, sanctioned: 5,   region: "Northeast", benches: [],                     notable: "One of smallest HCs" },
  { id: "meghalaya",   name: "Meghalaya HC",           city: "Shillong",   states: ["Meghalaya"],                            established: 2013, sanctioned: 4,   region: "Northeast", benches: [],                     notable: "One of newest HCs" },
  { id: "mp",          name: "Madhya Pradesh HC",      city: "Jabalpur",   states: ["Madhya Pradesh"],                       established: 1956, sanctioned: 53,  region: "Central",   benches: ["Gwalior", "Indore"],  notable: "Former Nagpur HC jurisdiction absorbed" },
  { id: "odisha",      name: "Orissa HC",              city: "Cuttack",    states: ["Odisha"],                               established: 1948, sanctioned: 33,  region: "East",      benches: [],                     notable: "City still called Cuttack, not Bhubaneswar" },
  { id: "patna",       name: "Patna HC",               city: "Patna",      states: ["Bihar"],                                established: 1916, sanctioned: 53,  region: "East",      benches: [],                     notable: "Serves Bihar after Jharkhand separation" },
  { id: "pnh",         name: "Punjab & Haryana HC",    city: "Chandigarh", states: ["Punjab", "Haryana", "Chandigarh (UT)"], established: 1947, sanctioned: 85,  region: "North",     benches: [],                     notable: "Serves two states + 1 UT from shared capital" },
  { id: "rajasthan",   name: "Rajasthan HC",           city: "Jodhpur",    states: ["Rajasthan"],                            established: 1949, sanctioned: 40,  region: "North",     benches: ["Jaipur"],             notable: "Principal seat in Jodhpur, not the capital Jaipur" },
  { id: "sikkim",      name: "Sikkim HC",              city: "Gangtok",    states: ["Sikkim"],                               established: 1975, sanctioned: 3,   region: "Northeast", benches: [],                     notable: "Smallest HC in India" },
  { id: "telangana",   name: "Telangana HC",           city: "Hyderabad",  states: ["Telangana"],                            established: 2019, sanctioned: 46,  region: "South",     benches: [],                     notable: "Shares premises with AP HC temporarily" },
  { id: "tripura",     name: "Tripura HC",             city: "Agartala",   states: ["Tripura"],                              established: 2013, sanctioned: 4,   region: "Northeast", benches: [],                     notable: "One of four new Northeast HCs (2013)" },
  { id: "uttarakhand", name: "Uttarakhand HC",         city: "Nainital",   states: ["Uttarakhand"],                          established: 2000, sanctioned: 11,  region: "North",     benches: [],                     notable: "Seated at a hill station" },
];

// ─── Constitutional Benches ───────────────────────────────────────────────────

export const CONSTITUTIONAL_BENCHES: ConstitutionalBenchCase[] = [
  {
    id: "kesavananda-bench",
    name: "Kesavananda Bharati v State of Kerala",
    year: 1973,
    benchSize: 13,
    articles: ["13", "368"],
    outcome: "Basic Structure Doctrine established — Parliament cannot amend the Constitution's essential features",
    significance: "Largest bench ever assembled; established the most important constitutional doctrine in Indian history. Overruled Golaknath.",
    vote: "7:6",
    dissentBy: "CJI A.N. Ray, Justices Dwivedi, Mathew, Beg, Chandrachud (partial)",
  },
  {
    id: "golaknath-bench",
    name: "I.C. Golak Nath v State of Punjab",
    year: 1967,
    benchSize: 11,
    articles: ["13", "368"],
    outcome: "Parliament cannot amend fundamental rights under Art. 368 — prospective overruling applied",
    significance: "11-judge bench sparked constitutional crisis; later overruled by Kesavananda Bharati (1973). Introduced prospective overruling for the first time in India.",
    vote: "6:5",
    dissentBy: "Justices Wanchoo, Bachawat, Ramaswami, Mitter, Shelat",
    overruled: true,
  },
  {
    id: "indra-sawhney-bench",
    name: "Indra Sawhney v Union of India",
    year: 1992,
    benchSize: 9,
    articles: ["16", "340"],
    outcome: "OBC reservations valid; 50% ceiling; creamy layer excluded; no reservation in promotions",
    significance: "Defined affirmative action limits still followed today. The 50% Mandal cap has been challenged many times but always upheld as constitutional.",
    vote: "6:3",
    dissentBy: "Justices Pandian, Thommen, Ahmadi (on 50% cap)",
  },
  {
    id: "bommai-bench",
    name: "S.R. Bommai v Union of India",
    year: 1994,
    benchSize: 9,
    articles: ["356", "74"],
    outcome: "Presidential Rule subject to judicial review; floor test mandatory; secularism in Basic Structure",
    significance: "Ended the most abused constitutional provision. Art. 356 had been invoked 100+ times before this judgment; misuse dropped sharply after.",
    vote: "Majority (6:3 on key questions)",
  },
  {
    id: "puttaswamy-bench",
    name: "Justice K.S. Puttaswamy v Union of India",
    year: 2017,
    benchSize: 9,
    articles: ["14", "19", "21"],
    outcome: "Right to privacy is a fundamental right; overruled M.P. Sharma and Kharak Singh",
    significance: "Unanimous 9-judge verdict on a question unanswered for 63 years. The privacy test (legality, legitimate aim, proportionality, procedural guarantees) is now the standard.",
    vote: "9:0 (Unanimous)",
  },
  {
    id: "coelho-bench",
    name: "I.R. Coelho v State of Tamil Nadu",
    year: 2007,
    benchSize: 9,
    articles: ["31B", "9th Schedule", "368"],
    outcome: "Laws in the Ninth Schedule added after April 24, 1973 (Kesavananda date) can be judicially reviewed if they damage Basic Structure",
    significance: "Ended the Parliament's strategy of shielding laws from judicial review by placing them in the Ninth Schedule. Post-Kesavananda laws have no blanket immunity.",
    vote: "Majority",
  },
  {
    id: "navtej-bench",
    name: "Navtej Singh Johar v Union of India",
    year: 2018,
    benchSize: 5,
    articles: ["14", "15", "19", "21"],
    outcome: "Section 377 IPC unconstitutional to the extent it criminalises consensual adult same-sex conduct",
    significance: "Four concurring opinions — each judge wrote separately, reflecting the richness of constitutional reasoning. Constitutional morality > popular morality.",
    vote: "5:0 (Unanimous)",
  },
  {
    id: "adm-jabalpur-bench",
    name: "ADM Jabalpur v Shivkant Shukla",
    year: 1976,
    benchSize: 5,
    articles: ["21", "359"],
    outcome: "Art. 21 (personal liberty) suspended during Emergency under Art. 359 — no right to approach courts",
    significance: "Called the Supreme Court's darkest hour. Effectively suspended habeas corpus. Justice H.R. Khanna alone dissented and was superseded for CJI. 44th Amendment (1978) made Arts. 20–21 non-suspendable.",
    vote: "4:1",
    dissentBy: "Justice H.R. Khanna",
    overruled: true,
  },
];

// ─── PIL Workflow ─────────────────────────────────────────────────────────────

export const PIL_STEPS: PILStep[] = [
  {
    step: 1,
    title: "Identify Public Interest Issue",
    actor: "Petitioner / NGO / Journalist",
    description: "Any person — even via newspaper article — can identify a systemic violation of constitutional or statutory rights affecting a class of persons unable to approach courts themselves (bonded labour, prisoners, slum dwellers).",
    basis: "Art. 32 (SC) / Art. 226 (HC) — relaxed locus standi",
    duration: "—",
    icon: "🔍",
  },
  {
    step: 2,
    title: "File Writ Petition / Letter",
    actor: "Petitioner",
    description: "File at SC under Art. 32 for fundamental right violations or at HC under Art. 226 for broader grounds. Even a postcard or letter to the Chief Justice can trigger PIL proceedings (epistolary jurisdiction).",
    basis: "Art. 32 / Art. 226 — SC/HC discretion",
    duration: "1 day",
    icon: "📝",
  },
  {
    step: 3,
    title: "Admission / Suo Motu Cognizance",
    actor: "Chief Justice's Bench",
    description: "Court examines whether the issue is of genuine public interest. Chief Justice can take suo motu cognizance based on media reports or letters. Cases involving enforcement of law or constitutional provisions get priority.",
    basis: "CJI's roster power; inherent powers of the court",
    duration: "1–4 weeks",
    icon: "⚖️",
  },
  {
    step: 4,
    title: "Issue Notice to Respondents",
    actor: "Court Registrar",
    description: "Court issues notice to the Union of India, State Government, or statutory authorities directing them to file a counter-affidavit. Respondents get time to respond (usually 4–8 weeks).",
    basis: "Order VI, CPC; inherent powers",
    duration: "4–8 weeks",
    icon: "📬",
  },
  {
    step: 5,
    title: "Amicus Curiae Appointed",
    actor: "Court",
    description: "Court may appoint a senior advocate as 'friend of the court' (amicus curiae) to assist on complex factual or legal questions, especially in cases involving technical matters or multiple stakeholders.",
    basis: "Inherent powers of the court",
    duration: "Concurrent",
    icon: "🤝",
  },
  {
    step: 6,
    title: "Fact-Finding Committee / Commissioner",
    actor: "Court-appointed Commissioner",
    description: "In cases requiring ground-level investigation (bonded labour, prison conditions, pollution), court appoints a Commissioner to visit the site, collect facts, and submit a report. This report forms the factual basis for directions.",
    basis: "Art. 32; inherent powers; CPC Order XXVI",
    duration: "2–6 months",
    icon: "🔬",
  },
  {
    step: 7,
    title: "Hearing & Arguments",
    actor: "Parties, Amicus, Intervenors",
    description: "Court hears arguments from all parties. NGOs, state governments, and technical experts may intervene. Interim directions are often issued at this stage to prevent ongoing harm (e.g., factory closure, release of prisoners).",
    basis: "Art. 32 / 226; Order 1 Rule 8 CPC",
    duration: "Months to years",
    icon: "🗣️",
  },
  {
    step: 8,
    title: "Interim Directions / Monitoring",
    actor: "Court",
    description: "Court may issue interim directions throughout the hearing — closing polluting industries, ordering government schemes, releasing undertrials, or constituting High-Powered Committees. These become binding immediately.",
    basis: "Art. 142 (complete justice) + Art. 32/226",
    duration: "Ongoing",
    icon: "📋",
  },
  {
    step: 9,
    title: "Final Judgment & Directions",
    actor: "Court",
    description: "Final judgment issues binding directions to government, statutory authorities, or private parties. Directions may include policy changes, legislation recommendations, compensation awards, or structural remedies.",
    basis: "Art. 32 (SC) / Art. 226 (HC) + Art. 142",
    duration: "—",
    icon: "📜",
  },
  {
    step: 10,
    title: "Compliance Monitoring",
    actor: "Court + Monitoring Committee",
    description: "Most landmark PILs remain open for compliance monitoring. Court calls for periodic compliance reports. Non-compliance can result in contempt proceedings. Some PILs have been monitored for decades (e.g., MC Mehta cases).",
    basis: "Contempt of Courts Act, 1971; Art. 129 / 215",
    duration: "Years / ongoing",
    icon: "🔭",
  },
];

// ─── Appeals Flow ─────────────────────────────────────────────────────────────

export const APPEALS_ROUTES: AppealsRoute[] = [
  {
    id: "criminal",
    name: "Criminal Appeals",
    color: "#DC2626",
    icon: "⚔️",
    basis: "CrPC, 1973",
    stages: [
      { court: "Magistrate Court", basis: "CrPC — trial of offences up to 3 yrs" },
      { court: "Sessions Court", basis: "CrPC — appeal from Magistrate (s.374)" },
      { court: "High Court", basis: "Art. 215 / CrPC — appeal + revision" },
      { court: "Supreme Court", basis: "Art. 134 / Art. 136 (SLP)" },
    ],
  },
  {
    id: "civil",
    name: "Civil Appeals",
    color: "#1565C0",
    icon: "📄",
    basis: "Code of Civil Procedure, 1908",
    stages: [
      { court: "Trial Court (Civil Judge)", basis: "CPC — original civil jurisdiction" },
      { court: "District Court", basis: "CPC — first appeal from original decree" },
      { court: "High Court", basis: "CPC s.100 — second appeal on question of law" },
      { court: "Supreme Court", basis: "Art. 133 / Art. 136 (SLP)" },
    ],
  },
  {
    id: "constitutional",
    name: "Constitutional Writs",
    color: "#7C3AED",
    icon: "📜",
    basis: "Art. 226 / Art. 32",
    stages: [
      { court: "High Court (Art. 226)", basis: "Writ jurisdiction — any violation of law" },
      { court: "Supreme Court (Art. 32)", basis: "FRs only — itself a Fundamental Right" },
      { court: "SLP / Appeal (Art. 136)", basis: "From HC to SC — discretionary" },
      { court: "Review Petition (Art. 137)", basis: "SC reviews its own order" },
    ],
  },
  {
    id: "service",
    name: "Service Matters",
    color: "#047857",
    icon: "🏛️",
    basis: "Administrative Tribunals Act, 1985",
    stages: [
      { court: "Department / Disciplinary Authority", basis: "Service rules — initial order" },
      { court: "Central Administrative Tribunal (CAT)", basis: "Art. 323A — exclusive jurisdiction" },
      { court: "High Court (Division Bench)", basis: "Art. 226/227 — review of CAT orders" },
      { court: "Supreme Court", basis: "Art. 136 (SLP) — constitutional questions" },
    ],
  },
];

// ─── Judgment Graph ───────────────────────────────────────────────────────────

export const GRAPH_NODES: GraphNode[] = [
  { id: "ak-gopalan",   label: "A.K. Gopalan\n1950",    year: 1950, category: "fundamental_rights", x: 55,  y: 110, size: "md" },
  { id: "champakam",    label: "Champakam\n1951",        year: 1951, category: "social_justice",     x: 55,  y: 310, size: "sm" },
  { id: "golaknath",    label: "Golaknath\n1967",        year: 1967, category: "basic_structure",    x: 155, y: 80,  size: "md", overruled: true },
  { id: "kesavananda",  label: "Kesavananda\n1973",      year: 1973, category: "basic_structure",    x: 240, y: 190, size: "xl" },
  { id: "indira-gandhi",label: "Indira Gandhi\n1975",    year: 1975, category: "basic_structure",    x: 310, y: 70,  size: "md" },
  { id: "adm-jabalpur", label: "ADM Jabalpur\n1976",     year: 1976, category: "fundamental_rights", x: 340, y: 290, size: "sm", overruled: true },
  { id: "maneka-gandhi",label: "Maneka Gandhi\n1978",    year: 1978, category: "fundamental_rights", x: 370, y: 330, size: "lg" },
  { id: "hussainara",   label: "Hussainara\n1979",       year: 1979, category: "pil",                x: 440, y: 380, size: "sm" },
  { id: "minerva-mills",label: "Minerva Mills\n1980",    year: 1980, category: "basic_structure",    x: 410, y: 140, size: "md" },
  { id: "bandhua-mukti",label: "Bandhua Mukti\n1984",    year: 1984, category: "pil",                x: 430, y: 310, size: "sm" },
  { id: "mc-mehta",     label: "M.C. Mehta\n1987",      year: 1987, category: "environment",        x: 490, y: 380, size: "sm" },
  { id: "indra-sawhney",label: "Indra Sawhney\n1992",   year: 1992, category: "social_justice",     x: 520, y: 290, size: "md" },
  { id: "bommai",       label: "S.R. Bommai\n1994",      year: 1994, category: "federalism",         x: 550, y: 170, size: "lg" },
  { id: "vishaka",      label: "Vishaka\n1997",          year: 1997, category: "gender",             x: 580, y: 350, size: "sm" },
  { id: "nalsa",        label: "NALSA\n2014",            year: 2014, category: "gender",             x: 630, y: 300, size: "sm" },
  { id: "shreya-singhal",label: "Shreya Singhal\n2015", year: 2015, category: "speech",             x: 640, y: 90,  size: "md" },
  { id: "puttaswamy",   label: "Puttaswamy\n2017",       year: 2017, category: "privacy",            x: 680, y: 200, size: "lg" },
  { id: "navtej-johar", label: "Navtej Johar\n2018",     year: 2018, category: "fundamental_rights", x: 720, y: 330, size: "md" },
];

export const GRAPH_EDGES: GraphEdge[] = [
  { from: "ak-gopalan",    to: "kesavananda" },
  { from: "ak-gopalan",    to: "maneka-gandhi" },
  { from: "champakam",     to: "indra-sawhney" },
  { from: "golaknath",     to: "kesavananda" },
  { from: "kesavananda",   to: "indira-gandhi" },
  { from: "kesavananda",   to: "minerva-mills" },
  { from: "kesavananda",   to: "bommai" },
  { from: "kesavananda",   to: "puttaswamy" },
  { from: "maneka-gandhi", to: "hussainara" },
  { from: "maneka-gandhi", to: "bandhua-mukti" },
  { from: "maneka-gandhi", to: "puttaswamy" },
  { from: "maneka-gandhi", to: "navtej-johar" },
  { from: "minerva-mills", to: "bommai" },
  { from: "vishaka",       to: "nalsa" },
  { from: "puttaswamy",   to: "navtej-johar" },
];

// ─── Judicial Review Powers ───────────────────────────────────────────────────

export const JUDICIAL_REVIEW_POWERS: JudicialReviewPower[] = [
  {
    article: "Art. 13",
    title: "Void Laws — Primary Review Power",
    court: "both",
    description: "Any law that abridges or takes away fundamental rights is void to the extent of the inconsistency. Applies to pre-constitutional laws (Art. 13(1)) and post-constitutional laws (Art. 13(2)). 'Law' includes ordinances, orders, bye-laws, rules, regulations, and customs.",
    grounds: ["Violation of Part III (Fundamental Rights)", "Violation of Art. 14 (equality)", "Violation of Art. 19 (freedoms)", "Violation of Art. 21 (life and liberty)"],
    landmark: "Kesavananda Bharati (1973) — even constitutional amendments subject to review",
  },
  {
    article: "Art. 32",
    title: "Constitutional Remedies — Right to Move SC",
    court: "sc",
    description: "Dr. Ambedkar called Art. 32 'the very soul and heart of the Constitution'. Any person can directly approach the Supreme Court for enforcement of fundamental rights. The right to move the SC is itself a fundamental right — cannot be suspended (except Art. 359 in Emergency, as restricted by 44th Amendment).",
    grounds: ["Violation of fundamental rights", "Illegal State action", "Unconstitutional legislation", "Discriminatory application of law"],
    landmark: "Romesh Thappar v State of Madras (1950); Hussainara Khatoon (1979)",
  },
  {
    article: "Art. 226",
    title: "High Court Writ Jurisdiction",
    court: "hc",
    description: "Broader than Art. 32 — HCs can issue writs for enforcement of fundamental rights AND 'for any other purpose'. Can issue writs against State and even private bodies performing public functions. No exhaustion of remedies requirement.",
    grounds: [
      "Fundamental rights violations",
      "Any other legal right violations",
      "Against public authorities and State",
      "Against private bodies with public functions",
    ],
    landmark: "Election Commission of India v Subramanian Swamy (1996)",
  },
  {
    article: "Art. 136",
    title: "Special Leave Petition (SLP)",
    court: "sc",
    description: "Discretionary power to grant special leave to appeal from any judgment, decree, or order of any court or tribunal in India (except court-martial). The SC may refuse SLP without giving reasons. When granted, becomes a regular appeal.",
    grounds: ["Substantial question of law", "Grave injustice", "Question of general public importance", "Conflict between HC decisions"],
    landmark: "Pritam Singh v State (1950) — SC's discretion is unfettered",
  },
  {
    article: "Art. 142",
    title: "Complete Justice Power",
    court: "sc",
    description: "The SC may make any order necessary for doing 'complete justice' in a matter before it — including quashing laws, directing Parliament or executive, issuing structural injunctions, and making orders not strictly within its jurisdiction. A unique supra-jurisdictional power.",
    grounds: ["Any case pending before the SC", "When existing law inadequate for complete justice", "To enforce fundamental rights effectively"],
    landmark: "Union Carbide Corporation v Union of India (1991) — Bhopal settlement; Vishaka v Rajasthan (1997)",
  },
  {
    article: "Art. 131",
    title: "Original Jurisdiction — Interstate Disputes",
    court: "sc",
    description: "SC has exclusive original jurisdiction in disputes between: (a) Centre vs State(s), (b) Centre & State vs State(s), (c) State vs State. Suitable for river water disputes, boundary disputes, or Centre–State constitutional conflicts.",
    grounds: ["Dispute involves a question of law or fact", "On which existence of a legal right depends", "Between specified constitutional entities"],
    landmark: "State of Rajasthan v Union of India (1977); Karnataka v Tamil Nadu (Cauvery Water Dispute)",
  },
  {
    article: "Art. 143",
    title: "Advisory Jurisdiction",
    court: "sc",
    description: "President may refer a question of law or fact of public importance to the SC for its advisory opinion. SC's opinion is not binding but carries great persuasive weight. SC may decline to give an opinion on purely political questions.",
    grounds: ["Question of law or fact of public importance", "Referred by President of India", "Court may decline on political questions"],
    landmark: "In Re: Special Courts Bill (1979); In Re: Cauvery Water Disputes Tribunal (1992)",
  },
  {
    article: "Art. 368 + Basic Structure",
    title: "Judicial Review of Constitutional Amendments",
    court: "sc",
    description: "Since Kesavananda Bharati (1973), the SC reviews constitutional amendments to ensure they do not damage the 'Basic Structure' of the Constitution. This is India's unique contribution to constitutional law — allowing Parliament wide amending power but protecting core constitutional identity.",
    grounds: ["Damage to Basic Structure (democracy, federalism, judicial review, secularism, equality)", "Constitutional amendment that destroys constitutional identity", "I.R. Coelho — 9th Schedule laws post-April 24, 1973"],
    landmark: "Kesavananda Bharati (1973); Minerva Mills (1980); I.R. Coelho (2007)",
  },
];

// ─── Writs ────────────────────────────────────────────────────────────────────

export const WRITS: WritType[] = [
  {
    name: "Habeas Corpus",
    latin: "You shall have the body",
    against: "Detention authorities, jail officers, police",
    purpose: "Secure release of a person illegally or improperly detained. Oldest writ; cornerstone of personal liberty.",
    example: "Challenging preventive detention under UAPA, NSA; detention beyond remand period",
    article: "Art. 32 / Art. 226",
  },
  {
    name: "Mandamus",
    latin: "We command",
    against: "Public authorities, government officials, statutory bodies",
    purpose: "Commands a public authority to perform a public duty it has refused or neglected to perform. Cannot be issued against private persons or the President/Governor in personal capacity.",
    example: "Ordering a public servant to register an FIR; directing a university to declare results",
    article: "Art. 32 / Art. 226",
  },
  {
    name: "Certiorari",
    latin: "To be certified",
    against: "Lower courts, quasi-judicial authorities",
    purpose: "Quashes the order of a lower court or quasi-judicial body that has acted without jurisdiction, in excess of jurisdiction, or in violation of natural justice.",
    example: "Quashing an arbitrary administrative order; cancelling a biased tribunal award",
    article: "Art. 32 / Art. 226",
  },
  {
    name: "Prohibition",
    latin: "To forbid / Stop",
    against: "Lower courts, quasi-judicial authorities",
    purpose: "Prevents a lower court from exceeding its jurisdiction in a pending case (unlike certiorari which quashes a completed order). Issued before the lower court passes its order.",
    example: "Stopping a Magistrate from trying a case beyond their pecuniary jurisdiction",
    article: "Art. 32 / Art. 226",
  },
  {
    name: "Quo Warranto",
    latin: "By what authority",
    against: "Person holding a public office",
    purpose: "Inquires into the authority by which a person holds a public office. Used to remove a person who is occupying an office to which they have no legal right.",
    example: "Challenging illegal appointment to a constitutional post; contesting election of a disqualified MP",
    article: "Art. 32 / Art. 226",
  },
];

// ─── Category Colors ──────────────────────────────────────────────────────────

export const CASE_CATEGORY_CONFIG: Record<CaseCategory, { label: string; color: string; bg: string; text: string }> = {
  basic_structure:    { label: "Basic Structure",    color: "#7C3AED", bg: "bg-purple-100 dark:bg-purple-900/30",  text: "text-purple-700 dark:text-purple-300" },
  fundamental_rights: { label: "Fundamental Rights", color: "#1565C0", bg: "bg-blue-100 dark:bg-blue-900/30",    text: "text-blue-700 dark:text-blue-300" },
  federalism:         { label: "Federalism",          color: "#B45309", bg: "bg-amber-100 dark:bg-amber-900/30",  text: "text-amber-700 dark:text-amber-300" },
  social_justice:     { label: "Social Justice",      color: "#047857", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300" },
  environment:        { label: "Environment",          color: "#065F46", bg: "bg-teal-100 dark:bg-teal-900/30",   text: "text-teal-700 dark:text-teal-300" },
  pil:                { label: "PIL",                  color: "#0E7490", bg: "bg-cyan-100 dark:bg-cyan-900/30",   text: "text-cyan-700 dark:text-cyan-300" },
  gender:             { label: "Gender Rights",        color: "#BE185D", bg: "bg-pink-100 dark:bg-pink-900/30",   text: "text-pink-700 dark:text-pink-300" },
  privacy:            { label: "Privacy",              color: "#4338CA", bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300" },
  speech:             { label: "Free Speech",          color: "#C2410C", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
  criminal:           { label: "Criminal Law",         color: "#991B1B", bg: "bg-red-100 dark:bg-red-900/30",     text: "text-red-700 dark:text-red-300" },
};
