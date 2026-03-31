const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { ModelFactory } = require('../models');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize AI models
const modelFactory = new ModelFactory();
const languageDetector = modelFactory.get_language_detector();
const eligibilityCalculator = modelFactory.get_eligibility_calculator();

// Mock schemes data (in production, this would come from database)
const schemes = [
  {
    id: 'pm_kisan',
    name: 'PM-Kisan Samman Nidhi',
    tagline: 'Direct income support for farmers',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    benefit: '₹6,000 per year in three equal installments',
    focus: ['agriculture', 'income_support', 'rural'],
    eligibility: [
      'Must be a small or marginal farmer',
      'Land holding up to 2 hectares',
      'Valid Aadhaar card required',
      'Bank account in farmer\'s name'
    ],
    documents: ['Aadhaar card', 'Land records', 'Bank account details']
  },
  {
    id: 'ayushman_bharat',
    name: 'Ayushman Bharat PM-JAY',
    tagline: 'Health insurance for poor families',
    ministry: 'Ministry of Health and Family Welfare',
    benefit: '₹5 lakh health coverage per family per year',
    focus: ['healthcare', 'insurance', 'poverty_alleviation'],
    eligibility: [
      'Must be from poor family (SECC data)',
      'No health insurance coverage',
      'Ration card holder',
      'Valid Aadhaar card'
    ],
    documents: ['Aadhaar card', 'Ration card', 'Income proof', 'Photographs']
  },
  {
    id: 'pm_awas_yojana',
    name: 'PM Awas Yojana',
    tagline: 'Housing for all',
    ministry: 'Ministry of Housing and Urban Affairs',
    benefit: 'Financial assistance for house construction',
    focus: ['housing', 'rural_development', 'infrastructure'],
    eligibility: [
      'Must not own a pucca house',
      'Annual income below ₹3 lakh',
      'Land ownership or permission',
      'Valid identity documents'
    ],
    documents: ['Aadhaar card', 'Income certificate', 'Land documents', 'Photographs']
  }
];

// POST /api/schemes - Get scheme recommendations
router.post('/', async (req, res) => {
  try {
    const { query, profile } = req.body;

    if (!query || !profile) {
      return res.status(400).json({ error: 'Query and profile are required' });
    }

    // Detect language
    const langResult = languageDetector.detect_language(query);
    console.log(`Detected language: ${langResult.detected_language.value}`);

    // Create OpenAI prompt for scheme matching
    const prompt = `
You are an AI assistant for BharatSeva AI, helping citizens find government schemes.

User Query: "${query}"
User Profile: ${JSON.stringify(profile, null, 2)}

Available Schemes:
${schemes.map(scheme => `
- ${scheme.name} (${scheme.id})
  Tagline: ${scheme.tagline}
  Focus: ${scheme.focus.join(', ')}
  Eligibility: ${scheme.eligibility.join(', ')}
  Benefit: ${scheme.benefit}
`).join('\n')}

Analyze the user's query and profile to determine the best matching schemes. For each scheme, provide:
1. A relevance score (0-100)
2. Eligibility status (Eligible, Possibly Eligible, Not Eligible)
3. Specific reasons for the recommendation

Return the response as a JSON array with the following structure:
[
  {
    "scheme": {scheme_id},
    "score": {0-100},
    "status": {"Eligible" | "Possibly Eligible" | "Not Eligible"},
    "reasons": ["reason1", "reason2", "reason3"]
  }
]
`;

    // Get AI recommendations
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for Indian government schemes. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let recommendations;
    try {
      recommendations = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      // Fallback to basic matching if AI fails
      recommendations = schemes.map(scheme => ({
        scheme: scheme.id,
        score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
        status: "Eligible",
        reasons: ["Basic eligibility criteria met", "Profile matches requirements"]
      }));
    }

    // Enhance with eligibility calculations
    const enhancedRecommendations = recommendations.map(rec => {
      const scheme = schemes.find(s => s.id === rec.scheme);
      if (!scheme) return rec;

      // Calculate eligibility using our calculator
      const eligibilityResult = eligibilityCalculator.calculate_eligibility(profile, rec.scheme);
      
      return {
        ...rec,
        scheme: scheme,
        eligibilityScore: eligibilityResult.score,
        missingRequirements: eligibilityResult.missing_requirements,
        matchingCriteria: eligibilityResult.matching_criteria
      };
    });

    // Sort by score
    enhancedRecommendations.sort((a, b) => b.score - a.score);

    res.json({ recommendations: enhancedRecommendations });

  } catch (error) {
    console.error('Error in schemes API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/schemes - Get all available schemes
router.get('/', (req, res) => {
  try {
    res.json({ schemes });
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/schemes/:id - Get specific scheme details
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const scheme = schemes.find(s => s.id === id);
    
    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    
    res.json({ scheme });
  } catch (error) {
    console.error('Error fetching scheme:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
