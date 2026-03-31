import { NextRequest, NextResponse } from "next/server"
import {
  formatDistance,
  reverseGeocode,
  searchNearbyPlaces,
} from "@/lib/live-data"

const emergencyContacts = {
  police: "112",
  ambulance: "108",
  fire: "101",
  womenHelpline: "181",
}

const localSchemeLibrary = [
  "Ayushman Bharat PM-JAY",
  "PM SVANidhi",
  "National Scholarship Portal",
  "PM Kisan Samman Nidhi",
  "eSanjeevani telemedicine",
]

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude } = await request.json()

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Location coordinates are required." },
        { status: 400 }
      )
    }

    const [location, hospitals, policeStations, offices] = await Promise.all([
      reverseGeocode(latitude, longitude),
      searchNearbyPlaces(latitude, longitude, "hospital", 4),
      searchNearbyPlaces(latitude, longitude, "police station", 4),
      searchNearbyPlaces(latitude, longitude, "government office", 4),
    ])

    const responseText = [
      `You are near ${location.city}, ${location.state}.`,
      `Closest hospital: ${hospitals[0]?.name || "Not available right now"}.`,
      `Closest police station: ${policeStations[0]?.name || "Not available right now"}.`,
      "Emergency response numbers are included below for quick access.",
    ].join(" ")

    return NextResponse.json({
      response: responseText,
      locationData: {
        location: {
          district: location.district,
          state: location.state,
          coordinates: { lat: latitude, lng: longitude },
          address: location.displayName,
        },
        nearbyServices: {
          police: policeStations.map((place) => ({
            name: place.name,
            distance: formatDistance(place.distanceKm),
            phone: emergencyContacts.police,
          })),
          hospitals: hospitals.map((place) => ({
            name: place.name,
            distance: formatDistance(place.distanceKm),
            type: place.type,
          })),
          governmentOffices: offices.map((place) => ({
            name: place.name,
            distance: formatDistance(place.distanceKm),
            services: ["Certificates", "Public grievances", "Citizen support"],
          })),
        },
        localSchemes: localSchemeLibrary,
        emergencyContacts,
      },
      timestamp: new Date().toISOString(),
      source: "OpenStreetMap Nominatim",
    })
  } catch (error) {
    console.error("Location Intelligence API error:", error)
    return NextResponse.json(
      { error: "Unable to process the current location right now." },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    majorCities: [
      { name: "Delhi", lat: 28.6139, lng: 77.209 },
      { name: "Mumbai", lat: 19.076, lng: 72.8777 },
      { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
      { name: "Chennai", lat: 13.0827, lng: 80.2707 },
      { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    ],
    serviceCategories: [
      "Healthcare",
      "Police",
      "Government offices",
      "Transport",
      "Citizen grievance support",
    ],
    emergencyContacts,
    source: "OpenStreetMap Nominatim",
  })
}
