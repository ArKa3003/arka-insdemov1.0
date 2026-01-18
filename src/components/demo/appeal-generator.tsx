"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  ChevronDown,
  Download,
  Copy,
  Phone,
  Search,
  ExternalLink,
  BookOpen,
  Scale,
  TrendingUp,
  Check,
  Paperclip,
  FileCheck,
  Sparkles,
  AlertCircle,
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

// ============================================================================
// TYPES
// ============================================================================

interface AppealGeneratorProps {
  onComplete?: () => void;
  onGoBack?: () => void;
  className?: string;
}

interface AppealTypeOption {
  id: "first-level" | "peer-to-peer" | "external-review";
  title: string;
  description: string;
  timeline: string;
  successRate: number;
  icon: React.ReactNode;
}

interface EvidenceItem {
  id: string;
  title: string;
  source: string;
  citation: string;
  relevance: "high" | "medium";
  pmid?: string;
}

interface AttachmentItem {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const appealTypes: AppealTypeOption[] = [
  {
    id: "first-level",
    title: "First-Level Appeal",
    description: "Reconsideration by initial reviewer with additional documentation",
    timeline: "5-7 business days",
    successRate: 65,
    icon: <FileText className="h-6 w-6" />,
  },
  {
    id: "peer-to-peer",
    title: "Peer-to-Peer Request",
    description: "Direct physician-to-physician discussion with medical director",
    timeline: "2-3 business days",
    successRate: 72,
    icon: <Phone className="h-6 w-6" />,
  },
  {
    id: "external-review",
    title: "External Review (IRO)",
    description: "Independent Review Organization evaluation",
    timeline: "30-45 calendar days",
    successRate: 78,
    icon: <Scale className="h-6 w-6" />,
  },
];

const sampleDenial = {
  date: "January 15, 2025",
  referenceNumber: "DN-2025-0115-78432",
  reasons: [
    "Documentation does not demonstrate failure of conservative treatment",
    "Clinical indication insufficient to establish medical necessity",
  ],
  citedGuidelines: "eviCore RAD-MSK-001 v2024.3",
  appealDeadline: 45,
};

const sampleAppealLetter = `[LETTERHEAD]
ARKA Health
123 Healthcare Drive
Boston, MA 02101

January 17, 2025

Medical Director
eviCore Healthcare
c/o BlueCross BlueShield
Appeals Department
P.O. Box 14079
Lexington, KY 40512-4079

RE: Appeal for Prior Authorization Denial
Patient: Robert Thompson
Member ID: BCB-987654321
Date of Service: January 15, 2025
Denied Service: MRI Lumbar Spine without Contrast (CPT 72148)
Reference Number: DN-2025-0115-78432

Dear Medical Director,

I am writing to formally appeal the denial of prior authorization for MRI of the lumbar spine for the above-referenced patient. After careful review of the denial rationale, I believe this decision should be reconsidered based on the comprehensive clinical documentation and established medical necessity criteria outlined below.

CLINICAL SUMMARY

Mr. Thompson is a 58-year-old male with an 18-month history of chronic low back pain with progressive radicular symptoms affecting bilateral lower extremities. His presentation is consistent with lumbar radiculopathy, most likely secondary to disc herniation or neural foraminal stenosis at the L4-L5 and/or L5-S1 levels.

RESPONSE TO DENIAL REASONS

1. Regarding Conservative Treatment Documentation:

Contrary to the denial rationale, Mr. Thompson has completed extensive conservative management including:

• Physical therapy: 12 sessions over 8 weeks (January - March 2024) with documented minimal improvement in pain and functional status
• Pharmacological management: NSAIDs (ibuprofen 800mg TID x 6 months), muscle relaxants (cyclobenzaprine 10mg TID), and gabapentin 300mg TID for neuropathic pain component
• Interventional procedures: Two lumbar epidural steroid injections (L4-L5, L5-S1) performed March 2024 and June 2024, providing only transient relief of 4-6 weeks duration

2. Regarding Medical Necessity:

Current objective findings strongly support the medical necessity for advanced imaging:

• Positive straight leg raise at 45 degrees bilaterally
• Diminished deep tendon reflexes at bilateral ankles
• Dermatomal sensory changes consistent with L5 radiculopathy
• Prior X-ray imaging (November 2023) demonstrated degenerative disc disease but was insufficient to evaluate soft tissue structures

SUPPORTING EVIDENCE

This request is consistent with established clinical guidelines:

• American College of Radiology Appropriateness Criteria® rates MRI lumbar spine as "Usually Appropriate" (Score: 8) for low back pain with suspected radiculopathy after failed conservative treatment [ACR AC, 2021]

• eviCore's own RAD-MSK-001 guidelines state that lumbar MRI is indicated when: (1) symptoms persist beyond 6 weeks, (2) conservative treatment has been attempted, and (3) objective neurological findings are present. All three criteria are clearly met in this case.

• Peer-reviewed literature supports early MRI in patients with radiculopathy and failed conservative treatment to guide appropriate intervention and prevent unnecessary delays in care [Chou R, et al. Ann Intern Med. 2011;154(3):181-189. PMID: 21282698]

CONCLUSION

Based on the comprehensive clinical documentation, objective examination findings, and alignment with established medical necessity criteria including eviCore's own published guidelines, I respectfully request that this denial be overturned and authorization granted for MRI of the lumbar spine without contrast (CPT 72148).

Please contact my office at (555) 123-4567 if additional information is needed.

Respectfully submitted,

Sarah Mitchell, MD
Board Certified Orthopedic Surgery
NPI: 1234567890

Enclosures:
- Physical therapy progress notes
- Medication history
- ESI procedure reports
- Physical examination documentation
- Prior X-ray report`;

const evidenceLibrary: EvidenceItem[] = [
  {
    id: "1",
    title: "ACR Appropriateness Criteria: Low Back Pain",
    source: "American College of Radiology",
    citation: "ACR AC Low Back Pain, Variant 5: Radiculopathy, 2021",
    relevance: "high",
  },
  {
    id: "2",
    title: "Diagnostic Imaging for Low Back Pain",
    source: "Annals of Internal Medicine",
    citation: "Chou R, et al. Ann Intern Med. 2011;154(3):181-189",
    relevance: "high",
    pmid: "21282698",
  },
  {
    id: "3",
    title: "MRI in Lumbar Radiculopathy Outcomes",
    source: "Spine Journal",
    citation: "Modic MT, et al. Spine J. 2015;15(8):1896-1903",
    relevance: "medium",
    pmid: "25912503",
  },
  {
    id: "4",
    title: "Conservative Treatment Duration Guidelines",
    source: "North American Spine Society",
    citation: "NASS Clinical Guidelines, Diagnosis and Treatment of Lumbar Disc Herniation with Radiculopathy, 2020",
    relevance: "high",
  },
];

const initialAttachments: AttachmentItem[] = [
  { id: "1", label: "Clinical notes excerpt", checked: true, required: true },
  { id: "2", label: "Prior imaging reports", checked: true, required: true },
  { id: "3", label: "Conservative treatment records", checked: true, required: true },
  { id: "4", label: "Physical therapy documentation", checked: true, required: false },
  { id: "5", label: "Specialist consultation notes", checked: false, required: false },
  { id: "6", label: "Lab results", checked: false, required: false },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

// Denial Summary Card
const DenialSummaryCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card variant="default" className="border-arka-red/30 bg-arka-red/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-arka-red/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-arka-red" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-slate-800">Original Request Denied</h3>
                <Badge status="error" variant="solid" size="sm">
                  Action Required
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Denial Date</p>
                  <p className="font-medium text-slate-700">{sampleDenial.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Reference Number</p>
                  <p className="font-mono text-sm text-slate-700">{sampleDenial.referenceNumber}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Stated Denial Reason(s)</p>
                <ul className="space-y-1">
                  {sampleDenial.reasons.map((reason, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-arka-red mt-2 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-xs text-slate-500">Cited Guidelines</p>
                  <Badge status="neutral" variant="outline" size="sm">
                    {sampleDenial.citedGuidelines}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-arka-amber">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {sampleDenial.appealDeadline} days to appeal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Appeal Strategy Panel
const AppealStrategyPanel: React.FC = () => {
  const strategy = {
    keyPoints: [
      "Emphasize comprehensive conservative treatment documentation",
      "Highlight objective neurological examination findings",
      "Reference eviCore's own published criteria supporting approval",
      "Include peer-reviewed literature supporting medical necessity",
    ],
    strength: "Strong" as const,
    historicalSuccessRate: 73,
  };

  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-arka-blue" />
          ARKA&apos;s Recommended Appeal Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Key Points to Address</p>
            <ul className="space-y-2">
              {strategy.keyPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <CheckCircle className="h-4 w-4 text-arka-green mt-0.5 flex-shrink-0" />
                  {point}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Strength Assessment</p>
              <Badge status="success" variant="solid">
                {strategy.strength} Chance
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Historical Success</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-arka-green" />
                <span className="font-bold text-arka-green">{strategy.historicalSuccessRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Appeal Type Selection
interface AppealTypeSelectionProps {
  selected: AppealTypeOption["id"] | null;
  onSelect: (id: AppealTypeOption["id"]) => void;
}

const AppealTypeSelection: React.FC<AppealTypeSelectionProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {appealTypes.map((type, index) => (
        <motion.button
          key={type.id}
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(type.id)}
          className={cn(
            "p-5 rounded-xl border-2 text-left transition-all",
            selected === type.id
              ? "border-arka-blue bg-arka-blue/5 ring-2 ring-arka-blue/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          )}
        >
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center mb-4",
            selected === type.id ? "bg-arka-blue text-white" : "bg-slate-100 text-slate-500"
          )}>
            {type.icon}
          </div>
          
          <h4 className="font-semibold text-slate-800 mb-1">{type.title}</h4>
          <p className="text-sm text-slate-500 mb-4">{type.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              {type.timeline}
            </div>
            <Badge
              status={type.successRate >= 70 ? "success" : "warning"}
              variant="subtle"
              size="sm"
            >
              {type.successRate}% success
            </Badge>
          </div>

          {selected === type.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 h-6 w-6 rounded-full bg-arka-blue flex items-center justify-center"
            >
              <Check className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

// Generated Appeal Letter
interface AppealLetterDisplayProps {
  isGenerating: boolean;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}

const AppealLetterDisplay: React.FC<AppealLetterDisplayProps> = ({
  isGenerating,
  onCopy,
  onDownload,
  copied,
}) => {
  const [displayText, setDisplayText] = React.useState("");

  React.useEffect(() => {
    if (isGenerating) {
      let i = 0;
      setDisplayText("");
      const timer = setInterval(() => {
        if (i < sampleAppealLetter.length) {
          setDisplayText(sampleAppealLetter.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 2);
      return () => clearInterval(timer);
    } else {
      setDisplayText(sampleAppealLetter);
    }
  }, [isGenerating]);

  // Highlight citations in the text
  const highlightCitations = (text: string) => {
    const citationPatterns = [
      /\[ACR AC[^\]]+\]/g,
      /\[Chou R[^\]]+\]/g,
      /PMID: \d+/g,
      /CPT \d+/g,
      /RAD-MSK-\d+/g,
    ];

    let result = text;
    citationPatterns.forEach((pattern) => {
      result = result.replace(pattern, (match) => `««${match}»»`);
    });

    return result.split(/(««[^»]+»»)/).map((part, i) => {
      if (part.startsWith("««") && part.endsWith("»»")) {
        const citation = part.slice(2, -2);
        return (
          <span
            key={i}
            className="text-arka-blue font-medium bg-arka-blue/10 px-1 rounded cursor-pointer hover:bg-arka-blue/20"
          >
            {citation}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card variant="elevated">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-arka-navy" />
            Generated Appeal Letter
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onCopy}
              leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onDownload}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Letter mockup with page styling */}
        <div className="p-8 bg-slate-50">
          <motion.div
            initial={{ rotateY: -10, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg border border-slate-200 p-8 max-h-[500px] overflow-y-auto"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            <pre className="whitespace-pre-wrap font-serif text-slate-700">
              {highlightCitations(displayText)}
              {isGenerating && <span className="animate-pulse text-arka-blue">|</span>}
            </pre>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

// Evidence Library
interface EvidenceLibraryProps {
  isOpen: boolean;
  onToggle: () => void;
}

const EvidenceLibrary: React.FC<EvidenceLibraryProps> = ({ isOpen, onToggle }) => {
  return (
    <Card variant="default" className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-arka-teal" />
          <span className="font-semibold text-slate-700">Supporting Evidence Library</span>
          <Badge status="info" variant="subtle" size="sm">
            {evidenceLibrary.length} sources
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
                {evidenceLibrary.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-slate-200 hover:border-arka-blue/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-700">{item.title}</p>
                        <p className="text-sm text-slate-500">{item.source}</p>
                        <p className="text-xs text-slate-400 mt-1 font-mono">{item.citation}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          status={item.relevance === "high" ? "success" : "info"}
                          variant="subtle"
                          size="sm"
                        >
                          {item.relevance} relevance
                        </Badge>
                        {item.pmid && (
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ExternalLink className="h-3 w-3" />}
                          >
                            PMID
                          </Button>
                        )}
                      </div>
                    </div>
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

// Attachments Checklist
interface AttachmentsChecklistProps {
  attachments: AttachmentItem[];
  onToggle: (id: string) => void;
}

const AttachmentsChecklist: React.FC<AttachmentsChecklistProps> = ({ attachments, onToggle }) => {
  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-100 pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-slate-500" />
          Evidence Attachments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {attachments.map((item) => (
            <label
              key={item.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                item.checked ? "bg-arka-green/5" : "hover:bg-slate-50"
              )}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => onToggle(item.id)}
                className="h-4 w-4 rounded border-slate-300 text-arka-blue focus:ring-arka-blue"
              />
              <span className={cn(
                "text-sm",
                item.checked ? "text-slate-700" : "text-slate-500"
              )}>
                {item.label}
              </span>
              {item.required && (
                <Badge status="warning" variant="subtle" size="sm">
                  Required
                </Badge>
              )}
            </label>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Selected attachments</span>
            <span className="font-medium text-slate-700">
              {attachments.filter((a) => a.checked).length} of {attachments.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Tracking Modal
interface TrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ open, onOpenChange }) => {
  const steps = [
    { label: "Appeal Submitted", date: "Jan 17, 2025", status: "completed" },
    { label: "Under Review", date: "Pending", status: "current" },
    { label: "Decision Rendered", date: "Est. Jan 24, 2025", status: "pending" },
    { label: "Notification Sent", date: "TBD", status: "pending" },
  ];

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>Appeal Status Tracking</ModalTitle>
          <ModalDescription>
            Reference: {sampleDenial.referenceNumber}
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                  step.status === "completed" && "bg-arka-green text-white",
                  step.status === "current" && "bg-arka-blue text-white",
                  step.status === "pending" && "bg-slate-100 text-slate-400"
                )}>
                  {step.status === "completed" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "font-medium",
                    step.status === "pending" ? "text-slate-400" : "text-slate-700"
                  )}>
                    {step.label}
                  </p>
                  <p className="text-sm text-slate-500">{step.date}</p>
                </div>
                {step.status === "current" && (
                  <Badge status="processing" variant="solid" size="sm">
                    In Progress
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-arka-blue" />
              <span className="font-medium text-slate-700">Estimated Decision</span>
            </div>
            <p className="text-sm text-slate-600">
              Based on historical data, you can expect a decision within 5-7 business days.
              We&apos;ll notify you immediately when the status changes.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AppealGenerator({
  onComplete,
  onGoBack,
  className,
}: AppealGeneratorProps) {
  const {
    completeStep,
    simulateAppealGeneration,
  } = useDemoStore();

  const [selectedAppealType, setSelectedAppealType] = React.useState<AppealTypeOption["id"] | null>("first-level");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showEvidence, setShowEvidence] = React.useState(false);
  const [showTracking, setShowTracking] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [attachments, setAttachments] = React.useState(initialAttachments);
  const [generationComplete, setGenerationComplete] = React.useState(false);
  const hasInitialized = React.useRef(false);

  const handleGenerate = React.useCallback(async () => {
    setIsGenerating(true);
    await simulateAppealGeneration();
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 3000);
  }, [simulateAppealGeneration]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleAppealLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Simulate PDF download
    const blob = new Blob([sampleAppealLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appeal-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleAttachment = (id: string) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a))
    );
  };

  const handleComplete = () => {
    completeStep(7);
    onComplete?.();
  };

  // Auto-generate on mount
  React.useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    handleGenerate();
  }, [handleGenerate]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Badge status="warning" variant="solid">Step 7</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            Appeal Generation Center
          </h2>
        </div>
        <p className="text-slate-600">
          AI-powered appeal letters with clinical evidence and guideline citations
        </p>
      </motion.div>

      {/* Denial Summary */}
      <DenialSummaryCard />

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Strategy & Type Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appeal Strategy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AppealStrategyPanel />
          </motion.div>

          {/* Appeal Type Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-slate-700 mb-4">Select Appeal Type</h3>
            <AppealTypeSelection
              selected={selectedAppealType}
              onSelect={setSelectedAppealType}
            />
          </motion.div>

          {/* Generated Appeal Letter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AppealLetterDisplay
              isGenerating={isGenerating}
              onCopy={handleCopy}
              onDownload={handleDownload}
              copied={copied}
            />
          </motion.div>
        </div>

        {/* Right Column - Attachments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <AttachmentsChecklist
            attachments={attachments}
            onToggle={handleToggleAttachment}
          />

          {/* Quick Actions */}
          <Card variant="default">
            <CardContent className="p-4 space-y-3">
              <Button
                variant="secondary"
                fullWidth
                leftIcon={<Phone className="h-4 w-4" />}
              >
                Schedule Peer-to-Peer
              </Button>
              <Button
                variant="ghost"
                fullWidth
                leftIcon={<Search className="h-4 w-4" />}
                onClick={() => setShowTracking(true)}
              >
                Track Appeal Status
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Evidence Library */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <EvidenceLibrary isOpen={showEvidence} onToggle={() => setShowEvidence(!showEvidence)} />
      </motion.div>

      {/* Success Message */}
      {generationComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-lg bg-arka-green/10 border border-arka-green/30"
        >
          <div className="flex items-center gap-3">
            <FileCheck className="h-6 w-6 text-arka-green" />
            <div>
              <p className="font-semibold text-slate-700">Appeal Letter Generated Successfully</p>
              <p className="text-sm text-slate-600">
                Your appeal letter has been generated with all supporting evidence and citations.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between pt-4 border-t border-slate-200"
      >
        <Button variant="secondary" onClick={onGoBack}>
          Back to RBM Check
        </Button>
        <Button
          variant="success"
          size="lg"
          onClick={handleComplete}
          disabled={!generationComplete}
          rightIcon={<CheckCircle className="h-5 w-5" />}
        >
          Complete Demo
        </Button>
      </motion.div>

      {/* Tracking Modal */}
      <TrackingModal open={showTracking} onOpenChange={setShowTracking} />
    </div>
  );
}

export default AppealGenerator;
