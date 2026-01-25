/**
 * Compliance utilities for CMS deadlines and state AI requirements
 */

// --- Types ---

export type ComplianceStatusLabel = "safe" | "warning" | "critical" | "exceeded";

export interface ComplianceStatus {
  status: ComplianceStatusLabel;
  timeRemaining: number; // milliseconds
  percentageUsed: number; // 0-100+
}

export interface Decision {
  usedAI?: boolean;
  hadHumanReview?: boolean;
  wasAutomated?: boolean;
  patientNotified?: boolean;
  explainabilityProvided?: boolean;
}

export interface ComplianceResult {
  compliant: boolean;
  status: "compliant" | "non_compliant" | "not_applicable";
  requirements: string[];
  gaps: string[];
  stateRule?: string;
  stateName?: string;
}

export type Urgency = "urgent" | "standard";

// --- Constants ---

const URGENT_HOURS = 72;
const STANDARD_HOURS = 168; // 7 days

/** State-specific AI/prior auth requirements (bill/law references) */
export const STATE_AI_REQUIREMENTS: Record<
  string,
  { name: string; rule: string; requirements: string[] }
> = {
  CA: {
    name: "California",
    rule: "SB 1120",
    requirements: [
      "Human review required when AI informs prior auth decisions",
      "Disclosure to patient when AI is used in the decision",
      "Explainability: ability to explain AI contribution to the decision",
    ],
  },
  TX: {
    name: "Texas",
    rule: "HB 711",
    requirements: [
      "Human oversight of AI-assisted prior authorization",
      "No fully automated adverse determinations without human review",
      "Documentation of human reviewer’s role",
    ],
  },
  FL: {
    name: "Florida",
    rule: "SB 7016 / Prior Auth rules",
    requirements: [
      "Human in the loop for adverse determinations",
      "Timely prior auth responses per statute",
    ],
  },
  NY: {
    name: "New York",
    rule: "Department of Financial Services / Prior Auth",
    requirements: [
      "Human review for denials involving AI or algorithmic tools",
      "Clear communication of denial reasons",
    ],
  },
  IL: {
    name: "Illinois",
    rule: "Prior Authorization Reform",
    requirements: [
      "Human review when automated tools are used",
      "Expedited timelines for certain requests",
    ],
  },
  CO: {
    name: "Colorado",
    rule: "SB 21-169 (AI Act)",
    requirements: [
      "Disclosure when AI is used to make consequential decisions",
      "Human review for high-risk AI decisions",
    ],
  },
} as const;

// --- Functions ---

/**
 * Returns deadline from request time: urgent=72hrs, standard=168hrs (7 days).
 */
export function calculateDeadline(requestTime: Date, urgency: Urgency): Date {
  const hours = urgency === "urgent" ? URGENT_HOURS : STANDARD_HOURS;
  const d = new Date(requestTime.getTime());
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  return d;
}

/**
 * Returns compliance status: safe, warning, critical, or exceeded.
 * percentageUsed > 100 means exceeded.
 */
export function getComplianceStatus(
  requestTime: Date,
  urgency: Urgency
): ComplianceStatus {
  const deadline = calculateDeadline(requestTime, urgency);
  const now = new Date();
  const totalMs = deadline.getTime() - requestTime.getTime();
  const remainingMs = deadline.getTime() - now.getTime();
  const elapsedMs = now.getTime() - requestTime.getTime();
  const percentageUsed = totalMs > 0 ? (elapsedMs / totalMs) * 100 : 100;

  let status: ComplianceStatusLabel = "safe";
  if (remainingMs <= 0) status = "exceeded";
  else if (percentageUsed >= 100) status = "exceeded";
  else if (percentageUsed >= 85 || remainingMs < (urgency === "urgent" ? 12 : 24) * 60 * 60 * 1000)
    status = "critical";
  else if (percentageUsed >= 70 || remainingMs < (urgency === "urgent" ? 24 : 72) * 60 * 60 * 1000)
    status = "warning";

  return {
    status,
    timeRemaining: Math.max(0, remainingMs),
    percentageUsed: Math.round(percentageUsed * 10) / 10,
  };
}

/**
 * Checks if a prior auth decision meets the state’s AI/prior auth rules.
 * Returns ComplianceResult with compliant, requirements, and gaps.
 */
export function checkStateCompliance(
  state: string,
  decision: Decision
): ComplianceResult {
  const key = state.toUpperCase().slice(0, 2);
  const stateReq = STATE_AI_REQUIREMENTS[key];

  if (!stateReq) {
    return {
      compliant: true,
      status: "not_applicable",
      requirements: [],
      gaps: [],
      stateRule: undefined,
      stateName: undefined,
    };
  }

  const gaps: string[] = [];
  const { requirements } = stateReq;

  // Human review when AI used or automated
  if (
    (decision.usedAI === true || decision.wasAutomated === true) &&
    decision.hadHumanReview !== true
  ) {
    const r = requirements.find((s) => /human|review|oversight/i.test(s));
    if (r) gaps.push(`Human review: ${r}`);
  }

  // No fully automated adverse without human
  if (decision.wasAutomated === true && decision.hadHumanReview !== true) {
    const r = requirements.find((s) => /automated|adverse/i.test(s));
    if (r) gaps.push(`Automated adverse: ${r}`);
  }

  // Disclosure when AI used (CA, CO, etc.)
  if (decision.usedAI === true && decision.patientNotified !== true) {
    const r = requirements.find((s) => /disclosure|notice|patient|communicat/i.test(s));
    if (r) gaps.push(`Disclosure/notice: ${r}`);
  }

  // Explainability
  if (decision.usedAI === true && decision.explainabilityProvided !== true) {
    const r = requirements.find((s) => /explain|documentation/i.test(s));
    if (r) gaps.push(`Explainability: ${r}`);
  }

  const compliant = gaps.length === 0;
  return {
    compliant,
    status: compliant ? "compliant" : "non_compliant",
    requirements: [...stateReq.requirements],
    gaps,
    stateRule: stateReq.rule,
    stateName: stateReq.name,
  };
}
