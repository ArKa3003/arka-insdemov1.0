"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Demo", href: "/demo" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Compliance", href: "/dashboard#compliance" },
  { label: "Documentation", href: "/docs" },
];

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setIsScrolled(v > 80));

  const isHeroTransparent = pathname === "/" && !isScrolled;
  const navLinkClass = isHeroTransparent
    ? "text-slate-300 hover:text-white"
    : "text-slate-600 hover:text-arka-blue";
  const logoDashClass = isHeroTransparent ? "text-slate-400" : "text-arka-navy";
  const rbmBadgeClass = isHeroTransparent
    ? "text-slate-400 bg-white/10"
    : "text-slate-500 bg-slate-100";
  const mobileMenuBtnClass = isHeroTransparent
    ? "text-slate-300 hover:bg-white/10"
    : "text-slate-600 hover:bg-slate-100";

  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.97)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 80],
    ["rgba(226, 232, 240, 0)", "rgba(226, 232, 240, 1)"]
  );
  const headerBlur = useTransform(
    scrollY,
    [0, 80],
    ["blur(0px)", "blur(12px)"]
  );

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-shadow duration-300",
          className
        )}
        style={{
          backgroundColor: isHeroTransparent ? "rgba(10, 22, 40, 0)" : headerBg,
          borderBottomWidth: "1px",
          borderBottomColor: isHeroTransparent ? "rgba(255, 255, 255, 0.08)" : headerBorder,
          backdropFilter: headerBlur,
          WebkitBackdropFilter: headerBlur,
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - ARKA-INS gradient */}
            <Link href="/" className="flex items-center gap-1.5">
              <span className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-arka-blue via-arka-teal to-arka-blue bg-clip-text text-transparent">
                ARKA
              </span>
              <span className={cn("font-display text-xl sm:text-2xl font-bold", logoDashClass)}>
                -
              </span>
              <span className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-arka-teal to-arka-blue bg-clip-text text-transparent">
                INS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn("text-sm font-medium transition-colors duration-200", navLinkClass)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded", rbmBadgeClass)}>
                  For RBM Partners
                </span>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium rounded-md bg-arka-blue text-white hover:bg-arka-blue/90 hover:shadow-lg hover:shadow-arka-blue/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arka-blue transition-all duration-200"
                >
                  Request Demo
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={cn("md:hidden p-2 rounded-lg transition-colors", mobileMenuBtnClass)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile slide-out drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[min(320px,85vw)] bg-white shadow-xl z-[70] md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
                <span className="font-display font-bold bg-gradient-to-r from-arka-blue to-arka-teal bg-clip-text text-transparent">
                  ARKA-INS
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-arka-blue transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <div className="px-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      For RBM Partners
                    </span>
                  </div>
                  <Link
                    href="/demo"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center w-full h-10 px-4 text-sm font-medium rounded-lg bg-arka-blue text-white hover:bg-arka-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arka-blue transition-all duration-200"
                  >
                    Request Demo
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
