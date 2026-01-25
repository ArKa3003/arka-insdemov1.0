"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { DashboardMetrics } from "@/types";
import { dashboardMetrics as initialMetrics } from "@/lib/mock-data";

export interface UseRealTimeMetricsOptions {
  /** Polling interval in ms when live (default 5000) */
  refreshInterval?: number;
  /** Optional initial metrics (defaults to mock dashboardMetrics) */
  initialMetrics?: DashboardMetrics;
}

export interface UseRealTimeMetricsReturn {
  metrics: DashboardMetrics;
  lastUpdated: Date;
  isLive: boolean;
  toggleLive: () => void;
}

function applyDemoVariation(metrics: DashboardMetrics): DashboardMetrics {
  const r = () => (Math.random() - 0.5) * 2;
  return {
    ...metrics,
    totalOrders: Math.max(1, metrics.totalOrders + Math.round(r() * 3)),
    submittedOrders: Math.max(0, metrics.submittedOrders + Math.round(r() * 2)),
    approvalRate: Math.max(0, Math.min(100, metrics.approvalRate + r() * 0.5)),
    denialRate: Math.max(0, Math.min(100, metrics.denialRate - r() * 0.3)),
    pendingCount: Math.max(0, metrics.pendingCount + Math.round(r() * 2)),
    appealCount: Math.max(0, metrics.appealCount + Math.round(r())),
    appealSuccessRate: Math.max(0, Math.min(100, metrics.appealSuccessRate + r() * 0.3)),
    averageProcessingTime: Math.max(1, metrics.averageProcessingTime + r() * 0.5),
    estimatedSavings: Math.max(0, metrics.estimatedSavings + Math.round(r() * 500)),
    documentationScoreAvg: Math.max(0, Math.min(100, metrics.documentationScoreAvg + r() * 0.3)),
    topDenialReasons: metrics.topDenialReasons.map((d) => ({
      ...d,
      count: Math.max(0, d.count + Math.round(r())),
      percentage: Math.max(0, d.percentage + r() * 0.2),
    })),
    ordersByStatus: metrics.ordersByStatus.map((s) => ({
      ...s,
      count: Math.max(0, s.count + Math.round(r())),
      percentage: Math.max(0, s.percentage + r() * 0.2),
    })),
    ordersByImagingType: metrics.ordersByImagingType.map((o) => ({
      ...o,
      count: Math.max(0, o.count + Math.round(r())),
      approvalRate: Math.max(0, Math.min(100, o.approvalRate + r() * 0.3)),
    })),
    trendsComparison: {
      ...metrics.trendsComparison,
      ordersChange: metrics.trendsComparison.ordersChange + r() * 0.5,
      approvalRateChange: metrics.trendsComparison.approvalRateChange + r() * 0.2,
      processingTimeChange: metrics.trendsComparison.processingTimeChange + r() * 1,
      savingsChange: metrics.trendsComparison.savingsChange + r() * 0.5,
    },
  };
}

/**
 * Hook for dashboard real-time metric updates.
 * Simulates live data when isLive is true (refreshInterval default 5000ms).
 */
export function useRealTimeMetrics(
  options: UseRealTimeMetricsOptions = {}
): UseRealTimeMetricsReturn {
  const { refreshInterval = 5000, initialMetrics: customInitial } = options;
  const base = useRef<DashboardMetrics>(customInitial ?? initialMetrics);

  const [metrics, setMetrics] = useState<DashboardMetrics>(() => base.current);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  const [isLive, setIsLive] = useState(false);

  const toggleLive = useCallback(() => setIsLive((prev) => !prev), []);

  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      base.current = applyDemoVariation(base.current);
      setMetrics({ ...base.current });
      setLastUpdated(new Date());
    }, refreshInterval);
    return () => clearInterval(id);
  }, [isLive, refreshInterval]);

  return {
    metrics,
    lastUpdated,
    isLive,
    toggleLive,
  };
}
