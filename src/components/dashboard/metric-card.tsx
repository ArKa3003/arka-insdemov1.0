"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { InfoTooltip } from "@/components/ui/tooltip";

export interface MetricCardProps {
  title: string;
  value: number | string;
  format?: "number" | "percentage" | "currency" | "time";
  trend?: {
    direction: "up" | "down" | "flat";
    value: number;
    isPositive: boolean;
  };
  benchmark?: {
    label: string;
    value: number;
  };
  status?: "success" | "warning" | "danger";
  sparklineData?: number[];
  subtitle?: string;
  tooltip?: string;
  className?: string;
  index?: number;
}

const formatValue = (
  value: number | string,
  format: "number" | "percentage" | "currency" | "time" = "number"
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
  format: "number" | "percentage" | "currency" | "time";
  duration?: number;
}> = ({ value, format, duration = 1.5 }) => {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 20,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  React.useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [spring]);

  return <>{formatValue(displayValue, format)}</>;
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  format = "number",
  trend,
  benchmark,
  status,
  sparklineData,
  subtitle,
  tooltip,
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
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
            {React.createElement(trendIcon, { className: "h-3 w-3" })}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <div className="mt-3">
        {isNumeric ? (
          <p className="font-display text-3xl font-bold text-arka-navy">
            <CountUpNumber value={value} format={format} />
          </p>
        ) : (
          <p className="font-display text-3xl font-bold text-arka-navy">{value}</p>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
      )}

      {benchmark && (
        <p className="mt-2 text-xs text-slate-500">
          vs {benchmark.value}% {benchmark.label}
        </p>
      )}

      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-4 h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
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
