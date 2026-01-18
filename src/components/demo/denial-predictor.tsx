"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Building2,
  PieChart,
  ChevronRight,
  ArrowLeft,
  FileText,
  Lightbulb,
  Shield,
  BarChart3,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { useDemoStore } from "@/stores/demo-store";
import type { RiskLevel } from "@/types";

// ============================================================================
// TYPES
// ============================================================================

interface DenialPredictorProps {
  onContinue?: () => void;
  onGoBack?: () => void;
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getRiskColor = (risk: number): string => {
  if (risk <= 30) return "#36B37E"; // green
  if (risk <= 60) return "#FFAB00"; // amber
  return "#FF5630"; // red
};

const getRiskLabel = (risk: number): { label: string; level: RiskLevel } => {
  if (risk <= 25) return { label: "LOW RISK", level: "low" };
  if (risk <= 50) return { label: "MODERATE RISK", level: "medium" };
  if (risk <= 75) return { label: "HIGH RISK", level: "high" };
  return { label: "CRITICAL RISK", level: "critical" };
};

const getRiskBadgeStatus = (level: RiskLevel) => {
  switch (level) {
    case "low": return "success";
    case "medium": return "warning";
    case "high": return "error";
    case "critical": return "error";
    default: return "neutral";
  }
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Risk Gauge Component (Semicircular Speedometer)
interface RiskGaugeProps {
  risk: number;
  animated?: boolean;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ risk, animated = true }) => {
  const [displayRisk, setDisplayRisk] = React.useState(0);
  const size = 280;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Half circle

  React.useEffect(() => {
    if (animated) {
      const duration = 1500;
      const steps = 60;
      const increment = risk / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= risk) {
          setDisplayRisk(risk);
          clearInterval(timer);
        } else {
          setDisplayRisk(Math.round(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    } else {
      setDisplayRisk(risk);
    }
  }, [risk, animated]);

  const offset = circumference - (displayRisk / 100) * circumference;
  const needleAngle = -90 + (displayRisk / 100) * 180;
  const riskInfo = getRiskLabel(displayRisk);
  const color = getRiskColor(displayRisk);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size / 2 + 40} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Color zones */}
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#36B37E" />
            <stop offset="30%" stopColor="#36B37E" />
            <stop offset="50%" stopColor="#FFAB00" />
            <stop offset="70%" stopColor="#FFAB00" />
            <stop offset="100%" stopColor="#FF5630" />
          </linearGradient>
        </defs>
        
        {/* Progress arc */}
        <motion.path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="url(#riskGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          style={{ strokeDasharray: circumference }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: needleAngle }}
          transition={{ duration: 1.5, ease: "easeOut", type: "spring", damping: 15 }}
          style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
        >
          <line
            x1={size / 2}
            y1={size / 2}
            x2={size / 2}
            y2={strokeWidth + 20}
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={size / 2} cy={size / 2} r="10" fill={color} />
          <circle cx={size / 2} cy={size / 2} r="5" fill="white" />
        </motion.g>

        {/* Labels */}
        <text x={strokeWidth} y={size / 2 + 25} fontSize="12" fill="#94a3b8">0%</text>
        <text x={size / 2 - 15} y={20} fontSize="12" fill="#94a3b8">50%</text>
        <text x={size - strokeWidth - 25} y={size / 2 + 25} fontSize="12" fill="#94a3b8">100%</text>
      </svg>

      {/* Center display */}
      <div className="absolute bottom-0 text-center pb-4">
        <motion.div
          key={displayRisk}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-5xl font-bold font-mono"
          style={{ color }}
        >
          {displayRisk}%
        </motion.div>
        <Badge
          status={getRiskBadgeStatus(riskInfo.level) as "success" | "warning" | "error"}
          variant="solid"
          size="lg"
          className="mt-2"
        >
          {riskInfo.label}
        </Badge>
      </div>
    </div>
  );
};

// Risk Factor Bar Component
interface RiskFactorBarProps {
  name: string;
  impact: number;
  description: string;
  onMitigate: () => void;
  index: number;
}

