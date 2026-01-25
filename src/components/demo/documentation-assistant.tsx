"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Check,
  Copy,
  RefreshCw,
  Edit3,
  Save,
  X,
  Sparkles,
  Clock,
  FileCheck,
  BookOpen,
  Clipboard,
  AlertCircle,
  User,
  Stethoscope,
  Activity,
  FileImage,
  CheckCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoStore } from "@/stores/demo-store";

// ============================================================================
// TYPES
// ============================================================================

interface DocumentationAssistantProps {
  onContinue?: () => void;
  onGoBack?: () => void;
  className?: string;
}

interface CriteriaItem {
  id: string;
  label: string;
  met: boolean;
}

interface TemplateExample {
  id: string;
  title: string;
  imagingType: string;
  diagnosis: string;
  approvalRate: string;
  preview: string;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const sampleJustification = `The patient is a 58-year-old male with a documented history of chronic low back pain (ICD-10: M54.5) persisting for over 18 months, which has been refractory to conservative management. The patient has completed a comprehensive course of physical therapy consisting of 12 sessions over 8 weeks with only minimal improvement in pain and functional status.

Pharmacological interventions have included NSAIDs (ibuprofen 800mg TID) for 6 months, muscle relaxants (cyclobenzaprine 10mg TID), and a trial of gabapentin 300mg TID for neuropathic pain component. Despite adequate trials of these medications, the patient continues to experience significant limitations in activities of daily living.

The patient underwent lumbar epidural steroid injections (L4-L5, L5-S1) on two occasions (March 2024 and June 2024) with transient relief lasting approximately 4-6 weeks each time. Current physical examination reveals positive straight leg raise at 45 degrees bilaterally, diminished deep tendon reflexes at the ankle, and dermatomal sensory changes consistent with L5 radiculopathy.

Prior X-ray imaging (performed 14 months ago) demonstrated degenerative disc disease at L4-L5 and L5-S1 levels but was insufficient to evaluate soft tissue structures. Given the persistent radicular symptoms, failed conservative management, and objective neurological findings, MRI of the lumbar spine (CPT: 72148) is medically necessary to evaluate for disc herniation, neural foraminal stenosis, or other structural abnormalities that may be amenable to targeted intervention.

This imaging request meets medical necessity criteria as defined by eviCore guidelines RAD-MSK-001 for lumbar spine MRI, specifically addressing: documented conservative treatment failure, objective neurological findings, and symptom duration exceeding 6 weeks.`;

const keyPhrases = [
  "chronic low back pain",
  "refractory to conservative management",
  "physical therapy consisting of 12 sessions",
  "lumbar epidural steroid injections",
  "positive straight leg raise",
  "L5 radiculopathy",
  "medically necessary",
  "meets medical necessity criteria",
];

const sampleKeyPoints = [
  "18+ months of documented chronic low back pain (M54.5)",
  "Completed 12-session physical therapy course with minimal improvement",
  "Failed pharmacological trials: NSAIDs, muscle relaxants, gabapentin",
  "Two epidural steroid injections with only transient relief",
  "Objective findings: positive SLR, diminished reflexes, sensory changes",
  "Prior X-ray insufficient for soft tissue evaluation",
];

const sampleEvidence = [
  { item: "Physical Therapy Records", date: "Jan-Mar 2024", status: "documented" },
  { item: "Medication History", date: "18 months", status: "documented" },
  { item: "ESI Procedure Notes", date: "Mar & Jun 2024", status: "documented" },
  { item: "Physical Examination", date: "Current visit", status: "documented" },
  { item: "Prior X-ray Report", date: "Nov 2023", status: "documented" },
];

const criteriaChecklist: CriteriaItem[] = [
  { id: "1", label: "Clinical indication documented", met: true },
  { id: "2", label: "Conservative treatment history", met: true },
  { id: "3", label: "Duration of symptoms specified", met: true },
  { id: "4", label: "Objective findings included", met: true },
  { id: "5", label: "Prior imaging referenced", met: true },
  { id: "6", label: "Medical necessity statement", met: true },
  { id: "7", label: "CPT/ICD codes included", met: true },
  { id: "8", label: "RBM guideline reference", met: true },
];

const templateExamples: TemplateExample[] = [
  {
    id: "1",
    title: "Lumbar MRI - Radiculopathy",
    imagingType: "MRI",
    diagnosis: "M54.5",
    approvalRate: "94%",
    preview: "58-year-old with chronic LBP and radicular symptoms after failed conservative treatment...",
  },
  {
    id: "2",
    title: "Brain MRI - Chronic Headache",
    imagingType: "MRI",
    diagnosis: "G43.909",
    approvalRate: "87%",
    preview: "45-year-old with new onset migraines, neurological exam abnormalities, red flag symptoms...",
  },
  {
    id: "3",
    title: "CT Chest - Pulmonary Nodule",
    imagingType: "CT",
    diagnosis: "R91.1",
    approvalRate: "96%",
    preview: "62-year-old with incidental pulmonary nodule requiring surveillance per Fleischner criteria...",
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

// Input Summary Panel
interface InputSummaryPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const InputSummaryPanel: React.FC<InputSummaryPanelProps> = ({ isOpen, onToggle }) => {
  const { selectedPatient, currentOrder } = useDemoStore();

  return (
    <Card variant="default" className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-arka-blue" />
          <span className="font-semibold text-slate-700">Input Summary</span>
          <Badge status="neutral" variant="subtle" size="sm">
            Clinical elements extracted
          </Badge>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Patient Demographics */}
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase">Patient</span>
                  </div>
                  <p className="font-medium text-slate-700">
                    {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : "Robert Thompson"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedPatient?.dateOfBirth ? `${new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()}y` : "58y"} {selectedPatient?.gender || "Male"}
                  </p>
                </div>

                {/* Diagnosis */}
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase">Diagnosis</span>
                  </div>
                  <p className="font-medium text-slate-700">
                    {currentOrder?.icdCodes?.[0] || "Chronic low back pain (M54.5)"}
                  </p>
                  <Badge status="info" variant="outline" size="sm" className="mt-1">
                    {typeof currentOrder?.icdCodes?.[0] === "string" ? currentOrder.icdCodes[0].split(" ")[0] : "M54.5"}
                  </Badge>
                </div>

                {/* Imaging Requested */}
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileImage className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase">Imaging</span>
                  </div>
                  <p className="font-medium text-slate-700">
                    {currentOrder?.imagingType || "MRI"} - {currentOrder?.bodyPart || "Lumbar Spine"}
                  </p>
                  <Badge status="info" variant="outline" size="sm" className="mt-1">
                    CPT: {currentOrder?.cptCode || "72148"}
                  </Badge>
                </div>

                {/* Clinical Indication */}
                <div className="p-3 rounded-lg bg-slate-50 md:col-span-2 lg:col-span-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase">Clinical Indication</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {currentOrder?.clinicalIndication || "Chronic low back pain with radicular symptoms, failed conservative treatment including physical therapy and epidural injections."}
                  </p>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// Typewriter Text Component
interface TypewriterTextProps {
  text: string;
  isGenerating: boolean;
  highlightPhrases?: string[];
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  isGenerating,
  highlightPhrases = [],
  onComplete,
}) => {
  const [displayText, setDisplayText] = React.useState("");
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    if (!isGenerating) {
      setDisplayText(text);
      setIsComplete(true);
      return;
    }

    let i = 0;
    setDisplayText("");
    setIsComplete(false);

    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
        onComplete?.();
      }
    }, 8);

