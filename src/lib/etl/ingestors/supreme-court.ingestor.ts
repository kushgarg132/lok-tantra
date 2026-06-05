import pdfParse from "pdf-parse";
import { prisma } from "../../db";

export class SupremeCourtIngestor {
  /**
   * Downloads a Supreme Court judgment PDF and extracts its text.
   * This is CPU intensive and runs on the `pdf-ocr` queue.
   */
  async processJudgmentPDF(pdfUrl: string, caseName: string, year: number, citation?: string): Promise<void> {
    console.log(`[SUPREME_COURT] Downloading judgment from: ${pdfUrl}`);

    try {
      // 1. Download PDF to memory
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 2. Extract Text via pdf-parse
      console.log(`[SUPREME_COURT] Parsing PDF buffer (${buffer.length} bytes)...`);
      const pdfData = await pdfParse(buffer);
      const extractedText = pdfData.text;

      // 3. Simple regex-based summarization (in production, we'd pipe this to an AI summarizer)
      // For now, we take the first 500 characters of the judgment body as a rough summary.
      const cleanedText = extractedText.replace(/\s+/g, " ").trim();
      const roughSummary = cleanedText.substring(0, 500) + "...";

      // 4. Upsert into database
      // Ensure the Supreme Court exists
      const court = await prisma.court.upsert({
        where: { name: "Supreme Court of India" },
        update: {},
        create: {
          name: "Supreme Court of India",
          type: "SUPREME",
          jurisdiction: "India",
          established: 1950,
          description: "The highest judicial forum and final court of appeal under the Constitution of India.",
        },
      });

      // Save the Landmark Case
      const savedCase = await prisma.landmarkCase.create({
        data: {
          name: caseName,
          citation,
          year,
          courtId: court.id,
          summary: roughSummary,
          significance: "Extracted via Automated Pipeline",
          impact: "Pending Legal Review",
        },
      });

      console.log(`[SUPREME_COURT] Successfully ingested judgment: ${caseName} (${savedCase.id})`);

      // 5. Log Data Provenance
      const source = await prisma.dataSource.upsert({
        where: { name: "SCI_PORTAL" },
        update: { lastFetchedAt: new Date() },
        create: { name: "SCI_PORTAL", url: "https://main.sci.gov.in" } as any,
      });

      await prisma.dataProvenance.create({
        data: {
          entityType: "LandmarkCase",
          entityId: savedCase.id,
          sourceId: source.id,
          fetchedAt: new Date(),
          confidence: 0.85, // OCR/PDF parsing has margin of error
        },
      });

    } catch (error) {
      console.error(`[SUPREME_COURT] Error processing PDF ${pdfUrl}:`, error);
      throw error;
    }
  }
}
