import { NextResponse } from "next/server";
import { GraphService } from "@/lib/services/graph.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter 'id'" },
        { status: 400 }
      );
    }

    const data = await GraphService.getPoliticalNetwork(id);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Network API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch political network" },
      { status: 500 }
    );
  }
}
