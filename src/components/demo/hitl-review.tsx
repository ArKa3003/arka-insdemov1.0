"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  CheckCircle,
  Clock,
  ChevronRight,
  XCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/stores/demo-store";

// ============================================================================
// TYPES
// ============================================================================

interface HITLReviewProps {
  onContinue?: () => void;
  onGoBack?: () => void;
  className?: string;
}

type ReviewAction = "approve" | "pend" | "deny" | null;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HITLReview({
  onContinue,
  onGoBack,
  className,
}: HITLReviewProps) {
  const {
    preSubmissionAnalysis,
    denialPrediction,
    currentOrder,
    selectedPatient,
    completeStep,
    nextStep,
  } = useDemoStore();

  const [action, setAction] = React.useState<ReviewAction>(null);
  const [notes, setNotes] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const [denialReason, setDenialReason] = React.useState("");
  const [criteriaNotMet, setCriteriaNotMet] = React.useState("");
  const [p2pOffered, setP2pOffered] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Prefill for demo flow
  React.useEffect(() => {
    setNotes("Concur with AI. Documentation supports medical necessity. Criteria met.");
  }, []);

  const canSubmit =
    action &&
    notes.trim().length > 0 &&
    confirmed &&
    (action !== "deny" || (denialReason.trim() && criteriaNotMet.trim()));

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    // Simulate: decision logging, audit trail, notification
    await new Promise((r) => setTimeout(r, 1400));
    setIsSubmitting(false);
    completeStep(9);
    nextStep();
    onContinue?.();
  };

  const reviewer = { name: "Dr. Michael Chen", credential: "MD", specialty: "Neuroradiology" };

  const aiSummary = {
    recommendation: denialPrediction?.overallRisk && denialPrediction.overallRisk >= 60 ? "PEND" : "APPROVE",
    docScore: preSubmissionAnalysis?.documentationScore ?? 92,
    riskLevel: denialPrediction?.riskLevel ?? "low",
    criteriaMet: preSubmissionAnalysis?.gaps?.filter((g) => g.severity !== "critical").length ?? 4,
    criteriaTotal: 6,
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Badge status="info" variant="solid">Step 9</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            Human-in-the-Loop Review
          </h2>
        </div>
        <p className="text-slate-600">
          ARKA AI summary and reviewer action with audit trail
        </p>
      </motion.div>

      {/* Split: ARKA AI Summary | Reviewer Action Panel */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: ARKA AI Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated" className="h-full">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-arka-blue" />
                ARKA AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">AI recommendation</p>
                <Badge
                  status={aiSummary.recommendation === "APPROVE" ? "success" : "warning"}
                  variant="solid"
                  size="md"
                >
                  {aiSummary.recommendation}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500">Documentation score</p>
                  <p className="font-mono font-bold text-slate-800">{aiSummary.docScore}%</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500">Risk level</p>
                  <p className="font-medium text-slate-800 capitalize">{aiSummary.riskLevel}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Criteria</p>
                <p className="text-sm text-slate-700">{aiSummary.criteriaMet} of {aiSummary.criteriaTotal} met</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Order</p>
                <p className="text-sm font-medium text-slate-800">
                  {currentOrder?.imagingType} {currentOrder?.bodyPart} ({currentOrder?.cptCode})
                </p>
                <p className="text-xs text-slate-500">
                  {selectedPatient?.firstName} {selectedPatient?.lastName}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Reviewer Action Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="elevated" className="h-full">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-arka-teal" />
                Reviewer Action Panel
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-medium text-slate-700">{reviewer.name}, {reviewer.credential}</span>
                <Badge status="neutral" variant="outline" size="sm">{reviewer.specialty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Three action buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={action === "approve" ? "success" : "secondary"}
                  size="md"
                  onClick={() => setAction("approve")}
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                >
                  APPROVE
                </Button>
                <Button
                  variant={action === "pend" ? "warning" : "secondary"}
                  size="md"
                  onClick={() => setAction("pend")}
                  leftIcon={<Clock className="h-4 w-4" />}
                >
                  PEND
                </Button>
                <Button
                  variant={action === "deny" ? "danger" : "secondary"}
                  size="md"
                  onClick={() => setAction("deny")}
                  leftIcon={<XCircle className="h-4 w-4" />}
                >
                  DENY
                </Button>
              </div>

              {/* Required: Reviewer notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reviewer notes *</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Document clinical rationale for this decision..."
                  className="w-full h-24 px-3 py-2 rounded-lg border border-slate-300 focus:border-arka-blue focus:ring-2 focus:ring-arka-blue/20 outline-none resize-none text-slate-700"
                />
              </div>

              {/* If DENY: extra fields */}
              <AnimatePresence>
                {action === "deny" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3 p-4 rounded-lg bg-arka-red/5 border border-arka-red/20"
                  >
                    <p className="text-sm font-medium text-slate-700">Additional required (if DENY)</p>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Denial reason</label>
                      <input
                        value={denialReason}
                        onChange={(e) => setDenialReason(e.target.value)}
                        placeholder="e.g. Insufficient conservative treatment"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Criteria not met</label>
                      <input
                        value={criteriaNotMet}
                        onChange={(e) => setCriteriaNotMet(e.target.value)}
                        placeholder="e.g. RAD-NEURO-002.1, RAD-NEURO-002.2"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={p2pOffered}
                        onChange={(e) => setP2pOffered(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-arka-blue"
                      />
                      <span className="text-sm text-slate-700">P2P offered</span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirmation checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-arka-blue"
                />
                <span className="text-sm text-slate-700">I confirm this decision and attest to my review</span>
              </label>

              {/* Time tracking (display only for demo) */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>Review time: 4m 12s</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Animation: decision logging, audit trail, notification */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-arka-blue/10 border border-arka-blue/20"
        >
          <Loader2 className="h-5 w-5 animate-spin text-arka-blue" />
          <div>
            <p className="font-medium text-slate-700">Logging decision, creating audit trail, sending notification…</p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between pt-4 border-t border-slate-200"
      >
        <Button variant="ghost" size="sm" onClick={onGoBack}>
          Back to CMS Compliance
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          rightIcon={isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronRight className="h-5 w-5" />}
        >
          {isSubmitting ? "Submitting…" : "Submit Decision"}
        </Button>
      </motion.div>
    </div>
  );
}

export default HITLReview;
