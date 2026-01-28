"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  ExternalLink,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  Shield,
  BarChart3,
  Building2,
  Calendar,
  Info,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

// ============================================================================
// TYPES
// ============================================================================

interface RBMCriteriaMapperProps {
  onContinue?: () => void;
  onGoBack?: () => void;
  className?: string;
}

// Extended criteria item for display purposes
interface DisplayCriteriaItem {
  id: string;
  criteriaCode: string;
  description: string;
  isMet: boolean;
  evidence: string | null;
  suggestedAction?: string;
  fullCriteriaText: string;
}

interface CriteriaCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: DisplayCriteriaItem[];
}

interface PayerComparison {
  payerName: string;
  rbmVendor: string;
  matchPercentage: number;
  criteriaMetCount: number;
  totalCriteria: number;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const sampleCriteriaCategories: CriteriaCategory[] = [
  {
    id: "clinical",
    title: "Required Clinical Criteria",
    icon: <FileText className="h-5 w-5 text-arka-blue" />,
    items: [
      {
        id: "RAD-MSK-001.a",
        criteriaCode: "RAD-MSK-001.a",
        description: "Clinical indication must document specific symptoms (pain, numbness, weakness)",
        isMet: true,
        evidence: "Documented: Chronic low back pain with radicular symptoms to bilateral lower extremities",
        fullCriteriaText: "The clinical indication must clearly document the presence of specific symptoms including but not limited to: pain, numbness, tingling, weakness, or functional limitations that are consistent with the suspected underlying condition.",
      },
      {
        id: "RAD-MSK-001.b",
        criteriaCode: "RAD-MSK-001.b",
        description: "Symptom duration must exceed 6 weeks unless red flags present",
        isMet: true,
        evidence: "Documented: Symptoms present for 18+ months with gradual progression",
        fullCriteriaText: "For non-emergent lumbar spine imaging, symptoms must be present for a minimum of 6 weeks unless red flag symptoms are present that warrant immediate evaluation.",
      },
      {
        id: "RAD-MSK-001.c",
        criteriaCode: "RAD-MSK-001.c",
        description: "Physical examination findings must support the clinical diagnosis",
        isMet: true,
        evidence: "Documented: Positive straight leg raise, diminished DTR, dermatomal sensory changes",
        fullCriteriaText: "Physical examination must include neurological assessment with documented findings that correlate with the suspected pathology.",
      },
    ],
  },
  {
    id: "supporting",
    title: "Supporting Documentation Criteria",
    icon: <Shield className="h-5 w-5 text-arka-teal" />,
    items: [
      {
        id: "RAD-MSK-001.d",
        criteriaCode: "RAD-MSK-001.d",
        description: "Prior conservative treatment trial of at least 4-6 weeks",
        isMet: true,
        evidence: "Documented: 12-week physical therapy course, medication trials, epidural injections",
        fullCriteriaText: "Documentation of conservative treatment including physical therapy, medication management, or other non-invasive interventions for a minimum of 4-6 weeks prior to advanced imaging.",
      },
      {
        id: "RAD-MSK-001.e",
        criteriaCode: "RAD-MSK-001.e",
        description: "Prior imaging studies must be referenced if performed",
        isMet: true,
        evidence: "Documented: X-ray performed 14 months ago showing degenerative changes",
        fullCriteriaText: "If prior imaging has been performed, results must be referenced and reason for additional imaging must be justified.",
      },
      {
        id: "RAD-MSK-001.f",
        criteriaCode: "RAD-MSK-001.f",
        description: "Specialist consultation documented if applicable",
        isMet: false,
        evidence: null,
        suggestedAction: "Consider adding documentation of specialist referral or consultation notes",
        fullCriteriaText: "If the patient has been evaluated by a specialist, consultation notes should be included to support the imaging request.",
      },
    ],
  },
  {
    id: "contraindications",
    title: "Contraindication Clearances",
    icon: <AlertTriangle className="h-5 w-5 text-arka-amber" />,
    items: [
      {
        id: "RAD-MSK-001.g",
        criteriaCode: "RAD-MSK-001.g",
        description: "No absolute contraindications to MRI present",
        isMet: true,
        evidence: "Cleared: No pacemaker, cochlear implant, or ferromagnetic implants documented",
        fullCriteriaText: "Patient must be screened for MRI contraindications including cardiac pacemakers, cochlear implants, certain aneurysm clips, and other ferromagnetic implants.",
      },
      {
        id: "RAD-MSK-001.h",
        criteriaCode: "RAD-MSK-001.h",
        description: "Contrast considerations addressed if applicable",
        isMet: true,
        evidence: "Cleared: Non-contrast study requested; no contrast contraindications applicable",
        fullCriteriaText: "If contrast is requested, renal function and allergy history must be documented. For non-contrast studies, this criterion is automatically met.",
      },
    ],
  },
];

const payerComparisons: PayerComparison[] = [
  { payerName: "BlueCross BlueShield", rbmVendor: "eviCore", matchPercentage: 88, criteriaMetCount: 7, totalCriteria: 8 },
  { payerName: "Aetna", rbmVendor: "AIM", matchPercentage: 81, criteriaMetCount: 6, totalCriteria: 8 },
  { payerName: "UnitedHealthcare", rbmVendor: "Carelon", matchPercentage: 75, criteriaMetCount: 6, totalCriteria: 8 },
  { payerName: "Cigna", rbmVendor: "Cohere", matchPercentage: 88, criteriaMetCount: 7, totalCriteria: 8 },
];

const guidelineInfo = {
  title: "RAD-MSK-001: Lumbar Spine MRI",
  vendor: "eviCore",
  version: "v2024.3",
  effectiveDate: "January 1, 2024",
  fullText: `LUMBAR SPINE MRI GUIDELINES (RAD-MSK-001)

INDICATIONS:
MRI of the lumbar spine is considered medically necessary for the evaluation of:
• Low back pain with radiculopathy that has not responded to at least 4-6 weeks of conservative management
• New or progressive neurological deficits
• Suspected spinal cord compression or cauda equina syndrome
• Pre-surgical planning for known lumbar pathology
• Evaluation of suspected infection, tumor, or inflammatory condition

DOCUMENTATION REQUIREMENTS:
1. Clinical indication with specific symptoms documented
2. Duration of symptoms (minimum 6 weeks for non-urgent cases)
3. Physical examination findings
4. History of conservative treatment attempts
5. Prior imaging results if applicable
6. Specialist consultation notes if applicable

CONTRAINDICATIONS:
Absolute contraindications to MRI must be ruled out including:
• Cardiac pacemakers (unless MRI-conditional)
• Cochlear implants
• Certain aneurysm clips
• Ferromagnetic foreign bodies

This guideline is effective as of January 1, 2024 and supersedes all previous versions.`,
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

// Criteria Match Score Display
interface CriteriaScoreDisplayProps {
  metCount: number;
  totalCount: number;
}

const CriteriaScoreDisplay: React.FC<CriteriaScoreDisplayProps> = ({ metCount, totalCount }) => {
  const percentage = Math.round((metCount / totalCount) * 100);
  const [displayPercentage, setDisplayPercentage] = React.useState(0);

  React.useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = percentage / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        setDisplayPercentage(percentage);
        clearInterval(timer);
      } else {
        setDisplayPercentage(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [percentage]);

  const getColor = (p: number) => {
    if (p >= 80) return "text-arka-green";
    if (p >= 60) return "text-arka-amber";
    return "text-arka-red";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={displayPercentage >= 80 ? "#36B37E" : displayPercentage >= 60 ? "#FFAB00" : "#FF5630"}
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: 440 - (440 * displayPercentage) / 100 }}
            style={{ strokeDasharray: 440 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={displayPercentage}
            className={cn("text-4xl font-bold font-mono", getColor(displayPercentage))}
          >
            {displayPercentage}%
          </motion.span>
          <span className="text-sm text-slate-500">Match</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <Badge
          status={percentage >= 80 ? "success" : percentage >= 60 ? "warning" : "error"}
          variant="solid"
          size="lg"
        >
          {metCount} of {totalCount} criteria met
        </Badge>
      </div>
    </div>
  );
};

// Single Criteria Item
interface CriteriaItemDisplayProps {
  item: DisplayCriteriaItem;
  index: number;
  onResolve?: () => void;
}

const CriteriaItemDisplay: React.FC<CriteriaItemDisplayProps> = ({ item, index, onResolve }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "border rounded-lg overflow-hidden transition-colors",
        item.isMet ? "border-arka-green/30 bg-arka-green/5" : "border-arka-red/30 bg-arka-red/5"
      )}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
          className="flex-shrink-0 mt-0.5"
        >
          {item.isMet ? (
            <CheckCircle className="h-5 w-5 text-arka-green" />
          ) : (
            <XCircle className="h-5 w-5 text-arka-red" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Badge status="neutral" variant="outline" size="sm" className="mb-1">
                {item.criteriaCode}
              </Badge>
              <p className="text-sm font-medium text-slate-700">{item.description}</p>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </motion.div>
          </div>

          {/* Evidence or Required Action */}
          <div className="mt-2">
            {item.isMet ? (
              <p className="text-xs text-arka-green flex items-start gap-1">
                <Check className="h-3 w-3 mt-0.5 flex-shrink-0" />
                {item.evidence}
              </p>
            ) : (
              <p className="text-xs text-arka-red flex items-start gap-1">
                <X className="h-3 w-3 mt-0.5 flex-shrink-0" />
                Required: {item.suggestedAction || "Documentation needed"}
              </p>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200"
          >
            <div className="p-4 bg-white">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Full Criteria Text</p>
              <p className="text-sm text-slate-600">{item.fullCriteriaText}</p>

              {!item.isMet && (
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolve?.();
                    }}
                    leftIcon={<Sparkles className="h-3 w-3" />}
                  >
                    Auto-Generate Evidence
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    leftIcon={<MessageSquare className="h-3 w-3" />}
                  >
                    Contact Provider
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Criteria Category Accordion
interface CriteriaCategoryAccordionProps {
  category: CriteriaCategory;
  defaultOpen?: boolean;
  onResolveItem?: (itemId: string) => void;
}

const CriteriaCategoryAccordion: React.FC<CriteriaCategoryAccordionProps> = ({
  category,
  defaultOpen = false,
  onResolveItem,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const metCount = category.items.filter((i) => i.isMet).length;
  const totalCount = category.items.length;
  const allMet = metCount === totalCount;

  return (
    <Card variant="default" className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {category.icon}
          <span className="font-semibold text-slate-700">{category.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            status={allMet ? "success" : "warning"}
            variant="subtle"
            size="sm"
          >
            {metCount}/{totalCount} met
          </Badge>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {category.items.map((item, index) => (
                  <CriteriaItemDisplay
                    key={item.id}
                    item={item}
                    index={index}
                    onResolve={() => onResolveItem?.(item.id)}
                  />
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// Guideline Reference Panel
interface GuidelineReferencePanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const GuidelineReferencePanel: React.FC<GuidelineReferencePanelProps> = ({ isOpen, onToggle }) => {
  return (
    <Card variant="default" className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-arka-navy" />
          <span className="font-semibold text-slate-700">Guideline Reference</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100"
          >
            <CardContent className="p-5">
              <div className="mb-4">
                <h4 className="font-semibold text-slate-700">{guidelineInfo.title}</h4>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge status="info" variant="solid" size="sm">
                    {guidelineInfo.vendor}
                  </Badge>
                  <Badge status="neutral" variant="outline" size="sm">
                    {guidelineInfo.version}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    Effective: {guidelineInfo.effectiveDate}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 max-h-64 overflow-y-auto">
                <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono">
                  {guidelineInfo.fullText}
                </pre>
              </div>

              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<ExternalLink className="h-3 w-3" />}
                >
                  View on eviCore Portal
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// Payer Comparison View
interface PayerComparisonViewProps {
  comparisons: PayerComparison[];
}

const PayerComparisonView: React.FC<PayerComparisonViewProps> = ({ comparisons }) => {
  const best = comparisons.reduce((a, b) => (a.matchPercentage > b.matchPercentage ? a : b));

  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-arka-blue" />
          Multi-Payer Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {comparisons.map((payer, index) => (
            <motion.div
              key={payer.payerName}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-3 rounded-lg border transition-colors",
                payer === best
                  ? "border-arka-green/30 bg-arka-green/5"
                  : "border-slate-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700 text-sm">{payer.payerName}</span>
                  <Badge status="neutral" variant="outline" size="sm">
                    {payer.rbmVendor}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {payer === best && (
                    <Badge status="success" variant="solid" size="sm">
                      Best Match
                    </Badge>
                  )}
                  <span className={cn(
                    "font-bold text-sm",
                    payer.matchPercentage >= 80 ? "text-arka-green" :
                    payer.matchPercentage >= 60 ? "text-arka-amber" : "text-arka-red"
                  )}>
                    {payer.matchPercentage}%
                  </span>
                </div>
              </div>
              <Progress
                value={payer.matchPercentage}
                size="sm"
                colorByValue
              />
              <p className="text-xs text-slate-500 mt-1">
                {payer.criteriaMetCount} of {payer.totalCriteria} criteria met
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function RBMCriteriaMapper({
  onContinue,
  onGoBack,
  className,
}: RBMCriteriaMapperProps) {
  const {
    selectedPatient,
    currentOrder,
    completeStep,
    nextStep,
    processing,
  } = useDemoStore();

  const [showGuideline, setShowGuideline] = React.useState(false);
  const [showComparisonModal, setShowComparisonModal] = React.useState(false);

  // Calculate totals
  const allItems = sampleCriteriaCategories.flatMap((c) => c.items);
  const metCount = allItems.filter((i) => i.isMet).length;
  const totalCount = allItems.length;

  const handleOptimize = () => {
    // Simulate optimization
    onGoBack?.();
  };

  const handleContinue = () => {
    completeStep(6);
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
          <p className="text-slate-600">{processing.processingMessage || "Mapping RBM criteria..."}</p>
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
          <Badge status="info" variant="solid">Step 6</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            RBM Criteria Mapping
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge status="info" variant="solid">
            {selectedPatient?.insurancePlan.rbmVendor || "eviCore"} Radiology Guidelines v2024
          </Badge>
          <button
            type="button"
            onClick={() => setShowGuideline(!showGuideline)}
            className="text-sm text-arka-blue hover:underline flex items-center gap-1"
          >
            RAD-MSK-001: Lumbar Spine MRI
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </motion.div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Score Display + AIIE Denial Risk Scores */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated" className="p-6">
            <CriteriaScoreDisplay metCount={metCount} totalCount={totalCount} />

            {/* AIIE Denial Risk Score - 1-9 scale */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">AIIE Denial Risk Score (1–9)</p>
              <div className="space-y-2">
                {(() => {
                  const imaging = currentOrder?.imagingType || "MRI";
                  const body = currentOrder?.bodyPart || "Lumbar Spine";
                  const aiieMap: Record<string, { rating: number; label: string }> = {
                    "MRI-Lumbar Spine": { rating: 8, label: "Low Denial Risk" },
                    "MRI-Brain": { rating: 3, label: "High Denial Risk" },
                    "PET-CT-Whole Body": { rating: 9, label: "Low Denial Risk" },
                  };
                  const key = `${imaging}-${body}`;
                  const aiie = aiieMap[key] || { rating: 7, label: "Low Denial Risk" };
                  return (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-sm text-slate-700">{imaging} {body}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-arka-blue">{aiie.rating}</span>
                        <Badge status="info" variant="subtle" size="sm">{aiie.label}</Badge>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">1=High denial risk, 9=Low denial risk</p>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={handleOptimize}
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                Optimize for Criteria
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowComparisonModal(true)}
                leftIcon={<BarChart3 className="h-4 w-4" />}
              >
                Compare Payers
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Right: Criteria Checklist */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          {sampleCriteriaCategories.map((category, index) => (
            <CriteriaCategoryAccordion
              key={category.id}
              category={category}
              defaultOpen={index === 0}
              onResolveItem={(itemId) => console.log("Resolve:", itemId)}
            />
          ))}
        </motion.div>
      </div>

      {/* Guideline Reference */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GuidelineReferencePanel
          isOpen={showGuideline}
          onToggle={() => setShowGuideline(!showGuideline)}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200"
      >
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onGoBack}>
            Back to Documentation
          </Button>
          <Button
            variant="ghost"
            onClick={onGoBack}
            leftIcon={<FileText className="h-4 w-4" />}
          >
            Generate Missing Docs
          </Button>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          rightIcon={<ChevronRight className="h-5 w-5" />}
        >
          Continue to Gold Card Check
        </Button>
      </motion.div>

      {/* Payer Comparison Modal */}
      <Modal open={showComparisonModal} onOpenChange={setShowComparisonModal}>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle>Multi-Payer Criteria Comparison</ModalTitle>
            <ModalDescription>
              See how your order matches criteria across different payers
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <PayerComparisonView comparisons={payerComparisons} />
            
            <div className="mt-4 p-4 rounded-lg bg-arka-blue/5 border border-arka-blue/20">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-arka-blue mt-0.5" />
                <div>
                  <p className="font-medium text-slate-700">Recommendation</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Your order best matches BlueCross BlueShield (eviCore) and Cigna (Cohere) criteria. Consider optimizing for AIM or Carelon if those are the patient&apos;s primary payers.
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowComparisonModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default RBMCriteriaMapper;
