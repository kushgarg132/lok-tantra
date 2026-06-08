/**
 * Neo4j graph database seeder.
 * Reads from Prisma and materialises nodes + relationships in Neo4j.
 *
 * Usage:
 *   npm run seed:neo4j            # upsert (safe to re-run)
 *   npm run seed:neo4j -- --reset # wipe all graph data first
 *
 * Nodes:   Institution · Position · Person · Party · Court · Case · Article · Ministry
 * Edges:   REPORTS_TO · PART_OF · BELONGS_TO · ALLIED_WITH · APPOINTS · REMOVES ·
 *           HOLDS_POSITION · INTERPRETS · ADMINISTRATIVE_CONTROL_OVER · GOVERNS
 */

import { config } from "dotenv"; config({ path: ".env.local" }); config();
import neo4j, { type Driver } from "neo4j-driver";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const RESET  = process.argv.includes("--reset");

const uri      = process.env.NEO4J_URI      || "bolt://localhost:7687";
const user     = process.env.NEO4J_USER     || "neo4j";
const password = process.env.NEO4J_PASSWORD || "password";

async function run(driver: Driver, cypher: string, params: Record<string, unknown> = {}) {
  const session = driver.session({ defaultAccessMode: neo4j.session.WRITE });
  try {
    await session.run(cypher, params);
  } finally {
    await session.close();
  }
}

