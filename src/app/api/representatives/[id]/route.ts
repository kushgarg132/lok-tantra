import { NextResponse } from "next/server";
import { DiscoveryService } from "@/lib/services/discovery.service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await DiscoveryService.getRepresentativeProfile(params.id);

    if (!profile) {
      return NextResponse.json(
        { error: "Representative not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch representative profile" },
      { status: 500 }
    );
  }
}
