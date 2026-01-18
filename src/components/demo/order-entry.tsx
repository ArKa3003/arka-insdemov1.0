"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OrderEntryProps {
  className?: string;
}

export function OrderEntry({ className }: OrderEntryProps) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)}>
      <h3 className="font-display text-lg font-semibold text-arka-navy mb-4">
        Order Entry
      </h3>
      <p className="text-sm text-slate-600">
        Order entry component - allows clinicians to enter imaging, lab, and procedure orders.
      </p>
      {/* Order entry form will be implemented here */}
    </div>
  );
}

export default OrderEntry;
