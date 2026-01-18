"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: [
    "bg-arka-blue text-white",
    "hover:bg-arka-blue/90 hover:shadow-lg hover:shadow-arka-blue/25",
    "active:bg-arka-blue/95",
    "focus-visible:ring-arka-blue",
  ].join(" "),
  secondary: [
    "bg-transparent text-arka-navy border-2 border-slate-300",
    "hover:border-arka-blue hover:text-arka-blue hover:shadow-md",
    "active:bg-slate-50",
    "focus-visible:ring-arka-blue",
  ].join(" "),
  success: [
    "bg-arka-green text-white",
    "hover:bg-arka-green/90 hover:shadow-lg hover:shadow-arka-green/25",
    "active:bg-arka-green/95",
    "focus-visible:ring-arka-green",
  ].join(" "),
  warning: [
    "bg-arka-amber text-arka-navy",
    "hover:bg-arka-amber/90 hover:shadow-lg hover:shadow-arka-amber/25",
    "active:bg-arka-amber/95",
    "focus-visible:ring-arka-amber",
  ].join(" "),
  danger: [
    "bg-arka-red text-white",
    "hover:bg-arka-red/90 hover:shadow-lg hover:shadow-arka-red/25",
    "active:bg-arka-red/95",
    "focus-visible:ring-arka-red",
  ].join(" "),
  ghost: [
    "bg-transparent text-slate-700",
    "hover:bg-slate-100 hover:text-slate-900",
    "active:bg-slate-200",
    "focus-visible:ring-slate-400",
  ].join(" "),
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
};

const iconSizes = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Variant and size
          variantStyles[variant],
          sizeStyles[size],
          // Full width
          fullWidth && "w-full",
          className
        )}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.15, ease: "easeOut" }}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className={cn("animate-spin", iconSizes[size])} />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={cn("flex-shrink-0", iconSizes[size])}>
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className={cn("flex-shrink-0", iconSizes[size])}>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
