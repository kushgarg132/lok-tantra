import { prisma } from "../../db";
import { apiFetchQueue } from "./queue";

export class ReconciliationService {
  /**
   * Scans the database for stale records and triggers re-ingestion.
   */
  static async detectStaleData(): Promise<void> {
    console.log("🔍 [RECONCILIATION] Starting stale data detection...");

    // Find any provenance record older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const staleRecords = await prisma.dataProvenance.findMany({
      where: {
        fetchedAt: { lt: thirtyDaysAgo },
        verificationStatus: { not: "REJECTED" }, // Don't refetch known bad data
      },
      include: { source: true },
      take: 1000, // Process in batches
    });

    console.log(`🔍 [RECONCILIATION] Found ${staleRecords.length} stale records.`);

    // Map the stale records back to the appropriate queue
    for (const record of staleRecords) {
      if (record.source.name === "PRS_INDIA") {
        await apiFetchQueue.add("prs-mp-track", { url: record.source.url });
      } else if (record.source.name === "ADR_MYNETA") {
        // Fallback or map specific scraping queues
      }
      
      // Update status to pending so it doesn't get picked up again immediately
      await prisma.dataProvenance.update({
        where: { id: record.id },
        data: { verificationStatus: "PENDING" },
      });
    }
  }

  /**
   * Called by ingestors when a politician changes parties or roles.
   * Handles Event Sourcing by closing the previous temporal record.
   */
  static async handleRoleOrPartyChange(
    personId: string, 
    newPartyId: string, 
    effectiveDate: Date
  ): Promise<void> {
    
    // 1. Find the currently active party history
    const activeHistory = await prisma.personPartyHistory.findFirst({
      where: {
        personId,
        validTo: null, // Null means currently active
      },
      orderBy: { validFrom: "desc" }
    });

    if (activeHistory) {
      if (activeHistory.partyId === newPartyId) {
        // No change detected
        return;
      }

      console.log(`[RECONCILIATION] Party defection detected for Person ${personId}! Closing old record.`);
      
      // Close the old record
      await prisma.personPartyHistory.update({
        where: { id: activeHistory.id },
        data: { validTo: effectiveDate },
      });
    }

    // 2. Insert the new historical snapshot
    await prisma.personPartyHistory.create({
      data: {
        personId,
        partyId: newPartyId,
        validFrom: effectiveDate,
        validTo: null,
      },
    });

    // 3. Log the Entity Event for the timeline/audit log
    await prisma.entityEvent.create({
      data: {
        entityType: "Person",
        entityId: personId,
        eventType: "PARTY_CHANGE",
        payload: { oldPartyId: activeHistory?.partyId, newPartyId },
        source: "ReconciliationPipeline",
      }
    });
  }
}
