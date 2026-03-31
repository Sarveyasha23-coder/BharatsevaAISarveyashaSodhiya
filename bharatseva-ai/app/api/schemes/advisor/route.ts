import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

// Mock scheme data with detailed information
const schemesData = [
  {
    id: 'pm-awas-yojana',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    category: 'Housing',
    description: 'Government scheme for affordable housing for all by 2022',
    eligibility: [
      'Annual family income less than ₹3 lakh for EWS category',
      'Annual family income between ₹3-6 lakh for LIG category',
      'Annual family income between ₹6-18 lakh for MIG category',
      'No pucca house in name of any family member',
      'Must be Indian citizen'
    ],
    benefits: [
      'Subsidy up to ₹2.67 lakh for EWS category',
      'Subsidy up to ₹2.35 lakh for LIG category',
      'Subsidy up to ₹2.30 lakh for MIG category',
      'Interest subsidy on home loans',
      'Quality construction assurance'
    ],
    documents: [
      'Aadhaar Card',
      'Income Certificate',
      'Caste Certificate (if applicable)',
      'Bank Account Details',
      'Property Documents',
      'Identity Proof'
    ],
    applicationProcess: [
      'Visit PMAY website or nearest bank',
      'Fill online application form',
      'Upload required documents',
      'Get application number',
      'Wait for approval and subsidy disbursement'
    ],
    states: ['All India'],
    targetAudience: ['Economically Weaker Section', 'Lower Income Group', 'Middle Income Group'],
    applicationUrl: 'https://pmaymis.gov.in/',
    helpline: '1800-11-6166'
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PMJAY)',
    category: 'Health',
    description: 'World\'s largest health insurance scheme covering ₹5 lakh per family',
    eligibility: [
      'Must be Indian citizen',
      'Identified through Socio-Economic Caste Census (SECC) 2011',
      'No other health insurance coverage',
      'Family size up to 5 members'
    ],
    benefits: [
      '₹5 lakh coverage per family per year',
      'Cashless treatment at empaneled hospitals',
      'Coverage for 1,350 medical procedures',
      'Pre and post hospitalization expenses',
      'No cap on family size for additional members'
    ],
    documents: [
      'Ayushman Bharat Card',
      'Aadhaar Card',
      'Ration Card',
      'Income Certificate',
      'Identity Proof'
    ],
    applicationProcess: [
      'Check eligibility on official website',
      'Visit nearest CSC center or hospital',
      'Get Ayushman Bharat card issued',
      'Use card at empaneled hospitals for treatment'
    ],
    states: ['All India'],
    targetAudience: ['Economically Weaker Section', 'Low Income Families'],
    applicationUrl: 'https://pmjay.gov.in/',
    helpline: '14555'
  },
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    category: 'Agriculture',
    description: 'Income support scheme providing ₹6,000 per year to farmers',
    eligibility: [
      'Must be Indian citizen',
      'Own cultivable land',
      'Farmer family with landholding up to 2 hectares',
      'Not covered under other government schemes'
    ],
    benefits: [
      '₹2,000 every 4 months (total ₹6,000 per year)',
      'Direct bank transfer',
      'No middlemen involved',
      'Support for 14.5 crore farmer families'
    ],
    documents: [
      'Aadhaar Card',
      'Bank Account Details',
      'Land Records',
      'Identity Proof',
      'Recent Photograph'
    ],
    applicationProcess: [
      'Visit nearest CSC center',
      'Fill PM-KISAN application form',
      'Upload Aadhaar and bank details',
      'Get application verified',
      'Receive payment in bank account'
    ],
    states: ['All India'],
    targetAudience: ['Small and Marginal Farmers'],
    applicationUrl: 'https://pmkisan.gov.in/',
    helpline: '155261 / 1800115526'
  }
]

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { query, userId, location } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Find matching schemes based on query
    const matchingSchemes = schemesData.filter(scheme =>
      scheme.name.toLowerCase().includes(query.toLowerCase()) ||
      scheme.description.toLowerCase().includes(query.toLowerCase()) ||
      scheme.category.toLowerCase().includes(query.toLowerCase())
    )

    if (matchingSchemes.length === 0) {
      return NextResponse.json({
        message: 'No matching schemes found. Please try different keywords.',
        suggestions: ['PM Awas Yojana', 'Ayushman Bharat', 'PM Kisan', 'Housing', 'Health', 'Agriculture']
      })
    }

    // Get user details for personalization
    let user = null
    if (userId) {
      user = await User.findById(userId).select('name email')
    }

    // Return detailed scheme information
    const response = {
      schemes: matchingSchemes,
      user: user,
      location: location || 'India',
      totalFound: matchingSchemes.length,
      message: `Found ${matchingSchemes.length} relevant scheme(s) for your query.`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Scheme advisor error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const state = searchParams.get('state')
  const target = searchParams.get('target')

  let filteredSchemes = schemesData

  if (category) {
    filteredSchemes = filteredSchemes.filter(scheme =>
      scheme.category.toLowerCase() === category.toLowerCase()
    )
  }

  if (state && state !== 'All India') {
    filteredSchemes = filteredSchemes.filter(scheme =>
      scheme.states.includes(state) || scheme.states.includes('All India')
    )
  }

  if (target) {
    filteredSchemes = filteredSchemes.filter(scheme =>
      scheme.targetAudience.some(audience =>
        audience.toLowerCase().includes(target.toLowerCase())
      )
    )
  }

  return NextResponse.json({
    schemes: filteredSchemes,
    total: filteredSchemes.length
  })
}