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

// Demo workflow steps
export const WORKFLOW_STEPS = [
  { id: 1, name: "Patient Intake", description: "Collect patient information" },
  { id: 2, name: "Order Entry", description: "Enter clinical orders" },
  { id: 3, name: "Pre-Analysis", description: "Analyze submission readiness" },
  { id: 4, name: "Prediction", description: "AI denial prediction" },
  { id: 5, name: "Documentation", description: "Optimize documentation" },
  { id: 6, name: "Submission", description: "Submit to payer" },
  { id: 7, name: "Appeal", description: "Generate appeals if needed" },
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
