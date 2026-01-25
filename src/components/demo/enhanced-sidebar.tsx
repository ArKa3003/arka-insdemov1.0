"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DEMO_STEPS_10 } from "@/lib/constants";

// ============================================================================
// TYPES
// ============================================================================

export interface EnhancedSidebarProps {
  currentStep: number;
  completedSteps: number[];
  onStepSelect: (step: number) => void;
  onReset: () => void;
  totalSteps?: number;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function EnhancedSidebar({
  currentStep,
  completedSteps,
  onStepSelect,
  onReset,
  totalSteps = 10,
  className,
}: EnhancedSidebarProps) {
  const progress = (currentStep / totalSteps) * 100;
  const steps = DEMO_STEPS_10;

  // Rough time estimate: ~1 min per step for implemented, ~30s placeholder
  const minutesRemaining = Math.max(1, Math.ceil((totalSteps - currentStep) * 0.8));

  return (
    <aside
      className={cn(
        "flex flex-col w-full lg:w-72 lg:min-w-[288px]",
        "bg-white border-r border-slate-200",
        "lg:sticky lg:top-0 lg:self-start lg:max-h-[calc(100vh-2rem)]",
        className
      )}
    >
      {/* Logo / Brand */}
      <div className="p-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-1.5 font-display text-lg font-bold">
          <span className="bg-gradient-to-r from-arka-blue to-arka-teal bg-clip-text text-transparent">
            ARKA
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-arka-navy rounded">
            INS
          </span>
        </Link>
        <p className="text-xs text-slate-500 mt-1">RBM Partner Demo</p>
      </div>

      {/* Progress */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-slate-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-slate-500">~{minutesRemaining} min left</span>
        </div>
        <Progress value={progress} size="sm" className="h-2" />
      </div>

      {/* Step list */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Demo steps">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepSelect(step.id)}
              className={cn(
                "w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-arka-blue focus-visible:ring-offset-2",
                isCurrent && "bg-arka-blue/10 ring-1 ring-arka-blue/30",
                !isCurrent && "hover:bg-slate-50",
                isCompleted && !isCurrent && "text-slate-600"
              )}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Step ${step.id}: ${step.name}${isCompleted ? ", completed" : isCurrent ? ", current step" : ""}`}
            >
              {/* Status icon */}
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isCompleted && !isCurrent && "bg-arka-green text-white",
                  isCurrent && "bg-arka-blue text-white",
                  !isCompleted && !isCurrent && "bg-slate-200 text-slate-500"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  step.id
                )}
              </span>

              {/* Label */}
              <span
                className={cn(
                  "flex-1 min-w-0 text-sm font-medium truncate",
                  isCurrent ? "text-arka-navy" : "text-slate-700"
                )}
              >
                {step.name}
              </span>

              {/* NEW badge */}
              {step.isNew && (
                <span
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
                    "bg-arka-amber/15 text-arka-amber"
                  )}
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  NEW
                </span>
              )}

              {isCurrent && (
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ChevronRight className="h-4 w-4 text-arka-blue shrink-0" />
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Reset */}
      <div className="p-4 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={onReset}
          className="text-slate-600"
          leftIcon={<RotateCcw className="h-4 w-4" aria-hidden />}
          aria-label="Reset demo"
        >
          Reset Demo
        </Button>
      </div>
    </aside>
  );
}

export default EnhancedSidebar;
