"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan,
  Magnet,
  Atom,
  Radio,
  Waves,
  CircleDot,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Sparkles,
  AlertCircle,
  Check,
  Clock,
  Save,
  Zap,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoStore } from "@/stores/demo-store";
import type { ImagingType, OrderUrgency, Laterality } from "@/types";

// ============================================================================
// TYPES & DATA
// ============================================================================

interface ImagingModality {
  type: ImagingType;
  label: string;
  icon: React.ReactNode;
  paRequired: boolean;
  description: string;
}

const imagingModalities: ImagingModality[] = [
  { type: "MRI", label: "MRI", icon: <Magnet className="h-6 w-6" />, paRequired: true, description: "Magnetic Resonance" },
  { type: "CT", label: "CT", icon: <Scan className="h-6 w-6" />, paRequired: true, description: "Computed Tomography" },
  { type: "PET", label: "PET", icon: <Atom className="h-6 w-6" />, paRequired: true, description: "Positron Emission" },
  { type: "PET-CT", label: "PET-CT", icon: <CircleDot className="h-6 w-6" />, paRequired: true, description: "Combined PET/CT" },
  { type: "Nuclear", label: "Nuclear", icon: <Radio className="h-6 w-6" />, paRequired: true, description: "Nuclear Medicine" },
  { type: "Ultrasound", label: "Ultrasound", icon: <Waves className="h-6 w-6" />, paRequired: false, description: "Sonography" },
];

const bodyPartsByImaging: Record<string, { value: string; label: string; cpt: string }[]> = {
  MRI: [
    { value: "brain", label: "Brain", cpt: "70553" },
    { value: "cervical-spine", label: "Cervical Spine", cpt: "72141" },
    { value: "thoracic-spine", label: "Thoracic Spine", cpt: "72146" },
    { value: "lumbar-spine", label: "Lumbar Spine", cpt: "72148" },
    { value: "shoulder", label: "Shoulder", cpt: "73221" },
    { value: "knee", label: "Knee", cpt: "73721" },
    { value: "hip", label: "Hip", cpt: "73721" },
    { value: "abdomen", label: "Abdomen", cpt: "74183" },
  ],
  CT: [
    { value: "head", label: "Head", cpt: "70460" },
    { value: "chest", label: "Chest", cpt: "71260" },
    { value: "abdomen-pelvis", label: "Abdomen/Pelvis", cpt: "74177" },
    { value: "cervical-spine", label: "Cervical Spine", cpt: "72125" },
    { value: "lumbar-spine", label: "Lumbar Spine", cpt: "72131" },
  ],
  "PET-CT": [
    { value: "whole-body", label: "Skull Base to Mid-Thigh", cpt: "78815" },
    { value: "limited", label: "Limited Area", cpt: "78814" },
  ],
  PET: [
    { value: "whole-body", label: "Whole Body", cpt: "78811" },
    { value: "brain", label: "Brain", cpt: "78608" },
  ],
  Nuclear: [
    { value: "bone-scan", label: "Bone Scan", cpt: "78306" },
    { value: "thyroid", label: "Thyroid", cpt: "78014" },
    { value: "cardiac", label: "Cardiac", cpt: "78452" },
  ],
  Ultrasound: [
    { value: "abdomen", label: "Abdomen", cpt: "76700" },
    { value: "pelvis", label: "Pelvis", cpt: "76856" },
    { value: "thyroid", label: "Thyroid", cpt: "76536" },
  ],
};

const commonDiagnoses = [
  { icd: "M54.5", description: "Low back pain" },
  { icd: "M54.16", description: "Radiculopathy, lumbar region" },
  { icd: "M51.16", description: "Intervertebral disc degeneration, lumbar region" },
  { icd: "G43.909", description: "Migraine, unspecified, not intractable" },
  { icd: "G44.209", description: "Tension-type headache, unspecified" },
  { icd: "M25.561", description: "Pain in right knee" },
  { icd: "M75.101", description: "Rotator cuff tear, right shoulder" },
  { icd: "C34.90", description: "Malignant neoplasm of bronchus or lung" },
  { icd: "R91.1", description: "Solitary pulmonary nodule" },
  { icd: "R22.2", description: "Localized swelling, mass, lump, trunk" },
];

