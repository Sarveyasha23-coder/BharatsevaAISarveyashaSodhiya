export interface OfficialScheme {
  id: string
  name: string
  title: string
  description: string
  category: string
  eligibility: string
  benefits: string[]
  ministry: string
  state: string
  targetGroup: string
  incomeGroup: string
  ageGroup: string
  benefitsSummary: string
  applicationDeadline: string
  totalBeneficiaries: string
  budgetAllocated: string
  status: string
  applicationUrl: string
  lastUpdated: string
}

export const officialSchemes: OfficialScheme[] = [
  {
    id: "pm-jdy",
    name: "Pradhan Mantri Jan Dhan Yojana",
    title: "Pradhan Mantri Jan Dhan Yojana",
    description:
      "Financial inclusion mission for opening basic savings bank accounts with access to RuPay cards and insurance benefits.",
    category: "Financial",
    eligibility: "Residents eligible to open a bank account under PMJDY norms.",
    benefits: ["Zero-balance account", "RuPay debit card", "Insurance support"],
    ministry: "Ministry of Finance",
    state: "All India",
    targetGroup: "All Citizens",
    incomeGroup: "All",
    ageGroup: "18+",
    benefitsSummary: "Banking access, RuPay card, and insurance support",
    applicationDeadline: "Ongoing",
    totalBeneficiaries: "Official portal",
    budgetAllocated: "Official portal",
    status: "Active",
    applicationUrl: "https://pmjdy.gov.in/",
    lastUpdated: "2026-03-30",
  },
  {
    id: "pmjay",
    name: "Ayushman Bharat PM-JAY",
    title: "Ayushman Bharat PM-JAY",
    description:
      "Public health assurance scheme providing hospital coverage for eligible families through empanelled facilities.",
    category: "Health",
    eligibility: "Eligible beneficiary families under PM-JAY criteria.",
    benefits: ["Hospital coverage", "Cashless treatment", "Pan-India portability"],
    ministry: "Ministry of Health and Family Welfare",
    state: "All India",
    targetGroup: "Economically vulnerable families",
    incomeGroup: "Eligibility based",
    ageGroup: "All ages",
    benefitsSummary: "Hospital cover and cashless treatment through PM-JAY",
    applicationDeadline: "Ongoing",
    totalBeneficiaries: "Official portal",
    budgetAllocated: "Official portal",
    status: "Active",
    applicationUrl: "https://pmjay.gov.in/",
    lastUpdated: "2026-03-30",
  },
  {
    id: "pm-kisan",
    name: "PM-Kisan Samman Nidhi",
    title: "PM-Kisan Samman Nidhi",
    description:
      "Income support scheme for eligible farmer families with direct benefit transfers through the PM-Kisan platform.",
    category: "Agriculture",
    eligibility: "Eligible farmer families as defined by PM-Kisan rules.",
    benefits: ["Income support", "Direct benefit transfer", "Installment-based payment"],
    ministry: "Ministry of Agriculture and Farmers Welfare",
    state: "All India",
    targetGroup: "Farmers",
    incomeGroup: "Eligibility based",
    ageGroup: "18+",
    benefitsSummary: "Direct support for eligible farmer families",
    applicationDeadline: "Ongoing",
    totalBeneficiaries: "Official portal",
    budgetAllocated: "Official portal",
    status: "Active",
    applicationUrl: "https://pmkisan.gov.in/",
    lastUpdated: "2026-03-30",
  },
  {
    id: "pm-svanidhi",
    name: "PM SVANidhi",
    title: "PM SVANidhi",
    description:
      "Micro-credit scheme for street vendors with working capital loans and digital transaction incentives.",
    category: "Financial",
    eligibility: "Street vendors covered under PM SVANidhi norms.",
    benefits: ["Working capital loan", "Interest subsidy", "Digital payment rewards"],
    ministry: "Ministry of Housing and Urban Affairs",
    state: "All India",
    targetGroup: "Street vendors",
    incomeGroup: "Eligibility based",
    ageGroup: "18+",
    benefitsSummary: "Working capital and digital transaction incentives",
    applicationDeadline: "Ongoing",
    totalBeneficiaries: "Official portal",
    budgetAllocated: "Official portal",
    status: "Active",
    applicationUrl: "https://pmsvanidhi.mohua.gov.in/",
    lastUpdated: "2026-03-30",
  },
  {
    id: "nsp",
    name: "National Scholarship Portal",
    title: "National Scholarship Portal",
    description:
      "Unified scholarship application platform for students across central, UGC, and other scholarship schemes.",
    category: "Education",
    eligibility: "Students meeting scholarship-specific criteria on NSP.",
    benefits: ["Scholarship discovery", "Unified application", "Application tracking"],
    ministry: "Ministry of Electronics and Information Technology",
    state: "All India",
    targetGroup: "Students",
    incomeGroup: "Varies by scheme",
    ageGroup: "Student age groups",
    benefitsSummary: "Centralized scholarship applications and tracking",
    applicationDeadline: "Seasonal",
    totalBeneficiaries: "Official portal",
    budgetAllocated: "Official portal",
    status: "Active",
    applicationUrl: "https://scholarships.gov.in/",
    lastUpdated: "2026-03-30",
  },
  {
    id: "pmay-u",
    name: "Pradhan Mantri Awas Yojana Urban",
    title: "Pradhan Mantri Awas Yojana Urban",
    description:
      "Urban housing support scheme for eligible beneficiaries under PMAY-U housing categories and assistance flows.",
    category: "Housing",
    eligibility: "Applicants meeting PMAY-U urban housing requirements.",
    benefits: ["Housing support", "Interest subsidy", "Application tracking"],
    ministry: "Ministry of Housing and Urban Affairs",
    state: "All India",
    targetGroup: "Urban households",
    incomeGroup: "EWS/LIG/MIG categories",
    ageGroup: "18+",
    benefitsSummary: "Housing support and subsidy pathways",
    applicationDeadline: "As notified",
    totalBeneficiaries: "Official portal",
    budgetAllocated: "Official portal",
    status: "Active",
    applicationUrl: "https://pmaymis.gov.in/",
    lastUpdated: "2026-03-30",
  },
]
