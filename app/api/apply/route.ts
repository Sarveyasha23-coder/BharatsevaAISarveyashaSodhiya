import { NextRequest, NextResponse } from "next/server";
import { submitApplication } from "@/lib/schemes";
import type { ApplicationPayload } from "@/lib/types";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as ApplicationPayload;

  if (!payload.schemeId) {
    return NextResponse.json(
      { error: "schemeId is required." },
      { status: 400 },
    );
  }

  const receipt = submitApplication(payload);

  return NextResponse.json(receipt, { status: 201 });
}
