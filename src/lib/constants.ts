/**
 * Application-wide constants
 */

// API endpoints
export const API_ENDPOINTS = {
  CLAIMS: "/api/claims",
  PATIENTS: "/api/patients",
  PROVIDERS: "/api/providers",
  ANALYTICS: "/api/analytics",
} as const;

// Claim statuses
export const CLAIM_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  DENIED: "denied",
  UNDER_REVIEW: "under_review",
  APPEALED: "appealed",
} as const;

// Denial reasons
export const DENIAL_REASONS = {
  MEDICAL_NECESSITY: "Medical necessity not established",
  MISSING_DOCUMENTATION: "Missing required documentation",
  OUT_OF_NETWORK: "Out of network provider",
  NOT_COVERED: "Service not covered",
  PRIOR_AUTH_REQUIRED: "Prior authorization required",
  DUPLICATE_CLAIM: "Duplicate claim submission",
} as const;

// Risk levels
export const RISK_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

// Demo workflow steps (legacy 7-step)
export const WORKFLOW_STEPS = [
  { id: 1, name: "Patient Intake", description: "Collect patient information" },
  { id: 2, name: "Order Entry", description: "Enter clinical orders" },
  { id: 3, name: "Pre-Analysis", description: "Analyze submission readiness" },
  { id: 4, name: "Prediction", description: "AI denial prediction" },
  { id: 5, name: "Documentation", description: "Optimize documentation" },
  { id: 6, name: "Submission", description: "Submit to payer" },
  { id: 7, name: "Appeal", description: "Generate appeals if needed" },
] as const;

// Enhanced 10-step RBM demo (Prompt 7.2)
export const DEMO_STEPS_10 = [
  { id: 1, name: "Patient & Payer Selection", isNew: false },
  { id: 2, name: "Order Entry", isNew: false },
  { id: 3, name: "Pre-Submission Analysis", isNew: false },
  { id: 4, name: "Appeal Risk Prediction", isNew: true },
  { id: 5, name: "Documentation Assistant", isNew: false },
  { id: 6, name: "RBM Criteria Mapping", isNew: false },
  { id: 7, name: "Gold Card Check", isNew: true },
  { id: 8, name: "CMS Compliance Verification", isNew: true },
  { id: 9, name: "Human-in-the-Loop Review", isNew: false },
  { id: 10, name: "Submit / Appeal Generator", isNew: false },
] as const;

// Animation durations (in ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Color scheme
export const COLORS = {
  PRIMARY: {
    BLUE: "#0052CC",
    NAVY: "#0A1628",
    TEAL: "#00A3BF",
  },
  ACCENT: {
    GREEN: "#36B37E",
    AMBER: "#FFAB00",
    RED: "#FF5630",
  },
} as const;

// ---------------------------------------------------------------------------
// CMS Deadlines (Prompt 8.2)
// ---------------------------------------------------------------------------

export const CMS_DEADLINES = {
  URGENT_HOURS: 72,
  STANDARD_DAYS: 7,
  API_DEADLINE: "2027-01-01",
  REPORTING_DEADLINE: "2026-03-31",
  DECISION_DEADLINE: "2026-01-01",
} as const;

// ---------------------------------------------------------------------------
// Industry Benchmarks (Prompt 8.2)
// ---------------------------------------------------------------------------

export const INDUSTRY_BENCHMARKS = {
  appealOverturnRate: 0.817,
  autoApprovalTarget: 0.88,
  providerSatisfactionTarget: 0.91,
  averageDecisionTimeHours: 48,
  averageAppealCost: 127,
  denialRateMA: 0.07,
} as const;

// ---------------------------------------------------------------------------
// Demo scenario presets: standard, highRisk, goldCard (Prompt 8.2)
// ---------------------------------------------------------------------------

export interface DemoScenarioConfig {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  expectedOutcome: "approval" | "denial" | "appeal-success";
  scenarioId: string;
  learningObjectives: string[];
  /** Optional: pre-filled approval rate for gold card demos */
  approvalRateOverride?: number;
  /** Optional: pre-filled order count for gold card demos */
  orderCountOverride?: number;
}

export const DEMO_SCENARIOS: {
  standard: DemoScenarioConfig;
  highRisk: DemoScenarioConfig;
  goldCard: DemoScenarioConfig;
} = {
  standard: {
    id: "demo-standard",
    name: "Standard prior auth",
    description:
      "Lumbar MRI for chronic radiculopathy with strong documentation and conservative treatment. Ideal for learning approval pathways and RBM criteria.",
    difficulty: "easy",
    expectedOutcome: "approval",
    scenarioId: "SCENARIO-001",
    learningObjectives: [
      "Understand key documentation elements for approval",
      "See how conservative treatment documentation impacts scoring",
      "Learn the relationship between clinical findings and RBM criteria",
    ],
  },
  highRisk: {
    id: "demo-high-risk",
    name: "High denial risk",
    description:
      "Brain MRI for new onset headaches without red flags or failed conservative treatment. Demonstrates denial prediction, gap analysis, and when to delay submission.",
    difficulty: "medium",
    expectedOutcome: "denial",
    scenarioId: "SCENARIO-002",
    learningObjectives: [
      "Identify documentation gaps that lead to denials",
      "Understand RBM criteria for headache imaging",
      "Learn when to delay submission vs. proceed",
    ],
  },
  goldCard: {
    id: "demo-gold-card",
    name: "Gold card eligibility",
    description:
      "Oncology staging PET-CT with strong approval history. Use to explore gold card thresholds, projected eligibility, and payers (UHC, Aetna, BCBS, Humana, Cigna).",
    difficulty: "medium",
    expectedOutcome: "approval",
    scenarioId: "SCENARIO-003",
    learningObjectives: [
      "Understand payer-specific gold card thresholds",
      "See how approval rate and order volume affect eligibility",
      "Learn to project eligibility date from trend",
    ],
    approvalRateOverride: 93,
    orderCountOverride: 110,
  },
} as const;

// ---------------------------------------------------------------------------
// AIIE Denial Risk Ratings: 1–9 to label and color
// ---------------------------------------------------------------------------

export interface AIIERatingInfo {
  label: string;
  color: string;
}

export const AIIE_RATINGS: Record<number, AIIERatingInfo> = {
  1: { label: "High Denial Risk", color: "#ef4444" },
  2: { label: "High Denial Risk", color: "#ef4444" },
  3: { label: "High Denial Risk", color: "#ef4444" },
  4: { label: "Medium Risk", color: "#f59e0b" },
  5: { label: "Medium Risk", color: "#f59e0b" },
  6: { label: "Medium Risk", color: "#f59e0b" },
  7: { label: "Low Denial Risk", color: "#22c55e" },
  8: { label: "Low Denial Risk", color: "#22c55e" },
  9: { label: "Low Denial Risk", color: "#22c55e" },
} as const;

/** Helper: get AIIE label/color for a rating 1–9; default for out-of-range. */
export function getAIIERatingInfo(rating: number): AIIERatingInfo {
  const r = Math.max(1, Math.min(9, Math.round(rating)));
  return AIIE_RATINGS[r] ?? AIIE_RATINGS[5];
}
