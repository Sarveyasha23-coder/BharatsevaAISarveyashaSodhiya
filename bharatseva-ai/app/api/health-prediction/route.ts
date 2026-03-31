import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const symptoms = await request.json()

    if (!symptoms || typeof symptoms !== 'object') {
      return NextResponse.json(
        { error: 'Symptoms data is required' },
        { status: 400 }
      )
    }

    // Call the Python Flask API
    const flaskResponse = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(symptoms),
    })

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json()
      return NextResponse.json(
        {
          error: 'Prediction service unavailable',
          details: errorData.error || 'Unknown error'
        },
        { status: flaskResponse.status }
      )
    }

    const predictionResult = await flaskResponse.json()

    // Add additional context and recommendations
    const enhancedResult = {
      ...predictionResult,
      additional_info: {
        emergency_contact: "Dial 108 for Ambulance or 102 for Health Helpline",
        nearest_hospital: "Use location services to find nearest government hospital",
        telemedicine: "Access eSanjeevani platform for virtual consultation",
        schemes: [
          "Ayushman Bharat PMJAY - Free treatment up to ₹5 lakh",
          "State Health Insurance Schemes",
          "Central Government Health Scheme (CGHS)"
        ]
      },
      timestamp: new Date().toISOString(),
      disclaimer: "⚠️ यह AI आधारित प्रारंभिक मूल्यांकन है। कृपया योग्य चिकित्सक से परामर्श लें।"
    }

    return NextResponse.json(enhancedResult)

  } catch (error) {
    console.error('Health prediction API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Unable to process health prediction request'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get available symptoms from Flask API
    const symptomsResponse = await fetch('http://localhost:5000/symptoms')

    if (!symptomsResponse.ok) {
      return NextResponse.json(
        { error: 'Symptoms service unavailable' },
        { status: 500 }
      )
    }

    const symptomsData = await symptomsResponse.json()

    // Get diseases information
    const diseasesResponse = await fetch('http://localhost:5000/diseases')

    if (!diseasesResponse.ok) {
      return NextResponse.json(
        { error: 'Diseases service unavailable' },
        { status: 500 }
      )
    }

    const diseasesData = await diseasesResponse.json()

    return NextResponse.json({
      symptoms: symptomsData.symptoms,
      diseases: diseasesData.diseases,
      disease_info: diseasesData.disease_info,
      status: 'active'
    })

  } catch (error) {
    console.error('Health prediction GET error:', error)
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 500 }
    )
  }
}