async function main() {
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  try {
    await driver.getServerInfo();
    console.log("[Neo4j] Connected.");
  } catch (err) {
    console.error("[Neo4j] Cannot connect:", err);
    process.exit(1);
  }

  if (RESET) {
    console.log("[Neo4j] --reset: deleting all nodes and relationships...");
    await run(driver, "MATCH (n) DETACH DELETE n");
  }

  // ── Constraints & Indices ──────────────────────────────────────────────────
  console.log("[Neo4j] Creating constraints...");
  const constraints = [
    "CREATE CONSTRAINT institution_id IF NOT EXISTS FOR (i:Institution) REQUIRE i.id IS UNIQUE",
    "CREATE CONSTRAINT person_id      IF NOT EXISTS FOR (p:Person)      REQUIRE p.id IS UNIQUE",
    "CREATE CONSTRAINT party_id       IF NOT EXISTS FOR (p:Party)       REQUIRE p.id IS UNIQUE",
    "CREATE CONSTRAINT court_id       IF NOT EXISTS FOR (c:Court)       REQUIRE c.id IS UNIQUE",
    "CREATE CONSTRAINT case_id        IF NOT EXISTS FOR (c:Case)        REQUIRE c.id IS UNIQUE",
    "CREATE CONSTRAINT article_id     IF NOT EXISTS FOR (a:Article)     REQUIRE a.id IS UNIQUE",
    "CREATE CONSTRAINT ministry_id    IF NOT EXISTS FOR (m:Ministry)    REQUIRE m.id IS UNIQUE",
  ];
  for (const c of constraints) {
    try { await run(driver, c); } catch { /* already exists */ }
  }

  // ── 1. Institution nodes ───────────────────────────────────────────────────
  console.log("[Neo4j] Seeding Institution nodes...");
  const institutions = await prisma.institution.findMany({
    select: { id: true, slug: true, name: true, type: true, branch: true, level: true,
              description: true, constitutionalBasis: true, powers: true,
              appointedBy: true, removableBy: true, reportsTo: true, parentId: true },
  });

  for (const inst of institutions) {
    await run(driver, `
      MERGE (i:Institution {id: $id})
      SET i.slug              = $slug,
          i.name              = $name,
          i.type              = $type,
          i.branch            = $branch,
          i.level             = $level,
          i.description       = $description,
          i.constitutionalBasis = $basis,
          i.appointedBy       = $appointedBy,
          i.removableBy       = $removableBy
    `, {
      id:          inst.id,
      slug:        inst.slug,
      name:        inst.name,
      type:        inst.type ?? "",
      branch:      inst.branch ?? "",
      level:       inst.level ?? "",
      description: inst.description ?? "",
      basis:       inst.constitutionalBasis ?? "",
      appointedBy: inst.appointedBy ?? "",
      removableBy: inst.removableBy ?? "",
    });
  }

  // Institution REPORTS_TO / PART_OF relationships
  console.log("[Neo4j] Seeding Institution hierarchy edges...");
  for (const inst of institutions) {
    if (!inst.parentId) continue;
    const parent = institutions.find(i => i.id === inst.parentId);
    if (!parent) continue;

    const rel = inst.branch === "judiciary" ? "PART_OF" : "REPORTS_TO";
    await run(driver, `
      MATCH (child:Institution  {id: $childId})
      MATCH (parent:Institution {id: $parentId})
      MERGE (child)-[:${rel}]->(parent)
    `, { childId: inst.id, parentId: inst.parentId });
  }

  // ── 2. Political Party nodes ───────────────────────────────────────────────
  console.log("[Neo4j] Seeding Party nodes...");
  const parties = await prisma.politicalParty.findMany({
    select: { id: true, name: true, abbreviation: true, founded: true,
              ideology: true, alliances: true, currentSeats: true, color: true, type: true },
  });

  for (const p of parties) {
    const seats = (p.currentSeats as Record<string, number> | null) ?? {};
    await run(driver, `
      MERGE (p:Party {id: $id})
      SET p.name         = $name,
          p.abbreviation = $abbr,
          p.founded      = $founded,
          p.ideology     = $ideology,
          p.color        = $color,
          p.type         = $type,
          p.lsSeats      = $lsSeats,
          p.rsSeats      = $rsSeats
    `, {
      id:       p.id,
      name:     p.name,
      abbr:     p.abbreviation ?? "",
      founded:  p.founded ?? 0,
      ideology: (p.ideology as string[]).join(", "),
      color:    p.color ?? "",
      type:     p.type ?? "",
      lsSeats:  seats.ls ?? 0,
      rsSeats:  seats.rs ?? 0,
    });
  }

  // Party ALLIED_WITH relationships (NDA / INDIA bloc)
  console.log("[Neo4j] Seeding Party alliance edges...");
  const allianceGroups: Record<string, string[]> = {};
  for (const p of parties) {
    for (const alliance of (p.alliances as string[])) {
      if (!allianceGroups[alliance]) allianceGroups[alliance] = [];
      allianceGroups[alliance].push(p.id);
    }
  }

  for (const [allianceName, memberIds] of Object.entries(allianceGroups)) {
    for (let a = 0; a < memberIds.length; a++) {
      for (let b = a + 1; b < memberIds.length; b++) {
        await run(driver, `
          MATCH (p1:Party {id: $id1}), (p2:Party {id: $id2})
          MERGE (p1)-[:ALLIED_WITH {alliance: $alliance}]-(p2)
        `, { id1: memberIds[a], id2: memberIds[b], alliance: allianceName });
      }
    }
  }

  // ── 3. Person nodes ────────────────────────────────────────────────────────
  console.log("[Neo4j] Seeding Person nodes...");
  const persons = await prisma.person.findMany({
    select: { id: true, name: true, designation: true, gender: true, state: true,
              stateCode: true, chamber: true, constituency: true, level: true,
              partyId: true },
  });

  for (const p of persons) {
    await run(driver, `
      MERGE (p:Person {id: $id})
      SET p.name         = $name,
          p.designation  = $designation,
          p.gender       = $gender,
          p.state        = $state,
          p.stateCode    = $stateCode,
          p.chamber      = $chamber,
          p.constituency = $constituency,
          p.level        = $level
    `, {
      id:           p.id,
      name:         p.name,
      designation:  p.designation  ?? "",
      gender:       p.gender        ?? "",
      state:        p.state         ?? "",
      stateCode:    p.stateCode     ?? "",
      chamber:      p.chamber       ?? "",
      constituency: p.constituency  ?? "",
      level:        p.level         ?? "",
    });
  }

  // Person BELONGS_TO Party
  console.log("[Neo4j] Seeding Person→Party edges...");
  for (const p of persons) {
    if (!p.partyId) continue;
    await run(driver, `
      MATCH (p:Person {id: $personId}), (party:Party {id: $partyId})
      MERGE (p)-[:BELONGS_TO]->(party)
    `, { personId: p.id, partyId: p.partyId });
  }

  // Person HOLDS_POSITION at Institution (by designation keyword match)
  console.log("[Neo4j] Seeding Person→Institution position edges...");
  const positionMap: Array<{ keywords: string[]; instSlug: string }> = [
    { keywords: ["president"],         instSlug: "president" },
    { keywords: ["vice president"],    instSlug: "vice-president" },
    { keywords: ["prime minister"],    instSlug: "pm" },
    { keywords: ["chief justice"],     instSlug: "supreme-court" },
    { keywords: ["speaker"],           instSlug: "lok-sabha" },
    { keywords: ["election commissioner"], instSlug: "eci" },
    { keywords: ["chief minister"],    instSlug: "chief-minister" },
    { keywords: ["minister"],          instSlug: "council-of-ministers" },
    { keywords: ["member of parliament", " mp"],  instSlug: "lok-sabha" },
  ];

  for (const p of persons) {
    const desig = (p.designation ?? "").toLowerCase();
    for (const { keywords, instSlug } of positionMap) {
      if (keywords.some(k => desig.includes(k))) {
        const inst = institutions.find(i => i.slug === instSlug);
        if (!inst) continue;
        await run(driver, `
          MATCH (p:Person {id: $personId}), (i:Institution {id: $instId})
          MERGE (p)-[:HOLDS_POSITION]->(i)
        `, { personId: p.id, instId: inst.id });
        break;
      }
    }
  }

  // ── 4. Constitutional APPOINTS edges ──────────────────────────────────────
  console.log("[Neo4j] Seeding constitutional appointment edges...");
  const appointmentEdges: Array<{ appointerSlug: string; appointeeSlug: string; basis: string }> = [
    { appointerSlug: "president",    appointeeSlug: "pm",                  basis: "Art. 75(1)" },
    { appointerSlug: "president",    appointeeSlug: "governor",            basis: "Art. 155" },
    { appointerSlug: "president",    appointeeSlug: "attorney-general",    basis: "Art. 76" },
    { appointerSlug: "president",    appointeeSlug: "cag",                 basis: "Art. 148" },
    { appointerSlug: "president",    appointeeSlug: "upsc",                basis: "Art. 316" },
    { appointerSlug: "president",    appointeeSlug: "eci",                 basis: "Art. 324" },
    { appointerSlug: "president",    appointeeSlug: "supreme-court",       basis: "Art. 124" },
    { appointerSlug: "pm",           appointeeSlug: "council-of-ministers", basis: "Art. 75" },
    { appointerSlug: "pm",           appointeeSlug: "cabinet-secretary",   basis: "Conventionl" },
    { appointerSlug: "governor",     appointeeSlug: "chief-minister",      basis: "Art. 164" },
    { appointerSlug: "parliament",   appointeeSlug: "cag",                 basis: "Art. 148" },
    { appointerSlug: "supreme-court", appointeeSlug: "high-courts",        basis: "Art. 217" },
  ];

  for (const { appointerSlug, appointeeSlug, basis } of appointmentEdges) {
    const appointer = institutions.find(i => i.slug === appointerSlug);
    const appointee = institutions.find(i => i.slug === appointeeSlug);
    if (!appointer || !appointee) continue;
    await run(driver, `
      MATCH (a:Institution {id: $appointerId}), (b:Institution {id: $appointeeId})
      MERGE (a)-[:APPOINTS {basis: $basis}]->(b)
    `, { appointerId: appointer.id, appointeeId: appointee.id, basis });
  }

  // ── 5. Court nodes ─────────────────────────────────────────────────────────
  console.log("[Neo4j] Seeding Court nodes...");
  const courts = await prisma.court.findMany({
    select: { id: true, name: true, type: true, jurisdiction: true, basis: true },
  });

  for (const c of courts) {
    await run(driver, `
      MERGE (c:Court {id: $id})
      SET c.name         = $name,
          c.type         = $type,
          c.jurisdiction = $jurisdiction,
          c.basis        = $basis
    `, {
      id:           c.id,
      name:         c.name,
      type:         c.type ?? "",
      jurisdiction: c.jurisdiction ?? "",
      basis:        c.basis ?? "",
    });
  }

  // ── 6. Constitutional Article nodes ───────────────────────────────────────
  console.log("[Neo4j] Seeding Article nodes...");
  const articles = await prisma.constitutionArticle.findMany({
    select: { id: true, number: true, title: true, category: true },
    take: 500,
  });

  for (const a of articles) {
    await run(driver, `
      MERGE (a:Article {id: $id})
      SET a.number   = $number,
          a.title    = $title,
          a.category = $category
    `, { id: a.id, number: a.number, title: a.title, category: a.category ?? "" });
  }

  // ── 7. Landmark Case nodes + INTERPRETS edges ──────────────────────────────
  console.log("[Neo4j] Seeding Case nodes and INTERPRETS edges...");
  const cases = await prisma.landmarkCase.findMany({
    select: { id: true, name: true, citation: true, year: true,
              significance: true, articlesInterpreted: { select: { id: true, number: true } } },
  });

  for (const c of cases) {
    await run(driver, `
      MERGE (c:Case {id: $id})
      SET c.name         = $name,
          c.citation     = $citation,
          c.year         = $year,
          c.significance = $significance
    `, {
      id:           c.id,
      name:         c.name,
      citation:     c.citation ?? "",
      year:         c.year ?? 0,
      significance: c.significance ?? "",
    });

    for (const art of c.articlesInterpreted) {
      await run(driver, `
        MATCH (c:Case    {id: $caseId})
        MATCH (a:Article {id: $artId})
        MERGE (c)-[:INTERPRETS]->(a)
      `, { caseId: c.id, artId: art.id });
    }
  }

  // ── 8. Ministry nodes + ADMINISTRATIVE_CONTROL_OVER edges ─────────────────
  console.log("[Neo4j] Seeding Ministry nodes...");
  const ministries = await prisma.ministry.findMany({
    select: { id: true, name: true, department: true,
              departments: { select: { id: true, name: true } } },
  });

  const pmInst = institutions.find(i => i.slug === "pm");
  for (const m of ministries) {
    await run(driver, `
      MERGE (m:Ministry {id: $id})
      SET m.name       = $name,
          m.department = $dept
    `, { id: m.id, name: m.name, dept: m.department ?? "" });

    if (pmInst) {
      await run(driver, `
        MATCH (pm:Institution {id: $pmId}), (m:Ministry {id: $mId})
        MERGE (pm)-[:ADMINISTRATIVE_CONTROL_OVER]->(m)
      `, { pmId: pmInst.id, mId: m.id });
    }

    for (const dept of m.departments) {
      await run(driver, `
        MERGE (d:Department {id: $id})
        SET d.name = $name
        WITH d
        MATCH (m:Ministry {id: $mId})
        MERGE (m)-[:ADMINISTRATIVE_CONTROL_OVER]->(d)
      `, { id: dept.id, name: dept.name, mId: m.id });
    }
  }

  // ── 9. Summary ─────────────────────────────────────────────────────────────
  const session = driver.session({ defaultAccessMode: neo4j.session.READ });
  try {
    const result = await session.run(`
      MATCH (n) WITH labels(n)[0] AS label, count(n) AS cnt
      RETURN label, cnt ORDER BY cnt DESC
    `);
    console.log("\n── Neo4j Graph Summary ───────────────────────────");
    for (const row of result.records) {
      const label = row.get("label") as string;
      const cnt   = row.get("cnt") as { toNumber(): number; low: number; high: number };
      console.log(`  ${label.padEnd(16)}: ${cnt.toNumber()} nodes`);
    }

    const relResult = await session.run(`
      MATCH ()-[r]->() WITH type(r) AS rel, count(r) AS cnt
      RETURN rel, cnt ORDER BY cnt DESC
    `);
    console.log("──");
    for (const row of relResult.records) {
      const rel = row.get("rel") as string;
      const cnt = row.get("cnt") as { toNumber(): number; low: number; high: number };
      console.log(`  ${rel.padEnd(30)}: ${cnt.toNumber()} edges`);
    }
    console.log("─────────────────────────────────────────────────\n");
  } finally {
    await session.close();
  }

  await driver.close();
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
