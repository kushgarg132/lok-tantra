import type { KnowledgeChunk } from "@/lib/rag/types";

export const INSTITUTIONS_KNOWLEDGE: KnowledgeChunk[] = [
  // ─── POLICE AND LAW ENFORCEMENT ──────────────────────────────────────────────
  {
    id: "inst-police",
    title: "Who Controls the Police?",
    category: "institutional",
    confidence: "high",
    keywords: ["police", "who controls police", "state police", "CBI", "CRPF", "BSF", "law enforcement", "central police", "IPS", "state list"],
    articleRefs: ["246"],
    content: `Police is a STATE SUBJECT under the 7th Schedule, List II (State List), Entry 2.

STATE POLICE:
- Each state has its own police force under the state government
- State Home Minister has political control
- Director General of Police (DGP) heads state police
- District Superintendent of Police (SP) commands district police
- State Police Act governs the police in each state

CENTRAL PARAMILITARY/POLICE FORCES (Union List, Entry 2A):
- CRPF (Central Reserve Police Force): largest; deployed in insurgency, law & order
- BSF (Border Security Force): Indo-Pak and Indo-Bangladesh borders
- CISF (Central Industrial Security Force): airports, industrial units
- ITBP (Indo-Tibetan Border Police): China border
- SSB (Sashastra Seema Bal): Indo-Nepal and Indo-Bhutan borders
- NSG (National Security Guard): anti-terrorism; Black Cats
- All under Ministry of Home Affairs (MHA); deployed on request or Centre's decision

CBI (Central Bureau of Investigation):
- Under Ministry of Personnel, not MHA
- Governed by Delhi Special Police Establishment Act, 1946
- Has jurisdiction only in Union Territory of Delhi by default
- Needs state consent to investigate crimes in state territory (except Union government employees)
- States can withdraw consent (West Bengal, Rajasthan, Jharkhand, Kerala, Mizoram have withdrawn)
- Supreme Court can order CBI investigation even without state consent (Art 32 powers)

IPS (Indian Police Service):
- All-India Service under Art 312
- Officers recruited centrally (UPSC) but allocated to state cadres
- Centre can deploy IPS officers to central deputation
- State cadre DGP appointed by state; Centre has role in IPS officers' posting at senior levels

ED (Enforcement Directorate):
- Under Ministry of Finance, not Home
- Enforces FEMA (money laundering), PMLA (Prevention of Money Laundering Act)
- Has central jurisdiction; does not need state consent

NIA (National Investigation Agency):
- Under MHA; investigates terror cases
- NIA Act 2008 gives it pan-India jurisdiction (doesn't need state consent)`,
  },
  {
    id: "inst-pm-cm",
    title: "Can the PM Remove a Chief Minister?",
    category: "institutional",
    confidence: "high",
    keywords: ["PM remove CM", "Prime Minister Chief Minister", "centre state", "dismiss state government", "governor", "federal", "state autonomy"],
    articleRefs: ["156", "163", "164", "356", "74"],
    caseRefs: ["SR Bommai v. Union of India (1994)"],
    content: `A Prime Minister CANNOT directly remove a Chief Minister. The constitutional scheme separates Union and State executives.

HOW CM HOLDS OFFICE:
- CM is appointed by Governor (Art 164) from among members commanding majority in State Assembly
- CM holds office "during the pleasure of the Governor" (Art 164(1))
- But in practice: CM holds office as long as they command majority in State Assembly
- Governor cannot dismiss CM who has majority in the assembly (Bommai principle)

HOW A CM CAN LOSE OFFICE:
1. Defeated in floor test (vote of no confidence in State Assembly)
2. Conviction in criminal case (if sentenced 2+ years)
3. Disqualification under anti-defection law (10th Schedule)
4. Death or resignation

PM's INDIRECT ROUTES:
1. President's Rule (Art 356): PM recommends; President (on Cabinet's advice) imposes President's Rule; Governor's report usually precedes this; Parliament must approve within 2 months
2. Art 356 must satisfy Bommai test: there must be genuine breakdown of constitutional machinery
3. Courts can review and reinstate dismissed government if Art 356 imposed mala fide

INTER-GOVERNMENTAL TENSIONS:
- PM controls Centre's financial transfers, central agencies (CBI, ED, I-T), central projects
- Cooperative and competitive federalism both exist
- National Development Council, Inter-State Council (Art 263): platforms for PM-CM coordination
- Finance Commission (Art 280): determines how tax revenues shared between Centre and States

LEGAL POSITION:
The PM has no constitutional power to dismiss a CM. The only route is through Art 356 (President's Rule), which requires Parliamentary sanction and is subject to judicial review. Using Art 356 for political reasons is unconstitutional (Bommai).`,
  },
  {
    id: "inst-president-role",
    title: "Role of the President of India",
    category: "institutional",
    confidence: "high",
    keywords: ["President", "President of India", "President's powers", "constitutional head", "real power President", "when President acts independently", "pocket veto"],
    articleRefs: ["52", "53", "54", "72", "74", "78", "85", "111", "123"],
    content: `The President of India is the constitutional head of state — a largely ceremonial role in practice.

CONSTITUTIONAL POSITION:
- Head of State (Art 52); executive power vested in President (Art 53)
- Must act on Council of Ministers' advice (Art 74) — mandatory after 44th Amendment (1978)
- Can return advice ONCE for reconsideration; must accept reconsidered advice
- Cannot be questioned in court about what advice was given/followed

GENUINE PRESIDENTIAL DISCRETION (limited):
1. Appointment of PM when no clear majority — must use judgment in hung Parliament
2. Dismissal of PM when PM loses majority but refuses to resign
3. Granting or withholding assent to bills (within limits: cannot indefinitely withhold ordinary bills)
4. Dissolution of Lok Sabha (on PM's advice, but President can refuse if government has fallen)

IMPORTANT POWERS:
- Appoints PM, Governors, Judges (SC/HC), CEC, CAG, UPSC Chairman, Attorney General
- Issues ordinances (Art 123) when Parliament not in session (on Cabinet's advice)
- Pardons (Art 72): can pardon, commute, reprieve, remit any sentence; including death sentence
- Summons, prorogues, dissolves Parliament
- Can require Cabinet to reconsider any matter (once)

"POCKET VETO" ON STATE BILLS:
- President can withhold assent to state bills sent for his assent (Art 200) indefinitely — no time limit
- This is India's pocket veto (unlike ordinary bills where President must act)

RAJYA SABHA AND PRESIDENT:
- President nominates 12 members of Rajya Sabha for expertise in literature, science, arts, social service
- Elected by Electoral College (elected MPs + elected MLAs) — not direct election

PRESIDENT VS PM:
- Real executive power: PM and Cabinet (Art 74)
- All major decisions: PM and Cabinet
- President functions more like UK's King Charles than US President`,
  },
  {
    id: "inst-governor",
    title: "Role of the Governor",
    category: "institutional",
    confidence: "high",
    keywords: ["Governor", "governor's role", "governor appointment", "governor discretion", "state", "governor vs CM", "constitutional head state"],
    articleRefs: ["153", "154", "155", "156", "157", "158", "161", "163", "164", "200"],
    content: `The Governor is the constitutional head of a state — appointed by the President (effectively the Central Government).

APPOINTMENT AND REMOVAL:
- Appointed by President by warrant (Art 155) — effectively on PM's advice
- Holds office "during the pleasure of the President" (Art 156) — no security of tenure
- Can be transferred, recalled, or removed at any time — recent years have seen political controversy

ROLE AS CONSTITUTIONAL HEAD:
- Executive power of state vested in Governor (Art 154)
- Must act on CM's advice in most matters (Art 163) — mirrors President-PM relationship at Centre
- Governor can send a message to state legislature (Art 175)
- Can address legislature, prorogue, summon (on CM's advice usually)

DISCRETIONARY POWERS (genuine):
1. Hung Assembly: Governor decides who to invite to form government (must use judgment)
2. If CM loses majority but refuses floor test: Governor can call CM for floor test or recommend President's Rule
3. Withholding assent to state bills (Art 200): can return for reconsideration OR reserve for President's consideration (no time limit — effectively pocket veto)
4. Reports to President under Art 356: Governor's assessment (but Bommai test requires floor test first)

GOVERNOR IN CONTROVERSY:
- Many Governors have been accused of acting as "agents of the Centre"
- Kerala and Maharashtra cases: Governors delayed giving assent to state bills for months/years
- SC has stepped in to direct timely assent (In re Kerala Governor, 2023: SC held Governor cannot indefinitely withhold assent)
- Appointment of pro-CM VCs without CM recommendation: contested in several states

RELATIONSHIP WITH CM:
- Governor appoints CM (Art 164) from majority leader
- CM can advise dissolution of assembly; Governor can refuse if alternative government possible
- Governor need not immediately accept CM's resignation if alternative is available
- Reports to President on state's affairs`,
  },
  {
    id: "inst-judiciary",
    title: "India's Judicial Hierarchy — From District Court to Supreme Court",
    category: "judiciary",
    confidence: "high",
    keywords: ["court hierarchy", "judicial system", "district court", "high court", "Supreme Court", "tribunals", "who hears what", "jurisdiction", "appeal"],
    articleRefs: ["124", "214", "226", "227", "233", "247"],
    content: `India has a unified national judiciary with a clear hierarchy:

SUPREME COURT OF INDIA (New Delhi):
- Apex court (Art 124); Chief Justice + 33 judges (current maximum)
- Original jurisdiction: Centre-State and State-State disputes (Art 131), election petitions (PM, Speaker)
- Appellate jurisdiction: Appeals from all HC via Art 132, 133, 134
- Special Leave Petition (Art 136): can admit any appeal from any court/tribunal in India
- Advisory jurisdiction (Art 143): President can seek SC's opinion
- Law declared by SC is binding on all courts (Art 141)

HIGH COURTS (each state/UT):
- Established under Art 214; Chief Justice + other judges
- Original civil jurisdiction in some states (Bombay, Calcutta, Madras)
- Principal appellate court for district courts
- Writ jurisdiction (Art 226): broader than SC — any legal right, not just FRs
- Supervisory jurisdiction over all subordinate courts (Art 227)
- 25 High Courts in India (some cover multiple states/UTs)

DISTRICT COURTS:
- Principal seat of civil and criminal original jurisdiction
- District Judge (senior judicial officer)
- Sessions Court: criminal trials (Sessions Judge)
- District Civil Court: civil suits above pecuniary limit

SUBORDINATE CIVIL COURTS:
- Subordinate Judge's Court, Junior Civil Judge's Court (varying by state)
- Magistrate courts (Executive: BNSS; Judicial: try cases)

SPECIALIZED COURTS/TRIBUNALS:
- National Green Tribunal (NGT): environment
- National Company Law Tribunal (NCLT): company law
- Consumer Disputes Redressal Commissions: District, State, National (NCDRC)
- Income Tax Appellate Tribunal (ITAT)
- Armed Forces Tribunal (AFT)
- Industrial Tribunals, Labour Courts

FAMILY COURTS, FAST TRACK COURTS, LOK ADALATS:
- Family Courts: matrimonial disputes, custody
- Fast Track Courts: rape, sexual assault cases mandated
- Lok Adalat: ADR; no court fee; settlement is final decree`,
  },
  {
    id: "inst-parliament",
    title: "Parliament — Structure, Powers and Functioning",
    category: "institutional",
    confidence: "high",
    keywords: ["Parliament", "Lok Sabha", "Rajya Sabha", "joint sitting", "Speaker", "Chairman", "quorum", "bills Parliament", "budget Parliament"],
    articleRefs: ["79", "80", "81", "83", "84", "85", "100", "108", "109", "110"],
    content: `Parliament of India consists of the President + Rajya Sabha (Upper House) + Lok Sabha (Lower House).

LOK SABHA (House of the People):
- 543 elected members (direct election by citizens — FPTP)
- 2 nominated Anglo-Indians (abolished by 104th Amendment 2020)
- Presided by Speaker (elected by members); Deputy Speaker
- 5-year term (can be dissolved earlier by President on PM's advice)
- Quorum: 10% of total membership (55 members)
- Confidence of Lok Sabha required for government

RAJYA SABHA (Council of States):
- 238 elected by State/UT legislatures + 12 nominated by President (expertise)
- Presided by Vice President (ex officio Chairman); Deputy Chairman elected by RS
- Permanent house — cannot be dissolved; 1/3 retire every 2 years
- 6-year terms for members
- No power over Money Bills; significant power over ordinary and constitutional bills

EXCLUSIVE POWERS OF LOK SABHA:
- Money bills (Art 110) — only in Lok Sabha
- Vote of no confidence in government
- Approves demands for grants (appropriation)

EXCLUSIVE POWERS OF RAJYA SABHA:
- Authorize Parliament to legislate on State List subjects if national interest (Art 249)
- Pass resolution to create new All-India services (Art 312)

JOINT SITTING (Art 108):
- Only for ordinary bills (not Money Bills, constitutional amendments)
- Called by President when Houses disagree or deadlock
- Presided by Speaker; simple majority decides
- Rarely used: first 1961 (Dowry Prohibition), 1978 (Banking Service Commission), 2002 (POTA)

PARLIAMENTARY COMMITTEES:
- Standing committees, PAC, Estimates Committee, Departmental Standing Committees
- Joint Parliamentary Committees (JPC): for major investigations (Bofors, 2G, bank frauds)`,
  },
  {
    id: "inst-pm-cabinet",
    title: "Prime Minister and Cabinet — Executive Power",
    category: "institutional",
    confidence: "high",
    keywords: ["Prime Minister", "cabinet", "council of ministers", "collective responsibility", "PM powers", "cabinet formation", "PM appointment"],
    articleRefs: ["74", "75", "77", "78"],
    content: `The Prime Minister heads the Council of Ministers — the real executive power in India.

APPOINTMENT:
- President appoints PM — must be member who commands majority in Lok Sabha
- PM recommends all other Cabinet ministers — President appoints on PM's advice
- A minister need not be an MP at time of appointment but must get elected within 6 months

COUNCIL OF MINISTERS HIERARCHY:
- Cabinet Ministers: attend Cabinet meetings; head major ministries
- Ministers of State (MoS): junior portfolio; may attend Cabinet only when invited
- MoS (Independent Charge): head smaller ministries independently; don't report to Cabinet Minister
- Deputy Ministers: assist Cabinet Ministers (rarely used now)

SIZE LIMITS (91st Amendment 2003):
- Total Council of Ministers ≤ 15% of Lok Sabha strength (81 ministers maximum)
- State cabinets similarly capped at 15% of state assembly size (minimum 12)

COLLECTIVE RESPONSIBILITY (Art 75(3)):
- Cabinet stands and falls together — if PM loses confidence, ALL ministers resign
- A minister who publicly disagrees must resign or be dismissed
- Cabinet decisions are binding on all ministers (even if they disagreed in private)

INDIVIDUAL MINISTERIAL RESPONSIBILITY:
- Ministers individually answerable to Parliament for their ministry
- Can be questioned, must answer (parliamentary question hours)
- Can be forced to resign over specific failures (convention, not law)

PM'S KEY CONSTITUTIONAL FUNCTIONS:
- Communicate Cabinet decisions to President (Art 78)
- Give President any information about government affairs on request
- Recommend members for Cabinet, Governors, Judges, constitutional posts
- Recommend dissolution of Lok Sabha (President usually follows)
- Chair Cabinet Committee on Security, Cabinet Committee on Appointments

PRIME MINISTER'S OFFICE (PMO):
- Principal Staff Officer: Principal Secretary to PM
- Not a constitutional body but practically most powerful office
- Coordinates across all ministries; handles foreign affairs`,
  },
  {
    id: "inst-centre-state",
    title: "Centre-State Relations — Who Controls What",
    category: "federal",
    confidence: "high",
    keywords: ["centre state", "federal", "state powers", "union powers", "7th schedule", "Union List", "State List", "Concurrent List", "residuary powers"],
    articleRefs: ["245", "246", "248", "249", "250", "252", "253", "254"],
    content: `India is a federal union with a strong centre. Legislative powers divided by the 7th Schedule:

UNION LIST (List I) — Parliament alone can legislate:
- Defence, atomic energy, railways, posts and telegraph
- Income tax, customs, excise (except alcohol)
- Banking, insurance, stock exchanges, currencies
- International trade and commerce, ports and aerodromes
- Citizenship, passports, extradition
- Elections to Parliament; Supreme Court
- Foreign affairs, treaties, war and peace

STATE LIST (List II) — State legislatures alone can legislate:
- Public order, police (Entry 2) — most important entry
- Agriculture, land, irrigation
- Public health and hospitals
- Local governments, municipalities, panchayats
- Pilgrimage, burial and cremation grounds
- Entertainment and betting taxes
- Alcohol (manufacture, sale, possession)

CONCURRENT LIST (List III) — Both Parliament and state, Parliament prevails if conflict:
- Criminal law, procedure, evidence
- Marriage, divorce, succession (personal law)
- Education, forests, environmental protection
- Labour, trade unions, social insurance
- Weights and measures
- Electricity

RESIDUARY POWERS:
- Parliament (unlike US where residue goes to states)
- Entry 97 (Union List): Parliament can legislate on anything not in any list

CENTRAL DOMINANCE MECHANISMS:
- National Emergency: Parliament can legislate on State List (Art 353)
- State Emergency: Centre takes over state governance
- Art 249: RS resolution allows Parliament to legislate on State List in national interest (2/3 majority)
- Art 252: States can request Parliament to legislate for them
- Art 253: International treaty obligations override state list`,
  },
  {
    id: "inst-election-commission",
    title: "Election Commission of India — Powers and Structure",
    category: "elections",
    confidence: "high",
    keywords: ["Election Commission", "ECI", "CEC", "who conducts elections", "Model Code of Conduct", "electoral roll", "disqualification", "EVM"],
    articleRefs: ["324", "325", "326", "329"],
    content: `The Election Commission of India (ECI) is an independent constitutional body under Art 324.

STRUCTURE (after Election Laws Amendment Act 2023):
- Chief Election Commissioner (CEC)
- Two Election Commissioners
- Appointed by President on recommendation of a 3-member committee: PM + Leader of Opposition + Union Cabinet Minister
- CEC removable only like a SC judge (by Parliament by 2/3 majority on proved misbehaviour/incapacity)
- Election Commissioners now have same security (after 2023 Act — previously could be removed by President on CEC's recommendation)

POWERS:
1. Superintendence, direction, control of electoral rolls and elections
2. Recognizes and deregisters political parties; allocates party symbols
3. Enforces Model Code of Conduct (MCC) — from election announcement to results
4. Can countermand election in a booth/constituency due to violence or irregularity
5. Can call re-poll in specific booths
6. Disqualifies candidates for corrupt practices (Representation of People Act)
7. Determines election disputes at candidate level (not Parliament/Assembly qualification — that's EC or SC/HC)
8. Regulates election spending limits

WHAT ECI CANNOT DO:
- Adjudicate election petition (filed before HC/SC after election)
- Decide MP/MLA disqualification for holding office of profit (President/Governor decides on ECI's opinion)
- Anti-defection cases (Speaker decides)

MODEL CODE OF CONDUCT:
- Voluntary code enforced by ECI
- No new major policy announcements, government schemes, appointments
- No misuse of government machinery for elections
- ECI can censure, ask for FIR against candidates/parties violating MCC

ELECTORAL ROLLS:
- Maintained by State Chief Electoral Officers under ECI supervision
- Qualifying date: January 1 of the year
- 18+ citizens can register
- BLO (Booth Level Officer) updates local rolls`,
  },
  {
    id: "inst-cbi",
    title: "CBI — Jurisdiction, Powers and Limitations",
    category: "institutional",
    confidence: "high",
    keywords: ["CBI", "Central Bureau of Investigation", "state consent CBI", "CBI investigation", "CBI jurisdiction", "CBI vs state", "SC order CBI"],
    articleRefs: ["246"],
    content: `The CBI (Central Bureau of Investigation) is India's premier investigative agency for major crimes, corruption, and economic offences.

LEGAL BASIS:
- Established under Delhi Special Police Establishment Act, 1946
- NOT under any specific constitutional provision
- Supervised by Ministry of Personnel, Public Grievances and Pensions
- CVC (Central Vigilance Commission) superintends CBI in corruption cases

JURISDICTION:
- Automatic jurisdiction only in Union Territories (especially Delhi)
- For states: CBI needs CONSENT of the state government under Section 6 of DSPE Act
- Central government employees: CBI can investigate across India without state consent
- Railway property offences: CBI has jurisdiction (under Railways)

STATES THAT WITHDREW CBI CONSENT:
West Bengal, Maharashtra, Kerala, Rajasthan, Jharkhand, Mizoram, Punjab (as of 2024)
- This means CBI cannot register new cases in these states without fresh consent for each case

SC CAN ORDER CBI:
- Under Art 32 (enforcement of FRs) or Art 136 (SLP), SC can direct CBI investigation even in non-consenting states
- SC's constitutional powers override the DSPE Act's consent requirement (Nandini Sundar v. Chhattisgarh, 2011)

ED (ENFORCEMENT DIRECTORATE):
- Different from CBI; under Ministry of Finance
- Enforces PMLA (Prevention of Money Laundering Act) and FEMA
- Has pan-India jurisdiction without state consent
- Can arrest, attach properties, search and seize — even in non-CBI-consent states
- PMLA accused cannot get bail easily (Section 45 of PMLA reversed burden of proof)

NIA (NATIONAL INVESTIGATION AGENCY):
- Under MHA; NIA Act 2008 gives it pan-India jurisdiction
- Investigates terror-related offences; doesn't need state consent`,
  },
  {
    id: "inst-upsc",
    title: "UPSC and Civil Services — Who Runs the Government",
    category: "institutional",
    confidence: "high",
    keywords: ["UPSC", "IAS", "civil service", "bureaucracy", "IPS", "IFS", "DM", "Collector", "central services", "All India Services"],
    articleRefs: ["308", "309", "310", "311", "312", "315", "316", "317"],
    content: `The Union Public Service Commission (UPSC) recruits for All-India Services and Central Services.

CONSTITUTIONAL STATUS (Art 315):
- Independent constitutional body; Chairman and members appointed by President
- Chairman removable only like SC judge; security of tenure

ALL-INDIA SERVICES (Art 312):
Serve both Centre and States; Parliament creates these services:
1. Indian Administrative Service (IAS): District Collector, DM, SDM, Principal Secretary, Joint Secretary
2. Indian Police Service (IPS): SP, DIG, IG, DGP
3. Indian Forest Service (IFS - environment): Conservator of Forest, PCCF

KEY CENTRAL SERVICES (Group A):
Indian Revenue Service (IRS-IT, IRS-Customs), Indian Audit and Accounts Service, Indian Foreign Service (IFS-external), Indian Railway Service, Indian P&T Service, etc.

RECRUITMENT:
- Civil Services Examination (CSE): Most prestigious; 3 stages (Prelims, Mains, Interview)
- Combined Defence Services (CDS), NDA for defence
- Engineering Services Examination, Central Armed Police Forces Examination
- Special exams for Central Secretariat Services

WHO CONTROLS IAS OFFICERS:
- Allocated to state cadres; serve state governments
- Centre can ask for central deputation (IAS officer comes to work in Delhi)
- Appointments at Secretary level in state: state government decides
- Joint Secretary and above at Centre: DoPT (Department of Personnel and Training) under PM

DISTRICT MAGISTRATE (DM/Collector):
- Usually an IAS officer
- Dual role: Collector (revenue administration) + District Magistrate (law and order)
- Coordinates all central and state schemes in district
- Presides over District Development Coordination and Monitoring Committee (DISHA)
- Reports to Division Commissioner and State government`,
  },
  {
    id: "inst-federalism",
    title: "India's Federal Structure — Strong Centre with States",
    category: "federal",
    confidence: "high",
    keywords: ["federal", "federalism", "India federal or unitary", "quasi-federal", "cooperative federalism", "Union territory", "states India", "centre dominance"],
    articleRefs: ["1", "2", "3", "245", "246", "254", "248", "356"],
    content: `India is described as a "Union of States" (Art 1), not a federation — indicating a indestructible union where states cannot secede.

FEDERAL FEATURES:
- Division of powers (7th Schedule — 3 lists)
- Independent judiciary (High Courts and Supreme Court)
- Bicameral Parliament (Rajya Sabha represents states)
- Written constitution (supreme law)
- Rigid amendment procedure for federal provisions (Art 368 + 50%+ state ratification)

UNITARY FEATURES (strong centre):
- Single citizenship (no separate state citizenship)
- Integrated judiciary (single hierarchy)
- All-India services (IAS/IPS allocated to states but recruited centrally)
- Emergency provisions: Centre takes over in National Emergency
- Appointment of Governors by Centre (Art 155) — states have no say
- Parliament can create/split/merge states (Art 3) without state consent (only consultation required)
- Residuary powers with Parliament (Entry 97)
- Parliament can legislate on State List during Emergency (Art 353) and national interest (Art 249)

COOPERATIVE FEDERALISM INSTITUTIONS:
- GST Council (Art 279A): Finance Minister (Centre) + State Finance Ministers
- Inter-State Council (Art 263): PM + all CMs
- National Development Council (not constitutional): PM + CMs + Planning
- Finance Commission (Art 280): recommends tax devolution to states (currently 41% to states in 15th FC)
- Zonal Councils: Home Minister + CMs of zonal states

ASYMMETRIC FEDERALISM:
- Special provisions for some states (Art 370 — J&K, now modified; Art 371 — NE states)
- Union territories: different status; some with legislatures (Delhi, Puducherry), some without
- Scheduled Tribes areas: special governor's powers (5th and 6th Schedules)

FISCAL FEDERALISM:
- GST: most taxes merged (except petroleum, alcohol)
- Tax devolution: Centre collects; distributes to states per Finance Commission recommendations
- Grants-in-aid: Centre gives conditional grants to states (often with strings attached)`,
  },
];
