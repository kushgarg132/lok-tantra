import * as cheerio from "cheerio";
import { NormalizationEngine } from "../normalization";
import { prisma } from "../../db";

export class PRSIngestor {
  /**
   * Main entry point for scraping a PRS MP track record page.
   */
  async processMPPerformance(url: string): Promise<void> {
    console.log(`[PRS] Fetching MP track record from: ${url}`);
    
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Example parsing logic for a typical PRS MP page
      const rawName = $("h1.mp-name").text().trim();
      const stateAndConstituency = $(".mp-constituency").text().trim(); // e.g. "Uttar Pradesh - Varanasi"
      
      const [stateName, constituency] = stateAndConstituency.split("-").map(s => s.trim());

      // Parse Performance Stats
      const attendance = parseFloat($(".stat-attendance .value").text().replace("%", ""));
      const debatesParticipated = parseInt($(".stat-debates .value").text(), 10);
      const questionsAsked = parseInt($(".stat-questions .value").text(), 10);
      const billsIntroduced = parseInt($(".stat-bills .value").text(), 10);

      const cleanName = NormalizationEngine.cleanName(rawName);

      // Resolve the MP
      const personId = await NormalizationEngine.resolvePoliticianId(cleanName, undefined, constituency);

      if (personId) {
        // Fetch existing profile to merge
        const existingPerson = await prisma.person.findUnique({ where: { id: personId } });
        const existingProfile = (existingPerson?.profile as any) || {};

        const updatedProfile = {
          ...existingProfile,
          attendance: attendance || existingProfile.attendance,
          debatesParticipated: debatesParticipated || existingProfile.debatesParticipated,
          questionsAsked: questionsAsked || existingProfile.questionsAsked,
          billsIntroduced: billsIntroduced || existingProfile.billsIntroduced,
        };

        await prisma.person.update({
          where: { id: personId },
          data: { profile: updatedProfile },
        });

        console.log(`[PRS] Updated MP performance for: ${cleanName}`);

        // Data Provenance
        const source = await prisma.dataSource.upsert({
          where: { name: "PRS_INDIA" },
          update: { lastFetchedAt: new Date() },
          create: { name: "PRS_INDIA", url: "https://prsindia.org" } as any,
        });

        await prisma.dataProvenance.create({
          data: {
            entityType: "Person",
            entityId: personId,
            sourceId: source.id,
            fetchedAt: new Date(),
            confidence: 0.95, // PRS is highly reliable
          },
        });
      } else {
        console.warn(`[PRS] MP not found in database: ${cleanName}. Could not apply performance stats.`);
      }

    } catch (error) {
      console.error(`[PRS] Failed to process ${url}`, error);
      throw error;
    }
  }
}
