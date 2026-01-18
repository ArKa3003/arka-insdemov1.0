"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DenialPredictorProps {
  className?: string;
}

export function DenialPredictor({ className }: DenialPredictorProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        Denial Predictor
      </h3>
      <p className="text-sm text-slate-600">
        AI-powered denial prediction showing likelihood scores and risk factors.
      </p>
      {/* Denial prediction interface will be implemented here */}
    </div>
  );
}

export default DenialPredictor;
