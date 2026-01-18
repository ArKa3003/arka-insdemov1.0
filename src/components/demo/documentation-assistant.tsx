"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DocumentationAssistantProps {
  className?: string;
}

export function DocumentationAssistant({ className }: DocumentationAssistantProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        Documentation Assistant
      </h3>
      <p className="text-sm text-slate-600">
        AI-assisted documentation tool that suggests clinical documentation improvements.
      </p>
      {/* Documentation assistant interface will be implemented here */}
    </div>
  );
}

export default DocumentationAssistant;
