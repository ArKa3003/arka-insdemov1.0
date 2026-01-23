"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppealRiskDashboardProps {
  className?: string;
}

// Funnel visualization component
const FunnelChart: React.FC<{
  data: Array<{ label: string; value: number; percentage?: number }>;
  industryData?: Array<{ label: string; value: number; percentage?: number }>;
}> = ({ data, industryData }) => {
  const maxWidth = 300;
  const segmentHeight = 80;
  const gap = 20;

  return (
    <div className="flex items-start gap-8">
      {/* Your Funnel */}
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Your Performance</h4>
        <div className="relative" style={{ height: data.length * (segmentHeight + gap) }}>
          {data.map((segment, index) => {
            const width = (segment.value / data[0].value) * maxWidth;
            const yPos = index * (segmentHeight + gap);
            const isLast = index === data.length - 1;

            return (
              <motion.div
                key={segment.label}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
                className="absolute left-0"
                style={{
                  top: yPos,
                  width: `${(segment.value / data[0].value) * 100}%`,
                  height: segmentHeight,
                }}
              >
                <div
                  className={cn(
                    "h-full rounded-lg flex items-center justify-between px-4",
                    index === 0 && "bg-arka-blue/20 border-2 border-arka-blue",
                    index === 1 && "bg-arka-amber/20 border-2 border-arka-amber",
                    index === 2 && "bg-arka-green/20 border-2 border-arka-green",
                    index === 3 && "bg-slate-200 border-2 border-slate-400"
                  )}
                >
                  <div>
                    <p className="font-semibold text-arka-navy">{segment.value.toLocaleString()}</p>
                    <p className="text-xs text-slate-600">{segment.label}</p>
                  </div>
                  {segment.percentage && (
                    <Badge variant="outline" status="neutral" className="text-xs">
                      {segment.percentage}%
                    </Badge>
                  )}
                </div>
                {!isLast && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.4 }}
                    className="absolute left-1/2 -bottom-5 -translate-x-1/2"
                  >
                    <ArrowDown className="h-5 w-5 text-slate-400" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Industry Comparison */}
      {industryData && (
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Industry Average</h4>
          <div className="relative" style={{ height: industryData.length * (segmentHeight + gap) }}>
            {industryData.map((segment, index) => {
              const width = (segment.value / industryData[0].value) * maxWidth;
              const yPos = index * (segmentHeight + gap);
              const isLast = index === industryData.length - 1;

              return (
                <motion.div
                  key={segment.label}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width, opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.8, ease: "easeOut" }}
                  className="absolute left-0"
                  style={{
                    top: yPos,
                    width: `${(segment.value / industryData[0].value) * 100}%`,
                    height: segmentHeight,
                  }}
                >
                  <div
                    className={cn(
                      "h-full rounded-lg flex items-center justify-between px-4 bg-slate-100 border-2 border-slate-300"
                    )}
                  >
                    <div>
                      <p className="font-semibold text-slate-700">{segment.value.toLocaleString()}</p>
                      <p className="text-xs text-slate-600">{segment.label}</p>
                    </div>
                    {segment.percentage && (
                      <Badge variant="outline" status="neutral" className="text-xs">
                        {segment.percentage}%
                      </Badge>
                    )}
                  </div>
                  {!isLast && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 0.9 }}
                      className="absolute left-1/2 -bottom-5 -translate-x-1/2"
                    >
                      <ArrowDown className="h-5 w-5 text-slate-400" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Count up animation component
  value,
  prefix = "",
  suffix = "",
}) => {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 20, stiffness: 100 });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  React.useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [spring]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

export function AppealRiskDashboard({ className }: AppealRiskDashboardProps) {
  const [selectedCause, setSelectedCause] = React.useState<string | null>(null);

  // Mock data
  const overturnRate = 18.5;
  const industryOverturnRate = 81.7;

  const funnelData = [
    { label: "Total Denials Issued", value: 1247, percentage: 100 },
    { label: "Appeals Filed", value: 312, percentage: 25 },
    { label: "Overturned", value: 47, percentage: 15 },
    { label: "Upheld", value: 265, percentage: 85 },
  ];

  const industryFunnelData = [
    { label: "Total Denials", value: 1000, percentage: 100 },
    { label: "Appeals Filed", value: 250, percentage: 25 },
    { label: "Overturned", value: 204, percentage: 81.7 },
    { label: "Upheld", value: 46, percentage: 18.3 },
  ];

  const defensibilityData = [
    {
      reason: "Medical Necessity",
      volume: 423,
      appealRate: 32,
      overturnRate: 12,
      defensibilityScore: 88,
      trend: "up" as const,
    },
    {
      reason: "Missing Documentation",
      volume: 287,
      appealRate: 18,
      overturnRate: 8,
      defensibilityScore: 92,
      trend: "up" as const,
    },
    {
      reason: "Not Covered",
      volume: 156,
      appealRate: 45,
      overturnRate: 67,
      defensibilityScore: 33,
      trend: "flat" as const,
    },
    {
      reason: "Experimental",
      volume: 89,
      appealRate: 52,
      overturnRate: 71,
      defensibilityScore: 29,
      trend: "down" as const,
    },
  ];

  const rootCauseData = [
    { name: "Documentation not reviewed", value: 34, color: "#FF5630" },
    { name: "Criteria misapplied", value: 28, color: "#FFAB00" },
    { name: "Clinical notes supported approval", value: 22, color: "#36B37E" },
    { name: "Reviewer lacked specialty expertise", value: 11, color: "#0052CC" },
    { name: "Other", value: 5, color: "#94a3b8" },
  ];

  const preDenialAlerts = [
    {
      id: "ALERT-001",
      requestId: "REQ-789",
      imagingType: "MRI Lumbar",
      riskScore: 73,
      riskFactors: [
        "Documentation appears complete but wasn't transmitted",
        "Similar cases approved 89% of time",
        "ACR Appropriateness Criteria: Usually Appropriate (7/9)",
      ],
      recommendedAction: "APPROVE",
    },
    {
      id: "ALERT-002",
      requestId: "REQ-790",
      imagingType: "CT Chest",
      riskScore: 68,
      riskFactors: [
        "Missing prior imaging report",
        "Similar cases approved 76% of time",
      ],
      recommendedAction: "REQUEST CLARIFICATION",
    },
  ];

  const getDefensibilityColor = (score: number) => {
    if (score >= 80) return "text-arka-green";
    if (score >= 50) return "text-arka-amber";
    return "text-arka-red";
  };

  const getDefensibilityBg = (score: number) => {
    if (score >= 80) return "bg-arka-green/10 border-arka-green/30";
    if (score >= 50) return "bg-arka-amber/10 border-arka-amber/30";
    return "bg-arka-red/10 border-arka-red/30";
  };

  const appealsPrevented = 423;
  const avgCostPerAppeal = 127;
  const savingsThisMonth = appealsPrevented * avgCostPerAppeal;
  const projectedAnnualSavings = savingsThisMonth * 12;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-bold text-arka-navy mb-2">
          Appeal Risk Intelligence
        </h2>
        <p className="text-slate-600 mb-4">
          Predict and prevent overturnable denials before they happen
        </p>
        <div className="inline-flex items-center gap-4 px-4 py-3 bg-arka-blue/10 border border-arka-blue/30 rounded-lg">
          <div>
            <p className="text-xs text-slate-600">Your Overturn Rate</p>
            <p className="text-2xl font-bold text-arka-navy">{overturnRate}%</p>
          </div>
          <div className="h-12 w-px bg-slate-300" />
          <div>
            <p className="text-xs text-slate-600">Industry Average</p>
            <p className="text-2xl font-bold text-slate-600">{industryOverturnRate}%</p>
          </div>
          <Badge
            status="success"
            variant="solid"
            className="ml-auto"
          >
            {((industryOverturnRate - overturnRate) / industryOverturnRate * 100).toFixed(1)}% Better
          </Badge>
        </div>
      </div>

      {/* Appeal Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Appeal Funnel Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <FunnelChart data={funnelData} industryData={industryFunnelData} />
          <div className="mt-6 p-4 bg-arka-green/5 border border-arka-green/20 rounded-lg">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">ARKA's Pre-Denial Analysis prevented an estimated</span>{" "}
              <span className="font-bold text-arka-green">{appealsPrevented}</span>{" "}
              <span className="font-semibold">additional appeals</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Denial Defensibility Scoring */}
      <Card>
        <CardHeader>
          <CardTitle>Denial Defensibility Scoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Denial Reason</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Volume</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Appeal Rate</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Overturn Rate</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Defensibility Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {defensibilityData.map((row, index) => (
                  <motion.tr
                    key={row.reason}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 font-medium text-arka-navy">{row.reason}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{row.volume.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{row.appealRate}%</td>
                    <td className="py-3 px-4 text-right text-slate-700">{row.overturnRate}%</td>
                    <td className="py-3 px-4 text-right">
                      <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-lg border", getDefensibilityBg(row.defensibilityScore))}>
                        <span className={cn("font-bold", getDefensibilityColor(row.defensibilityScore))}>
                          {row.defensibilityScore}/100
                        </span>
                        {row.defensibilityScore >= 80 && <CheckCircle className="h-4 w-4 text-arka-green" />}
                        {row.defensibilityScore < 50 && <AlertTriangle className="h-4 w-4 text-arka-red" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.trend === "up" && <TrendingUp className="h-4 w-4 text-arka-green mx-auto" />}
                      {row.trend === "down" && <TrendingDown className="h-4 w-4 text-arka-red mx-auto" />}
                      {row.trend === "flat" && <Minus className="h-4 w-4 text-slate-400 mx-auto" />}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-arka-green/20 border border-arka-green" />
              <span>Highly defensible (80+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-arka-amber/20 border border-arka-amber" />
              <span>Review recommended (50-79)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-arka-red/20 border border-arka-red" />
              <span>High overturn risk (&lt;50)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-Denial Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Denial Risk Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {preDenialAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-arka-navy">{alert.requestId}</span>
                      <Badge variant="outline" status="neutral">{alert.imagingType}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      ARKA Risk Assessment: <span className="font-semibold text-arka-red">{alert.riskScore}% likely to be overturned if denied</span>
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    status={alert.recommendedAction === "APPROVE" ? "success" : "warning"}
                    className="ml-4"
                  >
                    {alert.recommendedAction}
                  </Badge>
                </div>
                <div className="space-y-1 mb-3">
                  <p className="text-xs font-semibold text-slate-700">Key risk factors:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {alert.riskFactors.map((factor, i) => (
                      <li key={i}>{factor}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" className="text-xs">
                    Override Analysis
                  </Button>
                  <Button
                    size="sm"
                    variant={alert.recommendedAction === "APPROVE" ? "success" : "warning"}
                    className="text-xs"
                  >
                    {alert.recommendedAction === "APPROVE" ? "Approve Request" : "Request Clarification"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Root Cause Analysis Panel */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Root Cause Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rootCauseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {rootCauseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      onClick={() => setSelectedCause(entry.name)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {selectedCause && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Selected:</span> {selectedCause}
                </p>
                <p className="text-xs text-slate-500 mt-1">Click to view specific cases</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appeal Cost Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>Appeal Cost Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Average cost per appeal</p>
                <p className="text-2xl font-bold text-arka-navy">
                  $<CountUp value={avgCostPerAppeal} />
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Appeals prevented this month</p>
                <p className="text-2xl font-bold text-arka-green">
                  <CountUp value={appealsPrevented} />
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Savings from appeal prevention</p>
                <p className="text-3xl font-bold text-arka-green">
                  $<CountUp value={savingsThisMonth} />
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Projected annual savings</p>
                <p className="text-3xl font-bold text-arka-blue">
                  $<CountUp value={projectedAnnualSavings} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Model Confidence Display */}
      <Card>
        <CardHeader>
          <CardTitle>Predictive Model Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">ARKA predicted denials would be overturned</p>
                <p className="text-2xl font-bold text-arka-navy">
                  <CountUp value={312} />
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Actual overturns</p>
                <p className="text-2xl font-bold text-arka-green">
                  <CountUp value={47} />
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Prediction accuracy</p>
                <p className="text-2xl font-bold text-arka-blue">94.2%</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700 mb-2">Confidence Interval</p>
              <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "94.2%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-arka-blue to-arka-green rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">94.2% ± 2.1%</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">95% confidence interval: 92.1% - 96.3%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
