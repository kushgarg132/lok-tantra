import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class DiscoveryService {
  /**
   * Search representatives by State Code (e.g., 'DL' or 'UP')
   */
  static async findRepresentativesByState(stateCode: string) {
    return prisma.person.findMany({
      where: {
        stateCode: stateCode,
        chamber: { in: ["lok_sabha", "rajya_sabha", "state_assembly"] },
      },
      include: {
        party: true,
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Search representatives by Constituency Name
   */
  static async findRepresentativesByConstituency(constituencyName: string) {
    return prisma.person.findMany({
      where: {
        constituency: { contains: constituencyName, mode: "insensitive" },
        chamber: { in: ["lok_sabha", "state_assembly"] },
      },
      include: { party: true },
    });
  }

  /**
   * Resolve PIN Code to constituencies and fetch reps
   */
  static async findRepresentativesByPinCode(pincode: string) {
    // Attempt to resolve PIN to constituency using the new PinCode model
    const pinData = await prisma.pinCode.findUnique({
      where: { code: pincode },
      include: {
        constituency: true,
        district: { include: { state: true } },
      },
    });

    if (pinData?.constituency) {
      return this.findRepresentativesByConstituency(pinData.constituency.name);
    }

    // Fallback: If we only know the state from the district
    if (pinData?.district?.state?.code) {
      return this.findRepresentativesByState(pinData.district.state.code);
    }

    return [];
  }

  /**
   * Geospatial search: Resolve GPS coordinates to constituencies using PostGIS
   */
  static async findRepresentativesByLocation(lat: number, lng: number) {
    try {
      // Execute PostGIS ST_Contains query
      const constituencies = await prisma.$queryRaw<{ name: string }[]>`
        SELECT name
        FROM "Constituency"
        WHERE ST_Contains(geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
      `;

      if (constituencies && constituencies.length > 0) {
        // Collect reps from the found overlapping constituencies (usually 1 Lok Sabha + 1 Vidhan Sabha)
        const names = constituencies.map((c) => c.name);
        return prisma.person.findMany({
          where: {
            constituency: { in: names },
          },
          include: { party: true },
        });
      }
      return [];
    } catch (error) {
      console.error("Geospatial query failed (PostGIS may not be initialized):", error);
      // Fallback for development/testing if PostGIS isn't fully seeded
      return [];
    }
  }

  /**
   * Fetch a highly detailed profile of a single representative
   */
  static async getRepresentativeProfile(id: string) {
    const person = await prisma.person.findUnique({
      where: { id },
      include: {
        party: true,
        partyHistory: { include: { party: true }, orderBy: { validFrom: "desc" } },
        roles: { include: { institution: true, committee: true }, orderBy: { validFrom: "desc" } },
        electionResults: { include: { constituency: true }, orderBy: { year: "desc" } },
      },
    });

    if (!person) return null;

    return {
      ...person,
      // Ensure these JSON fields are parsed cleanly
      contact: person.contact as Record<string, string> || {},
      socialLinks: person.socialLinks as Record<string, string> || {},
      assets: person.assets as Record<string, any> || null,
      criminalCases: person.criminalCases as Record<string, any>[] || [],
      performance: person.profile as Record<string, any> || {},
    };
  }
}
