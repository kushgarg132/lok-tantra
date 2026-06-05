import { apiFetchQueue, scrapeHtmlQueue, pdfOcrQueue } from "../lib/etl/queue";

export async function initializeSchedulers() {
  console.log("⏰ Initializing Autonomous Cron Schedulers...");

  // 1. Daily at 2:00 AM - ADR Datasets
  // We use a repeatable job so BullMQ handles scheduling and distributed locking
  await scrapeHtmlQueue.add(
    "adr-myneta-sync",
    { type: "scheduled-sync", target: "all-candidates" },
    {
      repeat: { pattern: "0 2 * * *" }, // CRON: Every day at 2:00 AM
      jobId: "cron-adr-myneta", // Unique ID prevents duplicate cron registrations
    }
  );

  // 2. Daily at 3:00 AM - PRS Legislative Sync
  await apiFetchQueue.add(
    "prs-mp-track-sync",
    { type: "scheduled-sync" },
    {
      repeat: { pattern: "0 3 * * *" }, // CRON: Every day at 3:00 AM
      jobId: "cron-prs-sync",
    }
  );

  // 3. Hourly - India Code Polling (New Bills/Acts)
  await apiFetchQueue.add(
    "india-code-poll",
    { type: "scheduled-sync" },
    {
      repeat: { pattern: "0 * * * *" }, // CRON: At minute 0 past every hour
      jobId: "cron-india-code-poll",
    }
  );

  // 4. Weekly on Sunday at 1:00 AM - Supreme Court OCR Catchup
  await pdfOcrQueue.add(
    "supreme-court-weekly",
    { type: "scheduled-sync" },
    {
      repeat: { pattern: "0 1 * * 0" }, // CRON: 1 AM on Sunday
      jobId: "cron-supreme-court",
    }
  );

  // 5. Daily at 4:00 AM - Data Reconciliation (Stale Data Detection)
  await apiFetchQueue.add(
    "reconciliation-pipeline",
    { type: "scheduled-reconciliation" },
    {
      repeat: { pattern: "0 4 * * *" }, // CRON: Every day at 4:00 AM
      jobId: "cron-reconciliation",
    }
  );

  console.log("✅ CRON Schedulers registered successfully.");
}

// If run directly (e.g. `tsx src/worker/scheduler.ts`)
if (require.main === module) {
  initializeSchedulers().then(() => process.exit(0)).catch(console.error);
}
