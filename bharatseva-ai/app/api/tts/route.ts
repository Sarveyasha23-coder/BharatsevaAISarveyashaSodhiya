import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    console.log("TTS API called")
    const { text } = await req.json()
    console.log("Text received:", text)

    if (!text) {
      console.log("No text provided")
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY
    console.log("API Key exists:", !!apiKey)

    if (!apiKey) {
      console.log("No API key configured")
      return NextResponse.json({ error: "Hugging Face API key not configured" }, { status: 500 })
    }

    console.log("Making request to Hugging Face API")
    const response = await fetch(
      "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: text
        })
      }
    )

    console.log("Hugging Face response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Hugging Face API error:", errorText)

      // Fallback: return a simple success response for testing
      return NextResponse.json({
        success: false,
        error: "TTS service temporarily unavailable",
        fallback: true,
        message: "Please use browser TTS for now"
      }, { status: 503 })
    }

    console.log("Getting response data")
    const data = await response.arrayBuffer()
    console.log("Data received, size:", data.byteLength)

    if (data.byteLength === 0) {
      console.log("Empty response, using fallback")
      return NextResponse.json({
        success: false,
        error: "Empty audio response",
        fallback: true
      }, { status: 503 })
    }

    console.log("Returning audio response")
    return new Response(data, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': data.byteLength.toString(),
        'Cache-Control': 'no-cache'
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("TTS API error:", error)

    // Fallback response
    return NextResponse.json({
      success: false,
      error: "TTS service error",
      details: message,
      fallback: true
    }, { status: 500 })
  }
}
