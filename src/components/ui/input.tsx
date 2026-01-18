"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: {
    input: "h-8 text-xs px-3",
    icon: "h-3.5 w-3.5",
    iconPadding: { left: "pl-8", right: "pr-8" },
    iconPosition: "top-2",
  },
  md: {
    input: "h-10 text-sm px-4",
    icon: "h-4 w-4",
    iconPadding: { left: "pl-10", right: "pr-10" },
    iconPosition: "top-3",
  },
  lg: {
    input: "h-12 text-base px-5",
    icon: "h-5 w-5",
    iconPadding: { left: "pl-12", right: "pr-12" },
    iconPosition: "top-3.5",
  },
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      inputSize = "md",
      fullWidth = false,
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = providedId ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const sizes = sizeStyles[inputSize];

    const hasError = Boolean(error);
    const hasSuccess = success && !hasError;

    // Determine right icon (error/success states override custom icon)
    const effectiveRightIcon = hasError ? (
      <AlertCircle className={cn(sizes.icon, "text-arka-red")} />
    ) : hasSuccess ? (
      <CheckCircle2 className={cn(sizes.icon, "text-arka-green")} />
    ) : (
      rightIcon
    );

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-slate-700",
              disabled && "text-slate-400"
            )}
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div
              className={cn(
                "absolute left-3 flex items-center pointer-events-none text-slate-400",
                sizes.iconPosition,
                disabled && "text-slate-300"
              )}
            >
              <span className={sizes.icon}>{leftIcon}</span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            className={cn(
              // Base styles
              "w-full rounded-lg font-body",
              "bg-white border outline-none",
              "transition-all duration-200",
              "placeholder:text-slate-400",
              // Size
              sizes.input,
              // Icon padding
              leftIcon && sizes.iconPadding.left,
              effectiveRightIcon && sizes.iconPadding.right,
              // States
              !hasError && !hasSuccess && [
                "border-slate-300",
                "hover:border-slate-400",
                "focus:border-arka-blue focus:ring-2 focus:ring-arka-blue/20",
              ],
              hasError && [
                "border-arka-red",
                "focus:border-arka-red focus:ring-2 focus:ring-arka-red/20",
              ],
              hasSuccess && [
                "border-arka-green",
                "focus:border-arka-green focus:ring-2 focus:ring-arka-green/20",
              ],
              // Disabled
              disabled && [
                "bg-slate-50 border-slate-200",
                "cursor-not-allowed text-slate-400",
              ],
              className
            )}
            {...props}
          />

          {/* Right icon */}
          {effectiveRightIcon && (
            <div
              className={cn(
                "absolute right-3 flex items-center pointer-events-none",
                sizes.iconPosition,
                !hasError && !hasSuccess && "text-slate-400"
              )}
            >
              <span className={sizes.icon}>{effectiveRightIcon}</span>
            </div>
          )}
        </div>

        {/* Error message */}
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.p
              id={errorId}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-xs text-arka-red flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Helper text */}
        {helperText && !hasError && (
          <p id={helperId} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// Textarea variant
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      inputSize = "md",
      fullWidth = false,
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = providedId ?? generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;
    const hasError = Boolean(error);

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium text-slate-700",
              disabled && "text-slate-400"
            )}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          className={cn(
            "w-full rounded-lg font-body min-h-[100px] resize-y",
            "bg-white border outline-none",
            "transition-all duration-200",
            "placeholder:text-slate-400",
            inputSize === "sm" && "text-xs p-3",
            inputSize === "md" && "text-sm p-4",
            inputSize === "lg" && "text-base p-5",
            !hasError && [
              "border-slate-300",
              "hover:border-slate-400",
              "focus:border-arka-blue focus:ring-2 focus:ring-arka-blue/20",
            ],
            hasError && [
              "border-arka-red",
              "focus:border-arka-red focus:ring-2 focus:ring-arka-red/20",
            ],
            disabled && [
              "bg-slate-50 border-slate-200",
              "cursor-not-allowed text-slate-400",
            ],
            className
          )}
          {...props}
        />

        <AnimatePresence mode="wait">
          {hasError && (
            <motion.p
              id={errorId}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-arka-red flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {helperText && !hasError && (
          <p id={helperId} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
