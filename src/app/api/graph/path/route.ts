export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { GraphService } from "@/lib/services/graph.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromId = searchParams.get("from");
    const toId = searchParams.get("to");

    if (!fromId || !toId) {
      return NextResponse.json(
        { error: "Missing required parameters 'from' and 'to'" },
        { status: 400 }
      );
    }

    const data = await GraphService.getShortestPath(fromId, toId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Path API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shortest path" },
      { status: 500 }
    );
  }
}
