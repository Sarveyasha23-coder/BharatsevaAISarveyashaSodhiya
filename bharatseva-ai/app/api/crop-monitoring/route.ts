import { NextRequest, NextResponse } from 'next/server'

// Mock polygon data for demonstration (in production, store in database)
const mockPolygons = [
  {
    id: 'polygon_1',
    name: 'Rice Field - Punjab',
    coordinates: [
      [31.1471, 75.3412],
      [31.1471, 75.3420],
      [31.1480, 75.3420],
      [31.1480, 75.3412],
      [31.1471, 75.3412]
    ],
    crop: 'rice',
    area: 2.5, // hectares
    created: '2024-01-15',
    lastUpdated: '2024-03-30'
  },
  {
    id: 'polygon_2',
    name: 'Wheat Field - Haryana',
    coordinates: [
      [29.0588, 76.0856],
      [29.0588, 76.0864],
      [29.0596, 76.0864],
      [29.0596, 76.0856],
      [29.0588, 76.0856]
    ],
    crop: 'wheat',
    area: 1.8,
    created: '2024-02-01',
    lastUpdated: '2024-03-30'
  }
]

async function getPolygonStats(polygonId: string) {
  const apiKey = process.env.WEATHER_API_KEY
  if (!apiKey) {
    throw new Error('Weather API key not configured')
  }

  // In a real implementation, you would use the polygon ID to fetch data
  // For now, we'll simulate polygon-based monitoring

  // Get weather data for the polygon center
  const polygon = mockPolygons.find(p => p.id === polygonId)
  if (!polygon) {
    throw new Error('Polygon not found')
  }

  const centerLat = polygon.coordinates.reduce((sum, coord) => sum + coord[0], 0) / polygon.coordinates.length
  const centerLon = polygon.coordinates.reduce((sum, coord) => sum + coord[1], 0) / polygon.coordinates.length

  // Fetch current weather
  const weatherUrl = `https://api.agromonitoring.com/agro/1.0/weather?lat=${centerLat}&lon=${centerLon}&appid=${apiKey}`
  const weatherResponse = await fetch(weatherUrl)
  const weatherData = await weatherResponse.json()

  // Fetch soil data
  const soilUrl = `https://api.agromonitoring.com/agro/1.0/soil?lat=${centerLat}&lon=${centerLon}&appid=${apiKey}`
  const soilResponse = await fetch(soilUrl)
  const soilData = await soilResponse.json()

  // Simulate NDVI/vegetation index (in real implementation, use satellite data)
  const ndvi = Math.random() * 0.4 + 0.4 // Random value between 0.4-0.8

  return {
    polygon: polygon,
    currentConditions: {
      temperature: Math.round(weatherData.main.temp - 273.15),
      humidity: weatherData.main.humidity,
      soilMoisture: Math.round(soilData.moisture * 100),
      soilTemperature: Math.round(soilData.t10 - 273.15)
    },
    vegetation: {
      ndvi: ndvi.toFixed(3),
      health: ndvi > 0.6 ? 'Excellent' : ndvi > 0.4 ? 'Good' : 'Poor',
      coverage: Math.round((ndvi / 0.8) * 100)
    },
    alerts: [
      weatherData.main.humidity > 80 ? 'High humidity - monitor for fungal diseases' : null,
      soilData.moisture < 0.3 ? 'Low soil moisture - consider irrigation' : null,
      ndvi < 0.5 ? 'Vegetation stress detected - check crop health' : null
    ].filter(Boolean),
    recommendations: [
      'Monitor soil moisture regularly',
      'Apply fertilizers based on crop stage',
      'Scout for pests and diseases',
      'Maintain proper irrigation schedule'
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const polygonId = searchParams.get('polygonId')

    if (polygonId) {
      // Get specific polygon stats
      const stats = await getPolygonStats(polygonId)
      return NextResponse.json(stats)
    } else {
      // Return all polygons
      return NextResponse.json({
        polygons: mockPolygons,
        totalArea: mockPolygons.reduce((sum, p) => sum + p.area, 0),
        totalPolygons: mockPolygons.length
      })
    }

  } catch (error) {
    console.error('Crop monitoring API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch crop monitoring data',
      polygons: mockPolygons
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, coordinates, crop, area } = await request.json()

    if (!name || !coordinates || !crop || !area) {
      return NextResponse.json({
        error: 'Missing required fields: name, coordinates, crop, area'
      }, { status: 400 })
    }

    // Create new polygon (in production, save to database)
    const newPolygon = {
      id: `polygon_${Date.now()}`,
      name,
      coordinates,
      crop,
      area: parseFloat(area),
      created: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    mockPolygons.push(newPolygon)

    return NextResponse.json({
      success: true,
      polygon: newPolygon,
      message: 'Polygon created successfully'
    })

  } catch (error) {
    console.error('Create polygon error:', error)
    return NextResponse.json({
      error: 'Failed to create polygon'
    }, { status: 500 })
  }
}