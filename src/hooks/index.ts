/**
 * ARKA Insurance Demo - Hooks
 * Named exports for all custom hooks
 */

// Animation
export { useAnimation, useStaggeredAnimation, useTypewriter } from "./use-animation";

// Compliance & timers
export { useComplianceTimer } from "./use-compliance-timer";
export type {
  ComplianceTimerStatus,
  OrderUrgencyType,
  TimeRemaining,
  UseComplianceTimerOptions,
  UseComplianceTimerReturn,
} from "./use-compliance-timer";

// Appeal risk
export { useAppealRisk } from "./use-appeal-risk";
export type {
  AppealRecommendation,
  AppealRiskLevel,
  SimilarCaseStats,
  UseAppealRiskOptions,
  UseAppealRiskReturn,
} from "./use-appeal-risk";

// Gold card
export { useGoldCard } from "./use-gold-card";
export type {
  EligibilityHistoryItem,
  GoldCardTrend,
  UseGoldCardOptions,
  UseGoldCardReturn,
} from "./use-gold-card";

// Audit trail
export { useAuditTrail } from "./use-audit-trail";
export type {
  ActorDetails,
  AddEntryType,
  AIInvolvement,
  AuditActor,
  AuditEntry,
  AuditReport,
  ComplianceCheck,
  UseAuditTrailOptions,
  UseAuditTrailReturn,
} from "./use-audit-trail";

// Demo flow
export { useDemoFlow } from "./use-demo-flow";
export type {
  ComplianceMetrics,
  DemoScenarioType,
  ScenarioData,
} from "./use-demo-flow";

// Real-time metrics
export { useRealTimeMetrics } from "./use-real-time-metrics";
export type {
  UseRealTimeMetricsOptions,
  UseRealTimeMetricsReturn,
} from "./use-real-time-metrics";

// Analysis timeout (demo: "Analysis taking longer than expected")
export { useAnalysisTimeout } from "./use-analysis-timeout";
