import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { HonoAdapter } from "@bull-board/hono";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { apiFetchQueue, scrapeHtmlQueue, pdfOcrQueue } from "@/lib/etl/queue";

export const runtime = "nodejs";

const app = new Hono().basePath("/api/admin/queues");
const serverAdapter = new HonoAdapter(app);

createBullBoard({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queues: [
    new BullMQAdapter(apiFetchQueue) as any,
    new BullMQAdapter(scrapeHtmlQueue) as any,
    new BullMQAdapter(pdfOcrQueue) as any,
  ],
  serverAdapter,
});

const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PUT = handler;
