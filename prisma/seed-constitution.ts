/**
 * Seed script for comprehensive constitutional data.
 * Run with: npx tsx prisma/seed-constitution.ts
 *
 * Populates: ConstitutionPart, ConstitutionArticle, Amendment, LandmarkCase
 * Requires: prisma db push (schema applied) and a connected DB
 */

import { PrismaClient } from "@prisma/client";
import { ARTICLES_DATA } from "../src/data/constitution/articles-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding constitutional data...");

  // ─── Parts ───────────────────────────────────────────────────────────────────
  const partsData = [
    { number: 1, name: "The Union and Its Territory", articles: "1-4" },
    { number: 2, name: "Citizenship", articles: "5-11" },
    { number: 3, name: "Fundamental Rights", articles: "12-35" },
    { number: 4, name: "Directive Principles of State Policy", articles: "36-51" },
    { number: 4.1, name: "Fundamental Duties", articles: "51A" },
    { number: 5, name: "The Union", articles: "52-151" },
    { number: 6, name: "The States", articles: "152-237" },
    { number: 8, name: "Union Territories", articles: "239-242" },
    { number: 9, name: "The Panchayats", articles: "243-243O" },
    { number: 9.1, name: "The Municipalities", articles: "243P-243ZG" },
    { number: 10, name: "The Scheduled and Tribal Areas", articles: "244-244A" },
    { number: 11, name: "Relations between the Union and the States", articles: "245-263" },
    { number: 12, name: "Finance, Property, Contracts and Suits", articles: "264-300A" },
    { number: 13, name: "Trade, Commerce and Intercourse within the Territory of India", articles: "301-307" },
    { number: 14, name: "Services under the Union and the States", articles: "308-323" },
    { number: 14.1, name: "Tribunals", articles: "323A-323B" },
    { number: 15, name: "Elections", articles: "324-329A" },
    { number: 16, name: "Special Provisions relating to certain Classes", articles: "330-342A" },
    { number: 17, name: "Official Language", articles: "343-351" },
    { number: 18, name: "Emergency Provisions", articles: "352-360" },
    { number: 19, name: "Miscellaneous", articles: "361-367" },
    { number: 20, name: "Amendment of the Constitution", articles: "368" },
    { number: 21, name: "Temporary, Transitional and Special Provisions", articles: "369-392" },
    { number: 22, name: "Short title, commencement, authoritative text in Hindi and repeals", articles: "393-395" },
  ];

  let partCount = 0;
  for (const p of partsData) {
    await prisma.constitutionPart.upsert({
      where: { number: p.number },
      update: { name: p.name, articles: p.articles },
      create: { number: p.number, name: p.name, articles: p.articles },
    });
    partCount++;
  }
  console.log(`  Upserted ${partCount} constitution parts`);

  // ─── Articles ─────────────────────────────────────────────────────────────────
  let articleCount = 0;
  for (const article of ARTICLES_DATA) {
    // Find or create the part
    const partNumber = article.partNum;
    const part = await prisma.constitutionPart.findFirst({
      where: { number: partNumber },
    });

    if (!part) {
      console.warn(`  Part ${partNumber} not found for article ${article.number}, skipping`);
      continue;
    }

    await prisma.constitutionArticle.upsert({
      where: { number: article.number },
      update: {
        title: article.title,
        text: article.text,
        explanation: article.explanation,
        category: article.category,
        relatedArticles: article.relatedArticles,
        partId: part.id,
      },
      create: {
        number: article.number,
        title: article.title,
        text: article.text,
        explanation: article.explanation,
        category: article.category,
        relatedArticles: article.relatedArticles,
        partId: part.id,
      },
    });
    articleCount++;
  }
  console.log(`  Upserted ${articleCount} constitution articles`);

  // ─── Amendments ───────────────────────────────────────────────────────────────
  const amendments = [
    {
      number: 1,
      year: 1951,
      description: "Added Ninth Schedule; allowed restrictions on FR for social good; validated land reform laws.",
      significance: "landmark",
    },
    {
      number: 7,
      year: 1956,
      description: "Reorganized states on linguistic basis; abolished A/B/C/D classes of states.",
      significance: "landmark",
    },
    {
      number: 10,
      year: 1961,
      description: "Added Dadra and Nagar Haveli as Union Territory.",
      significance: "minor",
    },
    {
      number: 12,
      year: 1962,
      description: "Added Goa, Daman, Diu, Dadra, Nagar Haveli, Pondicherry as Union Territories after liberation.",
      significance: "major",
    },
    {
      number: 24,
      year: 1971,
      description: "Affirmed Parliament's absolute power to amend any constitutional provision including Fundamental Rights.",
      significance: "landmark",
    },
    {
      number: 25,
      year: 1971,
      description: "Added Art 31C — laws implementing DPSP Art 39(b)(c) immune from challenge under Art 14 and 19.",
      significance: "major",
    },
    {
      number: 42,
      year: 1976,
      description: "The 'Mini-Constitution': added 'socialist', 'secular', 'integrity' to Preamble; Fundamental Duties (Art 51A); supremacy of DPSP over FRs; 10 more subjects to Concurrent List.",
      significance: "landmark",
    },
    {
      number: 44,
      year: 1978,
      description: "Removed right to property (Art 19(f) and Art 31) from FRs; added Art 300A; restored Presidential obligation to follow Cabinet advice.",
      significance: "landmark",
    },
    {
      number: 52,
      year: 1985,
      description: "Added Tenth Schedule — Anti-Defection Law; members defecting from party lose their seat.",
      significance: "landmark",
    },
    {
      number: 61,
      year: 1988,
      description: "Reduced voting age from 21 to 18 years for Lok Sabha and State Legislative Assemblies.",
      significance: "major",
    },
    {
      number: 73,
      year: 1992,
      description: "Added Part IX — constitutional status to Panchayati Raj; three-tier system; reservations for SC/ST/women.",
      significance: "landmark",
    },
    {
      number: 74,
      year: 1992,
      description: "Added Part IXA — constitutional status to Urban Local Bodies (Municipalities).",
      significance: "landmark",
    },
    {
      number: 86,
      year: 2002,
      description: "Added Art 21A — free and compulsory education (6-14 years) as a Fundamental Right; modified Art 45.",
      significance: "landmark",
    },
    {
      number: 91,
      year: 2003,
      description: "Capped Cabinet size at 15% of House strength; strengthened anti-defection law.",
      significance: "major",
    },
    {
      number: 97,
      year: 2011,
      description: "Added Part IXB — constitutional status to cooperative societies; right to form cooperatives added to Art 19.",
      significance: "major",
    },
    {
      number: 101,
      year: 2016,
      description: "Introduced Goods and Services Tax (GST); added Art 246A, Art 269A, Art 279A; created GST Council.",
      significance: "landmark",
    },
    {
      number: 103,
      year: 2019,
      description: "Added 10% reservation for Economically Weaker Sections (EWS) in education and public employment; added Art 15(6) and 16(6).",
      significance: "landmark",
    },
    {
      number: 104,
      year: 2020,
      description: "Extended SC/ST reservations in legislatures for 10 years; abolished Anglo-Indian nominated seats.",
      significance: "major",
    },
    {
      number: 105,
      year: 2021,
      description: "Added OBC (Other Backward Class) and EWS to States' power to maintain their own OBC lists.",
      significance: "major",
    },
    {
      number: 106,
      year: 2023,
      description: "Reserved 1/3 seats for women in Lok Sabha and State Assemblies (Nari Shakti Vandan Adhiniyam); effective after next delimitation.",
      significance: "landmark",
    },
  ];

  let amendmentCount = 0;
  for (const a of amendments) {
    await prisma.amendment.upsert({
      where: { number: a.number },
      update: { year: a.year, description: a.description, significance: a.significance },
      create: { number: a.number, year: a.year, description: a.description, significance: a.significance },
    });
    amendmentCount++;
  }
  console.log(`  Upserted ${amendmentCount} amendments`);

  // ─── Landmark Cases ──────────────────────────────────────────────────────────
  // Find a court to associate with cases
  let court = await prisma.court.findFirst({ where: { name: { contains: "Supreme" } } });
  if (!court) {
    court = await prisma.court.create({
      data: {
        name:        "Supreme Court of India",
        type:        "apex",
        established: 1950,
        jurisdiction: "All India",
        description: "The apex court of India and the highest constitutional court",
      },
    });
    console.log("  Created Supreme Court entry");
  }

  const landmarkCases = [
    {
      name: "A.K. Gopalan v. State of Madras",
      citation: "AIR 1950 SC 27",
      year: 1950,
      summary: "Held that 'procedure established by law' in Art 21 means any procedure enacted by a competent legislature, not necessarily fair or just.",
      significance: "First major constitutional case; later reversed by Maneka Gandhi (1978).",
      impact: "Established narrow interpretation of Art 21 that prevailed for 28 years.",
    },
    {
      name: "State of Madras v. Champakam Dorairajan",
      citation: "AIR 1951 SC 226",
      year: 1951,
      summary: "Struck down communal reservation in state educational institutions as violating Art 15(1). Led to First Amendment adding Art 15(4).",
      significance: "First case where SC struck down a law for violating FR; led to immediate constitutional amendment.",
      impact: "Led to First Amendment adding Art 15(4) allowing reservations in education.",
    },
    {
      name: "I.C. Golak Nath v. State of Punjab",
      citation: "AIR 1967 SC 1643",
      year: 1967,
      summary: "Held that Parliament cannot amend Fundamental Rights; applied prospective overruling.",
      significance: "First application of prospective overruling doctrine in India; triggered 24th Amendment.",
      impact: "Led to 24th Amendment asserting Parliament's power to amend FRs.",
    },
    {
      name: "Kesavananda Bharati v. State of Kerala",
      citation: "AIR 1973 SC 1461",
      year: 1973,
      summary: "Overruled Golak Nath; held Parliament can amend all provisions but cannot destroy the 'basic structure' of the Constitution.",
      significance: "The most important constitutional judgment in India; established Basic Structure Doctrine.",
      impact: "Created the Basic Structure Doctrine; limited amending power; still the controlling precedent.",
    },
    {
      name: "Indira Nehru Gandhi v. Raj Narain",
      citation: "AIR 1975 SC 2299",
      year: 1975,
      summary: "Struck down the 39th Amendment which sought to place election disputes of PM beyond judicial review.",
      significance: "Applied Basic Structure Doctrine for first time; free and fair elections held to be basic structure.",
      impact: "Led to declaration of Emergency; established that courts can review constitutional amendments.",
    },
    {
      name: "Maneka Gandhi v. Union of India",
      citation: "AIR 1978 SC 597",
      year: 1978,
      summary: "Expanded Art. 21 — procedure must be fair, just, reasonable; Art 14, 19 and 21 must be read together.",
      significance: "Transformed Indian constitutional law; introduced substantive due process; most cited Art 21 case.",
      impact: "Created the 'golden triangle' of Art 14, 19, 21; ended narrow AK Gopalan interpretation.",
    },
    {
      name: "Minerva Mills v. Union of India",
      citation: "AIR 1980 SC 1789",
      year: 1980,
      summary: "Struck down clauses of 42nd Amendment that excluded judicial review of constitutional amendments and made DPSPs absolutely paramount to FRs.",
      significance: "Reaffirmed Basic Structure; held that limited amending power and judicial review are basic structure.",
      impact: "Established that harmony between FRs and DPSPs, not absolute supremacy of either, is required.",
    },
    {
      name: "Hussainara Khatoon v. State of Bihar",
      citation: "AIR 1979 SC 1360",
      year: 1979,
      summary: "Held that speedy trial is a fundamental right under Art 21; directed release of undertrial prisoners detained for longer than their maximum sentence.",
      significance: "First major public interest litigation (PIL) in India; transformed access to justice.",
      impact: "Established speedy trial as FR; spawned PIL jurisdiction; led to criminal procedure reforms.",
    },
    {
      name: "S.P. Gupta v. Union of India (Judges Transfer Case)",
      citation: "AIR 1982 SC 149",
      year: 1981,
      summary: "Held that 'consultation' with Chief Justice in judicial appointments means the executive has primacy, not the Chief Justice.",
      significance: "First Judges Case — gave executive primacy in judicial appointments.",
      impact: "Led to Second Judges Case (1993) which reversed this and established collegium.",
    },
    {
      name: "Supreme Court Advocates-on-Record Association v. Union of India (Second Judges Case)",
      citation: "AIR 1994 SC 268",
      year: 1993,
      summary: "Overruled First Judges Case; held 'consultation' means 'concurrence'; established collegium system for judicial appointments.",
      significance: "Established collegium system; made Chief Justice of India and senior judges primary in appointments.",
      impact: "CJI's opinion is binding on executive in judicial appointments; collegium still operates today.",
    },
    {
      name: "S.R. Bommai v. Union of India",
      citation: "AIR 1994 SC 1918",
      year: 1994,
      summary: "Art 356 (President's Rule) is subject to judicial review; floor test must be held before dissolution; secularism is basic structure.",
      significance: "Most important federalism case; restricted political misuse of Art 356.",
      impact: "Governor cannot dismiss CM without floor test; courts review satisfaction under Art 356.",
    },
    {
      name: "Indra Sawhney v. Union of India (Mandal Case)",
      citation: "AIR 1993 SC 477",
      year: 1992,
      summary: "Upheld 27% OBC reservation; held that reservations cannot exceed 50%; 'creamy layer' of OBCs excluded; no reservation in promotions.",
      significance: "Settled OBC reservation controversy; established 50% ceiling; excluded creamy layer.",
      impact: "50% cap on total reservations (still debated); creamy layer exclusion for OBCs.",
    },
    {
      name: "Vishaka v. State of Rajasthan",
      citation: "AIR 1997 SC 3011",
      year: 1997,
      summary: "In absence of law on workplace sexual harassment, SC used Art 141 and 142 to issue binding guidelines (Vishaka Guidelines).",
      significance: "Landmark use of SC's power to legislate through guidelines; led to POSH Act 2013.",
      impact: "Vishaka Guidelines operated as law for 16 years until Sexual Harassment of Women at Workplace Act, 2013.",
    },
    {
      name: "T.M.A. Pai Foundation v. State of Karnataka",
      citation: "(2002) 8 SCC 481",
      year: 2002,
      summary: "Held that right to establish educational institutions is part of Art 19(1)(g); minority institutions have greater autonomy.",
      significance: "Defined rights of minority vs non-minority educational institutions.",
      impact: "Set framework for regulatory control over private educational institutions.",
    },
    {
      name: "I.R. Coelho v. State of Tamil Nadu (Ninth Schedule Case)",
      citation: "(2007) 2 SCC 1",
      year: 2007,
      summary: "Laws in the Ninth Schedule (immune from FR challenge) can be tested against the basic structure; immunity only for laws put in before April 24, 1973.",
      significance: "Applied Basic Structure Doctrine to Ninth Schedule; removed absolute immunity of scheduled laws.",
      impact: "Laws placed in Ninth Schedule after 1973 can be struck down if they violate basic structure/FRs.",
    },
    {
      name: "K.S. Puttaswamy v. Union of India (Privacy Case)",
      citation: "(2017) 10 SCC 1",
      year: 2017,
      summary: "9-judge unanimous judgment: privacy is a fundamental right under Art 21; overruled M.P. Sharma (1954) and Kharak Singh (1963); introduced proportionality test.",
      significance: "Most comprehensive rights judgment in decades; established privacy as core FR.",
      impact: "Foundation for data protection law; affected Aadhaar, surveillance, personal data; proportionality now standard.",
    },
    {
      name: "Navtej Singh Johar v. Union of India",
      citation: "(2018) 10 SCC 1",
      year: 2018,
      summary: "Struck down Section 377 IPC criminalizing consensual same-sex relations between adults; applied transformative constitutionalism.",
      significance: "Overruled Suresh Kumar Koushal (2013); recognized LGBTQ+ rights under Art 14, 15, 19, 21.",
      impact: "Decriminalized consensual homosexuality; expanded non-discrimination under Art 15.",
    },
    {
      name: "Joseph Shine v. Union of India",
      citation: "(2019) 3 SCC 39",
      year: 2018,
      summary: "Struck down Section 497 IPC (adultery law) as unconstitutional for treating women as property.",
      significance: "Decriminalized adultery; recognized women's autonomy and dignity under Art 14 and 21.",
      impact: "Adultery no longer a criminal offence; divorce proceedings can still consider it.",
    },
    {
      name: "Property Owners Association v. State of Maharashtra",
      citation: "(2024) [RESERVED]",
      year: 2024,
      summary: "9-judge bench revisited Art 39(b) — whether 'material resources of the community' includes private property; overruled broad interpretation of State of Karnataka v. Ranganatha Reddy.",
      significance: "Clarified limits of Art 39(b) — not all private property is 'community resources' for redistribution.",
      impact: "Limited scope of Art 39(b) — cannot nationalize all private property in name of DPSP.",
    },
  ];

  let caseCount = 0;
  for (const c of landmarkCases) {
    const existing = await prisma.landmarkCase.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.landmarkCase.create({
        data: {
          name: c.name,
          citation: c.citation,
          year: c.year,
          courtId: court.id,
          summary: c.summary,
          significance: c.significance,
          impact: c.impact,
        },
      });
      caseCount++;
    } else {
      await prisma.landmarkCase.update({
        where: { id: existing.id },
        data: {
          citation: c.citation,
          year: c.year,
          summary: c.summary,
          significance: c.significance,
          impact: c.impact,
        },
      });
    }
  }
  console.log(`  Upserted ${caseCount} new landmark cases`);

  console.log("\nConstitutional data seeded successfully!");
  console.log("Run `npx tsx prisma/seed-constitution.ts` to reseed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
