import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "central") {
    const levels = await prisma.bureaucraticLevel.findMany({
      where: { hierarchy: "central_secretariat" },
      orderBy: { level: "asc" },
    });
    return NextResponse.json({ data: levels });
  }

  if (type === "district") {
    const levels = await prisma.bureaucraticLevel.findMany({
      where: { hierarchy: "district_administration" },
      orderBy: { level: "asc" },
    });
    return NextResponse.json({ data: levels });
  }

  if (type === "services") {
    const services = await prisma.civilService.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ data: services });
  }

  if (type === "ministries") {
    const ministries = await prisma.ministry.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ data: ministries });
  }

  const [central, district, services, ministries] = await Promise.all([
    prisma.bureaucraticLevel.findMany({ where: { hierarchy: "central_secretariat" }, orderBy: { level: "asc" } }),
    prisma.bureaucraticLevel.findMany({ where: { hierarchy: "district_administration" }, orderBy: { level: "asc" } }),
    prisma.civilService.findMany({ orderBy: { name: "asc" } }),
    prisma.ministry.findMany({ orderBy: { name: "asc" } }),
  ]);

  return NextResponse.json({ data: { central, district, services, ministries } });
}