    return () => clearInterval(timer);
  }, [text, isGenerating, onComplete]);

  // Highlight key phrases in the text
  const renderHighlightedText = () => {
    if (!isComplete || highlightPhrases.length === 0) {
      return displayText;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Find all matches and their positions
    const matches: { phrase: string; index: number }[] = [];
    highlightPhrases.forEach((phrase) => {
      const regex = new RegExp(phrase, "gi");
      let match;
      while ((match = regex.exec(displayText)) !== null) {
        matches.push({ phrase: match[0], index: match.index });
      }
    });

    // Sort by index
    matches.sort((a, b) => a.index - b.index);

    // Build the result
    matches.forEach((match, i) => {
      if (match.index >= lastIndex) {
        parts.push(displayText.slice(lastIndex, match.index));
        parts.push(
          <span key={i} className="text-arka-blue font-medium bg-arka-blue/5 px-0.5 rounded">
            {match.phrase}
          </span>
        );
        lastIndex = match.index + match.phrase.length;
      }
    });
    parts.push(displayText.slice(lastIndex));

    return parts;
  };

  return (
    <div className="prose prose-slate max-w-none">
      <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
        {renderHighlightedText()}
        {!isComplete && <span className="animate-pulse text-arka-blue">|</span>}
      </p>
    </div>
  );
};


