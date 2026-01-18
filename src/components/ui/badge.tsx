"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type BadgeStatus = "success" | "warning" | "error" | "info" | "neutral" | "processing";
export type BadgeVariant = "solid" | "outline" | "subtle";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  status?: BadgeStatus;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const statusColors: Record<BadgeStatus, Record<BadgeVariant, string>> = {
  success: {
    solid: "bg-arka-green text-white",
    outline: "bg-transparent text-arka-green border-2 border-arka-green",
    subtle: "bg-arka-green/10 text-arka-green border border-arka-green/20",
  },
  warning: {
    solid: "bg-arka-amber text-arka-navy",
    outline: "bg-transparent text-arka-amber border-2 border-arka-amber",
    subtle: "bg-arka-amber/10 text-arka-amber border border-arka-amber/20",
  },
  error: {
    solid: "bg-arka-red text-white",
    outline: "bg-transparent text-arka-red border-2 border-arka-red",
    subtle: "bg-arka-red/10 text-arka-red border border-arka-red/20",
  },
  info: {
    solid: "bg-arka-blue text-white",
    outline: "bg-transparent text-arka-blue border-2 border-arka-blue",
    subtle: "bg-arka-blue/10 text-arka-blue border border-arka-blue/20",
  },
  neutral: {
    solid: "bg-slate-500 text-white",
    outline: "bg-transparent text-slate-600 border-2 border-slate-400",
    subtle: "bg-slate-100 text-slate-600 border border-slate-200",
  },
  processing: {
    solid: "bg-arka-teal text-white",
    outline: "bg-transparent text-arka-teal border-2 border-arka-teal",
    subtle: "bg-arka-teal/10 text-arka-teal border border-arka-teal/20",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

const dotSizes: Record<BadgeSize, string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};

const Badge: React.FC<BadgeProps> = ({
  className,
  status = "neutral",
  variant = "solid",
  size = "md",
  icon,
  dot = false,
  removable = false,
  onRemove,
  children,
}) => {
  const isProcessing = status === "processing";

  return (
    <motion.span
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-full whitespace-nowrap",
        "transition-colors duration-200",
        statusColors[status][variant],
        sizeStyles[size],
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
        {/* Dot indicator */}
        {dot && (
          <span
            className={cn(
              "rounded-full flex-shrink-0",
              dotSizes[size],
              variant === "solid" ? "bg-white" : statusColors[status].solid.split(" ")[0]
            )}
          />
        )}

        {/* Processing pulse animation */}
        {isProcessing && !dot && (
          <motion.span
            className={cn(
              "rounded-full flex-shrink-0",
              dotSizes[size],
              variant === "solid" ? "bg-white" : "bg-arka-teal"
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Icon */}
        {icon && !dot && !isProcessing && (
          <span className="flex-shrink-0">{icon}</span>
        )}

        {/* Content */}
        {children}

        {/* Remove button */}
        {removable && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              "flex-shrink-0 rounded-full p-0.5 ml-0.5",
              "hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current",
              "transition-colors duration-150"
            )}
            aria-label="Remove"
          >
            <svg
              className={cn(
                size === "sm" && "h-2.5 w-2.5",
                size === "md" && "h-3 w-3",
                size === "lg" && "h-3.5 w-3.5"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </motion.span>
    );
};

// Convenience components for common statuses
const SuccessBadge: React.FC<Omit<BadgeProps, "status">> = (props) => (
  <Badge status="success" {...props} />
);

const WarningBadge: React.FC<Omit<BadgeProps, "status">> = (props) => (
  <Badge status="warning" {...props} />
);

const ErrorBadge: React.FC<Omit<BadgeProps, "status">> = (props) => (
  <Badge status="error" {...props} />
);

const InfoBadge: React.FC<Omit<BadgeProps, "status">> = (props) => (
  <Badge status="info" {...props} />
);

const ProcessingBadge: React.FC<Omit<BadgeProps, "status">> = (props) => (
  <Badge status="processing" {...props} />
);

export {
  Badge,
  SuccessBadge,
  WarningBadge,
  ErrorBadge,
  InfoBadge,
  ProcessingBadge,
};
