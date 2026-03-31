import { NextRequest, NextResponse } from "next/server"
import { fetchJson, titleCase } from "@/lib/live-data"

interface NcsFilterOptions {
  employers: string[]
  educationLevels: string[]
  jobTypeCounts: Record<string, number>
  timestamp?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get("limit") || "12")

    const payload = await fetchJson<{ data: NcsFilterOptions; timestamp?: string }>(
      "https://betacloud.ncs.gov.in/api/v1/job-posts/filter-options"
    )

    const jobTypes = Object.entries(payload.data.jobTypeCounts || {})
      .map(([key, vacancies]) => ({
        id: key,
        label: titleCase(key.replace(/_/g, " ").toLowerCase()),
        vacancies,
      }))
      .sort((left, right) => right.vacancies - left.vacancies)

    const totalVacancies = jobTypes.reduce(
      (sum, item) => sum + item.vacancies,
      0
    )

    return NextResponse.json({
      data: jobTypes.slice(0, limit),
      educationLevels: (payload.data.educationLevels || []).slice(0, 12),
      topEmployers: (payload.data.employers || []).slice(0, 18),
      summary: {
        totalVacancies,
        totalEmployers: payload.data.employers?.length || 0,
        totalQualifications: payload.data.educationLevels?.length || 0,
        helpline: "1514",
      },
      supportLinks: [
        {
          title: "Find Domestic Jobs",
          href: "https://betacloud.ncs.gov.in/job-listing",
        },
        {
          title: "Government Jobs",
          href: "https://betacloud.ncs.gov.in/job-listing?sortBy=NEWEST&isGovernmentJob=true",
        },
        {
          title: "Career Counsellors",
          href: "https://betacloud.ncs.gov.in/career-counsellors",
        },
        {
          title: "Skill Providers",
          href: "https://betacloud.ncs.gov.in/skill-provider",
        },
      ],
      lastUpdated: payload.timestamp || payload.data.timestamp || new Date().toISOString(),
      source: "National Career Service (NCS)",
    })
  } catch (error) {
    console.error("NCS API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch live NCS signals right now." },
      { status: 500 }
    )
  }
}
