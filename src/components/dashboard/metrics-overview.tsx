"use client";

import * as React from "react";
import { MetricCard } from "./metric-card";
import { motion } from "framer-motion";

// Generate sparkline data (30 days)
const generateSparklineData = (baseValue: number, variance: number = 0.1): number[] => {
  return Array.from({ length: 30 }, () => baseValue * (1 + (Math.random() - 0.5) * variance));
};

interface MetricsOverviewProps {
  className?: string;
  dateRange?: string;
}

  // Mock data - in production, this would come from props or API
  const metrics = {
    totalAuthorizations: 1247,
    autoApprovalRate: 88.5,
    avgDecisionTimeUrgent: 42, // minutes
    avgDecisionTimeStandard: 4.2, // hours
    appealRate: 8.2,
    appealOverturnRate: 18.5,
    providerSatisfaction: 91.2,
    cmsComplianceScore: 94.5,
    goldCardEligible: 127,
    goldCardTotal: 145,
    estimatedAnnualSavings: 1240000,
  };

  const progressRing = (percentage: number, size: number = 60) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-slate-200"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={percentage >= 85 ? "text-arka-green" : "text-arka-blue"}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-arka-navy">{percentage.toFixed(1)}%</span>
        </div>
      </div>
    );
  };

  const npsGauge = (score: number) => {
    const percentage = score;
    const size = 80;
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-slate-200"
          />
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
            className={score >= 91 ? "text-arka-green" : score >= 80 ? "text-arka-amber" : "text-arka-red"}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-lg font-bold text-arka-navy">{score.toFixed(1)}%</span>
          <span className="text-xs text-slate-500">NPS</span>
        </div>
      </div>
    );
  };

  const cmsGauge = (score: number) => {
    const segments = [
      { label: "Timeline", value: 98, color: "arka-green" },
      { label: "Reason Codes", value: 95, color: "arka-green" },
      { label: "API", value: 90, color: "arka-amber" },
    ];

    return (
      <div className="space-y-2">
        <div className="relative" style={{ width: 100, height: 100 }}>
          <svg className="transform -rotate-90" width={100} height={100}>
            {segments.map((segment, i) => {
              const startAngle = (i * 120 - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * 120 - 90) * (Math.PI / 180);
              const radius = 40;
              const largeArc = 120 > 180 ? 1 : 0;
              const x1 = 50 + radius * Math.cos(startAngle);
              const y1 = 50 + radius * Math.sin(startAngle);
              const x2 = 50 + radius * Math.cos(endAngle);
              const y2 = 50 + radius * Math.sin(endAngle);

              return (
                <motion.path
                  key={segment.label}
                  d={`M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={`var(--color-${segment.color})`}
                  fillOpacity={segment.value / 100}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-arka-navy">{score.toFixed(1)}%</span>
            {score >= 90 && (
              <span className="text-xs font-semibold text-arka-green mt-1">Jan 2026 Ready</span>
            )}
          </div>
        </div>
        <div className="space-y-1 text-xs">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center justify-between">
              <span className="text-slate-600">{segment.label}</span>
              <span className="font-medium">{segment.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Row 1: Operational Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* 1. Total Authorizations Processed */}
        <MetricCard
          index={0}
          title="Total Authorizations Processed"
          value={metrics.totalAuthorizations}
          format="number"
          trend={{ direction: "up", value: 12, isPositive: true }}
          subtitle="Real-time processing"
          sparklineData={generateSparklineData(metrics.totalAuthorizations / 30, 0.15)}
          tooltip="Total number of prior authorization requests processed in the selected period"
        />

        {/* 2. Auto-Approval Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className={cn(
            "rounded-xl border border-slate-200 bg-white p-6",
            metrics.autoApprovalRate >= 85 && "border-arka-green/30 bg-arka-green/5",
            "transition-all duration-300"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm font-medium text-slate-600">Auto-Approval Rate</p>
            {metrics.autoApprovalRate >= 85 && (
              <div className="h-2 w-2 rounded-full bg-arka-green animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-4 mt-3">
            {progressRing(metrics.autoApprovalRate, 70)}
            <div>
              <p className="text-xs text-slate-500 mt-2">vs 67% industry average</p>
            </div>
          </div>
        </motion.div>

        {/* 3. Average Decision Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300"
        >
          <p className="text-sm font-medium text-slate-600 mb-3">Average Decision Time</p>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-600">Urgent</span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    metrics.avgDecisionTimeUrgent < 72 * 60 ? "text-arka-green" : "text-arka-red"
                  )}
                >
                  {metrics.avgDecisionTimeUrgent} min
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Target: &lt;72 hours ({metrics.avgDecisionTimeUrgent < 72 * 60 ? "✓ Compliant" : "⚠ At Risk"})
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-600">Standard</span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    metrics.avgDecisionTimeStandard < 7 * 24 ? "text-arka-green" : "text-arka-red"
                  )}
                >
                  {metrics.avgDecisionTimeStandard.toFixed(1)} hrs
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Target: &lt;7 days ({metrics.avgDecisionTimeStandard < 7 * 24 ? "✓ Compliant" : "⚠ At Risk"})
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. Appeal Rate */}
        <MetricCard
          index={3}
          title="Appeal Rate"
          value={metrics.appealRate}
          format="percentage"
          trend={{ direction: "down", value: 12, isPositive: true }}
          benchmark={{ label: "industry average", value: 20 }}
          subtitle="12% reduction since ARKA implementation"
          tooltip="Percentage of denied requests that are appealed. Lower is better."
        />

        {/* 5. Appeal Overturn Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className={cn(
            "rounded-xl border border-slate-200 bg-white p-6",
            metrics.appealOverturnRate > 30
              ? "border-arka-red/30 bg-arka-red/5"
              : metrics.appealOverturnRate < 20
              ? "border-arka-green/30 bg-arka-green/5"
              : "",
            "transition-all duration-300"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm font-medium text-slate-600">Appeal Overturn Rate</p>
            {metrics.appealOverturnRate > 30 && (
              <span className="text-xs font-semibold text-arka-red">⚠ Critical</span>
            )}
          </div>
          <p className="font-display text-3xl font-bold text-arka-navy mt-3">
            {metrics.appealOverturnRate.toFixed(1)}%
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Target: &lt;20% (vs 81.7% Medicare Advantage average)
          </p>
          <p className="mt-1 text-xs text-slate-400 italic">
            Lower = more defensible denials
          </p>
        </motion.div>

        {/* 6. Provider Satisfaction Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300"
        >
          <p className="text-sm font-medium text-slate-600 mb-3">Provider Satisfaction Score</p>
          <div className="flex items-center justify-center">
            {npsGauge(metrics.providerSatisfaction)}
          </div>
          <p className="mt-3 text-xs text-center text-slate-500">
            Target: 91%+ (Carelon benchmark)
          </p>
        </motion.div>
      </div>

      {/* Row 2: Compliance & Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* 7. CMS Compliance Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300"
        >
          <p className="text-sm font-medium text-slate-600 mb-4">CMS Compliance Score</p>
          {cmsGauge(metrics.cmsComplianceScore)}
        </motion.div>

        {/* 8. Gold Card Eligible Providers */}
        <MetricCard
          index={7}
          title="Gold Card Eligible Providers"
          value={`${metrics.goldCardEligible} / ${metrics.goldCardTotal}`}
          format="number"
          trend={{ direction: "up", value: 8, isPositive: true }}
          subtitle={`${((metrics.goldCardEligible / metrics.goldCardTotal) * 100).toFixed(1)}% meeting 90%+ approval threshold`}
          tooltip="Providers meeting the 90%+ approval rate threshold for gold card status"
        />

        {/* 9. Estimated Annual Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300"
        >
          <p className="text-sm font-medium text-slate-600 mb-2">Estimated Annual Savings</p>
          <p className="font-display text-3xl font-bold text-arka-navy mt-3">
            ${(metrics.estimatedAnnualSavings / 1000000).toFixed(2)}M
          </p>
          <div className="mt-4 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Admin cost reduction</span>
              <span className="font-medium">$420K</span>
            </div>
            <div className="flex justify-between">
              <span>Appeal cost avoidance</span>
              <span className="font-medium">$580K</span>
            </div>
            <div className="flex justify-between">
              <span>Staffing efficiency</span>
              <span className="font-medium">$240K</span>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-arka-green/10 text-arka-green rounded-full text-xs font-semibold">
            <span>4.2x ROI</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default MetricsOverview;
