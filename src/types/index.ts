/**
 * Type definitions for ARKA Insurance Demo
 */

// Patient types
export interface Patient {
  id: string;
  name: string;
  dob: string;
  memberId: string;
  insuranceProvider: string;
  planType: "HMO" | "PPO" | "EPO" | "POS";
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

// Claim types
export interface Claim {
  id: string;
  patientId: string;
  procedureCode: string;
  procedureName: string;
  status: ClaimStatus;
  submissionDate: string;
  amount: number;
  riskLevel: RiskLevel;
  denialProbability: number;
  denialReason?: string;
  appealStatus?: AppealStatus;
}

export type ClaimStatus =
  | "pending"
  | "approved"
  | "denied"
  | "under_review"
  | "appealed";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type AppealStatus = "not_started" | "in_progress" | "submitted" | "won" | "lost";

// Provider types
export interface Provider {
  id: string;
  name: string;
  specialty: string;
  npi?: string;
  approvalRate: number;
  totalClaims: number;
}

// Analysis types
export interface AnalysisResult {
  denialProbability: number;
  confidenceScore: number;
  riskFactors: RiskFactor[];
  recommendations: Recommendation[];
  rbmCriteriaMatch: RBMCriteriaMatch;
}

export interface RiskFactor {
  id: string;
  description: string;
  severity: RiskLevel;
  mitigationSuggestion?: string;
}

export interface Recommendation {
  id: string;
  type: "documentation" | "clinical" | "administrative";
  description: string;
  priority: "high" | "medium" | "low";
  impact: string;
}

export interface RBMCriteriaMatch {
  procedureCode: string;
  totalCriteria: number;
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  matchScore: number;
}

// Workflow types
export interface WorkflowStep {
  id: number;
  name: string;
  description: string;
  status: "pending" | "active" | "completed" | "skipped";
  completedAt?: string;
}

// Analytics types
export interface AnalyticsSummary {
  totalClaims: number;
  approvalRate: number;
  averageProcessingDays: number;
  totalSavings: number;
  periodComparison: {
    claimsChange: number;
    approvalRateChange: number;
    processingTimeChange: number;
    savingsChange: number;
  };
}

export interface DenialByReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  approved: number;
  denied: number;
}

// UI State types
export interface DemoState {
  currentStep: number;
  selectedPatient: Patient | null;
  currentClaim: Claim | null;
  isPlaying: boolean;
  isPaused: boolean;
  analysisResults: AnalysisResult | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Form types
export interface PatientIntakeForm {
  firstName: string;
  lastName: string;
  dob: string;
  memberId: string;
  insuranceProvider: string;
  planType: string;
  primaryDiagnosis: string;
  symptoms: string[];
  duration: string;
}

export interface OrderEntryForm {
  procedureCode: string;
  procedureName: string;
  urgency: "routine" | "urgent" | "emergent";
  clinicalIndication: string;
  priorTreatments: string[];
  supportingDocuments: string[];
}
