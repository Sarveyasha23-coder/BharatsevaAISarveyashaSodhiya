import { NextRequest, NextResponse } from "next/server"
import { fetchJson } from "@/lib/live-data"

interface WorldBankRecord {
  date: string
  value: number | null
}

interface HealthIndicator {
  state: string
  indicator: string
  value: string
  year: string
  category: string
}

const indicatorCatalog = [
  {
    code: "SP.DYN.IMRT.IN",
    name: "Infant mortality rate",
    category: "Child Health",
    unit: "per 1,000 live births",
  },
  {
    code: "SP.DYN.LE00.IN",
    name: "Life expectancy at birth",
    category: "Population Health",
    unit: "years",
  },
  {
    code: "SH.IMM.IDPT",
    name: "Children immunized against DPT",
    category: "Immunization",
    unit: "%",
  },
  {
    code: "SH.STA.BRTC.ZS",
    name: "Births attended by skilled staff",
    category: "Maternal Health",
    unit: "%",
  },
]

async function fetchLatestIndicator(
  code: string,
  name: string,
  category: string,
  unit: string
): Promise<HealthIndicator | null> {
  const payload = await fetchJson<[unknown, WorldBankRecord[]]>(
    `https://api.worldbank.org/v2/country/IND/indicator/${code}?format=json&per_page=8`
  )

  const latest = payload[1]?.find((entry) => entry.value !== null)

  if (!latest || latest.value === null) {
    return null
  }

  return {
    state: "All India",
    indicator: name,
    value: `${latest.value}${unit === "%" ? "%" : ` ${unit}`}`,
    year: latest.date,
    category,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const indicatorFilter = searchParams.get("indicator")?.toLowerCase()
    const categoryFilter = searchParams.get("category")?.toLowerCase()
    const limitParam = searchParams.get("limit")

    const data = (
      await Promise.all(
        indicatorCatalog.map((indicator) =>
          fetchLatestIndicator(
            indicator.code,
            indicator.name,
            indicator.category,
            indicator.unit
          )
        )
      )
    ).filter(Boolean) as HealthIndicator[]

    let filtered = data

    if (indicatorFilter) {
      filtered = filtered.filter((item) =>
        item.indicator.toLowerCase().includes(indicatorFilter)
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === categoryFilter
      )
    }

    if (limitParam) {
      filtered = filtered.slice(0, Number(limitParam))
    }

    return NextResponse.json({
      data: filtered,
      total: filtered.length,
      source: "World Bank Open Data",
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health data API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch live health indicators right now." },
      { status: 500 }
    )
  }
}
