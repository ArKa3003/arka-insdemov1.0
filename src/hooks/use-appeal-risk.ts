"use client";

import { useMemo } from "react";
import type { RiskFactor, DenialPrediction } from "@/types";

export type AppealRiskLevel = "low" | "medium" | "high" | "critical";

export type AppealRecommendation = "approve" | "deny" | "pend";

export interface SimilarCaseStats {
  approved: number;
  denied: number;
  overturned: number;
}

export interface UseAppealRiskOptions {
  /** Denial/risk prediction from pre-submission or post-denial analysis */
  denialPrediction: DenialPrediction | null;
  /** Optional: override similar-case stats (defaults derived from prediction) */
  similarCaseOverrides?: Partial<SimilarCaseStats>;
  /** Optional: base appeal cost in dollars for estimation */
  baseAppealCost?: number;
}

export interface UseAppealRiskReturn {
  overturnProbability: number;
  riskLevel: AppealRiskLevel;
  riskFactors: RiskFactor[];
  recommendation: AppealRecommendation;
  confidence: number;
  estimatedAppealCost: number;
  similarCaseStats: SimilarCaseStats;
}

const BASE_APPEAL_COST = 150;

function denialRiskToOverturnProbability(overallRisk: number): number {
  // Higher denial risk -> lower overturn probability
  return Math.max(0, Math.min(100, 100 - overallRisk));
}

function toAppealRiskLevel(overallRisk: number): AppealRiskLevel {
  if (overallRisk >= 75) return "critical";
  if (overallRisk >= 50) return "high";
  if (overallRisk >= 25) return "medium";
  return "low";
}

function toRecommendation(
  overturnProbability: number,
  riskLevel: AppealRiskLevel
): AppealRecommendation {
  if (riskLevel === "critical" || overturnProbability < 20) return "deny";
  if (riskLevel === "high" && overturnProbability < 35) return "pend";
  return "approve";
}

function estimateAppealCost(riskLevel: AppealRiskLevel, base: number): number {
  const mult = { low: 1, medium: 1.2, high: 1.5, critical: 2 };
  return Math.round(base * mult[riskLevel]);
}

/**
 * Hook for appeal risk calculations.
 * Derives overturn probability, risk level, recommendation, and cost from denial prediction.
 */
export function useAppealRisk(options: UseAppealRiskOptions): UseAppealRiskReturn {
  const {
    denialPrediction,
    similarCaseOverrides,
    baseAppealCost = BASE_APPEAL_COST,
  } = options;

  return useMemo((): UseAppealRiskReturn => {
    if (!denialPrediction) {
      return {
        overturnProbability: 0,
        riskLevel: "low",
        riskFactors: [],
        recommendation: "pend",
        confidence: 0,
        estimatedAppealCost: baseAppealCost,
        similarCaseStats: { approved: 0, denied: 0, overturned: 0 },
      };
    }

    const { overallRisk, confidenceScore, factors, similarCasesApproved, similarCasesDenied } =
      denialPrediction;

    const overturnProbability = denialRiskToOverturnProbability(overallRisk);
    const riskLevel = toAppealRiskLevel(overallRisk);
    const recommendation = toRecommendation(overturnProbability, riskLevel);
    const estimatedAppealCost = estimateAppealCost(riskLevel, baseAppealCost);

    // Overturned ≈ proportion of denied that were later overturned (simplified: ~30% of denied)
    const denied = similarCasesDenied;
    const overturned = similarCaseOverrides?.overturned ?? Math.round(denied * 0.3);
    const similarCaseStats: SimilarCaseStats = {
      approved: similarCaseOverrides?.approved ?? similarCasesApproved,
      denied: similarCaseOverrides?.denied ?? denied,
      overturned,
    };

    return {
      overturnProbability: Math.round(overturnProbability * 10) / 10,
      riskLevel,
      riskFactors: factors ?? [],
      recommendation,
      confidence: confidenceScore ?? 0,
      estimatedAppealCost,
      similarCaseStats,
    };
  }, [denialPrediction, similarCaseOverrides, baseAppealCost]);
}
