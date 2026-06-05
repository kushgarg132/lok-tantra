import { NextRequest, NextResponse } from "next/server";
import { verifySource, getAllSources } from "@/lib/integrity/source-registry";

export async function GET(req: NextRequest) {
  const url  = req.nextUrl.searchParams.get("url");
  const list = req.nextUrl.searchParams.get("list");

  if (list === "all") {
    return NextResponse.json({ sources: getAllSources() });
  }

  if (!url) {
    return NextResponse.json({ error: "url parameter required." }, { status: 400 });
  }

  try {
    const result = verifySource(url);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
  }
}