// Quality Metrics Panel
interface QualityMetricsPanelProps {
  completeness: number;
  readability: number;
  wordCount: number;
  criteria: CriteriaItem[];
}

const QualityMetricsPanel: React.FC<QualityMetricsPanelProps> = ({
  completeness,
  readability,
  wordCount,
  criteria,
}) => {
  return (
    <Card variant="default" className="sticky top-4">
      <CardHeader className="border-b border-slate-100 pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-arka-green" />
          Quality Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Completeness Score */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Completeness</span>
            <span className="text-sm font-bold text-arka-green">{completeness}%</span>
          </div>
          <Progress value={completeness} size="sm" colorByValue />
        </div>

        {/* Readability Score */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Readability</span>
            <span className="text-sm font-bold text-arka-blue">{readability}</span>
          </div>
          <Progress value={readability} size="sm" colorByValue={false} indicatorClassName="bg-arka-blue" />
        </div>

        {/* Word Count */}
        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
          <span className="text-xs text-slate-500">Word Count</span>
          <span className="text-sm font-mono font-medium text-slate-700">{wordCount}</span>
        </div>

        {/* Criteria Coverage */}
        <div>
          <p className="text-xs text-slate-500 mb-2">Criteria Coverage</p>
          <div className="space-y-1.5">
            {criteria.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                {item.met ? (
                  <CheckCircle className="h-3.5 w-3.5 text-arka-green" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-arka-amber" />
                )}
                <span className={cn(
                  "text-xs",
                  item.met ? "text-slate-600" : "text-arka-amber"
                )}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Template Library Component
interface TemplateLibraryProps {
  isOpen: boolean;
  onToggle: () => void;
  templates: TemplateExample[];
  onUseTemplate: (template: TemplateExample) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  isOpen,
  onToggle,
  templates,
  onUseTemplate,
}) => {
  return (
    <Card variant="default" className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-arka-teal" />
          <span className="font-semibold text-slate-700">Template Library</span>
          <Badge status="success" variant="subtle" size="sm">
            Similar approved cases
          </Badge>
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
            <CardContent className="p-4">
              <div className="space-y-3">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-slate-200 hover:border-arka-blue/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-700">{template.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge status="info" variant="outline" size="sm">
                            {template.imagingType}
                          </Badge>
                          <Badge status="neutral" variant="outline" size="sm">
                            {template.diagnosis}
                          </Badge>
                        </div>
                      </div>
                      <Badge status="success" variant="subtle" size="sm">
                        {template.approvalRate} approved
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{template.preview}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUseTemplate(template)}
                      leftIcon={<Clipboard className="h-3 w-3" />}
                    >
                      Use Template
                    </Button>
                  </motion.div>
                ))}
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

export function DocumentationAssistant({
  onContinue,
  onGoBack,
  className,
}: DocumentationAssistantProps) {
  const {
    generatedJustification,
    denialPrediction,
    preSubmissionAnalysis,
    completeStep,
    nextStep,
    simulateJustificationGeneration,
  } = useDemoStore();

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationComplete, setGenerationComplete] = React.useState(false);
  const [showInputSummary, setShowInputSummary] = React.useState(false);
  const [showTemplates, setShowTemplates] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedText, setEditedText] = React.useState(sampleJustification);
  const [copied, setCopied] = React.useState(false);
  const [format, setFormat] = React.useState<"standard" | "optimized">("standard");
  const [progress, setProgress] = React.useState(0);
  const [timeRemaining, setTimeRemaining] = React.useState(0);

  const wordCount = editedText.split(/\s+/).length;
  const hasInitialized = React.useRef(false);

  const handleGenerate = React.useCallback(async () => {
    setIsGenerating(true);
    setGenerationComplete(false);
    setProgress(0);
    setTimeRemaining(3);

    // Simulate progress
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 95));
    }, 60);

    const timeTimer = setInterval(() => {
      setTimeRemaining((t) => Math.max(0, t - 1));
    }, 1000);

    await simulateJustificationGeneration();

    clearInterval(progressTimer);
    clearInterval(timeTimer);
    setProgress(100);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 500);
  }, [simulateJustificationGeneration]);

  // Simulate generation on mount if not already generated
  React.useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!generatedJustification) {
      handleGenerate();
    } else {
      setGenerationComplete(true);
    }
  }, [generatedJustification, handleGenerate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleContinue = () => {
    completeStep(5);
    nextStep();
    onContinue?.();
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Badge status="info" variant="solid">Step 5</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            Documentation Assistant
          </h2>
        </div>
        <p className="text-slate-600">
          AI-generated clinical justification optimized for prior authorization approval
        </p>
      </motion.div>

      {/* Input Summary Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <InputSummaryPanel
          isOpen={showInputSummary}
          onToggle={() => setShowInputSummary(!showInputSummary)}
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Generated Justification - 3 columns */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card variant="elevated">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-arka-blue" />
                  <CardTitle>Generated Clinical Justification</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {generationComplete && (
                    <Badge status="success" variant="subtle" size="sm">
                      {wordCount} words
                    </Badge>
                  )}
                  {isGenerating && (
                    <Badge status="processing" variant="subtle" size="sm">
                      <Clock className="h-3 w-3 mr-1" />
                      ~{timeRemaining}s remaining
                    </Badge>
                  )}
                </div>
              </div>

              {/* Format Toggle */}
              <div className="mt-4">
                <Tabs value={format} onValueChange={(v) => setFormat(v as "standard" | "optimized")} variant="pill">
                  <TabsList>
                    <TabsTrigger value="standard">Standard Format</TabsTrigger>
                    <TabsTrigger value="optimized">Payer-Optimized</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Generation Progress */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">
                      Generating clinical justification...
                    </span>
                    <span className="text-sm font-mono text-arka-blue">{progress}%</span>
                  </div>
                  <Progress value={progress} size="sm" colorByValue={false} indicatorClassName="bg-arka-blue" />
                </motion.div>
              )}

              {/* Narrative Display */}
              <div className="mb-6">
                {isEditing ? (
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full h-64 p-4 rounded-lg border border-slate-300 focus:border-arka-blue focus:ring-2 focus:ring-arka-blue/20 outline-none resize-none font-sans text-slate-700 leading-relaxed"
                  />
                ) : (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <TypewriterText
                      text={editedText}
                      isGenerating={isGenerating}
                      highlightPhrases={keyPhrases}
                      onComplete={() => setGenerationComplete(true)}
                    />
                  </div>
                )}
              </div>

              {/* Structured Elements */}
              {generationComplete && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Key Clinical Points */}
                  <div className="p-4 rounded-lg bg-arka-blue/5 border border-arka-blue/20">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-arka-blue" />
                      Key Clinical Points
                    </h4>
                    <ul className="space-y-2">
                      {sampleKeyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-arka-blue mt-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Supporting Evidence */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-500" />
                      Supporting Evidence
                    </h4>
                    <div className="space-y-2">
                      {sampleEvidence.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{item.item}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">{item.date}</span>
                            <Badge status="success" variant="subtle" size="sm">
                              <Check className="h-2.5 w-2.5 mr-1" />
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medical Necessity Statement */}
                  <div className="p-4 rounded-lg bg-arka-green/5 border border-arka-green/20">
                    <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-arka-green" />
                      Medical Necessity Statement
                    </h4>
                    <p className="text-sm text-slate-600">
                      MRI of the lumbar spine is medically necessary to evaluate for disc herniation, neural foraminal stenosis, or other structural abnormalities that may be amenable to targeted intervention, following documented failure of conservative management over 18 months.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Success Animation */}
              {generationComplete && !isGenerating && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="flex justify-center mt-6"
                >
                  <Badge status="success" variant="solid" size="lg">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Justification Generated Successfully
                  </Badge>
                </motion.div>
              )}

              {/* Editing Tools */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-slate-200">
                {isEditing ? (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveEdit}
                      leftIcon={<Save className="h-4 w-4" />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditedText(sampleJustification);
                        setIsEditing(false);
                      }}
                      leftIcon={<X className="h-4 w-4" />}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      leftIcon={<Edit3 className="h-4 w-4" />}
                      disabled={isGenerating}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleGenerate}
                      leftIcon={<RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />}
                      disabled={isGenerating}
                    >
                      Regenerate
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCopy}
                      leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      disabled={isGenerating}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Clipboard className="h-4 w-4" />}
                      disabled={isGenerating}
                    >
                      Insert into Order
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quality Metrics + Appeal Risk Impact - 1 column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <QualityMetricsPanel
            completeness={generationComplete ? 98 : progress}
            readability={82}
            wordCount={wordCount}
            criteria={criteriaChecklist}
          />
          {/* Appeal risk integration: how documentation affects risk score */}
          {(denialPrediction || preSubmissionAnalysis) && (
            <Card variant="default" className="overflow-hidden">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-arka-amber" />
                  How Documentation Affects Risk
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Current denial risk</span>
                  <span className={cn(
                    "font-mono font-bold",
                    (denialPrediction?.overallRisk ?? preSubmissionAnalysis?.estimatedDenialRisk ?? 0) >= 60 ? "text-arka-red" : "text-arka-green"
                  )}>
                    {denialPrediction?.overallRisk ?? preSubmissionAnalysis?.estimatedDenialRisk ?? 0}%
                  </span>
                </div>
                <Progress
                  value={denialPrediction?.overallRisk ?? preSubmissionAnalysis?.estimatedDenialRisk ?? 0}
                  size="sm"
                  colorByValue
                />
                <p className="text-xs text-slate-600">
                  Stronger documentation (conservative treatment, prior imaging, exam findings) typically reduces denial risk by 15–30%. This justification addresses {preSubmissionAnalysis?.gaps?.filter((g) => g.severity === "critical").length ? "some" : "most"} identified gaps.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Template Library */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TemplateLibrary
          isOpen={showTemplates}
          onToggle={() => setShowTemplates(!showTemplates)}
          templates={templateExamples}
          onUseTemplate={(template) => {
            console.log("Using template:", template.id);
          }}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between pt-4 border-t border-slate-200"
      >
        <Button variant="secondary" onClick={onGoBack}>
          Back to Risk Assessment
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!generationComplete || isGenerating}
          rightIcon={<ChevronRight className="h-5 w-5" />}
        >
          Continue to RBM Check
        </Button>
      </motion.div>
    </div>
  );
}

export default DocumentationAssistant;
