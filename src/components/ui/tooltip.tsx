"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

// Provider component - wrap your app with this
const TooltipProvider = TooltipPrimitive.Provider;

// Root tooltip component
const Tooltip = TooltipPrimitive.Root;

// Trigger component
const TooltipTrigger = TooltipPrimitive.Trigger;

// Portal component
const TooltipPortal = TooltipPrimitive.Portal;

// Arrow component
const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn("fill-arka-navy", className)}
    {...props}
  />
));
TooltipArrow.displayName = "TooltipArrow";

// Content component with animations
export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  variant?: "default" | "info" | "success" | "warning" | "error";
  showArrow?: boolean;
}

const variantStyles = {
  default: "bg-arka-navy text-white",
  info: "bg-arka-blue text-white",
  success: "bg-arka-green text-white",
  warning: "bg-arka-amber text-arka-navy",
  error: "bg-arka-red text-white",
};

const arrowColors = {
  default: "fill-arka-navy",
  info: "fill-arka-blue",
  success: "fill-arka-green",
  warning: "fill-arka-amber",
  error: "fill-arka-red",
};

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      sideOffset = 6,
      variant = "default",
      showArrow = true,
      children,
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-lg px-3 py-2",
          "text-sm font-medium shadow-lg",
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <TooltipArrow className={arrowColors[variant]} width={10} height={5} />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Simple tooltip wrapper for easy use
export interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  variant?: TooltipContentProps["variant"];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  skipDelayDuration?: number;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  children,
  variant = "default",
  side = "top",
  align = "center",
  delayDuration = 200,
  skipDelayDuration = 300,
  disabled = false,
  open,
  defaultOpen,
  onOpenChange,
}) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
      <Tooltip open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent variant={variant} side={side} align={align}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
SimpleTooltip.displayName = "SimpleTooltip";

// Info tooltip with icon
export interface InfoTooltipProps {
  content: React.ReactNode;
  iconClassName?: string;
  variant?: TooltipContentProps["variant"];
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  iconClassName,
  variant = "default",
}) => (
  <SimpleTooltip content={content} variant={variant}>
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center",
        "h-4 w-4 rounded-full",
        "bg-slate-200 text-slate-600",
        "hover:bg-slate-300 hover:text-slate-700",
        "focus:outline-none focus:ring-2 focus:ring-arka-blue focus:ring-offset-1",
        "transition-colors duration-150",
        "text-xs font-bold",
        iconClassName
      )}
      aria-label="More information"
    >
      ?
    </button>
  </SimpleTooltip>
);
InfoTooltip.displayName = "InfoTooltip";

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipPortal,
  TooltipArrow,
  SimpleTooltip,
  InfoTooltip,
};
