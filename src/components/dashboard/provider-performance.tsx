"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProviderPerformanceProps {
  className?: string;
}

export function ProviderPerformance({ className }: ProviderPerformanceProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        Provider Performance
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Compare performance metrics across providers.
      </p>
      {/* Provider performance table will be implemented here */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm font-medium text-slate-700">Dr. Smith</span>
          <span className="text-sm text-arka-green">92% approval</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm font-medium text-slate-700">Dr. Johnson</span>
          <span className="text-sm text-arka-green">89% approval</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm font-medium text-slate-700">Dr. Williams</span>
          <span className="text-sm text-arka-amber">78% approval</span>
        </div>
      </div>
    </div>
  );
}

export default ProviderPerformance;
