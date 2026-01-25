"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Activity,
  Magnet,
  Scan,
  CircleDot,
  Radio,
  Waves,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  AreaChart,
} from "recharts";

// --- Types ---

interface RequestCard {
  id: string;
  patientId: string;
  imagingType: string;
  urgency: "urgent" | "standard";
  timeReceived: string;
  deadline: string;
  /** For urgent: hours left (number); for standard: days left (number). Used for at-risk. */
  deadlineValue: number;
  assignedReviewer?: string;
  timeInStatus?: string;
  status: "received" | "in-review" | "pending-info" | "decided";
  decision?: "approved" | "denied";
  decisionTime?: string;
  withinSLA?: boolean;
}

interface ComplianceTrackerProps {
  className?: string;
}

// --- Helpers ---

function getDaysUntil(dateStr: string): number {
  const deadline = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

function getImagingIcon(imagingType?: string) {
  switch (imagingType?.toUpperCase()) {
    case "MRI":
      return <Magnet className="h-4 w-4 text-arka-blue" />;
    case "CT":
      return <Scan className="h-4 w-4 text-arka-teal" />;
    case "PET-CT":
    case "PET/CT":
      return <CircleDot className="h-4 w-4 text-arka-amber" />;
    case "NUCLEAR":
      return <Radio className="h-4 w-4 text-arka-amber" />;
    case "ULTRASOUND":
      return <Waves className="h-4 w-4 text-arka-teal" />;
    default:
      return <Activity className="h-4 w-4 text-slate-500" />;
  }
}

function getUrgentBarColor(hours: number): "green" | "yellow" | "red" {
  if (hours < 48) return "green";
  if (hours <= 72) return "yellow";
  return "red";
}

function getStandardBarColor(days: number): "green" | "yellow" | "red" {
  if (days < 5) return "green";
  if (days <= 7) return "yellow";
  return "red";
}

function getProgressPercentage(deadline: string, urgency: "urgent" | "standard"): number {
  const num = parseInt(deadline.split(/\s/)[0] ?? "0", 10);
  if (urgency === "urgent") {
    const usedHours = 72 - num;
    return Math.max(0, Math.min(100, (usedHours / 72) * 100));
  }
  const daysUsed = 7 - (num || 0);
  return Math.max(0, Math.min(100, (daysUsed / 7) * 100));
}

// --- Mock data ---

const historicalData = [
  { month: "Jan", urgent: 95, standard: 98 },
  { month: "Feb", urgent: 96, standard: 98 },
  { month: "Mar", urgent: 97, standard: 99 },
  { month: "Apr", urgent: 96, standard: 98 },
  { month: "May", urgent: 97, standard: 99 },
  { month: "Jun", urgent: 98, standard: 99 },
  { month: "Jul", urgent: 97, standard: 99 },
  { month: "Aug", urgent: 98, standard: 100 },
  { month: "Sep", urgent: 98, standard: 100 },
  { month: "Oct", urgent: 99, standard: 100 },
  { month: "Nov", urgent: 98, standard: 100 },
  { month: "Dec", urgent: 98.2, standard: 100 },
];

const urgentTrendData = [
  { d: "M", h: 44 },
  { d: "T", h: 46 },
  { d: "W", h: 45 },
  { d: "T", h: 42 },
  { d: "F", h: 43 },
  { d: "S", h: 42 },
  { d: "S", h: 42 },
];

const standardTrendData = [
  { d: "M", days: 4.8 },
  { d: "T", days: 5.0 },
  { d: "W", days: 4.6 },
  { d: "T", days: 4.2 },
  { d: "F", days: 4.4 },
  { d: "S", days: 4.2 },
  { d: "S", days: 4.2 },
];

// --- Component ---

export function CMSComplianceTracker({ className }: ComplianceTrackerProps) {
  const [, setTick] = React.useState(0);
  const [reportPreviewOpen, setReportPreviewOpen] = React.useState(false);

  // Real-time tick for countdown
  React.useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const daysUntilJan2026 = getDaysUntil("2026-01-01");
  const daysUntilJan2027 = getDaysUntil("2027-01-01");
  const daysUntilMarch2026 = getDaysUntil("2026-03-31");

  const currentUrgentAvgHours = 42;
  const currentStandardAvgDays = 4.2;
  const urgentBarColor = getUrgentBarColor(currentUrgentAvgHours);
  const standardBarColor = getStandardBarColor(currentStandardAvgDays);

  const activeRequests: RequestCard[] = React.useMemo(
    () => [
      {
        id: "REQ-001",
        patientId: "PAT-***-1234",
        imagingType: "MRI",
        urgency: "urgent",
        timeReceived: "2 hours ago",
        deadline: "70 hours",
        deadlineValue: 70,
        status: "received",
      },
      {
        id: "REQ-002",
        patientId: "PAT-***-5678",
        imagingType: "CT",
        urgency: "standard",
        timeReceived: "1 day ago",
        deadline: "6 days",
        deadlineValue: 6,
        status: "received",
      },
      {
        id: "REQ-003",
        patientId: "PAT-***-9012",
        imagingType: "PET-CT",
        urgency: "urgent",
        timeReceived: "5 hours ago",
        deadline: "67 hours",
        deadlineValue: 67,
        status: "in-review",
        assignedReviewer: "Dr. Smith",
        timeInStatus: "2 hours",
      },
      {
        id: "REQ-004",
        patientId: "PAT-***-3456",
        imagingType: "MRI",
        urgency: "standard",
        timeReceived: "3 days ago",
        deadline: "4 days",
        deadlineValue: 4,
        status: "pending-info",
        timeInStatus: "1 day",
      },
      {
        id: "REQ-005",
        patientId: "PAT-***-7890",
        imagingType: "CT",
        urgency: "urgent",
        timeReceived: "1 hour ago",
        deadline: "71 hours",
        deadlineValue: 71,
        status: "decided",
        decision: "approved",
        decisionTime: "45 minutes",
        withinSLA: true,
      },
      {
        id: "REQ-006",
        patientId: "PAT-***-2468",
        imagingType: "MRI",
        urgency: "standard",
        timeReceived: "2 days ago",
        deadline: "5 days",
        deadlineValue: 5,
        status: "decided",
        decision: "denied",
        decisionTime: "1.5 days",
        withinSLA: true,
      },
      {
        id: "REQ-007",
        patientId: "PAT-***-1122",
        imagingType: "CT",
        urgency: "urgent",
        timeReceived: "58 hours ago",
        timeInStatus: "8 hours",
        deadline: "14 hours",
        deadlineValue: 14,
        status: "in-review",
        assignedReviewer: "Dr. Jones",
      },
    ],
    []
  );

  const atRiskRequests = activeRequests.filter((r) => {
    if (r.status === "decided") return false;
    if (r.urgency === "urgent") return r.deadlineValue <= 24;
    return r.deadlineValue <= 2;
  });

  const hasViolations = atRiskRequests.length > 0;

  // Overall compliance: On Track / At Risk / Non-Compliant
  const overallStatus = ((): "On Track" | "At Risk" | "Non-Compliant" => {
    if (hasViolations) return "Non-Compliant";
    if (urgentBarColor === "red" || standardBarColor === "red") return "At Risk";
    if (urgentBarColor === "yellow" || standardBarColor === "yellow" || daysUntilJan2026 < 60)
      return "At Risk";
    return "On Track";
  })();

  const statusConfig = {
    "On Track": {
      className: "bg-arka-green/10 text-arka-green border-arka-green/20",
      icon: CheckCircle,
    },
    "At Risk": {
      className: "bg-arka-amber/10 text-arka-amber border-arka-amber/20",
      icon: Clock,
    },
    "Non-Compliant": {
      className: "bg-arka-red/10 text-arka-red border-arka-red/20",
      icon: AlertCircle,
    },
  };
  const StatusIcon = statusConfig[overallStatus].icon;

  const cols = [
    { key: "received" as const, label: "Received Today" },
    { key: "in-review" as const, label: "In Review" },
    { key: "pending-info" as const, label: "Pending Info" },
    { key: "decided" as const, label: "Decided Today" },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-display text-3xl font-bold text-arka-navy mb-2">
          CMS Compliance Command Center
        </h2>
        <p className="text-slate-600">Real-time tracking of CMS-0057-F requirements</p>
        <motion.div
          className={cn(
            "mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border",
            statusConfig[overallStatus].className
          )}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <StatusIcon className="h-4 w-4" />
          <span className="font-semibold text-sm">{overallStatus}</span>
        </motion.div>
      </motion.div>

      {/* Deadline Countdown Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: 72-Hour Urgent */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">72-Hour Urgent Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <motion.p
                key={daysUntilJan2026}
                className="text-2xl font-bold text-arka-navy tabular-nums"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {daysUntilJan2026}
              </motion.p>
              <p className="text-sm text-slate-600">days until January 1, 2026</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">Current Urgent Avg:</span>
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    urgentBarColor === "green" && "text-arka-green",
                    urgentBarColor === "yellow" && "text-arka-amber",
                    urgentBarColor === "red" && "text-arka-red"
                  )}
                >
                  {currentUrgentAvgHours} hours
                </span>
              </div>
              <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="h-full w-1/2 bg-arka-green" />
                  <div className="h-full w-1/4 bg-arka-amber" />
                  <div className="h-full w-1/4 bg-arka-red" />
                </div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-arka-navy/60"
                  style={{ left: "75%" }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-arka-navy bg-white shadow"
                  style={{ left: `clamp(0%, ${(currentUrgentAvgHours / 96) * 100}%, 96%)` }}
                  initial={false}
                  animate={{ left: `${Math.min(95, (currentUrgentAvgHours / 96) * 100)}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
              </div>
              <div className="flex justify-between mt-0.5 text-[10px] text-slate-500">
                <span>&lt;48h</span>
                <span>48-72h</span>
                <span>&gt;72h</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-arka-green">98.2%</span> of urgent requests within 72
                hours
              </p>
            </div>
            <div className="h-9 min-h-[36px] -mx-1">
              <ResponsiveContainer width="100%" height={36} minHeight={36}>
                <AreaChart data={urgentTrendData}>
                  <defs>
                    <linearGradient id="urgentTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#36B37E" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#36B37E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="h"
                    stroke="#36B37E"
                    strokeWidth={1.5}
                    fill="url(#urgentTrend)"
                  />
                  <ReferenceLine y={72} stroke="#94a3b8" strokeDasharray="2 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: 7-Day Standard */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">7-Day Standard Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <motion.p
                key={daysUntilJan2026}
                className="text-2xl font-bold text-arka-navy tabular-nums"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {daysUntilJan2026}
              </motion.p>
              <p className="text-sm text-slate-600">days until January 1, 2026</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">Current Standard Avg:</span>
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    standardBarColor === "green" && "text-arka-green",
                    standardBarColor === "yellow" && "text-arka-amber",
                    standardBarColor === "red" && "text-arka-red"
                  )}
                >
                  {currentStandardAvgDays} days
                </span>
              </div>
              <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="h-full bg-arka-green" style={{ width: "62.5%" }} />
                  <div className="h-full bg-arka-amber" style={{ width: "25%" }} />
                  <div className="h-full bg-arka-red" style={{ width: "12.5%" }} />
                </div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-arka-navy/60"
                  style={{ left: "87.5%" }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-arka-navy bg-white shadow"
                  style={{ left: `clamp(0%, ${(currentStandardAvgDays / 8) * 100}%, 96%)` }}
                  initial={false}
                  animate={{ left: `${Math.min(95, (currentStandardAvgDays / 8) * 100)}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
              </div>
              <div className="flex justify-between mt-0.5 text-[10px] text-slate-500">
                <span>&lt;5d</span>
                <span>5-7d</span>
                <span>&gt;7d</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-arka-green">100%</span> compliance rate
              </p>
            </div>
            <div className="h-9 min-h-[36px] -mx-1">
              <ResponsiveContainer width="100%" height={36} minHeight={36}>
                <AreaChart data={standardTrendData}>
                  <defs>
                    <linearGradient id="stdTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#36B37E" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#36B37E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="days"
                    stroke="#36B37E"
                    strokeWidth={1.5}
                    fill="url(#stdTrend)"
                  />
                  <ReferenceLine y={7} stroke="#94a3b8" strokeDasharray="2 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: FHIR API */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">FHIR API Requirement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <motion.p
                key={daysUntilJan2027}
                className="text-2xl font-bold text-arka-navy tabular-nums"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {daysUntilJan2027}
              </motion.p>
              <p className="text-sm text-slate-600">days until January 2027</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-arka-green flex-shrink-0" />
                <span className="text-sm text-slate-700">Da Vinci CRD</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-arka-green flex-shrink-0" />
                <span className="text-sm text-slate-700">DTR</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-arka-amber flex-shrink-0" />
                <span className="text-sm text-slate-700">PAS in progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-arka-amber flex-shrink-0" />
                <span className="text-sm text-slate-700">X12 bridge</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">API Ready</span>
                <span className="text-sm font-semibold">67%</span>
              </div>
              <Progress value={67} size="sm" colorByValue={false} indicatorClassName="bg-arka-teal" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Public Reporting */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Public Reporting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <motion.p
                key={daysUntilMarch2026}
                className="text-2xl font-bold text-arka-navy tabular-nums"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {daysUntilMarch2026}
              </motion.p>
              <p className="text-sm text-slate-600">days until March 31, 2026</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-arka-green flex-shrink-0" />
                <span className="text-sm text-slate-700">Approval rates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-arka-green flex-shrink-0" />
                <span className="text-sm text-slate-700">Denial rates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-arka-green flex-shrink-0" />
                <span className="text-sm text-slate-700">Appeal outcomes</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-arka-amber flex-shrink-0" />
                <span className="text-sm text-slate-700">Average times</span>
              </div>
            </div>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                leftIcon={<FileText className="h-4 w-4" />}
                onClick={() => setReportPreviewOpen(true)}
              >
                Report Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Violation Alerts Panel */}
      <AnimatePresence>
        {atRiskRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "rounded-lg border-2 p-4 overflow-hidden",
              hasViolations ? "border-arka-red/50 bg-arka-red/5" : "border-arka-amber/30 bg-arka-amber/5"
            )}
            style={hasViolations ? { animation: "countdown-pulse 1.5s ease-in-out infinite" } : undefined}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className={cn("h-5 w-5", hasViolations ? "text-arka-red" : "text-arka-amber")} />
              <h3 className={cn("font-semibold", hasViolations ? "text-arka-red" : "text-arka-amber")}>
                SLA Violation Alerts
              </h3>
              <Badge status="error" variant="solid" className="ml-auto">
                {atRiskRequests.length} at risk
              </Badge>
            </div>
            <div className="space-y-2">
              {atRiskRequests.map((req) => (
                <motion.div
                  key={req.id}
                  layout
                  className="flex items-center justify-between p-2 bg-white rounded border border-arka-red/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-arka-navy">{req.id}</span>
                    <span className="text-xs text-slate-600">{req.patientId}</span>
                    <Badge
                      variant="outline"
                      status={req.urgency === "urgent" ? "error" : "warning"}
                      size="sm"
                    >
                      {req.urgency}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-arka-red font-medium">{req.deadline} remaining</span>
                    {req.assignedReviewer && (
                      <span className="text-xs text-slate-600">Assigned: {req.assignedReviewer}</span>
                    )}
                    <Button size="sm" variant="secondary" className="h-7 text-xs">
                      Escalate
                    </Button>
                    <Button size="sm" variant="danger" className="h-7 text-xs">
                      Auto-Decide
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Requests Timeline (Kanban) */}
      <Card>
        <CardHeader>
          <CardTitle>Active Requests Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cols.map(({ key, label }) => {
              const items = activeRequests.filter((r) => r.status === key);
              return (
                <div key={key} className="space-y-3 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-700">{label}</h4>
                    <Badge status="neutral" variant="subtle" size="sm">
                      {items.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {items.map((req) => (
                        <motion.div
                          key={req.id}
                          layout
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            {getImagingIcon(req.imagingType)}
                            <span className="text-xs font-medium text-slate-700">{req.imagingType}</span>
                          </div>
                          <div className="text-xs text-slate-600 font-mono">{req.patientId}</div>
                          <Badge
                            variant="outline"
                            status={req.urgency === "urgent" ? "error" : "neutral"}
                            size="sm"
                          >
                            {req.urgency}
                          </Badge>
                          <div className="text-xs text-slate-500">{req.timeReceived}</div>
                          <div className="flex items-center gap-1 text-xs font-medium text-arka-navy">
                            <Clock className="h-3 w-3" />
                            {req.deadline} to deadline
                          </div>
                          {key === "in-review" && (
                            <>
                              {req.assignedReviewer && (
                                <div className="text-xs text-slate-600">Reviewer: {req.assignedReviewer}</div>
                              )}
                              {req.timeInStatus && (
                                <div className="text-xs text-slate-500">In status: {req.timeInStatus}</div>
                              )}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-500">Progress</span>
                                  <span className="font-medium">
                                    {Math.round(getProgressPercentage(req.deadline, req.urgency))}%
                                  </span>
                                </div>
                                <Progress
                                  value={getProgressPercentage(req.deadline, req.urgency)}
                                  size="sm"
                                  colorByValue={false}
                                  indicatorClassName={cn(
                                    getProgressPercentage(req.deadline, req.urgency) > 80 && "!bg-arka-red",
                                    getProgressPercentage(req.deadline, req.urgency) > 60 &&
                                      getProgressPercentage(req.deadline, req.urgency) <= 80 &&
                                      "!bg-arka-amber",
                                    getProgressPercentage(req.deadline, req.urgency) <= 60 && "!bg-arka-green"
                                  )}
                                />
                              </div>
                            </>
                          )}
                          {key === "pending-info" && (
                            <>
                              {req.timeInStatus && (
                                <div className="text-xs text-slate-500">Request sent {req.timeInStatus} ago</div>
                              )}
                              {getProgressPercentage(req.deadline, req.urgency) > 70 && (
                                <div className="flex items-center gap-1 text-xs text-arka-red font-medium">
                                  <AlertCircle className="h-3 w-3" />
                                  Auto-escalation warning
                                </div>
                              )}
                            </>
                          )}
                          {key === "decided" && req.decision != null && (
                            <>
                              <Badge
                                variant="outline"
                                status={req.decision === "approved" ? "success" : "error"}
                                size="sm"
                              >
                                {req.decision === "approved" ? "Approved" : "Denied"}
                              </Badge>
                              <div className="text-xs text-slate-500">
                                Decision time: {req.decisionTime}
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                {req.withinSLA ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 text-arka-green" />
                                    <span className="text-arka-green font-medium">Within SLA</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 text-arka-red" />
                                    <span className="text-arka-red font-medium">SLA Exceeded</span>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Historical Compliance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Compliance (Past 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <LineChart data={historicalData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goalZone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#36B37E" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#36B37E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[90, 101]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number | undefined) => [`${value != null ? value : 0}%`, ""]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <ReferenceArea
                  y1={98}
                  y2={102}
                  fill="url(#goalZone)"
                  stroke="none"
                />
                <ReferenceLine
                  y={100}
                  stroke="#36B37E"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  label={{ value: "CMS 100%", position: "right", fill: "#36B37E" }}
                />
                <ReferenceLine
                  x="Dec"
                  stroke="#64748b"
                  strokeDasharray="3 3"
                  label={{ value: "CMS Deadline Jan 2026", position: "top" }}
                />
                <Line
                  type="monotone"
                  dataKey="urgent"
                  stroke="#FF5630"
                  strokeWidth={2}
                  name="Urgent compliance"
                  dot={{ fill: "#FF5630", r: 3 }}
                  activeDot={{ r: 5 }}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="standard"
                  stroke="#0052CC"
                  strokeWidth={2}
                  name="Standard compliance"
                  dot={{ fill: "#0052CC", r: 3 }}
                  activeDot={{ r: 5 }}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-arka-green/5 border border-arka-green/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-arka-green" />
              <span className="text-slate-700">
                <span className="font-semibold">CMS Deadline:</span> January 2026 requirement; shaded
                zone 98–100% is the target range. Horizontal reference at 100%.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview Modal (minimal) */}
      <AnimatePresence>
        {reportPreviewOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReportPreviewOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-arka-navy mb-2">Public Reporting Preview</h3>
              <p className="text-sm text-slate-600 mb-4">
                Approval rates, denial rates, and appeal outcomes are ready. Average decision times
                are in progress.
              </p>
              <Button onClick={() => setReportPreviewOpen(false)}>Close</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
