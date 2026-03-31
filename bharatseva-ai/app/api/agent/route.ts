import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

const agentPrompt = `You are AI Agent, an intelligent personal assistant for Indian citizens using Bharat Seva AI. You analyze user behavior, preferences, and data to provide personalized recommendations across all government services.

Your capabilities:
1. **Personalized Recommendations**: Suggest relevant schemes based on user profile
2. **Cross-Service Intelligence**: Connect information across health, farming, schemes, etc.
3. **Proactive Suggestions**: Anticipate user needs and provide timely advice
4. **Data-Driven Insights**: Analyze usage patterns for better recommendations
5. **Multilingual Support**: Communicate in user's preferred language
6. **Privacy-First**: Handle all data securely and with user consent

User data you can access:
- Location and district information
- Age, gender, income bracket
- Previously viewed schemes and services
- Language preferences
- Usage patterns and interests
- Health/farming context (if shared)

Always provide:
1. **Personalized Recommendations**: Tailored to user's specific situation
2. **Actionable Insights**: Clear next steps and benefits
3. **Cross-Service Connections**: How different services can work together
4. **Privacy Assurance**: Remind users about data security
5. **Follow-up Suggestions**: What to check next based on current activity

Response format: Natural, conversational, helpful. Use Hindi/English mix based on user preference.`

export async function POST(request: NextRequest) {
  try {
    const {
      userProfile,
      recentActivity,
      currentContext,
      preferences
    } = await request.json()

    // Enhanced prompt with user context
    const enhancedPrompt = `${agentPrompt}

User Profile Analysis:
- Location: ${userProfile?.location || 'Not specified'}
- Age: ${userProfile?.age || 'Not specified'}
- Income: ${userProfile?.income || 'Not specified'}
- Occupation: ${userProfile?.occupation || 'Not specified'}
- Language: ${preferences?.language || 'Hindi/English'}

Recent Activity:
${recentActivity?.map((activity: any) => `- ${activity.action}: ${activity.details}`).join('\n') || 'No recent activity'}

Current Context: ${currentContext || 'General browsing'}

Based on this comprehensive user data, provide:
1. **Top 3 Personalized Recommendations** with specific benefits
2. **Urgent Actions** if any deadlines or opportunities
3. **Service Connections** showing how different AI assistants can help
4. **Next Best Actions** for maximum benefit
5. **Privacy & Security Notes**

Make recommendations specific, actionable, and culturally relevant for Indian users.`

    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: enhancedPrompt,
      parameters: {
        max_new_tokens: 700,
        temperature: 0.7,
        do_sample: true,
        return_full_text: false
      }
    })

    // Mock personalized recommendations based on user profile
    const mockRecommendations = {
      topRecommendations: [
        {
          title: 'PM-KISAN Direct Benefit Transfer',
          description: 'Based on your farming activity, you may be eligible for ₹6,000 annual support',
          service: 'Kisan Mitra',
          urgency: 'high',
          benefit: '₹6,000/year direct to bank'
        },
        {
          title: 'Ayushman Bharat Health Coverage',
          description: 'Free health insurance up to ₹5 lakh based on your location and profile',
          service: 'Ayushman Assistant',
          urgency: 'medium',
          benefit: '₹5 lakh health coverage'
        },
        {
          title: 'Skill Development Program',
          description: 'Government training programs matching your interests and location',
          service: 'Location Intelligence',
          urgency: 'low',
          benefit: 'Free skill training'
        }
      ],
      urgentActions: [
        'Check PM-KISAN eligibility before March 31st deadline',
        'Update Aadhaar details for seamless service access'
      ],
      serviceConnections: {
        farming: ['Kisan Mitra', 'Location Intelligence', 'Scheme Advisor'],
        health: ['Ayushman Assistant', 'Location Intelligence', 'Fraud Shield'],
        general: ['Voice Assistant', 'Document OCR', 'Live Dashboard']
      },
      nextSteps: [
        'Complete your profile for better recommendations',
        'Enable location services for local opportunities',
        'Set up notifications for important deadlines'
      ]
    }

    return NextResponse.json({
      response: response.generated_text,
      recommendations: mockRecommendations,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Agent API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

// GET endpoint for agent capabilities
export async function GET() {
  const agentCapabilities = {
    services: [
      'Personalized Scheme Recommendations',
      'Cross-Service Intelligence',
      'Proactive Notifications',
      'Usage Pattern Analysis',
      'Multilingual Communication',
      'Privacy-First Recommendations'
    ],
    dataSources: [
      'User Profile Information',
      'Location & District Data',
      'Service Usage History',
      'Government Scheme Database',
      'Local Opportunity Data',
      'Language Preferences'
    ],
    recommendationTypes: [
      {
        type: 'Financial Schemes',
        examples: ['PM-KISAN', 'Ayushman Bharat', 'Skill Development']
      },
      {
        type: 'Health Services',
        examples: ['Hospital Recommendations', 'Health Insurance', 'Telemedicine']
      },
      {
        type: 'Local Opportunities',
        examples: ['District Schemes', 'Job Opportunities', 'Training Programs']
      },
      {
        type: 'Digital Services',
        examples: ['Document Processing', 'Form Auto-fill', 'Security Checks']
      }
    ]
  }

  return NextResponse.json(agentCapabilities)
}