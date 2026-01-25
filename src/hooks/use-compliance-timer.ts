"use client";

import { useState, useEffect, useMemo } from "react";

// CMS: Urgent = 72 hours, Standard = 7 days (in ms)
const URGENT_MS = 72 * 60 * 60 * 1000;
const STANDARD_MS = 7 * 24 * 60 * 60 * 1000;

export type ComplianceTimerStatus = "safe" | "warning" | "critical" | "exceeded";

export type OrderUrgencyType = "urgent" | "standard";

export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface UseComplianceTimerOptions {
  /** When the prior auth or appeal was initiated */
  startDate: Date;
  /** 'urgent' = 72h, 'standard' = 7 days */
  urgency?: OrderUrgencyType;
  /** Optional: when to consider "start" (defaults to startDate) */
  referenceDate?: Date;
}

export interface UseComplianceTimerReturn {
  timeRemaining: TimeRemaining;
  percentageUsed: number;
  status: ComplianceTimerStatus;
  deadline: Date;
  isCompliant: boolean;
}

function getDeadline(start: Date, urgency: OrderUrgencyType): Date {
  const ms = urgency === "urgent" ? URGENT_MS : STANDARD_MS;
  return new Date(start.getTime() + ms);
}

function getPercentageUsed(now: Date, start: Date, deadline: Date): number {
  const total = deadline.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

function getStatus(percentageUsed: number, isExceeded: boolean): ComplianceTimerStatus {
  if (isExceeded) return "exceeded";
  if (percentageUsed >= 90) return "critical";
  if (percentageUsed >= 75) return "warning";
  return "safe";
}

function msToTimeRemaining(ms: number): TimeRemaining {
  const clamped = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;
  return { hours, minutes, seconds };
}

/**
 * Hook for CMS compliance deadline tracking.
 * - Urgent: 72 hours; Standard: 7 days.
 * - Warning at 75% used, Critical at 90% used.
 */
export function useComplianceTimer(options: UseComplianceTimerOptions): UseComplianceTimerReturn {
  const {
    startDate,
    urgency = "standard",
    referenceDate,
  } = options;

  const start = useMemo(() => (referenceDate ?? startDate), [referenceDate, startDate]);
  const deadline = useMemo(() => getDeadline(start, urgency), [start, urgency]);

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    const percentageUsed = getPercentageUsed(now, start, deadline);
    const remainingMs = deadline.getTime() - now.getTime();
    const isExceeded = remainingMs < 0;
    const status = getStatus(percentageUsed, isExceeded);
    const timeRemaining = msToTimeRemaining(remainingMs);

    return {
      timeRemaining,
      percentageUsed: Math.round(percentageUsed * 10) / 10,
      status,
      deadline,
      isCompliant: !isExceeded,
    };
  }, [now, start, deadline]);
}
