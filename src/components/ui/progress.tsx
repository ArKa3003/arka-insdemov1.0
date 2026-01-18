"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressVariant = "default" | "gradient" | "striped";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  max?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
  showLabel?: boolean;
  labelPosition?: "top" | "right" | "inside";
  label?: string;
  colorByValue?: boolean;
  indicatorClassName?: string;
  animated?: boolean;
}

const sizeStyles: Record<ProgressSize, { track: string; text: string }> = {
  sm: { track: "h-1.5", text: "text-xs" },
  md: { track: "h-2.5", text: "text-sm" },
  lg: { track: "h-4", text: "text-base" },
};

const getColorByValue = (value: number): string => {
  if (value < 50) return "bg-arka-red";
  if (value < 80) return "bg-arka-amber";
  return "bg-arka-green";
};

const getGradientByValue = (value: number): string => {
  if (value < 50) return "bg-gradient-to-r from-arka-red to-arka-amber";
  if (value < 80) return "bg-gradient-to-r from-arka-amber to-arka-green";
  return "bg-gradient-to-r from-arka-green to-arka-teal";
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = "md",
      variant = "default",
      showLabel = false,
      labelPosition = "right",
      label,
      colorByValue = true,
      indicatorClassName,
      animated = true,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const sizes = sizeStyles[size];

    const indicatorColor = colorByValue
      ? variant === "gradient"
        ? getGradientByValue(percentage)
        : getColorByValue(percentage)
      : "bg-arka-blue";

    const renderLabel = () => {
      const labelText = label ?? `${Math.round(percentage)}%`;
      return (
        <span
          className={cn(
            "font-mono font-medium text-slate-700",
            sizes.text
          )}
        >
          {labelText}
        </span>
      );
    };

    return (
      <div
        className={cn(
          "flex items-center gap-3",
          labelPosition === "top" && "flex-col items-start gap-1.5",
          className
        )}
      >
        {/* Top label */}
        {showLabel && labelPosition === "top" && (
          <div className="flex justify-between w-full">
            {label && <span className={cn("text-slate-600", sizes.text)}>{label}</span>}
            <span className={cn("font-mono text-slate-700", sizes.text)}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}

        {/* Progress bar */}
        <ProgressPrimitive.Root
          ref={ref}
          value={value}
          max={max}
          className={cn(
            "relative overflow-hidden rounded-full bg-slate-200 flex-1 w-full",
            sizes.track
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator asChild>
            <motion.div
              className={cn(
                "h-full rounded-full",
                indicatorColor,
                variant === "striped" && [
                  "bg-[length:1rem_1rem]",
                  "bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]",
                ],
                variant === "striped" && animated && "animate-[shimmer_1s_linear_infinite]",
                indicatorClassName
              )}
              initial={animated ? { width: 0 } : { width: `${percentage}%` }}
              animate={{ width: `${percentage}%` }}
              transition={{
                duration: animated ? 0.6 : 0,
                ease: "easeOut",
              }}
            >
              {/* Inside label */}
              {showLabel && labelPosition === "inside" && size === "lg" && (
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    "text-xs font-bold text-white drop-shadow-sm"
                  )}
                >
                  {Math.round(percentage)}%
                </span>
              )}
            </motion.div>
          </ProgressPrimitive.Indicator>
        </ProgressPrimitive.Root>

        {/* Right label */}
        {showLabel && labelPosition === "right" && renderLabel()}
      </div>
    );
  }
);
Progress.displayName = "Progress";

// Circular Progress variant
export interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  colorByValue?: boolean;
  className?: string;
  animated?: boolean;
}

const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = 120,
      strokeWidth = 8,
      showLabel = true,
      colorByValue = true,
      className,
      animated = true,
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const strokeColor = colorByValue
      ? percentage < 50
        ? "#FF5630"
        : percentage < 80
        ? "#FFAB00"
        : "#36B37E"
      : "#0052CC";

    return (
      <div className={cn("relative inline-flex", className)}>
        <svg
          ref={ref}
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: animated ? 0.8 : 0, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-lg font-bold text-slate-700">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  }
);
CircularProgress.displayName = "CircularProgress";

export { Progress, CircularProgress };
