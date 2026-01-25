"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimpleTooltip } from "./tooltip";

export type ComplianceStatus = "compliant" | "warning" | "non-compliant";

export interface ComplianceBadgeProps {
  status: ComplianceStatus;
  label: string;
  deadline?: string;
  className?: string;
  /** Tooltip details (defaults to status + deadline info) */
  tooltipDetails?: React.ReactNode;
}

const statusConfig: Record<
  ComplianceStatus,
  { bg: string; text: string; border: string; icon: React.ElementType; iconSize: number }
> = {
  compliant: {
    bg: "bg-[#16a34a]/15",
    text: "text-[#16a34a]",
    border: "border-[#16a34a]/40",
    icon: Check,
    iconSize: 12,
  },
  warning: {
    bg: "bg-[#ca8a04]/15",
    text: "text-[#ca8a04]",
    border: "border-[#ca8a04]/40",
    icon: Clock,
    iconSize: 12,
  },
  "non-compliant": {
    bg: "bg-[#dc2626]/15",
    text: "text-[#dc2626]",
    border: "border-[#dc2626]/40",
    icon: X,
    iconSize: 12,
  },
};

/** Returns true if deadline is within 48 hours (approaching) for pulse */
function isDeadlineApproaching(deadline?: string): boolean {
  if (!deadline) return false;
  const d = new Date(deadline).getTime();
  const now = Date.now();
  const hours = (d - now) / (1000 * 60 * 60);
  return hours > 0 && hours <= 48;
}

export function ComplianceBadge({
  status,
  label,
  deadline,
  className,
  tooltipDetails,
}: ComplianceBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const pulse = isDeadlineApproaching(deadline);

  const defaultTooltip = (
    <div className="space-y-1 text-left">
      <div className="font-semibold">{label}</div>
      {deadline && <div className="text-white/90 text-xs">Deadline: {deadline}</div>}
      {pulse && <div className="text-amber-200 text-xs">Deadline approaching</div>}
    </div>
  );

  const content = (
    <motion.span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        config.bg,
        config.text,
        config.border,
        pulse && "animate-[countdown-pulse_1.5s_ease-in-out_infinite]",
        className
      )}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Icon size={config.iconSize} className="shrink-0" strokeWidth={2.5} />
      {label}
    </motion.span>
  );

  return (
    <SimpleTooltip content={tooltipDetails ?? defaultTooltip} variant="default">
      {content}
    </SimpleTooltip>
  );
}
