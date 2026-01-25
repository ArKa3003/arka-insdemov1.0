"use client";

import * as React from "react";

/**
 * Toast provider placeholder.
 * Replace the inner div with <Toaster /> from sonner, react-hot-toast, etc. when ready.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div
        id="toast-container"
        aria-hidden
        className="fixed bottom-4 right-4 z-[100] pointer-events-none"
      />
    </>
  );
}
