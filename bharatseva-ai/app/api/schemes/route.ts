import { NextRequest, NextResponse } from "next/server"
import { officialSchemes } from "@/lib/official-schemes"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const query = searchParams.get("q")
  const limit = searchParams.get("limit")

  let schemes = officialSchemes

  if (category) {
    schemes = schemes.filter(
      (scheme) => scheme.category.toLowerCase() === category.toLowerCase()
    )
  }

  if (query) {
    schemes = schemes.filter(
      (scheme) =>
        scheme.name.toLowerCase().includes(query.toLowerCase()) ||
        scheme.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  if (limit) {
    schemes = schemes.slice(0, Number(limit))
  }

  return NextResponse.json({
    schemes: schemes.map((scheme) => ({
      id: scheme.id,
      name: scheme.name,
      description: scheme.description,
      category: scheme.category,
      eligibility: scheme.eligibility,
      benefits: scheme.benefits,
      applicationUrl: scheme.applicationUrl,
    })),
    total: schemes.length,
    source: "Verified official scheme portals",
  })
}
