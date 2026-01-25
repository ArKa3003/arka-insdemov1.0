"use client";

import * as React from "react";
import { motion, animate } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { InfoTooltip } from "@/components/ui/tooltip";

export type MetricFormat = "number" | "percentage" | "currency" | "currencyCompact" | "time";

export interface MetricCardProps {
  title: string;
  value: number | string;
  format?: MetricFormat;
  trend?: {
    direction: "up" | "down" | "flat";
    value: number;
    isPositive: boolean;
  };
  benchmark?: {
    label: string;
    value: number;
    /** If true, benchmark value is shown as percentage (e.g. "vs 67% industry avg") */
    asPercentage?: boolean;
  };
  status?: "success" | "warning" | "danger";
  sparklineData?: number[];
  subtitle?: string;
  tooltip?: React.ReactNode;
  /** Progress ring: value 0-100, optional green glow when above threshold */
  progressRing?: { value: number; size?: number; greenGlowAbove?: number };
  /** Replaces the default value/subtitle/benchmark block when provided */
  customArea?: React.ReactNode;
  /** Badge below main content (e.g. "4.2x ROI", "January 2026 Ready") */
  badge?: { text: string; status?: "success" | "warning" };
  className?: string;
  index?: number;
}

const formatValue = (
  value: number | string,
  format: MetricFormat = "number"
): string => {
  if (typeof value === "string") return value;

  switch (format) {
    case "percentage":
      return `${value.toFixed(1)}%`;
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case "currencyCompact":
      if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
      if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
    case "time":
      if (value < 60) return `${Math.round(value)} min`;
      if (value < 1440) return `${(value / 60).toFixed(1)} hrs`;
      return `${(value / 1440).toFixed(1)} days`;
    default:
      return new Intl.NumberFormat("en-US").format(value);
  }
};

const CountUpNumber: React.FC<{
  value: number;
  format: MetricFormat;
  duration?: number;
}> = ({ value, format, duration = 1.5 }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(v),
    });
    return () => controls.stop();
  }, [value, duration]);

  return <>{formatValue(displayValue, format)}</>;
};

/** Progress ring that fills with easeOut over 1s */
const ProgressRing: React.FC<{
  value: number;
  size?: number;
  greenGlowAbove?: number;
  className?: string;
}> = ({ value, size = 70, greenGlowAbove, className }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  const showGlow = greenGlowAbove != null && value >= greenGlowAbove;

  return (
    <div className={cn("relative", showGlow && "drop-shadow-[0_0_8px_rgba(54,179,126,0.5)]", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-200" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={value >= (greenGlowAbove ?? 0) ? "text-arka-green" : "text-arka-blue"}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-arka-navy">{value.toFixed(1)}%</span>
      </div>
    </div>
  );
};

const MetricCardBase: React.FC<MetricCardProps> = ({
  title,
  value,
  format = "number",
  trend,
  benchmark,
  status,
  sparklineData,
  subtitle,
  tooltip,
  progressRing,
  customArea,
  badge,
  className,
  index = 0,
}) => {
  const isNumeric = typeof value === "number";
  const statusColors = {
    success: "border-arka-green/30 bg-arka-green/5",
    warning: "border-arka-amber/30 bg-arka-amber/5",
    danger: "border-arka-red/30 bg-arka-red/5",
  };

  const trendIcon = trend?.direction === "up" ? TrendingUp : trend?.direction === "down" ? TrendingDown : Minus;
  const trendColor = trend?.isPositive
    ? "text-arka-green"
    : trend?.direction === "flat"
    ? "text-slate-500"
    : "text-arka-red";

  const showDefaultValue = !customArea && !progressRing;
  const benchAsPct = benchmark?.asPercentage !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6",
        "transition-all duration-300",
        status && statusColors[status],
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          {tooltip != null && <InfoTooltip content={tooltip} />}
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
            {React.createElement(trendIcon, { className: "h-3 w-3" })}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {customArea && <div className="mt-3">{customArea}</div>}

      {progressRing != null && !customArea && (
        <div className="mt-3 flex flex-col items-start gap-3">
          <ProgressRing
            value={progressRing.value}
            size={progressRing.size}
            greenGlowAbove={progressRing.greenGlowAbove}
          />
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          {benchmark && (
            <p className="text-xs text-slate-500">
              vs {benchAsPct ? `${benchmark.value}%` : benchmark.value} {benchmark.label}
            </p>
          )}
        </div>
      )}

      {showDefaultValue && (
        <>
          <div className="mt-3">
            {isNumeric ? (
              <p className="font-display text-3xl font-bold text-arka-navy">
                <CountUpNumber value={value} format={format} />
              </p>
            ) : (
              <p className="font-display text-3xl font-bold text-arka-navy">{value}</p>
            )}
          </div>
          {subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}
          {benchmark && (
            <p className="mt-2 text-xs text-slate-500">
              vs {benchAsPct ? `${benchmark.value}%` : benchmark.value} {benchmark.label}
            </p>
          )}
        </>
      )}

      {badge && (
        <div
          className={cn(
            "mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold",
            badge.status === "success" && "bg-arka-green/10 text-arka-green",
            badge.status === "warning" && "bg-arka-amber/10 text-arka-amber",
            !badge.status && "bg-arka-blue/10 text-arka-blue"
          )}
        >
          {badge.text}
        </div>
      )}

      {sparklineData != null && sparklineData.length > 0 && (
        <div className="mt-4 h-12 min-h-[3rem] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={48}>
            <LineChart data={sparklineData.map((v, i) => ({ value: v, index: i }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={status === "success" ? "#36B37E" : status === "warning" ? "#FFAB00" : "#0052CC"}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export const MetricCard = React.memo(MetricCardBase);
