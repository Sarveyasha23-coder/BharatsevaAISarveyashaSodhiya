import { NextRequest, NextResponse } from 'next/server'

// Crop-specific advice based on weather and soil conditions
const cropAdvice = {
  rice: {
    optimalTemp: { min: 20, max: 35 },
    optimalHumidity: { min: 60, max: 90 },
    soilMoisture: { min: 0.3, max: 0.8 },
    advice: {
      highTemp: 'Rice is heat-tolerant but ensure adequate water supply. Consider early morning irrigation.',
      lowTemp: 'Cold stress possible. Protect seedlings with mulch or temporary covers.',
      highHumidity: 'Monitor for fungal diseases. Apply preventive fungicides if needed.',
      lowHumidity: 'Increase irrigation frequency. Consider sprinkler irrigation.',
      drought: 'Rice needs standing water. Ensure proper field flooding.',
      excessRain: 'Improve drainage to prevent waterlogging and root rot.'
    }
  },
  wheat: {
    optimalTemp: { min: 15, max: 25 },
    optimalHumidity: { min: 40, max: 70 },
    soilMoisture: { min: 0.2, max: 0.6 },
    advice: {
      highTemp: 'Heat stress possible during grain filling. Ensure adequate irrigation.',
      lowTemp: 'Frost damage risk. Cover crops during cold nights.',
      highHumidity: 'Monitor for rust diseases. Apply fungicides preventively.',
      lowHumidity: 'Wheat tolerates dry conditions but irrigate during critical stages.',
      drought: 'Wheat is drought-tolerant but yields may reduce. Irrigate at crown root initiation.',
      excessRain: 'Ensure good drainage to prevent root diseases.'
    }
  },
  cotton: {
    optimalTemp: { min: 25, max: 35 },
    optimalHumidity: { min: 50, max: 80 },
    soilMoisture: { min: 0.3, max: 0.7 },
    advice: {
      highTemp: 'Cotton prefers warm weather. Good for boll development.',
      lowTemp: 'Cold stress can affect flowering. Protect young plants.',
      highHumidity: 'Monitor for boll rot. Ensure good air circulation.',
      lowHumidity: 'Cotton tolerates dry conditions. Irrigate at flowering and boll formation.',
      drought: 'Cotton is moderately drought-tolerant. Irrigate at squaring and flowering.',
      excessRain: 'Poor drainage can cause root rot. Ensure raised beds.'
    }
  },
  sugarcane: {
    optimalTemp: { min: 25, max: 35 },
    optimalHumidity: { min: 60, max: 85 },
    soilMoisture: { min: 0.4, max: 0.8 },
    advice: {
      highTemp: 'Sugarcane thrives in warm conditions. Ensure adequate irrigation.',
      lowTemp: 'Frost can damage cane. Protect with windbreaks.',
      highHumidity: 'Good for sugarcane growth. Monitor for fungal diseases.',
      lowHumidity: 'Increase irrigation. Sugarcane needs consistent moisture.',
      drought: 'Sugarcane is drought-sensitive. Maintain soil moisture above 60%.',
      excessRain: 'Ensure proper drainage to prevent waterlogging.'
    }
  },
  maize: {
    optimalTemp: { min: 20, max: 30 },
    optimalHumidity: { min: 50, max: 80 },
    soilMoisture: { min: 0.3, max: 0.7 },
    advice: {
      highTemp: 'Heat stress possible during tasseling. Ensure pollination.',
      lowTemp: 'Cold stress can affect germination. Wait for soil warming.',
      highHumidity: 'Monitor for fungal diseases on leaves and ears.',
      lowHumidity: 'Maize needs good moisture during silking and grain filling.',
      drought: 'Critical during tasseling and silking. Irrigate immediately.',
      excessRain: 'Ensure good drainage. Waterlogging can cause root rot.'
    }
  }
}

