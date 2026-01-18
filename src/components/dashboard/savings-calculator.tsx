"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SavingsCalculatorProps {
  className?: string;
}

export function SavingsCalculator({ className }: SavingsCalculatorProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        Savings Calculator
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Calculate potential savings from improved claim approval rates.
      </p>
      {/* Savings calculator interface will be implemented here */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Denied Claims Recovered</span>
          <span className="font-mono text-lg font-semibold text-arka-green">$45,000</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Processing Time Saved</span>
          <span className="font-mono text-lg font-semibold text-arka-teal">120 hours</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Staff Efficiency Gain</span>
          <span className="font-mono text-lg font-semibold text-arka-blue">35%</span>
        </div>
      </div>
    </div>
  );
}

export default SavingsCalculator;
