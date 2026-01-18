"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

const footerLinks: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "bg-arka-navy text-white",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold bg-gradient-to-r from-arka-blue to-arka-teal bg-clip-text text-transparent">
              ARKA
            </span>
            <span className="text-sm text-slate-400">
              © {currentYear} ARKA Health
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-arka-amber animate-pulse" />
              Demonstration Platform - Not for Clinical Use
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// Compact footer variant for demo pages
export function FooterCompact({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "bg-slate-900 text-slate-400 py-4 px-6",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <span>© {new Date().getFullYear()} ARKA Health</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-arka-amber animate-pulse" />
          Demo Platform - Not for Clinical Use
        </span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
