import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

const fraudPrompt = `You are Fraud Shield AI, an expert cybersecurity assistant specializing in fraud detection for Indian citizens. You analyze:

1. **Message Analysis**: SMS, email, and social media messages for scams
2. **Call Screening**: Suspicious phone calls and caller verification
3. **Financial Fraud**: Banking scams, investment fraud, lottery scams
4. **Identity Theft**: Protection against identity fraud and phishing
5. **Online Safety**: Social engineering attacks and cyber threats
6. **Government Alerts**: Latest scam warnings from authorities
7. **Reporting**: How to report fraud to cybercrime units

Common Indian scams to watch for:
- Bank account verification calls
- Lottery/inheritance scams
- Investment fraud (crypto, stocks)
- Job offer scams
- Romance scams
- Tech support scams
- Government impersonation (CBDT, Police, etc.)

Always respond in Hindi and English. Be direct, factual, and helpful. When analyzing messages, provide:
- Risk level (Low/Medium/High/Critical)
- Specific red flags identified
- Why it's suspicious
- Recommended actions
- Official reporting channels`

// Mock common scams data
const commonScams = [
  {
    id: '1',
    title: 'Bank Verification Scam',
    description: 'Fake calls claiming to be from your bank asking for account verification',
    riskLevel: 'High',
    reportedCases: '2,450',
    lastReported: '2024-03-28'
  },
  {
    id: '2',
    title: 'Lottery Win Scam',
    description: 'Messages claiming you won a lottery and need to pay processing fees',
    riskLevel: 'High',
    reportedCases: '1,890',
    lastReported: '2024-03-27'
  },
  {
    id: '3',
    title: 'Investment Fraud',
    description: 'Promises of high returns on fake investment schemes',
    riskLevel: 'Critical',
    reportedCases: '3,120',
    lastReported: '2024-03-26'
  },
  {
    id: '4',
    title: 'Tech Support Scam',
    description: 'Calls claiming your computer has a virus and needs immediate fixing',
    riskLevel: 'Medium',
    reportedCases: '980',
    lastReported: '2024-03-25'
  },
  {
    id: '5',
    title: 'Job Offer Scam',
    description: 'Fake job offers requiring payment for processing or training',
    riskLevel: 'Medium',
    reportedCases: '1,340',
    lastReported: '2024-03-24'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { message, messageType, phoneNumber, url } = await request.json()

    if (!message && !phoneNumber && !url) {
      return NextResponse.json({ error: 'Message, phone number, or URL is required' }, { status: 400 })
    }

    // Enhanced prompt with analysis context
    const enhancedPrompt = `${fraudPrompt}

Analysis Request:
- Message/Content: ${message || 'Not provided'}
- Type: ${messageType || 'General message'}
- Phone Number: ${phoneNumber || 'Not provided'}
- URL: ${url || 'Not provided'}

Provide a comprehensive fraud analysis with:
1. Risk Assessment (Low/Medium/High/Critical)
2. Detailed Analysis of suspicious elements
3. Specific red flags and scam patterns
4. Recommended actions for the user
5. Official channels to report if fraudulent
6. Prevention tips

Response format: Structure clearly with headings, use bullet points for analysis.`

    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: enhancedPrompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.3, // Lower temperature for more factual analysis
        do_sample: true,
        return_full_text: false
      }
    })

    // Mock fraud analysis data
    const mockAnalysis = {
      riskLevel: message?.toLowerCase().includes('lottery') || message?.toLowerCase().includes('bank') ? 'High' : 'Low',
      redFlags: [
        'Unsolicited contact',
        'Requests for personal information',
        'Urgency or pressure tactics',
        'Promises of easy money'
      ],
      scamType: 'Potential Financial Scam',
      recommendations: [
        'Do not share personal information',
        'Verify through official channels',
        'Report to cybercrime authorities',
        'Block the sender'
      ]
    }

    return NextResponse.json({
      analysis: response.generated_text,
      riskAssessment: mockAnalysis,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Fraud Shield API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    )
  }
}

// GET endpoint for fraud statistics and common scams
export async function GET() {
  const mockFraudData = {
    commonScams: [
      {
        type: 'Bank Verification Scam',
        description: 'Fake calls claiming to be from your bank asking for OTP/card details',
        redFlags: ['Unsolicited calls', 'Requests for OTP', 'Threats of account closure'],
        prevention: 'Never share OTP, verify bank details independently'
      },
      {
        type: 'Lottery/Inheritance Scam',
        description: 'Messages claiming you won lottery or inherited money',
        redFlags: ['Unexpected winnings', 'Requests for processing fees', 'Foreign senders'],
        prevention: 'No legitimate lottery requires upfront payment'
      },
      {
        type: 'Investment Fraud',
        description: 'Promises of high returns on investments in crypto/stocks',
        redFlags: ['Guaranteed returns', 'Pressure to invest quickly', 'Unregistered platforms'],
        prevention: 'Check SEBI registration, consult financial advisors'
      },
      {
        type: 'Job Offer Scam',
        description: 'Fake job offers requiring payment for processing/training',
        redFlags: ['Requests for money', 'No interview process', 'Too good to be true offers'],
        prevention: 'Verify company details, never pay for jobs'
      }
    ],
    reportingChannels: {
      cybercrime: '1930 (Delhi Police Cyber Cell)',
      banking: 'Call your bank helpline',
      incomeTax: 'CBDT website or local office',
      general: 'cybercrime.gov.in'
    },
    statistics: {
      reportedScams2023: '2.2 lakh',
      financialLoss: '₹1,200 crores',
      mostCommon: 'Banking/Financial scams'
    }
  }

  return NextResponse.json(mockFraudData)
}