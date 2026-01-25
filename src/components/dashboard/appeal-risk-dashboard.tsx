"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Area,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  calculateAppealCostSavings,
  APPEAL_COST_DATA,
} from "@/lib/appeal-risk-utils";
import { APPEAL_RISK_SCENARIOS, monthlyMetricsData } from "@/lib/mock-data";

interface AppealRiskDashboardProps {
  className?: string;
}

// Funnel segment for appeal flow (memoized)
const FunnelSegment = React.memo<{
  label: string;
  value: number;
  pct?: number;
  index: number;
  isIndustry?: boolean;
}>(function FunnelSegment({ label, value, pct, index, isIndustry }) {
  const colors = [
    "bg-arka-blue/20 border-arka-blue",
    "bg-arka-amber/20 border-arka-amber",
    "bg-arka-green/20 border-arka-green",
    "bg-slate-200 border-slate-400",
  ];
  const c = isIndustry ? "bg-slate-100 border-slate-300" : colors[index] ?? "bg-slate-100 border-slate-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-lg border-2",
        c
      )}
    >
      <div>
        <p className="font-semibold text-arka-navy">{value.toLocaleString()}</p>
        <p className="text-xs text-slate-600">{label}</p>
      </div>
      {pct != null && (
        <Badge variant="outline" status="neutral" size="sm">
          {pct}%
        </Badge>
      )}
    </motion.div>
  );
});

// Build preventable trends from monthly metrics
function buildPreventableTrendsData() {
  const { averageCostPerAppeal } = APPEAL_COST_DATA;
  return monthlyMetricsData.map((m) => {
    const appealsPrevented = Math.round(m.savings / averageCostPerAppeal);
    return {
      month: m.month.slice(0, 3) + " " + String(m.year).slice(2),
      deniedWithoutArka: m.denied + appealsPrevented,
      deniedWithArka: m.denied,
      appealsPrevented,
      savings: m.savings,
    };
  });
}

// Map APPEAL_RISK_SCENARIOS to high-risk table rows with requestId, serviceType, recommended action
function buildHighRiskAlerts() {
  const serviceByScenario: Record<string, string> = {
    "ARS-001": "MRI Lumbar",
    "ARS-002": "MRI Lumbar",
    "ARS-003": "CT Chest",
  };
  const recMap: Record<string, "Review" | "Approve" | "Request Info"> = {
    approve: "Approve",
    deny: "Request Info",
    pend: "Review",
  };
  return APPEAL_RISK_SCENARIOS.map((s) => ({
    id: s.id,
    requestId: `PA-2025-${s.id.replace("ARS-", "")}`,
    serviceType: serviceByScenario[s.id] ?? "MRI",
    overturnProbability: Math.round(s.overturnProbability * 100),
    riskFactors: s.riskFactors.map((f) => ({
      name: f.name,
      description: f.description,
      impact: f.impact,
    })),
    recommendedAction: recMap[s.recommendation] ?? "Review",
  }));
}

// Defensibility category with Risk Level and drill-down
const defensibilityCategories = [
  {
    category: "Medical Necessity",
    volume: 423,
    defensibilityScore: 88,
    historicalOverturnRate: 12,
  },
  {
    category: "Missing Documentation",
    volume: 287,
    defensibilityScore: 92,
    historicalOverturnRate: 8,
  },
  {
    category: "Not Covered",
    volume: 156,
    defensibilityScore: 33,
    historicalOverturnRate: 67,
  },
  {
    category: "Experimental",
    volume: 89,
    defensibilityScore: 29,
    historicalOverturnRate: 71,
  },
];

function getRiskLevel(score: number): "Low" | "Medium" | "High" {
  if (score >= 80) return "Low";
  if (score >= 50) return "Medium";
  return "High";
}

function getDefensibilityColor(score: number) {
  if (score >= 80) return "text-arka-green";
  if (score >= 50) return "text-arka-amber";
  return "text-arka-red";
}

function getDefensibilityBg(score: number) {
  if (score >= 80) return "bg-arka-green/10 border-arka-green/30";
  if (score >= 50) return "bg-arka-amber/10 border-arka-amber/30";
  return "bg-arka-red/10 border-arka-red/30";
}

