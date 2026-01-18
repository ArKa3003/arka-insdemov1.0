"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Demo workflow steps
const demoSteps = [
  { id: 1, label: "Patient Intake", description: "Collect patient info" },
  { id: 2, label: "Order Entry", description: "Enter clinical orders" },
  { id: 3, label: "Pre-Submission Analysis", description: "Analyze readiness" },
  { id: 4, label: "Denial Risk Assessment", description: "AI risk prediction" },
  { id: 5, label: "Documentation Review", description: "Optimize docs" },
  { id: 6, label: "RBM Criteria Check", description: "Match criteria" },
  { id: 7, label: "Submit / Appeal", description: "Final submission" },
];

export interface SidebarProps {
  currentStep?: number;
  completedSteps?: number[];
  onStepClick?: (step: number) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

export function Sidebar({
  currentStep = 1,
  completedSteps = [],
  onStepClick,
  collapsed = false,
  onCollapsedChange,
  className,
}: SidebarProps) {
  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);
  const isStepActive = (stepId: number) => stepId === currentStep;
  const isStepClickable = (stepId: number) => 
    isStepCompleted(stepId) || stepId <= Math.max(...completedSteps, currentStep);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] z-40",
        "bg-white border-r border-slate-200",
        "flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-sm font-semibold text-arka-navy">
                Demo Workflow
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Step {currentStep} of {demoSteps.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => onCollapsedChange?.(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg text-slate-400 hover:text-slate-600",
            "hover:bg-slate-100 transition-colors",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Steps */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="relative">
          {/* Connection line */}
          <div
            className={cn(
              "absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200",
              collapsed && "left-[22px]"
            )}
          >
            {/* Progress line */}
            <motion.div
              className="absolute top-0 left-0 w-full bg-arka-blue"
              initial={{ height: 0 }}
              animate={{
                height: `${((currentStep - 1) / (demoSteps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step items */}
          <ul className="relative space-y-2">
            {demoSteps.map((step) => {
              const completed = isStepCompleted(step.id);
              const active = isStepActive(step.id);
              const clickable = isStepClickable(step.id);

              return (
                <li key={step.id}>
                  <button
                    onClick={() => clickable && onStepClick?.(step.id)}
                    disabled={!clickable}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg",
                      "transition-all duration-200",
                      "text-left",
                      clickable && "hover:bg-slate-50 cursor-pointer",
                      !clickable && "cursor-not-allowed opacity-60",
                      active && "bg-arka-blue/5",
                      collapsed && "justify-center"
                    )}
                  >
                    {/* Step indicator */}
                    <div
                      className={cn(
                        "relative flex items-center justify-center",
                        "h-8 w-8 rounded-full flex-shrink-0",
                        "text-xs font-bold",
                        "transition-all duration-200",
                        "border-2",
                        completed && "bg-arka-green border-arka-green text-white",
                        active && !completed && "bg-arka-blue border-arka-blue text-white",
                        !completed && !active && "bg-white border-slate-300 text-slate-500"
                      )}
                    >
                      {completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step.id
                      )}
                      
                      {/* Pulse animation for active step */}
                      {active && !completed && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-arka-blue"
                          initial={{ scale: 1, opacity: 0.4 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                      )}
                    </div>

                    {/* Step content */}
                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex-1 min-w-0"
                        >
                          <p
                            className={cn(
                              "text-sm font-medium truncate",
                              completed && "text-arka-green",
                              active && !completed && "text-arka-blue",
                              !completed && !active && "text-slate-700"
                            )}
                          >
                            {step.label}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {step.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer - Progress indicator */}
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 border-t border-slate-100"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Progress</span>
              <span>{Math.round((completedSteps.length / demoSteps.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-arka-blue to-arka-teal"
                initial={{ width: 0 }}
                animate={{
                  width: `${(completedSteps.length / demoSteps.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}

// Hook for sidebar state management
export function useSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  const goToStep = React.useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const completeStep = React.useCallback((step: number) => {
    setCompletedSteps((prev) => 
      prev.includes(step) ? prev : [...prev, step].sort((a, b) => a - b)
    );
  }, []);

  const nextStep = React.useCallback(() => {
    completeStep(currentStep);
    setCurrentStep((prev) => Math.min(prev + 1, demoSteps.length));
  }, [currentStep, completeStep]);

  const previousStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const reset = React.useCallback(() => {
    setCurrentStep(1);
    setCompletedSteps([]);
  }, []);

  return {
    collapsed,
    setCollapsed,
    currentStep,
    completedSteps,
    goToStep,
    completeStep,
    nextStep,
    previousStep,
    reset,
    totalSteps: demoSteps.length,
    progress: (completedSteps.length / demoSteps.length) * 100,
  };
}

export default Sidebar;
