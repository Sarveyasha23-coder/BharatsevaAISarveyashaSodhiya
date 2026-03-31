export type CitizenProfile = {
  fullName: string;
  age: number;
  state: string;
  district: string;
  annualIncome: number;
  occupation: "farmer" | "student" | "entrepreneur" | "homemaker" | "worker";
  language: "Hindi" | "English" | "Bengali" | "Marathi" | "Tamil";
  landHoldingAcres: number;
  isRural: boolean;
  hasRationCard: boolean;
  hasHealthCoverage: boolean;
  aadhaarLinked: boolean;
};

export type Scheme = {
  id: string;
  name: string;
  tagline: string;
  ministry: string;
  focus: string[];
  languages: string[];
  benefit: string;
  eligibility: string[];
  documents: string[];
  matchTerms: string[];
};

export type SchemeRecommendation = {
  scheme: Scheme;
  score: number;
  status: "Eligible" | "Likely Eligible" | "Needs Review";
  reasons: string[];
};

export type ApplicationPayload = {
  schemeId: string;
  citizen: CitizenProfile;
  notes?: string;
  documents: string[];
};

export type ApplicationReceipt = {
  applicationId: string;
  schemeName: string;
  submittedAt: string;
  status: "Submitted" | "Under Review";
  nextStep: string;
};
