"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SkeletonVariant =
  | "default"
  | "compliance-card"
  | "audit-entry"
  | "risk-gauge"
  | "timeline";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const base = "animate-pulse rounded bg-slate-200";

export function Skeleton({ variant = "default", className }: SkeletonProps) {
  if (variant === "default") {
    return <div className={cn(base, "h-4 w-full", className)} />;
  }

  if (variant === "compliance-card") {
    return (
      <motion.div
        className={cn("rounded-lg border border-slate-200 bg-white p-4", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn(base, "mb-3 h-4 w-24")} />
        <div className={cn(base, "mb-2 h-5 w-3/4")} />
        <div className={cn(base, "h-3 w-1/2")} />
        <div className="mt-3 flex gap-2">
          <div className={cn(base, "h-6 w-16 rounded-full")} />
          <div className={cn(base, "h-6 w-20 rounded-full")} />
        </div>
      </motion.div>
    );
  }

  if (variant === "audit-entry") {
    return (
      <motion.div
        className={cn("flex gap-3 pl-6", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn(base, "h-4 w-4 shrink-0 rounded-full")} />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className={cn(base, "h-4 w-4/5")} />
          <div className={cn(base, "h-3 w-24")} />
        </div>
      </motion.div>
    );
  }

  if (variant === "risk-gauge") {
    return (
      <motion.div
        className={cn("flex flex-col items-center gap-2", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn(base, "h-[90px] w-[140px] rounded-b-full")} />
        <div className={cn(base, "h-4 w-12")} />
        <div className={cn(base, "h-3 w-16")} />
      </motion.div>
    );
  }

  if (variant === "timeline") {
    return (
      <motion.div
        className={cn("space-y-4", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className={cn(base, "h-4 w-4 shrink-0 rounded-full")} />
            <div className="min-w-0 flex-1 space-y-1.5 rounded-lg border border-slate-200 p-3">
              <div className={cn(base, "h-4 w-2/3")} />
              <div className={cn(base, "h-3 w-28")} />
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  return <div className={cn(base, "h-4 w-full", className)} />;
}
