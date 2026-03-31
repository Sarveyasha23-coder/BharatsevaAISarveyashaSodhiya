import { NextRequest, NextResponse } from "next/server";
import { recommendSchemes, sampleProfile, schemes, searchSchemes } from "@/lib/schemes";
import type { CitizenProfile } from "@/lib/types";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const results = searchSchemes(query);

  return NextResponse.json({
    query,
    count: results.length,
    results: results.length > 0 ? results : schemes,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    query?: string;
    profile?: Partial<CitizenProfile>;
  };

  const profile: CitizenProfile = {
    ...sampleProfile,
    ...body.profile,
  };

  return NextResponse.json({
    query: body.query ?? "",
    profile,
    recommendations: recommendSchemes(profile, body.query ?? ""),
  });
}
