"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MetricCard } from "./metric-card";
import { INDUSTRY_BENCHMARKS, CMS_DEADLINES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const INDUSTRY_APPEAL_RATE_PCT = 20; // 15–25% industry avg, use midpoint
const INDUSTRY_AUTO_APPROVAL_PCT = 67;
const CMS_URGENT_HOURS = CMS_DEADLINES.URGENT_HOURS;
const CMS_STANDARD_HOURS = CMS_DEADLINES.STANDARD_DAYS * 24;
const APPEAL_OVERTURN_MA_PCT = INDUSTRY_BENCHMARKS.appealOverturnRate * 100;
const PROVIDER_SAT_TARGET_PCT = INDUSTRY_BENCHMARKS.providerSatisfactionTarget * 100;

const generateSparklineData = (baseValue: number, variance: number = 0.1): number[] =>
  Array.from({ length: 30 }, () => baseValue * (1 + (Math.random() - 0.5) * variance));

interface MetricsOverviewProps {
  className?: string;
  dateRange?: string;
}

export function MetricsOverview({ className, dateRange }: MetricsOverviewProps) {
  const metrics = {
    totalAuthorizations: 1247,
    autoApprovalRate: 88.5,
    avgDecisionTimeUrgentMinutes: 42,
    avgDecisionTimeStandardHours: 4.2,
    appealRate: 8.2,
    appealOverturnRate: 18.5,
    providerSatisfaction: 91.2,
    cmsComplianceScore: 94.5,
    cmsSegments: [
      { label: "Timeline", value: 98, color: "text-arka-green" },
      { label: "Reason Codes", value: 95, color: "text-arka-green" },
      { label: "API Readiness", value: 90, color: "text-arka-amber" },
    ],
    goldCardEligible: 127,
    goldCardTotal: 145,
    estimatedAnnualSavings: 1_240_000,
    savingsBreakdown: { admin: 420_000, appealAvoidance: 580_000, staffing: 240_000 },
    roiMultiplier: 4.2,
  };

  const urgentCompliant = metrics.avgDecisionTimeUrgentMinutes < CMS_URGENT_HOURS * 60;
  const standardCompliant = metrics.avgDecisionTimeStandardHours < CMS_STANDARD_HOURS;

  const npsGauge = (score: number) => {
    const size = 80;
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(100, Math.max(0, score));
    const offset = circumference - (pct / 100) * circumference;
    const strokeClass =
      score >= PROVIDER_SAT_TARGET_PCT ? "text-arka-green" : score >= 80 ? "text-arka-amber" : "text-arka-red";

    return (
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-200" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={strokeClass}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-arka-navy">{score.toFixed(1)}%</span>
          <span className="text-xs text-slate-500">NPS</span>
        </div>
      </div>
    );
  };

  const cmsGauge = (score: number, segments: { label: string; value: number; color: string }[]) => (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-4">
        <div className="relative" style={{ width: 100, height: 100 }}>
          <svg className="transform -rotate-90" width={100} height={100} viewBox="0 0 100 100">
            {segments.map((seg, i) => {
              const start = (i / segments.length) * 360 - 90;
              const end = ((i + 1) / segments.length) * 360 - 90;
              const r = 40;
              const x1 = 50 + r * Math.cos((start * Math.PI) / 180);
              const y1 = 50 + r * Math.sin((start * Math.PI) / 180);
              const x2 = 50 + r * Math.cos((end * Math.PI) / 180);
              const y2 = 50 + r * Math.sin((end * Math.PI) / 180);
              const large = end - start > 180 ? 1 : 0;
              const d = `M 50 50 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
              return (
                <motion.path
                  key={seg.label}
                  d={d}
                  fill="currentColor"
                  className={cn(seg.color)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 + (seg.value / 100) * 0.5 }}
                  transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-arka-navy">{score.toFixed(1)}%</span>
            {score >= 90 && (
              <span className="text-xs font-semibold text-arka-green mt-1">January 2026 Ready</span>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-1 text-xs">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between">
            <span className="text-slate-600">{seg.label}</span>
            <span className="font-medium">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  const savingsTooltip = (
    <div className="space-y-1">
      <div className="font-semibold border-b border-white/30 pb-1 mb-1">Savings breakdown</div>
      <div>Admin reduction: $420K</div>
      <div>Appeal avoidance: $580K</div>
      <div>Staffing efficiency: $240K</div>
    </div>
  );

  return (
    <div className={className} data-date-range={dateRange}>
      {/* Row 1: Operational metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <MetricCard
          index={0}
          title="Total Authorizations Processed"
          value={metrics.totalAuthorizations}
          format="number"
          trend={{ direction: "up", value: 12, isPositive: true }}
          subtitle="Real-time processing"
          sparklineData={generateSparklineData(metrics.totalAuthorizations / 30, 0.15)}
          tooltip="Total prior authorization requests processed in the selected period"
        />

        <MetricCard
          index={1}
          title="Auto-Approval Rate"
          value={metrics.autoApprovalRate}
          format="percentage"
          progressRing={{ value: metrics.autoApprovalRate, size: 70, greenGlowAbove: 85 }}
          subtitle="88–90% target"
          benchmark={{ label: "industry average", value: INDUSTRY_AUTO_APPROVAL_PCT }}
          status={metrics.autoApprovalRate >= 85 ? "success" : undefined}
        />

        <MetricCard
          index={2}
          title="Average Decision Time"
          value={0}
          format="number"
          customArea={
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">Urgent</span>
                  <span className={cn("text-sm font-semibold", urgentCompliant ? "text-arka-green" : "text-arka-red")}>
                    {metrics.avgDecisionTimeUrgentMinutes} min
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Target: &lt;72 hrs ({urgentCompliant ? "✓ Compliant" : "⚠ At Risk"})
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">Standard</span>
                  <span className={cn("text-sm font-semibold", standardCompliant ? "text-arka-green" : "text-arka-red")}>
                    {metrics.avgDecisionTimeStandardHours.toFixed(1)} hrs
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Target: &lt;7 days ({standardCompliant ? "✓ Compliant" : "⚠ At Risk"})
                </p>
              </div>
            </div>
          }
          tooltip="CMS-compliant timeframes: urgent &lt;72 hours, standard &lt;7 days"
        />

        <MetricCard
          index={3}
          title="Appeal Rate"
          value={metrics.appealRate}
          format="percentage"
          trend={{ direction: "down", value: 12, isPositive: true }}
          benchmark={{ label: "industry (15–25%)", value: INDUSTRY_APPEAL_RATE_PCT }}
          subtitle="12% reduction since ARKA implementation"
          tooltip="Share of denied requests that are appealed. Lower is better."
        />

        <MetricCard
          index={4}
          title="Appeal Overturn Rate"
          value={metrics.appealOverturnRate}
          format="percentage"
          benchmark={{ label: "MA average", value: Math.round(APPEAL_OVERTURN_MA_PCT * 10) / 10 }}
          subtitle="Target: &lt;20%. Lower = more defensible denials"
          status={
            metrics.appealOverturnRate > 30 ? "danger" : metrics.appealOverturnRate < 20 ? "success" : undefined
          }
          tooltip={
            <>
              &lt;20% target vs {APPEAL_OVERTURN_MA_PCT.toFixed(1)}% Medicare Advantage average. Red if &gt;30%.
            </>
          }
        />

        <MetricCard
          index={5}
          title="Provider Satisfaction Score"
          value={metrics.providerSatisfaction}
          format="percentage"
          customArea={
            <div>
              {npsGauge(metrics.providerSatisfaction)}
              <p className="mt-3 text-xs text-center text-slate-500">Target: 91%+ (Carelon benchmark)</p>
            </div>
          }
          tooltip="NPS-style provider satisfaction; 91%+ target from Carelon benchmark"
        />
      </div>

      {/* Row 2: Compliance & Financial */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          index={6}
          title="CMS Compliance Score"
          value={metrics.cmsComplianceScore}
          format="percentage"
          customArea={cmsGauge(metrics.cmsComplianceScore, metrics.cmsSegments)}
          tooltip="Segments: timeline, reason codes, API readiness. &gt;90% = January 2026 ready."
        />

        <MetricCard
          index={7}
          title="Gold Card Eligible Providers"
          value={metrics.goldCardEligible}
          format="number"
          trend={{ direction: "up", value: 8, isPositive: true }}
          subtitle={`${((metrics.goldCardEligible / metrics.goldCardTotal) * 100).toFixed(1)}% of ${metrics.goldCardTotal} providers`}
          badge={{ text: "Meeting 90%+ approval threshold", status: "success" }}
          tooltip="Providers meeting the 90%+ approval rate threshold for gold card status"
        />

        <MetricCard
          index={8}
          title="Estimated Annual Savings"
          value={metrics.estimatedAnnualSavings}
          format="currencyCompact"
          tooltip={savingsTooltip}
          badge={{ text: `${metrics.roiMultiplier}x ROI`, status: "success" }}
        />
      </div>
    </div>
  );
}

export default MetricsOverview;
