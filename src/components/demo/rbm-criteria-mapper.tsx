"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RBMCriteriaMapperProps {
  className?: string;
}

export function RBMCriteriaMapper({ className }: RBMCriteriaMapperProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        RBM Criteria Mapper
      </h3>
      <p className="text-sm text-slate-600">
        Maps clinical documentation to Radiology Benefit Manager criteria for prior authorization.
      </p>
      {/* RBM criteria mapping interface will be implemented here */}
    </div>
  );
}

export default RBMCriteriaMapper;
