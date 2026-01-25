"use client";

import { useState, useCallback, useMemo } from "react";

export type AuditActor = "system" | "ai" | "human";

export interface ActorDetails {
  name?: string;
  credentials?: string;
  specialty?: string;
}

export interface AIInvolvement {
  model?: string;
  confidence?: number;
  recommendation?: string;
  rationale?: string;
}

export interface AuditEntry {
  timestamp: Date;
  action: string;
  actor: AuditActor;
  actorDetails?: ActorDetails;
  data: Record<string, unknown>;
  aiInvolvement?: AIInvolvement;
}

export interface ComplianceCheck {
  id: string;
  rule: string;
  status: "pass" | "fail" | "na";
  message?: string;
}

export interface AuditReport {
  exportedAt: Date;
  entries: AuditEntry[];
  complianceStatus: ComplianceCheck[];
  summary: {
    totalEntries: number;
    byActor: Record<AuditActor, number>;
    compliancePassed: number;
    complianceFailed: number;
  };
}

export type AddEntryType = string;

export interface UseAuditTrailOptions {
  /** Initial entries (e.g. from persisted state) */
  initialEntries?: AuditEntry[];
  /** Initial compliance checks */
  initialCompliance?: ComplianceCheck[];
  /** Required compliance checks that must pass for isComplete */
  requiredComplianceIds?: string[];
}

export interface UseAuditTrailReturn {
  entries: AuditEntry[];
  addEntry: (type: AddEntryType, data: Record<string, unknown>, meta?: {
    actor?: AuditActor;
    actorDetails?: ActorDetails;
    aiInvolvement?: AIInvolvement;
  }) => void;
  exportTrail: () => AuditReport;
  complianceStatus: ComplianceCheck[];
  setComplianceStatus: (checks: ComplianceCheck[] | ((prev: ComplianceCheck[]) => ComplianceCheck[])) => void;
  isComplete: boolean;
  reset: () => void;
}

const defaultRequiredCompliance = ["doc-review", "criteria-match", "human-sign-off"];

/**
 * Hook for building audit trail entries and compliance checks.
 */
export function useAuditTrail(options: UseAuditTrailOptions = {}): UseAuditTrailReturn {
  const {
    initialEntries = [],
    initialCompliance = [],
    requiredComplianceIds = defaultRequiredCompliance,
  } = options;

  const [entries, setEntries] = useState<AuditEntry[]>(initialEntries);
  const [complianceStatus, setComplianceStatusState] = useState<ComplianceCheck[]>(
    initialCompliance.length > 0 ? initialCompliance : [
      { id: "doc-review", rule: "Documentation reviewed", status: "na", message: "Pending" },
      { id: "criteria-match", rule: "RBM criteria matched", status: "na", message: "Pending" },
      { id: "human-sign-off", rule: "Human-in-the-loop sign-off", status: "na", message: "Pending" },
    ]
  );

  const setComplianceStatus = useCallback(
    (arg: ComplianceCheck[] | ((prev: ComplianceCheck[]) => ComplianceCheck[])) => {
      setComplianceStatusState(arg);
    },
    []
  );

  const addEntry = useCallback(
    (
      type: AddEntryType,
      data: Record<string, unknown>,
      meta?: { actor?: AuditActor; actorDetails?: ActorDetails; aiInvolvement?: AIInvolvement }
    ) => {
      const actor = meta?.actor ?? "system";
      setEntries((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          action: type,
          actor,
          actorDetails: meta?.actorDetails,
          data: { ...data, _type: type },
          aiInvolvement: meta?.aiInvolvement,
        },
      ]);
    },
    []
  );

  const exportTrail = useCallback((): AuditReport => {
    const byActor: Record<AuditActor, number> = {
      system: 0,
      ai: 0,
      human: 0,
    };
    for (const e of entries) {
      byActor[e.actor]++;
    }
    const compliancePassed = complianceStatus.filter((c) => c.status === "pass").length;
    const complianceFailed = complianceStatus.filter((c) => c.status === "fail").length;

    return {
      exportedAt: new Date(),
      entries: [...entries],
      complianceStatus: [...complianceStatus],
      summary: {
        totalEntries: entries.length,
        byActor,
        compliancePassed,
        complianceFailed,
      },
    };
  }, [entries, complianceStatus]);

  const isComplete = useMemo(() => {
    const required = complianceStatus.filter((c) => requiredComplianceIds.includes(c.id));
    return required.length > 0 && required.every((c) => c.status === "pass");
  }, [complianceStatus, requiredComplianceIds]);

  const reset = useCallback(() => {
    setEntries([]);
    setComplianceStatusState(initialCompliance.length > 0 ? initialCompliance : [
      { id: "doc-review", rule: "Documentation reviewed", status: "na", message: "Pending" },
      { id: "criteria-match", rule: "RBM criteria matched", status: "na", message: "Pending" },
      { id: "human-sign-off", rule: "Human-in-the-loop sign-off", status: "na", message: "Pending" },
    ]);
  }, [initialCompliance]);

  return {
    entries,
    addEntry,
    exportTrail,
    complianceStatus,
    setComplianceStatus,
    isComplete,
    reset,
  };
}
