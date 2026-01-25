"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalysisTimeoutBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export function AnalysisTimeoutBanner({ onDismiss, className }: AnalysisTimeoutBannerProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 rounded-lg",
        "border border-arka-amber/40 bg-arka-amber/5",
        "text-arka-navy",
        className
      )}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-arka-amber flex-shrink-0" />
        <span className="text-sm font-medium">
          Analysis taking longer than expected. You can wait or go back and try again.
        </span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded hover:bg-slate-200/80 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

export default AnalysisTimeoutBanner;
