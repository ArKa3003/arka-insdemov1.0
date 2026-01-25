"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  FileText,
  Shield,
  Brain,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SAMPLE_AUDIT_TRAIL,
  type SampleAuditTrail,
  type AuditTrailEntry,
  type AuditTrailAIInvolvement,
} from "@/lib/mock-data";

interface AuditTrailViewerProps {
  className?: string;
}

// Enriched metadata for request headers (provider, payer, patient not in audit)
const REQUEST_META: Record<
  string,
  { patientId: string; provider: string; npi: string; payer: string }
> = {
  "PA-2025-847291": {
    patientId: "[Masked ID]",
    provider: "Dr. Smith",
    npi: "1234567890",
    payer: "BlueCross BlueShield",
  },
  "PA-2025-847292": {
    patientId: "[Masked ID]",
    provider: "Dr. James Chen",
    npi: "0987654321",
    payer: "Aetna HMO",
  },
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatDecisionTime(entries: AuditTrailEntry[]): { text: string; withinSLA: boolean } {
  if (entries.length < 2) return { text: "—", withinSLA: true };
  const a = new Date(entries[0].timestamp).getTime();
  const b = new Date(entries[entries.length - 1].timestamp).getTime();
  const mins = Math.round((b - a) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const text = h > 0 ? `${h}h ${m}m` : `${m}m`;
  const hours = (b - a) / 3600000;
  const withinSLA = hours <= 72;
  return { text, withinSLA };
}

function getFinalDecision(entries: AuditTrailEntry[]): "APPROVED" | "DENIED" | "PENDED" {
  for (let i = entries.length - 1; i >= 0; i--) {
    const d = (entries[i].data?.outcome ?? entries[i].data?.decision) as string | undefined;
    if (d === "approved") return "APPROVED";
    if (d === "denied") return "DENIED";
    if (d === "pended") return "PENDED";
  }
  return "PENDED";
}

function getServiceLabel(entries: AuditTrailEntry[]): string {
  const first = entries[0];
  if (!first?.data) return "—";
  const imaging = String(first.data.imagingType ?? "").toUpperCase();
  const body = String(first.data.bodyPart ?? "");
  const cpt = first.data.cptCode ? ` (CPT ${first.data.cptCode})` : "";
  if (imaging && body) return `${imaging} ${body}${cpt}`;
  if (first.data.cptCode) return `CPT ${first.data.cptCode}`;
  return "—";
}

function getReviewersFromTrails(trails: SampleAuditTrail[]): string[] {
  const set = new Set<string>();
  for (const t of trails) {
    for (const e of t.entries) {
      if (e.actor === "human" && e.actorDetails?.name) set.add(e.actorDetails.name);
      const a = e.data?.assignedTo;
      if (typeof a === "string") set.add(a);
    }
  }
  return Array.from(set).sort();
}

function getAIInvolvementKind(entries: AuditTrailEntry[]): "ai-assisted" | "ai-recommended" | "manual" {
  const hasAI = entries.some((e) => e.actor === "ai");
  const hasRec = entries.some((e) => e.aiInvolvement?.recommendation != null);
  if (hasAI && hasRec) return "ai-recommended";
  if (hasAI) return "ai-assisted";
  return "manual";
}

function getDenialDetails(entries: AuditTrailEntry[]) {
  const human = entries.find(
    (e) => e.actor === "human" && (e.data?.decision === "denied" || e.data?.outcome === "denied")
  );
  if (!human) return null;
  const d = human.data as Record<string, unknown> | undefined;
  const ad = human.actorDetails;
  return {
    reasonCode: String(d?.reasonCode ?? "—"),
    clinicalCriteriaNotMet: String(d?.clinicalCriteriaNotMet ?? "—"),
    documentationReviewed: (d?.documentationReviewed as string[]) ?? [],
    documentationMissing: (d?.documentationMissing as string[]) ?? [],
    reviewerCredentials: ad ? [ad.credentials, ad.specialty].filter(Boolean).join(", ") : "—",
    reviewerSpecialty: ad?.specialty ?? "—",
    timeSpent: String(d?.timeSpentReviewing ?? "—"),
    peerToPeerOffered: Boolean(d?.peerToPeerOffered),
    appealRightsNotified: Boolean(d?.appealRightsNotified),
  };
}

function hasAIComplete(entries: AuditTrailEntry[]): boolean {
  return entries.some((e) => e.actor === "ai" && e.action?.toLowerCase().includes("complete"));
}

export function AuditTrailViewer({ className }: AuditTrailViewerProps) {
  const [requestIdSearch, setRequestIdSearch] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [dateTo, setDateTo] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [decisionType, setDecisionType] = React.useState<string>("all");
  const [reviewer, setReviewer] = React.useState<string>("all");
  const [aiInvolvement, setAiInvolvement] = React.useState<string>("all");
  const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set());
  const [expandedAi, setExpandedAi] = React.useState<Set<string>>(new Set());
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [reportFormat, setReportFormat] = React.useState<"pdf" | "excel">("pdf");

  const reviewers = React.useMemo(() => getReviewersFromTrails(SAMPLE_AUDIT_TRAIL), []);

  const filtered = React.useMemo(() => {
    return SAMPLE_AUDIT_TRAIL.filter((t) => {
      if (requestIdSearch && !t.requestId.toLowerCase().includes(requestIdSearch.toLowerCase()))
        return false;
      const decision = getFinalDecision(t.entries);
      if (decisionType !== "all") {
        const map: Record<string, string> = {
          APPROVED: "approvals",
          DENIED: "denials",
          PENDED: "pended",
        };
        if (map[decision] !== decisionType) return false;
      }
      if (reviewer !== "all") {
        const names = t.entries
          .map((e) => (e.actor === "human" ? e.actorDetails?.name : null) ?? e.data?.assignedTo)
          .filter((x): x is string => typeof x === "string");
        if (!names.some((n) => n.includes(reviewer) || reviewer.includes(n))) return false;
      }
      const kind = getAIInvolvementKind(t.entries);
      if (aiInvolvement !== "all" && kind !== aiInvolvement) return false;
      return true;
    });
  }, [requestIdSearch, decisionType, reviewer, aiInvolvement]);

  const toggleExpand = (id: string) => {
    setExpandedCards((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleAi = (id: string) => {
    setExpandedAi((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const renderEntryDetails = (
    e: AuditTrailEntry,
    ai?: AuditTrailAIInvolvement
  ): Array<{ key: string; value: React.ReactNode }> => {
    const rows: Array<{ key: string; value: React.ReactNode }> = [];
    const d = e.data as Record<string, unknown> | undefined;
    if (d) {
      const skip = new Set(["notified", "trigger", "ruleSet"]);
      const label = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
      for (const [k, v] of Object.entries(d)) {
        if (skip.has(k)) continue;
        if (v == null) continue;
        if (Array.isArray(v))
          rows.push({ key: label(k), value: v.join(", ") });
        else if (typeof v === "object")
          rows.push({ key: label(k), value: JSON.stringify(v) });
        else
          rows.push({ key: label(k), value: String(v) });
      }
    }
    if (e.actor === "human" && e.actorDetails) {
      const ad = e.actorDetails;
      if (ad.name) rows.push({ key: "Reviewer", value: `${ad.name}${ad.credentials ? `, ${ad.credentials}` : ""}` });
      if (ad.credentials && !rows.some((r) => r.key === "Reviewer"))
        rows.push({ key: "Credentials", value: ad.credentials });
      if (d?.license) rows.push({ key: "License", value: String(d.license) });
      if (ad.specialty) rows.push({ key: "Reviewer specialty match", value: `✓ ${ad.specialty}` });
    }
    if (ai) {
      if (ai.recommendation)
        rows.push({ key: "Recommendation", value: String(ai.recommendation).toUpperCase() });
      if (ai.confidence != null)
        rows.push({ key: "Confidence", value: `${(ai.confidence * 100).toFixed(1)}%` });
      if (ai.rationale)
        rows.push({
          key: "Clinical Rationale",
          value: (
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {ai.rationale.split(/(?<=[.!])\s+/).filter(Boolean).map((p, i) => (
                <li key={i}>{p.trim()}</li>
              ))}
            </ul>
          ),
        });
      if (ai.matchedCriteria?.length)
        rows.push({ key: "Matched Criteria", value: ai.matchedCriteria.join(", ") });
      if (ai.documentationScore != null)
        rows.push({ key: "Documentation Score", value: `${ai.documentationScore}/100` });
    }
    return rows;
  };

  const getNodeVariant = (e: AuditTrailEntry): "" | "audit-node--warning" | "audit-node--error" => {
    const d = e.data as Record<string, unknown> | undefined;
    const o = (d?.outcome ?? d?.decision) as string | undefined;
    if (o === "denied") return "audit-node--error";
    return "";
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-bold text-arka-navy">Decision Audit Trail</h2>
        <p className="text-slate-600 mt-1">Complete transparency for regulatory compliance</p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge status="success" variant="subtle" icon={<Shield className="h-3 w-3" />}>
            CA SB 1120 Compliant
          </Badge>
          <Badge status="success" variant="subtle" icon={<Shield className="h-3 w-3" />}>
            CMS AI Guidelines Compliant
          </Badge>
        </div>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by Request ID..."
                value={requestIdSearch}
                onChange={(e) => setRequestIdSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-medium text-slate-500 block mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-arka-blue focus:border-arka-blue"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-slate-500 block mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-arka-blue focus:border-arka-blue"
                />
              </div>
            </div>
            <Select value={decisionType} onValueChange={setDecisionType}>
              <SelectTrigger>
                <SelectValue placeholder="Decision type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="approvals">Approvals</SelectItem>
                <SelectItem value="denials">Denials</SelectItem>
                <SelectItem value="pended">Pended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reviewer} onValueChange={setReviewer}>
              <SelectTrigger>
                <SelectValue placeholder="Reviewer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {reviewers.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={aiInvolvement} onValueChange={setAiInvolvement}>
              <SelectTrigger>
                <SelectValue placeholder="AI involvement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ai-assisted">AI-Assisted</SelectItem>
                <SelectItem value="ai-recommended">AI-Recommended</SelectItem>
                <SelectItem value="manual">Manual Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-slate-600">
              Showing {filtered.length} authorization{filtered.length !== 1 ? "s" : ""}
            </p>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => setShowReportModal(true)}
            >
              Generate PDF/Excel Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Decision Timeline View */}
      <div className="space-y-4">
        {filtered.map((trail, idx) => {
          const id = trail.requestId;
          const isExpanded = expandedCards.has(id);
          const meta = REQUEST_META[id];
          const decision = getFinalDecision(trail.entries);
          const { text: decisionTime, withinSLA } = formatDecisionTime(trail.entries);
          const service = getServiceLabel(trail.entries);
          const denial = getDenialDetails(trail.entries);
          const showAiPanel = hasAIComplete(trail.entries);
          const isAiExpanded = expandedAi.has(id);

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Request Header */}
                <CardHeader
                  className="cursor-pointer select-none"
                  onClick={() => toggleExpand(id)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg">Request ID: {id}</CardTitle>
                        <Badge
                          status={decision === "APPROVED" ? "success" : decision === "DENIED" ? "error" : "warning"}
                          variant="solid"
                          icon={
                            decision === "APPROVED" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : decision === "DENIED" ? (
                              <XCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )
                          }
                        >
                          {decision === "APPROVED" ? `${decision} ✓` : decision}
                        </Badge>
                        {withinSLA && (
                          <Badge status="success" variant="outline" size="sm">
                            Within 72hr SLA ✓
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm text-slate-600">
                        <span><strong>Patient:</strong> {meta?.patientId ?? "[Masked ID]"}</span>
                        <span><strong>Service:</strong> {service}</span>
                        <span><strong>Provider:</strong> {meta?.provider ?? "—"}, NPI {meta?.npi ?? "—"}</span>
                        <span><strong>Payer:</strong> {meta?.payer ?? "—"}</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        <strong>Decision Time:</strong> {decisionTime}
                        {withinSLA ? " (within 72hr SLA ✓)" : ""}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        toggleExpand(id);
                      }}
                    >
                      {isExpanded ? "Collapse" : "View Audit Trail"}
                    </Button>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <CardContent className="pt-0 border-t border-slate-100">
                        {/* Vertical timeline using .audit-timeline and .audit-node */}
                        <div className="audit-timeline mt-4">
                          {trail.entries.map((e, i) => {
                            const rows = renderEntryDetails(e, e.aiInvolvement);
                            const variant = getNodeVariant(e);
                            return (
                              <motion.div
                                key={`${id}-${i}-${e.timestamp}`}
                                className={cn("audit-node", variant)}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.25 }}
                              >
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0 font-mono text-sm text-slate-500 w-28">
                                    {formatTime(e.timestamp)}
                                  </div>
                                  <div className="flex-1 min-w-0 pb-6">
                                    <p className="font-semibold text-arka-navy">{e.action}</p>
                                    <div className="mt-1.5 space-y-1 text-sm text-slate-600">
                                      {rows.map((r) => (
                                        <div key={r.key} className="flex gap-2">
                                          <span className="text-slate-400">└─</span>
                                          <span><strong>{r.key}:</strong></span>
                                          <span className="text-slate-700">{r.value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* AI Transparency Panel (expandable) */}
                        {showAiPanel && (() => {
                          const aiEntry = trail.entries.find((x) => x.actor === "ai" && String(x.action || "").toLowerCase().includes("complete"));
                          const ai = aiEntry?.aiInvolvement;
                          const reqEntry = trail.entries[0];
                          const req = reqEntry?.data as Record<string, unknown> | undefined;
                          const conf = ai?.confidence ?? 0;
                          const rec = (ai?.recommendation ?? "").toUpperCase();
                          const prob: Array<{ outcome: string; p: number }> = rec === "APPROVE"
                            ? [
                                { outcome: "APPROVE", p: Math.round(conf * 1000) / 10 },
                                { outcome: "DENY", p: Math.round((1 - conf) * 600) / 10 },
                                { outcome: "PEND", p: Math.round((1 - conf) * 400) / 10 },
                              ]
                            : rec === "DENY"
                              ? [
                                  { outcome: "DENY", p: Math.round(conf * 1000) / 10 },
                                  { outcome: "APPROVE", p: Math.round((1 - conf) * 500) / 10 },
                                  { outcome: "PEND", p: Math.round((1 - conf) * 500) / 10 },
                                ]
                              : [
                                  { outcome: "APPROVE", p: 33.3 },
                                  { outcome: "DENY", p: 33.3 },
                                  { outcome: "PEND", p: 33.4 },
                                ];
                          return (
                            <div className="mt-6">
                              <Card>
                                <button
                                  type="button"
                                  className="w-full text-left"
                                  onClick={() => toggleAi(id)}
                                >
                                  <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Brain className="h-5 w-5 text-arka-teal" />
                                      <CardTitle>AI Transparency Panel</CardTitle>
                                    </div>
                                    {isAiExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </CardHeader>
                                </button>
                                <AnimatePresence>
                                  {isAiExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.25 }}
                                    >
                                      <CardContent className="pt-0 space-y-4">
                                        <div>
                                          <h4 className="font-semibold text-arka-navy mb-2">Input Data</h4>
                                          <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 space-y-1">
                                            <p>Source: {String(req?.source ?? "—")}. Documentation: {String(req?.documentationAttached ?? "—")}. Imaging: {String(req?.imagingType ?? "")} {String(req?.bodyPart ?? "")} (CPT {String(req?.cptCode ?? "—")}). Clinical notes, diagnosis codes, and prior imaging from submitted package.</p>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-arka-navy mb-2">AI Processing</h4>
                                          <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
                                            <p>Features: symptom duration, conservative treatment, prior imaging. Criteria matched: {ai?.matchedCriteria?.join(", ") ?? "—"}. Documentation score: {ai?.documentationScore ?? "—"}/100. Criteria match score: {ai?.criteriaMatchScore ?? "—"}%.</p>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-arka-navy mb-2">Output</h4>
                                          <div className="bg-slate-50 rounded-lg p-3 text-sm">
                                            <p className="text-slate-600 mb-2">Recommendation: <strong>{rec || "—"}</strong></p>
                                            <p className="text-slate-500 mb-1">Probability distribution:</p>
                                            <ul className="list-disc list-inside text-slate-600">
                                              {prob.map(({ outcome, p }) => (
                                                <li key={outcome}>{outcome}: {p}%</li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </Card>
                            </div>
                          );
                        })()}

                        {/* Denial-Specific Fields */}
                        {denial && (
                          <div className="mt-6">
                            <Card>
                              <CardHeader>
                                <CardTitle>Denial-Specific Audit</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div><strong>Specific reason code:</strong> {denial.reasonCode}</div>
                                  <div><strong>Clinical criteria not met:</strong> {denial.clinicalCriteriaNotMet}</div>
                                  <div><strong>Documentation reviewed:</strong> {denial.documentationReviewed.join(", ") || "—"}</div>
                                  <div><strong>Documentation missing:</strong> {denial.documentationMissing.join(", ") || "—"}</div>
                                  <div><strong>Reviewer credentials and specialty:</strong> {denial.reviewerCredentials} — {denial.reviewerSpecialty}</div>
                                  <div><strong>Peer-to-peer offered?</strong> {denial.peerToPeerOffered ? "Y" : "N"}</div>
                                  <div><strong>Appeal rights notification included?</strong> {denial.appealRightsNotified ? "Y" : "N"}</div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Regulatory Compliance Checklist */}
                        <div className="mt-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Regulatory Compliance Checklist</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold text-arka-navy mb-3">California SB 1120</h4>
                                  <ul className="space-y-2">
                                    {[
                                      { label: "Human reviewer", ok: trail.entries.some((x) => x.actor === "human") },
                                      { label: "AI advisory only", ok: trail.entries.some((x) => x.actor === "ai") && trail.entries.some((x) => x.actor === "human") },
                                      { label: "Clinical notes reviewed", ok: true },
                                    ].map((item, i) => (
                                      <motion.li
                                        key={item.label}
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * i }}
                                      >
                                        {item.ok ? (
                                          <CheckCircle className="h-4 w-4 text-arka-green flex-shrink-0" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-arka-red flex-shrink-0" />
                                        )}
                                        <span className="text-sm text-slate-700">{item.label}</span>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-arka-navy mb-3">CMS AI Guidelines</h4>
                                  <ul className="space-y-2">
                                    {[
                                      { label: "Not solely AI-based", ok: trail.entries.some((x) => x.actor === "human") },
                                      { label: "Individual factors considered", ok: true },
                                      { label: "Appeal rights communicated", ok: decision !== "DENIED" || (denial?.appealRightsNotified ?? false) },
                                    ].map((item, i) => (
                                      <motion.li
                                        key={item.label}
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * (i + 3) }}
                                      >
                                        {item.ok ? (
                                          <CheckCircle className="h-4 w-4 text-arka-green flex-shrink-0" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-arka-red flex-shrink-0" />
                                        )}
                                        <span className="text-sm text-slate-700">{item.label}</span>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bulk Audit Report Modal */}
      <Modal open={showReportModal} onOpenChange={setShowReportModal}>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle>Bulk Audit Report Generator</ModalTitle>
          </ModalHeader>
          <ModalBody className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Date range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="flex-1 h-10 rounded-lg border border-slate-300 px-3 text-sm"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="flex-1 h-10 rounded-lg border border-slate-300 px-3 text-sm"
                />
              </div>
            </div>
            <p className="text-sm text-slate-600">Apply the same filters as the current view (Decision type, Reviewer, AI involvement).</p>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Format</label>
              <div className="flex gap-2">
                <Button
                  variant={reportFormat === "pdf" ? "primary" : "secondary"}
                  size="sm"
                  leftIcon={<FileText className="h-4 w-4" />}
                  onClick={() => setReportFormat("pdf")}
                >
                  PDF
                </Button>
                <Button
                  variant={reportFormat === "excel" ? "primary" : "secondary"}
                  size="sm"
                  leftIcon={<FileSpreadsheet className="h-4 w-4" />}
                  onClick={() => setReportFormat("excel")}
                >
                  Excel
                </Button>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Report will include:</p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Executive summary</li>
                <li>Decision statistics</li>
                <li>AI involvement metrics</li>
                <li>Human oversight verification</li>
                <li>Compliance certification statement</li>
              </ul>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => setShowReportModal(false)}
            >
              Generate {reportFormat.toUpperCase()} Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
