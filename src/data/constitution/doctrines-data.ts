export interface DoctrineData {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  detail: string;
  landmarkCase: string;
  caseYear: number;
  relatedArticles: string[];
  keywords: string[];
  category: "interpretation" | "federalism" | "rights" | "procedure" | "sovereignty";
}

export const DOCTRINES_DATA: DoctrineData[] = [
  {
    id: "basic-structure",
    name: "Basic Structure Doctrine",
    shortName: "Basic Structure",
    description:
      "Parliament cannot amend the Constitution to destroy its essential/basic features. Some features are so fundamental that even a constitutional amendment cannot alter them.",
    detail:
      "Established in Kesavananda Bharati v. State of Kerala (1973), the Basic Structure Doctrine holds that Parliament's constituent power under Article 368 is not absolute. While Parliament can amend any provision, it cannot alter the 'basic structure' — the essential identity of the Constitution. Elements recognized as basic structure include: supremacy of the Constitution, rule of law, separation of powers, judicial review, secularism, federalism, free and fair elections, independence of judiciary, fundamental rights, democratic republican form of government, and unity and integrity of India. The doctrine was a direct response to Golak Nath (1967) and the 24th & 25th Amendments. In Indira Nehru Gandhi v. Raj Narain (1975), the 39th Amendment was struck down. In Minerva Mills (1980), Arts 368(4) and (5) limiting judicial review were struck down. In I.R. Coelho (2007), the doctrine was extended to laws in the Ninth Schedule. The doctrine is unique to India — no other constitution has this judge-made limitation on amending power.",
    landmarkCase: "Kesavananda Bharati v. State of Kerala",
    caseYear: 1973,
    relatedArticles: ["368", "13", "14", "19", "21", "32"],
    keywords: [
      "basic structure",
      "Kesavananda",
      "amendment",
      "Parliament",
      "judicial review",
      "fundamental rights",
      "indestructible",
    ],
    category: "sovereignty",
  },
  {
    id: "pith-and-substance",
    name: "Doctrine of Pith and Substance",
    shortName: "Pith & Substance",
    description:
      "When a law passed by one legislature incidentally encroaches on another legislature's domain, it is valid if its 'pith and substance' (core subject matter) falls within its own competence.",
    detail:
      "This doctrine resolves conflicts between Union and State legislation. India has a three-list system (Union List, State List, Concurrent List — Seventh Schedule). When a law made by Parliament or a State Legislature substantially deals with a subject in its own list but incidentally touches a subject in the other's list, the law is valid. The doctrine looks at the 'true nature and character' of the legislation — its pith (core) and substance (essential element). Example: A state law on road safety may incidentally regulate insurance (a Union subject) — the substance is road safety (state subject), so it is valid. Key cases: Prafulla Kumar Mukherjee v. Bank of Commerce (1947 PC), State of Bombay v. FN Balsara (1951).",
    landmarkCase: "Prafulla Kumar Mukherjee v. Bank of Commerce",
    caseYear: 1947,
    relatedArticles: ["245", "246", "248", "254"],
    keywords: ["pith and substance", "legislative competence", "federal", "lists", "Union List", "State List"],
    category: "federalism",
  },
  {
    id: "colourable-legislation",
    name: "Doctrine of Colourable Legislation",
    shortName: "Colourable Legislation",
    description:
      "A legislature cannot do indirectly what it cannot do directly. If a law is coloured or disguised to appear within competence while actually transgressing it, it is unconstitutional.",
    detail:
      "The doctrine is expressed as: 'What cannot be done directly cannot be done indirectly.' If a legislature lacks power to enact a law, it cannot achieve the same result by disguising it as something else. The law's true nature is examined, not its label. Example: A state cannot impose a tax on income (Union subject) by calling it a 'fee' — if the fee has no nexus to any service rendered and is purely revenue-raising, it is coloured legislation. Also applies to constitutional amendments — Parliament cannot make a constitutional amendment that achieves what a simple law cannot (e.g., targeting specific individuals). Key case: K.C. Gajapati Narayan Deo v. State of Orissa (1954).",
    landmarkCase: "K.C. Gajapati Narayan Deo v. State of Orissa",
    caseYear: 1954,
    relatedArticles: ["245", "246", "13", "368"],
    keywords: [
      "colourable legislation",
      "indirect",
      "disguise",
      "competence",
      "fraud on constitution",
    ],
    category: "interpretation",
  },
  {
    id: "harmonious-construction",
    name: "Doctrine of Harmonious Construction",
    shortName: "Harmonious Construction",
    description:
      "When two provisions of the Constitution appear to conflict, they should be interpreted to give effect to both rather than making one redundant or subservient to the other.",
    detail:
      "Courts try to construe the Constitution as a harmonious whole. When two provisions conflict, interpretation must: (1) give effect to both; (2) avoid a conflict if possible; (3) avoid making any provision superfluous or inoperative. Applied especially to: conflicts between Fundamental Rights (Part III) and DPSP (Part IV), and between Union and State Lists. Example: Article 19(1)(f) (right to property) vs. Article 31 (power of compulsory acquisition) — both were read together till the 44th Amendment. In State of Madras v. Champakam Dorairajan (1951), the SC held that FRs prevail over DPSPs, but later Waman Rao (1981) refined this through harmonious reading. Also used to read Fundamental Rights inter se — e.g., Art 25 (religion) vs. Art 14 (equality) in Sabarimala.",
    landmarkCase: "State of Madras v. Champakam Dorairajan",
    caseYear: 1951,
    relatedArticles: ["13", "19", "21", "37", "246"],
    keywords: [
      "harmonious construction",
      "conflict",
      "interpretation",
      "fundamental rights",
      "DPSP",
      "harmonize",
    ],
    category: "interpretation",
  },
  {
    id: "eclipse",
    name: "Doctrine of Eclipse",
    shortName: "Eclipse",
    description:
      "A pre-constitutional law that is inconsistent with a Fundamental Right is not void but merely becomes dormant (eclipsed). If the FR is later removed or amended, the law revives.",
    detail:
      "Under Article 13(1), pre-constitutional laws inconsistent with FRs become void 'to the extent of inconsistency.' The Supreme Court in Bhikaji Narain Dhakras v. State of MP (1955) held these laws are not dead but merely eclipsed — an eclipse casts a shadow but does not destroy the sun. If the FR is amended or repealed (removing the inconsistency), the law revives and becomes operative. This doctrine applies only to pre-constitutional laws, not to post-constitutional laws. For post-constitutional laws violating FRs, the Doctrine of Severability applies.",
    landmarkCase: "Bhikaji Narain Dhakras v. State of MP",
    caseYear: 1955,
    relatedArticles: ["13", "19", "368"],
    keywords: [
      "eclipse",
      "dormant",
      "pre-constitutional",
      "void",
      "revival",
      "Article 13(1)",
    ],
    category: "rights",
  },
  {
    id: "severability",
    name: "Doctrine of Severability",
    shortName: "Severability",
    description:
      "If part of a statute violates the Constitution, only that part is struck down if it can be severed from the rest. The valid remainder continues to operate.",
    detail:
      "Codified in Article 13 ('to the extent of inconsistency'), this doctrine allows courts to strike down only the unconstitutional portion of a law while saving the rest. The test is: Can the valid and invalid parts be separated? Would Parliament have enacted the valid part alone? Is the remainder workable and complete? If yes — sever and strike only the bad part. If the unconstitutional part is so interwoven that striking it destroys the whole purpose, the entire law falls. Key cases: R.M.D. Chamarbaugwalla v. Union of India (1957 — prize competitions law severed), A.K. Gopalan v. State of Madras (1950 — specific sections of Preventive Detention Act struck).",
    landmarkCase: "R.M.D. Chamarbaugwalla v. Union of India",
    caseYear: 1957,
    relatedArticles: ["13", "19", "21"],
    keywords: [
      "severability",
      "separability",
      "partial",
      "void",
      "struck down",
      "unconstitutional",
    ],
    category: "interpretation",
  },
  {
    id: "implied-powers",
    name: "Doctrine of Implied Powers",
    shortName: "Implied Powers",
    description:
      "Legislative and executive powers include not just what is expressly granted but also all powers necessary and incidental to carry out the granted powers effectively.",
    detail:
      "Derived from the principle that a grant of power carries with it all ancillary powers necessary to exercise it effectively. Example: Parliament's power over 'posts and telegraphs' (Union List Entry 31) implies power to regulate internet and digital communications, even if not explicitly mentioned. For executives: the President's power to promulgate ordinances implies power to withdraw them. Courts recognize implied powers when: (1) express power exists; (2) the implied power is necessary (not merely convenient); (3) no express provision covers the situation. Limits: implied powers cannot override explicit prohibitions or create new substantive rights.",
    landmarkCase: "Union of India v. Maddangopal Kabra",
    caseYear: 1954,
    relatedArticles: ["245", "246", "73", "162"],
    keywords: [
      "implied powers",
      "incidental",
      "ancillary",
      "legislative",
      "executive",
      "necessary",
    ],
    category: "federalism",
  },
  {
    id: "occupied-field",
    name: "Doctrine of Occupied Field",
    shortName: "Occupied Field",
    description:
      "When Parliament legislates on a Concurrent List subject, it 'occupies the field' and any inconsistent state law is repugnant to the extent of inconsistency (Article 254).",
    detail:
      "Article 254 deals with inconsistency between central and state laws on Concurrent List subjects. When Parliament enacts a law on a concurrent subject, it occupies that legislative field. A state law on the same subject that is repugnant to the central law is void to the extent of repugnancy. The state law may survive if: (1) Parliament has not covered the specific aspect; (2) the President gives assent to the state law under Article 254(2). The doctrine of occupied field determines the extent of occupation — Parliament may occupy the entire field or only part of it. Key case: M. Karunanidhi v. Union of India (1979).",
    landmarkCase: "M. Karunanidhi v. Union of India",
    caseYear: 1979,
    relatedArticles: ["254", "245", "246"],
    keywords: [
      "occupied field",
      "concurrent list",
      "repugnancy",
      "central law",
      "state law",
      "Article 254",
    ],
    category: "federalism",
  },
  {
    id: "prospective-overruling",
    name: "Doctrine of Prospective Overruling",
    shortName: "Prospective Overruling",
    description:
      "When the Supreme Court overrules a previous decision, it can declare the new ruling applicable only from the date of the judgment, not retrospectively, to avoid chaos from reopening settled matters.",
    detail:
      "Traditionally, when a court overrules a precedent, the new rule applies retrospectively — the old rule is deemed never to have been the law. The Doctrine of Prospective Overruling (borrowed from the US) modifies this: the SC can declare that its new ruling applies only prospectively. Applied first in India in Golak Nath v. State of Punjab (1967), where the SC held Parliament cannot amend FRs, and applied this ruling only prospectively — past amendments stood. The doctrine is used sparingly to prevent injustice from disturbing settled legal relationships. Only the SC can apply this doctrine; High Courts cannot.",
    landmarkCase: "I.C. Golak Nath v. State of Punjab",
    caseYear: 1967,
    relatedArticles: ["141", "13", "368"],
    keywords: [
      "prospective overruling",
      "retrospective",
      "precedent",
      "Golak Nath",
      "Supreme Court",
      "overrule",
    ],
    category: "procedure",
  },
  {
    id: "legitimate-expectation",
    name: "Doctrine of Legitimate Expectation",
    shortName: "Legitimate Expectation",
    description:
      "If the government has made a promise or established a practice, a person who has relied on it has a right to be heard before the government departs from it.",
    detail:
      "Derived from Article 14 (equality and non-arbitrariness) and natural justice, this doctrine holds that a person has a substantive or procedural legitimate expectation if: (1) the government made a clear representation or established a regular practice; (2) the person relied on it; (3) it would be unfair to depart from it without a hearing. The doctrine does not create a vested right to the benefit — it only requires a fair procedure before withdrawal. Key cases: Council of Civil Service Unions v. Minister for Civil Service (UK, 1985 — adopted in India); Food Corporation of India v. Kamdhenu Cattle Feed Industries (1993). In India, legitimate expectation is a ground of judicial review under Article 226.",
    landmarkCase: "Food Corporation of India v. Kamdhenu Cattle Feed Industries",
    caseYear: 1993,
    relatedArticles: ["14", "21", "226"],
    keywords: [
      "legitimate expectation",
      "natural justice",
      "representation",
      "government promise",
      "procedural fairness",
    ],
    category: "rights",
  },
  {
    id: "proportionality",
    name: "Doctrine of Proportionality",
    shortName: "Proportionality",
    description:
      "Restrictions on fundamental rights must be proportional to the legitimate aim pursued — not excessive, not arbitrary, and the least restrictive means available must be used.",
    detail:
      "Developed in KS Puttaswamy v. Union of India (Privacy case, 2017) as the standard for testing restrictions on fundamental rights. The test has four prongs: (1) Legality — is there a law authorizing the restriction? (2) Legitimate aim — does the restriction serve a legitimate state purpose? (3) Necessity — is the restriction necessary (no less restrictive means available)? (4) Balancing — is the restriction proportional to the harm prevented? This replaced the older 'reasonableness' test from Maneka Gandhi (1978) with a more structured four-part test. Applied in: Anuradha Bhasin (Kashmir internet shutdown, 2020 — internet restrictions must pass proportionality test), Navtej Singh Johar (Section 377 case), NRC/CAA challenges.",
    landmarkCase: "K.S. Puttaswamy v. Union of India",
    caseYear: 2017,
    relatedArticles: ["14", "19", "21", "300A"],
    keywords: [
      "proportionality",
      "fundamental rights",
      "restrictions",
      "privacy",
      "Puttaswamy",
      "necessity",
      "balancing",
    ],
    category: "rights",
  },
  {
    id: "eminent-domain",
    name: "Doctrine of Eminent Domain",
    shortName: "Eminent Domain",
    description:
      "The State has the inherent sovereign power to acquire private property for public use, subject to payment of just compensation.",
    detail:
      "Eminent domain is the State's inherent power — predating the Constitution — to acquire private property for public purpose. After the 44th Amendment (1978) deleted the right to property as a fundamental right, eminent domain operates under: Article 300A (constitutional right to property), the Land Acquisition Act, 1894 (replaced by RFCTLARR Act, 2013), and the National Highways Act. The Right to Fair Compensation and Transparency in Land Acquisition Act (2013) requires: social impact assessment; consent of 70% of landholders for PPP projects; mandatory R&R (rehabilitation and resettlement); enhanced compensation (2x market value in rural, 1x in urban). Courts review: whether acquisition is for 'public purpose', adequacy of compensation, and procedural compliance.",
    landmarkCase: "State of Bihar v. Kameshwar Singh",
    caseYear: 1952,
    relatedArticles: ["300A", "31A", "31B"],
    keywords: [
      "eminent domain",
      "land acquisition",
      "property",
      "public purpose",
      "compensation",
      "LARR Act",
    ],
    category: "rights",
  },
  {
    id: "territorial-nexus",
    name: "Doctrine of Territorial Nexus",
    shortName: "Territorial Nexus",
    description:
      "A legislature can make laws that have effect beyond its territory if there is a sufficient nexus between the territory and the subject of legislation.",
    detail:
      "Under Article 245, laws are ordinarily territorial. But a legislature can extend its law to persons and things outside its territory if there is a sufficient territorial nexus — a real and not illusory connection. For states: A state can tax a person outside the state if that person carries on business within the state. For Parliament: Though Parliament's laws apply throughout India, it can legislate for extra-territorial operations if there is a nexus. Key test: Is the connection between the territory and the law's subject matter real, and not merely illusory? Cases: Wallace Bros. v. Commissioner of Income Tax (1948 PC — Bombay state can tax dividends of a company managing Indian business from London); GVK Industries v. Union of India (2011 — Parliament can legislate extra-territorially if it impacts India).",
    landmarkCase: "Wallace Brothers & Co. Ltd. v. Commissioner of Income Tax",
    caseYear: 1948,
    relatedArticles: ["245", "246"],
    keywords: [
      "territorial nexus",
      "extra-territorial",
      "jurisdiction",
      "legislative power",
      "state",
      "Parliament",
    ],
    category: "federalism",
  },
  {
    id: "double-jeopardy",
    name: "Protection Against Double Jeopardy",
    shortName: "Double Jeopardy",
    description:
      "A person cannot be prosecuted and punished more than once for the same offence (Article 20(2)).",
    detail:
      "Article 20(2) codifies the maxim 'nemo debet bis vexari' — no one should be vexed twice for the same cause. The protection applies when: (1) there is a previous prosecution for the same offence; (2) the person was punished in that prosecution. Key limitations: Departmental inquiry and criminal prosecution for the same act are allowed simultaneously (Maqbool Hussain v. State of Bombay, 1953 — customs penalty is not a criminal prosecution). The doctrine does not apply to acquittals — a person acquitted can be re-tried if the original trial was vitiated. Different offences from the same act can be separately tried. Distinguished from Art 20(1) (ex-post-facto) and Art 20(3) (self-incrimination).",
    landmarkCase: "Maqbool Hussain v. State of Bombay",
    caseYear: 1953,
    relatedArticles: ["20", "21", "22"],
    keywords: [
      "double jeopardy",
      "twice",
      "prosecution",
      "same offence",
      "Article 20(2)",
      "nemo debet bis vexari",
    ],
    category: "rights",
  },
  {
    id: "due-process",
    name: "Doctrine of Due Process (Indian Interpretation)",
    shortName: "Due Process",
    description:
      "The procedure for depriving a person of life or liberty (Article 21) must be fair, just, and reasonable — not merely prescribed by any law.",
    detail:
      "The original Constitution used 'procedure established by law' (Art 21) — interpreted narrowly in A.K. Gopalan (1950) as any procedure Parliament enacts. The transformation came in Maneka Gandhi v. Union of India (1978): the SC held that procedure must be fair, just, and reasonable — not fanciful, oppressive, or arbitrary. This imported American due process thinking into Indian constitutional law. Post-Maneka, Art 14 (non-arbitrariness), Art 19 (reasonableness), and Art 21 (fairness) are read together. The KS Puttaswamy (2017) judgment added the four-part proportionality test. India's 'due process' is now judicially-developed — based on judicial interpretation of Art 21 rather than an explicit constitutional text.",
    landmarkCase: "Maneka Gandhi v. Union of India",
    caseYear: 1978,
    relatedArticles: ["21", "14", "19", "22"],
    keywords: [
      "due process",
      "procedure",
      "Maneka Gandhi",
      "fair",
      "just",
      "reasonable",
      "life and liberty",
    ],
    category: "rights",
  },
];
