"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, Search, LayoutDashboard, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-lg mx-auto text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* ARKA branding */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="font-display text-2xl font-bold text-arka-navy">ARKA</span>
          <span className="font-display text-2xl font-semibold text-arka-blue">-INS</span>
        </div>

        {/* 404 icon */}
        <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
          <FileQuestion className="h-10 w-10 text-slate-500" />
        </div>

        <h1 className="font-display text-2xl font-bold text-arka-navy mb-2">
          Page not found
        </h1>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Try one of the links below or search.
        </p>

        {/* Non-functional search placeholder (demo) */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search (demo – non-functional)"
            className={cn(
              "w-full h-12 pl-11 pr-4 rounded-xl border-2 border-slate-200",
              "text-slate-700 placeholder:text-slate-400",
              "focus:outline-none focus:border-arka-blue focus:ring-2 focus:ring-arka-blue/20",
              "transition-colors"
            )}
            aria-label="Search"
          />
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/demo">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<FlaskConical className="h-5 w-5" />}
            >
              Demo
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<LayoutDashboard className="h-5 w-5" />}
            >
              Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="lg">
              Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
