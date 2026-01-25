"use client";

import * as React from "react";

const DEFAULT_MS = 8000;

/**
 * Returns true when `isAnalyzing` has been true for longer than `timeoutMs`.
 * Used to show "Analysis taking longer than expected" in the demo.
 */
export function useAnalysisTimeout(
  isAnalyzing: boolean,
  timeoutMs: number = DEFAULT_MS
): boolean {
  const [isTimeout, setIsTimeout] = React.useState(false);
  const startRef = React.useRef<number | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (isAnalyzing) {
      if (startRef.current === null) {
        startRef.current = Date.now();
        setIsTimeout(false);
      }
      timerRef.current = setTimeout(() => {
        setIsTimeout(true);
      }, timeoutMs);
    } else {
      startRef.current = null;
      setIsTimeout(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAnalyzing, timeoutMs]);

  return isTimeout;
}
