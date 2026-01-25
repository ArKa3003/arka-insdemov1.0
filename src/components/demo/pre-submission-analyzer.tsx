"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  Lightbulb,
  Check,
  ChevronRight,
  ChevronDown,
  Sparkles,
  FileSearch,
  ArrowRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDemoStore } from "@/stores/demo-store";
import { useAnnouncer } from "@/components/providers/screen-reader-announcer";
import type { DocumentationGap, GapSeverity } from "@/types";

// ============================================================================
// TYPES
// ============================================================================

interface PreSubmissionAnalyzerProps {
  onContinue?: () => void;
  onGoBack?: () => void;
  className?: string;
}

interface Suggestion {
  id: string;
  text: string;
  impact: number;
  applied: boolean;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const SeverityIcon: React.FC<{ severity: GapSeverity; className?: string }> = ({
  severity,
  className,
}) => {
  switch (severity) {
    case "critical":
      return <XCircle className={cn("text-arka-red", className)} />;
    case "major":
      return <AlertTriangle className={cn("text-arka-amber", className)} />;
    case "minor":
      return <Info className={cn("text-arka-blue", className)} />;
    default:
      return <AlertCircle className={cn("text-slate-400", className)} />;
  }
};

const getSeverityColor = (severity: GapSeverity): string => {
  switch (severity) {
    case "critical":
      return "border-arka-red/30 bg-arka-red/5";
    case "major":
      return "border-arka-amber/30 bg-arka-amber/5";
    case "minor":
      return "border-arka-blue/30 bg-arka-blue/5";
    default:
      return "border-slate-200 bg-slate-50";
  }
};

// Circular Progress Component
interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

const CircularScore: React.FC<CircularScoreProps> = ({
  score,
  size = 200,
  strokeWidth = 12,
  animated = true,
}) => {
  const [displayScore, setDisplayScore] = React.useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#36B37E"; // green
    if (s >= 50) return "#FFAB00"; // amber
    return "#FF5630"; // red
  };

