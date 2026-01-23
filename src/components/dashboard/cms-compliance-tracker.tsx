"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, XCircle, ArrowRight, FileText, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

interface RequestCard {
  id: string;
  patientId: string;
  imagingType: string;
  urgency: "urgent" | "standard";
  timeReceived: string;
  deadline: string;
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

export function CMSComplianceTracker({ className }: ComplianceTrackerProps) {
  const [activeTab, setActiveTab] = React.useState<"overview" | "timeline">("overview");

  // Calculate days until deadlines
  const getDaysUntil = (date: string) => {
    const deadline = new Date(date);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilJan2026 = getDaysUntil("2026-01-01");
  const daysUntilJan2027 = getDaysUntil("2027-01-01");
  const daysUntilMarch2026 = getDaysUntil("2026-03-31");

  // Mock data for active requests
  const activeRequests: RequestCard[] = [
    {
      id: "REQ-001",
      patientId: "PAT-***-1234",
      imagingType: "MRI",
      urgency: "urgent",
      timeReceived: "2 hours ago",
      deadline: "70 hours",
      status: "received",
    },
    {
      id: "REQ-002",
      patientId: "PAT-***-5678",
      imagingType: "CT",
      urgency: "standard",
      timeReceived: "1 day ago",
      deadline: "6 days",
      status: "received",
    },
    {
      id: "REQ-003",
      patientId: "PAT-***-9012",
      imagingType: "PET-CT",
      urgency: "urgent",
      timeReceived: "5 hours ago",
      deadline: "67 hours",
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
      status: "decided",
      decision: "denied",
      decisionTime: "1.5 days",
      withinSLA: true,
    },
  ];

  const slaViolations = activeRequests.filter(
    (req) => req.status !== "decided" && (req.urgency === "urgent" ? parseInt(req.deadline) < 24 : parseInt(req.deadline) < 2)
  );

  // Historical compliance data
  const historicalData = [
    { month: "Jan 2024", urgent: 95, standard: 98 },
    { month: "Feb 2024", urgent: 96, standard: 98 },
    { month: "Mar 2024", urgent: 97, standard: 99 },
    { month: "Apr 2024", urgent: 96, standard: 98 },
    { month: "May 2024", urgent: 97, standard: 99 },
    { month: "Jun 2024", urgent: 98, standard: 99 },
    { month: "Jul 2024", urgent: 97, standard: 99 },
    { month: "Aug 2024", urgent: 98, standard: 100 },
    { month: "Sep 2024", urgent: 98, standard: 100 },
    { month: "Oct 2024", urgent: 99, standard: 100 },
    { month: "Nov 2024", urgent: 98, standard: 100 },
    { month: "Dec 2024", urgent: 98.2, standard: 100 },
  ];

  const getImagingIcon = (type: string) => {
    return <Activity className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-blue-100 text-blue-700";
      case "in-review":
        return "bg-amber-100 text-amber-700";
      case "pending-info":
        return "bg-purple-100 text-purple-700";
      case "decided":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getProgressPercentage = (deadline: string, urgency: "urgent" | "standard") => {
    const hours = parseInt(deadline.split(" ")[0]);
    const maxHours = urgency === "urgent" ? 72 : 168; // 72 hours or 7 days
    return Math.max(0, Math.min(100, ((maxHours - hours) / maxHours) * 100));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div>
        <h2 className="font-display text-3xl font-bold text-arka-navy mb-2">
          CMS Compliance Command Center
        </h2>
        <p className="text-slate-600">
          Real-time tracking of CMS-0057-F requirements
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-arka-green/10 text-arka-green rounded-lg border border-arka-green/20">
          <CheckCircle className="h-4 w-4" />
          <span className="font-semibold text-sm">On Track</span>
        </div>
      </div>

      {/* Deadline Countdown Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: 72-Hour Urgent Decision Requirement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">72-Hour Urgent Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-arka-navy">{daysUntilJan2026}</p>
                <p className="text-sm text-slate-600">days until January 1, 2026</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Current Urgent Avg:</span>
                  <span className={cn("text-sm font-semibold", "text-arka-green")}>42 hours</span>
                </div>
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-1/3 bg-arka-green" />
                  <div className="absolute left-1/3 top-0 h-full w-1/3 bg-arka-amber" />
                  <div className="absolute left-2/3 top-0 h-full w-1/3 bg-arka-red" />
                  <div className="absolute left-0 top-0 h-full w-[58%] bg-arka-green" />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">&lt;48h</span>
                  <span className="text-xs text-slate-500">48-72h</span>
                  <span className="text-xs text-slate-500">&gt;72h</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-arka-green">98.2%</span> of urgent requests decided within 72 hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: 7-Day Standard Decision Requirement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">7-Day Standard Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-arka-navy">{daysUntilJan2026}</p>
                <p className="text-sm text-slate-600">days until January 1, 2026</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Current Standard Avg:</span>
                  <span className={cn("text-sm font-semibold", "text-arka-green")}>4.2 days</span>
                </div>
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-[60%] bg-arka-green" />
                  <div className="absolute left-[60%] top-0 h-full w-[30%] bg-arka-amber" />
                  <div className="absolute left-[90%] top-0 h-full w-[10%] bg-arka-red" />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">&lt;5 days</span>
                  <span className="text-xs text-slate-500">5-7 days</span>
                  <span className="text-xs text-slate-500">&gt;7 days</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-arka-green">100%</span> compliance rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: FHIR API Requirement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">FHIR API Requirement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-arka-navy">{daysUntilJan2027}</p>
                <p className="text-sm text-slate-600">days until January 2027</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-arka-green" />
                  <span className="text-sm text-slate-700">Da Vinci CRD implemented</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-arka-green" />
                  <span className="text-sm text-slate-700">Da Vinci DTR implemented</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-arka-amber" />
                  <span className="text-sm text-slate-700">Da Vinci PAS in progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-arka-amber" />
                  <span className="text-sm text-slate-700">X12 278 bridge ready</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">API Ready</span>
                  <span className="text-sm font-semibold">67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Public Reporting Requirement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Public Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-arka-navy">{daysUntilMarch2026}</p>
                <p className="text-sm text-slate-600">days until March 31, 2026</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-arka-green" />
                  <span className="text-sm text-slate-700">Approval rates by service</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-arka-green" />
                  <span className="text-sm text-slate-700">Denial rates with reasons</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-arka-green" />
                  <span className="text-sm text-slate-700">Appeal outcomes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-arka-amber" />
                  <span className="text-sm text-slate-700">Average decision times</span>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="secondary" size="sm" className="w-full" leftIcon={<FileText className="h-4 w-4" />}>
                  Report Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Violation Alerts Panel */}
      {slaViolations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("rounded-lg border-2 border-arka-red/30 bg-arka-red/5 p-4")}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-arka-red" />
            <h3 className="font-semibold text-arka-red">SLA Violation Alerts</h3>
            <Badge status="error" variant="solid" className="ml-auto">
              {slaViolations.length} at risk
            </Badge>
          </div>
          <div className="space-y-2">
            {slaViolations.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-2 bg-white rounded border border-arka-red/20">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-arka-navy">{req.id}</span>
                  <span className="text-xs text-slate-600">{req.patientId}</span>
                  <Badge variant="outline" status={req.urgency === "urgent" ? "error" : "neutral"} className="text-xs">
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
                  <Button size="sm" variant="secondary" className="h-7 text-xs">
                    Auto-Decide
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Requests Timeline View */}
      <Card>
        <CardHeader>
          <CardTitle>Active Requests Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {/* Column 1: Received Today */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-700">Received Today</h4>
                <Badge status="neutral" variant="subtle">{activeRequests.filter((r) => r.status === "received").length}</Badge>
              </div>
              {activeRequests
                .filter((r) => r.status === "received")
                .map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white border border-slate-200 rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      {getImagingIcon(req.imagingType)}
                      <span className="text-xs font-medium text-slate-700">{req.imagingType}</span>
                    </div>
                    <div className="text-xs text-slate-600">{req.patientId}</div>
                    <Badge variant="outline" status={req.urgency === "urgent" ? "error" : "neutral"} className="text-xs">
                      {req.urgency}
                    </Badge>
                    <div className="text-xs text-slate-500">{req.timeReceived}</div>
                    <div className="flex items-center gap-1 text-xs font-medium text-arka-navy">
                      <Clock className="h-3 w-3" />
                      {req.deadline} to deadline
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Column 2: In Review */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-700">In Review</h4>
                <Badge status="neutral" variant="subtle">{activeRequests.filter((r) => r.status === "in-review").length}</Badge>
              </div>
              {activeRequests
                .filter((r) => r.status === "in-review")
                .map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white border border-slate-200 rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      {getImagingIcon(req.imagingType)}
                      <span className="text-xs font-medium text-slate-700">{req.imagingType}</span>
                    </div>
                    <div className="text-xs text-slate-600">{req.patientId}</div>
                    <Badge variant="outline" status={req.urgency === "urgent" ? "error" : "neutral"} className="text-xs">
                      {req.urgency}
                    </Badge>
                    {req.assignedReviewer && (
                      <div className="text-xs text-slate-600">Reviewer: {req.assignedReviewer}</div>
                    )}
                    <div className="text-xs text-slate-500">In status: {req.timeInStatus}</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-medium">{getProgressPercentage(req.deadline, req.urgency).toFixed(0)}%</span>
                      </div>
                      <Progress
                        value={getProgressPercentage(req.deadline, req.urgency)}
                        className={cn(
                          "h-1.5",
                          getProgressPercentage(req.deadline, req.urgency) > 80 ? "bg-arka-red" : ""
                        )}
                      />
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Column 3: Pending Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-700">Pending Info</h4>
                <Badge status="neutral" variant="subtle">{activeRequests.filter((r) => r.status === "pending-info").length}</Badge>
              </div>
              {activeRequests
                .filter((r) => r.status === "pending-info")
                .map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white border border-slate-200 rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      {getImagingIcon(req.imagingType)}
                      <span className="text-xs font-medium text-slate-700">{req.imagingType}</span>
                    </div>
                    <div className="text-xs text-slate-600">{req.patientId}</div>
                    <Badge variant="outline" status={req.urgency === "urgent" ? "error" : "neutral"} className="text-xs">
                      {req.urgency}
                    </Badge>
                    <div className="text-xs text-slate-500">Request sent {req.timeInStatus} ago</div>
                    {getProgressPercentage(req.deadline, req.urgency) > 70 && (
                      <div className="flex items-center gap-1 text-xs text-arka-red font-medium">
                        <AlertCircle className="h-3 w-3" />
                        Auto-escalation warning
                      </div>
                    )}
                  </motion.div>
                ))}
            </div>

            {/* Column 4: Decided Today */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-700">Decided Today</h4>
                <Badge status="neutral" variant="subtle">{activeRequests.filter((r) => r.status === "decided").length}</Badge>
              </div>
              {activeRequests
                .filter((r) => r.status === "decided")
                .map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white border border-slate-200 rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      {getImagingIcon(req.imagingType)}
                      <span className="text-xs font-medium text-slate-700">{req.imagingType}</span>
                    </div>
                    <div className="text-xs text-slate-600">{req.patientId}</div>
                    <Badge
                      variant="outline"
                      status={req.decision === "approved" ? "success" : "error"}
                      className="text-xs"
                    >
                      {req.decision === "approved" ? "Approved" : "Denied"}
                    </Badge>
                    <div className="text-xs text-slate-500">Decision time: {req.decisionTime}</div>
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
                  </motion.div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Compliance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Compliance (Past 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[90, 101]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#36B37E" strokeDasharray="5 5" label="CMS Target" />
              <Line
                type="monotone"
                dataKey="urgent"
                stroke="#FF5630"
                strokeWidth={2}
                name="Urgent Request Compliance"
                dot={{ fill: "#FF5630", r: 4 }}
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="standard"
                stroke="#0052CC"
                strokeWidth={2}
                name="Standard Request Compliance"
                dot={{ fill: "#0052CC", r: 4 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-arka-green/5 border border-arka-green/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-arka-green" />
              <span className="text-slate-700">
                <span className="font-semibold">CMS Deadline:</span> January 2026 requirement shown as reference line at 100%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
