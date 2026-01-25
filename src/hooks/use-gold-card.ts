"use client";

import { useMemo } from "react";

export type GoldCardTrend = "improving" | "declining" | "stable";

export interface EligibilityHistoryItem {
  date: string;
  rate: number;
}

export interface UseGoldCardOptions {
  /** Current approval rate (0–100) */
  currentApprovalRate: number;
  /** Minimum approval rate to qualify (e.g. 90) */
  threshold?: number;
  /** Number of orders in the measurement period */
  ordersInPeriod: number;
  /** Optional: past (date, rate) for trend and projection. Most recent last. */
  eligibilityHistory?: EligibilityHistoryItem[];
  /** Minimum orders required in period (affects eligibility) */
  minOrdersInPeriod?: number;
}

export interface UseGoldCardReturn {
  isEligible: boolean;
  currentApprovalRate: number;
  threshold: number;
  ordersInPeriod: number;
  gapToThreshold: number;
  projectedEligibilityDate: Date | null;
  trend: GoldCardTrend;
  eligibilityHistory: EligibilityHistoryItem[];
}

const DEFAULT_THRESHOLD = 90;
const DEFAULT_MIN_ORDERS = 20;

function computeTrend(history: EligibilityHistoryItem[]): GoldCardTrend {
  if (history.length < 2) return "stable";
  const recent = history.slice(-3).map((h) => h.rate);
  const older = history.slice(-6, -3).map((h) => h.rate);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.length ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
  const delta = recentAvg - olderAvg;
  if (delta > 1) return "improving";
  if (delta < -1) return "declining";
  return "stable";
}

/** Simple linear projection: rate needed, current slope from history → months to reach. */
function projectEligibilityDate(
  currentRate: number,
  threshold: number,
  trend: GoldCardTrend,
  history: EligibilityHistoryItem[]
): Date | null {
  if (currentRate >= threshold) return null;
  if (trend !== "improving") return null;

  let monthlyGain = 1;
  if (history.length >= 2) {
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    const dr = last.rate - prev.rate;
    const months = 1; // assume 1 month between entries for demo
    monthlyGain = Math.max(0.5, dr / months);
  }

  const gap = threshold - currentRate;
  const monthsToEligible = gap / monthlyGain;
  const d = new Date();
  d.setMonth(d.getMonth() + Math.ceil(monthsToEligible));
  return d;
}

/**
 * Hook for gold card eligibility.
 * Computes eligibility, gap to threshold, trend, and projected eligibility date.
 */
export function useGoldCard(options: UseGoldCardOptions): UseGoldCardReturn {
  const {
    currentApprovalRate,
    threshold = DEFAULT_THRESHOLD,
    ordersInPeriod,
    eligibilityHistory: inputHistory = [],
    minOrdersInPeriod = DEFAULT_MIN_ORDERS,
  } = options;

  return useMemo((): UseGoldCardReturn => {
    const meetsVolume = ordersInPeriod >= minOrdersInPeriod;
    const meetsRate = currentApprovalRate >= threshold;
    const isEligible = meetsVolume && meetsRate;
    const gapToThreshold = Math.max(0, threshold - currentApprovalRate);

    const eligibilityHistory = inputHistory.length > 0
      ? inputHistory
      : generateDemoHistory(currentApprovalRate);

    const trend = computeTrend(eligibilityHistory);
    const projectedEligibilityDate = projectEligibilityDate(
      currentApprovalRate,
      threshold,
      trend,
      eligibilityHistory
    );

    return {
      isEligible,
      currentApprovalRate,
      threshold,
      ordersInPeriod,
      gapToThreshold: Math.round(gapToThreshold * 10) / 10,
      projectedEligibilityDate,
      trend,
      eligibilityHistory,
    };
  }, [
    currentApprovalRate,
    threshold,
    ordersInPeriod,
    minOrdersInPeriod,
    inputHistory,
  ]);
}

/** Generate demo history when none provided (e.g. 6 months) */
function generateDemoHistory(currentRate: number): EligibilityHistoryItem[] {
  const items: EligibilityHistoryItem[] = [];
  const d = new Date();
  let r = Math.max(70, currentRate - 8);
  for (let i = 5; i >= 0; i--) {
    const date = new Date(d);
    date.setMonth(date.getMonth() - i);
    r = Math.min(100, r + (currentRate - r) * (1 - i / 6) + (Math.random() - 0.5) * 2);
    items.push({ date: date.toISOString().slice(0, 7), rate: Math.round(r * 10) / 10 });
  }
  return items;
}
