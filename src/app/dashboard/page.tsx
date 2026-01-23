"use client";

import * as React from "react";
import { MetricsOverview } from "@/components/dashboard/metrics-overview";
import { CMSComplianceTracker } from "@/components/dashboard/cms-compliance-tracker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [dateRange, setDateRange] = React.useState("30");
  const [complianceStatus, setComplianceStatus] = React.useState<"on-track" | "at-risk" | "non-compliant">("on-track");

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
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-slate-500" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
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
        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="operations">Operations Overview</TabsTrigger>
            <TabsTrigger value="compliance">Compliance & Risk</TabsTrigger>
            <TabsTrigger value="providers">Provider Performance</TabsTrigger>
            <TabsTrigger value="financial">Financial Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="mt-0">
            <MetricsOverview dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="compliance" className="mt-0">
            <CMSComplianceTracker />
          </TabsContent>

          <TabsContent value="providers" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Provider Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Provider performance metrics and gold card tracking will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Financial Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  ROI analysis and savings breakdown will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
