"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type GoldCardStatus = "eligible" | "near" | "in-progress" | "not-eligible";

export interface GoldCardBadgeProps {
  status: GoldCardStatus;
  approvalRate?: number;
  threshold?: number;
  className?: string;
}

const statusConfig: Record<
  GoldCardStatus,
  { label: string; styles: string; icon?: React.ElementType; useShimmer?: boolean }
> = {
  eligible: {
    label: "Eligible",
    styles: "gold-card-badge border-amber-400/50 text-amber-900",
    icon: Star,
    useShimmer: true,
  },
  near: {
    label: "Near",
    styles: "bg-amber-100 border-amber-300/60 text-amber-800",
    icon: TrendingUp,
  },
  "in-progress": {
    label: "In progress",
    styles: "bg-slate-100 border-slate-300 text-slate-700",
  },
  "not-eligible": {
    label: "Not eligible",
    styles: "bg-transparent border-slate-300 text-slate-600",
  },
};

export function GoldCardBadge({
  status,
  approvalRate,
  threshold = 90,
  className,
}: GoldCardBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const pct =
    status === "near" && approvalRate != null && threshold != null
      ? Math.max(0, threshold - approvalRate)
      : null;
  const progress =
    status === "in-progress" && approvalRate != null && threshold != null
      ? Math.min(100, (approvalRate / threshold) * 100)
      : null;

  return (
    <motion.div
      className={cn(
        "inline-flex flex-col gap-1 rounded-lg border px-3 py-2",
        config.styles,
        config.useShimmer && "gold-card-badge",
        className
      )}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="shrink-0" strokeWidth={2} />}
        <span className="text-sm font-semibold">{config.label}</span>
      </div>

      {status === "near" && pct != null && (
        <div className="text-[11px] text-amber-700">
          {pct}% to threshold ({threshold}%)
        </div>
      )}

      {status === "in-progress" && progress != null && (
        <div className="w-24">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-slate-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">{Math.round(progress)}%</div>
        </div>
      )}

      {status === "eligible" && approvalRate != null && (
        <div className="text-[11px] text-amber-800/80">Approval: {approvalRate}%</div>
      )}
    </motion.div>
  );
}
