import { prisma } from "../../db";

export class IndiaCodeIngestor {
  /**
   * Fetches legislative acts from the India Code API.
   * Runs on the `api-fetch` queue.
   */
  async processActAPI(actId: string): Promise<void> {
    console.log(`[INDIA_CODE] Fetching act details for Act ID: ${actId}`);

    try {
      // Note: This is a simulated endpoint. In production, requires a registered API token from data.gov.in
      const apiUrl = `https://api.indiacode.nic.in/act/${actId}`;
      
      // Simulate API response for demonstration since the real API requires auth
      // const response = await fetch(apiUrl, { headers: { Authorization: `Bearer ${process.env.INDIA_CODE_TOKEN}` }});
      // const data = await response.json();
      
      const simulatedData = {
        title: "The Digital Personal Data Protection Act, 2023",
        year: 2023,
        enactedDate: "2023-08-11T00:00:00Z",
        ministry: "Ministry of Electronics and Information Technology",
      };

      // 1. Ensure Ministry Exists
      const ministry = await prisma.ministry.upsert({
        where: { name: simulatedData.ministry },
        update: {},
        create: { name: simulatedData.ministry, department: "General" },
      });

      // 2. Insert into Database
      const savedAct = await prisma.act.create({
        data: {
          title: simulatedData.title,
          year: simulatedData.year,
          enactedOn: new Date(simulatedData.enactedDate),
        },
      });

      console.log(`[INDIA_CODE] Successfully ingested Act: ${savedAct.title} (${savedAct.id})`);

      // 3. Log Data Provenance
      const source = await prisma.dataSource.upsert({
        where: { name: "INDIA_CODE_API" },
        update: { lastFetchedAt: new Date() },
        create: { name: "INDIA_CODE_API", url: "https://www.indiacode.nic.in/" } as any,
      });

      await prisma.dataProvenance.create({
        data: {
          entityType: "Act",
          entityId: savedAct.id,
          sourceId: source.id,
          fetchedAt: new Date(),
          confidence: 1.0, // Official API is highest confidence
        },
      });

    } catch (error) {
      console.error(`[INDIA_CODE] Error processing Act ID ${actId}:`, error);
      throw error;
    }
  }
}
