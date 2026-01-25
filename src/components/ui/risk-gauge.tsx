"use client";

import * as React from "react";
import { motion, animate } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GaugeZone {
  start: number;
  end: number;
  color: string;
}

export interface RiskGaugeProps {
  value: number;
  label: string;
  size?: "sm" | "md" | "lg";
  showNeedle?: boolean;
  zones?: GaugeZone[];
  className?: string;
}

const DEFAULT_ZONES: GaugeZone[] = [
  { start: 0, end: 30, color: "#22c55e" },
  { start: 30, end: 60, color: "#eab308" },
  { start: 60, end: 100, color: "#ef4444" },
];

const SIZE_MAP = {
  sm: { width: 100, stroke: 6, fontSize: "text-sm", labelSize: "text-[10px]" },
  md: { width: 140, stroke: 8, fontSize: "text-base", labelSize: "text-xs" },
  lg: { width: 180, stroke: 10, fontSize: "text-lg", labelSize: "text-sm" },
} as const;

/** Semicircular gauge: 0 at left, 100 at right. 180° arc. */
export function RiskGauge({
  value,
  label,
  size = "md",
  showNeedle = true,
  zones = DEFAULT_ZONES,
  className,
}: RiskGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const { width, stroke, fontSize, labelSize } = SIZE_MAP[size];
  const radius = (width - stroke) / 2;
  const circumference = Math.PI * radius;

  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const ctrl = animate(0, clamped, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [clamped]);

  const needleRotation = (clamped / 100) * 180 - 90;

  const zoneColor = zones.reduce<string | null>((acc, z) => {
    if (clamped >= z.start && clamped < z.end) return z.color;
    return acc;
  }, null) ?? zones[zones.length - 1]?.color ?? "#94a3b8";

  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <motion.div
      className={cn("flex flex-col items-center gap-1", className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative" style={{ width, height: width / 2 + stroke }}>
        {/* Track: light gray semicircle */}
        <svg
          width={width}
          height={width / 2 + stroke}
          viewBox={`0 0 ${width} ${width / 2 + stroke}`}
          className="overflow-visible"
        >
          <path
            d={`M ${stroke / 2} ${width / 2} A ${radius} ${radius} 0 0 1 ${width - stroke / 2} ${width / 2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-slate-200"
          />
          {/* Colored zones as background (optional, subtle) */}
          {zones.map((z, i) => {
            const startOffset = (z.start / 100) * circumference;
            const zoneLength = ((z.end - z.start) / 100) * circumference;
            return (
              <path
                key={i}
                d={`M ${stroke / 2} ${width / 2} A ${radius} ${radius} 0 0 1 ${width - stroke / 2} ${width / 2}`}
                fill="none"
                stroke={z.color}
                strokeWidth={stroke}
                strokeDasharray={`${zoneLength} ${circumference}`}
                strokeDashoffset={-startOffset}
                opacity={0.25}
              />
            );
          })}
          {/* Value arc */}
          <motion.path
            d={`M ${stroke / 2} ${width / 2} A ${radius} ${radius} 0 0 1 ${width - stroke / 2} ${width / 2}`}
            fill="none"
            stroke={zoneColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        {/* Needle */}
        {showNeedle && (
          <motion.div
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              width: 2,
              height: radius - stroke,
              x: "-50%",
              y: "-100%",
              background: zoneColor,
              borderRadius: 1,
              boxShadow: "0 0 4px rgba(0,0,0,0.2)",
            }}
            initial={{ rotate: -90 }}
            animate={{ rotate: needleRotation }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        )}

        {/* Center value */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center",
            fontSize
          )}
        >
          <span className="font-bold tabular-nums" style={{ color: zoneColor }}>
            {displayValue}
          </span>
        </div>
      </div>
      <motion.span
        className={cn("text-slate-600 font-medium", labelSize)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
