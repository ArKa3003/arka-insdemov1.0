"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
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
  Eye,
  Brain,
  User,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditTrailViewerProps {
  className?: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  time: string;
  type: "received" | "ai-analysis" | "routing" | "review" | "finalized";
  title: string;
  details: {
    [key: string]: string | string[] | number | boolean;
  };
  expanded?: boolean;
}

interface DecisionRecord {
  id: string;
  requestId: string;
  patientId: string;
  service: string;
  cptCode: string;
  provider: string;
  npi: string;
  payer: string;
  finalDecision: "APPROVED" | "DENIED" | "PENDED";
  decisionTime: string;
  withinSLA: boolean;
  timeline: TimelineEvent[];
  aiTransparency?: {
    inputData: {
      clinicalNotes: string;
      diagnosisCodes: Array<{ code: string; description: string }>;
      priorImaging: string[];
      treatmentHistory: string[];
    };
    processing: {
      featuresExtracted: string[];
      criteriaMatched: Array<{ criterion: string; confidence: number }>;
      similarCases: number;
      riskFactors: string[];
    };
    output: {
      recommendation: string;
      probabilityDistribution: Array<{ outcome: string; probability: number }>;
      alternativeConsiderations: string[];
      uncertaintyFlags: string[];
    };
  };
  denialDetails?: {
    reasonCode: string;
    clinicalCriteriaNotMet: string;
    documentationReviewed: string[];
    documentationMissing: string[];
    reviewerCredentials: string;
    reviewerSpecialty: string;
    timeSpent: string;
    peerToPeerOffered: boolean;
    appealRightsNotified: boolean;
  };
  compliance: {
    caSB1120: {
      humanReviewerMadeFinal: boolean;
      aiWasAdvisoryOnly: boolean;
      clinicalNotesReviewed: boolean;
      patientHistoryConsidered: boolean;
    };
    cmsAI: {
      notSolelyAIBased: boolean;
      individualFactorsConsidered: boolean;
      treatingPhysicianInput: boolean;
      appealRightsCommunicated: boolean;
    };
  };
}