  React.useEffect(() => {
    if (animated) {
      const duration = 1500;
      const steps = 60;
      const increment = score / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.round(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(displayScore)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={displayScore}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold font-mono"
          style={{ color: getColor(displayScore) }}
        >
          {displayScore}%
        </motion.span>
        <span className="text-sm text-slate-500 mt-1">Documentation Score</span>
      </div>
    </div>
  );
};

// Loading State Component
const AnalyzingState: React.FC = () => {
  const [dots, setDots] = React.useState("");

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      {/* Scanning animation */}
      <div className="relative mb-8">
        <motion.div
          className="h-32 w-32 rounded-full border-4 border-arka-blue/20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 h-32 w-32 rounded-full border-4 border-transparent border-t-arka-blue"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <FileSearch className="h-12 w-12 text-arka-blue" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-arka-navy mb-2">
        ARKA is analyzing your documentation{dots}
      </h3>
      <p className="text-slate-500 text-center max-w-md">
        Scanning clinical documentation, comparing against RBM criteria, and identifying potential gaps
      </p>

      {/* Progress indicators */}
      <div className="flex items-center gap-8 mt-8">
        {["Parsing Order", "Checking Criteria", "Analyzing Gaps"].map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            className="flex items-center gap-2"
          >
            <motion.div
              className="h-2 w-2 rounded-full bg-arka-blue"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
            <span className="text-sm text-slate-600">{step}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Gap Item Component
interface GapItemProps {
  gap: DocumentationGap;
  index: number;
  onFix: () => void;
}

const GapItem: React.FC<GapItemProps> = ({ gap, index, onFix }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "p-4 rounded-lg border-2 transition-all",
        getSeverityColor(gap.severity)
      )}
    >
      <div className="flex items-start gap-3">
        <SeverityIcon severity={gap.severity} className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-slate-800">{gap.description}</p>
              <p className="text-sm text-slate-500 mt-1">{gap.suggestedAction}</p>
            </div>
            <Badge
              status={
                gap.severity === "critical" ? "error" :
                gap.severity === "major" ? "warning" : "info"
              }
              variant="subtle"
              size="sm"
            >
              {gap.severity}
            </Badge>
          </div>
          
          {/* Required for criteria */}
          {gap.requiredFor && gap.requiredFor.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="text-xs text-slate-400">Required for:</span>
              {gap.requiredFor.map((criteria) => (
                <Badge key={criteria} status="neutral" variant="outline" size="sm">
                  {criteria}
                </Badge>
              ))}
            </div>
          )}

          {/* Fix button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onFix}
            className="mt-3"
            leftIcon={<Zap className="h-3 w-3" />}
          >
            Fix This
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Suggestion Item Component
interface SuggestionItemProps {
  suggestion: Suggestion;
  index: number;
  onApply: () => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ suggestion, index, onApply }) => {
  const [isTyping, setIsTyping] = React.useState(true);
  const [displayText, setDisplayText] = React.useState("");

  React.useEffect(() => {
    const text = suggestion.text;
    let i = 0;
    const delay = index * 500;
    
    const startTyping = setTimeout(() => {
      const typeTimer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(typeTimer);
        }
      }, 20);
      
      return () => clearInterval(typeTimer);
    }, delay);

    return () => clearTimeout(startTyping);
  }, [suggestion.text, index]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      className={cn(
        "p-4 rounded-lg border transition-all",
        suggestion.applied
          ? "border-arka-green/30 bg-arka-green/5"
          : "border-slate-200 bg-white hover:border-arka-blue/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
          suggestion.applied ? "bg-arka-green" : "bg-arka-amber/10"
        )}>
          {suggestion.applied ? (
            <Check className="h-4 w-4 text-white" />
          ) : (
            <Lightbulb className="h-4 w-4 text-arka-amber" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-700">
            {displayText}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
          
          {!isTyping && !suggestion.applied && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 mt-3"
            >
              <Button
                variant="primary"
                size="sm"
                onClick={onApply}
                leftIcon={<Sparkles className="h-3 w-3" />}
              >
                Apply
              </Button>
              <Badge status="success" variant="subtle" size="sm">
                +{suggestion.impact}% score
              </Badge>
            </motion.div>
          )}
          
          {suggestion.applied && (
            <Badge status="success" variant="solid" size="sm" className="mt-2">
              <Check className="h-3 w-3 mr-1" />
              Applied
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Before/After Comparison Component
interface ComparisonPanelProps {
  beforeScore: number;
  afterScore: number;
  beforeGaps: number;
  afterGaps: number;
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  beforeScore,
  afterScore,
  beforeGaps,
  afterGaps,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card variant="default" className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ArrowRight className="h-5 w-5 text-arka-blue" />
          <span className="font-semibold text-slate-700">Before & After ARKA Analysis</span>
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
              <div className="grid md:grid-cols-2 gap-6">
                {/* Before */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-slate-600 mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    Before ARKA
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Documentation Score</span>
                      <span className="font-mono font-bold text-slate-700">{beforeScore}%</span>
                    </div>
                    <Progress value={beforeScore} size="sm" colorByValue={false} className="bg-slate-200" indicatorClassName="bg-slate-400" />
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Gaps Identified</span>
                      <Badge status="neutral" variant="subtle">{beforeGaps} issues</Badge>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="p-4 rounded-lg bg-arka-green/5 border border-arka-green/20">
                  <h4 className="font-semibold text-arka-green mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-arka-green" />
                    After ARKA
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Documentation Score</span>
                      <span className="font-mono font-bold text-arka-green">{afterScore}%</span>
                    </div>
                    <Progress value={afterScore} size="sm" colorByValue />
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Gaps Remaining</span>
                      <Badge status="success" variant="subtle">{afterGaps} issues</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement summary */}
              <div className="mt-4 p-3 rounded-lg bg-arka-blue/5 border border-arka-blue/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Score Improvement</span>
                  <Badge status="info" variant="solid">
                    +{afterScore - beforeScore}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PreSubmissionAnalyzer({
  onContinue,
  onGoBack,
  className,
}: PreSubmissionAnalyzerProps) {
  const {
    preSubmissionAnalysis,
    processing,
    completeStep,
    nextStep,
    simulateDenialPrediction,
  } = useDemoStore();
  const announce = useAnnouncer();
  const announcedComplete = React.useRef(false);

  const [isAnalyzing, setIsAnalyzing] = React.useState(!preSubmissionAnalysis);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([
    { id: "1", text: "Add specific duration of symptoms (e.g., '18 months of chronic pain') to strengthen medical necessity.", impact: 5, applied: false },
    { id: "2", text: "Include failed conservative treatment details: PT sessions, medication names, and injection dates.", impact: 10, applied: false },
    { id: "3", text: "Document objective neurological findings from physical examination.", impact: 8, applied: false },
    { id: "4", text: "Reference prior imaging results to establish progression of condition.", impact: 5, applied: false },
  ]);
  const [bonusScore, setBonusScore] = React.useState(0);

  // Simulate analysis loading
  React.useEffect(() => {
    if (isAnalyzing) {
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing]);

  // Screen reader: announce when analysis completes
  React.useEffect(() => {
    const done = !isAnalyzing && !processing.isAnalyzing;
    if (done && !announcedComplete.current) {
      announcedComplete.current = true;
      announce("Pre-submission analysis complete.");
    }
  }, [isAnalyzing, processing.isAnalyzing, announce]);

  const handleApplySuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => {
        if (s.id === id && !s.applied) {
          setBonusScore((b) => b + s.impact);
          return { ...s, applied: true };
        }
        return s;
      })
    );
  };

  const handleContinue = async () => {
    await simulateDenialPrediction();
    completeStep(3);
    nextStep();
    onContinue?.();
  };

  const baseScore = preSubmissionAnalysis?.documentationScore || 75;
  const totalScore = Math.min(baseScore + bonusScore, 100);
  const isReady = totalScore >= 80;

  if (isAnalyzing || processing.isAnalyzing) {
    return (
      <div className={className}>
        <AnalyzingState />
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
          <Badge status="info" variant="solid">Step 3</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            Pre-Submission Analysis
          </h2>
        </div>
        <p className="text-slate-600">
          ARKA has analyzed your documentation against RBM criteria
        </p>
      </motion.div>

      {/* Top Section - Score Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated" className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <CircularScore score={totalScore} />
            
            <div className="text-center md:text-left">
              <Badge
                status={isReady ? "success" : "warning"}
                variant="solid"
                size="lg"
                className="mb-3"
              >
                {isReady ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Ready for Submission
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Needs Improvement
                  </>
                )}
              </Badge>
              
              <p className="text-slate-600 max-w-sm">
                {isReady
                  ? "Your documentation meets the recommended threshold for submission. Approval likelihood is high."
                  : "Consider addressing the identified gaps to improve your approval chances."}
              </p>

              {bonusScore > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Badge status="success" variant="subtle">
                    <Sparkles className="h-3 w-3 mr-1" />
                    +{bonusScore}% from AI suggestions
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content - Two Columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Documentation Gaps */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="default">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-arka-amber" />
                  Documentation Gaps Identified
                </span>
                <Badge status="warning" variant="subtle">
                  {preSubmissionAnalysis?.gaps.length || 0} issues
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {preSubmissionAnalysis?.gaps.map((gap, index) => (
                  <GapItem
                    key={gap.id}
                    gap={gap}
                    index={index}
                    onFix={() => onGoBack?.()}
                  />
                ))}
                
                {(!preSubmissionAnalysis?.gaps || preSubmissionAnalysis.gaps.length === 0) && (
                  <div className="text-center py-8 text-slate-500">
                    <Check className="h-12 w-12 mx-auto mb-3 text-arka-green" />
                    <p>No critical gaps identified!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="default">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-arka-blue" />
                AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    index={index}
                    onApply={() => handleApplySuggestion(suggestion.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section - Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ComparisonPanel
          beforeScore={baseScore}
          afterScore={totalScore}
          beforeGaps={preSubmissionAnalysis?.gaps.length || 3}
          afterGaps={Math.max(0, (preSubmissionAnalysis?.gaps.length || 3) - suggestions.filter(s => s.applied).length)}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-between pt-4 border-t border-slate-200"
      >
        <Button variant="secondary" onClick={onGoBack}>
          Back to Order Entry
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          rightIcon={<ChevronRight className="h-5 w-5" />}
        >
          Continue to Risk Assessment
        </Button>
      </motion.div>
    </div>
  );
}

export default PreSubmissionAnalyzer;
