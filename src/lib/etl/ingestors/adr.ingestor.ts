import * as cheerio from "cheerio";
import { NormalizationEngine, NormalizedPolitician } from "../normalization";
import { prisma } from "../../db";

export class ADRIngestor {
  private baseUrl = "https://myneta.info";

  /**
   * Main entry point for the ADR scraping job.
   */
  async processCandidatePage(url: string): Promise<void> {
    console.log(`[ADR] Fetching candidate data from: ${url}`);
    
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract basic candidate info (These selectors are representative of myneta.info structure)
      const rawName = $("h2.main-title").text().trim();
      const party = $(".party-name").text().trim();
      const constituency = $(".constituency-name").text().trim();

      // Extract financial data
      const assetsText = $("div:contains('Total Assets')").next("div").text().replace(/,/g, "");
      const liabilitiesText = $("div:contains('Liabilities')").next("div").text().replace(/,/g, "");
      
      // Extract criminal cases count
      const criminalCasesText = $("span:contains('Criminal Cases')").text();
      const criminalCasesCount = parseInt(criminalCasesText.match(/\d+/)?.[0] || "0", 10);

      // Normalize the parsed data
      const cleanName = NormalizationEngine.cleanName(rawName);
      
      const normalizedData: NormalizedPolitician = {
        name: cleanName,
        partyAbbreviation: party,
        constituency,
        assets: {
          totalAssets: parseFloat(assetsText) || 0,
          liabilities: parseFloat(liabilitiesText) || 0,
        },
        criminalCasesCount,
        sourceUrl: url,
      };

      await this.saveToDatabase(normalizedData);
    } catch (error) {
      console.error(`[ADR] Failed to process ${url}`, error);
      throw error; // Let BullMQ handle the retry
    }
  }

  private async saveToDatabase(data: NormalizedPolitician) {
    // Resolve person ID before entering the transaction (network-dependent normalization)
    const existingId = await NormalizationEngine.resolvePoliticianId(data.name, undefined, data.constituency);

    // Upsert DataSource outside the transaction so it exists before provenance is linked
    const source = await prisma.dataSource.upsert({
      where:  { name: "ADR_MYNETA" },
      update: { lastFetchedAt: new Date(), status: "active" },
      create: { name: "ADR_MYNETA", url: this.baseUrl, fetchedAt: new Date() } as any,
    });

    // All DB writes in one atomic transaction — partial-ingest safe on failure
    await prisma.$transaction(async (tx) => {
      const assetData = {
        assets:        data.assets,
        criminalCases: data.criminalCasesCount > 0
          ? [{ count: data.criminalCasesCount, source: data.sourceUrl }]
          : [],
      };

      let personId: string;
      if (existingId) {
        await tx.person.update({ where: { id: existingId }, data: assetData });
        personId = existingId;
        console.log(`[ADR] Updated existing politician: ${data.name} (${existingId})`);
      } else {
        const newPerson = await tx.person.create({
          data: { name: data.name, constituency: data.constituency, ...assetData },
        });
        personId = newPerson.id;
        console.log(`[ADR] Created new politician: ${data.name} (${newPerson.id})`);
      }

      await tx.dataProvenance.create({
        data: {
          entityType: "Person",
          entityId:   personId,
          sourceId:   source.id,
          fetchedAt:  new Date(),
          confidence: 0.9,
        },
      });
    });
  }
}
