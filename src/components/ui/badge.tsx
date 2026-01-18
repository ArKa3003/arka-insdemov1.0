import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-arka-blue focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-arka-blue text-white",
        secondary: "border-transparent bg-slate-100 text-slate-900",
        success: "border-transparent bg-arka-green text-white",
        warning: "border-transparent bg-arka-amber text-arka-navy",
        destructive: "border-transparent bg-arka-red text-white",
        outline: "text-slate-700 border-slate-300",
        teal: "border-transparent bg-arka-teal text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
