export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { GraphService } from "@/lib/services/graph.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const depth = parseInt(searchParams.get("depth") || "3", 10);

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter 'id'" },
        { status: 400 }
      );
    }

    const data = await GraphService.getInstitutionalHierarchy(id, { depth });
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Hierarchy API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch institutional hierarchy" },
      { status: 500 }
    );
  }
}
