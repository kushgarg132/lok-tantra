import * as cheerio from "cheerio";
import { NormalizationEngine } from "../normalization";
import { prisma } from "../../db";

export class ECIIngestor {
  private baseUrl = "https://results.eci.gov.in";

  /**
   * Main entry point for scraping an ECI constituency results page.
   */
  async processConstituencyResults(url: string, electionYear: parseInt, electionType: string): Promise<void> {
    console.log(`[ECI] Fetching results from: ${url}`);
    
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Example parsing logic for a typical ECI results table
      const stateName = $("h2 span.state-name").text().trim();
      const constituencyName = $("h2 span.constituency-name").text().trim();

      // Ensure the State and Constituency exist
      const state = await prisma.stateUT.upsert({
        where: { name: stateName },
        update: {},
        create: { name: stateName, code: stateName.substring(0, 2).toUpperCase(), type: "STATE", capital: "", lsSeats: 0, rsSeats: 0, assemblySeats: 0 },
      });

      const constituency = await prisma.constituency.upsert({
        where: { name_stateCode_type: { name: constituencyName, stateCode: state.code, type: electionType } },
        update: {},
        create: { name: constituencyName, stateCode: state.code, type: electionType },
      });

      const election = await prisma.election.upsert({
        where: { year_type: { year: electionYear, type: electionType } },
        update: {},
        create: { year: electionYear, type: electionType, totalSeats: 543 },
      });

      // Parse candidates table
      const candidates: any[] = [];
      $("table.results-table tbody tr").each((i, row) => {
        const name = $(row).find("td:nth-child(2)").text().trim();
        const party = $(row).find("td:nth-child(3)").text().trim();
        const votes = parseInt($(row).find("td:nth-child(6)").text().replace(/,/g, "") || "0", 10);
        
        candidates.push({ name, party, votes });
      });

      if (candidates.length === 0) return;

      // Sort by votes to determine winner
      candidates.sort((a, b) => b.votes - a.votes);

      // Pre-resolve all person IDs outside the transaction (network calls can't run inside)
      const resolvedPersonIds: (string | null)[] = await Promise.all(
        candidates.map((c) =>
          NormalizationEngine.resolvePoliticianId(NormalizationEngine.cleanName(c.name), state.code, constituency.name),
        ),
      );

      // All candidate writes in a single atomic transaction — partial-ingest safe on failure
      await prisma.$transaction(async (tx) => {
        for (let i = 0; i < candidates.length; i++) {
          const cand = candidates[i];
          const cleanName = NormalizationEngine.cleanName(cand.name);
          const isWinner = i === 0;

          let personId = resolvedPersonIds[i];
          if (!personId) {
            const newPerson = await tx.person.create({
              data: { name: cleanName, stateCode: state.code, constituency: constituency.name },
            });
            personId = newPerson.id;
          }

          const partyRecord = await tx.politicalParty.upsert({
            where: { name: cand.party },
            update: {},
            create: { name: cand.party, abbreviation: cand.party.substring(0, 4).toUpperCase(), color: "#ccc", type: "UNKNOWN" },
          });

          await tx.electionCandidate.create({
            data: {
              electionId: election.id,
              constituencyId: constituency.id,
              personId,
              partyId: partyRecord.id,
              votes: cand.votes,
              isWinner,
            },
          });
        }
      });

      console.log(`[ECI] Successfully processed constituency: ${constituencyName}`);

    } catch (error) {
      console.error(`[ECI] Failed to process ${url}`, error);
      throw error;
    }
  }
}
