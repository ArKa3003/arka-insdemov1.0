/**
 * ARKA Insurance Demo - TypeScript Type Definitions
 * Comprehensive types for healthcare prior authorization workflows
 */

// ============================================================================
// PATIENT TYPES
// ============================================================================

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  memberId: string;
  insurancePlan: InsurancePlan;
  medicalHistory: MedicalHistoryItem[];
  contactInfo?: ContactInfo;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface InsurancePlan {
  id: string;
  name: string;
  type: InsurancePlanType;
  rbmVendor: RBMVendor;
  priorAuthRequired: boolean;
  groupNumber?: string;
  effectiveDate?: string;
  terminationDate?: string;
}

export type InsurancePlanType = 
  | "HMO" 
  | "PPO" 
  | "Medicare" 
  | "Medicaid" 
  | "Commercial"
  | "Medicare Advantage";

export type RBMVendor = 
  | "eviCore" 
  | "AIM" 
  | "Carelon" 
  | "Cohere" 
  | "Internal"
  | "NIA";

export interface MedicalHistoryItem {
  id: string;
  condition: string;
  icdCode: string;
  diagnosedDate: string;
  status: MedicalConditionStatus;
  treatingProvider?: string;
  notes?: string;
}

export type MedicalConditionStatus = "active" | "resolved" | "chronic";

// ============================================================================
// IMAGING ORDER TYPES
// ============================================================================

export interface ImagingOrder {
  id: string;
  patientId: string;
  orderingProvider: Provider;
  imagingType: ImagingType;
  cptCode: string;
  cptDescription?: string;
  bodyPart: string;
  laterality: Laterality;
  contrast: boolean;
  clinicalIndication: string;
  icdCodes: string[];
  icdDescriptions?: string[];
  urgency: OrderUrgency;
  clinicalNotes: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  decidedAt?: string;
  priorImagingDates?: string[];
  conservativeTreatments?: ConservativeTreatment[];
}

export type ImagingType = 
  | "MRI" 
  | "CT" 
  | "PET" 
  | "PET-CT" 
  | "Nuclear" 
  | "Ultrasound"
  | "X-Ray"
  | "Mammography"
  | "DEXA";

export type Laterality = "left" | "right" | "bilateral" | "n/a";

export type OrderUrgency = "routine" | "urgent" | "emergent";

export type OrderStatus = 
  | "draft" 
  | "analyzing" 
  | "pending" 
  | "submitted"
  | "approved" 
  | "denied" 
  | "appealing"
  | "appeal-approved"
  | "appeal-denied";

export interface ConservativeTreatment {
  type: string;
  startDate: string;
  endDate?: string;
  duration: string;
  outcome: "improved" | "no-change" | "worsened" | "ongoing";
  provider?: string;
  notes?: string;
}

export interface Provider {
  id: string;
  name: string;
  npi: string;
  specialty: string;
  facility: string;
  phone?: string;
  fax?: string;
  address?: string;
}

// ============================================================================
// ANALYSIS TYPES
// ============================================================================

export interface PreSubmissionAnalysis {
  orderId: string;
  timestamp: string;
  documentationScore: number; // 0-100
  gaps: DocumentationGap[];
  suggestions: string[];
  estimatedDenialRisk: number; // 0-100
  readyForSubmission: boolean;
  analysisDetails?: {
    clinicalIndicationScore: number;
    historyDocumentationScore: number;
    priorTreatmentScore: number;
    diagnosticWorkupScore: number;
  };
}

export interface DocumentationGap {
  id: string;
  category: DocumentationGapCategory;
  severity: GapSeverity;
  description: string;
  requiredFor: string[]; // which RBM criteria
  suggestedAction: string;
  autoFixAvailable?: boolean;
  fixedText?: string;
}

export type DocumentationGapCategory = 
  | "clinical" 
  | "diagnostic" 
  | "history" 
  | "contraindication" 
  | "prior-treatment"
  | "symptoms"
  | "physical-exam"
  | "laboratory";

export type GapSeverity = "critical" | "major" | "minor";

export interface DenialPrediction {
  orderId: string;
  timestamp: string;
  overallRisk: number; // 0-100
  riskLevel: RiskLevel;
  confidenceScore: number; // 0-100
  factors: RiskFactor[];
  historicalDenialRate: number;
  similarCasesApproved: number;
  similarCasesDenied: number;
  recommendations: string[];
  predictedOutcome: "likely-approved" | "uncertain" | "likely-denied";
}

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface RiskFactor {
  id: string;
  name: string;
  impact: number; // contribution to risk score (0-100)
  weight: number; // factor weight in algorithm
  description: string;
  mitigationStrategy: string;
  isAddressable: boolean;
}

// ============================================================================
// RBM CRITERIA TYPES
// ============================================================================

