"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-slate-900 border-t border-slate-800", className)}>
      {/* Disclaimer */}
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <p className="font-semibold text-white">Decision Support Only – Not Medical Advice</p>
        <p className="text-sm text-slate-400 mt-2">
          ARKA AIIE predicts denial failure risk using RAND/UCLA methodology and peer-reviewed
          evidence. Predictions support utilization management decisions but do not replace
          clinical judgment or constitute coverage determinations.
        </p>
      </div>

      {/* Version & FDA */}
      <div className="border-t border-slate-800 py-4 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-slate-500">
          <span>AIIE v2.0 | RAND/UCLA + GRADE Methodology | Evidence: January 2026</span>
          <span>FDA Non-Device CDS | 21st Century Cures Act § 3060</span>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600">
          © 2026 ARKA Health Technologies | For Authorized RBM Use Only
        </div>
      </div>
    </footer>
  );
}

export default Footer;
