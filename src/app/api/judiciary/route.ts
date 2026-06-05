export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const QuerySchema = z.object({
  type:   z.enum(["courts", "cases", "writs"]).optional(),
  limit:  z.coerce.number().int().min(1).max(200).default(100),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = QuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    const { type, limit, offset } = parsed.data;

    if (type === "courts") {
      const courts = await prisma.court.findMany({ orderBy: { type: "asc" } });
      return NextResponse.json({ data: courts });
    }

    if (type === "cases") {
      const [cases, total] = await prisma.$transaction([
        prisma.landmarkCase.findMany({
          include: {
            court:               { select: { id: true, name: true, type: true } },
            articlesInterpreted: { select: { id: true, number: true, title: true } },
          },
          orderBy: { year: "asc" },
          take:    limit,
          skip:    offset,
        }),
        prisma.landmarkCase.count(),
      ]);
      return NextResponse.json({ data: cases, total, limit, offset });
    }

    if (type === "writs") {
      const writs = await prisma.writ.findMany();
      return NextResponse.json({ data: writs });
    }

    const [courts, cases, writs] = await Promise.all([
      prisma.court.findMany({ orderBy: { type: "asc" } }),
      prisma.landmarkCase.findMany({
        include: {
          court:               { select: { id: true, name: true, type: true } },
          articlesInterpreted: { select: { id: true, number: true, title: true } },
        },
        orderBy: { year: "asc" },
        take: 200,
      }),
      prisma.writ.findMany(),
    ]);

    return NextResponse.json({ data: { courts, cases, writs } });
  } catch (error) {
    console.error("[API:judiciary]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
