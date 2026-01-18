"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export function MetricCard({ title, value, change, changeType = "neutral" }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 font-display text-3xl font-bold text-arka-navy">{value}</p>
      {change && (
        <p
          className={cn(
            "mt-1 text-sm",
            changeType === "positive" && "text-arka-green",
            changeType === "negative" && "text-arka-red",
            changeType === "neutral" && "text-slate-500"
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}

interface MetricsOverviewProps {
  className?: string;
}

export function MetricsOverview({ className }: MetricsOverviewProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      <MetricCard
        title="Total Claims"
        value="1,234"
        change="+12% from last month"
        changeType="positive"
      />
      <MetricCard
        title="Approval Rate"
        value="87.5%"
        change="+3.2% from last month"
        changeType="positive"
      />
      <MetricCard
        title="Avg Processing Time"
        value="2.3 days"
        change="-0.5 days from last month"
        changeType="positive"
      />
      <MetricCard
        title="Revenue Saved"
        value="$124K"
        change="+18% from last month"
        changeType="positive"
      />
    </div>
  );
}

export default MetricsOverview;
