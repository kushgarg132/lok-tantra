import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const QuerySchema = z.object({
  slug: z.string().max(100).optional(),
});

export async function GET(request: Request) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = QuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.issues }, { status: 400 });
    }
    const { slug } = parsed.data;

    if (slug) {
      const path = await prisma.learningPath.findUnique({
        where:   { slug },
        include: { modules: { orderBy: { order: "asc" } } },
      });
      return NextResponse.json({ data: path });
    }

    const paths = await prisma.learningPath.findMany({
      include: { modules: { orderBy: { order: "asc" } } },
      orderBy: { estimatedHours: "asc" },
    });

    return NextResponse.json({ data: paths });
  } catch (error) {
    console.error("[API:learn]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
