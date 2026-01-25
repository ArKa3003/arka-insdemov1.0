"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Brain, Shield, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProcessingStep =
  | "analyzing"
  | "compliance"
  | "gold-card"
  | "generic";

export interface ProcessingIndicatorProps {
  step?: ProcessingStep;
  /** 0–100 for multi-step; ignored for single-step */
  progress?: number;
  label?: string;
  className?: string;
}

const stepConfig: Record<
  ProcessingStep,
  { icon: React.ElementType; defaultLabel: string; iconClassName?: string }
> = {
  analyzing: {
    icon: Brain,
    defaultLabel: "ARKA is analyzing...",
  },
  compliance: {
    icon: Shield,
    defaultLabel: "Checking compliance...",
  },
  "gold-card": {
    icon: Star,
    defaultLabel: "Verifying gold card status...",
  },
  generic: {
    icon: Loader2,
    defaultLabel: "Processing...",
  },
};

export function ProcessingIndicator({
  step = "generic",
  progress,
  label,
  className,
}: ProcessingIndicatorProps) {
  const config = stepConfig[step];
  const Icon = config.icon;
  const text = label ?? config.defaultLabel;
  const showProgress = progress != null && step !== "generic";

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-4",
        className
      )}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="text-arka-teal"
      >
        <Icon size={24} strokeWidth={2} />
      </motion.div>
      <span className="text-center text-sm font-medium text-slate-700">{text}</span>
      {showProgress && (
        <div className="w-full max-w-[160px] space-y-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-arka-teal"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="text-center text-[10px] font-medium text-slate-500">
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </motion.div>
  );
}