export interface RBMCriteriaMatch {
  orderId: string;
  rbmVendor: RBMVendor;
  guidelineVersion: string;
  guidelineDate: string;
  matchedCriteria: CriteriaItem[];
  unmatchedCriteria: CriteriaItem[];
  overallMatchScore: number; // 0-100
  specificGuideline: string;
  guidelineReference: string;
  guidelineCategory: string;
  requirementsMetCount: number;
  requirementsTotalCount: number;
}

export interface CriteriaItem {
  id: string;
  criteriaCode: string;
  description: string;
  category: CriteriaCategory;
  matched: boolean;
  evidenceProvided: string | null;
  evidenceRequired: string;
  isRequired: boolean;
  alternativesMet?: string[];
}

export type CriteriaCategory = 
  | "clinical-indication"
  | "conservative-treatment"
  | "prior-imaging"
  | "physical-exam"
  | "red-flags"
  | "contraindication"
  | "step-therapy"
  | "duration";

// ============================================================================
// GENERATED CONTENT TYPES
// ============================================================================

export interface GeneratedJustification {
  orderId: string;
  narrative: string;
  keyPoints: string[];
  supportingEvidence: string[];
  clinicalRationale: string;
  wordCount: number;
  generatedAt: string;
  version: number;
  tone: "clinical" | "detailed" | "concise";
}

export interface GeneratedAppeal {
  orderId: string;
  appealType: AppealType;
  letterContent: string;
  citedGuidelines: string[];
  supportingLiterature: LiteratureCitation[];
  peerToPeerRequested: boolean;
  generatedAt: string;
  denialReason?: string;
  denialDate?: string;
  originalAuthNumber?: string;
}

export type AppealType = "first-level" | "second-level" | "external" | "expedited";

export interface LiteratureCitation {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  relevance: string;
}

// ============================================================================
// DASHBOARD / ANALYTICS TYPES
// ============================================================================

export interface DashboardMetrics {
  period: string;
  periodStart: string;
  periodEnd: string;
  totalOrders: number;
  submittedOrders: number;
  approvalRate: number; // percentage
  denialRate: number; // percentage
  pendingCount: number;
  appealCount: number;
  appealSuccessRate: number; // percentage
  averageProcessingTime: number; // hours
  estimatedSavings: number; // dollars
  documentationScoreAvg: number; // 0-100
  topDenialReasons: DenialReason[];
  ordersByStatus: OrderStatusCount[];
  ordersByImagingType: ImagingTypeCount[];
  trendsComparison: TrendsComparison;
}

export interface DenialReason {
  reason: string;
  code?: string;
  count: number;
  percentage: number;
}

export interface OrderStatusCount {
  status: OrderStatus;
  count: number;
  percentage: number;
}

export interface ImagingTypeCount {
  imagingType: ImagingType;
  count: number;
  approvalRate: number;
}

export interface TrendsComparison {
  ordersChange: number; // percentage change from previous period
  approvalRateChange: number;
  processingTimeChange: number;
  savingsChange: number;
}

export interface MonthlyMetrics {
  month: string;
  year: number;
  totalOrders: number;
  approved: number;
  denied: number;
  appealed: number;
  appealWon: number;
  approvalRate: number;
  avgDocScore: number;
  savings: number;
}

// ============================================================================
// DEMO FLOW STATE
// ============================================================================

export interface DemoState {
  currentStep: number;
  maxStepReached: number;
  patient: Patient | null;
  order: ImagingOrder | null;
  analysis: PreSubmissionAnalysis | null;
  prediction: DenialPrediction | null;
  criteriaMatch: RBMCriteriaMatch | null;
  justification: GeneratedJustification | null;
  appeal: GeneratedAppeal | null;
  isProcessing: boolean;
  processingStep: string | null;
  error: string | null;
  completedSteps: number[];
  startTime: string | null;
  lastUpdated: string | null;
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  expectedOutcome: "approval" | "denial" | "appeal-success";
  patient: Patient;
  order: ImagingOrder;
  learningObjectives: string[];
}

// ============================================================================
// WORKFLOW TYPES
// ============================================================================

export interface WorkflowStep {
  id: number;
  name: string;
  description: string;
  status: WorkflowStepStatus;
  completedAt?: string;
  duration?: number; // milliseconds
  data?: Record<string, unknown>;
}

export type WorkflowStepStatus = 
  | "pending" 
  | "active" 
  | "completed" 
  | "skipped" 
  | "error";

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  relatedOrderId?: string;
}

export type NotificationType = 
  | "approval" 
  | "denial" 
  | "appeal-update" 
  | "action-required"
  | "info"
  | "warning";

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type WithTimestamps<T> = T & {
  createdAt: string;
  updatedAt: string;
};

// Export type guards
export const isPatient = (obj: unknown): obj is Patient => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "firstName" in obj &&
    "lastName" in obj &&
    "memberId" in obj
  );
};

export const isImagingOrder = (obj: unknown): obj is ImagingOrder => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "patientId" in obj &&
    "imagingType" in obj &&
    "cptCode" in obj
  );
};