export function AppealRiskDashboard({ className }: AppealRiskDashboardProps) {
  const [expandedRiskId, setExpandedRiskId] = React.useState<string | null>(null);
  const [selectedDefensibility, setSelectedDefensibility] = React.useState<string | null>(null);

  const yourOverturnRate = 15; // 47/312 from funnel
  const industryOverturnRate = 81.7;

  const funnelYour = [
    { label: "Total Denials Issued", value: 1247, pct: 100 },
    { label: "Appeals Filed", value: 312, pct: 25 },
    { label: "Overturned", value: 47, pct: 15 },
    { label: "Upheld", value: 265, pct: 85 },
  ];
  const industryAppealsFiled = 250;
  const industryOverturned = Math.round(industryAppealsFiled * (industryOverturnRate / 100));
  const industryUpheld = industryAppealsFiled - industryOverturned;
  const funnelIndustry = [
    { label: "Total Denials", value: 1000, pct: 100 },
    { label: "Appeals Filed", value: industryAppealsFiled, pct: 25 },
    { label: "Overturned", value: industryOverturned, pct: industryOverturnRate },
    { label: "Upheld", value: industryUpheld, pct: 100 - industryOverturnRate },
  ];

  const appealsPrevented = 423;
  const highRiskAlerts = React.useMemo(() => buildHighRiskAlerts(), []);
  const highRiskCount = highRiskAlerts.length;

  // Cost impact: if we had issued these 423 denials
  const appealsIfIssued = Math.round(423 * 0.25); // 25% appeal rate
  const projectedAppealCost = appealsIfIssued * APPEAL_COST_DATA.averageCostPerAppeal;
  const overturnsIfIssued = Math.round(appealsIfIssued * (industryOverturnRate / 100));
  const avgCostPerOverturn = 500; // notional service cost when we wrongly deny then overturn
  const projectedOverturnCost = overturnsIfIssued * avgCostPerOverturn;
  const projectedStaffHours = Math.round(appealsIfIssued * APPEAL_COST_DATA.staffHoursPerAppeal * 10) / 10;

  const saved = calculateAppealCostSavings(appealsPrevented);

  const trendsData = React.useMemo(() => buildPreventableTrendsData(), []);

  return (
    <div className={cn("space-y-6", className)}>
      {/* HEADER */}
      <div>
        <h2 className="font-display text-3xl font-bold text-arka-navy">
          Appeal Risk Intelligence
        </h2>
        <p className="text-slate-600 mt-1">
          Predict and prevent overturnable denials before they happen
        </p>
        <div className="inline-flex items-center gap-4 px-4 py-3 mt-4 bg-arka-blue/10 border border-arka-blue/30 rounded-lg">
          <span className="text-slate-700">
            Your Overturn Rate: <strong className="text-arka-navy">{yourOverturnRate}%</strong>
            {" vs "}
            <strong className="text-slate-600">{industryOverturnRate}%</strong> Industry Average
          </span>
          <Badge status="success" variant="solid">
            {((industryOverturnRate - yourOverturnRate) / industryOverturnRate * 100).toFixed(1)}% Better
          </Badge>
        </div>
      </div>

      {/* APPEAL FUNNEL VISUALIZATION */}
      <Card>
        <CardHeader>
          <CardTitle>Appeal Funnel Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Your Performance</h4>
              <div className="space-y-3">
                {funnelYour.map((s, i) => (
                  <div key={s.label} className="flex flex-col gap-2">
                    <FunnelSegment
                      label={s.label}
                      value={s.value}
                      pct={s.pct}
                      index={i}
                    />
                    {i < funnelYour.length - 1 && (
                      <div className="flex justify-center">
                        <ArrowDown className="h-5 w-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Industry Average (81.7% overturn)</h4>
              <div className="space-y-3">
                {funnelIndustry.map((s, i) => (
                  <div key={s.label} className="flex flex-col gap-2">
                    <FunnelSegment
                      label={s.label}
                      value={s.value}
                      pct={s.pct}
                      index={i}
                      isIndustry
                    />
                    {i < funnelIndustry.length - 1 && (
                      <div className="flex justify-center">
                        <ArrowDown className="h-5 w-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-arka-green/5 border border-arka-green/20 rounded-lg">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">ARKA prevented estimated </span>
              <span className="font-bold text-arka-green">{appealsPrevented.toLocaleString()}</span>
              <span className="font-semibold"> additional appeals</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* DENIAL DEFENSIBILITY SCORING */}
      <Card>
        <CardHeader>
          <CardTitle>Denial Defensibility Scoring</CardTitle>
          <p className="text-sm text-slate-600">Score 0–100: higher = more defensible. Drill down for specific cases.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {defensibilityCategories.map((d) => {
              const risk = getRiskLevel(d.defensibilityScore);
              const isSelected = selectedDefensibility === d.category;
              return (
                <motion.div
                  key={d.category}
                  layout
                  className={cn(
                    "p-4 rounded-xl border-2 transition-colors cursor-pointer",
                    getDefensibilityBg(d.defensibilityScore),
                    isSelected && "ring-2 ring-arka-blue ring-offset-2"
                  )}
                  onClick={() => setSelectedDefensibility(isSelected ? null : d.category)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-arka-navy">{d.category}</span>
                    <Badge
                      size="sm"
                      status={risk === "High" ? "error" : risk === "Medium" ? "warning" : "success"}
                      variant="subtle"
                    >
                      {risk}
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-sm">Volume: {d.volume.toLocaleString()}</p>
                  <div className={cn("mt-2 text-2xl font-bold", getDefensibilityColor(d.defensibilityScore))}>
                    {d.defensibilityScore}/100
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Historical overturn: {d.historicalOverturnRate}%
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDefensibility(isSelected ? null : d.category);
                    }}
                  >
                    {isSelected ? "Hide cases" : "View cases"}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-slate-200"
                      >
                        <p className="text-xs text-slate-600">
                          Sample cases: REQ-{d.category.slice(0, 2).toUpperCase()}-001, REQ-{d.category.slice(0, 2).toUpperCase()}-002 …
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-arka-green/20 border border-arka-green" /> Low (80+)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-arka-amber/20 border border-arka-amber" /> Medium (50–79)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-arka-red/20 border border-arka-red" /> High (&lt;50)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* HIGH-RISK DENIAL ALERTS */}
      <Card>
        <CardHeader>
          <CardTitle>High-Risk Denial Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-arka-red/10 border-2 border-arka-red/40 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-arka-red flex-shrink-0" />
            <span className="font-semibold text-arka-navy">
              {highRiskCount} denials at risk of being overturned if issued
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 font-semibold text-slate-700">Request ID</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-700">Service type</th>
                  <th className="text-right py-3 px-3 font-semibold text-slate-700">Overturn probability</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-700">Risk factors</th>
                  <th className="text-center py-3 px-3 font-semibold text-slate-700">Recommended action</th>
                </tr>
              </thead>
              <tbody>
                {highRiskAlerts.map((r) => {
                  const open = expandedRiskId === r.id;
                  return (
                    <React.Fragment key={r.id}>
                      <motion.tr
                        className="border-b border-slate-100 hover:bg-slate-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            className="font-medium text-arka-blue hover:underline"
                            onClick={() => {}}
                          >
                            {r.requestId}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{r.serviceType}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={cn(
                            "font-semibold",
                            r.overturnProbability >= 70 ? "text-arka-red" : r.overturnProbability >= 40 ? "text-arka-amber" : "text-arka-green"
                          )}>
                            {r.overturnProbability}%
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            className="flex items-center gap-1 text-slate-600 hover:text-arka-navy"
                            onClick={() => setExpandedRiskId(open ? null : r.id)}
                          >
                            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            {open ? "Hide" : "Show"} factors
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Badge
                            size="sm"
                            status={r.recommendedAction === "Approve" ? "success" : r.recommendedAction === "Request Info" ? "warning" : "info"}
                            variant="outline"
                          >
                            {r.recommendedAction}
                          </Badge>
                        </td>
                      </motion.tr>
                      <AnimatePresence>
                        {open && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-50"
                          >
                            <td colSpan={5} className="px-3 py-3">
                              <ul className="list-disc list-inside space-y-1 text-slate-600">
                                {r.riskFactors.map((f) => (
                                  <li key={f.name}>
                                    <span className="font-medium">{f.name}</span> (impact {f.impact}%): {f.description}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary">Review selected</Button>
            <Button size="sm" variant="secondary">Approve selected</Button>
            <Button size="sm" variant="secondary">Request info (selected)</Button>
          </div>
        </CardContent>
      </Card>

      {/* COST IMPACT PROJECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Impact Projection</CardTitle>
          <p className="text-sm text-slate-600">If we had issued these {appealsPrevented} denials (without ARKA)</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-slate-600">Projected appeal cost</p>
              <p className="text-xl font-bold text-arka-navy">${projectedAppealCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Projected overturn cost</p>
              <p className="text-xl font-bold text-arka-navy">${projectedOverturnCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Staff hours</p>
              <p className="text-xl font-bold text-arka-navy">{projectedStaffHours.toLocaleString()} hours</p>
            </div>
            <div className="sm:col-span-2 lg:col-span-1" />
          </div>
          <div className="mt-6 p-4 bg-arka-green/10 border border-arka-green/30 rounded-lg">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">ARKA recommended alternative actions saved: </span>
              <span className="font-bold text-arka-green">${saved.totalSavings.toLocaleString()}</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Plus {saved.staffTime.toLocaleString()} staff hours and $ saved from overturn exposure.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* PREVENTABLE APPEAL TRENDS (Recharts) */}
      <Card>
        <CardHeader>
          <CardTitle>Preventable Appeal Trends</CardTitle>
          <p className="text-sm text-slate-600">
            Denials with/without ARKA, appeals prevented, and savings over time
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={trendsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#64748b" tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                formatter={(value, name) => {
                  const v = Number(value ?? 0);
                  const n = String(name ?? "");
                  if (n === "savings") return [`$${v.toLocaleString()}`, "Savings"];
                  return [v, n.replace(/([A-Z])/g, " $1").trim()];
                }}
                labelFormatter={(l) => l}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="deniedWithoutArka"
                name="Denials (without ARKA)"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="deniedWithArka"
                name="Denials (with ARKA)"
                fill="#64748b"
                radius={[4, 4, 0, 0]}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="appealsPrevented"
                name="Appeals prevented"
                stroke="#36B37E"
                fill="#36B37E"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="savings"
                name="Savings"
                stroke="#0052CC"
                fill="#0052CC"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
