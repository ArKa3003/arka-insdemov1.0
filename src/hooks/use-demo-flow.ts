"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDemoStore } from "@/stores/demo-store";
import { WORKFLOW_STEPS } from "@/lib/constants";

interface UseDemoFlowOptions {
  autoPlayDelay?: number;
  onStepComplete?: (step: number) => void;
  onDemoComplete?: () => void;
}

/**
 * Hook for managing the demo workflow flow
 */
export function useDemoFlow(options: UseDemoFlowOptions = {}) {
  const {
    autoPlayDelay = 3000,
    onStepComplete,
    onDemoComplete,
  } = options;

  const store = useDemoStore();
  const {
    currentStep,
    completedSteps,
    processing,
    selectedPatientId,
    currentOrderId,
    preSubmissionAnalysis,
    denialPrediction,
    rbmCriteriaMatch,
    generatedJustification,
    generatedAppeal,
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    resetDemo,
    initializeScenario,
    simulatePreSubmissionAnalysis,
    simulateDenialPrediction,
    simulateCriteriaMatching,
    simulateJustificationGeneration,
    simulateAppealGeneration,
    isReadyForSubmission,
    overallRiskLevel,
    canProceedToNextStep,
    documentationScore,
    completionPercentage,
  } = store;

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);

  // Get current step info
  const currentStepInfo = WORKFLOW_STEPS.find((s) => s.id === currentStep);
  const totalSteps = WORKFLOW_STEPS.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  // Clear auto-play timer
  const clearAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  // Start auto-play
  const startAutoPlay = useCallback(() => {
    isPlayingRef.current = true;
    isPausedRef.current = false;
  }, []);

  // Pause auto-play
  const pauseAutoPlay = useCallback(() => {
    isPausedRef.current = true;
    clearAutoPlay();
  }, [clearAutoPlay]);

  // Resume auto-play
  const resumeAutoPlay = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  // Stop auto-play
  const stopAutoPlay = useCallback(() => {
    isPlayingRef.current = false;
    isPausedRef.current = false;
    clearAutoPlay();
  }, [clearAutoPlay]);

  // Handle step completion with simulations
  const completeCurrentStep = useCallback(async () => {
    completeStep(currentStep);
    onStepComplete?.(currentStep);
    
    if (isLastStep) {
      stopAutoPlay();
      onDemoComplete?.();
    } else {
      nextStep();
    }
  }, [currentStep, isLastStep, nextStep, stopAutoPlay, onStepComplete, onDemoComplete, completeStep]);

  // Run step simulation
  const runStepSimulation = useCallback(async (step: number) => {
    switch (step) {
      case 3: // Pre-Submission Analysis
        await simulatePreSubmissionAnalysis();
        break;
      case 4: // Denial Risk Assessment
        await simulateDenialPrediction();
        break;
      case 5: // Documentation Review
        await simulateJustificationGeneration();
        break;
      case 6: // RBM Criteria Check
        await simulateCriteriaMatching();
        break;
      case 7: // Submit / Appeal
        if (denialPrediction?.riskLevel === "critical" || denialPrediction?.riskLevel === "high") {
          await simulateAppealGeneration();
        }
        break;
    }
  }, [
    simulatePreSubmissionAnalysis,
    simulateDenialPrediction,
    simulateCriteriaMatching,
    simulateJustificationGeneration,
    simulateAppealGeneration,
    denialPrediction,
  ]);

  // Auto-play effect
  useEffect(() => {
    if (isPlayingRef.current && !isPausedRef.current && !isLastStep && !processing.isAnalyzing && !processing.isGenerating) {
      autoPlayTimerRef.current = setTimeout(() => {
        completeCurrentStep();
      }, autoPlayDelay);
    }

    return () => clearAutoPlay();
  }, [isLastStep, autoPlayDelay, completeCurrentStep, clearAutoPlay, processing.isAnalyzing, processing.isGenerating]);

  // Initialize demo with a specific scenario
  const initializeDemo = useCallback((scenarioIndex: number = 0) => {
    initializeScenario(scenarioIndex);
  }, [initializeScenario]);

  return {
    // State
    currentStep,
    currentStepInfo,
    totalSteps,
    progress,
    isPlaying: isPlayingRef.current,
    isPaused: isPausedRef.current,
    isFirstStep,
    isLastStep,
    completedSteps,
    workflowSteps: WORKFLOW_STEPS,
    
    // Processing state
    isProcessing: processing.isAnalyzing || processing.isGenerating,
    processingMessage: processing.processingMessage,
    processingProgress: processing.processingProgress,
    
    // Data state
    selectedPatientId,
    currentOrderId,
    preSubmissionAnalysis,
    denialPrediction,
    rbmCriteriaMatch,
    generatedJustification,
    generatedAppeal,
    
    // Computed values
    isReadyForSubmission: isReadyForSubmission(),
    overallRiskLevel: overallRiskLevel(),
    canProceedToNextStep: canProceedToNextStep(),
    documentationScore: documentationScore(),
    completionPercentage: completionPercentage(),
    
    // Navigation
    nextStep,
    previousStep,
    goToStep,
    
    // Auto-play controls
    startAutoPlay,
    pauseAutoPlay,
    resumeAutoPlay,
    stopAutoPlay,
    
    // Demo controls
    initializeDemo,
    resetDemo,
    completeCurrentStep,
    completeStep,
    
    // Simulation controls
    runStepSimulation,
    simulatePreSubmissionAnalysis,
    simulateDenialPrediction,
    simulateCriteriaMatching,
    simulateJustificationGeneration,
    simulateAppealGeneration,
  };
}

export default useDemoFlow;
