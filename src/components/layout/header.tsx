"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Demo", href: "/demo" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "About", href: "#about" },
];

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { scrollY } = useScroll();
  
  // Transform values based on scroll
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(226, 232, 240, 0)", "rgba(226, 232, 240, 1)"]
  );
  const headerBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "transition-shadow duration-300",
        className
      )}
      style={{
        backgroundColor: headerBg,
        borderBottomWidth: "1px",
        borderBottomColor: headerBorder,
        backdropFilter: headerBlur,
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-arka-blue to-arka-teal bg-clip-text text-transparent">
              ARKA
            </span>
            <span className="relative">
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-arka-navy rounded">
                INS
              </span>
            </span>
            <span className="hidden sm:block ml-3 text-sm text-slate-500 border-l border-slate-200 pl-3">
              Prior Authorization Intelligence
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    "text-slate-600 hover:text-arka-blue",
                    link.active && "text-arka-blue"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Button variant="primary" size="sm">
              Request Demo
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? "auto" : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-3 border-t border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "text-slate-600 hover:bg-slate-50 hover:text-arka-blue",
                  link.active && "bg-arka-blue/5 text-arka-blue"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 px-3">
              <Button variant="primary" size="sm" fullWidth>
                Request Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
}

export default Header;
