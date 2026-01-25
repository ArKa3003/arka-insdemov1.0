"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { AuditTrailViewer } from "@/components/dashboard/audit-trail-viewer";
import { SavingsCalculator } from "@/components/dashboard/savings-calculator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic imports for Recharts-heavy components (SSR off for charts)
const MetricsOverview = dynamic(
  () => import("@/components/dashboard/metrics-overview").then((m) => ({ default: m.MetricsOverview })),
  { ssr: false, loading: () => <DashboardSectionFallback /> }
);
const CMSComplianceTracker = dynamic(
  () => import("@/components/dashboard/cms-compliance-tracker").then((m) => ({ default: m.CMSComplianceTracker })),
  { ssr: false, loading: () => <DashboardSectionFallback /> }
);
const AppealRiskDashboard = dynamic(
  () => import("@/components/dashboard/appeal-risk-dashboard").then((m) => ({ default: m.AppealRiskDashboard })),
  { ssr: false, loading: () => <DashboardSectionFallback /> }
);
const GoldCardDashboard = dynamic(
  () => import("@/components/dashboard/gold-card-dashboard").then((m) => ({ default: m.GoldCardDashboard })),
  { ssr: false, loading: () => <DashboardSectionFallback /> }
);

function DashboardSectionFallback() {
  return (
    <div className="min-h-[280px] flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50" role="status" aria-live="polite">
      <span className="text-slate-500">Loading…</span>
    </div>
  );
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = React.useState("30");

  // Calculate days until January 1, 2026
  const getDaysUntilDeadline = () => {
    const deadline = new Date("2026-01-01");
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeadline = getDaysUntilDeadline();

  const getComplianceStatus = () => {
    if (daysUntilDeadline > 60) return "on-track";
    if (daysUntilDeadline > 30) return "at-risk";
    return "non-compliant";
  };

  const complianceStatusConfig = {
    "on-track": {
      label: "On Track",
      color: "text-arka-green",
      bgColor: "bg-arka-green/10",
      borderColor: "border-arka-green/30",
      icon: CheckCircle,
    },
    "at-risk": {
      label: "At Risk",
      color: "text-arka-amber",
      bgColor: "bg-arka-amber/10",
      borderColor: "border-arka-amber/30",
      icon: Clock,
    },
    "non-compliant": {
      label: "Non-Compliant",
      color: "text-arka-red",
      bgColor: "bg-arka-red/10",
      borderColor: "border-arka-red/30",
      icon: AlertCircle,
    },
  };

  const status = complianceStatusConfig[getComplianceStatus()];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Full-width Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="font-display text-4xl font-bold text-arka-navy">
            ARKA Analytics Command Center
          </h1>
          <p className="font-body text-lg text-slate-600 mt-2">
            Real-time RBM performance metrics and CMS compliance tracking
          </p>
        </div>
      </div>

      {/* Compliance Status Banner */}
      <div className={cn("border-b", status.borderColor, status.bgColor)}>
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className={cn("h-5 w-5", status.color)} />
              <div>
                <p className="font-semibold text-arka-navy">
                  CMS Deadline Readiness: {status.label}
                </p>
                <p className="text-sm text-slate-600">
                  {daysUntilDeadline} days until January 1, 2026 deadline
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-arka-navy">Current Compliance Score</p>
              <p className="text-2xl font-bold text-arka-navy">94.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Date Range Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3" role="group" aria-label="Date range">
            <Calendar className="h-5 w-5 text-slate-500" aria-hidden />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]" aria-label="Select date range">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="operations" className="w-full" aria-label="Dashboard sections">
          <TabsList className="mb-6" role="tablist">
            <TabsTrigger value="operations" role="tab">Operations Overview</TabsTrigger>
            <TabsTrigger value="compliance" role="tab">Compliance & Risk</TabsTrigger>
            <TabsTrigger value="audit-trail" role="tab">Audit Trail</TabsTrigger>
            <TabsTrigger value="appeal-risk" role="tab">Appeal Risk</TabsTrigger>
            <TabsTrigger value="providers" role="tab">Provider Performance</TabsTrigger>
            <TabsTrigger value="financial" role="tab">Financial Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="mt-0">
            <MetricsOverview dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="compliance" className="mt-0">
            <CMSComplianceTracker />
          </TabsContent>

          <TabsContent value="audit-trail" className="mt-0">
            <AuditTrailViewer />
          </TabsContent>

          <TabsContent value="appeal-risk" className="mt-0">
            <AppealRiskDashboard />
          </TabsContent>

          <TabsContent value="providers" className="mt-0">
            <GoldCardDashboard />
          </TabsContent>

          <TabsContent value="financial" className="mt-0">
            <SavingsCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
