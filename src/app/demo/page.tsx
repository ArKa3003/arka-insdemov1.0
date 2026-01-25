"use client";

import * as React from "react";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDemoStore } from "@/stores/demo-store";
import { patients, imagingOrders } from "@/lib/mock-data";
import { DEMO_STEPS_10 } from "@/lib/constants";
import { EnhancedSidebar } from "@/components/demo/enhanced-sidebar";
import { PatientIntake } from "@/components/demo/patient-intake";
import { OrderEntry } from "@/components/demo/order-entry";
import { PreSubmissionAnalyzer } from "@/components/demo/pre-submission-analyzer";
import { AppealRiskPredictor } from "@/components/demo/appeal-risk-predictor";
import { DocumentationAssistant } from "@/components/demo/documentation-assistant";
import { RBMCriteriaMapper } from "@/components/demo/rbm-criteria-mapper";
import { GoldCardCheck } from "@/components/demo/gold-card-check";
import { CMSComplianceCheck } from "@/components/demo/cms-compliance-check";
import { HITLReview } from "@/components/demo/hitl-review";
import { SubmitAppealStep } from "@/components/demo/submit-appeal-step";
import { DemoErrorState } from "@/components/demo/demo-error-state";
import { DemoEmptyState } from "@/components/demo/demo-empty-state";
import { AnalysisTimeoutBanner } from "@/components/demo/analysis-timeout-banner";
import { useAnalysisTimeout } from "@/hooks/use-analysis-timeout";
import { useAnnouncer } from "@/components/providers/screen-reader-announcer";
import { trackDemoStep } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const StepFallback = () => (
  <div className="min-h-[320px] flex items-center justify-center" role="status" aria-live="polite">
    <div className="animate-pulse text-slate-500">Loading step…</div>
  </div>
);

type ScenarioMode = "standard" | "high-risk" | "gold-card";

const SCENARIO_INDEX: Record<ScenarioMode, number> = {
  standard: 0,
  "high-risk": 1,
  "gold-card": 2,
};

// ---------------------------------------------------------------------------
// Demo mode selector
// ---------------------------------------------------------------------------

function DemoModeSelector({
  value,
  onChange,
}: {
  value: ScenarioMode;
  onChange: (mode: ScenarioMode) => void;
}) {
  const modes: { id: ScenarioMode; label: string; description: string }[] = [
    { id: "standard", label: "Standard Flow", description: "Typical approval" },
    { id: "high-risk", label: "High-Risk Case", description: "Appeal prediction in action" },
    { id: "gold-card", label: "Gold Card Provider", description: "Auto-bypass flow" },
  ];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Demo mode">
      {modes.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          aria-pressed={value === m.id}
          aria-label={`${m.label}: ${m.description}`}
          className={cn(
            "flex flex-col items-start px-4 py-2.5 rounded-lg border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-arka-blue focus-visible:ring-offset-2",
            value === m.id
              ? "border-arka-blue bg-arka-blue/5"
              : "border-slate-200 hover:border-slate-300 bg-white"
          )}
        >
          <span className={cn("font-medium text-sm", value === m.id ? "text-arka-blue" : "text-slate-700")}>
            {m.label}
          </span>
          <span className="text-xs text-slate-500">{m.description}</span>
        </button>
      ))}
    </div>
  );
}


// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const DEMO_DATA_UNAVAILABLE = typeof patients === "undefined" || typeof imagingOrders === "undefined" || patients.length === 0 || imagingOrders.length === 0;

