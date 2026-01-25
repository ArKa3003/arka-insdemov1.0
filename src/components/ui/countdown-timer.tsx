"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { differenceInSeconds } from "date-fns";
import { cn } from "@/lib/utils";

export type CountdownUrgency = "urgent" | "standard";

export interface CountdownTimerProps {
  deadline: Date;
  label: string;
  urgency?: CountdownUrgency;
  onExpired?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
}

function getTimeLeft(deadline: Date): TimeLeft {
  const now = new Date();
  const total = differenceInSeconds(deadline, now);

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true };
  }

  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return { days, hours, minutes, seconds, totalSeconds: total, isExpired: false };
}

/** Critical: < 24h for standard, < 4h for urgent */
function isCritical(urgency: CountdownUrgency, totalSeconds: number): boolean {
  if (urgency === "urgent") return totalSeconds > 0 && totalSeconds <= 4 * 3600;
  return totalSeconds > 0 && totalSeconds <= 24 * 3600;
}

export function CountdownTimer({
  deadline,
  label,
  urgency = "standard",
  onExpired,
  className,
}: CountdownTimerProps) {
  const [time, setTime] = React.useState<TimeLeft>(() => getTimeLeft(deadline));
  const hasCalledExpired = React.useRef(false);

  React.useEffect(() => {
    const t = setInterval(() => {
      const next = getTimeLeft(deadline);
      setTime(next);
      if (next.isExpired && onExpired && !hasCalledExpired.current) {
        hasCalledExpired.current = true;
        onExpired();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [deadline, onExpired]);

  const critical = isCritical(urgency, time.totalSeconds);

  if (time.isExpired) {
    return (
      <motion.div
        className={cn(
          "rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-center",
          "text-red-700 font-semibold",
          className
        )}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-[10px] uppercase tracking-wider text-red-600">{label}</div>
        <div className="text-sm">EXPIRED</div>
      </motion.div>
    );
  }

  const parts = [
    time.days > 0 && { v: time.days, u: "d" },
    { v: time.hours, u: "h" },
    { v: time.minutes, u: "m" },
    { v: time.seconds, u: "s" },
  ].filter(Boolean) as { v: number; u: string }[];

  return (
    <motion.div
      className={cn(
        "rounded-lg border px-3 py-2 text-center transition-colors",
        critical
          ? "border-red-300 bg-red-50/80 text-red-800 animate-[countdown-pulse_1.5s_ease-in-out_infinite]"
          : "border-slate-200 bg-slate-50 text-slate-800",
        className
      )}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          "text-[10px] font-medium uppercase tracking-wider",
          critical ? "text-red-600" : "text-slate-500"
        )}
      >
        {label}
      </div>
      <div className="mt-0.5 flex items-center justify-center gap-1 tabular-nums">
        {parts.map(({ v, u }, i) => (
          <span key={u} className="flex items-baseline gap-0.5">
            <motion.span
              key={`${v}-${u}`}
              className="font-bold"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {String(v).padStart(2, "0")}
            </motion.span>
            <span className="text-[10px] font-medium text-slate-500">{u}</span>
            {i < parts.length - 1 && <span className="text-slate-400">:</span>}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
