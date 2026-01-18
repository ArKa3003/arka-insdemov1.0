"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDemoStore } from "@/stores/demo-store";
import { WORKFLOW_STEPS } from "@/lib/constants";
import { mockPatients, mockClaims } from "@/lib/mock-data";

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

  const {
    currentStep,
    isPlaying,
    isPaused,
    setCurrentStep,
    nextStep,
    previousStep,
    setIsPlaying,
    setIsPaused,
    setSelectedPatient,
    setCurrentClaim,
    setAnalysisResults,
    resetDemo,
  } = useDemoStore();

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    setIsPlaying(true);
    setIsPaused(false);
  }, [setIsPlaying, setIsPaused]);

  // Pause auto-play
  const pauseAutoPlay = useCallback(() => {
    setIsPaused(true);
    clearAutoPlay();
  }, [setIsPaused, clearAutoPlay]);

  // Resume auto-play
  const resumeAutoPlay = useCallback(() => {
    setIsPaused(false);
  }, [setIsPaused]);

  // Stop auto-play
  const stopAutoPlay = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    clearAutoPlay();
  }, [setIsPlaying, setIsPaused, clearAutoPlay]);

  // Go to specific step
  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [setCurrentStep, totalSteps]
  );

  // Initialize demo with sample data
  const initializeDemo = useCallback(() => {
    // Set sample patient
    setSelectedPatient(mockPatients[0]);
    
    // Set sample claim
    setCurrentClaim(mockClaims[0]);
    
    // Set initial step
    setCurrentStep(1);
  }, [setSelectedPatient, setCurrentClaim, setCurrentStep]);

  // Handle step completion
  const completeCurrentStep = useCallback(() => {
    onStepComplete?.(currentStep);
    
    if (isLastStep) {
      stopAutoPlay();
      onDemoComplete?.();
    } else {
      nextStep();
    }
  }, [currentStep, isLastStep, nextStep, stopAutoPlay, onStepComplete, onDemoComplete]);

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && !isPaused && !isLastStep) {
      autoPlayTimerRef.current = setTimeout(() => {
        completeCurrentStep();
      }, autoPlayDelay);
    }

    return () => clearAutoPlay();
  }, [isPlaying, isPaused, isLastStep, autoPlayDelay, completeCurrentStep, clearAutoPlay]);

  // Simulate analysis at step 4
  useEffect(() => {
    if (currentStep === 4) {
      // Simulate AI analysis
      setTimeout(() => {
        setAnalysisResults({
          denialProbability: 0.35,
          riskFactors: [
            "Missing conservative treatment documentation",
            "Duration criteria not clearly stated",
          ],
          recommendations: [
            "Add physical therapy notes",
            "Document symptom duration explicitly",
            "Include failed treatment history",
          ],
        });
      }, 1000);
    }
  }, [currentStep, setAnalysisResults]);

  return {
    // State
    currentStep,
    currentStepInfo,
    totalSteps,
    progress,
    isPlaying,
    isPaused,
    isFirstStep,
    isLastStep,
    workflowSteps: WORKFLOW_STEPS,
    
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
  };
}

export default useDemoFlow;
