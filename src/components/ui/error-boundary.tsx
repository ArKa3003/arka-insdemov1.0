"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional: custom fallback when no customFallback provided */
  fallback?: React.ReactNode;
  /** Optional: callback when error is caught (e.g. send to logging service) */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Optional: log to console in demo; default true for demo env */
  logToConsole?: boolean;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ---------------------------------------------------------------------------
// ARKA-BRANDED ERROR FALLBACK
// ---------------------------------------------------------------------------

function ArkaErrorFallback({
  error,
  onRefresh,
  onGoToDashboard,
  className,
}: {
  error: Error;
  onRefresh: () => void;
  onGoToDashboard: () => void;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center min-h-[320px] px-6 py-10",
        "rounded-xl border-2 border-arka-red/20 bg-white",
        "shadow-lg shadow-slate-200/50",
        className
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* ARKA branding block */}
      <div className="mb-6 flex items-center gap-2">
        <span className="font-display text-lg font-bold text-arka-navy">ARKA</span>
        <span className="font-display text-lg font-semibold text-arka-blue">-INS</span>
      </div>

      {/* Icon */}
      <div className="h-16 w-16 rounded-full bg-arka-red/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-arka-red" />
      </div>

      <h2 className="font-display text-xl font-semibold text-arka-navy mb-2">
        Something went wrong
      </h2>
      <p className="text-slate-600 text-center max-w-md mb-1">
        An unexpected error occurred. Our team has been notified. You can try refreshing or return to the dashboard.
      </p>
      <p className="text-sm text-slate-400 font-mono mb-6 max-w-md truncate" title={error.message}>
        {error.message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={onRefresh}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Refresh
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onGoToDashboard}
          leftIcon={<LayoutDashboard className="h-4 w-4" />}
        >
          Go to Dashboard
        </Button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ERROR BOUNDARY CLASS COMPONENT
// ---------------------------------------------------------------------------

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, logToConsole = true } = this.props;
    if (logToConsole) {
      console.error("[ARKA ErrorBoundary]", error, errorInfo);
    }
    onError?.(error, errorInfo);
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") window.location.reload();
  };

  handleGoToDashboard = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") window.location.href = "/dashboard";
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, className } = this.props;

    if (hasError && error) {
      if (fallback) return fallback;
      return (
        <ArkaErrorFallback
          error={error}
          onRefresh={this.handleRefresh}
          onGoToDashboard={this.handleGoToDashboard}
          className={className}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
