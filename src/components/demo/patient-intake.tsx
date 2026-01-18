"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PatientIntakeProps {
  className?: string;
}

export function PatientIntake({ className }: PatientIntakeProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        Patient Intake
      </h3>
      <p className="text-sm text-slate-600">
        Patient intake form component - captures patient demographics, insurance info, and clinical data.
      </p>
      {/* Patient intake form will be implemented here */}
    </div>
  );
}

export default PatientIntake;
