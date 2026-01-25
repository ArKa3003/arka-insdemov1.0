"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Gauge,
  TrendingUp,
  DollarSign,
  CheckCircle,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDemoStore } from "@/stores/demo-store";
import { useAnnouncer } from "@/components/providers/screen-reader-announcer";
import { DemoErrorState } from "@/components/demo/demo-error-state";

// ============================================================================
// TYPES
// ============================================================================

interface AppealRiskPredictorProps {
  onContinue?: () => void;
  onGoBack?: () => void;
  onResetDemo?: () => void;
  className?: string;
}

interface WhatIfToggle {
  id: string;
  label: string;
  enabled: boolean;
  riskImpact: number; // positive = lowers denial risk when ON
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AppealRiskPredictor({
  onContinue,
  onGoBack,
  onResetDemo,
  className,
}: AppealRiskPredictorProps) {
  const {
    denialPrediction,
    currentOrderId,
    simulateDenialPrediction,
    completeStep,
    nextStep,
    processing,
  } = useDemoStore();
  const announce = useAnnouncer();
  const announcedRisk = React.useRef(false);

  const [whatIfToggles, setWhatIfToggles] = React.useState<WhatIfToggle[]>([
    { id: "prior-imaging", label: "Prior imaging report attached", enabled: false, riskImpact: -12 },
    { id: "conservative-rx", label: "Conservative treatment documented", enabled: false, riskImpact: -25 },
    { id: "neuro-exam", label: "Neurological exam findings", enabled: false, riskImpact: -8 },
    { id: "symptom-duration", label: "Symptom duration > 6 weeks", enabled: false, riskImpact: -15 },
  ]);

  const baseDenialRisk = denialPrediction?.overallRisk ?? 35;
  const isDenialScenario = baseDenialRisk >= 60;

  // Computed: apply What-If toggles to get display values
  const togglesOffset = whatIfToggles
    .filter((t) => t.enabled)
    .reduce((sum, t) => sum + t.riskImpact, 0);
  const adjustedDenialRisk = Math.max(0, Math.min(100, baseDenialRisk + togglesOffset));
  const approvalConfidence = 100 - adjustedDenialRisk;

  const costProjection = 127;

  React.useEffect(() => {
    if (!denialPrediction && currentOrderId) {
      simulateDenialPrediction();
    }
  }, [denialPrediction, currentOrderId, simulateDenialPrediction]);

  // Screen reader: announce risk alert when denial risk is high or critical
  React.useEffect(() => {
    if (denialPrediction && !announcedRisk.current && (denialPrediction.riskLevel === "high" || denialPrediction.riskLevel === "critical")) {
      announcedRisk.current = true;
      announce(`Risk alert: ${denialPrediction.riskLevel} denial risk.`);
    }
  }, [denialPrediction, announce]);

  const handleToggle = (id: string) => {
    setWhatIfToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleProceed = () => {
    completeStep(4);
    nextStep();
    onContinue?.();
  };

  if (processing.isAnalyzing) {
    return (
      <div className={cn("flex items-center justify-center py-16", className)}>
        <div className="text-center">
          <motion.div
            className="h-16 w-16 mx-auto mb-4 rounded-full border-4 border-arka-blue/20 border-t-arka-blue"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600">{processing.processingMessage || "Running appeal risk prediction..."}</p>
        </div>
      </div>
    );
  }

  // Invalid data: we have an order but no prediction after analysis (e.g. mock gap or interrupted load)
  if (currentOrderId && !denialPrediction) {
    return (
      <DemoErrorState
        variant="invalid-data"
        onGoBack={onGoBack}
        onResetDemo={onResetDemo}
        onRetry={() => simulateDenialPrediction()}
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Badge status="info" variant="solid">Step 4</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            Appeal Risk Prediction
          </h2>
        </div>
        <p className="text-slate-600">
          Denial risk vs. approval confidence with interactive &quot;What If&quot; documentation scenarios
        </p>
      </motion.div>

      {/* Split: Denial Risk | Approval Confidence */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Denial Risk */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated" className={cn("h-full", isDenialScenario && "border-arka-red/30 bg-arka-red/5")}>
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-arka-red" />
                Denial Risk
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke={adjustedDenialRisk >= 60 ? "#FF5630" : adjustedDenialRisk >= 40 ? "#FFAB00" : "#36B37E"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 327 }}
                    animate={{ strokeDashoffset: 327 - (327 * adjustedDenialRisk) / 100 }}
                    style={{ strokeDasharray: 327 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-mono text-slate-800">{adjustedDenialRisk}%</span>
                  <span className="text-xs text-slate-500 mt-1">denial risk</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Approval Confidence */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="elevated" className="h-full border-arka-green/20 bg-arka-green/5">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-arka-green" />
                Approval Confidence
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#36B37E"
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 327 }}
                    animate={{ strokeDashoffset: 327 - (327 * approvalConfidence) / 100 }}
                    style={{ strokeDasharray: 327 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-mono text-arka-green">{approvalConfidence}%</span>
                  <span className="text-xs text-slate-500 mt-1">approval confidence</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Large Risk Gauges: scenario-based */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <Card variant="default" className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Gauge className="h-6 w-6 text-arka-amber" />
            <span className="text-sm font-medium text-slate-600">If Denied</span>
          </div>
          <p className="text-2xl font-bold font-mono text-arka-amber">78% OVERTURN PROBABILITY</p>
          <p className="text-sm text-slate-500 mt-1">Appeal success estimate based on similar cases</p>
        </Card>
        <Card variant="default" className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-6 w-6 text-arka-green" />
            <span className="text-sm font-medium text-slate-600">If Approved</span>
          </div>
          <p className="text-2xl font-bold font-mono text-arka-green">96% CLINICALLY APPROPRIATE</p>
          <p className="text-sm text-slate-500 mt-1">Alignment with ACR and payer guidelines</p>
        </Card>
      </motion.div>

      {/* What If panel + Risk factors + Cost */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* What If - Documentation toggles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card variant="default">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <HelpCircle className="h-4 w-4 text-arka-blue" />
                What If
              </CardTitle>
              <p className="text-xs text-slate-500">Toggle documentation to see risk impact</p>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {whatIfToggles.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleToggle(t.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors",
                    t.enabled ? "border-arka-green/50 bg-arka-green/5" : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <span className="text-sm text-slate-700">{t.label}</span>
                  {t.enabled ? (
                    <ToggleRight className="h-5 w-5 text-arka-green" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk factors breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card variant="default">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base">Risk Factors Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {(denialPrediction?.factors ?? [
                  { id: "f1", name: "Conservative treatment", impact: 25, weight: 0.3 },
                  { id: "f2", name: "Clinical indication strength", impact: 20, weight: 0.25 },
                  { id: "f3", name: "Prior imaging", impact: 10, weight: 0.15 },
                  { id: "f4", name: "Symptom duration", impact: 15, weight: 0.2 },
                ]).slice(0, 4).map((f: { id: string; name: string; impact: number; weight?: number }) => (
                  <div key={f.id} className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 w-40 truncate">{f.name}</span>
                    <Progress
                      value={Math.min(100, Math.abs(f.impact))}
                      size="sm"
                      colorByValue={f.impact > 0}
                      indicatorClassName={f.impact < 0 ? "bg-arka-green" : undefined}
                      className="flex-1"
                    />
                    <span className={cn(
                      "text-sm font-mono w-12 text-right",
                      f.impact > 0 ? "text-arka-red" : "text-arka-green"
                    )}>
                      {f.impact > 0 ? "+" : ""}{f.impact}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cost projection + CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-100">
            <DollarSign className="h-5 w-5 text-slate-600" />
            <span className="font-mono font-bold text-slate-800">Cost projection: ${costProjection}</span>
            <span className="text-sm text-slate-500">appeal cost</span>
          </div>
          {onGoBack && (
            <Button variant="ghost" size="sm" onClick={onGoBack}>
              Back to Pre-Submission
            </Button>
          )}
        </div>
        <Button
          variant="success"
          size="lg"
          onClick={handleProceed}
          rightIcon={<ChevronRight className="h-5 w-5" />}
        >
          Proceed with ARKA Recommendation
        </Button>
      </motion.div>
    </div>
  );
}

export default AppealRiskPredictor;
