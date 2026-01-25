"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type MetricFormat = "percentage" | "currency" | "number";

export interface MetricComparisonProps {
  label: string;
  yourValue: number;
  industryValue: number;
  format: MetricFormat;
  lowerIsBetter?: boolean;
  className?: string;
}

function formatVal(n: number, format: MetricFormat): string {
  switch (format) {
    case "percentage":
      return `${n.toFixed(1)}%`;
    case "currency":
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
    case "number":
    default:
      return n.toLocaleString();
  }
}

function getImprovement(
  your: number,
  industry: number,
  lowerIsBetter: boolean
): "better" | "worse" | "same" {
  if (your === industry) return "same";
  const youAhead = lowerIsBetter ? your < industry : your > industry;
  return youAhead ? "better" : "worse";
}

export function MetricComparison({
  label,
  yourValue,
  industryValue,
  format,
  lowerIsBetter = false,
  className,
}: MetricComparisonProps) {
  const max = Math.max(yourValue, industryValue) || 1;
  const yourPct = (yourValue / max) * 100;
  const industryPct = (industryValue / max) * 100;
  const improvement = getImprovement(yourValue, industryValue, lowerIsBetter);

  const indicator = {
    better: { Icon: TrendingUp, text: "Above industry", className: "text-emerald-600" },
    worse: { Icon: TrendingDown, text: "Below industry", className: "text-amber-600" },
    same: { Icon: Minus, text: "At industry", className: "text-slate-500" },
  }[improvement];
  const IndIcon = indicator.Icon;

  return (
    <motion.div
      className={cn("rounded-lg border border-slate-200 bg-white p-3", className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={cn("flex items-center gap-1 text-xs font-medium", indicator.className)}>
          <IndIcon size={12} />
          {indicator.text}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>You</span>
            <span className="font-medium text-slate-700">{formatVal(yourValue, format)}</span>
          </div>
          <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-arka-teal"
              initial={{ width: 0 }}
              animate={{ width: `${yourPct}%` }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>vs Industry</span>
            <span className="font-medium text-slate-600">{formatVal(industryValue, format)}</span>
          </div>
          <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-slate-400"
              initial={{ width: 0 }}
              animate={{ width: `${industryPct}%` }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
