import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ═══════════════════════════════════════════════════════════════
  // STATES & UNION TERRITORIES
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding states & UTs...");
  const statesData = [
    { name: "Andhra Pradesh", code: "AP", type: "state", capital: "Amaravati", lsSeats: 25, rsSeats: 11, assemblySeats: 175, reservedSC: 4, reservedST: 1 },
    { name: "Arunachal Pradesh", code: "AR", type: "state", capital: "Itanagar", lsSeats: 2, rsSeats: 1, assemblySeats: 60, reservedSC: 0, reservedST: 2 },
    { name: "Assam", code: "AS", type: "state", capital: "Dispur", lsSeats: 14, rsSeats: 7, assemblySeats: 126, reservedSC: 1, reservedST: 2 },
    { name: "Bihar", code: "BR", type: "state", capital: "Patna", lsSeats: 40, rsSeats: 16, assemblySeats: 243, reservedSC: 8, reservedST: 0 },
    { name: "Chhattisgarh", code: "CG", type: "state", capital: "Raipur", lsSeats: 11, rsSeats: 5, assemblySeats: 90, reservedSC: 1, reservedST: 4 },
    { name: "Goa", code: "GA", type: "state", capital: "Panaji", lsSeats: 2, rsSeats: 1, assemblySeats: 40, reservedSC: 0, reservedST: 0 },
    { name: "Gujarat", code: "GJ", type: "state", capital: "Gandhinagar", lsSeats: 26, rsSeats: 11, assemblySeats: 182, reservedSC: 2, reservedST: 4 },
    { name: "Haryana", code: "HR", type: "state", capital: "Chandigarh", lsSeats: 10, rsSeats: 5, assemblySeats: 90, reservedSC: 2, reservedST: 0 },
    { name: "Himachal Pradesh", code: "HP", type: "state", capital: "Shimla", lsSeats: 4, rsSeats: 3, assemblySeats: 68, reservedSC: 1, reservedST: 0 },
    { name: "Jharkhand", code: "JH", type: "state", capital: "Ranchi", lsSeats: 14, rsSeats: 6, assemblySeats: 81, reservedSC: 1, reservedST: 5 },
    { name: "Karnataka", code: "KA", type: "state", capital: "Bengaluru", lsSeats: 28, rsSeats: 12, assemblySeats: 224, reservedSC: 5, reservedST: 2 },
    { name: "Kerala", code: "KL", type: "state", capital: "Thiruvananthapuram", lsSeats: 20, rsSeats: 9, assemblySeats: 140, reservedSC: 2, reservedST: 0 },
    { name: "Madhya Pradesh", code: "MP", type: "state", capital: "Bhopal", lsSeats: 29, rsSeats: 11, assemblySeats: 230, reservedSC: 4, reservedST: 6 },
    { name: "Maharashtra", code: "MH", type: "state", capital: "Mumbai", lsSeats: 48, rsSeats: 19, assemblySeats: 288, reservedSC: 5, reservedST: 4 },
    { name: "Manipur", code: "MN", type: "state", capital: "Imphal", lsSeats: 2, rsSeats: 1, assemblySeats: 60, reservedSC: 0, reservedST: 1 },
    { name: "Meghalaya", code: "ML", type: "state", capital: "Shillong", lsSeats: 2, rsSeats: 1, assemblySeats: 60, reservedSC: 0, reservedST: 2 },
    { name: "Mizoram", code: "MZ", type: "state", capital: "Aizawl", lsSeats: 1, rsSeats: 1, assemblySeats: 40, reservedSC: 0, reservedST: 1 },
    { name: "Nagaland", code: "NL", type: "state", capital: "Kohima", lsSeats: 1, rsSeats: 1, assemblySeats: 60, reservedSC: 0, reservedST: 0 },
    { name: "Odisha", code: "OD", type: "state", capital: "Bhubaneswar", lsSeats: 21, rsSeats: 10, assemblySeats: 147, reservedSC: 3, reservedST: 5 },
    { name: "Punjab", code: "PB", type: "state", capital: "Chandigarh", lsSeats: 13, rsSeats: 7, assemblySeats: 117, reservedSC: 4, reservedST: 0 },
    { name: "Rajasthan", code: "RJ", type: "state", capital: "Jaipur", lsSeats: 25, rsSeats: 10, assemblySeats: 200, reservedSC: 4, reservedST: 3 },
    { name: "Sikkim", code: "SK", type: "state", capital: "Gangtok", lsSeats: 1, rsSeats: 1, assemblySeats: 32, reservedSC: 0, reservedST: 0 },
    { name: "Tamil Nadu", code: "TN", type: "state", capital: "Chennai", lsSeats: 39, rsSeats: 18, assemblySeats: 234, reservedSC: 7, reservedST: 0 },
    { name: "Telangana", code: "TS", type: "state", capital: "Hyderabad", lsSeats: 17, rsSeats: 7, assemblySeats: 119, reservedSC: 3, reservedST: 2 },
    { name: "Tripura", code: "TR", type: "state", capital: "Agartala", lsSeats: 2, rsSeats: 1, assemblySeats: 60, reservedSC: 0, reservedST: 1 },
    { name: "Uttar Pradesh", code: "UP", type: "state", capital: "Lucknow", lsSeats: 80, rsSeats: 31, assemblySeats: 403, reservedSC: 17, reservedST: 0 },
    { name: "Uttarakhand", code: "UK", type: "state", capital: "Dehradun", lsSeats: 5, rsSeats: 3, assemblySeats: 70, reservedSC: 1, reservedST: 0 },
    { name: "West Bengal", code: "WB", type: "state", capital: "Kolkata", lsSeats: 42, rsSeats: 16, assemblySeats: 294, reservedSC: 10, reservedST: 2 },
    { name: "Delhi", code: "DL", type: "ut", capital: "New Delhi", lsSeats: 7, rsSeats: 3, assemblySeats: 70, reservedSC: 1, reservedST: 0 },
    { name: "Jammu & Kashmir", code: "JK", type: "ut", capital: "Srinagar", lsSeats: 5, rsSeats: 4, assemblySeats: 90, reservedSC: 0, reservedST: 0 },
    { name: "Puducherry", code: "PY", type: "ut", capital: "Puducherry", lsSeats: 1, rsSeats: 1, assemblySeats: 30, reservedSC: 0, reservedST: 0 },
    { name: "Chandigarh", code: "CH", type: "ut", capital: "Chandigarh", lsSeats: 1, rsSeats: 0, assemblySeats: 0, reservedSC: 0, reservedST: 0 },
    { name: "Andaman & Nicobar", code: "AN", type: "ut", capital: "Port Blair", lsSeats: 1, rsSeats: 0, assemblySeats: 0, reservedSC: 0, reservedST: 0 },
    { name: "Dadra Nagar Haveli & Daman Diu", code: "DD", type: "ut", capital: "Daman", lsSeats: 2, rsSeats: 0, assemblySeats: 0, reservedSC: 0, reservedST: 0 },
    { name: "Lakshadweep", code: "LD", type: "ut", capital: "Kavaratti", lsSeats: 1, rsSeats: 0, assemblySeats: 0, reservedSC: 0, reservedST: 0 },
    { name: "Ladakh", code: "LA", type: "ut", capital: "Leh", lsSeats: 1, rsSeats: 0, assemblySeats: 0, reservedSC: 0, reservedST: 0 },
  ];
  for (const s of statesData) {
    await prisma.stateUT.upsert({ where: { code: s.code }, update: s, create: s });
  }

  // ═══════════════════════════════════════════════════════════════
  // POLITICAL PARTIES
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding political parties...");
  const partiesData = [
    { name: "Bharatiya Janata Party", abbreviation: "BJP", founded: 1980, ideology: ["Right-wing", "Hindu Nationalism", "Integral Humanism"], president: "J.P. Nadda", headquarters: "New Delhi", color: "#FF9933", type: "National", symbol: "Lotus", alliances: ["NDA"], currentSeats: { ls: 240, rs: 86 }, history: "Emerged from Bharatiya Jana Sangh (1951). Governed from 1998 (Vajpayee) and 2014 onwards (Modi). India's largest party by membership.", states: ["Gujarat", "Madhya Pradesh", "Rajasthan", "Uttarakhand", "Assam", "Goa", "Tripura"] },
    { name: "Indian National Congress", abbreviation: "INC", founded: 1885, ideology: ["Centre-Left", "Social Democracy", "Secularism"], president: "Mallikarjun Kharge", headquarters: "New Delhi", color: "#00BFFF", type: "National", symbol: "Hand", alliances: ["INDIA"], currentSeats: { ls: 99, rs: 26 }, history: "India's oldest party (1885). Led independence movement. Ruled most of post-independence era under Nehru, Indira, Rajiv, Manmohan Singh.", states: ["Karnataka", "Telangana", "Himachal Pradesh"] },
    { name: "Aam Aadmi Party", abbreviation: "AAP", founded: 2012, ideology: ["Centre-Left", "Populism", "Anti-corruption"], president: "Arvind Kejriwal", headquarters: "New Delhi", color: "#0066CC", type: "National", symbol: "Broom", alliances: ["INDIA"], currentSeats: { ls: 3, rs: 10 }, history: "Born from 2011 anti-corruption movement. Won Delhi 2013 & 2015 (67/70). Won Punjab 2022.", states: ["Punjab"] },
    { name: "All India Trinamool Congress", abbreviation: "TMC", founded: 1998, ideology: ["Centre-Left", "Bengali Nationalism", "Populism"], president: "Mamata Banerjee", headquarters: "Kolkata", color: "#00FF00", type: "National", symbol: "Flowers and Grass", alliances: ["INDIA"], currentSeats: { ls: 29, rs: 13 }, history: "Founded by Mamata Banerjee after leaving Congress. Ended 34 years of Left rule in West Bengal in 2011.", states: ["West Bengal"] },
    { name: "Dravida Munnetra Kazhagam", abbreviation: "DMK", founded: 1949, ideology: ["Centre-Left", "Dravidian Politics", "Social Justice", "Federalism"], president: "M.K. Stalin", headquarters: "Chennai", color: "#FF0000", type: "State", symbol: "Rising Sun", alliances: ["INDIA"], currentSeats: { ls: 22, rs: 10 }, history: "Born from the Dravidian movement. Founded by C.N. Annadurai. Advocates Tamil identity and social justice.", states: ["Tamil Nadu"] },
    { name: "Bahujan Samaj Party", abbreviation: "BSP", founded: 1984, ideology: ["Centre-Left", "Social Equality", "Ambedkarism"], president: "Mayawati", headquarters: "New Delhi", color: "#0000FF", type: "National", symbol: "Elephant", alliances: [] as string[], currentSeats: { ls: 0, rs: 1 }, history: "Founded by Kanshi Ram for Dalits, OBCs, minorities. Mayawati became first Dalit woman CM in UP.", states: [] as string[] },
    { name: "Samajwadi Party", abbreviation: "SP", founded: 1992, ideology: ["Centre-Left", "Democratic Socialism", "OBC Empowerment"], president: "Akhilesh Yadav", headquarters: "Lucknow", color: "#FF0000", type: "State", symbol: "Bicycle", alliances: ["INDIA"], currentSeats: { ls: 37, rs: 4 }, history: "Founded by Mulayam Singh Yadav. Strong OBC and Muslim support in UP. Won UP in 2012.", states: ["Uttar Pradesh"] },
    { name: "Janata Dal (United)", abbreviation: "JDU", founded: 1999, ideology: ["Centre", "Social Justice", "Secularism"], president: "Nitish Kumar", headquarters: "Patna", color: "#006400", type: "State", symbol: "Arrow", alliances: ["NDA"], currentSeats: { ls: 12, rs: 5 }, history: "Major force in Bihar. Nitish Kumar has been CM multiple times. Part of NDA coalition.", states: ["Bihar"] },
    { name: "Telugu Desam Party", abbreviation: "TDP", founded: 1982, ideology: ["Centre-Right", "Telugu Nationalism", "Federalism"], president: "N. Chandrababu Naidu", headquarters: "Amaravati", color: "#FFFF00", type: "State", symbol: "Bicycle", alliances: ["NDA"], currentSeats: { ls: 16, rs: 3 }, history: "Founded by NT Rama Rao. Major party in Andhra Pradesh. Won AP in 2024 under Chandrababu Naidu.", states: ["Andhra Pradesh"] },
    { name: "Communist Party of India (Marxist)", abbreviation: "CPI(M)", founded: 1964, ideology: ["Far-Left", "Marxism-Leninism", "Secularism"], president: "Sitaram Yechury", headquarters: "New Delhi", color: "#FF0000", type: "National", symbol: "Hammer Sickle and Star", alliances: ["INDIA"], currentSeats: { ls: 4, rs: 5 }, history: "Ruled West Bengal for 34 years (1977-2011). Strong in Kerala and Tripura. India's largest communist party.", states: ["Kerala"] },
  ];
  const partyMap: Record<string, string> = {};
  for (const p of partiesData) {
    const party = await prisma.politicalParty.upsert({
      where: { abbreviation: p.abbreviation },
      update: p,
      create: p,
    });
    partyMap[p.abbreviation] = party.id;
  }

  // ═══════════════════════════════════════════════════════════════
  // PEOPLE (REPRESENTATIVES)
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding representatives...");
  const peopleData = [
    { name: "Droupadi Murmu", designation: "President of India", gender: "Female", state: "Odisha", partyAbbr: "BJP", chamber: null, constituency: null, level: "central", contact: {}, profile: {} },
    { name: "Jagdeep Dhankhar", designation: "Vice President of India", gender: "Male", state: "Rajasthan", partyAbbr: "BJP", chamber: null, constituency: null, level: "central", contact: {}, profile: {} },
    { name: "Narendra Modi", designation: "Prime Minister / MP", gender: "Male", state: "Uttar Pradesh", partyAbbr: "BJP", chamber: "lok_sabha", constituency: "Varanasi", level: "central", contact: { email: "pm@nic.in", phone: "+91-11-23012312", website: "https://www.narendramodi.in", twitter: "@narendramodi", address: "7, Lok Kalyan Marg, New Delhi" }, profile: { education: "MA Political Science", age: 75, attendance: 87, questionsAsked: 0, debatesParticipated: 12, billsIntroduced: 0, termStart: "2024" } },
    { name: "Rahul Gandhi", designation: "Leader of Opposition / MP", gender: "Male", state: "Uttar Pradesh", partyAbbr: "INC", chamber: "lok_sabha", constituency: "Rae Bareli", level: "central", contact: { email: "rahul@inc.in", twitter: "@RahulGandhi" }, profile: { education: "MPhil Development Studies", age: 55, attendance: 72, questionsAsked: 15, debatesParticipated: 28, billsIntroduced: 3, termStart: "2024" } },
    { name: "Akhilesh Yadav", designation: "Member of Parliament", gender: "Male", state: "Uttar Pradesh", partyAbbr: "SP", chamber: "lok_sabha", constituency: "Kannauj", level: "central", contact: { twitter: "@aborakhaborileshyadav" }, profile: { education: "MSc Environmental Engineering", age: 51, termStart: "2024" } },
    { name: "Mamata Banerjee", designation: "Chief Minister / MLA", gender: "Female", state: "West Bengal", partyAbbr: "TMC", chamber: "state_assembly", constituency: "Bhawanipur", level: "state", contact: { phone: "+91-33-22145555", twitter: "@MamataOfficial" }, profile: { termStart: "2021" } },
    { name: "M.K. Stalin", designation: "Chief Minister / MLA", gender: "Male", state: "Tamil Nadu", partyAbbr: "DMK", chamber: "state_assembly", constituency: "Kolathur", level: "state", contact: { twitter: "@mkstalin" }, profile: { termStart: "2021" } },
    { name: "Sanjiv Khanna", designation: "Chief Justice of India", gender: "Male", state: "Delhi", partyAbbr: null, chamber: null, constituency: null, level: "central", contact: {}, profile: {} },
    { name: "Om Birla", designation: "Speaker of Lok Sabha", gender: "Male", state: "Rajasthan", partyAbbr: "BJP", chamber: "lok_sabha", constituency: "Kota", level: "central", contact: {}, profile: {} },
    { name: "Rajiv Kumar", designation: "Chief Election Commissioner", gender: "Male", state: null, partyAbbr: null, chamber: null, constituency: null, level: "central", contact: {}, profile: {} },
  ];
  const personMap: Record<string, string> = {};
  for (const p of peopleData) {
    const existing = await prisma.person.findFirst({ where: { name: p.name } });
    const person = existing ?? await prisma.person.create({
      data: {
        name: p.name,
        designation: p.designation,
        gender: p.gender,
        state: p.state,
        stateCode: p.state ? statesData.find(s => s.name === p.state)?.code : null,
        partyId: p.partyAbbr ? partyMap[p.partyAbbr] : null,
        chamber: p.chamber,
        constituency: p.constituency,
        level: p.level,
        contact: p.contact,
        profile: p.profile,
      },
    });
    personMap[p.name] = person.id;
  }

  // ═══════════════════════════════════════════════════════════════
  // CONSTITUTION PARTS
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding constitution parts...");
  const partsData = [
    { number: 1, name: "The Union and its Territory", articles: "1-4" },
    { number: 2, name: "Citizenship", articles: "5-11" },
    { number: 3, name: "Fundamental Rights", articles: "12-35" },
    { number: 4, name: "Directive Principles of State Policy", articles: "36-51" },
    { number: 4.1, name: "Fundamental Duties", articles: "51A" },
    { number: 5, name: "The Union", articles: "52-151" },
    { number: 6, name: "The States", articles: "152-237" },
    { number: 8, name: "The Union Territories", articles: "239-242" },
    { number: 9, name: "Panchayats", articles: "243-243O" },
    { number: 9.1, name: "The Municipalities", articles: "243P-243ZG" },
    { number: 11, name: "Relations between the Union and the States", articles: "245-263" },
    { number: 12, name: "Finance, Property, Contracts and Suits", articles: "264-300A" },
    { number: 14, name: "Services under the Union and States", articles: "308-323" },
    { number: 15, name: "Elections", articles: "324-329A" },
    { number: 18, name: "Emergency Provisions", articles: "352-360" },
    { number: 20, name: "Amendment of the Constitution", articles: "368" },
  ];
  const partMap: Record<number, string> = {};
  for (const p of partsData) {
    const part = await prisma.constitutionPart.upsert({
      where: { number: p.number },
      update: p,
      create: p,
    });
    partMap[p.number] = part.id;
  }

  // ═══════════════════════════════════════════════════════════════
  // CONSTITUTION ARTICLES
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding constitution articles...");
  const articlesData = [
    { number: "1", title: "Name and territory of the Union", text: "India, that is Bharat, shall be a Union of States. The territory of India shall comprise the territories of the States, the Union territories, and any territory that may be acquired.", explanation: "The use of 'Union of States' instead of 'Federation of States' was deliberate — it emphasizes that India is not a result of an agreement by states but is an indissoluble union.", partNum: 1, category: "other", relatedArticles: ["2", "3", "4"] },
    { number: "14", title: "Equality before law", text: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.", explanation: "Embodies two concepts: (1) Equality before law — absence of special privilege from English common law; (2) Equal protection of laws — equal treatment in equal circumstances from the American Constitution.", partNum: 3, category: "fundamental_rights", relatedArticles: ["15", "16", "17", "18"] },
    { number: "19", title: "Protection of certain rights regarding freedom of speech, etc.", text: "All citizens shall have the right to — (a) freedom of speech and expression; (b) assemble peaceably and without arms; (c) form associations or unions or co-operative societies; (d) move freely throughout the territory of India; (e) reside and settle in any part of the territory of India; (g) practise any profession, or to carry on any occupation, trade or business.", explanation: "These six freedoms are not absolute and can be reasonably restricted by the State on grounds specified in clauses (2) to (6), such as sovereignty, security of state, public order, decency, morality.", partNum: 3, category: "fundamental_rights", relatedArticles: ["14", "20", "21", "21A", "22"] },
    { number: "21", title: "Protection of life and personal liberty", text: "No person shall be deprived of his life or personal liberty except according to procedure established by law.", explanation: "The Supreme Court has expansively interpreted 'life' to include the right to live with dignity, right to livelihood, right to privacy, right to health, right to clean environment, right to shelter, right to education, right to speedy trial, and many more.", partNum: 3, category: "fundamental_rights", relatedArticles: ["14", "19", "20", "22", "21A"] },
    { number: "21A", title: "Right to education", text: "The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may, by law, determine.", explanation: "Inserted by the 86th Amendment (2002). Made education a fundamental right for children aged 6-14. The RTE Act 2009 provides the legislative framework.", partNum: 3, category: "fundamental_rights", relatedArticles: ["21", "45", "51A"] },
    { number: "32", title: "Remedies for enforcement of Fundamental Rights", text: "The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed. The Supreme Court shall have power to issue directions or orders or writs.", explanation: "Dr. B.R. Ambedkar called this the 'heart and soul of the Constitution.' Provides five writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto.", partNum: 3, category: "fundamental_rights", relatedArticles: ["226", "21", "14"] },
    { number: "39", title: "Certain principles of policy to be followed by the State", text: "The State shall direct its policy towards securing: adequate means of livelihood, equitable distribution of resources, prevention of concentration of wealth, equal pay for equal work, protection of workers' health and children from exploitation.", explanation: "These principles guide the State in making laws and policies. While not enforceable by courts, they are fundamental in governance.", partNum: 4, category: "dpsp", relatedArticles: ["38", "40", "41", "43"] },
    { number: "356", title: "Provisions in case of failure of constitutional machinery in States", text: "If the President is satisfied that a situation has arisen in which the Government of the State cannot be carried on in accordance with the provisions of this Constitution, the President may by Proclamation assume to himself all or any of the functions of the Government of the State.", explanation: "Known as 'President's Rule,' this has been one of the most controversial provisions. The SR Bommai judgment (1994) established important safeguards against misuse.", partNum: 18, category: "emergency", relatedArticles: ["352", "360", "365"] },
    { number: "368", title: "Power of Parliament to amend the Constitution", text: "Parliament may, in exercise of its constituent power, amend by way of addition, variation or repeal any provision of this Constitution in accordance with the procedure laid down in this article.", explanation: "Three types: (1) Simple majority; (2) Special majority — 2/3 present and voting + total membership majority; (3) Special majority + ratification by half the state legislatures. The basic structure doctrine limits this power.", partNum: 20, category: "amendment", relatedArticles: ["13", "32", "226"] },
  ];
  const articleMap: Record<string, string> = {};
  for (const a of articlesData) {
    const article = await prisma.constitutionArticle.upsert({
      where: { number: a.number },
      update: { title: a.title, text: a.text, explanation: a.explanation, category: a.category, relatedArticles: a.relatedArticles, partId: partMap[a.partNum] },
      create: { number: a.number, title: a.title, text: a.text, explanation: a.explanation, partId: partMap[a.partNum], category: a.category, relatedArticles: a.relatedArticles },
    });
    articleMap[a.number] = article.id;
  }

  // ═══════════════════════════════════════════════════════════════
  // AMENDMENTS
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding amendments...");
  const amendmentsData = [
    { number: 1, year: 1951, description: "Added Ninth Schedule; restricted fundamental rights for agrarian reform; added reasonable restrictions to Article 19", significance: "landmark" },
    { number: 7, year: 1956, description: "Reorganization of states on linguistic basis; abolished Part B states", significance: "landmark" },
    { number: 24, year: 1971, description: "Affirmed Parliament's power to amend fundamental rights", significance: "major" },
    { number: 25, year: 1971, description: "Restricted property rights; added Article 31C giving primacy to DPSPs", significance: "major" },
    { number: 42, year: 1976, description: "The 'Mini-Constitution' — added socialist, secular, integrity to Preamble; curtailed judicial review; added Fundamental Duties", significance: "landmark" },
    { number: 44, year: 1978, description: "Undid many 42nd Amendment changes; removed right to property from fundamental rights; restored judicial powers", significance: "landmark" },
    { number: 52, year: 1985, description: "Anti-defection law — added Tenth Schedule", significance: "major" },
    { number: 61, year: 1989, description: "Reduced voting age from 21 to 18 years", significance: "major" },
    { number: 73, year: 1992, description: "Constitutionalized Panchayati Raj institutions — added Part IX", significance: "landmark" },
    { number: 74, year: 1992, description: "Constitutionalized Municipalities — added Part IXA", significance: "landmark" },
    { number: 86, year: 2002, description: "Made education a fundamental right (Article 21A) for children aged 6-14", significance: "landmark" },
    { number: 91, year: 2003, description: "Limited size of Council of Ministers to 15% of legislative body strength", significance: "moderate" },
    { number: 101, year: 2016, description: "Introduced Goods and Services Tax (GST) — India's biggest tax reform", significance: "landmark" },
    { number: 103, year: 2019, description: "Provided 10% reservation for economically weaker sections (EWS)", significance: "major" },
    { number: 104, year: 2020, description: "Extended reservation of SC/ST seats in Lok Sabha and State Assemblies", significance: "moderate" },
    { number: 106, year: 2023, description: "Reservation of seats for women in Lok Sabha, State Assemblies, and NCT Delhi Assembly", significance: "landmark" },
  ];
  for (const a of amendmentsData) {
    await prisma.amendment.upsert({
      where: { number: a.number },
      update: a,
      create: a,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // COURTS & LANDMARK CASES
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding courts & landmark cases...");
  const courtsData = [
    { name: "Supreme Court of India", type: "supreme", basis: "Art. 124–147", judges: "CJI + 33 Judges (sanctioned: 34)", jurisdiction: "Whole of India — original, appellate, advisory", description: "The guardian of the Constitution and highest court of appeal. Its decisions are binding on all courts in India.", powers: ["Original jurisdiction in inter-state and Centre–State disputes (Art. 131)", "Appellate jurisdiction via SLP (Art. 136)", "Constitutional interpretation (Art. 132–134)", "Advisory jurisdiction (Presidential Reference, Art. 143)", "Judicial review of legislation under Art. 13", "Enforcement of Fundamental Rights (Art. 32)", "Complete justice under Art. 142"], courtCount: "1", courtChildren: ["hc", "ngt", "nclt", "cat"] },
    { name: "High Courts (25)", type: "high", basis: "Art. 214–231", judges: "Varies — Allahabad (160) to Sikkim (3)", jurisdiction: "Each state/UT — original, appellate, supervisory", description: "Each state has a High Court. They have wider writ jurisdiction than the Supreme Court.", powers: ["Writ jurisdiction under Art. 226 (broader than Art. 32)", "Superintendence over all subordinate courts (Art. 227)", "Appellate jurisdiction over subordinate courts", "Court of Record (Art. 215)", "Transfer of cases to itself (Art. 228)"], courtCount: "25", courtChildren: ["district", "sessions"] },
    { name: "District & Sessions Courts (~672)", type: "district", basis: "Art. 233–237", judges: "District Judge + Additional Judges", jurisdiction: "Original (civil & criminal) — one per district", description: "Principal courts of original jurisdiction at the district level.", powers: ["Original civil jurisdiction in high-value suits", "Sessions Court for IPC offences carrying 7+ years", "Appellate jurisdiction over Magistrate courts", "Execution of High Court decrees"], courtCount: "~672", courtChildren: ["civil_subordinate", "magistrate"] },
    { name: "Civil & Subordinate Courts", type: "subordinate", basis: "State legislation", judges: "Civil Judges, Munsifs", jurisdiction: "Original (lower-value civil cases)", description: "Civil Judge courts and Small Causes Courts at sub-district level.", powers: ["Civil Judge — suits below District Court pecuniary limits", "Small Causes Courts in metro cities", "Family Courts for matrimonial disputes (Family Courts Act, 1984)"], courtCount: "~5,000+" },
    { name: "Judicial Magistrate Courts", type: "subordinate", basis: "CrPC / BNSS", judges: "Chief Judicial Magistrate, JMs", jurisdiction: "Original criminal jurisdiction (lesser offences)", description: "Handle the majority of criminal cases in India.", powers: ["Trial of offences with up to 3–7 years imprisonment", "Committal of serious cases to Sessions Court", "Cognizance of police chargesheets"], courtCount: "~15,000+" },
    { name: "National Green Tribunal (NGT)", type: "tribunal", basis: "NGT Act, 2010", judges: "Chairperson + Expert Members", jurisdiction: "Environmental disputes (all India)", description: "Specialised tribunal for environmental protection, conservation, and forest rights.", powers: ["Adjudication of environmental disputes", "Relief and compensation for environmental damage", "Implementation of environmental laws"], courtCount: "1" },
    { name: "National Company Law Tribunal (NCLT)", type: "tribunal", basis: "Companies Act, 2013", judges: "President + Judicial & Technical Members", jurisdiction: "Corporate insolvency and company law", description: "Handles insolvency proceedings, mergers, and company law disputes.", powers: ["Insolvency Resolution under IBC, 2016", "Approval of mergers and demergers", "Oppression and mismanagement cases"], courtCount: "16 benches" },
    { name: "Central Administrative Tribunal (CAT)", type: "tribunal", basis: "Administrative Tribunals Act, 1985", judges: "Chairman + Members", jurisdiction: "Service matters of Central Government employees", description: "Adjudicates service disputes of Central Government employees.", powers: ["Service disputes — promotions, transfers, termination", "Original jurisdiction in matters covered by Art. 323A", "Appeal lies to HC under Art. 226/227"], courtCount: "17 benches" },
  ];
  // High Courts with detailed info
  const highCourtsDetail = [
    { name: "Allahabad High Court",       city: "Prayagraj",  states: ["Uttar Pradesh"],                                          established: 1866, sanctioned: 160, region: "North",     benches: ["Lucknow"],                      notable: "Largest HC by judge strength" },
    { name: "Andhra Pradesh High Court",  city: "Amaravati",  states: ["Andhra Pradesh"],                                         established: 2019, sanctioned: 37,  region: "South",     benches: [],                               notable: "Newest HC, successor to undivided Andhra HC" },
    { name: "Bombay High Court",          city: "Mumbai",     states: ["Maharashtra", "Goa", "Dadra & NH", "Daman & Diu"],        established: 1862, sanctioned: 94,  region: "West",      benches: ["Nagpur", "Aurangabad", "Panaji"],notable: "One of three original Charter HCs (1862)" },
    { name: "Calcutta High Court",        city: "Kolkata",    states: ["West Bengal", "Andaman & Nicobar"],                       established: 1862, sanctioned: 72,  region: "East",      benches: ["Port Blair"],                   notable: "Oldest High Court in India" },
    { name: "Chhattisgarh High Court",    city: "Bilaspur",   states: ["Chhattisgarh"],                                           established: 2000, sanctioned: 22,  region: "Central",   benches: [],                               notable: "Formed on Chhattisgarh statehood" },
    { name: "Delhi High Court",           city: "New Delhi",  states: ["Delhi (NCT)"],                                            established: 1966, sanctioned: 60,  region: "North",     benches: [],                               notable: "Jurisdiction over national capital" },
    { name: "Gauhati High Court",         city: "Guwahati",   states: ["Assam", "Nagaland", "Mizoram", "Arunachal Pradesh"],      established: 1948, sanctioned: 24,  region: "Northeast", benches: ["Kohima", "Aizawl", "Itanagar"], notable: "Principal HC for the Northeast" },
    { name: "Gujarat High Court",         city: "Ahmedabad",  states: ["Gujarat"],                                                established: 1960, sanctioned: 52,  region: "West",      benches: [],                               notable: "Formed on Gujarat–Maharashtra bifurcation" },
    { name: "Himachal Pradesh High Court",city: "Shimla",     states: ["Himachal Pradesh"],                                       established: 1971, sanctioned: 13,  region: "North",     benches: [],                               notable: "Situated at 7,000 ft altitude" },
    { name: "J&K & Ladakh High Court",    city: "Srinagar",   states: ["Jammu & Kashmir", "Ladakh"],                              established: 1928, sanctioned: 17,  region: "North",     benches: ["Jammu"],                        notable: "Serves two UTs post Art. 370 abrogation" },
    { name: "Jharkhand High Court",       city: "Ranchi",     states: ["Jharkhand"],                                              established: 2000, sanctioned: 25,  region: "East",      benches: [],                               notable: "Formed on Jharkhand statehood" },
    { name: "Karnataka High Court",       city: "Bengaluru",  states: ["Karnataka"],                                              established: 1884, sanctioned: 62,  region: "South",     benches: ["Dharwad", "Kalaburagi"],        notable: "Third busiest HC" },
    { name: "Kerala High Court",          city: "Ernakulam",  states: ["Kerala", "Lakshadweep"],                                  established: 1958, sanctioned: 47,  region: "South",     benches: [],                               notable: "Known for high case disposal rate" },
    { name: "Madras High Court",          city: "Chennai",    states: ["Tamil Nadu", "Puducherry"],                               established: 1862, sanctioned: 75,  region: "South",     benches: ["Madurai"],                      notable: "One of three original Charter HCs" },
    { name: "Manipur High Court",         city: "Imphal",     states: ["Manipur"],                                                established: 2013, sanctioned: 5,   region: "Northeast", benches: [],                               notable: "One of smallest HCs" },
    { name: "Meghalaya High Court",       city: "Shillong",   states: ["Meghalaya"],                                              established: 2013, sanctioned: 4,   region: "Northeast", benches: [],                               notable: "One of newest HCs" },
    { name: "Madhya Pradesh High Court",  city: "Jabalpur",   states: ["Madhya Pradesh"],                                         established: 1956, sanctioned: 53,  region: "Central",   benches: ["Gwalior", "Indore"],            notable: "Former Nagpur HC jurisdiction absorbed" },
    { name: "Orissa High Court",          city: "Cuttack",    states: ["Odisha"],                                                 established: 1948, sanctioned: 33,  region: "East",      benches: [],                               notable: "City still called Cuttack, not Bhubaneswar" },
    { name: "Patna High Court",           city: "Patna",      states: ["Bihar"],                                                  established: 1916, sanctioned: 53,  region: "East",      benches: [],                               notable: "Serves Bihar after Jharkhand separation" },
    { name: "Punjab & Haryana High Court",city: "Chandigarh", states: ["Punjab", "Haryana", "Chandigarh (UT)"],                   established: 1947, sanctioned: 85,  region: "North",     benches: [],                               notable: "Serves two states + 1 UT from shared capital" },
    { name: "Rajasthan High Court",       city: "Jodhpur",    states: ["Rajasthan"],                                              established: 1949, sanctioned: 40,  region: "North",     benches: ["Jaipur"],                       notable: "Principal seat in Jodhpur, not capital Jaipur" },
    { name: "Sikkim High Court",          city: "Gangtok",    states: ["Sikkim"],                                                 established: 1975, sanctioned: 3,   region: "Northeast", benches: [],                               notable: "Smallest HC in India" },
    { name: "Telangana High Court",       city: "Hyderabad",  states: ["Telangana"],                                              established: 2019, sanctioned: 46,  region: "South",     benches: [],                               notable: "Shares premises with AP HC temporarily" },
    { name: "Tripura High Court",         city: "Agartala",   states: ["Tripura"],                                                established: 2013, sanctioned: 4,   region: "Northeast", benches: [],                               notable: "One of four new Northeast HCs (2013)" },
    { name: "Uttarakhand High Court",     city: "Nainital",   states: ["Uttarakhand"],                                            established: 2000, sanctioned: 11,  region: "North",     benches: [],                               notable: "Seated at a hill station" },
  ];
  const courtMap: Record<string, string> = {};
  for (const c of courtsData) {
    const court = await prisma.court.upsert({
      where: { name: c.name },
      update: c,
      create: c,
    });
    courtMap[c.name] = court.id;
  }
  for (const hc of highCourtsDetail) {
    await prisma.court.upsert({
      where: { name: hc.name },
      update: { ...hc, type: "high" },
      create: { ...hc, type: "high", powers: [] },
    });
  }

  const casesData = [
    { name: "Kesavananda Bharati v. State of Kerala", citation: "AIR 1973 SC 1461", year: 1973, courtName: "Supreme Court of India", summary: "Established the 'Basic Structure Doctrine' — Parliament can amend any part of the Constitution, but cannot alter its basic structure.", significance: "The most important constitutional case. A 13-judge bench (7-6) held Parliament cannot destroy basic features including supremacy of Constitution, republican form, secular character, separation of powers, federal character.", impact: "Permanently limited Parliament's amending power and established judicial supremacy in constitutional interpretation", articleNums: ["368"] },
    { name: "Maneka Gandhi v. Union of India", citation: "AIR 1978 SC 597", year: 1978, courtName: "Supreme Court of India", summary: "Expanded Article 21 — 'procedure established by law' must be fair, just, and reasonable.", significance: "Transformed Article 21 from narrow protection to comprehensive guarantee of dignified existence. Established Articles 14, 19, 21 as 'golden triangle' of rights.", impact: "Vastly expanded personal liberty and due process rights in India", articleNums: ["21", "14", "19"] },
    { name: "S.R. Bommai v. Union of India", citation: "AIR 1994 SC 1918", year: 1994, courtName: "Supreme Court of India", summary: "Limited misuse of Article 356 — President's Rule is subject to judicial review.", significance: "A 9-judge bench established: secularism is basic structure; President's Rule can be reviewed; floor test is proper way to determine majority.", impact: "Dramatically reduced misuse of Article 356 and strengthened federalism", articleNums: ["356"] },
    { name: "K.S. Puttaswamy v. Union of India", citation: "(2017) 10 SCC 1", year: 2017, courtName: "Supreme Court of India", summary: "Unanimously declared Right to Privacy as a fundamental right under Article 21.", significance: "9-judge bench unanimously overruled previous judgments. Established three-part test for privacy invasion: legality, legitimate aim, proportionality.", impact: "Established privacy as fundamental right, impacting Aadhaar, data protection, personal autonomy", articleNums: ["21", "14", "19"] },
    { name: "Vishaka v. State of Rajasthan", citation: "AIR 1997 SC 3011", year: 1997, courtName: "Supreme Court of India", summary: "Laid down guidelines to prevent sexual harassment at workplace, functioning as law until legislation.", significance: "SC exercised Article 32 power to fill legislative vacuum by creating binding guidelines. Served as law for 16 years until the 2013 Act.", impact: "Pioneered judicial legislation to protect women's workplace rights", articleNums: ["14", "19", "21", "32"] },
    { name: "I.C. Golaknath v. State of Punjab", citation: "AIR 1967 SC 1643", year: 1967, courtName: "Supreme Court of India", summary: "Held Parliament cannot amend Fundamental Rights — later partially overruled by Kesavananda.", significance: "11-judge bench (6-5) held fundamental rights cannot be abridged. Led to 24th and 25th Amendments and ultimately Kesavananda.", impact: "Set the stage for the basic structure doctrine debate", articleNums: ["368"] },
  ];
  for (const c of casesData) {
    const existingCase = await prisma.landmarkCase.findFirst({ where: { citation: c.citation } });
    if (existingCase) continue;
    await prisma.landmarkCase.create({
      data: {
        name: c.name,
        citation: c.citation,
        year: c.year,
        courtId: courtMap[c.courtName],
        summary: c.summary,
        significance: c.significance,
        impact: c.impact,
        articlesInterpreted: {
          connect: c.articleNums.filter(n => articleMap[n]).map(n => ({ id: articleMap[n] })),
        },
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // WRITS
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding writs...");
  const writsData = [
    { name: "Habeas Corpus", meaning: "To have the body", usage: "Against illegal detention — directs detaining authority to produce the detained person before the court" },
    { name: "Mandamus", meaning: "We command", usage: "Directs a public official, body, or lower court to perform a duty they are legally obligated to perform" },
    { name: "Prohibition", meaning: "To forbid", usage: "Issued by a higher court to prevent a lower court or tribunal from exceeding its jurisdiction" },
    { name: "Certiorari", meaning: "To be certified", usage: "Issued to a lower court to transfer a case or quash an order if it has acted beyond jurisdiction" },
    { name: "Quo Warranto", meaning: "By what authority", usage: "Challenges the legal authority of a person holding a public office" },
  ];
  for (const w of writsData) {
    await prisma.writ.upsert({ where: { name: w.name }, update: w, create: w });
  }

  // ═══════════════════════════════════════════════════════════════
  // INSTITUTIONS (POWER HIERARCHY)
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding institutions...");
  const instData = [
    { slug: "people", name: "People of India", type: "sovereign", branch: "sovereign", level: "central", description: "The ultimate sovereign — all power derives from the people through elections and constitutional mandate", powers: ["Elect representatives", "Amend constitution via representatives", "Ultimate sovereign authority"], constitutionalBasis: "Preamble", parentSlug: null },
    { slug: "constitution", name: "Constitution of India", type: "supreme_law", branch: "constitutional", level: "central", description: "The supreme law — establishes framework, grants powers, defines rights, limits authority", powers: ["Supreme law of the land", "Establishes all institutions", "Defines fundamental rights", "Limits government power"], constitutionalBasis: "Preamble, Art. 1-395", parentSlug: "people" },
    { slug: "president", name: "President of India", type: "position", branch: "executive", level: "central", description: "Head of State and first citizen of India", powers: ["Head of State", "Supreme Commander of Armed Forces", "Appoints PM", "Appoints Governors", "Appoints CJI and SC judges", "Assents to bills", "Emergency powers", "Pardoning power"], constitutionalBasis: "Art. 52-62", parentSlug: "constitution", appointedBy: "Electoral College (elected MPs + MLAs)", removableBy: "Impeachment by Parliament (Art. 61)" },
    { slug: "vice-president", name: "Vice President of India", type: "position", branch: "executive", level: "central", description: "Ex-officio Chairman of Rajya Sabha", powers: ["Ex-officio Chairman of Rajya Sabha", "Acts as President during vacancy/absence"], constitutionalBasis: "Art. 63-71", parentSlug: "president", appointedBy: "Electoral College (both Houses of Parliament)", removableBy: "Resolution of Rajya Sabha agreed by Lok Sabha (Art. 67)" },
    { slug: "pm", name: "Prime Minister", type: "position", branch: "executive", level: "central", description: "Head of Government, leader of the majority in Lok Sabha", powers: ["Head of Government", "Leader of Lok Sabha majority", "Heads Council of Ministers", "Advises President on appointments", "Chairs Cabinet", "Heads NITI Aayog", "Controls nuclear arsenal"], constitutionalBasis: "Art. 74-75", parentSlug: "president", appointedBy: "President (leader of majority party/coalition)", removableBy: "Loss of majority in Lok Sabha (no-confidence motion)", reportsTo: "President, Parliament" },
    { slug: "parliament", name: "Parliament of India", type: "institution", branch: "legislature", level: "central", description: "The supreme legislative body of India consisting of the President and two Houses", powers: ["Makes laws for the Union", "Controls government through questions/debates/motions", "Approves budget", "Amends Constitution", "Approves emergency proclamations", "Can impeach President", "Can remove judges"], constitutionalBasis: "Art. 79-122", parentSlug: "constitution" },
    { slug: "lok-sabha", name: "Lok Sabha (House of the People)", type: "institution", branch: "legislature", level: "central", description: "The lower house of Parliament, directly elected by the people", powers: ["Introduces Money Bills exclusively", "No-confidence motion", "Represents the people directly", "543 elected + 2 nominated members"], constitutionalBasis: "Art. 81-82, 331", parentSlug: "parliament" },
    { slug: "rajya-sabha", name: "Rajya Sabha (Council of States)", type: "institution", branch: "legislature", level: "central", description: "The upper house of Parliament, representing the states", powers: ["Represents states", "Can delay but not veto Money Bills", "Special power to create All-India Services (Art. 312)", "245 members, never fully dissolved"], constitutionalBasis: "Art. 80, 83", parentSlug: "parliament" },
    { slug: "supreme-court", name: "Supreme Court of India", type: "institution", branch: "judiciary", level: "central", description: "The apex court and guardian of the Constitution", powers: ["Guardian of the Constitution", "Judicial review", "Original jurisdiction (Centre-State disputes)", "Appellate jurisdiction", "Advisory jurisdiction", "Enforces Fundamental Rights (Art. 32)", "Court of Record", "Law declared by SC is binding"], constitutionalBasis: "Art. 124-147", parentSlug: "constitution" },
    { slug: "high-courts", name: "High Courts", type: "institution", branch: "judiciary", level: "state", description: "State-level appellate courts with wider writ jurisdiction than SC", powers: ["Writ jurisdiction wider than SC (Art. 226)", "Appellate jurisdiction", "Supervision over subordinate courts", "Power to transfer cases"], constitutionalBasis: "Art. 214-231", parentSlug: "supreme-court" },
    { slug: "district-courts", name: "District & Subordinate Courts", type: "institution", branch: "judiciary", level: "district", description: "Trial courts — first point of judicial contact for citizens", powers: ["Trial courts for civil and criminal cases", "First point of judicial contact"], constitutionalBasis: "Art. 233-237", parentSlug: "high-courts" },
    { slug: "council-of-ministers", name: "Council of Ministers", type: "institution", branch: "executive", level: "central", description: "The body that aids and advises the President, collectively responsible to Lok Sabha", powers: ["Aids and advises the President", "Collectively responsible to Lok Sabha", "Heads government departments"], constitutionalBasis: "Art. 74-75", parentSlug: "pm" },
    { slug: "cabinet-secretary", name: "Cabinet Secretary", type: "position", branch: "executive", level: "central", description: "Head of the Indian civil services and Secretary to the Cabinet", powers: ["Head of civil services", "Secretary to the Cabinet", "Chairs Committee of Secretaries", "Senior-most IAS officer"], constitutionalBasis: null, parentSlug: "pm", reportsTo: "Prime Minister" },
    { slug: "governor", name: "Governor", type: "position", branch: "executive", level: "state", description: "Constitutional head of the state, appointed by the President", powers: ["Constitutional head of state", "Appoints Chief Minister", "Can reserve bills for President", "Can recommend President's Rule", "Pardoning power within state", "Chancellor of state universities"], constitutionalBasis: "Art. 153-162", parentSlug: "president", appointedBy: "President", removableBy: "President (serves at pleasure)" },
    { slug: "chief-minister", name: "Chief Minister", type: "position", branch: "executive", level: "state", description: "Head of state government, leader of majority in state legislature", powers: ["Head of state government", "Leader of majority in state legislature", "Advises Governor", "Chairs state cabinet"], constitutionalBasis: "Art. 163-164", parentSlug: "governor", appointedBy: "Governor (leader of majority party/coalition)", removableBy: "Loss of majority in State Assembly", reportsTo: "Governor, State Legislature" },
    { slug: "district-collector", name: "District Collector / District Magistrate", type: "position", branch: "executive", level: "district", description: "Head of district administration — the pivot of governance", powers: ["Head of district administration", "Revenue collection", "Law and order", "Coordinates all departments", "Election officer for district", "Disaster management"], constitutionalBasis: null, parentSlug: "chief-minister", reportsTo: "State Government / Divisional Commissioner" },
    { slug: "panchayat-raj", name: "Panchayati Raj Institutions", type: "institution", branch: "executive", level: "local", description: "Rural local self-governance bodies — 3-tier system", powers: ["Rural local self-governance", "29 subjects in Eleventh Schedule"], constitutionalBasis: "Art. 243-243O (73rd Amendment)", parentSlug: "district-collector" },
    { slug: "municipalities", name: "Urban Local Bodies", type: "institution", branch: "executive", level: "local", description: "Urban local self-governance — Municipal Corporations, Municipalities, Nagar Panchayats", powers: ["Urban local self-governance", "18 functions in Twelfth Schedule"], constitutionalBasis: "Art. 243P-243ZG (74th Amendment)", parentSlug: "district-collector" },
    { slug: "eci", name: "Election Commission of India", type: "constitutional_body", branch: "independent", level: "central", description: "Constitutional body that superintends, directs, and controls elections", powers: ["Superintendence and control of elections", "Prepares electoral rolls", "Schedules elections", "Enforces Model Code of Conduct", "Recognizes political parties"], constitutionalBasis: "Art. 324", parentSlug: "constitution", appointedBy: "President" },
    { slug: "cag", name: "Comptroller and Auditor General", type: "constitutional_body", branch: "independent", level: "central", description: "Audits all government expenditure and reports to Parliament", powers: ["Audits all government accounts", "Reports to Parliament/State Legislatures", "Guardian of the public purse"], constitutionalBasis: "Art. 148-151", parentSlug: "constitution", appointedBy: "President", removableBy: "Same procedure as SC judge (impeachment)" },
    { slug: "upsc", name: "Union Public Service Commission", type: "constitutional_body", branch: "independent", level: "central", description: "Conducts civil services examinations and advises on recruitment", powers: ["Conducts civil services examinations", "Advises on recruitment", "Disciplinary matters"], constitutionalBasis: "Art. 315-323", parentSlug: "constitution", appointedBy: "President" },
    { slug: "attorney-general", name: "Attorney General of India", type: "position", branch: "executive", level: "central", description: "Chief legal advisor to the Government of India", powers: ["Chief legal advisor to government", "Right to speak in Parliament", "Appears on behalf of India in courts"], constitutionalBasis: "Art. 76", parentSlug: "president", appointedBy: "President" },
    { slug: "niti-aayog", name: "NITI Aayog", type: "institution", branch: "executive", level: "central", description: "Policy think tank — replaced Planning Commission in 2015", powers: ["Policy think tank", "Cooperative federalism", "Monitors SDGs"], constitutionalBasis: null, parentSlug: "pm" },
  ];

  const instMap: Record<string, string> = {};
  // First pass — create without parents
  for (const i of instData) {
    const inst = await prisma.institution.upsert({
      where: { slug: i.slug },
      update: { name: i.name, type: i.type, branch: i.branch, level: i.level, description: i.description, powers: i.powers, constitutionalBasis: i.constitutionalBasis, appointedBy: i.appointedBy ?? null, removableBy: i.removableBy ?? null, reportsTo: i.reportsTo ?? null },
      create: { slug: i.slug, name: i.name, type: i.type, branch: i.branch, level: i.level, description: i.description, powers: i.powers, constitutionalBasis: i.constitutionalBasis, appointedBy: i.appointedBy ?? null, removableBy: i.removableBy ?? null, reportsTo: i.reportsTo ?? null },
    });
    instMap[i.slug] = inst.id;
  }
  // Second pass — set parents
  for (const i of instData) {
    if (i.parentSlug && instMap[i.parentSlug]) {
      await prisma.institution.update({
        where: { slug: i.slug },
        data: { parentId: instMap[i.parentSlug] },
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ELECTION SUMMARIES
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding election data...");
  const electionHistory = [
    { year: 1952, type: "lok_sabha", totalSeats: 489, majorWinner: "INC", majorSeats: 364, turnout: 45.7 },
    { year: 1957, type: "lok_sabha", totalSeats: 494, majorWinner: "INC", majorSeats: 371, turnout: 47.7 },
    { year: 1962, type: "lok_sabha", totalSeats: 494, majorWinner: "INC", majorSeats: 361, turnout: 55.4 },
    { year: 1967, type: "lok_sabha", totalSeats: 520, majorWinner: "INC", majorSeats: 283, turnout: 61.3 },
    { year: 1971, type: "lok_sabha", totalSeats: 518, majorWinner: "INC", majorSeats: 352, turnout: 55.3 },
    { year: 1977, type: "lok_sabha", totalSeats: 542, majorWinner: "JNP", majorSeats: 295, turnout: 60.5 },
    { year: 1980, type: "lok_sabha", totalSeats: 529, majorWinner: "INC(I)", majorSeats: 353, turnout: 56.9 },
    { year: 1984, type: "lok_sabha", totalSeats: 514, majorWinner: "INC", majorSeats: 404, turnout: 64.0 },
    { year: 1989, type: "lok_sabha", totalSeats: 529, majorWinner: "INC", majorSeats: 197, turnout: 62.0 },
    { year: 1991, type: "lok_sabha", totalSeats: 521, majorWinner: "INC", majorSeats: 244, turnout: 56.7 },
    { year: 1996, type: "lok_sabha", totalSeats: 543, majorWinner: "BJP", majorSeats: 161, turnout: 57.9 },
    { year: 1998, type: "lok_sabha", totalSeats: 543, majorWinner: "BJP", majorSeats: 182, turnout: 62.0 },
    { year: 1999, type: "lok_sabha", totalSeats: 543, majorWinner: "BJP", majorSeats: 182, turnout: 60.0 },
    { year: 2004, type: "lok_sabha", totalSeats: 543, majorWinner: "INC", majorSeats: 145, turnout: 58.1 },
    { year: 2009, type: "lok_sabha", totalSeats: 543, majorWinner: "INC", majorSeats: 206, turnout: 58.2 },
    { year: 2014, type: "lok_sabha", totalSeats: 543, majorWinner: "BJP", majorSeats: 282, turnout: 66.4 },
    { year: 2019, type: "lok_sabha", totalSeats: 543, majorWinner: "BJP", majorSeats: 303, turnout: 67.4 },
    { year: 2024, type: "lok_sabha", totalSeats: 543, majorWinner: "BJP", majorSeats: 240, turnout: 65.8 },
  ];
  for (const e of electionHistory) {
    await prisma.electionSummary.upsert({
      where: { year_type: { year: e.year, type: e.type } },
      update: e,
      create: e,
    });
  }

  const partyResults2024 = [
    { year: 2024, type: "lok_sabha", party: "BJP", color: "#FF9933", seats: 240, voteShare: 36.56 },
    { year: 2024, type: "lok_sabha", party: "INC", color: "#00BFFF", seats: 99, voteShare: 21.19 },
    { year: 2024, type: "lok_sabha", party: "SP", color: "#FF0000", seats: 37, voteShare: 4.42 },
    { year: 2024, type: "lok_sabha", party: "TMC", color: "#00FF00", seats: 29, voteShare: 4.03 },
    { year: 2024, type: "lok_sabha", party: "DMK", color: "#FF0000", seats: 22, voteShare: 2.58 },
    { year: 2024, type: "lok_sabha", party: "TDP", color: "#FFFF00", seats: 16, voteShare: 1.73 },
    { year: 2024, type: "lok_sabha", party: "JDU", color: "#006400", seats: 12, voteShare: 1.32 },
    { year: 2024, type: "lok_sabha", party: "Others", color: "#6B7280", seats: 88, voteShare: 28.17 },
  ];
  for (const r of partyResults2024) {
    await prisma.partyElectionResult.upsert({
      where: { year_type_party: { year: r.year, type: r.type, party: r.party } },
      update: r,
      create: r,
    });
  }

  // Historical party results — 18 LS elections, INC / BJP / Left / SP
  const historicalPartyResults = [
    { year: 1952, INC: 364, BJP: 3,   Left: 28, SP: 0,  incShare: 45.0, bjpShare: 3.1,  leftShare: 8.0  },
    { year: 1957, INC: 371, BJP: 4,   Left: 34, SP: 0,  incShare: 47.8, bjpShare: 5.9,  leftShare: 9.0  },
    { year: 1962, INC: 361, BJP: 14,  Left: 52, SP: 0,  incShare: 44.7, bjpShare: 6.4,  leftShare: 10.2 },
    { year: 1967, INC: 283, BJP: 35,  Left: 42, SP: 0,  incShare: 40.8, bjpShare: 9.4,  leftShare: 8.5  },
    { year: 1971, INC: 352, BJP: 22,  Left: 48, SP: 0,  incShare: 43.7, bjpShare: 7.4,  leftShare: 10.2 },
    { year: 1977, INC: 154, BJP: 295, Left: 29, SP: 0,  incShare: 34.5, bjpShare: 41.3, leftShare: 8.8  },
    { year: 1980, INC: 353, BJP: 31,  Left: 41, SP: 0,  incShare: 42.7, bjpShare: 19.0, leftShare: 10.2 },
    { year: 1984, INC: 414, BJP: 2,   Left: 29, SP: 0,  incShare: 49.0, bjpShare: 7.4,  leftShare: 8.2  },
    { year: 1989, INC: 197, BJP: 85,  Left: 56, SP: 0,  incShare: 39.5, bjpShare: 11.5, leftShare: 10.5 },
    { year: 1991, INC: 244, BJP: 120, Left: 58, SP: 5,  incShare: 36.5, bjpShare: 20.1, leftShare: 11.0 },
    { year: 1996, INC: 140, BJP: 161, Left: 67, SP: 17, incShare: 28.8, bjpShare: 20.3, leftShare: 12.0 },
    { year: 1998, INC: 141, BJP: 182, Left: 57, SP: 20, incShare: 25.8, bjpShare: 25.6, leftShare: 11.2 },
    { year: 1999, INC: 114, BJP: 182, Left: 64, SP: 26, incShare: 28.3, bjpShare: 23.8, leftShare: 12.5 },
    { year: 2004, INC: 145, BJP: 138, Left: 61, SP: 36, incShare: 26.5, bjpShare: 22.2, leftShare: 11.5 },
    { year: 2009, INC: 206, BJP: 116, Left: 24, SP: 23, incShare: 28.5, bjpShare: 18.8, leftShare: 7.5  },
    { year: 2014, INC: 44,  BJP: 282, Left: 11, SP: 5,  incShare: 19.5, bjpShare: 31.0, leftShare: 4.1  },
    { year: 2019, INC: 52,  BJP: 303, Left: 6,  SP: 5,  incShare: 19.5, bjpShare: 37.4, leftShare: 2.7  },
    { year: 2024, INC: 99,  BJP: 240, Left: 5,  SP: 37, incShare: 21.2, bjpShare: 36.6, leftShare: 2.1  },
  ];
  const historicalRows = historicalPartyResults.flatMap((r) => [
    { year: r.year, type: "lok_sabha", party: "INC",  color: "#1565C0", seats: r.INC,  voteShare: r.incShare  },
    { year: r.year, type: "lok_sabha", party: "BJP",  color: "#FF9933", seats: r.BJP,  voteShare: r.bjpShare  },
    { year: r.year, type: "lok_sabha", party: "Left", color: "#B91C1C", seats: r.Left, voteShare: r.leftShare },
    { year: r.year, type: "lok_sabha", party: "SP",   color: "#EF4444", seats: r.SP,   voteShare: null        },
  ]);
  for (const r of historicalRows) {
    await prisma.partyElectionResult.upsert({
      where: { year_type_party: { year: r.year, type: r.type, party: r.party } },
      update: r,
      create: r,
    });
  }

  // State-wise 2024 Lok Sabha results
  console.log("  Seeding state election results...");
  const stateResults2024 = [
    { year: 2024, type: "lok_sabha", state: "Uttar Pradesh",     code: "UP", seats: 80, dominant: "SP",      dominantColor: "#EF4444", dominantSeats: 37, alliance: "INDIA", turnout: 57.4, ndaSeats: 36, indiaSeats: 43, otherSeats: 1  },
    { year: 2024, type: "lok_sabha", state: "Maharashtra",       code: "MH", seats: 48, dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 13, alliance: "INDIA", turnout: 61.0, ndaSeats: 17, indiaSeats: 30, otherSeats: 1  },
    { year: 2024, type: "lok_sabha", state: "West Bengal",       code: "WB", seats: 42, dominant: "TMC",     dominantColor: "#059669", dominantSeats: 29, alliance: "INDIA", turnout: 73.0, ndaSeats: 12, indiaSeats: 30, otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Tamil Nadu",        code: "TN", seats: 39, dominant: "DMK",     dominantColor: "#DC143C", dominantSeats: 22, alliance: "INDIA", turnout: 69.1, ndaSeats: 1,  indiaSeats: 38, otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Bihar",             code: "BR", seats: 40, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 12, alliance: "NDA",   turnout: 56.2, ndaSeats: 30, indiaSeats: 10, otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Karnataka",         code: "KA", seats: 28, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 17, alliance: "NDA",   turnout: 69.5, ndaSeats: 19, indiaSeats: 9,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Andhra Pradesh",    code: "AP", seats: 25, dominant: "TDP",     dominantColor: "#D97706", dominantSeats: 16, alliance: "NDA",   turnout: 79.4, ndaSeats: 21, indiaSeats: 4,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Rajasthan",         code: "RJ", seats: 25, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 14, alliance: "NDA",   turnout: 58.2, ndaSeats: 14, indiaSeats: 8,  otherSeats: 3  },
    { year: 2024, type: "lok_sabha", state: "Madhya Pradesh",    code: "MP", seats: 29, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 29, alliance: "NDA",   turnout: 58.1, ndaSeats: 29, indiaSeats: 0,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Gujarat",           code: "GJ", seats: 26, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 25, alliance: "NDA",   turnout: 60.3, ndaSeats: 25, indiaSeats: 0,  otherSeats: 1  },
    { year: 2024, type: "lok_sabha", state: "Odisha",            code: "OD", seats: 21, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 20, alliance: "NDA",   turnout: 74.2, ndaSeats: 20, indiaSeats: 1,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Kerala",            code: "KL", seats: 20, dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 18, alliance: "INDIA", turnout: 70.9, ndaSeats: 1,  indiaSeats: 19, otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Telangana",         code: "TS", seats: 17, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 8,  alliance: "NDA",   turnout: 63.2, ndaSeats: 8,  indiaSeats: 8,  otherSeats: 1  },
    { year: 2024, type: "lok_sabha", state: "Assam",             code: "AS", seats: 14, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 9,  alliance: "NDA",   turnout: 74.0, ndaSeats: 11, indiaSeats: 3,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Jharkhand",         code: "JH", seats: 14, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 8,  alliance: "NDA",   turnout: 65.6, ndaSeats: 9,  indiaSeats: 5,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Punjab",            code: "PB", seats: 13, dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 7,  alliance: "INDIA", turnout: 60.8, ndaSeats: 2,  indiaSeats: 10, otherSeats: 1  },
    { year: 2024, type: "lok_sabha", state: "Chhattisgarh",      code: "CG", seats: 11, dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 10, alliance: "NDA",   turnout: 72.1, ndaSeats: 10, indiaSeats: 1,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Haryana",           code: "HR", seats: 10, dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 5,  alliance: "INDIA", turnout: 63.2, ndaSeats: 5,  indiaSeats: 5,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Delhi",             code: "DL", seats: 7,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 7,  alliance: "NDA",   turnout: 58.7, ndaSeats: 7,  indiaSeats: 0,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Jammu & Kashmir",   code: "JK", seats: 5,  dominant: "NC",      dominantColor: "#1A237E", dominantSeats: 2,  alliance: "INDIA", turnout: 57.8, ndaSeats: 2,  indiaSeats: 3,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Uttarakhand",       code: "UK", seats: 5,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 5,  alliance: "NDA",   turnout: 60.1, ndaSeats: 5,  indiaSeats: 0,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Himachal Pradesh",  code: "HP", seats: 4,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 4,  alliance: "NDA",   turnout: 72.3, ndaSeats: 4,  indiaSeats: 0,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Tripura",           code: "TR", seats: 2,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 2,  alliance: "NDA",   turnout: 80.4, ndaSeats: 2,  indiaSeats: 0,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Meghalaya",         code: "ML", seats: 2,  dominant: "VPP",     dominantColor: "#64748B", dominantSeats: 1,  alliance: "Other", turnout: 70.1, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 1  },
    { year: 2024, type: "lok_sabha", state: "Manipur",           code: "MN", seats: 2,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 1,  alliance: "NDA",   turnout: 70.2, ndaSeats: 1,  indiaSeats: 0,  otherSeats: 1  },
    { year: 2024, type: "lok_sabha", state: "Arunachal Pradesh", code: "AR", seats: 2,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 2,  alliance: "NDA",   turnout: 80.3, ndaSeats: 2,  indiaSeats: 0,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Goa",               code: "GA", seats: 2,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 1,  alliance: "NDA",   turnout: 76.5, ndaSeats: 1,  indiaSeats: 1,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Nagaland",          code: "NL", seats: 1,  dominant: "NDPP",    dominantColor: "#64748B", dominantSeats: 1,  alliance: "NDA",   turnout: 62.1, ndaSeats: 1,  indiaSeats: 0,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Mizoram",           code: "MZ", seats: 1,  dominant: "ZPM",     dominantColor: "#6D28D9", dominantSeats: 1,  alliance: "Other", turnout: 56.9, ndaSeats: 0,  indiaSeats: 0,  otherSeats: 1  },
    { year: 2024, type: "lok_sabha", state: "Sikkim",            code: "SK", seats: 1,  dominant: "SKM",     dominantColor: "#059669", dominantSeats: 1,  alliance: "Other", turnout: 80.1, ndaSeats: 0,  indiaSeats: 0,  otherSeats: 1  },
    { year: 2024, type: "lok_sabha", state: "Chandigarh",        code: "CH", seats: 1,  dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 1,  alliance: "INDIA", turnout: 68.3, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Puducherry",        code: "PY", seats: 1,  dominant: "INC",     dominantColor: "#1565C0", dominantSeats: 1,  alliance: "INDIA", turnout: 80.5, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "A&N Islands",       code: "AN", seats: 1,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 1,  alliance: "NDA",   turnout: 72.4, ndaSeats: 1,  indiaSeats: 0,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Lakshadweep",       code: "LD", seats: 1,  dominant: "NCP-SP",  dominantColor: "#7C3AED", dominantSeats: 1,  alliance: "INDIA", turnout: 84.1, ndaSeats: 0,  indiaSeats: 1,  otherSeats: 0  },
    { year: 2024, type: "lok_sabha", state: "Ladakh",            code: "LA", seats: 1,  dominant: "Ind.",    dominantColor: "#64748B", dominantSeats: 1,  alliance: "Other", turnout: 72.0, ndaSeats: 0,  indiaSeats: 0,  otherSeats: 1  },
    { year: 2024, type: "lok_sabha", state: "DNH & DD",          code: "DD", seats: 2,  dominant: "BJP",     dominantColor: "#FF9933", dominantSeats: 2,  alliance: "NDA",   turnout: 71.2, ndaSeats: 2,  indiaSeats: 0,  otherSeats: 0  },
  ];
  for (const r of stateResults2024) {
    await prisma.stateElectionResult.upsert({
      where: { year_type_state: { year: r.year, type: r.type, state: r.state } },
      update: r,
      create: r,
    });
  }

  // State assembly election results (2022-2024)
  console.log("  Seeding state assembly elections...");
  const assemblyElections = [
    { state: "Jharkhand",        year: 2024, totalSeats: 81,  winner: "JMM",  winnerColor: "#2E7D32", winnerSeats: 34,  runnerUp: "BJP",   runnerUpSeats: 21, turnout: 68.5 },
    { state: "Maharashtra",      year: 2024, totalSeats: 288, winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 132, runnerUp: "INC",   runnerUpSeats: 50, turnout: 65.0 },
    { state: "Haryana",          year: 2024, totalSeats: 90,  winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 48,  runnerUp: "INC",   runnerUpSeats: 37, turnout: 67.9 },
    { state: "Jammu & Kashmir",  year: 2024, totalSeats: 90,  winner: "NC",   winnerColor: "#1A237E", winnerSeats: 42,  runnerUp: "BJP",   runnerUpSeats: 29, turnout: 63.6 },
    { state: "Andhra Pradesh",   year: 2024, totalSeats: 175, winner: "TDP",  winnerColor: "#D97706", winnerSeats: 135, runnerUp: "YSRCP", runnerUpSeats: 11, turnout: 81.1 },
    { state: "Odisha",           year: 2024, totalSeats: 147, winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 78,  runnerUp: "BJD",   runnerUpSeats: 51, turnout: 74.1 },
    { state: "Rajasthan",        year: 2023, totalSeats: 200, winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 115, runnerUp: "INC",   runnerUpSeats: 69, turnout: 75.1 },
    { state: "Madhya Pradesh",   year: 2023, totalSeats: 230, winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 163, runnerUp: "INC",   runnerUpSeats: 66, turnout: 77.1 },
    { state: "Chhattisgarh",     year: 2023, totalSeats: 90,  winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 54,  runnerUp: "INC",   runnerUpSeats: 35, turnout: 76.4 },
    { state: "Telangana",        year: 2023, totalSeats: 119, winner: "INC",  winnerColor: "#1565C0", winnerSeats: 64,  runnerUp: "BRS",   runnerUpSeats: 39, turnout: 73.1 },
    { state: "Mizoram",          year: 2023, totalSeats: 40,  winner: "ZPM",  winnerColor: "#6D28D9", winnerSeats: 27,  runnerUp: "MNF",   runnerUpSeats: 10, turnout: 80.9 },
    { state: "Karnataka",        year: 2023, totalSeats: 224, winner: "INC",  winnerColor: "#1565C0", winnerSeats: 135, runnerUp: "BJP",   runnerUpSeats: 66, turnout: 72.7 },
    { state: "Gujarat",          year: 2022, totalSeats: 182, winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 156, runnerUp: "INC",   runnerUpSeats: 17, turnout: 63.3 },
    { state: "Himachal Pradesh", year: 2022, totalSeats: 68,  winner: "INC",  winnerColor: "#1565C0", winnerSeats: 40,  runnerUp: "BJP",   runnerUpSeats: 25, turnout: 75.6 },
    { state: "Uttar Pradesh",    year: 2022, totalSeats: 403, winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 255, runnerUp: "SP",    runnerUpSeats: 111, turnout: 60.5 },
    { state: "Punjab",           year: 2022, totalSeats: 117, winner: "AAP",  winnerColor: "#06B6D4", winnerSeats: 92,  runnerUp: "INC",   runnerUpSeats: 18, turnout: 71.9 },
    { state: "Uttarakhand",      year: 2022, totalSeats: 70,  winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 47,  runnerUp: "INC",   runnerUpSeats: 19, turnout: 65.5 },
    { state: "Goa",              year: 2022, totalSeats: 40,  winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 20,  runnerUp: "INC",   runnerUpSeats: 11, turnout: 79.6 },
    { state: "Manipur",          year: 2022, totalSeats: 60,  winner: "BJP",  winnerColor: "#FF9933", winnerSeats: 32,  runnerUp: "NPP",   runnerUpSeats: 7,  turnout: 88.1 },
  ];
  for (const r of assemblyElections) {
    await prisma.stateAssemblyElection.upsert({
      where: { state_year: { state: r.state, year: r.year } },
      update: r,
      create: r,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // MINISTRIES
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding ministries...");
  const ministriesData = [
    { name: "Ministry of Home Affairs", department: "Internal Security, Police, Border Management" },
    { name: "Ministry of Finance", department: "Economic Affairs, Revenue, Financial Services" },
    { name: "Ministry of External Affairs", department: "Foreign Policy, Diplomacy" },
    { name: "Ministry of Defence", department: "Armed Forces, Defence Production" },
    { name: "Ministry of Education", department: "School Education, Higher Education" },
    { name: "Ministry of Health & Family Welfare", department: "Public Health, Medical Education" },
    { name: "Ministry of Agriculture", department: "Agriculture, Farmers' Welfare" },
    { name: "Ministry of Law & Justice", department: "Legal Affairs, Legislative Department" },
    { name: "Ministry of Railways", department: "Indian Railways" },
    { name: "Ministry of Commerce & Industry", department: "Trade, Industrial Policy" },
    { name: "Ministry of Environment", department: "Environment, Forests, Climate Change" },
    { name: "Ministry of Rural Development", department: "Rural Development, Land Resources" },
    { name: "Ministry of Urban Development", department: "Housing, Urban Affairs" },
    { name: "Ministry of Women & Child Development", department: "Women's Welfare, Child Protection" },
    { name: "Ministry of Social Justice", department: "SC/ST/OBC Welfare, Disability" },
    { name: "Ministry of Electronics & IT", department: "Digital India, E-governance" },
    { name: "Ministry of Labour & Employment", department: "Labour Laws, Employment" },
    { name: "Ministry of Power", department: "Electricity, Power Generation" },
    { name: "Ministry of Jal Shakti", department: "Water Resources, Drinking Water" },
    { name: "Ministry of Tribal Affairs", department: "Tribal Welfare, Forest Rights" },
    { name: "Ministry of Panchayati Raj", department: "Local Governance, Gram Sabhas" },
    { name: "Ministry of Science & Technology", department: "Science, DSIR, Biotechnology" },
    { name: "Ministry of Information & Broadcasting", department: "Media, Broadcasting" },
    { name: "Ministry of Petroleum & Natural Gas", department: "Oil, Gas, Petroleum" },
  ];
  for (const m of ministriesData) {
    await prisma.ministry.upsert({ where: { name: m.name }, update: m, create: m });
  }

  // ═══════════════════════════════════════════════════════════════
  // BUREAUCRATIC HIERARCHIES
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding bureaucratic levels...");
  const centralHierarchy = [
    { hierarchy: "central_secretariat", level: 1, title: "Cabinet Secretary", description: "Head of the Indian civil services, Secretary to the Cabinet" },
    { hierarchy: "central_secretariat", level: 2, title: "Secretary to Government", description: "Administrative head of a ministry/department" },
    { hierarchy: "central_secretariat", level: 3, title: "Additional Secretary", description: "Assists the Secretary in ministry administration" },
    { hierarchy: "central_secretariat", level: 4, title: "Joint Secretary", description: "Head of a division within a ministry" },
    { hierarchy: "central_secretariat", level: 5, title: "Director / Deputy Secretary", description: "Middle-level policy formulation and execution" },
    { hierarchy: "central_secretariat", level: 6, title: "Under Secretary", description: "Section-level administration" },
    { hierarchy: "central_secretariat", level: 7, title: "Section Officer", description: "Supervises a section handling specific subjects" },
    { hierarchy: "central_secretariat", level: 8, title: "Assistant Section Officer", description: "Day-to-day file handling and processing" },
  ];
  const fieldHierarchy = [
    { hierarchy: "district_administration", level: 1, title: "Chief Secretary", description: "Head of state civil services, Principal Advisor to CM" },
    { hierarchy: "district_administration", level: 2, title: "Additional Chief Secretary / Principal Secretary", description: "Heads major state departments" },
    { hierarchy: "district_administration", level: 3, title: "Divisional Commissioner", description: "Heads a revenue division comprising multiple districts" },
    { hierarchy: "district_administration", level: 4, title: "District Collector / District Magistrate", description: "Head of district administration — the pivot of governance" },
    { hierarchy: "district_administration", level: 5, title: "Sub-Divisional Magistrate (SDM)", description: "Heads a sub-division within a district" },
    { hierarchy: "district_administration", level: 6, title: "Tehsildar / Taluka Officer", description: "Revenue and land administration at tehsil level" },
    { hierarchy: "district_administration", level: 7, title: "Block Development Officer (BDO)", description: "Development administration at block level" },
    { hierarchy: "district_administration", level: 8, title: "Village Level Worker / Patwari", description: "Ground-level revenue and development functionary" },
  ];
  for (const b of [...centralHierarchy, ...fieldHierarchy]) {
    await prisma.bureaucraticLevel.upsert({
      where: { hierarchy_level: { hierarchy: b.hierarchy, level: b.level } },
      update: b,
      create: b,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // CIVIL SERVICES
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding civil services...");
  const civilServicesData = [
    { name: "Indian Administrative Service (IAS)", description: "The backbone of Indian administration. IAS officers serve as District Collectors, State Secretaries, and Central Secretaries.", exam: "UPSC Civil Services", cadre: "State cadre allotted" },
    { name: "Indian Police Service (IPS)", description: "Senior police officers who lead police forces at district, state, and national levels. Head CBI, IB, RAW.", exam: "UPSC Civil Services", cadre: "State cadre allotted" },
    { name: "Indian Foreign Service (IFS)", description: "India's diplomatic corps. Represent India abroad as ambassadors and in international organizations.", exam: "UPSC Civil Services", cadre: "Central cadre" },
    { name: "Indian Revenue Service (IRS)", description: "Officers who manage India's tax administration — Income Tax and Customs.", exam: "UPSC Civil Services", cadre: "Central cadre" },
  ];
  for (const c of civilServicesData) {
    await prisma.civilService.upsert({ where: { name: c.name }, update: c, create: c });
  }

  // ═══════════════════════════════════════════════════════════════
  // TIMELINE EVENTS
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding timeline events...");
  const timelineData = [
    { date: new Date("1947-08-15"), displayDate: "15 Aug 1947", title: "Independence", description: "India gains independence from British rule. Jawaharlal Nehru becomes the first Prime Minister.", category: "political", significance: "landmark" },
    { date: new Date("1949-11-26"), displayDate: "26 Nov 1949", title: "Constitution Adopted", description: "The Constituent Assembly adopts the Constitution after 2 years, 11 months, and 18 days of deliberation.", category: "constitutional", significance: "landmark" },
    { date: new Date("1950-01-26"), displayDate: "26 Jan 1950", title: "Republic Day", description: "The Constitution comes into effect. India becomes a sovereign democratic republic.", category: "constitutional", significance: "landmark" },
    { date: new Date("1951-10-25"), displayDate: "1951-52", title: "First General Election", description: "India holds its first general election — the largest democratic exercise in history. 173 million eligible voters.", category: "electoral", significance: "landmark" },
    { date: new Date("1956-11-01"), displayDate: "1956", title: "States Reorganization", description: "States reorganized on linguistic basis. The 7th Amendment reshapes India's map.", category: "constitutional", significance: "landmark" },
    { date: new Date("1967-02-27"), displayDate: "1967", title: "Golaknath Case", description: "Supreme Court rules Parliament cannot amend Fundamental Rights.", category: "judicial", significance: "landmark" },
    { date: new Date("1973-04-24"), displayDate: "1973", title: "Kesavananda Bharati", description: "Supreme Court establishes the Basic Structure Doctrine — the most consequential constitutional judgment.", category: "judicial", significance: "landmark" },
    { date: new Date("1975-06-25"), displayDate: "25 Jun 1975", title: "Emergency Declared", description: "PM Indira Gandhi declares internal emergency. Fundamental rights suspended, press censored, opposition jailed. Lasts 21 months.", category: "political", significance: "landmark" },
    { date: new Date("1977-03-20"), displayDate: "1977", title: "Emergency Ends, Janata Wins", description: "First non-Congress government. Janata Party coalition defeats Indira Gandhi. Democracy restored.", category: "electoral", significance: "landmark" },
    { date: new Date("1978-01-25"), displayDate: "1978", title: "Maneka Gandhi Case", description: "Supreme Court expands Article 21 — life and liberty include right to live with dignity. Golden Triangle established.", category: "judicial", significance: "landmark" },
    { date: new Date("1985-01-15"), displayDate: "1985", title: "Anti-Defection Law", description: "52nd Amendment adds Tenth Schedule to prevent political defections.", category: "constitutional", significance: "major" },
    { date: new Date("1991-07-24"), displayDate: "1991", title: "Economic Liberalization", description: "PM Narasimha Rao and FM Manmohan Singh open up India's economy. License Raj dismantled.", category: "economic", significance: "landmark" },
    { date: new Date("1992-12-24"), displayDate: "1992", title: "Panchayati Raj Constitutionalized", description: "73rd and 74th Amendments give constitutional status to local governance bodies.", category: "constitutional", significance: "landmark" },
    { date: new Date("1994-03-11"), displayDate: "1994", title: "SR Bommai Judgment", description: "Supreme Court limits misuse of Article 356 (President's Rule). Makes it subject to judicial review.", category: "judicial", significance: "landmark" },
    { date: new Date("2002-12-12"), displayDate: "2002", title: "Right to Education", description: "86th Amendment makes education a Fundamental Right (Article 21A) for children aged 6-14.", category: "constitutional", significance: "landmark" },
    { date: new Date("2005-06-15"), displayDate: "2005", title: "RTI Act Enacted", description: "Right to Information Act empowers citizens to access information from public authorities.", category: "political", significance: "landmark" },
    { date: new Date("2014-05-16"), displayDate: "2014", title: "BJP Wins Majority", description: "BJP wins 282 seats — first single-party majority since 1984. Narendra Modi becomes PM.", category: "electoral", significance: "major" },
    { date: new Date("2016-09-08"), displayDate: "2016", title: "GST Amendment", description: "101st Amendment enables GST — India's biggest indirect tax reform, creating unified national market.", category: "constitutional", significance: "landmark" },
    { date: new Date("2017-08-24"), displayDate: "2017", title: "Right to Privacy", description: "Supreme Court in Puttaswamy unanimously declares privacy a Fundamental Right under Article 21.", category: "judicial", significance: "landmark" },
    { date: new Date("2019-08-05"), displayDate: "2019", title: "Article 370 Abrogated", description: "Parliament revokes special status of J&K. State bifurcated into two Union Territories.", category: "constitutional", significance: "landmark" },
    { date: new Date("2023-09-28"), displayDate: "2023", title: "Women's Reservation", description: "106th Amendment reserves one-third seats for women in Lok Sabha and State Assemblies.", category: "constitutional", significance: "landmark" },
  ];
  for (const t of timelineData) {
    const existing = await prisma.timelineEvent.findFirst({ where: { title: t.title } });
    if (!existing) await prisma.timelineEvent.create({ data: t });
  }

  // ═══════════════════════════════════════════════════════════════
  // GOVERNANCE PROCESSES (SIMULATIONS)
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding governance processes...");
  const governanceProcesses = [
    {
      slug: "bill-passing", name: "How a Bill Becomes Law",
      description: "Walk through the complete legislative process — from introduction to Presidential assent",
      category: "legislative", difficulty: "beginner", estimatedTime: "10 min", constitutionalBasis: "Art. 107-111",
      steps: [
        { order: 1, title: "Bill Introduction", actor: "Member of Parliament / Minister", description: "A bill is introduced in either House of Parliament. Government bills are introduced by ministers.", institution: "Parliament", constitutionalArticle: "Art. 107-108", fact: "A Money Bill can only be introduced in the Lok Sabha (Art. 109)." },
        { order: 2, title: "First Reading", actor: "House in which bill is introduced", description: "The bill is introduced and its title and purpose are read out. No debate at this stage.", institution: "Parliament", constitutionalArticle: "Art. 107" },
        { order: 3, title: "Committee Stage", actor: "Standing/Select/Joint Committee", description: "The bill is referred to a parliamentary committee for detailed examination.", institution: "Parliamentary Committee", fact: "Committee stages are not mandatory but considered best practice.", options: [{ label: "Refer to Standing Committee", outcome: "Committee takes 3-6 months to examine.", correct: true }, { label: "Skip committee stage", outcome: "Bill proceeds directly to debate." }, { label: "Refer to Joint Committee", outcome: "Both houses form a joint committee." }] },
        { order: 4, title: "Second Reading — General Discussion", actor: "Full House", description: "The bill is discussed in general terms. Members debate principles and provisions.", institution: "Parliament" },
        { order: 5, title: "Second Reading — Clause-by-Clause", actor: "Full House", description: "Each clause is discussed individually and voted upon. Amendments can be proposed.", institution: "Parliament" },
        { order: 6, title: "Third Reading", actor: "Full House", description: "The bill is put to a final vote. Only verbal amendments allowed.", institution: "Parliament", options: [{ label: "Simple Majority", outcome: "Most bills require a simple majority.", correct: true }, { label: "Special Majority", outcome: "Constitutional amendments need 2/3 majority." }] },
        { order: 7, title: "Transmission to Other House", actor: "Other House of Parliament", description: "Bill sent to other House which can pass, reject, amend, or delay it.", institution: "Parliament", constitutionalArticle: "Art. 107-108", fact: "Joint Sitting (Art. 108) has happened only 3 times in history." },
        { order: 8, title: "Presidential Assent", actor: "President of India", description: "President may: give assent, withhold assent, or return for reconsideration.", institution: "Rashtrapati Bhavan", constitutionalArticle: "Art. 111", fact: "The President has never withheld assent outright." },
        { order: 9, title: "Law Enacted", actor: "Government of India", description: "Bill becomes an Act, published in Official Gazette.", institution: "Government", fact: "India has approximately 1,300 central laws currently in force." },
      ],
    },
    {
      slug: "no-confidence", name: "No-Confidence Motion",
      description: "How a government can be brought down through a vote of no-confidence",
      category: "executive", difficulty: "intermediate", estimatedTime: "8 min", constitutionalBasis: "Art. 75(3)",
      steps: [
        { order: 1, title: "Motion Submitted", actor: "Opposition MP", description: "Any Lok Sabha member can introduce a no-confidence motion. Requires at least 50 members' support.", institution: "Lok Sabha", constitutionalArticle: "Art. 75(3), Rule 198" },
        { order: 2, title: "Speaker's Decision", actor: "Speaker of Lok Sabha", description: "Speaker examines if motion has 50+ members' support by members rising in seats.", institution: "Lok Sabha", fact: "No-confidence motions can only be moved in Lok Sabha, not Rajya Sabha." },
        { order: 3, title: "Debate", actor: "Members of Lok Sabha", description: "Full debate where opposition highlights reasons; ruling party defends record. PM responds at end.", institution: "Lok Sabha" },
        { order: 4, title: "Vote", actor: "All Members of Lok Sabha", description: "Motion put to vote. If passed by simple majority, government must resign.", institution: "Lok Sabha", options: [{ label: "Motion Passes", outcome: "Council of Ministers must resign. President invites opposition or calls elections." }, { label: "Motion Fails", outcome: "Government survives. Another motion cannot be moved for 6 months.", correct: true }], fact: "27 no-confidence motions moved. Only one succeeded — against V.P. Singh (1990)." },
      ],
    },
    {
      slug: "constitutional-amendment", name: "Constitutional Amendment",
      description: "How the Constitution can be amended under Article 368",
      category: "constitutional", difficulty: "advanced", estimatedTime: "12 min", constitutionalBasis: "Art. 368",
      steps: [
        { order: 1, title: "Amendment Bill Introduced", actor: "Member of Parliament", description: "A bill to amend can be introduced in either House. No prior President permission needed.", institution: "Parliament", constitutionalArticle: "Art. 368" },
        { order: 2, title: "Passage in Each House", actor: "Both Houses of Parliament", description: "Must pass by Special Majority — majority of total membership AND 2/3 of members present and voting. No joint sitting possible.", institution: "Parliament", constitutionalArticle: "Art. 368(2)", fact: "If Lok Sabha has 545 members, at least 273 must vote in favor." },
        { order: 3, title: "State Ratification (If Required)", actor: "State Legislatures", description: "Certain amendments affecting federal provisions must be ratified by at least half the state legislatures.", institution: "State Legislatures", constitutionalArticle: "Art. 368(2) proviso", options: [{ label: "Ratification needed", outcome: "At least 15 of 28 states must ratify by simple majority.", correct: true }, { label: "No ratification needed", outcome: "Bill goes directly to President." }] },
        { order: 4, title: "Presidential Assent", actor: "President of India", description: "President must give assent — cannot return the bill for reconsideration.", institution: "Rashtrapati Bhavan", constitutionalArticle: "Art. 368(2)", fact: "The Basic Structure Doctrine limits amending power." },
        { order: 5, title: "Amendment Effective", actor: "Constitution of India", description: "Amendment becomes part of the Constitution from date of assent.", institution: "Government", fact: "India has had 106 amendments. The 42nd (1976) is called the 'Mini Constitution'." },
      ],
    },
  ];
  for (const gp of governanceProcesses) {
    const exists = await prisma.governanceProcess.findFirst({ where: { slug: gp.slug } });
    if (!exists) {
      await prisma.governanceProcess.create({
        data: { ...gp, steps: { create: gp.steps } },
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // CITIZEN ACTIONS
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding citizen actions...");
  const citizenActionsData = [
    { slug: "rti", title: "Right to Information (RTI)", description: "Access information from any public authority under the RTI Act, 2005", icon: "clipboard", difficulty: "Easy", cost: "Rs. 10", timeline: "30 days", legalBasis: "Right to Information Act, 2005 (Art. 19(1)(a))", template: "To,\nThe Public Information Officer,\n[Department Name],\n[Address]\n\nSubject: Application under RTI Act, 2005\n\nSir/Madam,\n\nI would like to seek the following information under the Right to Information Act, 2005:\n\n1. [Specific question]\n2. [Specific question]\n\nI am enclosing a fee of Rs. 10/- via [mode of payment].\n\nYours faithfully,\n[Name]\n[Address]\n[Phone/Email]", steps: ["Write application on plain paper or use rtionline.gov.in", "Address to PIO of relevant department", "Pay Rs. 10 fee (BPL applicants exempt)", "Clearly mention specific information needed", "Submit via post, in-person, or online", "PIO must respond within 30 days", "First appeal to Appellate Authority within 30 days", "Second appeal to Information Commission"] },
    { slug: "pil", title: "Public Interest Litigation (PIL)", description: "Approach SC or HC on issues affecting public interest", icon: "scale", difficulty: "Advanced", cost: "Minimal (court fees)", timeline: "Varies", legalBasis: "Article 32 (SC), Article 226 (HC)", template: null, steps: ["Identify genuine public interest issue", "Research if issue already addressed by courts", "Draft writ petition under Art. 32 or 226", "Include facts, legal grounds, prayer, documents", "PIL can be filed by any person", "File in court registry with copies and fees", "PIL letters to Chief Justice can also be treated as PILs"] },
    { slug: "grievance", title: "Public Grievance (CPGRAMS)", description: "Lodge complaints against government departments", icon: "file-text", difficulty: "Easy", cost: "Free", timeline: "30-60 days", legalBasis: "DARPG Administrative Mechanism", template: null, steps: ["Visit pgportal.gov.in", "Register with name, email, mobile", "Select ministry/department", "Write clear description with documents", "Submit — receive registration number", "Track status online", "Department must respond within 30 days", "Escalate or appeal if unsatisfied"] },
    { slug: "vote", title: "Register to Vote", description: "Ensure you're on the electoral roll", icon: "vote", difficulty: "Easy", cost: "Free", timeline: "15-30 days", legalBasis: "Article 326, Representation of the People Act, 1950", template: null, steps: ["Visit voters.eci.gov.in or Voter Helpline App", "Fill Form 6 (must be 18+ on qualifying date)", "Attach age proof and address proof", "Submit online or at Electoral Registration Office", "BLO may visit for verification", "Receive EPIC (Voter ID)", "Check electoral roll before every election"] },
    { slug: "contest", title: "Contest an Election", description: "Stand for election — from panchayat to Parliament", icon: "trophy", difficulty: "Advanced", cost: "Varies (Rs. 25,000 for LS)", timeline: "Election cycle", legalBasis: "Article 84, 102, 173, 191; RPA, 1951", template: null, steps: ["Meet eligibility: citizen, 25+ for LS (30+ for RS), registered voter", "Ensure not disqualified", "File nomination during nomination period", "Pay security deposit", "Get party nomination or contest as independent", "Campaign within expenditure limits", "Follow Model Code of Conduct"] },
    { slug: "protest", title: "Legal Right to Protest", description: "Your rights and responsibilities when protesting", icon: "megaphone", difficulty: "Intermediate", cost: "Free", timeline: "N/A", legalBasis: "Article 19(1)(a)(b)(c), Article 21", template: null, steps: ["Right to peaceful assembly under Art. 19(1)(b)", "Obtain prior police permission if required", "Must be peaceful and without arms", "State can impose reasonable restrictions", "Section 144 CrPC can prohibit assemblies", "Bandh calls are illegal; hartal is legal", "Blocking roads or property damage not protected", "Police cannot arrest without warrant for bailable offenses"] },
  ];
  for (const a of citizenActionsData) {
    await prisma.citizenAction.upsert({ where: { slug: a.slug }, update: a, create: a });
  }

  // ═══════════════════════════════════════════════════════════════
  // LEARNING PATHS
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding learning paths...");
  const learningPathsData = [
    { slug: "beginner", title: "Democracy 101", level: "beginner", description: "Start here if you're new to Indian governance. Understand basics of democracy, constitution, and rights.", estimatedHours: 3, color: "emerald", prerequisites: [] as string[], modules: ["What is Democracy?", "The Constitution — Why it Matters", "Three Branches of Government", "Your Fundamental Rights", "How Elections Work", "Who Represents You?"] },
    { slug: "intermediate", title: "Governance Deep Dive", level: "intermediate", description: "Go deeper into how government works — Parliament, judiciary, federalism, and bureaucracy.", estimatedHours: 8, color: "blue", prerequisites: ["beginner"], modules: ["Parliament: Structure & Functions", "How a Bill Becomes Law", "The Judiciary System", "Centre-State Relations", "Local Government (73rd & 74th Amendments)", "Political Parties & Coalitions", "Election Commission & Elections", "Public Finance & Budget"] },
    { slug: "advanced", title: "Constitutional Mastery", level: "advanced", description: "Master constitutional law, landmark judgments, emergency provisions, and amendments.", estimatedHours: 15, color: "purple", prerequisites: ["intermediate"], modules: ["Basic Structure Doctrine", "Fundamental Rights vs DPSPs", "Emergency Provisions & Safeguards", "Constitutional Amendment Process", "Landmark Supreme Court Judgments", "Anti-Defection Law", "Separation of Powers — Theory & Practice", "Judicial Activism & Restraint", "Constitutional Morality", "Federal Conflicts & Resolution"] },
    { slug: "upsc", title: "UPSC Polity Preparation", level: "upsc", description: "Comprehensive Indian Polity for UPSC Civil Services — prelims and mains.", estimatedHours: 40, color: "saffron", prerequisites: ["advanced"], modules: ["Historical Background", "Preamble Analysis", "Union & Territory (Art. 1-4)", "Citizenship (Art. 5-11)", "Fundamental Rights — Complete", "DPSP & Fundamental Duties", "Union Executive", "Parliament — Complete", "State Executive & Legislature", "Judiciary — SC, HC, Subordinate", "Centre-State Relations", "Emergency Provisions", "Constitutional Bodies", "Statutory Bodies", "Local Government", "Elections & Representation", "Key Amendments", "Landmark Cases", "Comparison with Other Constitutions", "Current Debates"] },
    { slug: "research", title: "Political Science Research", level: "research", description: "For researchers, journalists, policy experts — comparative politics and governance theory.", estimatedHours: 60, color: "slate", prerequisites: [] as string[], modules: ["Comparative Constitutional Design", "Indian Federalism — Scholarly Perspectives", "Electoral Systems & Reform", "Political Party Systems Theory", "Judicial Independence", "Decentralization & Local Governance", "Political Economy of Reform", "Media, Democracy & Public Opinion", "Gender & Representation", "Digital Governance"] },
  ];
  for (const lp of learningPathsData) {
    const exists = await prisma.learningPath.findFirst({ where: { slug: lp.slug } });
    if (!exists) {
      await prisma.learningPath.create({
        data: {
          slug: lp.slug,
          title: lp.title,
          level: lp.level,
          description: lp.description,
          estimatedHours: lp.estimatedHours,
          color: lp.color,
          prerequisites: lp.prerequisites,
          modules: {
            create: lp.modules.map((m, i) => ({
              title: m,
              order: i + 1,
            })),
          },
        },
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // IDEOLOGY SPECTRUM
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding ideology spectrum...");
  const ideologyData = [
    { position: "Far Left", parties: ["CPI", "CPI(M)"], description: "Marxism-Leninism, working class politics", order: 1 },
    { position: "Left", parties: ["CPI(M)", "CPI"], description: "Socialism, state ownership, worker rights", order: 2 },
    { position: "Centre-Left", parties: ["INC", "DMK", "TMC", "AAP", "SP", "BSP", "NCP"], description: "Social democracy, welfare state, secularism", order: 3 },
    { position: "Centre", parties: ["JDU", "BJD", "YSR"], description: "Pragmatic governance, regional interests", order: 4 },
    { position: "Centre-Right", parties: ["BJP", "SS", "TDP"], description: "Free market, cultural nationalism", order: 5 },
    { position: "Right", parties: ["BJP"], description: "Hindu nationalism, cultural conservatism", order: 6 },
  ];
  for (const i of ideologyData) {
    await prisma.ideologyPosition.upsert({ where: { position: i.position }, update: i, create: i });
  }

  // ═══════════════════════════════════════════════════════════════
  // TENURE RECORDS — link existing Persons to Positions
  // ═══════════════════════════════════════════════════════════════
  console.log("  Seeding tenure records...");

  // Find all positions that have associated persons (via name/designation matching)
  const allPositions = await prisma.position.findMany({
    include: { institution: { select: { name: true } } },
  });
  const allPersons = await prisma.person.findMany({
    select: { id: true, name: true, designation: true },
  });

  let tenureCreated = 0;
  for (const position of allPositions) {
    // Skip if tenure already exists for this position
    const existing = await prisma.tenure.findFirst({ where: { positionId: position.id } });
    if (existing) continue;

    // Try to find a matching person by designation containing position title
    const matchedPerson = allPersons.find((p) =>
      p.designation?.toLowerCase().includes(position.title.toLowerCase()),
    );

    if (matchedPerson) {
      await prisma.tenure.create({
        data: {
          personId: matchedPerson.id,
          positionId: position.id,
          startDate: new Date("2024-06-10"),
          endDate: null,
          startDateApproximate: false,
          mechanism: "appointed",
        },
      });
      tenureCreated++;
    }
  }
  console.log(`  Created ${tenureCreated} tenure records.`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
