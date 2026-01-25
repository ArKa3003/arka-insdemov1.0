/**
 * Gold card eligibility and projection utilities
 */

// --- Types ---

export type GoldCardTrend = "improving" | "declining" | "stable";

export interface GoldCardThreshold {
  approvalRatePercent: number;
  lookbackMonths: number;
  minOrderCount: number;
}

export interface GoldCardStatus {
  eligible: boolean;
  payerId: string;
  approvalRate: number;
  orderCount: number;
  threshold: GoldCardThreshold;
  gapToRate: number;
  gapToOrders: number;
  metRate: boolean;
  metOrders: boolean;
}

// --- Constants ---

export const GOLD_CARD_THRESHOLDS: Record<string, GoldCardThreshold> = {
  UnitedHealthcare: { approvalRatePercent: 92, lookbackMonths: 24, minOrderCount: 100 },
  Aetna: { approvalRatePercent: 90, lookbackMonths: 12, minOrderCount: 50 },
  BCBS: { approvalRatePercent: 90, lookbackMonths: 12, minOrderCount: 75 },
  Humana: { approvalRatePercent: 91, lookbackMonths: 18, minOrderCount: 60 },
  Cigna: { approvalRatePercent: 92, lookbackMonths: 24, minOrderCount: 100 },
} as const;

/** Resolve common payer id strings to a known key */
function resolvePayerKey(payerId: string): string {
  const u = payerId.trim();
  if (/united|uhc|uhc\s*choice/i.test(u)) return "UnitedHealthcare";
  if (/aetna/i.test(u)) return "Aetna";
  if (/bcbs|blue\s*cross|blue\s*shield/i.test(u)) return "BCBS";
  if (/humana/i.test(u)) return "Humana";
  if (/cigna/i.test(u)) return "Cigna";
  return u || "UnitedHealthcare";
}

/**
 * Evaluates gold card eligibility for a payer.
 * approvalRate and orderCount should be over the payer’s lookback period.
 */
export function calculateGoldCardEligibility(
  approvalRate: number,
  orderCount: number,
  payerId: string
): GoldCardStatus {
  const key = resolvePayerKey(payerId);
  const threshold = GOLD_CARD_THRESHOLDS[key] ?? GOLD_CARD_THRESHOLDS.UnitedHealthcare;
  const rate = Math.max(0, Math.min(100, approvalRate));
  const orders = Math.max(0, Math.floor(orderCount));

  const metRate = rate >= threshold.approvalRatePercent;
  const metOrders = orders >= threshold.minOrderCount;
  const gapToRate = Math.max(0, threshold.approvalRatePercent - rate);
  const gapToOrders = Math.max(0, threshold.minOrderCount - orders);
  const eligible = metRate && metOrders;

  return {
    eligible,
    payerId: key,
    approvalRate: rate,
    orderCount: orders,
    threshold: { ...threshold },
    gapToRate: Math.round(gapToRate * 10) / 10,
    gapToOrders,
    metRate,
    metOrders,
  };
}

/**
 * Projects when the provider might reach the approval-rate threshold.
 * Returns null if currentRate >= threshold or trend is not 'improving'.
 * Uses a default monthly gain when improving; result is approximate.
 */
export function projectEligibilityDate(
  currentRate: number,
  trend: GoldCardTrend,
  threshold: number
): Date | null {
  if (currentRate >= threshold) return null;
  if (trend !== "improving") return null;

  const gap = threshold - currentRate;
  const defaultMonthlyGain = 1.5;
  const monthsToEligible = gap / defaultMonthlyGain;
  const d = new Date();
  d.setMonth(d.getMonth() + Math.ceil(monthsToEligible));
  return d;
}
