"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  FileCheck,
  Shield,
  ClipboardCheck,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/stores/demo-store";
import { useAnnouncer } from "@/components/providers/screen-reader-announcer";

// ============================================================================
// TYPES
// ============================================================================

interface CMSComplianceCheckProps {
  onContinue?: () => void;
  onGoBack?: () => void;
  className?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  category: "cms" | "state" | "audit";
  subItems: { label: string; checked: boolean }[];
  delay: number;
}

// ============================================================================
// DATA
// ============================================================================

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "cms-0057",
    label: "CMS-0057-F Requirements",
    category: "cms",
    delay: 0.1,
    subItems: [
      { label: "Timeline for determinations (within required timeframes)", checked: true },
      { label: "Reason codes and written notices", checked: true },
      { label: "Documentation of medical necessity review", checked: true },
      { label: "Appeal rights disclosed to enrollee", checked: true },
    ],
  },
  {
    id: "state-ca",
    label: "State Requirements (CA SB 1120)",
    category: "state",
    delay: 0.2,
    subItems: [
      { label: "AI/algorithmic advisory to enrollee or provider", checked: true },
      { label: "Human reviewer in loop for adverse determinations", checked: true },
      { label: "Reviewer credentials documented", checked: true },
    ],
  },
  {
    id: "audit",
    label: "Audit Trail Completeness",
    category: "audit",
    delay: 0.3,
    subItems: [
      { label: "All decisions, overrides, and inputs logged", checked: true },
      { label: "Timestamps and user/role attribution", checked: true },
      { label: "Exportable for audit", checked: true },
    ],
  },
];

const SAMPLE_AUDIT_ENTRY = {
  id: "AUD-2024-0124-001",
  timestamp: "2024-12-15T09:42:00Z",
  action: "Prior auth clinical review",
  actor: "ARKA AI + Dr. Michael Chen (MD, Neuroradiology)",
  result: "APPROVED",
  details: "Criteria met: RAD-MSK-001. Lumbar MRI without contrast. Documentation score 92. Human reviewer concurrence.",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CMSComplianceCheck({
  onContinue,
  onGoBack,
  className,
}: CMSComplianceCheckProps) {
  const { completeStep, nextStep } = useDemoStore();
  const announce = useAnnouncer();
  const announcedComplete = React.useRef(false);
  const [auditExpanded, setAuditExpanded] = React.useState(false);
  const [checkedCount, setCheckedCount] = React.useState(0);
  const totalChecks = CHECKLIST_ITEMS.reduce((s, i) => s + i.subItems.length, 0);

  React.useEffect(() => {
    const t = setInterval(() => {
      setCheckedCount((c) => {
        if (c >= totalChecks) {
          clearInterval(t);
          return totalChecks;
        }
        return c + 1;
      });
    }, 120);
    return () => clearInterval(t);
  }, [totalChecks]);

  // Screen reader: announce when compliance verification completes
  React.useEffect(() => {
    if (totalChecks > 0 && checkedCount >= totalChecks && !announcedComplete.current) {
      announcedComplete.current = true;
      announce("CMS compliance verification complete. All requirements met.");
    }
  }, [checkedCount, totalChecks, announce]);

  const handleProceed = () => {
    completeStep(8);
    nextStep();
    onContinue?.();
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Badge status="info" variant="solid">Step 8</Badge>
          <h2 className="font-display text-2xl font-bold text-arka-navy">
            CMS Compliance Verification
          </h2>
        </div>
        <p className="text-slate-600">
          CMS-0057-F, state, and audit trail requirements before submission
        </p>
      </motion.div>

      {/* Animated checklist */}
      <div className="space-y-4">
        {CHECKLIST_ITEMS.map((group, gi) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: group.delay }}
          >
            <Card variant="default" className="overflow-hidden">
              <CardHeader className="py-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  {group.category === "cms" && <FileCheck className="h-5 w-5 text-arka-blue" />}
                  {group.category === "state" && <Shield className="h-5 w-5 text-arka-teal" />}
                  {group.category === "audit" && <ClipboardCheck className="h-5 w-5 text-arka-amber" />}
                  {group.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {group.subItems.map((sub, si) => {
                    const idx = CHECKLIST_ITEMS.slice(0, gi).reduce((s, i) => s + i.subItems.length, 0) + si;
                    const isChecked = checkedCount > idx;
                    return (
                      <motion.li
                        key={sub.label}
                        initial={false}
                        animate={{ opacity: isChecked ? 1 : 0.7 }}
                        className="flex items-center gap-3"
                      >
                        <motion.span
                          initial={false}
                          animate={{
                            scale: isChecked ? 1 : 0.8,
                            opacity: isChecked ? 1 : 0.5,
                          }}
                          className="flex-shrink-0"
                        >
                          {isChecked ? (
                            <CheckCircle className="h-5 w-5 text-arka-green" />
                          ) : (
                            <span className="h-5 w-5 rounded-full border-2 border-slate-300" />
                          )}
                        </motion.span>
                        <span className={cn("text-sm", isChecked ? "text-slate-700" : "text-slate-500")}>
                          {sub.label}
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Overall score + READY FOR AUDIT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center gap-6"
      >
        <div className="flex items-center gap-4 p-4 rounded-xl bg-arka-green/10 border border-arka-green/30">
          <ShieldCheck className="h-10 w-10 text-arka-green" />
          <div>
            <p className="text-sm text-slate-600">Overall Compliance Score</p>
            <p className="text-3xl font-bold font-mono text-arka-green">100%</p>
          </div>
        </div>
        <Badge status="success" variant="solid" size="lg" className="text-sm px-4 py-2">
          READY FOR AUDIT
        </Badge>
      </motion.div>

      {/* Preview of audit trail entry (collapsed, expandable) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card variant="default" className="overflow-hidden">
          <button
            type="button"
            onClick={() => setAuditExpanded((e) => !e)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-700">Preview of audit trail entry</span>
            </div>
            {auditExpanded ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          <AnimatePresence>
            {auditExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-100"
              >
                <CardContent className="p-4">
                  <div className="font-mono text-xs space-y-1.5 bg-slate-50 p-4 rounded-lg">
                    <p><span className="text-slate-500">ID:</span> {SAMPLE_AUDIT_ENTRY.id}</p>
                    <p><span className="text-slate-500">Timestamp:</span> {SAMPLE_AUDIT_ENTRY.timestamp}</p>
                    <p><span className="text-slate-500">Action:</span> {SAMPLE_AUDIT_ENTRY.action}</p>
                    <p><span className="text-slate-500">Actor:</span> {SAMPLE_AUDIT_ENTRY.actor}</p>
                    <p><span className="text-slate-500">Result:</span> <strong>{SAMPLE_AUDIT_ENTRY.result}</strong></p>
                    <p><span className="text-slate-500">Details:</span> {SAMPLE_AUDIT_ENTRY.details}</p>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-between pt-4 border-t border-slate-200"
      >
        <Button variant="ghost" size="sm" onClick={onGoBack}>
          Back to Gold Card
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleProceed}
          rightIcon={<ChevronRight className="h-5 w-5" />}
        >
          Continue to Human Review
        </Button>
      </motion.div>
    </div>
  );
}

export default CMSComplianceCheck;
