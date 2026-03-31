import {
  ApplicationPayload,
  ApplicationReceipt,
  CitizenProfile,
  Scheme,
  SchemeRecommendation,
} from "@/lib/types";

export const sampleProfile: CitizenProfile = {
  fullName: "Sita Devi",
  age: 39,
  state: "Uttar Pradesh",
  district: "Varanasi",
  annualIncome: 108000,
  occupation: "farmer",
  language: "Hindi",
  landHoldingAcres: 1.8,
  isRural: true,
  hasRationCard: true,
  hasHealthCoverage: false,
  aadhaarLinked: true,
};

export const schemes: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN",
    tagline: "Direct income support for small and marginal farmers",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    focus: ["Agriculture", "Direct Benefit Transfer", "Rural"],
    languages: ["Hindi", "English", "Marathi", "Bengali"],
    benefit: "Rs. 6,000 per year paid in three installments to eligible farmers.",
    eligibility: [
      "Citizen must be engaged in farming",
      "Landholding should be recorded",
      "Aadhaar linkage improves approval speed"
    ],
    documents: ["Aadhaar", "Land record", "Bank passbook"],
    matchTerms: ["farmer", "kisan", "crop", "agriculture", "income support"]
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    tagline: "Cashless health insurance cover for vulnerable families",
    ministry: "National Health Authority",
    focus: ["Healthcare", "Insurance", "Family Welfare"],
    languages: ["Hindi", "English", "Tamil", "Bengali"],
    benefit: "Up to Rs. 5 lakh annual health cover per eligible family.",
    eligibility: [
      "Priority for vulnerable and low-income households",
      "Ration card or socio-economic verification improves match confidence",
      "Best fit for families without health coverage"
    ],
    documents: ["Aadhaar", "Ration card", "Mobile number"],
    matchTerms: ["hospital", "health", "insurance", "treatment", "medical"]
  },
  {
    id: "pmay-g",
    name: "PMAY-G",
    tagline: "Affordable housing support for rural households",
    ministry: "Ministry of Rural Development",
    focus: ["Housing", "Rural Empowerment", "Infrastructure"],
    languages: ["Hindi", "English", "Marathi"],
    benefit: "Financial assistance for pucca house construction in rural areas.",
    eligibility: [
      "Rural household with housing need",
      "Income-sensitive targeting",
      "Priority for underserved families"
    ],
    documents: ["Aadhaar", "Residence proof", "Bank details"],
    matchTerms: ["house", "home", "housing", "rural house", "shelter"]
  },
  {
    id: "pmegp",
    name: "PMEGP",
    tagline: "Credit-linked subsidy for micro-enterprise creation",
    ministry: "Ministry of MSME",
    focus: ["Entrepreneurship", "MSME", "Self Employment"],
    languages: ["Hindi", "English", "Tamil", "Marathi"],
    benefit: "Subsidy-backed loan support for new village and urban enterprises.",
    eligibility: [
      "Citizen wants to start a new micro-enterprise",
      "Suitable for self-employment and rural businesses",
      "Basic project idea and identity documents needed"
    ],
    documents: ["Aadhaar", "Project summary", "Bank details"],
    matchTerms: ["business", "shop", "enterprise", "loan", "self employment"]
  }
];

export function searchSchemes(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return schemes;
  }

  return [...schemes]
    .map((scheme) => {
      const score =
        scheme.matchTerms.reduce((total, term) => total + (normalized.includes(term) ? 2 : 0), 0) +
        (scheme.name.toLowerCase().includes(normalized) ? 3 : 0) +
        (scheme.focus.join(" ").toLowerCase().includes(normalized) ? 1 : 0);

      return { scheme, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .map(({ scheme }) => scheme);
}

export function recommendSchemes(
  profile: CitizenProfile,
  query: string,
): SchemeRecommendation[] {
  const baseSchemes = searchSchemes(query);
  const source = baseSchemes.length > 0 ? baseSchemes : schemes;

  return source
    .map((scheme) => evaluateScheme(profile, scheme))
    .sort((left, right) => right.score - left.score);
}

export function getSchemeById(schemeId: string) {
  return schemes.find((scheme) => scheme.id === schemeId);
}

function evaluateScheme(
  profile: CitizenProfile,
  scheme: Scheme,
): SchemeRecommendation {
  let score = 45;
  const reasons: string[] = [];

  if (scheme.id === "pm-kisan") {
    if (profile.occupation === "farmer") {
      score += 28;
      reasons.push("Occupation matches farmer-focused support.");
    }
    if (profile.landHoldingAcres > 0) {
      score += 16;
      reasons.push("Landholding data is available for verification.");
    }
    if (profile.aadhaarLinked) {
      score += 6;
      reasons.push("Aadhaar linkage supports faster DBT processing.");
    }
  }

  if (scheme.id === "ayushman-bharat") {
    if (!profile.hasHealthCoverage) {
      score += 25;
      reasons.push("Household currently lacks health coverage.");
    }
    if (profile.hasRationCard) {
      score += 12;
      reasons.push("Ration card improves identity and household validation.");
    }
    if (profile.annualIncome <= 180000) {
      score += 10;
      reasons.push("Income profile aligns with vulnerable household targeting.");
    }
  }

  if (scheme.id === "pmay-g") {
    if (profile.isRural) {
      score += 20;
      reasons.push("Rural residency strongly aligns with PMAY-G.");
    }
    if (profile.annualIncome <= 200000) {
      score += 12;
      reasons.push("Income band suggests possible housing support eligibility.");
    }
  }

  if (scheme.id === "pmegp") {
    if (profile.occupation === "entrepreneur") {
      score += 24;
      reasons.push("Entrepreneur profile matches enterprise support.");
    }
    if (profile.isRural) {
      score += 10;
      reasons.push("Rural enterprise creation receives strong support.");
    }
  }

  if (profile.language && scheme.languages.includes(profile.language)) {
    score += 5;
    reasons.push(`Application support is available in ${profile.language}.`);
  }

  const boundedScore = Math.max(38, Math.min(97, score));
  const status =
    boundedScore >= 78
      ? "Eligible"
      : boundedScore >= 62
        ? "Likely Eligible"
        : "Needs Review";

  if (reasons.length === 0) {
    reasons.push("Scheme match is based on broad citizen profile similarity.");
  }

  return {
    scheme,
    score: boundedScore,
    status,
    reasons,
  };
}

export function submitApplication(
  payload: ApplicationPayload,
): ApplicationReceipt {
  const scheme = getSchemeById(payload.schemeId);

  return {
    applicationId: `BSA-${Math.floor(100000 + Math.random() * 900000)}`,
    schemeName: scheme?.name ?? "Selected Scheme",
    submittedAt: new Date().toISOString(),
    status: "Submitted",
    nextStep:
      payload.citizen.aadhaarLinked && payload.documents.length >= 2
        ? "Auto-verification queued. Citizen will receive SMS within 15 minutes."
        : "Manual verification required at nearest CSC or district office.",
  };
}
