"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DenialTrendsChartProps {
  className?: string;
}

export function DenialTrendsChart({ className }: DenialTrendsChartProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        Denial Trends
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Track denial rates and patterns over time.
      </p>
      {/* Recharts visualization will be implemented here */}
      <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
        <span className="text-slate-400">Chart Placeholder</span>
      </div>
    </div>
  );
}

export default DenialTrendsChart;
