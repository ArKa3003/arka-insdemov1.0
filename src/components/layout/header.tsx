"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-arka-navy">
            ARKA
          </span>
          <span className="text-sm text-slate-500">Insurance Platform</span>
        </div>
        <nav className="flex items-center gap-6">
          {/* Navigation items will be added here */}
        </nav>
      </div>
    </header>
  );
}

export default Header;
