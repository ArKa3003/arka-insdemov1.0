"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "elevated" | "glass" | "interactive";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  default: [
    "bg-white border border-slate-200 shadow-sm",
  ].join(" "),
  elevated: [
    "bg-white border border-slate-100 shadow-xl shadow-slate-200/50",
    "hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-0.5",
    "transition-all duration-300",
  ].join(" "),
  glass: [
    "bg-white/70 backdrop-blur-xl border border-white/20",
    "shadow-lg shadow-slate-900/5",
  ].join(" "),
  interactive: [
    "bg-white border border-slate-200 shadow-sm",
    "cursor-pointer",
    "hover:border-arka-blue/30 hover:shadow-lg hover:shadow-arka-blue/10 hover:-translate-y-1",
    "active:translate-y-0 active:shadow-md",
    "transition-all duration-200",
  ].join(" "),
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const isInteractive = variant === "interactive";

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl overflow-hidden",
          variantStyles[variant],
          className
        )}
        whileHover={isInteractive ? { scale: 1.01 } : undefined}
        whileTap={isInteractive ? { scale: 0.99 } : undefined}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

// Card Header
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, compact = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5",
        compact ? "p-4" : "p-6",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// Card Title
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "font-display text-xl font-semibold leading-none tracking-tight text-arka-navy",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

// Card Description
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Card Content
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
  noPadding?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, compact = false, noPadding = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        noPadding ? "p-0" : compact ? "px-4 pb-4" : "px-6 pb-6",
        className
      )}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

// Card Footer
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
  bordered?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, compact = false, bordered = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        compact ? "px-4 pb-4" : "px-6 pb-6",
        bordered && "pt-4 mt-2 border-t border-slate-100",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Card Image (bonus component for hero images)
export interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "video" | "square" | "wide";
  src?: string;
  alt?: string;
}

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, aspectRatio = "video", src, alt = "", style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-slate-100",
        aspectRatio === "video" && "aspect-video",
        aspectRatio === "square" && "aspect-square",
        aspectRatio === "wide" && "aspect-[21/9]",
        className
      )}
      style={{
        backgroundImage: src ? `url(${src})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...style,
      }}
      role="img"
      aria-label={alt}
      {...props}
    />
  )
);
CardImage.displayName = "CardImage";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
};
