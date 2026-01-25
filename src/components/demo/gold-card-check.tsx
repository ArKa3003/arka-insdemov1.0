"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  User,
  CheckCircle,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Building2,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDemoStore } from "@/stores/demo-store";

// ============================================================================
// TYPES
// ============================================================================

interface GoldCardCheckProps {
  onContinue?: () => void;
  onGoBack?: () => void;
  className?: string;
}

const GOLD_CARD_THRESHOLD = 92;
const ELIGIBLE_APPROVAL_RATE = 94.2;

// ============================================================================
// CONFETTI
// ============================================================================

function Confetti() {
  const [pieces] = React.useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 10,
      delay: Math.random() * 0.5,
      color: ["#36B37E", "#00A3BF", "#FFAB00", "#0052CC"][i % 4],
      size: 6 + Math.random() * 6,
      rotation: Math.random() * 360,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-5%",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: 400,
            opacity: 0,
            rotate: p.rotation + 720,
          }}
          transition={{
            duration: 2,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function GoldCardCheck({
  onContinue,
  onGoBack,
  className,
}: GoldCardCheckProps) {
  const { currentOrder, completeStep, nextStep } = useDemoStore();

  // Provider Profile: Dr. Sarah Johnson per spec
  const providerName = "Dr. Sarah Johnson";
  const providerSpecialty = currentOrder?.orderingProvider?.specialty ?? "Orthopedic Surgery";
  const facility = currentOrder?.orderingProvider?.facility ?? "Metro Spine & Orthopedics";

  // Eligible: 94.2 >= 92. Ineligible demo: use 88.5 to show yellow banner.
  const approvalRate = ELIGIBLE_APPROVAL_RATE;
  const isEligible = approvalRate >= GOLD_CARD_THRESHOLD;

  const [showConfetti, setShowConfetti] = React.useState(false);
  React.useEffect(() => {
    if (isEligible) {
      const t = setTimeout(() => setShowConfetti(true), 400);
      return () => clearTimeout(t);
    }
  }, [isEligible]);

  const handleProceed = () => {
    completeStep(7);
    nextStep();
    onContinue?.();
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Badge status="info" variant="solid">Step 7</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            Gold Card Check
          </h2>
        </div>
        <p className="text-slate-600">
          Provider performance and Gold Card eligibility for expedited approval
        </p>
      </motion.div>

      {/* Provider Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-arka-blue" />
              Provider Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start gap-6">
              <div className="h-16 w-16 rounded-full bg-arka-blue/10 flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-arka-blue" />
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-arka-navy">{providerName}</p>
                <p className="text-slate-600">{providerSpecialty}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-500">{facility}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Dashboard + Progress */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="default">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-arka-green" />
                Performance Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono text-arka-navy">{approvalRate}%</span>
                <span className="text-slate-500">approval rate</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Last 12 months, prior auth imaging</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Gold card threshold</span>
                  <span className="font-mono font-medium">{GOLD_CARD_THRESHOLD}%</span>
                </div>
                <Progress
                  value={approvalRate}
                  size="lg"
                  colorByValue
                  showLabel
                  labelPosition="top"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="default" className={cn("h-full", isEligible ? "border-arka-green/30" : "border-arka-amber/30")}>
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className={cn("h-5 w-5", isEligible ? "text-arka-green" : "text-arka-amber")} />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col justify-center">
              {isEligible ? (
                <>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-10 w-10 text-arka-green" />
                    <span className="text-xl font-bold text-arka-green">✓ GOLD CARD ELIGIBLE</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    This provider qualifies for expedited approval. This order may bypass full clinical review.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-10 w-10 text-arka-amber" />
                    <span className="text-xl font-bold text-arka-amber">Not yet eligible</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Gap to threshold: <strong className="font-mono">{GOLD_CARD_THRESHOLD - approvalRate}%</strong>. 
                    Reach {GOLD_CARD_THRESHOLD}% approval rate to qualify.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Celebration or gap banner */}
      <AnimatePresence mode="wait">
        {isEligible ? (
          <motion.div
            key="eligible"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0 }}
            className="relative rounded-xl overflow-hidden"
          >
            {showConfetti && <Confetti />}
            <div className="relative p-6 bg-arka-green/10 border-2 border-arka-green/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-arka-green/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-arka-green" />
                </div>
                <div>
                  <p className="font-semibold text-arka-navy">Gold Card eligible — instant approval path available</p>
                  <p className="text-sm text-slate-600">This order can proceed with expedited review based on provider performance.</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ineligible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-arka-amber/10 border-2 border-arka-amber/30"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-arka-amber" />
              <div>
                <p className="font-semibold text-slate-800">Gap to Gold Card threshold: {GOLD_CARD_THRESHOLD - approvalRate}%</p>
                <p className="text-sm text-slate-600">Continue with standard prior auth review. Focus on documentation to improve future approval rates.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between pt-4 border-t border-slate-200"
      >
        <Button variant="ghost" size="sm" onClick={onGoBack}>
          Back to RBM Mapping
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleProceed}
          rightIcon={<ChevronRight className="h-5 w-5" />}
        >
          Continue to CMS Compliance
        </Button>
      </motion.div>
    </div>
  );
}

export default GoldCardCheck;