export default function DemoPage() {
  const [scenarioMode, setScenarioMode] = React.useState<ScenarioMode>("standard");
  const announce = useAnnouncer();

  const {
    currentStep,
    completedSteps,
    goToStep,
    previousStep,
    nextStep,
    resetDemo,
    initializeScenario,
    selectedPatient,
    processing,
  } = useDemoStore();

  const isAnalyzing = processing.isAnalyzing || processing.isGenerating;
  const isAnalysisTimeout = useAnalysisTimeout(isAnalyzing, 8000);

  const isFirst = currentStep === 1;
  const isLast = currentStep === 10;
  const stepName = DEMO_STEPS_10.find((s) => s.id === currentStep)?.name ?? `Step ${currentStep}`;

  // Empty state: steps 2–10 require a patient; if missing (e.g. after partial session restore), show CTA to Step 1
  const showEmptyState = currentStep >= 2 && !selectedPatient && !isAnalyzing;

  // Screen reader: announce step changes. Analytics: track demo step view.
  React.useEffect(() => {
    announce(`Step ${currentStep} of 10: ${stepName}`);
    trackDemoStep(currentStep, "view");
  }, [currentStep, stepName, announce]);

  // Keyboard: Left/Right to move between demo steps
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === "ArrowLeft") {
        if (!isFirst) {
          e.preventDefault();
          previousStep();
        }
      } else if (e.key === "ArrowRight") {
        if (!isLast) {
          e.preventDefault();
          nextStep();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFirst, isLast, previousStep, nextStep]);

  // Bootstrap: init with default scenario on first mount when demo data is available
  React.useEffect(() => {
    if (!DEMO_DATA_UNAVAILABLE) {
      initializeScenario(SCENARIO_INDEX["standard"]);
    }
  }, [initializeScenario]);

  // When scenario mode changes, re-initialize
  const handleModeChange = React.useCallback(
    (mode: ScenarioMode) => {
      setScenarioMode(mode);
      initializeScenario(SCENARIO_INDEX[mode]);
    },
    [initializeScenario]
  );

  const handleReset = React.useCallback(() => {
    resetDemo();
    initializeScenario(SCENARIO_INDEX[scenarioMode]);
  }, [resetDemo, initializeScenario, scenarioMode]);

  // Demo data unavailable: show error state and minimal chrome
  if (DEMO_DATA_UNAVAILABLE) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <DemoErrorState
            variant="demo-data-unavailable"
            onResetDemo={() => {
              resetDemo();
              initializeScenario(SCENARIO_INDEX[scenarioMode]);
            }}
          />
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PatientIntake />;
      case 2:
        return <OrderEntry />;
      case 3:
        return <PreSubmissionAnalyzer onGoBack={() => goToStep(2)} />;
      case 4:
        return <AppealRiskPredictor onGoBack={() => goToStep(3)} onResetDemo={handleReset} />;
      case 5:
        return <DocumentationAssistant onGoBack={() => goToStep(4)} />;
      case 6:
        return <RBMCriteriaMapper onGoBack={() => goToStep(5)} />;
      case 7:
        return <GoldCardCheck onGoBack={() => goToStep(6)} />;
      case 8:
        return <CMSComplianceCheck onGoBack={() => goToStep(7)} />;
      case 9:
        return <HITLReview onGoBack={() => goToStep(8)} />;
      case 10:
        return <SubmitAppealStep onGoBack={() => goToStep(9)} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top: Demo mode selector */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            Demo mode
          </p>
          <DemoModeSelector value={scenarioMode} onChange={handleModeChange} />
          <p className="text-xs text-slate-400 mt-2" role="note">
            Demonstration only — not for clinical use.
          </p>
        </div>
      </div>

      {/* Two-column: sidebar + main */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <EnhancedSidebar
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepSelect={goToStep}
          onReset={handleReset}
          totalSteps={10}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 lg:p-8" id="demo-main" aria-label="Demo content">
          <h1 className="sr-only">RBM Partner Demo</h1>
          {/* Timeout: "Analysis taking longer than expected" when AI runs > 8s */}
          {isAnalyzing && isAnalysisTimeout && (
            <div className="mb-4">
              <AnalysisTimeoutBanner />
            </div>
          )}

          {showEmptyState ? (
            <DemoEmptyState onGoToStep1={() => goToStep(1)} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Suspense fallback={<StepFallback />}>
                  {renderStep()}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Global Previous / Next - keyboard: Arrow Left/Right also moves steps */}
          <nav className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6" aria-label="Demo step navigation">
            <Button
              variant="secondary"
              size="md"
              onClick={previousStep}
              disabled={isFirst}
              leftIcon={<ChevronLeft className="h-4 w-4" aria-hidden />}
              aria-label="Previous step (or press Left arrow)"
            >
              Previous
            </Button>
            <span className="text-sm text-slate-500" aria-live="polite">
              Step {currentStep} of 10
            </span>
            <Button
              variant="primary"
              size="md"
              onClick={nextStep}
              disabled={isLast}
              rightIcon={<ChevronRight className="h-4 w-4" aria-hidden />}
              aria-label="Next step (or press Right arrow)"
            >
              Next
            </Button>
          </nav>
        </main>
      </div>
    </div>
  );
}
