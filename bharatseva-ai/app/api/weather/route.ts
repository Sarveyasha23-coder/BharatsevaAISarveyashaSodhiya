import { NextRequest, NextResponse } from "next/server"
import {
  fetchJson,
  geocodeLocation,
  titleCase,
  weatherCodeToDescription,
} from "@/lib/live-data"

interface OpenMeteoForecast {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
  }
  current_units: {
    temperature_2m: string
    wind_speed_10m: string
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
  }
}

function buildAgriculturalInsights(
  temperature: number,
  humidity: number,
  windSpeed: number,
  precipitationChance: number
) {
  const suitable: string[] = []
  const warnings: string[] = []

  if (temperature >= 30) {
    suitable.push("Millets", "Groundnut", "Cotton")
    warnings.push("High daytime heat. Plan irrigation early morning or late evening.")
  } else if (temperature >= 22) {
    suitable.push("Maize", "Pulses", "Vegetables")
  } else {
    suitable.push("Wheat", "Mustard", "Barley")
    warnings.push("Cool conditions are suitable for winter crops and nursery protection.")
  }

  if (humidity >= 80) {
    warnings.push("Humidity is elevated. Monitor crops for fungal pressure.")
  }

  if (windSpeed >= 20) {
    warnings.push("Wind speeds are strong. Secure lightweight coverings and young plants.")
  }

  if (precipitationChance >= 60) {
    warnings.push("Rain probability is high. Delay spraying and protect harvested produce.")
  }

  return {
    suitable: [...new Set(suitable)],
    warnings,
    irrigationWindow:
      precipitationChance >= 50 ? "Wait for rainfall before heavy irrigation." : "Light irrigation is suitable.",
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationQuery = searchParams.get("location") || "New Delhi"

    const geocoded = await geocodeLocation(locationQuery)

    if (!geocoded) {
      return NextResponse.json(
        { error: "Location not found. Please try a city or district name." },
        { status: 400 }
      )
    }

    const forecast = await fetchJson<OpenMeteoForecast>(
      `https://api.open-meteo.com/v1/forecast?latitude=${geocoded.latitude}&longitude=${geocoded.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`
    )

    const agricultural = buildAgriculturalInsights(
      forecast.current.temperature_2m,
      forecast.current.relative_humidity_2m,
      forecast.current.wind_speed_10m,
      forecast.daily.precipitation_probability_max[0] ?? 0
    )

    return NextResponse.json({
      location: `${geocoded.name}, ${geocoded.admin1 || "India"}`,
      coordinates: {
        lat: geocoded.latitude,
        lon: geocoded.longitude,
      },
      temperature: Math.round(forecast.current.temperature_2m),
      temperatureUnit: forecast.current_units.temperature_2m,
      condition: weatherCodeToDescription(forecast.current.weather_code),
      humidity: forecast.current.relative_humidity_2m,
      windSpeed: Math.round(forecast.current.wind_speed_10m),
      windUnit: forecast.current_units.wind_speed_10m,
      forecast: forecast.daily.time.map((date, index) => ({
        day:
          index === 0
            ? "Today"
            : new Date(date).toLocaleDateString("en-IN", { weekday: "short" }),
        temp: Math.round(forecast.daily.temperature_2m_max[index]),
        tempLow: Math.round(forecast.daily.temperature_2m_min[index]),
        condition: titleCase(weatherCodeToDescription(forecast.daily.weather_code[index])),
        precipitationProbability: forecast.daily.precipitation_probability_max[index] ?? 0,
      })),
      agricultural,
      source: "Open-Meteo",
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch live weather right now." },
      { status: 500 }
    )
  }
}
