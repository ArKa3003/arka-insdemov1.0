"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronRight,
  FileText,
  Lock,
  Monitor,
  Play,
  Pause,
  RefreshCw,
  Shield,
  Sparkles,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// ============================================================================
// TYPES
// ============================================================================

interface WorkflowVisualizerProps {
  className?: string;
}

interface EHRSystem {
  name: string;
  logo: string;
  status: "full" | "development" | "planned";
}

interface WorkflowStep {
  id: number;
  label: string;
  description: string;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const ehrSystems: EHRSystem[] = [
  { name: "Epic", logo: "E", status: "full" },
  { name: "Cerner", logo: "C", status: "full" },
  { name: "Meditech", logo: "M", status: "development" },
  { name: "athenahealth", logo: "A", status: "development" },
  { name: "AllScripts", logo: "AS", status: "planned" },
  { name: "Custom", logo: "✦", status: "full" },
];

const workflowSteps: WorkflowStep[] = [
  { id: 1, label: "Select Imaging Order", description: "Provider selects MRI from order menu" },
  { id: 2, label: "ARKA Analysis", description: "Real-time documentation analysis begins" },
  { id: 3, label: "Risk Assessment", description: "Denial risk score calculated" },
  { id: 4, label: "Optimization", description: "AI suggestions applied" },
  { id: 5, label: "Ready for Submit", description: "Documentation optimized" },
  { id: 6, label: "Order Submitted", description: "PA request sent to payer" },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// EHR Patient Banner (Epic-style)
const PatientBanner: React.FC<{ arkaActive: boolean }> = ({ arkaActive }) => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center font-bold">
            RT
          </div>
          <div>
            <p className="font-semibold">Thompson, Robert M</p>
            <p className="text-xs text-slate-300">DOB: 03/15/1966 (58y) • MRN: 12345678</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="px-2 py-1 bg-red-500/20 rounded text-red-300 text-xs">
            Allergies: PCN, Sulfa
          </div>
          <div className="text-slate-300">
            PCP: Dr. Williams
          </div>
        </div>
      </div>

      <AnimatePresence>
        {arkaActive && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-arka-blue/20 rounded-full border border-arka-blue/30"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-arka-blue"
            />
            <span className="text-xs font-medium text-arka-blue">PA Intelligence Active</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// EHR Order Entry Screen
interface OrderEntryScreenProps {
  currentStep: number;
  docScore: number;
  showDropdown: boolean;
  selectedOrder: boolean;
}

const OrderEntryScreen: React.FC<OrderEntryScreenProps> = ({
  currentStep,
  docScore,
  showDropdown,
  selectedOrder,
}) => {
  return (
    <div className="bg-slate-50 p-4 min-h-[300px]">
      <div className="grid grid-cols-3 gap-4">
        {/* Left - Order Entry Form */}
        <div className="col-span-2 bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            New Imaging Order
          </h3>

          {/* Order Type Dropdown */}
          <div className="mb-4">
            <label className="text-xs text-slate-500 block mb-1">Order Type</label>
            <div className="relative">
              <div className={cn(
                "p-2 border rounded bg-white flex items-center justify-between cursor-pointer",
                showDropdown ? "border-arka-blue ring-2 ring-arka-blue/20" : "border-slate-300"
              )}>
                <span className={selectedOrder ? "text-slate-700" : "text-slate-400"}>
                  {selectedOrder ? "MRI Lumbar Spine without Contrast" : "Select imaging type..."}
                </span>
                <ChevronRight className={cn(
                  "h-4 w-4 text-slate-400 transition-transform",
                  showDropdown && "rotate-90"
                )} />
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg"
                  >
                    <div className="p-2 hover:bg-arka-blue/5 cursor-pointer text-sm">
                      MRI Lumbar Spine without Contrast
                    </div>
                    <div className="p-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-500">
                      MRI Brain with/without Contrast
                    </div>
                    <div className="p-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-500">
                      CT Chest without Contrast
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ICD-10 */}
          <div className="mb-4">
            <label className="text-xs text-slate-500 block mb-1">Diagnosis (ICD-10)</label>
            <div className="p-2 border border-slate-300 rounded bg-slate-50 text-sm">
              M54.5 - Low back pain
            </div>
          </div>

          {/* Clinical Indication */}
          <div className="mb-4">
            <label className="text-xs text-slate-500 block mb-1">Clinical Indication</label>
            <div className="p-2 border border-slate-300 rounded bg-slate-50 text-sm h-20">
              Chronic low back pain with radicular symptoms...
            </div>
          </div>

          {/* ARKA Widget */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-3 rounded-lg bg-arka-blue/5 border border-arka-blue/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-arka-blue" />
                    <span className="text-sm font-medium text-arka-navy">ARKA Analysis</span>
                  </div>
                  <Badge
                    status={docScore >= 80 ? "success" : docScore >= 60 ? "warning" : "error"}
                    variant="solid"
                    size="sm"
                  >
                    {docScore}% Ready
                  </Badge>
                </div>
                <Progress value={docScore} size="sm" colorByValue />
                
                {currentStep >= 4 && docScore < 90 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2"
                      leftIcon={<Zap className="h-3 w-3" />}
                    >
                      Optimize Documentation
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right - ARKA Sidebar */}
        <AnimatePresence>
          {currentStep >= 2 && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="bg-white rounded-lg border border-slate-200 p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded bg-gradient-to-br from-arka-blue to-arka-teal flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <span className="font-semibold text-sm text-arka-navy">ARKA Insights</span>
              </div>

              {/* Mini Risk Gauge */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Denial Risk</p>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-12 w-12 rounded-full border-4 flex items-center justify-center font-bold text-sm",
                    docScore >= 80 ? "border-arka-green text-arka-green" :
                    docScore >= 60 ? "border-arka-amber text-arka-amber" :
                    "border-arka-red text-arka-red"
                  )}>
                    {100 - docScore}%
                  </div>
                  <div className="text-xs text-slate-500">
                    {docScore >= 80 ? "Low Risk" : docScore >= 60 ? "Medium Risk" : "High Risk"}
                  </div>
                </div>
              </div>

              {/* Documentation Gaps */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Top Gaps</p>
                <div className="space-y-1">
                  {currentStep < 5 ? (
                    <>
                      <div className="flex items-center gap-2 text-xs">
                        <X className="h-3 w-3 text-arka-red" />
                        <span className="text-slate-600">PT duration unclear</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <X className="h-3 w-3 text-arka-amber" />
                        <span className="text-slate-600">Add injection dates</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-arka-green" />
                        <span className="text-slate-600">All criteria met</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button className="w-full text-left text-xs p-2 rounded bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="text-arka-blue">+ Add conservative treatment</span>
                </button>
                <button className="w-full text-left text-xs p-2 rounded bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="text-arka-blue">+ Include exam findings</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BPA Alert */}
      <AnimatePresence>
        {currentStep >= 3 && currentStep < 5 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mt-4 p-4 rounded-lg bg-amber-50 border-2 border-amber-300 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-800">ARKA Alert: Documentation Gap Detected</p>
                <p className="text-sm text-amber-700 mt-1">
                  High denial risk ({100 - docScore}%) - Missing conservative treatment details
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="warning" size="sm">
                    View Recommendations
                  </Button>
                  <Button variant="ghost" size="sm">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      <AnimatePresence>
        {currentStep >= 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 rounded-lg bg-arka-green/10 border border-arka-green/30"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-arka-green" />
              <div>
                <p className="font-semibold text-slate-700">Order Submitted Successfully</p>
                <p className="text-sm text-slate-600">PA request sent - Pending authorization</p>
              </div>
              <Badge status="processing" variant="solid" className="ml-auto">
                Pending Review
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// EHR Status Bar
const StatusBar: React.FC = () => {
  return (
    <div className="bg-slate-800 text-slate-300 px-4 py-1.5 rounded-b-lg flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        <span>Epic Hyperspace 2024</span>
        <span>|</span>
        <span>Memorial Health System</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Last saved: Just now</span>
        <span>|</span>
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Secure Session
        </span>
      </div>
    </div>
  );
};

// Integration Architecture Diagram
const IntegrationDiagram: React.FC = () => {
  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-arka-blue" />
          Integration Architecture
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-center gap-4">
          {/* EHR */}
          <div className="text-center">
            <div className="h-20 w-20 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center mb-2">
              <Monitor className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">EHR System</p>
            <p className="text-xs text-slate-500">Epic / Cerner</p>
          </div>

          {/* Arrow with badges */}
          <div className="flex flex-col items-center gap-2">
            <Badge status="info" variant="outline" size="sm">FHIR R4</Badge>
            <ArrowRight className="h-6 w-6 text-slate-400" />
            <Badge status="info" variant="outline" size="sm">HL7 v2</Badge>
          </div>

          {/* ARKA */}
          <div className="text-center">
            <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-arka-blue to-arka-teal flex items-center justify-center mb-2">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-700">ARKA Platform</p>
            <p className="text-xs text-slate-500">AI Engine</p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2">
            <Badge status="success" variant="outline" size="sm">REST API</Badge>
            <ArrowRight className="h-6 w-6 text-slate-400" />
            <Badge status="success" variant="outline" size="sm">Webhooks</Badge>
          </div>

          {/* Payer */}
          <div className="text-center">
            <div className="h-20 w-20 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center mb-2">
              <Shield className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">Payer / RBM</p>
            <p className="text-xs text-slate-500">eviCore / AIM</p>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
          <Badge status="success" variant="solid">
            <Lock className="h-3 w-3 mr-1" />
            HIPAA Compliant
          </Badge>
          <Badge status="success" variant="solid">
            <Shield className="h-3 w-3 mr-1" />
            SOC 2 Type II
          </Badge>
          <Badge status="info" variant="solid">
            <Check className="h-3 w-3 mr-1" />
            HITRUST Certified
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

// Supported EHR Systems Grid
const EHRSystemsGrid: React.FC = () => {
  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-arka-teal" />
          Supported EHR Systems
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ehrSystems.map((system, index) => (
            <motion.div
              key={system.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all",
                system.status === "full"
                  ? "border-arka-green/30 bg-arka-green/5 hover:border-arka-green/50"
                  : system.status === "development"
                  ? "border-arka-amber/30 bg-arka-amber/5"
                  : "border-slate-200 bg-slate-50"
              )}
            >
              <div className={cn(
                "h-12 w-12 rounded-lg mx-auto mb-3 flex items-center justify-center font-bold text-lg",
                system.status === "full"
                  ? "bg-arka-green/10 text-arka-green"
                  : system.status === "development"
                  ? "bg-arka-amber/10 text-arka-amber"
                  : "bg-slate-100 text-slate-400"
              )}>
                {system.logo}
              </div>
              <p className="font-medium text-slate-700 text-sm mb-1">{system.name}</p>
              <Badge
                status={
                  system.status === "full" ? "success" :
                  system.status === "development" ? "warning" : "neutral"
                }
                variant="subtle"
                size="sm"
              >
                {system.status === "full" ? "Full Integration" :
                 system.status === "development" ? "In Development" : "Planned"}
              </Badge>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-arka-blue/5 border border-arka-blue/20 text-center">
          <p className="text-sm text-slate-600">
            Need a custom integration?{" "}
            <span className="text-arka-blue font-medium cursor-pointer hover:underline">
              Contact our team
            </span>
            {" "}to discuss your EHR requirements.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Workflow Step Indicator
interface WorkflowStepIndicatorProps {
  steps: WorkflowStep[];
  currentStep: number;
}

const WorkflowStepIndicator: React.FC<WorkflowStepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-4 px-2">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                scale: currentStep === step.id ? 1.1 : 1,
                backgroundColor: currentStep > step.id
                  ? "#36B37E"
                  : currentStep === step.id
                  ? "#0052CC"
                  : "#e2e8f0",
              }}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep > step.id
                  ? "text-white"
                  : currentStep === step.id
                  ? "text-white"
                  : "text-slate-400"
              )}
            >
              {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
            </motion.div>
            <p className={cn(
              "text-xs mt-1 text-center max-w-[80px]",
              currentStep >= step.id ? "text-slate-700" : "text-slate-400"
            )}>
              {step.label}
            </p>
          </div>
          
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 bg-slate-200 relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-arka-green"
                initial={{ width: "0%" }}
                animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function WorkflowVisualizer({ className }: WorkflowVisualizerProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [docScore, setDocScore] = React.useState(62);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startAnimation = () => {
    setIsPlaying(true);
    setCurrentStep(1);
    setDocScore(62);

    let step = 1;
    intervalRef.current = setInterval(() => {
      step++;
      
      if (step > 6) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsPlaying(false);
        return;
      }

      setCurrentStep(step);
      
      // Update doc score based on step
      if (step === 4) {
        setDocScore(75);
      } else if (step === 5) {
        setDocScore(92);
      }
    }, 2000);
  };

  const pauseAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
    setCurrentStep(1);
    setDocScore(62);
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-bold text-arka-navy mb-2">
          Seamless EHR Integration
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          See how ARKA embeds directly into your existing clinical workflow, providing real-time
          prior authorization intelligence without disrupting provider efficiency.
        </p>
      </motion.div>

      {/* Animation Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={isPlaying ? "secondary" : "primary"}
          onClick={isPlaying ? pauseAnimation : startAnimation}
          leftIcon={isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        >
          {isPlaying ? "Pause Demo" : "Play Demo"}
        </Button>
        <Button
          variant="ghost"
          onClick={resetAnimation}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Reset
        </Button>
      </div>

      {/* Workflow Steps */}
      <Card variant="elevated" className="overflow-hidden">
        <CardContent className="p-6">
          <WorkflowStepIndicator steps={workflowSteps} currentStep={currentStep} />
          
          {/* Current step description */}
          <div className="text-center mb-4 py-2 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-arka-navy">Step {currentStep}:</span>{" "}
              {workflowSteps[currentStep - 1]?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* EHR Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated" className="overflow-hidden shadow-xl">
          {/* EHR Window Frame */}
          <div className="bg-slate-200 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 bg-white rounded text-xs text-slate-500">
                Epic Hyperspace - Memorial Health System
              </div>
            </div>
          </div>

          {/* Patient Banner */}
          <PatientBanner arkaActive={currentStep >= 2} />

          {/* Order Entry Screen */}
          <OrderEntryScreen
            currentStep={currentStep}
            docScore={docScore}
            showDropdown={currentStep === 1}
            selectedOrder={currentStep >= 2}
          />

          {/* Status Bar */}
          <StatusBar />
        </Card>
      </motion.div>

      {/* Integration Architecture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <IntegrationDiagram />
      </motion.div>

      {/* Supported EHR Systems */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <EHRSystemsGrid />
      </motion.div>
    </div>
  );
}

export default WorkflowVisualizer;