const RiskFactorBar: React.FC<RiskFactorBarProps> = ({
  name,
  impact,
  description,
  onMitigate,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-lg border border-slate-200 hover:border-arka-blue/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="font-medium text-slate-700">{name}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <Badge status="error" variant="subtle" size="sm">
          +{impact}%
        </Badge>
      </div>
      
      <div className="mt-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-slate-400">Impact on Risk</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-arka-red/70"
            initial={{ width: 0 }}
            animate={{ width: `${impact}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onMitigate}
        className="mt-3"
        leftIcon={<Lightbulb className="h-3 w-3" />}
      >
        How to reduce
      </Button>
    </motion.div>
  );
};

// Simple Pie Chart Component
interface PieChartDisplayProps {
  approved: number;
  denied: number;
}

const PieChartDisplay: React.FC<PieChartDisplayProps> = ({ approved, denied }) => {
  const total = approved + denied;
  const approvedPercent = (approved / total) * 100;
  const deniedPercent = (denied / total) * 100;
  
  const size = 120;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const approvedOffset = circumference - (approvedPercent / 100) * circumference;

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#FF5630"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#36B37E"
            strokeWidth={strokeWidth}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: approvedOffset }}
            style={{ strokeDasharray: circumference }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <PieChart className="h-6 w-6 text-slate-400" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-arka-green" />
          <span className="text-sm text-slate-600">Approved: {approved.toLocaleString()}</span>
          <span className="text-sm font-medium text-arka-green">({approvedPercent.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-arka-red" />
          <span className="text-sm text-slate-600">Denied: {denied.toLocaleString()}</span>
          <span className="text-sm font-medium text-arka-red">({deniedPercent.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
};

// Payer Insight Item
interface PayerInsightProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

const PayerInsight: React.FC<PayerInsightProps> = ({ label, value, trend, icon }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-700">{value}</span>
        {trend === "up" && <TrendingUp className="h-4 w-4 text-arka-green" />}
        {trend === "down" && <TrendingDown className="h-4 w-4 text-arka-red" />}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DenialPredictor({
  onContinue,
  onGoBack,
  className,
}: DenialPredictorProps) {
  const {
    denialPrediction,
    selectedPatient,
    processing,
    completeStep,
    nextStep,
    simulateCriteriaMatching,
  } = useDemoStore();

  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showMitigationModal, setShowMitigationModal] = React.useState(false);
  const [selectedFactor, setSelectedFactor] = React.useState<string | null>(null);

  const risk = denialPrediction?.overallRisk || 35;
  const riskInfo = getRiskLabel(risk);
  const isHighRisk = risk > 60;

  const handleMitigate = (factorName: string) => {
    setSelectedFactor(factorName);
    setShowMitigationModal(true);
  };

  const handleContinue = async () => {
    await simulateCriteriaMatching();
    completeStep(4);
    nextStep();
    onContinue?.();
  };

  const handleImproveDocumentation = () => {
    onGoBack?.();
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
          <p className="text-slate-600">{processing.processingMessage || "Analyzing risk..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Badge status="info" variant="solid">Step 4</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            Denial Risk Assessment
          </h2>
        </div>
        <p className="text-slate-600">
          AI-powered prediction based on historical data and payer patterns
        </p>
      </motion.div>

      {/* Primary Display - Risk Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated" className="p-8">
          <div className="flex flex-col items-center">
            <RiskGauge risk={risk} />
            
            {isHighRisk && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-6 p-4 rounded-lg bg-arka-red/5 border border-arka-red/20 max-w-md text-center"
              >
                <div className="flex items-center justify-center gap-2 text-arka-red mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">High Risk Detected</span>
                </div>
                <p className="text-sm text-slate-600">
                  This submission has a significant chance of denial. Consider improving documentation before proceeding.
                </p>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Risk Factors Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="default">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-arka-red" />
                Contributing Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {denialPrediction?.factors.map((factor, index) => (
                  <RiskFactorBar
                    key={factor.id}
                    name={factor.name}
                    impact={factor.impact}
                    description={factor.description}
                    onMitigate={() => handleMitigate(factor.name)}
                    index={index}
                  />
                )) || (
                  <>
                    <RiskFactorBar
                      name="Missing Conservative Treatment Documentation"
                      impact={25}
                      description="No documented trial of physical therapy or medication"
                      onMitigate={() => handleMitigate("Conservative Treatment")}
                      index={0}
                    />
                    <RiskFactorBar
                      name="Insufficient Clinical Indication"
                      impact={15}
                      description="Clinical notes lack specific symptom details"
                      onMitigate={() => handleMitigate("Clinical Indication")}
                      index={1}
                    />
                    <RiskFactorBar
                      name="Prior Imaging Not Referenced"
                      impact={10}
                      description="No mention of previous diagnostic studies"
                      onMitigate={() => handleMitigate("Prior Imaging")}
                      index={2}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Historical & Payer Panels */}
        <div className="space-y-6">
          {/* Historical Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="default">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-arka-blue" />
                  Similar Cases Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-sm text-slate-500 mb-4">
                  Based on <span className="font-semibold text-slate-700">
                    {(denialPrediction?.similarCasesApproved || 847) + (denialPrediction?.similarCasesDenied || 115)}
                  </span> similar cases analyzed
                </p>
                
                <PieChartDisplay
                  approved={denialPrediction?.similarCasesApproved || 847}
                  denied={denialPrediction?.similarCasesDenied || 115}
                />

                <div className="mt-4 p-3 rounded-lg bg-arka-blue/5 border border-arka-blue/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Approval Rate for Similar Cases</span>
                    <span className="font-bold text-arka-blue">
                      {Math.round((denialPrediction?.similarCasesApproved || 847) / 
                        ((denialPrediction?.similarCasesApproved || 847) + (denialPrediction?.similarCasesDenied || 115)) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payer Intelligence */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="default">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-arka-teal" />
                  Payer-Specific Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Badge status="info" variant="solid">
                    {selectedPatient?.insurancePlan.name || "BlueCross BlueShield PPO"}
                  </Badge>
                  <Badge status="neutral" variant="outline">
                    {selectedPatient?.insurancePlan.rbmVendor || "eviCore"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <PayerInsight
                    label="Denial Rate (MRI)"
                    value="18%"
                    trend="down"
                    icon={<XCircle className="h-4 w-4 text-slate-400" />}
                  />
                  <PayerInsight
                    label="Avg. Processing Time"
                    value="2.3 days"
                    trend="neutral"
                    icon={<Clock className="h-4 w-4 text-slate-400" />}
                  />
                  <PayerInsight
                    label="Appeal Success Rate"
                    value="67%"
                    trend="up"
                    icon={<CheckCircle className="h-4 w-4 text-slate-400" />}
                  />
                </div>

                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Top Denial Reasons
                  </p>
                  <ol className="text-sm text-slate-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400">1.</span>
                      Missing conservative treatment (34%)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400">2.</span>
                      Insufficient indication (28%)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400">3.</span>
                      Documentation gaps (22%)
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleImproveDocumentation}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Improve Documentation
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowReportModal(true)}
            leftIcon={<FileText className="h-4 w-4" />}
          >
            View Full Report
          </Button>
        </div>

        <Button
          variant={isHighRisk ? "warning" : "primary"}
          size="lg"
          onClick={handleContinue}
          rightIcon={<ChevronRight className="h-5 w-5" />}
        >
          {isHighRisk ? "Proceed Anyway" : "Continue to RBM Check"}
        </Button>
      </motion.div>

      {/* Full Report Modal */}
      <Modal open={showReportModal} onOpenChange={setShowReportModal}>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle>Full Risk Assessment Report</ModalTitle>
            <ModalDescription>
              Comprehensive breakdown of denial risk factors
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="text-4xl font-bold" style={{ color: getRiskColor(risk) }}>
                  {risk}%
                </div>
                <Badge status={getRiskBadgeStatus(riskInfo.level) as "success" | "warning" | "error"} className="mt-2">
                  {riskInfo.label}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-3">Risk Breakdown</h4>
                <div className="space-y-2">
                  {denialPrediction?.factors.map((factor) => (
                    <div key={factor.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm text-slate-600">{factor.name}</span>
                      <span className="text-sm font-medium text-arka-red">+{factor.impact}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {denialPrediction?.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-arka-green mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Mitigation Modal */}
      <Modal open={showMitigationModal} onOpenChange={setShowMitigationModal}>
        <ModalContent size="md">
          <ModalHeader>
            <ModalTitle>How to Reduce This Risk</ModalTitle>
            <ModalDescription>
              Recommendations for: {selectedFactor}
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-arka-blue/5 border border-arka-blue/20">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-arka-blue mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-700">Add Specific Documentation</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Include detailed records of conservative treatments attempted, dates, duration, and outcomes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-arka-green mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-700">Expected Impact</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Addressing this factor could reduce denial risk by 15-25%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowMitigationModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              setShowMitigationModal(false);
              onGoBack?.();
            }}>
              Go to Documentation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default DenialPredictor;
