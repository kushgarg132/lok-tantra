import { apiFetchQueue } from "../lib/etl/queue";

async function seedTestJob() {
  console.log("Adding a test job to the API Fetch Queue...");

  await apiFetchQueue.add("dummy-job", {
    source: "https://example.com/api/data",
    type: "test-run",
    timestamp: new Date().toISOString(),
  });

  console.log("✅ Job added successfully. Check the worker output.");
  process.exit(0);
}

seedTestJob().catch(console.error);
