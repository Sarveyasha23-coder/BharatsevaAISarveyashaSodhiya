import { NextRequest, NextResponse } from "next/server"
import {
  formatDistance,
  geocodeLocation,
  searchNearbyPlaces,
} from "@/lib/live-data"

const emergencyContacts = {
  ambulance: "108",
  emergency: "112",
  womenHelpline: "181",
}

function buildHealthResponse(message: string) {
  const normalized = message.toLowerCase()
  const urgent =
    normalized.includes("chest pain") ||
    normalized.includes("difficulty breathing") ||
    normalized.includes("unconscious") ||
    normalized.includes("bleeding")

  const fever =
    normalized.includes("fever") ||
    normalized.includes("cold") ||
    normalized.includes("cough")

  const digest =
    normalized.includes("stomach") ||
    normalized.includes("vomit") ||
    normalized.includes("diarrhea")

  if (urgent) {
    return [
      "This is general guidance only, not medical advice.",
      "Your message suggests symptoms that may require urgent assessment.",
      "Please seek immediate medical help or call 108/112.",
    ].join(" ")
  }

  if (fever) {
    return [
      "This is general guidance only, not medical advice.",
      "For fever or cough, rest, hydrate well, and monitor temperature and breathing.",
      "If symptoms worsen, last more than 2 to 3 days, or breathing becomes difficult, visit a doctor.",
    ].join(" ")
  }

  if (digest) {
    return [
      "This is general guidance only, not medical advice.",
      "For stomach-related symptoms, focus on hydration and light meals.",
      "Seek medical help quickly if you cannot keep fluids down or feel weak or dizzy.",
    ].join(" ")
  }

  return [
    "This is general guidance only, not medical advice.",
    "Share symptoms, duration, age group, and location for more targeted support.",
    "For serious or rapidly worsening symptoms, contact a qualified doctor or call 108.",
  ].join(" ")
}

async function fetchNearbyHospitals(location: string) {
  const place = await geocodeLocation(location || "New Delhi")
  if (!place) {
    return []
  }

  const hospitals = await searchNearbyPlaces(
    place.latitude,
    place.longitude,
    "hospital",
    3
  )

  return hospitals.map((hospital) => ({
    name: hospital.name,
    distance: formatDistance(hospital.distanceKm),
    specialty: hospital.type,
  }))
}

export async function POST(request: NextRequest) {
  try {
    const { message, location } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 })
    }

    const nearbyHospitals = await fetchNearbyHospitals(location || "New Delhi")

    return NextResponse.json({
      response: buildHealthResponse(message),
      data: {
        nearbyHospitals,
        healthSchemes: [
          "Ayushman Bharat PM-JAY",
          "eSanjeevani telemedicine",
          "National Health Mission",
        ],
        emergencyContacts,
      },
      timestamp: new Date().toISOString(),
      source: "OpenStreetMap + official public health services",
    })
  } catch (error) {
    console.error("Health AI API error:", error)
    return NextResponse.json(
      { error: "Unable to process the health request right now." },
      { status: 500 }
    )
  }
}

export async function GET() {
  const hospitals = await fetchNearbyHospitals("New Delhi")

  return NextResponse.json({
    hospitals,
    healthSchemes: [
      {
        name: "Ayushman Bharat PM-JAY",
        coverage: "Up to Rs 5 lakh per family per year",
        portal: "https://pmjay.gov.in/",
      },
      {
        name: "eSanjeevani",
        coverage: "Government telemedicine consultations",
        portal: "https://esanjeevani.mohfw.gov.in/",
      },
      {
        name: "National Health Mission",
        coverage: "Primary and preventive health support",
        portal: "https://nhm.gov.in/",
      },
    ],
    telemedicineServices: [
      {
        name: "eSanjeevani",
        provider: "Government of India",
        type: "Telemedicine consultations",
      },
    ],
    emergencyContacts,
  })
}
