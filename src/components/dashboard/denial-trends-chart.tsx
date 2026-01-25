"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { monthlyMetricsData } from "@/lib/mock-data";

const chartData = monthlyMetricsData.map((m) => ({
  month: m.month.slice(0, 3),
  denied: m.denied,
  denialRate: m.totalOrders > 0 ? ((m.denied / m.totalOrders) * 100).toFixed(1) : "0",
}));

interface DenialTrendsChartProps {
  className?: string;
}

export function DenialTrendsChart({ className }: DenialTrendsChartProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        Denial Trends
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Denial counts by month (demo data). Industry benchmarks: 81.7% MA denials overturned on appeal.
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-slate-600" />
            <YAxis tick={{ fontSize: 12 }} className="text-slate-600" />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload?.[0] ? (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
                    <p className="font-semibold text-arka-navy">{label}</p>
                    <p>Denied: {payload[0].value}</p>
                    <p className="text-slate-600">
                      Rate: {(chartData.find((d) => d.month === label)?.denialRate ?? "—")}%
                    </p>
                  </div>
                ) : null
              }
            />
            <Bar dataKey="denied" fill="#0052CC" radius={[4, 4, 0, 0]} name="Denied" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DenialTrendsChart;
