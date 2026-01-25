"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Database,
  MousePointerClick,
  AlertCircle,
  RotateCcw,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type DemoErrorVariant =
  | "demo-data-unavailable"
  | "scenario-required"
  | "invalid-data";

export interface DemoErrorStateProps {
  variant: DemoErrorVariant;
  onResetDemo?: () => void;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

const variantConfig: Record<
  DemoErrorVariant,
  {
    icon: React.ElementType;
    title: string;
    description: string;
    steps: string[];
    primaryAction?: { label: string; onClick?: (p: DemoErrorStateProps) => void };
    secondaryAction?: { label: string; onClick?: (p: DemoErrorStateProps) => void };
    iconClassName?: string;
  }
> = {
  "demo-data-unavailable": {
    icon: Database,
    title: "Demo data unavailable",
    description:
      "The demo scenario data could not be loaded. This can happen if the demo source is temporarily unavailable.",
    steps: [
      "Click **Reset Demo** to reload the demo from scratch.",
      "If the problem continues, try refreshing the page.",
      "You can also go to the Dashboard to explore other features.",
    ],
    primaryAction: { label: "Reset Demo" },
    secondaryAction: { label: "Go to Dashboard" },
    iconClassName: "text-arka-amber",
  },
  "scenario-required": {
    icon: MousePointerClick,
    title: "Please select a scenario to continue",
    description:
      "Choose one of the demo modes above to load a patient and order, then continue through the workflow.",
    steps: [
      "Select **Standard Flow**, **High-Risk Case**, or **Gold Card Provider** in the Demo mode section.",
      "A patient and order will be pre-loaded for the selected scenario.",
      "Use the sidebar or **Next** to move through the 10-step workflow.",
    ],
    primaryAction: { label: "Select a scenario above" },
    iconClassName: "text-arka-blue",
  },
  "invalid-data": {
    icon: AlertCircle,
    title: "Invalid or missing data",
    description:
      "The data for this step could not be used. This can happen after an interrupted analysis or a refresh.",
    steps: [
      "Click **Go Back** to the previous step and run the analysis again.",
      "Or **Reset Demo** to start over with a fresh scenario.",
    ],
    primaryAction: { label: "Go Back" },
    secondaryAction: { label: "Reset Demo" },
    iconClassName: "text-arka-red",
  },
};

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export function DemoErrorState({
  variant,
  onResetDemo,
  onRetry,
  onGoBack,
  className,
}: DemoErrorStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handlePrimary = () => {
    if (variant === "demo-data-unavailable" && onResetDemo) onResetDemo();
    else if (variant === "invalid-data" && onGoBack) onGoBack();
    // "scenario-required": no click, they select above
  };

  const handleSecondary = () => {
    if (variant === "demo-data-unavailable") {
      if (typeof window !== "undefined") window.location.href = "/dashboard";
    } else if (variant === "invalid-data" && onResetDemo) onResetDemo();
  };

  const showPrimary = config.primaryAction && variant !== "scenario-required";
  const showSecondary = config.secondaryAction;

  return (
    <motion.div
      className={cn("w-full max-w-xl mx-auto", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card variant="default" className="border-2 border-slate-200 overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                "bg-slate-100",
                config.iconClassName
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg text-arka-navy">{config.title}</CardTitle>
              <p className="text-sm text-slate-600 mt-1">{config.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex items-start gap-2 mb-5">
            <HelpCircle className="h-5 w-5 text-arka-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-700 mb-2">Next steps</p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {config.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-arka-blue flex-shrink-0 mt-0.5" />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: step.replace(/\*\*(.+?)\*\*/g, "<strong class='text-slate-800'>$1</strong>"),
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {showPrimary && (
              <Button
                variant="primary"
                size="md"
                onClick={handlePrimary}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                {config.primaryAction!.label}
              </Button>
            )}
            {variant === "invalid-data" && onRetry && (
              <Button variant="secondary" size="md" onClick={onRetry}>
                Try Again
              </Button>
            )}
            {showSecondary && (
              <Button variant="secondary" size="md" onClick={handleSecondary}>
                {config.secondaryAction!.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default DemoErrorState;
