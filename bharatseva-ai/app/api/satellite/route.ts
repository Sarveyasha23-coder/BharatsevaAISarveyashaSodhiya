import { NextRequest, NextResponse } from 'next/server'

// Location coordinates mapping for Indian cities/states (same as weather API)
const locationCoords: { [key: string]: { lat: number; lon: number } } = {
  'delhi': { lat: 28.6139, lon: 77.2090 },
  'new delhi': { lat: 28.6139, lon: 77.2090 },
  'mumbai': { lat: 19.0760, lon: 72.8777 },
  'chennai': { lat: 13.0827, lon: 80.2707 },
  'kolkata': { lat: 22.5726, lon: 88.3639 },
  'bangalore': { lat: 12.9716, lon: 77.5946 },
  'hyderabad': { lat: 17.3850, lon: 78.4867 },
  'pune': { lat: 18.5204, lon: 73.8567 },
  'ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'jaipur': { lat: 26.9124, lon: 75.7873 },
  'lucknow': { lat: 26.8467, lon: 80.9462 },
  'kanpur': { lat: 26.4499, lon: 80.3319 },
  'nagpur': { lat: 21.1458, lon: 79.0882 },
  'indore': { lat: 22.7196, lon: 75.8577 },
  'thane': { lat: 19.2183, lon: 72.9781 },
  'bhopal': { lat: 23.2599, lon: 77.4126 },
  'visakhapatnam': { lat: 17.6868, lon: 83.2185 },
  'pimpri-chinchwad': { lat: 18.6279, lon: 73.8000 },
  'patna': { lat: 25.5941, lon: 85.1376 },
  'vadodara': { lat: 22.3072, lon: 73.1812 },
  'ghaziabad': { lat: 28.6692, lon: 77.4538 },
  'ludhiana': { lat: 30.9010, lon: 75.8573 },
  'agra': { lat: 27.1767, lon: 78.0081 },
  'nashik': { lat: 19.9975, lon: 73.7898 },
  'faridabad': { lat: 28.4089, lon: 77.3178 },
  'meerut': { lat: 28.9845, lon: 77.7064 },
  'rajkot': { lat: 22.3039, lon: 70.8022 },
  'kalyan-dombivali': { lat: 19.2350, lon: 73.1297 },
  'vasai-virar': { lat: 19.4259, lon: 72.8225 },
  'varanasi': { lat: 25.3176, lon: 82.9739 },
  'srinagar': { lat: 34.0837, lon: 74.7973 },
  'aurangabad': { lat: 19.8762, lon: 75.3433 },
  'dhanbad': { lat: 23.7957, lon: 86.4304 },
  'amritsar': { lat: 31.6340, lon: 74.8723 },
  'navi mumbai': { lat: 19.0330, lon: 73.0297 },
  'allahabad': { lat: 25.4358, lon: 81.8463 },
  'ranchi': { lat: 23.3441, lon: 85.3096 },
  'howrah': { lat: 22.5958, lon: 88.2636 },
  'jabalpur': { lat: 23.1815, lon: 79.9864 },
  'gwalior': { lat: 26.2183, lon: 78.1828 },
  'vijayawada': { lat: 16.5062, lon: 80.6480 },
  'jodhpur': { lat: 26.2389, lon: 73.0243 },
  'raipur': { lat: 21.2514, lon: 81.6296 },
  'kota': { lat: 25.2138, lon: 75.8648 },
  'guwahati': { lat: 26.1445, lon: 91.7362 },
  'chandigarh': { lat: 30.7333, lon: 76.7794 },
  'solapur': { lat: 17.6599, lon: 75.9064 },
  'hubballi-dharwad': { lat: 15.3647, lon: 75.1240 },
  'bareilly': { lat: 28.3670, lon: 79.4304 },
  'moradabad': { lat: 28.8386, lon: 78.7733 },
  'mysore': { lat: 12.2958, lon: 76.6394 },
  'gurgaon': { lat: 28.4595, lon: 77.0266 },
  'aligarh': { lat: 27.8974, lon: 78.0880 },
  'jalandhar': { lat: 31.3260, lon: 75.5762 },
  'tiruchirappalli': { lat: 10.7905, lon: 78.7047 },
  'bhubaneswar': { lat: 20.2961, lon: 85.8245 },
  'salem': { lat: 11.6643, lon: 78.1460 },
  'warangal': { lat: 17.9689, lon: 79.5941 },
  'guntur': { lat: 16.3067, lon: 80.4365 },
  'bhiwandi': { lat: 19.2813, lon: 73.0483 },
  'saharanpur': { lat: 29.9679, lon: 77.5460 },
  'gorakhpur': { lat: 26.7606, lon: 83.3732 },
  'bikaner': { lat: 28.0229, lon: 73.3119 },
  'amravati': { lat: 20.9374, lon: 77.7796 },
  'noida': { lat: 28.5355, lon: 77.3910 },
  'jamshedpur': { lat: 22.8046, lon: 86.2029 },
  'bhilai': { lat: 21.1938, lon: 81.3509 },
  'cuttack': { lat: 20.4625, lon: 85.8830 },
  'firozabad': { lat: 27.1592, lon: 78.3958 },
  'kochi': { lat: 9.9312, lon: 76.2673 },
  'nellore': { lat: 14.4426, lon: 79.9865 },
  'bhavnagar': { lat: 21.7645, lon: 72.1519 },
  'dehradun': { lat: 30.3165, lon: 78.0322 },
  'durgapur': { lat: 23.5204, lon: 87.3119 },
  'asansol': { lat: 23.6739, lon: 86.9524 },
  'rourkela': { lat: 22.2604, lon: 84.8536 },
  'nanded': { lat: 19.1383, lon: 77.3210 },
  'kolhapur': { lat: 16.7050, lon: 74.2433 },
  'ajmer': { lat: 26.4499, lon: 74.6399 },
  'akola': { lat: 20.7000, lon: 77.0082 },
  'gulbarga': { lat: 17.3297, lon: 76.8343 },
  'jamnagar': { lat: 22.4707, lon: 70.0577 },
  'ujjain': { lat: 23.1793, lon: 75.7849 },
  'loni': { lat: 28.7514, lon: 77.2880 },
  'siliguri': { lat: 26.7271, lon: 88.3953 },
  'jhansi': { lat: 25.4484, lon: 78.5685 },
  'ulhasnagar': { lat: 19.2215, lon: 73.1645 },
  'jammu': { lat: 32.7266, lon: 74.8570 },
  'sangli-miraj-kupwad': { lat: 16.8524, lon: 74.5815 },
  'mangalore': { lat: 12.9141, lon: 74.8560 },
  'erode': { lat: 11.3410, lon: 77.7172 },
  'belgaum': { lat: 15.8497, lon: 74.4977 },
  'ambattur': { lat: 13.1143, lon: 80.1548 },
  'tirunelveli': { lat: 8.7139, lon: 77.7567 },
  'malegaon': { lat: 20.5497, lon: 74.5346 },
  'gaya': { lat: 24.7914, lon: 85.0002 },
  'jalgaon': { lat: 21.0077, lon: 75.5626 },
  'udaipur': { lat: 24.5854, lon: 73.7125 },
  'maheshtala': { lat: 22.5086, lon: 88.2532 },
  'tiruppur': { lat: 11.1085, lon: 77.3411 },
  'davanagere': { lat: 14.4644, lon: 75.9218 },
  'kozhikode': { lat: 11.2588, lon: 75.7804 },
  'kurnool': { lat: 15.8281, lon: 78.0373 },
  'rajahmundry': { lat: 17.0005, lon: 81.8040 },
  'bokaro': { lat: 23.6693, lon: 86.1511 },
  'south dum dum': { lat: 22.6100, lon: 88.4000 },
  'bellary': { lat: 15.1394, lon: 76.9087 },
  'patiala': { lat: 30.3398, lon: 76.3869 },
  'gopalpur': { lat: 19.2644, lon: 84.8620 },
  'agartala': { lat: 23.8315, lon: 91.2868 },
  'bhagalpur': { lat: 25.2425, lon: 87.0257 },
  'muzaffarnagar': { lat: 29.4727, lon: 77.7085 },
  'bhatpara': { lat: 22.8714, lon: 88.4089 },
  'panihati': { lat: 22.6940, lon: 88.3744 },
  'latur': { lat: 18.4088, lon: 76.5604 },
  'dhule': { lat: 20.9042, lon: 74.7749 },
  'tirupati': { lat: 13.6288, lon: 79.4192 },
  'rohtak': { lat: 28.8955, lon: 76.6066 },
  'korba': { lat: 22.3595, lon: 82.7501 },
  'bhilwara': { lat: 25.3214, lon: 74.5869 },
  'berhampur': { lat: 19.3140, lon: 84.7941 },
  'muzaffarpur': { lat: 26.1209, lon: 85.3647 },
  'ahmednagar': { lat: 19.0952, lon: 74.7496 },
  'mathura': { lat: 27.4924, lon: 77.6737 },
  'kollam': { lat: 8.8932, lon: 76.6141 },
  'avadi': { lat: 13.1067, lon: 80.0970 },
  'kadapa': { lat: 14.4673, lon: 78.8242 },
  'kamarhati': { lat: 22.6711, lon: 88.3747 },
  'sambalpur': { lat: 21.4669, lon: 83.9812 },
  'bilaspur': { lat: 22.0797, lon: 82.1391 },
  'shahjahanpur': { lat: 27.8815, lon: 79.9120 },
  'satara': { lat: 17.6805, lon: 73.9822 },
  'bijapur': { lat: 16.8302, lon: 75.7100 },
  'rampur': { lat: 28.7896, lon: 79.0241 },
  'shoranur': { lat: 10.7667, lon: 76.2833 },
  'chandrapur': { lat: 19.9615, lon: 79.2961 },
  'junagadh': { lat: 21.5222, lon: 70.4579 },
  'thrissur': { lat: 10.5276, lon: 76.2144 },
  'alwar': { lat: 27.5530, lon: 76.6346 },
  'bardhaman': { lat: 23.2324, lon: 87.8615 },
  'kulti': { lat: 23.7317, lon: 86.8437 },
  'kakinada': { lat: 16.9891, lon: 82.2475 },
  'nizamabad': { lat: 18.6725, lon: 78.0941 },
  'parbhani': { lat: 19.2686, lon: 76.7708 },
  'tumkur': { lat: 13.3379, lon: 77.1173 },
  'khammam': { lat: 17.2473, lon: 80.1514 },
  'ozhukarai': { lat: 11.9489, lon: 79.8304 },
  'bihar sharif': { lat: 25.1982, lon: 85.5214 },
  'panipat': { lat: 29.3909, lon: 76.9635 },
  'darbhanga': { lat: 26.1542, lon: 85.8918 },
  'bally': { lat: 22.6501, lon: 88.3412 },
  'aizawl': { lat: 23.7271, lon: 92.7176 },
  'dewas': { lat: 22.9676, lon: 76.0534 },
  'ichalkaranji': { lat: 16.6913, lon: 74.4599 },
  'karimnagar': { lat: 18.4386, lon: 79.1288 },
  'lakhimpur': { lat: 27.9491, lon: 80.7826 },
  'raichur': { lat: 16.2120, lon: 77.3439 },
  'khanna': { lat: 30.7030, lon: 76.2210 },
  'barrackpur': { lat: 22.7642, lon: 88.3776 },
  'katihar': { lat: 25.5427, lon: 87.5708 },
  'sagar': { lat: 23.8388, lon: 78.7378 },
  'kirari suleman nagar': { lat: 28.7000, lon: 77.0500 },
  'barshi': { lat: 18.2334, lon: 75.6941 },
  'dehri': { lat: 24.9025, lon: 84.1821 },
  'hindupur': { lat: 13.8291, lon: 77.4914 },
  'begusarai': { lat: 25.4185, lon: 86.1279 },
  'sonipat': { lat: 28.9283, lon: 77.0911 },
  'ramgundam': { lat: 18.8000, lon: 79.4500 },
  'hapur': { lat: 28.7306, lon: 77.7759 },
  'uluberia': { lat: 22.4700, lon: 88.1000 },
  'porbandar': { lat: 21.6417, lon: 69.6293 },
  'pali': { lat: 25.7711, lon: 73.3231 },
  'vizianagaram': { lat: 18.1067, lon: 83.3956 },
  'pudukkottai': { lat: 10.3833, lon: 78.8001 },
  'karnal': { lat: 29.6857, lon: 76.9905 },
  'nagercoil': { lat: 8.1833, lon: 77.4333 },
  'hoshiarpur': { lat: 31.5143, lon: 75.9115 },
  'shimoga': { lat: 13.9299, lon: 75.5681 },
  'tenali': { lat: 16.2420, lon: 80.6400 },
  'kaithal': { lat: 29.8015, lon: 76.3998 }
}

