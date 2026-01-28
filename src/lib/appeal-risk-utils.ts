/**
 * Appeal risk and cost utilities based on research findings
 */

// --- Constants ---

/** Industry data for appeal cost and time (research-based) */
export const APPEAL_COST_DATA = {
  averageCostPerAppeal: 127,
  staffHoursPerAppeal: 2.5,
  p2pCallDuration: 45, // minutes
  externalReviewCost: 450,
} as const;

// --- Overturn probability weights (research-informed) ---
const W = {
  documentationScore: 0.25,
  criteriaMatchScore: 0.25,
  aiieDenialRiskScore: 0.22,
  historicalApprovalRate: 0.18,
  providerSpecialtyMatch: 0.1,
} as const;

/**
 * Weighted overturn probability (0–100).
 * Higher documentation, criteria match, AIIE denial risk score, historical approval, and
 * specialty match increase overturn probability.
 */
export function calculateOverturnProbability(
  documentationScore: number,
  criteriaMatchScore: number,
  aiieDenialRiskScore: number,
  historicalApprovalRate: number,
  providerSpecialtyMatch: number
): number {
  // Normalize AIIE 1–9 to 0–100: 1–3 → high denial risk (low score), 4–6 → mid, 7–9 → low denial risk (high score)
  const aiieNorm = ((Math.max(1, Math.min(9, aiieDenialRiskScore)) - 1) / 8) * 100;
  // Ensure all inputs in 0–100
  const doc = Math.max(0, Math.min(100, documentationScore));
  const crit = Math.max(0, Math.min(100, criteriaMatchScore));
  const hist = Math.max(0, Math.min(100, historicalApprovalRate));
  const spec = Math.max(0, Math.min(100, providerSpecialtyMatch));

  const score =
    W.documentationScore * doc +
    W.criteriaMatchScore * crit +
    W.aiieDenialRiskScore * aiieNorm +
    W.historicalApprovalRate * hist +
    W.providerSpecialtyMatch * spec;

  return Math.round(Math.max(0, Math.min(100, score)) * 10) / 10;
}

export interface AppealCostSavings {
  directCosts: number;
  staffTime: number; // hours
  totalSavings: number;
}

/**
 * Estimates savings when appeals are prevented (e.g., by better upfront documentation).
 * Uses APPEAL_COST_DATA for direct cost and staff time.
 */
export function calculateAppealCostSavings(
  appealsPrevented: number
): AppealCostSavings {
  const { averageCostPerAppeal, staffHoursPerAppeal } = APPEAL_COST_DATA;
  const directCosts = Math.round(appealsPrevented * averageCostPerAppeal);
  const staffTime = Math.round(appealsPrevented * staffHoursPerAppeal * 10) / 10;
  const totalSavings = directCosts; // staff time can be valued separately; total here = direct

  return {
    directCosts,
    staffTime,
    totalSavings,
  };
}
