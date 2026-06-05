import type { KnowledgeChunk } from "@/lib/rag/types";

export const GOVERNANCE_PROCESSES: KnowledgeChunk[] = [
  // ─── LAW-MAKING ──────────────────────────────────────────────────────────────
  {
    id: "proc-ordinary-bill",
    title: "How an Ordinary Bill Becomes Law",
    category: "governance_process",
    confidence: "high",
    keywords: ["bill", "act", "law", "parliament", "legislation", "how law is made", "law making", "ordinary bill"],
    articleRefs: ["107", "108", "111"],
    content: `An ordinary bill (non-money, non-constitutional) can be introduced in either House of Parliament.

PROCESS:
1. First Reading: Bill introduced, title read — no debate
2. Second Reading: Bill referred to Standing Committee; debated clause-by-clause
3. Third Reading: Final vote — simple majority of members present and voting
4. Sent to other House — same three-reading process
5. If other House passes without amendments — sent to President
6. If other House amends — Bill returned to originating House
7. If disagreement persists — President can summon Joint Sitting of Parliament (Art 108); majority decides

PRESIDENT'S ASSENT (Art 111):
- President can give assent (Bill becomes Act)
- President can return once for reconsideration — but must assent if passed again
- President cannot 'pocket veto' ordinary bills (unlike US President)
- Bill becomes law on Presidential assent + gazette notification

NOTE: Simple majority means majority of members present and voting (quorum = 1/10 of total membership). Constitutional amendments need special majority (Art 368).`,
  },
  {
    id: "proc-money-bill",
    title: "Money Bill — Special Legislative Process",
    category: "governance_process",
    confidence: "high",
    keywords: ["money bill", "budget", "taxation", "appropriation", "finance bill", "rajya sabha money bill", "speaker certification"],
    articleRefs: ["110", "109", "111"],
    content: `A Money Bill (Art 110) deals exclusively with taxation, borrowing, Consolidated Fund, or appropriation.

SPECIAL PROCEDURE:
1. Can only be introduced in Lok Sabha (not Rajya Sabha)
2. Speaker of Lok Sabha certifies it as a Money Bill
3. After Lok Sabha passes, sent to Rajya Sabha
4. Rajya Sabha has only 14 days — can recommend amendments (but cannot pass or reject)
5. Lok Sabha may accept or reject Rajya Sabha's recommendations
6. Bill deemed passed after 14 days even if RS takes no action
7. Presidential assent required; President cannot return a Money Bill

KEY POINT: Rajya Sabha has no veto on Money Bills — deliberate design to ensure elected house controls finances. This made Aadhaar Bill (2016) controversial when it was certified as Money Bill.

DIFFERENCE from Finance Bill: Finance Bill accompanies the Annual Budget but may contain provisions beyond Art 110 scope — those provisions go through ordinary bill route.`,
  },
  {
    id: "proc-constitutional-amendment",
    title: "How the Constitution is Amended (Art 368)",
    category: "governance_process",
    confidence: "high",
    keywords: ["constitutional amendment", "how to amend constitution", "Article 368", "two-thirds majority", "special majority", "basic structure"],
    articleRefs: ["368", "13"],
    caseRefs: ["Kesavananda Bharati (1973)"],
    content: `Article 368 governs constitutional amendments. There are two types:

TYPE 1 — SPECIAL MAJORITY (most amendments):
- Introduced in either House of Parliament
- Passed by: (a) majority of total membership of the House, AND (b) 2/3 of members present and voting
- Both Houses must independently pass the bill
- President must give assent (no withholding, no return)
- Example: most rights amendments, structural changes

TYPE 2 — SPECIAL MAJORITY + STATE RATIFICATION (federal provisions):
- Same special majority in Parliament
- PLUS ratification by 50%+ State Legislatures
- Applies to: Art 54 (election of President), Art 55 (manner of election), Art 73, Art 162, Supreme Court, HC jurisdiction, Lists in 7th Schedule, representation of states in Parliament, Art 368 itself
- Example: Art 368 itself, redistribution of legislative powers

BASIC STRUCTURE LIMIT:
Parliament cannot amend the "basic structure" of the Constitution even with the required majority — established in Kesavananda Bharati (1973). Basic structure includes: parliamentary democracy, federal structure, separation of powers, judicial review, secularism, rule of law, fundamental rights.

IMPORTANT: Simple majority (Art 4, 169, etc.) suffices for some changes (like creating/dissolving state legislative councils).`,
  },
  {
    id: "proc-pil",
    title: "Public Interest Litigation (PIL) — How It Works",
    category: "governance_process",
    confidence: "high",
    keywords: ["PIL", "public interest litigation", "how PIL works", "file PIL", "writ petition", "public interest", "suo motu", "locus standi"],
    articleRefs: ["32", "226", "142"],
    caseRefs: ["Hussainara Khatoon (1979)", "SP Gupta v. Union of India (1982)"],
    content: `PIL (Public Interest Litigation) allows any citizen to approach courts for public interest, even without personal grievance.

WHERE TO FILE:
- Supreme Court: Under Art 32 (enforcement of Fundamental Rights)
- High Court: Under Art 226 (broader jurisdiction — any legal right)

RELAXED LOCUS STANDI:
- Traditional rule: only affected party can sue
- PIL exception (since Hussainara Khatoon, 1979): any public-spirited citizen can represent
- Even a letter to the Chief Justice can be treated as a PIL (epistolary jurisdiction)
- SC can take suo motu cognizance (on its own, without any petition)

ELIGIBLE CAUSES:
- Violation of Fundamental Rights of a class of persons
- Environmental protection (rivers, forests, air quality)
- Prisoner rights, bonded labour, child labour
- Corruption in public offices
- Electoral malpractice
- Public health and sanitation

NOT ALLOWED:
- Private disputes disguised as public interest
- Cases filed for publicity or political motives
- Already pending litigation between same parties (res judicata)
- Against purely private entities (no government element)

COURT ACTIONS:
- Issue writs (habeas corpus, mandamus, etc.)
- Appoint commissioners to investigate
- Issue continuing mandamus (monitor compliance over time)
- Award contempt of court for non-compliance
- Dismiss with costs if frivolous (Art 142)

LANDMARK PILs: Vishaka v. Rajasthan (sexual harassment guidelines), MC Mehta cases (environmental protection), Common Cause v. Union (electoral bonds), coal/2G scam PILs.`,
  },
  {
    id: "proc-rti",
    title: "Right to Information (RTI) — Process",
    category: "governance_process",
    confidence: "high",
    keywords: ["RTI", "Right to Information", "information", "government records", "PIO", "CIC", "transparency", "how to file RTI"],
    articleRefs: ["19"],
    content: `RTI (Right to Information Act, 2005) gives every citizen the right to information held by public authorities.

PROCEDURE:
1. Write application to PIO (Public Information Officer) of the relevant department
2. Pay fee: ₹10 (Central); varies by state
3. PIO must respond within 30 days (48 hours for life/liberty matters)
4. BPL (below poverty line) applicants exempt from fee

APPEALS:
- First Appeal: to First Appellate Authority (officer senior to PIO) within 30 days of receiving reply or deadline
- Second Appeal: to Central Information Commission (CIC) or State Information Commission (SIC) within 90 days
- CIC/SIC can impose penalties on PIO (₹25,000 max), recommend disciplinary action, award compensation

EXEMPTIONS (information that can be withheld):
- National security, sovereignty
- Cabinet papers (till decision taken)
- Personal information (unless justified by public interest)
- Fiduciary information
- Information from foreign government
- Information that would impede investigation or prosecution
- Commercial confidence, trade secrets

2019 AMENDMENT CONTROVERSY:
- RTI (Amendment) Act 2019 changed terms of CIC and SIC — tenure and salaries now set by Central Government (previously fixed by statute), raising concerns about independence

CONSTITUTIONAL BASIS:
Right to information flows from Article 19(1)(a) (freedom of speech and expression, including right to know) — affirmed by SC in many cases including Raj Narain v. Indira Gandhi (1975).`,
  },
  {
    id: "proc-president-rule",
    title: "President's Rule (Art 356) — Process and Safeguards",
    category: "governance_process",
    confidence: "high",
    keywords: ["president's rule", "Article 356", "state emergency", "governor's report", "Bommai", "dismissal of state government", "imposition of president rule"],
    articleRefs: ["356", "355", "357", "74", "163"],
    caseRefs: ["SR Bommai v. Union of India (1994)"],
    content: `Article 356 allows the President to assume control of a state when its constitutional machinery fails.

GROUNDS FOR IMPOSITION:
- State government cannot carry on in accordance with the Constitution
- Breakdown of law and order beyond state's capacity
- Non-compliance with directions from the Centre (Art 365)

PROCEDURE:
1. Governor sends report to President (usually on PM/Cabinet's advice)
2. President (on Cabinet's advice) issues proclamation
3. Parliament must approve within 2 months by simple majority
4. Duration: 6 months at a time; maximum 3 years (after which a constitutional amendment needed — only in case of armed rebellion or external aggression)

EFFECTS:
- Governor administers state on behalf of President
- President (effectively Parliament/Cabinet) exercises state legislative powers
- State legislature dissolved or kept in suspended animation

BOMMAI SAFEGUARDS (SR Bommai v. Union of India, 1994):
1. Floor test must be held before recommending President's Rule — mere loss of majority on the floor, not in Governor's assessment
2. Proclamation is justiciable — courts can review whether satisfaction was genuine
3. Till Parliament approves, President cannot dissolve state legislature (only keep in suspended animation)
4. If courts find proclamation mala fide, the original government can be reinstated
5. Secularism is basic structure — communal ground for dismissing government is unconstitutional

MISUSE HISTORY: Used 130+ times in India's history. Many considered politically motivated (dismissing opposition governments). Bommai judgment in 1994 significantly curbed misuse.`,
  },
  {
    id: "proc-national-emergency",
    title: "National Emergency (Art 352) — Declaration and Effects",
    category: "governance_process",
    confidence: "high",
    keywords: ["national emergency", "Article 352", "war", "external aggression", "armed rebellion", "1975 emergency", "suspension of fundamental rights", "Emergency"],
    articleRefs: ["352", "353", "354", "358", "359", "19", "21"],
    content: `Article 352 enables National Emergency when India's security is threatened by war, external aggression, or armed rebellion.

HOW IT'S DECLARED:
1. Cabinet must recommend in writing to the President (44th Amendment — prevents President from acting alone)
2. President issues proclamation
3. Parliament must approve within 1 month by special majority: 2/3 of members present + majority of total membership
4. If Lok Sabha dissolved, proclamation continues for 30 days after new LS meets, subject to RS approval
5. Renewed every 6 months by same special majority
6. Revoked if Lok Sabha passes resolution by simple majority

EFFECTS ON STATE-CENTRE RELATIONS:
- Parliament can legislate on State List subjects
- Centre can give executive directions to states on any matter
- President can modify provisions for Centre-State financial distribution

EFFECTS ON FUNDAMENTAL RIGHTS:
- Art 19 (freedom of speech, assembly, etc.) automatically suspended during External Emergency (Art 358)
- President can suspend other FRs by order under Art 359 (except Art 20 and 21 — these can never be suspended)

INDIA'S THREE NATIONAL EMERGENCIES:
1. 1962 (China War): External threat; lasted till 1968
2. 1971 (Pakistan War): External threat; ended 1977
3. 1975-77 (Indira Gandhi): Cited "internal disturbance" (now must be "armed rebellion" after 44th Amendment); controversial; used to suppress political opposition; overturned by massive electoral defeat in 1977

SAFEGUARDS ADDED BY 44TH AMENDMENT (1978):
- Changed ground from "internal disturbance" to "armed rebellion"
- Required written Cabinet approval
- Parliament can revoke by simple majority
- High Courts retain power even during Emergency (Art 226)`,
  },
  {
    id: "proc-vote-of-no-confidence",
    title: "Vote of No Confidence — How Government Falls",
    category: "governance_process",
    confidence: "high",
    keywords: ["vote of no confidence", "no confidence motion", "government falls", "PM resignation", "floor test", "coalition government"],
    articleRefs: ["75", "83", "164"],
    content: `The principle of collective responsibility (Art 75(3)) means the Council of Ministers is collectively responsible to the Lok Sabha.

VOTE OF NO CONFIDENCE:
1. Motion introduced in Lok Sabha by opposition
2. Speaker admits if notice given and supported by minimum 50 MPs
3. Debate: government gets a day to respond
4. Vote: simple majority (50%+) of members present and voting
5. If passed: PM must resign; President accepts resignation; invites new PM who can command majority

VOTE OF CONFIDENCE:
- Government can also request a trust vote to demonstrate its majority
- PM can stake confidence on specific legislation (linking confidence to a bill)

IMPORTANT RULES:
- No confidence motion cannot be moved within 6 months of a previous one being defeated
- Rajya Sabha has no role — Prime Minister is responsible only to Lok Sabha
- Governor similarly: CM is responsible only to State Assembly, not Council (Rajya Sabha equivalent)

NOTABLE EVENTS:
- V.P. Singh (1990): No confidence motion passed; fell after 11 months
- H.D. Deve Gowda (1997): Lost confidence vote
- A.B. Vajpayee (1999): Lost confidence by ONE vote; led to elections and BJP winning majority
- Manmohan Singh (2008): Won confidence vote after Left parties withdrew support over Indo-US Nuclear Deal

FLOOR TEST: Governor/President can require CM/PM to prove majority before the House — this is what Bommai case mandated (Art 356 cannot be used without floor test).`,
  },
  {
    id: "proc-judicial-appointment",
    title: "How Judges Are Appointed — Collegium System",
    category: "governance_process",
    confidence: "high",
    keywords: ["judicial appointment", "judge appointment", "collegium", "who appoints judges", "CJI", "NJAC", "high court judge", "supreme court judge"],
    articleRefs: ["124", "217", "222"],
    caseRefs: ["Second Judges Case (1993)", "Third Judges Case (1998)"],
    content: `Judges of the Supreme Court and High Courts are constitutionally appointed by the President, but in practice through the collegium system.

COLLEGIUM SYSTEM (established by SC itself):
For Supreme Court judges:
- CJI + 4 senior-most SC judges (collegium of 5)
- Collegium recommends names to President
- If government disagrees, it returns recommendation with objections
- If collegium reiterates, President must appoint

For High Court judges:
- Chief Justice of the relevant HC + 2 senior-most HC judges
- This recommendation goes to: CJI + 2 senior-most SC judges (collegium of 3)
- Then to Central Government
- Then to President

HISTORICAL EVOLUTION:
- 1st Judges Case (1981): Government has primacy in appointments
- 2nd Judges Case (1993): Overruled 1st Case — collegium established; CJI's recommendation is binding (with 2 senior judges)
- 3rd Judges Case (1998): Presidential reference; SC expanded collegium to 5 judges for SC appointments
- NJAC Case (2015): Parliament passed 99th Amendment creating National Judicial Appointments Commission (CJI + 2 senior SC judges + Law Minister + 2 eminent persons); SC struck it down as violating basic structure (judicial independence)

CRITICISMS OF COLLEGIUM:
- Opaque process — no public criteria
- "Judges appointing judges" — no democratic accountability
- Delays (vacancies pending for years)
- Allegations of favouritism

GOVERNMENT TOOLS:
- Can delay appointments (no timeline specified in Constitution)
- Can return recommendation with objections (once)
- Cannot appoint someone not recommended by collegium`,
  },
  {
    id: "proc-budget",
    title: "Union Budget Process — How Government Finances Work",
    category: "governance_process",
    confidence: "high",
    keywords: ["budget", "Union budget", "finance bill", "consolidated fund", "annual financial statement", "appropriation bill", "vote on account", "CAG"],
    articleRefs: ["112", "110", "113", "114", "115", "116", "266", "267", "148"],
    content: `The Union Budget is the government's annual financial statement (Art 112) — income and expenditure for the financial year (April 1 to March 31).

BUDGET TIMELINE:
- February 1: Finance Minister presents budget in Lok Sabha (moved from last working day of February since 2017)
- February-March: General discussion, departmental demands for grants voted
- April 1: If not passed — Vote on Account (Art 116) provides funds for 2 months
- Finance Bill: accompanies budget; contains tax proposals; treated as Money Bill if only taxation changes

CONSOLIDATED FUND (Art 266):
- All revenues, loans, and recoveries of Union go here
- All expenditure charged from here
- Parliament must vote to withdraw (Appropriation Bill)
- Charged expenditure (President's salary, CAG, SC judges, debt servicing) — not voted, automatically authorized

CONTINGENCY FUND (Art 267):
- Emergency fund of ₹500 crore (to be augmented by Parliament)
- PM/Finance Minister can draw without prior Parliamentary approval
- Must be replenished by Parliament subsequently

PARLIAMENT'S ROLE:
- Lok Sabha votes on all demands for grants (Rajya Sabha cannot vote on money matters)
- Cut motions: MPs can propose cutting specific demands (economy, token, disapproval of policy)
- Rajya Sabha discusses but cannot amend Appropriation or Finance Bills beyond suggestions
- Guillotine: Speaker can allot time; unvoted demands pass automatically

CAG (Art 148-151):
- Audits all central and state government expenditure
- Reports submitted to President → laid before Parliament
- Public Accounts Committee (PAC) of Parliament examines CAG reports
- CAG is independent; cannot be removed except like a SC judge`,
  },
  {
    id: "proc-election",
    title: "How Elections Work in India — The Electoral Process",
    category: "governance_process",
    confidence: "high",
    keywords: ["election", "how election works", "Lok Sabha election", "Vidhan Sabha", "ECI", "voting", "Model Code of Conduct", "FPTP", "candidate nomination"],
    articleRefs: ["324", "325", "326", "327", "329"],
    content: `General elections to Lok Sabha (every 5 years unless dissolved early) and State Assemblies are conducted by the Election Commission of India (ECI).

ELECTION COMMISSION:
- Constitutional body under Art 324
- Chief Election Commissioner + 2 Election Commissioners (since 2023 amendment)
- CEC removable only like a SC judge (impeachment-like)
- Independent of executive; issues Model Code of Conduct

VOTING SYSTEM:
- First Past the Post (FPTP): candidate with most votes wins (even without majority)
- Adult suffrage: every citizen 18+ can vote (Art 326)
- Secret ballot; Electronic Voting Machines (EVMs) since 1982 (widespread since 2004)
- VVPAT (Voter Verifiable Paper Audit Trail) — since 2014

ELECTION SCHEDULE:
1. President/Governor dissolves House (or 5-year term expires)
2. ECI announces election dates
3. Model Code of Conduct comes into force
4. Voter roll revision (final electoral rolls published)
5. Nomination of candidates (affidavit of assets, criminal cases mandatory)
6. Scrutiny of nominations
7. Campaign period (minimum 14 days before polling)
8. Polling day (multiple phases possible for large states)
9. Counting; results declaration
10. Model Code ends when new government takes oath

CANDIDATE DISQUALIFICATION:
- Not Indian citizen, under 25 (LS) or 30 (RS/State)
- Convicted and sentenced 2+ years (even if on bail) — Representation of People Act
- Declared insolvent or unsound mind
- Holds office of profit under government
- Disqualified under anti-defection law (10th Schedule)

ANTI-DEFECTION LAW (10th Schedule):
- MP/MLA disqualified if voluntarily gives up party membership or votes against party whip on money motion/confidence vote
- Decision by Speaker/Chairman (subject to judicial review)`,
  },
  {
    id: "proc-impeachment",
    title: "Removal/Impeachment of Constitutional Functionaries",
    category: "governance_process",
    confidence: "high",
    keywords: ["impeachment", "removal of President", "removal of judge", "removal of CEC", "how to remove President", "removal of CAG", "Vice President removal"],
    articleRefs: ["61", "124", "148", "324"],
    content: `Different constitutional functionaries have different removal processes:

PRESIDENT (Art 61):
- Only ground: violation of the Constitution
- Impeachment procedure:
  1. Notice by 1/4 of total members of either House
  2. House passes resolution by 2/3 majority of total membership
  3. Other House investigates
  4. Investigation House passes by 2/3 of total membership
  5. President removed on second resolution
- No President of India has ever been impeached

VICE PRESIDENT:
- Removal by Rajya Sabha (effective majority) + Lok Sabha concurrence
- No specific grounds mentioned — just resolution

SUPREME COURT JUDGES (Art 124(4)):
- Grounds: proved misbehaviour or incapacity
- Address by each House by special majority (2/3 of members present and voting + majority of total membership)
- President removes on this address
- In 70+ years, no SC judge has been removed (only one HC judge removed — V. Ramaswami, 1993 attempt failed as Congress abstained)

HIGH COURT JUDGES (Art 218):
- Same process as SC judges

CHIEF ELECTION COMMISSIONER (Art 324):
- Removed in same manner as SC judge

COMPTROLLER AND AUDITOR GENERAL (Art 148):
- Removed in same manner as SC judge

GOVERNORS (Art 156):
- "Holds office during President's pleasure" — can be removed anytime by President (on Cabinet's advice)
- No specific procedure or grounds required

SPEAKER OF LOK SABHA (Art 94):
- Removed by effective majority (50%+) of all Lok Sabha members
- 14 days' advance notice required`,
  },
  {
    id: "proc-rti-vs-rpa",
    title: "Citizen Grievance Mechanisms — RTI, PIL, Ombudsman, Lokpal",
    category: "citizen_rights",
    confidence: "high",
    keywords: ["grievance", "RTI", "PIL", "Lokpal", "Lokayukta", "ombudsman", "corruption complaint", "citizen rights", "redressal"],
    articleRefs: ["32", "226", "19"],
    content: `Citizens have multiple mechanisms to address grievances against government:

1. RIGHT TO INFORMATION (RTI Act, 2005):
   - Get copies of government records, decisions, files
   - Demand inspection of government works
   - PIO must respond in 30 days; CIC hears appeals
   - Cannot obtain personal information or security-sensitive information

2. PUBLIC INTEREST LITIGATION (PIL):
   - Approach SC (Art 32) or HC (Art 226) on behalf of public
   - No fee required; relaxed standing rules
   - Used for environment, education, anti-corruption, prison reform

3. LOKPAL AND LOKAYUKTA:
   - Lokpal: Central anti-corruption body (Lokpal Act 2013, operative since 2019)
   - Jurisdiction: PM (with restrictions), Central Ministers, MPs, Group A officers
   - Lokayukta: State-level equivalent (varies by state)
   - Can investigate and prosecute corruption; cannot prosecute judiciary

4. CENTRAL VIGILANCE COMMISSION (CVC):
   - Superintendence over CBI in corruption cases
   - Advisory body to government departments
   - Cannot directly prosecute

5. CONSUMER COURTS:
   - District/State/National Consumer Disputes Redressal Commission
   - For service deficiency, unfair trade practices by private and public entities

6. WRIT PETITIONS:
   - Directly approach HC (Art 226) for any violation of legal rights
   - Faster than regular civil suits for fundamental matters

7. PRESS COUNCIL OF INDIA:
   - Adjudicate complaints against press

8. CPGRAMS (Centralised Public Grievance Redressal):
   - Online portal (pgportal.gov.in) for central government grievances
   - 60-day response time mandated`,
  },
];
