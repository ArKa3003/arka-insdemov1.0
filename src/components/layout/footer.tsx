"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-slate-200 bg-white py-6",
        className
      )}
    >
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} ARKA Insurance. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <a
            href="#"
            className="text-sm text-slate-500 hover:text-arka-blue transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-slate-500 hover:text-arka-blue transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-slate-500 hover:text-arka-blue transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