function getCropAdvice(crop: string, temperature: number, humidity: number, soilMoisture: number, rainfall: string) {
  const cropData = cropAdvice[crop.toLowerCase() as keyof typeof cropAdvice]
  if (!cropData) {
    return {
      general: 'Please specify a supported crop (rice, wheat, cotton, sugarcane, maize)',
      recommendations: []
    }
  }

  const advice = []
  const warnings = []

  // Temperature analysis
  if (temperature > cropData.optimalTemp.max) {
    advice.push(cropData.advice.highTemp)
    warnings.push('High temperature stress')
  } else if (temperature < cropData.optimalTemp.min) {
    advice.push(cropData.advice.lowTemp)
    warnings.push('Low temperature stress')
  }

  // Humidity analysis
  if (humidity > cropData.optimalHumidity.max) {
    advice.push(cropData.advice.highHumidity)
    warnings.push('High humidity - disease risk')
  } else if (humidity < cropData.optimalHumidity.min) {
    advice.push(cropData.advice.lowHumidity)
    warnings.push('Low humidity - irrigation needed')
  }

  // Soil moisture analysis
  if (soilMoisture < cropData.soilMoisture.min) {
    advice.push(cropData.advice.drought)
    warnings.push('Drought stress - irrigate immediately')
  } else if (soilMoisture > cropData.soilMoisture.max) {
    advice.push(cropData.advice.excessRain)
    warnings.push('Excess moisture - improve drainage')
  }

  // Rainfall consideration
  if (rainfall.toLowerCase().includes('rain') || rainfall.toLowerCase().includes('shower')) {
    advice.push('Recent rainfall detected. Monitor soil drainage and prevent waterlogging.')
  }

  return {
    crop: crop.charAt(0).toUpperCase() + crop.slice(1),
    conditions: {
      temperature: `${temperature}°C (Optimal: ${cropData.optimalTemp.min}-${cropData.optimalTemp.max}°C)`,
      humidity: `${humidity}% (Optimal: ${cropData.optimalHumidity.min}-${cropData.optimalHumidity.max}%)`,
      soilMoisture: `${(soilMoisture * 100).toFixed(1)}% (Optimal: ${(cropData.soilMoisture.min * 100).toFixed(1)}-${(cropData.soilMoisture.max * 100).toFixed(1)}%)`
    },
    recommendations: advice.length > 0 ? advice : ['Conditions are favorable for crop growth. Continue standard practices.'],
    warnings: warnings,
    nextSteps: [
      'Monitor crop health daily',
      'Adjust irrigation based on soil moisture',
      'Apply fertilizers at recommended stages',
      'Scout for pests and diseases regularly'
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const crop = searchParams.get('crop')
    const location = searchParams.get('location') || 'New Delhi'

    if (!crop) {
      return NextResponse.json({
        error: 'Crop parameter is required. Supported crops: rice, wheat, cotton, sugarcane, maize'
      }, { status: 400 })
    }

    // Fetch current weather and soil data
    const weatherResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/weather?location=${encodeURIComponent(location)}`)
    if (!weatherResponse.ok) {
      return NextResponse.json({
        error: 'Unable to fetch weather data for location'
      }, { status: 500 })
    }

    const weatherData = await weatherResponse.json()

    // Extract relevant data
    const temperature = weatherData.temperature
    const humidity = weatherData.humidity
    const soilMoisture = weatherData.agricultural?.soilData?.moisture || 0.5 // Default moisture
    const rainfall = weatherData.condition

    // Generate crop-specific advice
    const advice = getCropAdvice(crop, temperature, humidity, soilMoisture, rainfall)

    return NextResponse.json({
      location: weatherData.location,
      crop: advice.crop,
      currentConditions: advice.conditions,
      analysis: {
        recommendations: advice.recommendations,
        warnings: advice.warnings,
        nextSteps: advice.nextSteps
      },
      farmingTips: [
        'Always test soil before planting',
        'Use integrated pest management',
        'Maintain proper crop rotation',
        'Keep records of farming activities',
        'Consult local agricultural extension services'
      ],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Crop advice API error:', error)
    return NextResponse.json({
      error: 'Failed to generate crop advice',
      fallback: {
        general: 'Monitor weather conditions and soil moisture regularly',
        recommendations: [
          'Irrigate based on crop water requirements',
          'Apply fertilizers at recommended times',
          'Protect crops from extreme weather',
          'Consult local agricultural experts'
        ]
      }
    }, { status: 500 })
  }
}