/**
 * Seed: current political figures, Modi 3.0 cabinet, state CMs, and post-2017 landmark cases.
 * Run after the main seed: npm run db:seed:political
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding political data...");

  // ── Resolve party IDs ──────────────────────────────────────────────────────
  const parties = await prisma.politicalParty.findMany({ select: { id: true, abbreviation: true } });
  const pid = Object.fromEntries(parties.map(p => [p.abbreviation, p.id]));

  const statesDb = await prisma.stateUT.findMany({ select: { code: true, name: true } });
  const sc = Object.fromEntries(statesDb.map(s => [s.name, s.code]));

  // ── Resolve court ID ────────────────────────────────────────────────────────
  const scCourt = await prisma.court.findFirst({ where: { name: "Supreme Court of India" } });
  const scId = scCourt?.id;

  // ── Resolve existing article IDs ────────────────────────────────────────────
  const allArticles = await prisma.constitutionArticle.findMany({ select: { id: true, number: true } });
  const artId = Object.fromEntries(allArticles.map(a => [a.number, a.id]));

  // ═══════════════════════════════════════════════════════════════
  // UNION CABINET — Modi 3.0 (June 2024 onwards)
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding Union Cabinet ministers...");

  const cabinet = [
    // Cabinet Ministers
    { name: "Rajnath Singh",          designation: "Union Cabinet Minister",       portfolio: "Ministry of Defence",                    gender: "Male",   state: "Uttar Pradesh",  partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Lucknow" },
    { name: "Amit Shah",              designation: "Union Cabinet Minister",       portfolio: "Ministry of Home Affairs",               gender: "Male",   state: "Gujarat",        partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Gandhinagar" },
    { name: "Nirmala Sitharaman",     designation: "Union Cabinet Minister",       portfolio: "Ministry of Finance",                    gender: "Female", state: "Karnataka",      partyAbbr: "BJP",    chamber: "rajya_sabha", constituency: null },
    { name: "S. Jaishankar",          designation: "Union Cabinet Minister",       portfolio: "Ministry of External Affairs",           gender: "Male",   state: "Gujarat",        partyAbbr: "BJP",    chamber: "rajya_sabha", constituency: null },
    { name: "J.P. Nadda",             designation: "Union Cabinet Minister",       portfolio: "Ministry of Health & Family Welfare",    gender: "Male",   state: "Himachal Pradesh", partyAbbr: "BJP",  chamber: "rajya_sabha", constituency: null },
    { name: "Shivraj Singh Chouhan",  designation: "Union Cabinet Minister",       portfolio: "Ministry of Agriculture & Farmers' Welfare", gender: "Male", state: "Madhya Pradesh", partyAbbr: "BJP", chamber: "lok_sabha", constituency: "Vidisha" },
    { name: "Nitin Gadkari",          designation: "Union Cabinet Minister",       portfolio: "Ministry of Road Transport & Highways", gender: "Male",   state: "Maharashtra",    partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Nagpur" },
    { name: "Manohar Lal Khattar",    designation: "Union Cabinet Minister",       portfolio: "Ministry of Housing & Urban Affairs",    gender: "Male",   state: "Haryana",        partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Karnal" },
    { name: "Piyush Goyal",           designation: "Union Cabinet Minister",       portfolio: "Ministry of Commerce & Industry",        gender: "Male",   state: "Maharashtra",    partyAbbr: "BJP",    chamber: "rajya_sabha", constituency: null },
    { name: "Dharmendra Pradhan",     designation: "Union Cabinet Minister",       portfolio: "Ministry of Education",                  gender: "Male",   state: "Odisha",         partyAbbr: "BJP",    chamber: "rajya_sabha", constituency: null },
    { name: "Giriraj Singh",          designation: "Union Cabinet Minister",       portfolio: "Ministry of Textiles",                   gender: "Male",   state: "Bihar",          partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Begusarai" },
    { name: "Arjun Ram Meghwal",      designation: "Union Cabinet Minister",       portfolio: "Ministry of Law & Justice",              gender: "Male",   state: "Rajasthan",      partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Bikaner" },
    { name: "Jyotiraditya Scindia",   designation: "Union Cabinet Minister",       portfolio: "Ministry of Communications",             gender: "Male",   state: "Madhya Pradesh", partyAbbr: "BJP",    chamber: "rajya_sabha", constituency: null },
    { name: "Kiren Rijiju",           designation: "Union Cabinet Minister",       portfolio: "Ministry of Parliamentary Affairs",      gender: "Male",   state: "Arunachal Pradesh", partyAbbr: "BJP", chamber: "lok_sabha", constituency: "Arunachal West" },
    { name: "Hardeep Singh Puri",     designation: "Union Cabinet Minister",       portfolio: "Ministry of Petroleum & Natural Gas",    gender: "Male",   state: "Punjab",         partyAbbr: "BJP",    chamber: "rajya_sabha", constituency: null },
    { name: "Chirag Paswan",          designation: "Union Cabinet Minister",       portfolio: "Ministry of Food Processing Industries", gender: "Male",  state: "Bihar",          partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Hajipur" },
    { name: "H.D. Kumaraswamy",       designation: "Union Cabinet Minister",       portfolio: "Ministry of Heavy Industries",           gender: "Male",   state: "Karnataka",      partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Mandya" },
    { name: "Jitan Ram Manjhi",       designation: "Union Cabinet Minister",       portfolio: "Ministry of Micro, Small & Medium Enterprises", gender: "Male", state: "Bihar", partyAbbr: "BJP",  chamber: "lok_sabha", constituency: "Gaya" },
    { name: "Lalan Singh",            designation: "Union Cabinet Minister",       portfolio: "Ministry of Panchayati Raj",             gender: "Male",   state: "Bihar",          partyAbbr: "JDU",    chamber: "lok_sabha", constituency: "Munger" },
    { name: "Virendra Kumar",         designation: "Union Cabinet Minister",       portfolio: "Ministry of Social Justice & Empowerment", gender: "Male", state: "Madhya Pradesh", partyAbbr: "BJP",  chamber: "lok_sabha", constituency: "Tikamgarh" },
    { name: "Kinjarapu Ram Mohan Naidu", designation: "Union Cabinet Minister",  portfolio: "Ministry of Civil Aviation",             gender: "Male",   state: "Andhra Pradesh", partyAbbr: "TDP",    chamber: "lok_sabha", constituency: "Srikakulam" },
    { name: "Pralhad Joshi",          designation: "Union Cabinet Minister",       portfolio: "Ministry of New & Renewable Energy",    gender: "Male",   state: "Karnataka",      partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Dharwad" },
    { name: "Annapurna Devi",         designation: "Union Cabinet Minister",       portfolio: "Ministry of Women & Child Development",  gender: "Female", state: "Jharkhand",      partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Kodarma" },
    { name: "G. Kishan Reddy",        designation: "Union Cabinet Minister",       portfolio: "Ministry of Coal",                       gender: "Male",   state: "Telangana",      partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Secunderabad" },
    { name: "Rajiv Ranjan Singh",     designation: "Union Cabinet Minister",       portfolio: "Ministry of Rural Development",          gender: "Male",   state: "Bihar",          partyAbbr: "JDU",    chamber: "lok_sabha", constituency: "Sheohar" },
    { name: "C.R. Patil",             designation: "Union Cabinet Minister",       portfolio: "Ministry of Jal Shakti",                 gender: "Male",   state: "Gujarat",        partyAbbr: "BJP",    chamber: "lok_sabha", constituency: "Navsari" },
    { name: "Ashwini Vaishnaw",       designation: "Union Cabinet Minister",       portfolio: "Ministry of Railways & Electronics & IT", gender: "Male", state: "Odisha",         partyAbbr: "BJP",    chamber: "rajya_sabha", constituency: null },

    // State Chief Ministers (key states)
    { name: "Yogi Adityanath",        designation: "Chief Minister",               portfolio: "Uttar Pradesh",                          gender: "Male",   state: "Uttar Pradesh",  partyAbbr: "BJP",    chamber: "state_assembly", constituency: "Gorakhpur Urban" },
    { name: "Devendra Fadnavis",      designation: "Chief Minister",               portfolio: "Maharashtra",                            gender: "Male",   state: "Maharashtra",    partyAbbr: "BJP",    chamber: "state_assembly", constituency: "Nagpur South West" },
    { name: "Bhajanlal Sharma",       designation: "Chief Minister",               portfolio: "Rajasthan",                              gender: "Male",   state: "Rajasthan",      partyAbbr: "BJP",    chamber: "state_assembly", constituency: "Sanganer" },
    { name: "Mohan Yadav",            designation: "Chief Minister",               portfolio: "Madhya Pradesh",                         gender: "Male",   state: "Madhya Pradesh", partyAbbr: "BJP",    chamber: "state_assembly", constituency: "Ujjain South" },
    { name: "Vishnu Deo Sai",         designation: "Chief Minister",               portfolio: "Chhattisgarh",                           gender: "Male",   state: "Chhattisgarh",   partyAbbr: "BJP",    chamber: "state_assembly", constituency: "Kunkuri" },
    { name: "Siddaramaiah",           designation: "Chief Minister",               portfolio: "Karnataka",                              gender: "Male",   state: "Karnataka",      partyAbbr: "INC",    chamber: "state_assembly", constituency: "Varuna" },
    { name: "A. Revanth Reddy",       designation: "Chief Minister",               portfolio: "Telangana",                              gender: "Male",   state: "Telangana",      partyAbbr: "INC",    chamber: "state_assembly", constituency: "Kodangal" },
    { name: "Sukhvinder Singh Sukhu", designation: "Chief Minister",               portfolio: "Himachal Pradesh",                       gender: "Male",   state: "Himachal Pradesh", partyAbbr: "INC",  chamber: "state_assembly", constituency: "Nadaun" },
    { name: "Bhagwant Mann",          designation: "Chief Minister",               portfolio: "Punjab",                                 gender: "Male",   state: "Punjab",         partyAbbr: "AAP",    chamber: "state_assembly", constituency: "Dhuri" },
    { name: "Nitish Kumar",           designation: "Chief Minister",               portfolio: "Bihar",                                  gender: "Male",   state: "Bihar",          partyAbbr: "JDU",    chamber: "state_assembly", constituency: "Nalanda" },
    { name: "N. Chandrababu Naidu",   designation: "Chief Minister",               portfolio: "Andhra Pradesh",                         gender: "Male",   state: "Andhra Pradesh", partyAbbr: "TDP",    chamber: "state_assembly", constituency: "Kuppam" },
    { name: "Mohan Majhi",            designation: "Chief Minister",               portfolio: "Odisha",                                 gender: "Male",   state: "Odisha",         partyAbbr: "BJP",    chamber: "state_assembly", constituency: "Keonjhar" },
    { name: "Hemant Soren",           designation: "Chief Minister",               portfolio: "Jharkhand",                              gender: "Male",   state: "Jharkhand",      partyAbbr: "BJP",    chamber: "state_assembly", constituency: "Barhait" },
    { name: "Pinarayi Vijayan",       designation: "Chief Minister",               portfolio: "Kerala",                                 gender: "Male",   state: "Kerala",         partyAbbr: "CPI(M)", chamber: "state_assembly", constituency: "Dharmadom" },
    { name: "Himanta Biswa Sarma",    designation: "Chief Minister",               portfolio: "Assam",                                  gender: "Male",   state: "Assam",          partyAbbr: "BJP",    chamber: "state_assembly", constituency: "Jalukbari" },

    // Key opposition MPs
    { name: "Priyanka Gandhi Vadra",  designation: "Member of Parliament",         portfolio: "Wayanad",                                gender: "Female", state: "Kerala",         partyAbbr: "INC",    chamber: "lok_sabha", constituency: "Wayanad" },
    { name: "Sonia Gandhi",           designation: "Member of Parliament",         portfolio: "Rajya Sabha",                            gender: "Female", state: "Rajasthan",      partyAbbr: "INC",    chamber: "rajya_sabha", constituency: null },
    { name: "Arvind Kejriwal",        designation: "Former Chief Minister / Party Leader", portfolio: "AAP President",              gender: "Male",   state: "Delhi",          partyAbbr: "AAP",    chamber: null, constituency: null },
    { name: "Sharad Pawar",           designation: "Member of Parliament",         portfolio: "Rajya Sabha",                            gender: "Male",   state: "Maharashtra",    partyAbbr: "INC",    chamber: "rajya_sabha", constituency: null },
    { name: "Farooq Abdullah",        designation: "Member of Parliament",         portfolio: "Srinagar",                               gender: "Male",   state: "Jammu & Kashmir", partyAbbr: "BJP",   chamber: "lok_sabha", constituency: "Srinagar" },
  ];

  // Deduplicate by name (skip if already exists)
  const existingNames = new Set(
    (await prisma.person.findMany({ select: { name: true } })).map(p => p.name)
  );

  let created = 0;
  for (const p of cabinet) {
    if (existingNames.has(p.name)) continue;
    await prisma.person.create({
      data: {
        name:         p.name,
        designation:  `${p.designation}${p.portfolio ? ` — ${p.portfolio}` : ""}`,
        gender:       p.gender,
        state:        p.state,
        stateCode:    sc[p.state] ?? null,
        partyId:      pid[p.partyAbbr] ?? null,
        chamber:      p.chamber,
        constituency: p.constituency ?? null,
        level:        p.chamber === "state_assembly" ? "state" : "central",
        contact:      {},
        profile:      { termStart: "2024" },
      },
    });
    created++;
  }
  console.log(`  Created ${created} political figures.`);

  // ═══════════════════════════════════════════════════════════════
  // POST-2017 LANDMARK CASES
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding post-2017 landmark cases...");

  const newCases = [
    {
      name: "Justice K.S. Puttaswamy v. Union of India (NJAC)", citation: "(2015) 11 SCC 1", year: 2015,
      summary: "5-judge bench struck down the National Judicial Appointments Commission (NJAC) Act and 99th Amendment. Restored the collegium system for judicial appointments.",
      significance: "Reaffirmed independence of judiciary. Held that judicial primacy in appointments is part of the basic structure. Parliament cannot remove the collegium system.",
      impact: "Collegium system for judicial appointments remains the law. NJAC declared unconstitutional.",
      articleNums: ["124", "217"],
    },
    {
      name: "Navtej Singh Johar v. Union of India", citation: "(2018) 10 SCC 1", year: 2018,
      summary: "5-judge constitutional bench unanimously struck down Section 377 IPC insofar as it criminalised consensual same-sex relations between adults.",
      significance: "Overruled Suresh Kumar Koushal (2013). Held sexual orientation is a protected characteristic under Articles 14, 15, 19, and 21. Criminalising same-sex relations is unconstitutional.",
      impact: "Decriminalised consensual homosexuality. Historic affirmation of LGBTQ+ rights in India.",
      articleNums: ["14", "15", "19", "21"],
    },
    {
      name: "Joseph Shine v. Union of India", citation: "(2019) 3 SCC 39", year: 2018,
      summary: "5-judge bench unanimously struck down Section 497 IPC (adultery law) as unconstitutional.",
      significance: "Held adultery law violated Articles 14 (treats women as chattels), 15 (discrimination on sex grounds), and 21 (autonomy). It was archaic and patriarchal.",
      impact: "Adultery decriminalised. Affirmed women's autonomy and equality.",
      articleNums: ["14", "15", "21"],
    },
    {
      name: "Indian Young Lawyers Association v. State of Kerala (Sabarimala)", citation: "(2019) 11 SCC 1", year: 2018,
      summary: "5-judge bench (4:1) allowed women of all ages to enter Sabarimala temple, overruling the prohibition on women aged 10-50.",
      significance: "Held prohibition violated Articles 14, 15, 17, and 25. Constitutional morality prevails over popular morality. Justice Indu Malhotra dissented.",
      impact: "Affirmed non-discrimination in religious practice. Sparked review petition to 9-judge bench.",
      articleNums: ["14", "15", "17", "25"],
    },
    {
      name: "Anuradha Bhasin v. Union of India", citation: "(2020) 3 SCC 637", year: 2020,
      summary: "SC held internet shutdown orders must be reasoned, time-bound, and subject to judicial review. Issued in context of J&K internet shutdown post Art. 370 abrogation.",
      significance: "First SC judgment recognising internet access as protected under Article 19(1)(a) and 19(1)(g). Shutdown orders must pass proportionality test.",
      impact: "Internet shutdowns now require reasoned orders subject to review. Significant civil liberties protection.",
      articleNums: ["19", "21"],
    },
    {
      name: "Janhit Abhiyan v. Union of India (EWS Reservation)", citation: "(2022) 8 SCC 1", year: 2022,
      summary: "5-judge bench (3:2) upheld the 103rd Constitutional Amendment providing 10% reservation for Economically Weaker Sections (EWS).",
      significance: "Majority held EWS reservation does not violate basic structure — reservation need not be based only on social backwardness. Justices Trivedi and Pardiwala dissented.",
      impact: "10% EWS reservation valid. Expanded scope of reservation beyond social discrimination.",
      articleNums: ["15", "16"],
    },
    {
      name: "Association for Democratic Reforms v. Union of India (Electoral Bonds)", citation: "Writ Petition (C) No. 880 of 2017", year: 2024,
      summary: "5-judge bench unanimously struck down the Electoral Bonds Scheme as unconstitutional.",
      significance: "Held anonymous political funding violates voters' right to information under Article 19(1)(a). SBI directed to submit all electoral bond data to Election Commission. Scheme struck down entirely.",
      impact: "Electoral Bonds Scheme declared unconstitutional. All bond data disclosed publicly. Major transparency reform.",
      articleNums: ["19", "14"],
    },
    {
      name: "In Re: Article 370 (Mohammad Akbar Lone v. Union of India)", citation: "(2023) SCC 1261", year: 2023,
      summary: "5-judge bench unanimously upheld abrogation of Article 370 granting special status to J&K. Also directed EC to hold elections in J&K by September 2024.",
      significance: "Held President had power under Art. 370(3) to abrogate it through a Presidential Order. Dissolution of Constituent Assembly did not freeze Art. 370. Court directed elections within timeline.",
      impact: "Abrogation of J&K's special status upheld. J&K to remain Union Territory. Elections directed.",
      articleNums: ["356", "368"],
    },
    {
      name: "Subhash Desai v. Principal Secretary, Governor of Maharashtra", citation: "(2023) 6 SCC 1", year: 2023,
      summary: "SC ruled on Maharashtra political crisis — Speaker's power to disqualify MLAs, Governor's role in calling floor test, and anti-defection law.",
      significance: "Held Governor's direction for floor test was wrong. Speaker should have decided disqualification petitions first. Cannot recognize a faction without following correct procedure.",
      impact: "Important precedent on Governor's role, Speaker's powers, and anti-defection law in coalition governments.",
      articleNums: ["105", "190"],
    },
  ];

  let casesCreated = 0;
  for (const c of newCases) {
    const exists = await prisma.landmarkCase.findFirst({ where: { citation: c.citation } });
    if (exists) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma.landmarkCase.create as any)({
      data: {
        name:         c.name,
        citation:     c.citation,
        year:         c.year,
        courtId:      scId,
        summary:      c.summary,
        significance: c.significance,
        impact:       c.impact,
        articlesInterpreted: {
          connect: c.articleNums.filter((n: string) => artId[n]).map((n: string) => ({ id: artId[n] })),
        },
      },
    });
    casesCreated++;
  }
  console.log(`  Created ${casesCreated} landmark cases.`);

  // ═══════════════════════════════════════════════════════════════
  // ADDITIONAL ELECTION DATA — STATE-LEVEL 2024
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding 2019 election results...");

  const partyResults2019 = [
    { year: 2019, type: "lok_sabha", party: "BJP",    color: "#FF9933", seats: 303, voteShare: 37.36 },
    { year: 2019, type: "lok_sabha", party: "INC",    color: "#00BFFF", seats: 52,  voteShare: 19.49 },
    { year: 2019, type: "lok_sabha", party: "DMK",    color: "#FF0000", seats: 23,  voteShare: 2.26 },
    { year: 2019, type: "lok_sabha", party: "TMC",    color: "#00FF00", seats: 22,  voteShare: 4.07 },
    { year: 2019, type: "lok_sabha", party: "YSRCP",  color: "#6699CC", seats: 22,  voteShare: 2.53 },
    { year: 2019, type: "lok_sabha", party: "SS",     color: "#FF6600", seats: 18,  voteShare: 2.10 },
    { year: 2019, type: "lok_sabha", party: "JDU",    color: "#006400", seats: 16,  voteShare: 1.46 },
    { year: 2019, type: "lok_sabha", party: "BSP",    color: "#0000FF", seats: 10,  voteShare: 3.63 },
    { year: 2019, type: "lok_sabha", party: "TDP",    color: "#FFFF00", seats: 3,   voteShare: 1.38 },
    { year: 2019, type: "lok_sabha", party: "Others", color: "#6B7280", seats: 74,  voteShare: 25.72 },
  ];

  for (const r of partyResults2019) {
    await prisma.partyElectionResult.upsert({
      where:  { year_type_party: { year: r.year, type: r.type, party: r.party } },
      update: r,
      create: r,
    });
  }

  const partyResults2014 = [
    { year: 2014, type: "lok_sabha", party: "BJP",    color: "#FF9933", seats: 282, voteShare: 31.0 },
    { year: 2014, type: "lok_sabha", party: "INC",    color: "#00BFFF", seats: 44,  voteShare: 19.3 },
    { year: 2014, type: "lok_sabha", party: "AAP",    color: "#0066CC", seats: 4,   voteShare: 2.1 },
    { year: 2014, type: "lok_sabha", party: "TMC",    color: "#00FF00", seats: 34,  voteShare: 3.8 },
    { year: 2014, type: "lok_sabha", party: "AIADMK", color: "#F5A623", seats: 37,  voteShare: 3.3 },
    { year: 2014, type: "lok_sabha", party: "SP",     color: "#FF0000", seats: 5,   voteShare: 3.4 },
    { year: 2014, type: "lok_sabha", party: "BSP",    color: "#0000FF", seats: 0,   voteShare: 4.2 },
    { year: 2014, type: "lok_sabha", party: "Others", color: "#6B7280", seats: 137, voteShare: 32.9 },
  ];

  for (const r of partyResults2014) {
    await prisma.partyElectionResult.upsert({
      where:  { year_type_party: { year: r.year, type: r.type, party: r.party } },
      update: r,
      create: r,
    });
  }

  console.log("Political seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
