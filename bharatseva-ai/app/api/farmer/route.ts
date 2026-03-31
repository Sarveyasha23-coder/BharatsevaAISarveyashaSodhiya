import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

const farmerPrompt = `You are Kisan Mitra, an expert AI agricultural assistant for Indian farmers. You provide:

1. **Crop Recommendations**: Based on soil type, climate, season, and location
2. **Weather Analysis**: Current weather, forecasts, and farming advice
3. **Disease & Pest Management**: Identification and treatment advice
4. **Market Prices**: Current MSP rates and market trends
5. **Government Schemes**: Farming-related subsidies and programs
6. **Sustainable Practices**: Organic farming, water conservation, soil health
7. **Technology Integration**: Modern farming techniques and tools

Always respond in Hindi and English, be helpful, accurate, and culturally sensitive to Indian farming context.

Current Indian agricultural data:
- Major crops: Rice, Wheat, Cotton, Sugarcane, Maize, Pulses, Oilseeds
- Seasons: Kharif (June-Oct), Rabi (Nov-April), Zaid (March-June)
- States: Focus on major agricultural states like Punjab, Haryana, UP, Maharashtra, Karnataka, Tamil Nadu, Andhra Pradesh, West Bengal

Provide practical, actionable advice based on scientific agricultural knowledge.`

export async function POST(request: NextRequest) {
  try {
    const { message, location, crop, season } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Enhanced prompt with user context
    const enhancedPrompt = `${farmerPrompt}

User Context:
- Location: ${location || 'Not specified'}
- Current Crop: ${crop || 'Not specified'}
- Season: ${season || 'Not specified'}
- Query: ${message}

Provide a comprehensive response in both Hindi and English, including:
1. Direct answer to the query
2. Practical recommendations
3. Relevant government schemes if applicable
4. Safety precautions if relevant
5. Follow-up questions to gather more information

Response format: Mix Hindi and English naturally, use simple language.`

    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: enhancedPrompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        do_sample: true,
        return_full_text: false
      }
    })

    // Fetch real weather data
    let weatherData = null
    let soilData = null

    try {
      if (location) {
        const weatherResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/weather?location=${encodeURIComponent(location)}`)
        if (weatherResponse.ok) {
          const weatherResult = await weatherResponse.json()
          weatherData = {
            temperature: `${weatherResult.temperature}°C`,
            humidity: `${weatherResult.humidity}%`,
            rainfall: weatherResult.condition.includes('rain') ? 'Expected' : 'Low',
            forecast: weatherResult.agricultural?.warnings?.join(', ') || weatherResult.condition
          }
          soilData = weatherResult.agricultural?.soilData
        }
      }
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
    }

    // Mock agricultural data for demonstration (enhanced with real data where available)
    const mockData = {
      weather: weatherData || {
        temperature: '28°C',
        humidity: '65%',
        rainfall: '2.5mm',
        forecast: 'Sunny with occasional showers'
      },
      marketPrices: {
        wheat: '₹2,200/quintal',
        rice: '₹2,800/quintal',
        cotton: '₹6,500/quintal'
      },
      schemes: [
        'PM-KISAN - Direct income support',
        'Pradhan Mantri Fasal Bima Yojana - Crop insurance',
        'Soil Health Card Scheme - Free soil testing'
      ],
      soilData: soilData || null
    }

    return NextResponse.json({
      response: response.generated_text,
      data: mockData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Farmer AI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process farmer query' },
      { status: 500 }
    )
  }
}

// GET endpoint for farmer data
export async function GET() {
  const mockFarmerData = {
    crops: [
      { name: 'गेहूं (Wheat)', season: 'Rabi', states: ['Punjab', 'Haryana', 'UP'] },
      { name: 'धान (Rice)', season: 'Kharif', states: ['Punjab', 'West Bengal', 'UP'] },
      { name: 'कपास (Cotton)', season: 'Kharif', states: ['Maharashtra', 'Gujarat', 'Andhra Pradesh'] },
      { name: 'गन्ना (Sugarcane)', season: 'Annual', states: ['UP', 'Maharashtra', 'Karnataka'] },
      { name: 'मक्का (Maize)', season: 'Kharif', states: ['Karnataka', 'Maharashtra', 'Bihar'] }
    ],
    weatherStations: [
      { city: 'Delhi', temp: 28, humidity: 65, rainfall: 2.5 },
      { city: 'Mumbai', temp: 32, humidity: 75, rainfall: 0.8 },
      { city: 'Chennai', temp: 30, humidity: 70, rainfall: 1.2 }
    ],
    marketPrices: {
      wheat: { msp: 2200, current: 2150 },
      rice: { msp: 2800, current: 2750 },
      cotton: { msp: 6500, current: 6400 }
    }
  }

  return NextResponse.json(mockFarmerData)
}