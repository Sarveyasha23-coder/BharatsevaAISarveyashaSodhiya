import { NextRequest, NextResponse } from 'next/server'
import { huggingFaceChat } from '@/lib/huggingface'

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const response = await huggingFaceChat(message)

    // For now, we return the response in English
    // In a production app, you might want to translate responses based on language
    return NextResponse.json({
      response: response[0]?.generated_text || 'Sorry, I couldn\'t generate a response.',
      language: language || 'en-IN'
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}