function getLocationCoords(location: string): { lat: number; lon: number } | null {
  const normalizedLocation = location.toLowerCase().trim()
  return locationCoords[normalizedLocation] || null
}

async function getSatelliteImagery(lat: number, lon: number, days: number = 30) {
  const apiKey = process.env.WEATHER_API_KEY
  if (!apiKey) {
    throw new Error('Weather API key not configured')
  }

  // Calculate date range (last 30 days)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)

  const start = Math.floor(startDate.getTime() / 1000)
  const end = Math.floor(endDate.getTime() / 1000)

  const url = `https://api.agromonitoring.com/agro/1.0/image/search?start=${start}&end=${end}&lat=${lat}&lon=${lon}&appid=${apiKey}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Satellite API error: ${response.status}`)
  }

  return await response.json()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') || 'New Delhi'
    const days = parseInt(searchParams.get('days') || '30')

    // Get coordinates for the location
    const coords = getLocationCoords(location)
    if (!coords) {
      return NextResponse.json({
        error: 'Location not found. Please provide a valid Indian city or state name.'
      }, { status: 400 })
    }

    // Fetch satellite imagery data
    const satelliteData = await getSatelliteImagery(coords.lat, coords.lon, days)

    // Process satellite data for farming insights
    const processedData = {
      location: `${location.charAt(0).toUpperCase() + location.slice(1)}, India`,
      coordinates: coords,
      imageCount: satelliteData.length,
      dateRange: {
        start: new Date((satelliteData[0]?.dt || Date.now() - 30 * 24 * 60 * 60 * 1000)).toISOString(),
        end: new Date().toISOString()
      },
      insights: {
        vegetationIndex: satelliteData.length > 0 ? 'Available' : 'No recent data',
        cropHealth: satelliteData.length > 0 ? 'Monitor vegetation indices for crop health' : 'Limited satellite data available',
        recommendations: [
          'Use satellite imagery to monitor crop growth patterns',
          'Compare vegetation indices across seasons',
          'Identify stressed crop areas for targeted intervention',
          'Track irrigation efficiency using satellite data'
        ]
      },
      images: satelliteData.slice(0, 10).map((image: any) => ({
        date: new Date(image.dt * 1000).toISOString().split('T')[0],
        type: image.type,
        satellite: image.satellite || 'Unknown',
        cloudCover: image.cl || 0,
        imageUrl: image.image || null
      }))
    }

    return NextResponse.json(processedData)

  } catch (error) {
    console.error('Satellite API error:', error)

    // Fallback response
    return NextResponse.json({
      location: 'New Delhi, India',
      error: 'Satellite data temporarily unavailable',
      insights: {
        vegetationIndex: 'Data unavailable',
        cropHealth: 'Please check back later',
        recommendations: [
          'Monitor crops manually for health indicators',
          'Use weather data for irrigation planning',
          'Consult local agricultural extension services'
        ]
      },
      images: []
    })
  }
}