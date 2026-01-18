"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface WorkflowVisualizerProps {
  className?: string;
}

export function WorkflowVisualizer({ className }: WorkflowVisualizerProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        Workflow Visualizer
      </h3>
      <p className="text-sm text-slate-600">
        Visual representation of the prior authorization workflow and current status.
      </p>
      {/* Workflow visualization will be implemented here */}
    </div>
  );
}

export default WorkflowVisualizer;
