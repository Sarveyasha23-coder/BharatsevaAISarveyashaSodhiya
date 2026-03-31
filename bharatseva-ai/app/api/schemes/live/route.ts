import { NextRequest, NextResponse } from "next/server"
import { officialSchemes } from "@/lib/official-schemes"

const states = ["All India"]
const categories = ["All", ...new Set(officialSchemes.map((scheme) => scheme.category))]
const targetGroups = [
  "All",
  ...new Set(officialSchemes.map((scheme) => scheme.targetGroup)),
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get("state")
  const category = searchParams.get("category")
  const targetGroup = searchParams.get("targetGroup")
  const incomeGroup = searchParams.get("incomeGroup")
  const search = searchParams.get("search")

  let schemes = officialSchemes

  if (state && state !== "All India") {
    schemes = schemes.filter((scheme) => scheme.state === state)
  }

  if (category && category !== "All") {
    schemes = schemes.filter((scheme) => scheme.category === category)
  }

  if (targetGroup && targetGroup !== "All") {
    schemes = schemes.filter((scheme) => scheme.targetGroup === targetGroup)
  }

  if (incomeGroup) {
    schemes = schemes.filter(
      (scheme) =>
        scheme.incomeGroup.toLowerCase() === incomeGroup.toLowerCase() ||
        scheme.incomeGroup === "All"
    )
  }

  if (search) {
    schemes = schemes.filter(
      (scheme) =>
        scheme.title.toLowerCase().includes(search.toLowerCase()) ||
        scheme.description.toLowerCase().includes(search.toLowerCase()) ||
        scheme.ministry.toLowerCase().includes(search.toLowerCase())
    )
  }

  return NextResponse.json({
    schemes: schemes.map((scheme) => ({
      id: scheme.id,
      title: scheme.title,
      ministry: scheme.ministry,
      category: scheme.category,
      state: scheme.state,
      targetGroup: scheme.targetGroup,
      incomeGroup: scheme.incomeGroup,
      ageGroup: scheme.ageGroup,
      description: scheme.description,
      benefits: scheme.benefitsSummary,
      applicationDeadline: scheme.applicationDeadline,
      totalBeneficiaries: scheme.totalBeneficiaries,
      budgetAllocated: scheme.budgetAllocated,
      status: scheme.status,
      applicationUrl: scheme.applicationUrl,
      lastUpdated: scheme.lastUpdated,
    })),
    total: schemes.length,
    filters: {
      states,
      categories,
      targetGroups,
    },
    lastUpdated: new Date().toISOString(),
    source: "Verified official scheme portals",
  })
}