export function AuditTrailViewer({ className }: AuditTrailViewerProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState("30");
  const [decisionType, setDecisionType] = React.useState<string>("all");
  const [aiInvolvement, setAiInvolvement] = React.useState<string>("all");
  const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set());
  const [showExportModal, setShowExportModal] = React.useState(false);

  // Mock data
  const decisions: DecisionRecord[] = [
    {
      id: "DEC-001",
      requestId: "PA-2025-847291",
      patientId: "PAT-***-5678",
      service: "MRI Lumbar Spine",
      cptCode: "72148",
      provider: "Dr. Smith",
      npi: "1234567890",
      payer: "BlueCross BlueShield",
      finalDecision: "APPROVED",
      decisionTime: "2h 34m",
      withinSLA: true,
      timeline: [
        {
          id: "T1",
          timestamp: "2025-01-15T09:14:23",
          time: "09:14:23 AM",
          type: "received",
          title: "Request Received",
          details: {
            source: "Epic EHR via FHIR API",
            documentationAttached: "12 pages",
            urgency: "Standard",
          },
        },
        {
          id: "T2",
          timestamp: "2025-01-15T09:14:25",
          time: "09:14:25 AM",
          type: "ai-analysis",
          title: "ARKA AI Analysis Initiated",
          details: {
            model: "ARKA-Clinical-v2.4",
            confidenceThreshold: "95%",
          },
        },
        {
          id: "T3",
          timestamp: "2025-01-15T09:14:31",
          time: "09:14:31 AM",
          type: "ai-analysis",
          title: "ARKA AI Analysis Complete",
          details: {
            recommendation: "APPROVE",
            confidence: "97.3%",
            clinicalRationale: [
              "ACR Appropriateness Criteria: Usually Appropriate (8/9)",
              "Conservative treatment documented: 6 weeks PT, NSAIDs",
              "Prior imaging: X-ray showed degenerative changes",
              "Red flags: None identified",
            ],
            matchedCriteria: ["RAD-MSK-001.a", "RAD-MSK-001.c", "RAD-MSK-001.f"],
            documentationScore: "94/100",
          },
        },
        {
          id: "T4",
          timestamp: "2025-01-15T09:15:02",
          time: "09:15:02 AM",
          type: "routing",
          title: "Routed for Human Review",
          details: {
            reason: "Standard protocol for all decisions",
            assignedTo: "Dr. Sarah Chen, MD (Radiology)",
            reviewerSpecialtyMatch: "✓ MSK Radiology",
          },
        },
        {
          id: "T5",
          timestamp: "2025-01-15T11:47:58",
          time: "11:47:58 AM",
          type: "review",
          title: "Human Reviewer Action",
          details: {
            reviewer: "Dr. Sarah Chen, MD",
            license: "CA-RAD-28471",
            action: "APPROVED",
            reviewerNotes:
              "AI analysis accurate. Clinical documentation supports medical necessity. Appropriate imaging for chronic low back pain with failed conservative management.",
            timeSpentReviewing: "4m 23s",
            criteriaVerified: [
              "Clinical indication documented",
              "Conservative treatment attempted",
              "Prior imaging reviewed",
              "No contraindications",
            ],
          },
        },
        {
          id: "T6",
          timestamp: "2025-01-15T11:48:12",
          time: "11:48:12 AM",
          type: "finalized",
          title: "Decision Finalized",
          details: {
            finalDecision: "APPROVED",
            notificationSent: "Provider notified",
            decisionLetterGenerated: "Yes",
          },
        },
      ],
      aiTransparency: {
        inputData: {
          clinicalNotes: "58-year-old male with 18-month history of chronic low back pain...",
          diagnosisCodes: [
            { code: "M54.5", description: "Low back pain" },
            { code: "M51.16", description: "Intervertebral disc degeneration" },
          ],
          priorImaging: ["X-ray lumbar spine - 2023-06-20"],
          treatmentHistory: ["Physical therapy - 12 weeks", "NSAIDs - 9 months"],
        },
        processing: {
          featuresExtracted: [
            "Symptom duration > 4 weeks",
            "Failed conservative treatment",
            "Objective neurological findings",
          ],
          criteriaMatched: [
            { criterion: "RAD-MSK-001.a", confidence: 98 },
            { criterion: "RAD-MSK-001.c", confidence: 95 },
            { criterion: "RAD-MSK-001.f", confidence: 97 },
          ],
          similarCases: 847,
          riskFactors: ["None identified"],
        },
        output: {
          recommendation: "APPROVE",
          probabilityDistribution: [
            { outcome: "APPROVE", probability: 97.3 },
            { outcome: "DENY", probability: 2.1 },
            { outcome: "PEND", probability: 0.6 },
          ],
          alternativeConsiderations: ["Consider additional conservative treatment if patient prefers"],
          uncertaintyFlags: ["None"],
        },
      },
      compliance: {
        caSB1120: {
          humanReviewerMadeFinal: true,
          aiWasAdvisoryOnly: true,
          clinicalNotesReviewed: true,
          patientHistoryConsidered: true,
        },
        cmsAI: {
          notSolelyAIBased: true,
          individualFactorsConsidered: true,
          treatingPhysicianInput: true,
          appealRightsCommunicated: true,
        },
      },
    },
  ];

  const filteredDecisions = decisions.filter((decision) => {
    if (searchQuery && !decision.requestId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (decisionType !== "all" && decision.finalDecision !== decisionType) {
      return false;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "received":
        return <Clock className="h-4 w-4 text-arka-blue" />;
      case "ai-analysis":
        return <Brain className="h-4 w-4 text-arka-teal" />;
      case "routing":
        return <User className="h-4 w-4 text-arka-amber" />;
      case "review":
        return <Eye className="h-4 w-4 text-arka-green" />;
      case "finalized":
        return <CheckCircle className="h-4 w-4 text-arka-green" />;
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case "APPROVED":
        return (
          <Badge status="success" variant="solid" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            APPROVED
          </Badge>
        );
      case "DENIED":
        return (
          <Badge status="error" variant="solid" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            DENIED
          </Badge>
        );
      case "PENDED":
        return (
          <Badge status="warning" variant="solid" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            PENDED
          </Badge>
        );
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-bold text-arka-navy mb-2">
          Decision Audit Trail
        </h2>
        <p className="text-slate-600 mb-4">Complete transparency for regulatory compliance</p>
        <div className="flex items-center gap-3">
          <Badge status="success" variant="solid" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            CA SB 1120 Compliant
          </Badge>
          <Badge status="success" variant="solid" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            CMS AI Guidelines Compliant
          </Badge>
        </div>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by Request ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Select value={decisionType} onValueChange={setDecisionType}>
              <SelectTrigger>
                <SelectValue placeholder="Decision type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="APPROVED">Approvals</SelectItem>
                <SelectItem value="DENIED">Denials</SelectItem>
                <SelectItem value="PENDED">Pended</SelectItem>
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
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {filteredDecisions.length} decision{filteredDecisions.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />} onClick={() => setShowExportModal(true)}>
                Export Report
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<ExternalLink className="h-4 w-4" />}>
                API Endpoint
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decision Timeline View */}
      <div className="space-y-4">
        {filteredDecisions.map((decision, index) => {
          const isExpanded = expandedCards.has(decision.id);
          return (
            <motion.div
              key={decision.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{decision.requestId}</CardTitle>
                        {getDecisionBadge(decision.finalDecision)}
                        {decision.withinSLA && (
                          <Badge status="success" variant="outline" className="text-xs">
                            Within SLA ✓
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Patient:</span> {decision.patientId}
                        </div>
                        <div>
                          <span className="font-medium">Service:</span> {decision.service} ({decision.cptCode})
                        </div>
                        <div>
                          <span className="font-medium">Provider:</span> {decision.provider}
                        </div>
                        <div>
                          <span className="font-medium">Payer:</span> {decision.payer}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        <span className="font-medium">Decision Time:</span> {decision.decisionTime}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(decision.id)}
                      rightIcon={isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0">
                        {/* Timeline Visualization */}
                        <div className="relative pl-8 border-l-2 border-slate-200 space-y-6">
                          {decision.timeline.map((event, eventIndex) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: eventIndex * 0.1 }}
                              className="relative"
                            >
                              {/* Timeline dot and line */}
                              <div className="absolute -left-[33px] top-0">
                                <div className="w-6 h-6 rounded-full bg-white border-2 border-arka-blue flex items-center justify-center">
                                  {getEventIcon(event.type)}
                                </div>
                                {eventIndex < decision.timeline.length - 1 && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "100%" }}
                                    transition={{ delay: eventIndex * 0.1 + 0.3, duration: 0.5 }}
                                    className="absolute left-[11px] top-6 w-0.5 bg-slate-300"
                                    style={{ height: "calc(100% + 1.5rem)" }}
                                  />
                                )}
                              </div>

                              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-arka-navy">{event.title}</span>
                                    <span className="text-xs text-slate-500">{event.time}</span>
                                  </div>
                                </div>
                                <div className="space-y-1 text-sm text-slate-600">
                                  {Object.entries(event.details).map(([key, value]) => (
                                    <div key={key} className="flex items-start gap-2">
                                      <span className="font-medium capitalize min-w-[120px]">
                                        {key.replace(/([A-Z])/g, " $1").trim()}:
                                      </span>
                                      <span>
                                        {Array.isArray(value) ? (
                                          <ul className="list-disc list-inside space-y-1">
                                            {value.map((item, i) => (
                                              <li key={i}>{item}</li>
                                            ))}
                                          </ul>
                                        ) : typeof value === "boolean" ? (
                                          value ? "Yes" : "No"
                                        ) : (
                                          String(value)
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* AI Transparency Panel */}
                        {decision.aiTransparency && (
                          <div className="mt-6">
                            <Card>
                              <CardHeader>
                                <div className="flex items-center gap-2">
                                  <Brain className="h-5 w-5 text-arka-teal" />
                                  <CardTitle>AI Transparency Panel</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-arka-navy mb-2">Input Data</h4>
                                    <div className="bg-slate-50 rounded p-3 text-sm space-y-2">
                                      <div>
                                        <span className="font-medium">Clinical Notes:</span>
                                        <p className="text-slate-600 mt-1">{decision.aiTransparency.inputData.clinicalNotes}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Diagnosis Codes:</span>
                                        <ul className="list-disc list-inside mt-1 text-slate-600">
                                          {decision.aiTransparency.inputData.diagnosisCodes.map((code, i) => (
                                            <li key={i}>
                                              {code.code}: {code.description}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-arka-navy mb-2">AI Processing</h4>
                                    <div className="bg-slate-50 rounded p-3 text-sm space-y-2">
                                      <div>
                                        <span className="font-medium">Criteria Matched:</span>
                                        <ul className="list-disc list-inside mt-1 text-slate-600">
                                          {decision.aiTransparency.processing.criteriaMatched.map((item, i) => (
                                            <li key={i}>
                                              {item.criterion}: {item.confidence}% confidence
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-arka-navy mb-2">Output</h4>
                                    <div className="bg-slate-50 rounded p-3 text-sm space-y-2">
                                      <div>
                                        <span className="font-medium">Probability Distribution:</span>
                                        <ul className="list-disc list-inside mt-1 text-slate-600">
                                          {decision.aiTransparency.output.probabilityDistribution.map((item, i) => (
                                            <li key={i}>
                                              {item.outcome}: {item.probability}%
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Denial-Specific Details */}
                        {decision.denialDetails && (
                          <div className="mt-6">
                            <Card>
                              <CardHeader>
                                <CardTitle>Denial-Specific Audit Requirements</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Reason Code:</span> {decision.denialDetails.reasonCode}
                                  </div>
                                  <div>
                                    <span className="font-medium">Reviewer:</span> {decision.denialDetails.reviewerCredentials}
                                  </div>
                                  <div>
                                    <span className="font-medium">Time Spent:</span> {decision.denialDetails.timeSpent}
                                  </div>
                                  <div>
                                    <span className="font-medium">Peer-to-Peer Offered:</span>{" "}
                                    {decision.denialDetails.peerToPeerOffered ? "Yes" : "No"}
                                  </div>
                                  <div>
                                    <span className="font-medium">Appeal Rights Notified:</span>{" "}
                                    {decision.denialDetails.appealRightsNotified ? "Yes" : "No"}
                                  </div>
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold text-arka-navy mb-3">California SB 1120</h4>
                                  <div className="space-y-2">
                                    {Object.entries(decision.compliance.caSB1120).map(([key, value]) => (
                                      <motion.div
                                        key={key}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex items-center gap-2"
                                      >
                                        {value ? (
                                          <CheckCircle className="h-4 w-4 text-arka-green" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-arka-red" />
                                        )}
                                        <span className="text-sm text-slate-700">
                                          {key.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-arka-navy mb-3">CMS AI Guidelines</h4>
                                  <div className="space-y-2">
                                    {Object.entries(decision.compliance.cmsAI).map(([key, value]) => (
                                      <motion.div
                                        key={key}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-center gap-2"
                                      >
                                        {value ? (
                                          <CheckCircle className="h-4 w-4 text-arka-green" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-arka-red" />
                                        )}
                                        <span className="text-sm text-slate-700">
                                          {key.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                      </motion.div>
                                    ))}
                                  </div>
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

      {/* Export Modal */}
      {showExportModal && (
        <Modal open={showExportModal} onOpenChange={setShowExportModal}>
          <ModalContent size="lg">
            <ModalHeader>
              <ModalTitle>Generate Audit Report</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="365">Last 12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Format</label>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700">
                    Report will include:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm text-slate-600 space-y-1">
                    <li>Executive summary</li>
                    <li>Decision statistics</li>
                    <li>AI involvement metrics</li>
                    <li>Human oversight verification</li>
                    <li>Compliance certification statement</li>
                  </ul>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShowExportModal(false)}>
                Generate Report
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