const symptomDurations = [
  { value: "acute", label: "Less than 2 weeks" },
  { value: "subacute", label: "2-6 weeks" },
  { value: "chronic-short", label: "6-12 weeks" },
  { value: "chronic", label: "3-6 months" },
  { value: "chronic-long", label: "More than 6 months" },
];

const aiSuggestions: Record<string, string> = {
  "M54.5": "Patient presents with chronic low back pain refractory to conservative management including physical therapy and NSAIDs. MRI is requested to evaluate for structural pathology and guide further treatment planning.",
  "M54.16": "Patient with documented lumbar radiculopathy exhibiting dermatomal distribution of symptoms. Advanced imaging needed to identify nerve root compression and evaluate surgical candidacy.",
  "G43.909": "Patient with chronic migraines not responsive to standard prophylactic therapy. Imaging requested to rule out secondary causes given change in headache pattern.",
  "C34.90": "Staging imaging requested for suspected lung malignancy to determine extent of disease and guide treatment planning decisions.",
  "R91.1": "Incidental pulmonary nodule identified requiring characterization. PET-CT requested per Fleischner criteria for nodule >8mm with intermediate-high risk features.",
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = true,
  badge,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Card variant="default" className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-arka-blue">{icon}</div>
          <h3 className="font-semibold text-slate-700">{title}</h3>
          {badge}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0 pb-5 px-5 border-t border-slate-100">
              {children}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

interface DocumentationScoreSidebarProps {
  score: number;
  completedFields: string[];
  missingFields: string[];
}

const DocumentationScoreSidebar: React.FC<DocumentationScoreSidebarProps> = ({
  score,
  completedFields,
  missingFields,
}) => {
  return (
    <Card variant="elevated" className="sticky top-24">
      <CardHeader compact className="border-b border-slate-100">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-arka-blue" />
          Documentation Score
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Score display */}
        <div className="text-center mb-4">
          <motion.div
            key={score}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={cn(
              "text-4xl font-bold font-mono",
              score >= 80 ? "text-arka-green" :
              score >= 60 ? "text-arka-amber" : "text-arka-red"
            )}
          >
            {score}%
          </motion.div>
          <p className="text-xs text-slate-500 mt-1">Completion Score</p>
        </div>

        <Progress 
          value={score} 
          size="md" 
          colorByValue 
          className="mb-4"
        />

        {/* Completed fields */}
        {completedFields.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Completed
            </p>
            <ul className="space-y-1">
              {completedFields.map((field) => (
                <li key={field} className="flex items-center gap-2 text-sm text-arka-green">
                  <Check className="h-3 w-3" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing fields */}
        {missingFields.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Recommended
            </p>
            <ul className="space-y-1">
              {missingFields.map((field) => (
                <li key={field} className="flex items-center gap-2 text-sm text-slate-400">
                  <AlertCircle className="h-3 w-3" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface OrderEntryProps {
  onContinue?: () => void;
  onSaveDraft?: () => void;
  className?: string;
}

export function OrderEntry({ onContinue, onSaveDraft, className }: OrderEntryProps) {
  const { 
    selectedPatient,
    currentOrder,
    updateOrder,
    completeStep,
    nextStep,
    simulatePreSubmissionAnalysis,
  } = useDemoStore();

  // Form state
  const [imagingType, setImagingType] = React.useState<ImagingType | null>(
    (currentOrder?.imagingType as ImagingType) || null
  );
  const [bodyPart, setBodyPart] = React.useState<string>(currentOrder?.bodyPart || "");
  const [laterality, setLaterality] = React.useState<Laterality>(
    currentOrder?.laterality || "n/a"
  );
  const [contrast, setContrast] = React.useState(currentOrder?.contrast || false);
  const [primaryIcd, setPrimaryIcd] = React.useState<string>(currentOrder?.icdCodes?.[0] || "");
  const [additionalIcds, setAdditionalIcds] = React.useState<string[]>(
    currentOrder?.icdCodes?.slice(1) || []
  );
  const [clinicalIndication, setClinicalIndication] = React.useState(
    currentOrder?.clinicalIndication || ""
  );
  const [urgency, setUrgency] = React.useState<OrderUrgency>(currentOrder?.urgency || "routine");
  const [symptomDuration, setSymptomDuration] = React.useState("");
  const [clinicalNotes, setClinicalNotes] = React.useState(currentOrder?.clinicalNotes || "");
  
  // Conservative treatment checkboxes
  const [treatments, setTreatments] = React.useState({
    physicalTherapy: false,
    medication: false,
    priorImaging: false,
    specialist: false,
    other: false,
  });
  const [priorImagingDate, setPriorImagingDate] = React.useState("");
  const [otherTreatment, setOtherTreatment] = React.useState("");

  // AI suggestion state
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = React.useState(false);
  const [showSuggestion, setShowSuggestion] = React.useState(false);

  // Calculate documentation score
  const calculateScore = React.useCallback(() => {
    let score = 0;
    const completed: string[] = [];
    const missing: string[] = [];

    if (imagingType) { score += 15; completed.push("Imaging Type"); }
    else missing.push("Imaging Type");

    if (bodyPart) { score += 15; completed.push("Body Part"); }
    else missing.push("Body Part");

    if (primaryIcd) { score += 15; completed.push("Primary Diagnosis"); }
    else missing.push("Primary Diagnosis");

    if (clinicalIndication && clinicalIndication.length > 50) { 
      score += 20; completed.push("Clinical Indication"); 
    } else missing.push("Clinical Indication (50+ chars)");

    if (Object.values(treatments).some(t => t)) { 
      score += 15; completed.push("Conservative Treatment"); 
    } else missing.push("Conservative Treatment");

    if (symptomDuration) { score += 10; completed.push("Symptom Duration"); }
    else missing.push("Symptom Duration");

    if (clinicalNotes && clinicalNotes.length > 20) { 
      score += 10; completed.push("Clinical Notes"); 
    } else missing.push("Clinical Notes");

    return { score, completed, missing };
  }, [imagingType, bodyPart, primaryIcd, clinicalIndication, treatments, symptomDuration, clinicalNotes]);

  const { score, completed, missing } = calculateScore();

  // Get CPT code based on selections
  const cptCode = React.useMemo(() => {
    if (!imagingType || !bodyPart) return null;
    const parts = bodyPartsByImaging[imagingType] || [];
    const part = parts.find(p => p.value === bodyPart);
    return part?.cpt || null;
  }, [imagingType, bodyPart]);

  // Handle AI suggestion
  const handleAISuggestion = async () => {
    if (!primaryIcd) return;
    setIsGeneratingSuggestion(true);
    setShowSuggestion(false);
    
    // Simulate AI typing effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const suggestion = aiSuggestions[primaryIcd] || 
      `Advanced imaging is medically necessary for evaluation of ${commonDiagnoses.find(d => d.icd === primaryIcd)?.description || "the clinical condition"}. Patient has failed conservative management and imaging is required for treatment planning.`;
    
    setClinicalIndication(suggestion);
    setIsGeneratingSuggestion(false);
    setShowSuggestion(true);
  };

  // Handle form submission
  const handleAnalyzeOrder = async () => {
    // Update store with form data
    updateOrder({
      imagingType: imagingType || undefined,
      bodyPart,
      laterality,
      contrast,
      icdCodes: [primaryIcd, ...additionalIcds].filter(Boolean),
      clinicalIndication,
      urgency,
      clinicalNotes,
      cptCode: cptCode || undefined,
    });

    // Run analysis simulation
    await simulatePreSubmissionAnalysis();
    
    completeStep(2);
    nextStep();
    onContinue?.();
  };

  const handleSaveDraft = () => {
    updateOrder({
      imagingType: imagingType || undefined,
      bodyPart,
      laterality,
      contrast,
      icdCodes: [primaryIcd, ...additionalIcds].filter(Boolean),
      clinicalIndication,
      urgency,
      clinicalNotes,
      status: "draft",
    });
    onSaveDraft?.();
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Badge status="info" variant="solid">Step 2</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            Order Entry
          </h2>
        </div>
        <p className="text-slate-600">
          Enter imaging order details for {selectedPatient?.firstName} {selectedPatient?.lastName}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Main form */}
        <div className="space-y-4">
          {/* Section 1: Imaging Type */}
          <Section
            title="Imaging Type Selection"
            icon={<Scan className="h-5 w-5" />}
            badge={imagingType && <Badge status="success" size="sm">Selected</Badge>}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {imagingModalities.map((modality) => (
                <motion.button
                  key={modality.type}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setImagingType(modality.type);
                    setBodyPart("");
                  }}
                  className={cn(
                    "relative p-4 rounded-lg border-2 text-center transition-all",
                    imagingType === modality.type
                      ? "border-arka-blue bg-arka-blue/5"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div className={cn(
                    "mx-auto mb-2",
                    imagingType === modality.type ? "text-arka-blue" : "text-slate-400"
                  )}>
                    {modality.icon}
                  </div>
                  <p className={cn(
                    "font-semibold text-sm",
                    imagingType === modality.type ? "text-arka-blue" : "text-slate-700"
                  )}>
                    {modality.label}
                  </p>
                  <p className="text-xs text-slate-400">{modality.description}</p>
                  {modality.paRequired && (
                    <Badge status="warning" variant="subtle" size="sm" className="mt-2">
                      PA Required
                    </Badge>
                  )}
                  {imagingType === modality.type && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5"
                    >
                      <div className="h-5 w-5 rounded-full bg-arka-blue flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </Section>

          {/* Section 2: Anatomical Details */}
          <Section
            title="Anatomical Details"
            icon={<CircleDot className="h-5 w-5" />}
            badge={bodyPart && <Badge status="success" size="sm">Configured</Badge>}
          >
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Body Part
                </label>
                <Select value={bodyPart} onValueChange={setBodyPart}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select body part" />
                  </SelectTrigger>
                  <SelectContent>
                    {(bodyPartsByImaging[imagingType || "MRI"] || []).map((part) => (
                      <SelectItem key={part.value} value={part.value}>
                        {part.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Laterality
                </label>
                <Select value={laterality} onValueChange={(v) => setLaterality(v as Laterality)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="n/a">N/A</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="bilateral">Bilateral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Contrast
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setContrast(false)}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                      !contrast 
                        ? "border-arka-blue bg-arka-blue/5 text-arka-blue" 
                        : "border-slate-200 text-slate-600"
                    )}
                  >
                    Without Contrast
                  </button>
                  <button
                    type="button"
                    onClick={() => setContrast(true)}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                      contrast 
                        ? "border-arka-blue bg-arka-blue/5 text-arka-blue" 
                        : "border-slate-200 text-slate-600"
                    )}
                  >
                    With Contrast
                  </button>
                </div>
              </div>

              {cptCode && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    CPT Code
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <Badge status="info" variant="solid">{cptCode}</Badge>
                    <span className="text-sm text-slate-600">Auto-assigned</span>
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Section 3: Clinical Information */}
          <Section
            title="Clinical Information"
            icon={<FileText className="h-5 w-5" />}
            badge={primaryIcd && <Badge status="success" size="sm">Documented</Badge>}
          >
            <div className="space-y-4 mt-4">
              {/* Primary diagnosis */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Primary ICD-10 Diagnosis
                </label>
                <Select value={primaryIcd} onValueChange={setPrimaryIcd}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search or select diagnosis" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonDiagnoses.map((dx) => (
                      <SelectItem key={dx.icd} value={dx.icd}>
                        <span className="font-mono text-xs mr-2">{dx.icd}</span>
                        {dx.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional diagnoses */}
              {additionalIcds.length < 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAdditionalIcds([...additionalIcds, ""])}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Additional Diagnosis
                </Button>
              )}

              {additionalIcds.map((icd, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select 
                    value={icd} 
                    onValueChange={(v) => {
                      const newIcds = [...additionalIcds];
                      newIcds[index] = v;
                      setAdditionalIcds(newIcds);
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select diagnosis" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonDiagnoses.map((dx) => (
                        <SelectItem key={dx.icd} value={dx.icd}>
                          <span className="font-mono text-xs mr-2">{dx.icd}</span>
                          {dx.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => setAdditionalIcds(additionalIcds.filter((_, i) => i !== index))}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Clinical indication */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Clinical Indication
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAISuggestion}
                    disabled={!primaryIcd || isGeneratingSuggestion}
                    leftIcon={
                      isGeneratingSuggestion 
                        ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Sparkles className="h-4 w-4" /></motion.div>
                        : <Sparkles className="h-4 w-4" />
                    }
                  >
                    {isGeneratingSuggestion ? "Generating..." : "AI Assist"}
                  </Button>
                </div>
                <textarea
                  value={clinicalIndication}
                  onChange={(e) => setClinicalIndication(e.target.value)}
                  placeholder="Describe the clinical reason for this imaging study..."
                  rows={4}
                  className={cn(
                    "w-full rounded-lg border border-slate-300 p-3 text-sm",
                    "focus:border-arka-blue focus:ring-2 focus:ring-arka-blue/20 outline-none",
                    "placeholder:text-slate-400 resize-none"
                  )}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-slate-400">
                    {clinicalIndication.length} characters
                    {clinicalIndication.length < 50 && " (minimum 50 recommended)"}
                  </p>
                  {showSuggestion && (
                    <Badge status="success" size="sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* Section 4: Supporting Documentation */}
          <Section
            title="Supporting Documentation"
            icon={<Clock className="h-5 w-5" />}
          >
            <div className="space-y-4 mt-4">
              <p className="text-sm text-slate-600">
                Prior conservative treatment (check all that apply):
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { key: "physicalTherapy", label: "Physical Therapy" },
                  { key: "medication", label: "Medication Management" },
                  { key: "priorImaging", label: "Prior Imaging" },
                  { key: "specialist", label: "Specialist Consultation" },
                  { key: "other", label: "Other" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                      treatments[key as keyof typeof treatments]
                        ? "border-arka-green bg-arka-green/5"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={treatments[key as keyof typeof treatments]}
                      onChange={(e) => setTreatments({ ...treatments, [key]: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={cn(
                      "h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
                      treatments[key as keyof typeof treatments]
                        ? "bg-arka-green border-arka-green"
                        : "border-slate-300"
                    )}>
                      {treatments[key as keyof typeof treatments] && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm text-slate-700">{label}</span>
                  </label>
                ))}
              </div>

              {treatments.priorImaging && (
                <Input
                  label="Prior Imaging Date"
                  type="date"
                  value={priorImagingDate}
                  onChange={(e) => setPriorImagingDate(e.target.value)}
                />
              )}

              {treatments.other && (
                <Input
                  label="Other Treatment Details"
                  value={otherTreatment}
                  onChange={(e) => setOtherTreatment(e.target.value)}
                  placeholder="Describe other treatments..."
                />
              )}

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Duration of Symptoms
                </label>
                <Select value={symptomDuration} onValueChange={setSymptomDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {symptomDurations.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Additional Clinical Notes
                </label>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Any additional context that supports medical necessity..."
                  rows={3}
                  className={cn(
                    "w-full rounded-lg border border-slate-300 p-3 text-sm",
                    "focus:border-arka-blue focus:ring-2 focus:ring-arka-blue/20 outline-none",
                    "placeholder:text-slate-400 resize-none"
                  )}
                />
              </div>
            </div>
          </Section>

          {/* Section 5: Order Priority */}
          <Section
            title="Order Priority"
            icon={<Zap className="h-5 w-5" />}
          >
            <div className="space-y-3 mt-4">
              {(["routine", "urgent", "emergent"] as OrderUrgency[]).map((level) => (
                <label
                  key={level}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                    urgency === level
                      ? level === "emergent" ? "border-arka-red bg-arka-red/5" :
                        level === "urgent" ? "border-arka-amber bg-arka-amber/5" :
                        "border-arka-blue bg-arka-blue/5"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <input
                    type="radio"
                    name="urgency"
                    checked={urgency === level}
                    onChange={() => setUrgency(level)}
                    className="sr-only"
                  />
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                    urgency === level
                      ? level === "emergent" ? "border-arka-red" :
                        level === "urgent" ? "border-arka-amber" :
                        "border-arka-blue"
                      : "border-slate-300"
                  )}>
                    {urgency === level && (
                      <div className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        level === "emergent" ? "bg-arka-red" :
                        level === "urgent" ? "bg-arka-amber" :
                        "bg-arka-blue"
                      )} />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 capitalize">{level}</span>
                    <p className="text-xs text-slate-500">
                      {level === "routine" && "Standard processing time (24-72 hours)"}
                      {level === "urgent" && "Expedited review (4-24 hours)"}
                      {level === "emergent" && "Immediate processing required"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </Section>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <Button
              variant="secondary"
              onClick={handleSaveDraft}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleAnalyzeOrder}
              disabled={score < 50}
              rightIcon={<ChevronRight className="h-5 w-5" />}
            >
              Analyze Order
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <DocumentationScoreSidebar
            score={score}
            completedFields={completed}
            missingFields={missing}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderEntry;
