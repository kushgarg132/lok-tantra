export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { DiscoveryService } from "@/lib/services/discovery.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const pincode = searchParams.get("pincode");
    const constituency = searchParams.get("constituency");
    const state = searchParams.get("state");

    let representatives: any[] = [];

    if (lat && lng) {
      representatives = await DiscoveryService.findRepresentativesByLocation(parseFloat(lat), parseFloat(lng));
    } else if (pincode) {
      representatives = await DiscoveryService.findRepresentativesByPinCode(pincode);
    } else if (constituency) {
      representatives = await DiscoveryService.findRepresentativesByConstituency(constituency);
    } else if (state) {
      representatives = await DiscoveryService.findRepresentativesByState(state);
    } else {
      return NextResponse.json({ error: "No valid search parameters provided" }, { status: 400 });
    }

    // Map to a clean DTO
    const data = representatives.map((p) => ({
      id: p.id,
      name: p.name,
      designation: p.designation ?? "",
      party: p.party?.abbreviation ?? "IND",
      partyColor: p.party?.color ?? "#808080",
      constituency: p.constituency ?? "",
      state: p.state ?? "",
      level: p.level ?? "central",
      chamber: p.chamber,
      contact: (p.contact as Record<string, string>) ?? {},
      profile: (p.profile as Record<string, unknown>) ?? {},
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Discovery API Error:", error);
    return NextResponse.json({ error: "Failed to discover representatives" }, { status: 500 });
  }
}
