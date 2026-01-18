"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AppealGeneratorProps {
  className?: string;
}

export function AppealGenerator({ className }: AppealGeneratorProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        Appeal Generator
      </h3>
      <p className="text-sm text-slate-600">
        Generates structured appeal letters with evidence-based justifications for denied claims.
      </p>
      {/* Appeal generation interface will be implemented here */}
    </div>
  );
}

export default AppealGenerator;
