export interface Coordinates {
  lat: number
  lon: number
}

export interface NearbyPlace {
  name: string
  address: string
  distanceKm: number
  type: string
  lat: number
  lon: number
}

interface OpenMeteoResult {
  results?: Array<{
    name: string
    latitude: number
    longitude: number
    country?: string
    admin1?: string
    admin2?: string
  }>
}

interface ReverseGeocodeResult {
  display_name?: string
  address?: Record<string, string>
}

interface NominatimPlace {
  name?: string
  display_name?: string
  lat: string
  lon: string
  type?: string
  addresstype?: string
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set("User-Agent", "BharatSevaAI/1.0")
  headers.set("Accept", "application/json")

  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function geocodeLocation(query: string) {
  const data = await fetchJson<OpenMeteoResult>(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=1&language=en&format=json`
  )

  return data.results?.[0] ?? null
}

export async function reverseGeocode(lat: number, lon: number) {
  const data = await fetchJson<ReverseGeocodeResult>(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`
  )

  const address = data.address ?? {}

  return {
    displayName: data.display_name ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    district:
      address.state_district ||
      address.county ||
      address.city_district ||
      address.city ||
      "Local district",
    state: address.state || address.region || "India",
    city:
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.county ||
      "Nearby area",
    postcode: address.postcode || "",
    road: address.road || address.neighbourhood || "",
  }
}

export async function searchNearbyPlaces(
  lat: number,
  lon: number,
  query: string,
  limit = 4
): Promise<NearbyPlace[]> {
  const results = await fetchJson<NominatimPlace[]>(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      `${query} near ${lat},${lon}`
    )}&format=jsonv2&limit=${limit}`
  )

  return results.map((item) => {
    const placeLat = Number(item.lat)
    const placeLon = Number(item.lon)

    return {
      name:
        item.name ||
        item.display_name?.split(",")[0] ||
        query.replace(/\b\w/g, (part) => part.toUpperCase()),
      address: item.display_name || "Address unavailable",
      distanceKm: haversineKm(lat, lon, placeLat, placeLon),
      type: item.type || item.addresstype || query,
      lat: placeLat,
      lon: placeLon,
    }
  })
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (value: number) => (value * Math.PI) / 180
  const earthRadiusKm = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`
  }

  return `${distanceKm.toFixed(1)} km`
}

export function weatherCodeToDescription(code: number) {
  const weatherCodes: Record<number, string> = {
    0: "Clear sky",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with light hail",
    99: "Thunderstorm with heavy hail",
  }

  return weatherCodes[code] ?? "Weather update available"
}

export function titleCase(value: string) {
  return value.replace(/\b\w/g, (part) => part.toUpperCase())
}
