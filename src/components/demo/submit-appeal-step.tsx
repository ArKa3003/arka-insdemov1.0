"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, RotateCcw, LayoutDashboard, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/stores/demo-store";
import { AppealGenerator } from "./appeal-generator";

// ============================================================================
// TYPES
// ============================================================================

interface SubmitAppealStepProps {
  onComplete?: () => void;
  onGoBack?: () => void;
  onReset?: () => void;
  className?: string;
}

// ============================================================================
// DECISION SUMMARY
// ============================================================================

function DecisionSummary({ approved, order, patient }: { approved: boolean; order?: { imagingType?: string; bodyPart?: string; cptCode?: string } | null; patient?: { firstName?: string; lastName?: string } | null }) {
  return (
    <Card variant="default" className={cn(approved ? "border-arka-green/30 bg-arka-green/5" : "border-arka-red/30 bg-arka-red/5")}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center",
            approved ? "bg-arka-green/20" : "bg-arka-red/20"
          )}>
            <CheckCircle className={cn("h-6 w-6", approved ? "text-arka-green" : "text-arka-red")} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-arka-navy">
              {approved ? "Decision: APPROVED" : "Decision: DENIED"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {order?.imagingType} {order?.bodyPart} ({order?.cptCode}) — {patient?.firstName} {patient?.lastName}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {approved
                ? "Human reviewer concurred with ARKA AI. Prior auth granted."
                : "Generate an appeal below to challenge this determination."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DEMO COMPLETION CELEBRATION
// ============================================================================

function DemoCompletionCelebration({ onReset }: { onReset?: () => void }) {
  const { completedSteps } = useDemoStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center text-center py-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="h-20 w-20 rounded-full bg-arka-green/20 flex items-center justify-center mb-4"
        >
          <Award className="h-10 w-10 text-arka-green" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-arka-navy">Demo Complete</h2>
        <p className="text-slate-600 mt-1 max-w-md">You completed the 10-step ARKA prior authorization workflow.</p>
      </div>

      <Card variant="elevated" className="max-w-lg mx-auto">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-center">Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Steps completed</span>
            <span className="font-mono font-bold text-arka-green">{completedSteps.length}/10</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Patient & Payer Selection</span>
            <CheckCircle className="h-5 w-5 text-arka-green" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Order Entry</span>
            <CheckCircle className="h-5 w-5 text-arka-green" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Pre-Submission through Human Review</span>
            <CheckCircle className="h-5 w-5 text-arka-green" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Submit / Appeal</span>
            <CheckCircle className="h-5 w-5 text-arka-green" />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={() => onReset?.()}
          leftIcon={<RotateCcw className="h-5 w-5" />}
        >
          Start Over
        </Button>
        <Link href="/dashboard">
          <Button
            variant="secondary"
            size="lg"
            rightIcon={<LayoutDashboard className="h-5 w-5" />}
          >
            View Dashboard
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN
// ============================================================================

export function SubmitAppealStep({
  onGoBack,
  onReset,
  className,
}: SubmitAppealStepProps) {
  const { denialPrediction, currentOrder, selectedPatient, completeStep, goToStep } = useDemoStore();
  const [showCelebration, setShowCelebration] = React.useState(false);

  const isDenied = (denialPrediction?.overallRisk ?? 0) >= 60;

  if (showCelebration) {
    return <DemoCompletionCelebration onReset={onReset} />;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Badge status="info" variant="solid">Step 10</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            Submit / Appeal Generator
          </h2>
        </div>
        <p className="text-slate-600">
          Decision summary and appeal generation if denied
        </p>
      </motion.div>

      {/* Decision Summary */}
      <DecisionSummary
        approved={!isDenied}
        order={currentOrder}
        patient={selectedPatient}
      />

      {/* If denied: Appeal Generator. If approved: Complete Demo CTA. */}
      {isDenied ? (
        <AppealGenerator
          completeStepId={10}
          stepNumber={10}
          onGoBack={() => goToStep(9)}
          onComplete={() => setShowCelebration(true)}
        />
      ) : (
        <>
          <Card variant="default" className="p-6">
            <p className="text-slate-600 mb-4">Prior authorization has been approved. No appeal needed.</p>
            <Button
              variant="success"
              size="lg"
              onClick={() => {
                completeStep(10);
                setShowCelebration(true);
              }}
              rightIcon={<ChevronRight className="h-5 w-5" />}
            >
              Complete Demo
            </Button>
          </Card>
          {onGoBack && (
            <div>
              <Button variant="ghost" size="sm" onClick={() => goToStep(9)}>
                Back to Human Review
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubmitAppealStep;
