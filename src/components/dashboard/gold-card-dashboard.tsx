"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
import { CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, Search, Download, Send, Star, Calendar, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface GoldCardDashboardProps {
  className?: string;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  orders: number;
  approvalRate: number;
  goldCardStatus: "eligible" | "near" | "in-progress" | "needs-improvement";
  trend: "up" | "down" | "flat";
  distanceFromThreshold?: number;
  facility: string;
  npi: string;
}

interface PayerThreshold {
  payer: string;
  threshold: number;
  period: string;
  providersMeeting: number;
  totalProviders: number;
  distribution: Array<{ range: string; count: number }>;
}

// Count up animation
const CountUp: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1.5 }) => {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 20, stiffness: 100 });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  React.useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [spring]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export function GoldCardDashboard({ className }: GoldCardDashboardProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProvider, setSelectedProvider] = React.useState<Provider | null>(null);
  const [selectedPayer, setSelectedPayer] = React.useState<string>("UnitedHealthcare");
  const [sortField, setSortField] = React.useState<keyof Provider>("approvalRate");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");

  // Mock data
  const totalProviders = 2847;
  const goldCardEligible = 127;
  const nearEligible = 312;
  const newQualifications = 12;

  const providers: Provider[] = [
    {
      id: "PROV-001",
      name: "Dr. Smith",
      specialty: "Orthopedics",
      orders: 234,
      approvalRate: 96.2,
      goldCardStatus: "eligible",
      trend: "up",
      facility: "Metro Spine & Orthopedics",
      npi: "1234567890",
    },
    {
      id: "PROV-002",
      name: "Dr. Jones",
      specialty: "Neurology",
      orders: 189,
      approvalRate: 91.4,
      goldCardStatus: "eligible",
      trend: "flat",
      facility: "Neuroscience Associates",
      npi: "0987654321",
    },
    {
      id: "PROV-003",
      name: "Dr. Wilson",
      specialty: "Internal Med",
      orders: 156,
      approvalRate: 88.7,
      goldCardStatus: "near",
      trend: "up",
      distanceFromThreshold: 1.3,
      facility: "Regional Medical Center",
      npi: "1122334455",
    },
    {
      id: "PROV-004",
      name: "Dr. Brown",
      specialty: "Cardiology",
      orders: 203,
      approvalRate: 84.2,
      goldCardStatus: "in-progress",
      trend: "up",
      facility: "Heart & Vascular Institute",
      npi: "2233445566",
    },
    {
      id: "PROV-005",
      name: "Dr. Davis",
      specialty: "Family Med",
      orders: 167,
      approvalRate: 71.3,
      goldCardStatus: "needs-improvement",
      trend: "down",
      facility: "Community Health Center",
      npi: "3344556677",
    },
  ];

  const payerThresholds: PayerThreshold[] = [
    {
      payer: "UnitedHealthcare",
      threshold: 92,
      period: "24 months",
      providersMeeting: 89,
      totalProviders: totalProviders,
      distribution: [
        { range: "70-75%", count: 45 },
        { range: "75-80%", count: 123 },
        { range: "80-85%", count: 287 },
        { range: "85-90%", count: 512 },
        { range: "90-92%", count: 312 },
        { range: "92-95%", count: 89 },
        { range: "95-100%", count: 45 },
      ],
    },
    {
      payer: "Aetna",
      threshold: 90,
      period: "12 months",
      providersMeeting: 127,
      totalProviders: totalProviders,
      distribution: [
        { range: "70-75%", count: 38 },
        { range: "75-80%", count: 112 },
        { range: "80-85%", count: 298 },
        { range: "85-90%", count: 523 },
        { range: "90-92%", count: 345 },
        { range: "92-95%", count: 127 },
        { range: "95-100%", count: 89 },
      ],
    },
  ];

  const currentPayer = payerThresholds.find((p) => p.payer === selectedPayer) || payerThresholds[0];

  const filteredProviders = providers.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.specialty.toLowerCase().includes(query) ||
      p.facility.toLowerCase().includes(query)
    );
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const handleSort = (field: keyof Provider) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusBadge = (status: Provider["goldCardStatus"], distance?: number) => {
    switch (status) {
      case "eligible":
        return (
          <Badge status="success" variant="solid" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            ELIGIBLE
          </Badge>
        );
      case "near":
        return (
          <Badge status="warning" variant="outline" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            NEAR ({distance}% away)
          </Badge>
        );
      case "in-progress":
        return (
          <Badge status="info" variant="outline" className="flex items-center gap-1">
            <Circle className="h-3 w-3" />
            IN PROGRESS
          </Badge>
        );
      case "needs-improvement":
        return (
          <Badge status="error" variant="outline" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            NEEDS IMPROVEMENT
          </Badge>
        );
    }
  };

  const getTrendIcon = (trend: Provider["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-arka-green" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-arka-red" />;
      case "flat":
        return <div className="h-4 w-4 border-t-2 border-slate-400" />;
    }
  };

  const providerPerformanceByType = [
    { type: "MRI Lumbar", orders: 45, approvalRate: 97.8, threshold: 92, diff: 5.8 },
    { type: "CT Abdomen", orders: 32, approvalRate: 93.8, threshold: 92, diff: 1.8 },
    { type: "MRI Brain", orders: 28, approvalRate: 82.1, threshold: 92, diff: -9.9 },
  ];

  const denialReasons = [
    { reason: "Missing conservative treatment", count: 12, percentage: 35 },
    { reason: "Insufficient clinical indication", count: 8, percentage: 24 },
    { reason: "Documentation gaps", count: 6, percentage: 18 },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-bold text-arka-navy mb-2">
          Gold Card Program Management
        </h2>
        <p className="text-slate-600 mb-4">
          Track provider performance and automate PA bypass eligibility
        </p>
        <div className="inline-flex items-center gap-4 px-4 py-3 bg-arka-green/10 border border-arka-green/30 rounded-lg">
          <div>
            <p className="text-xs text-slate-600">Providers now gold card eligible</p>
            <p className="text-2xl font-bold text-arka-navy">
              <CountUp value={goldCardEligible} />
            </p>
          </div>
          <div className="h-12 w-px bg-slate-300" />
          <div>
            <p className="text-xs text-slate-600">Increase since ARKA</p>
            <p className="text-2xl font-bold text-arka-green">↑ 2.1%</p>
          </div>
        </div>
      </div>

      {/* Program Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Providers Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-arka-navy">
              <CountUp value={totalProviders} />
            </p>
            <p className="text-sm text-slate-600 mt-2">Active in last 90 days</p>
            <div className="mt-4 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Orthopedics</span>
                <span className="font-medium">423</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Neurology</span>
                <span className="font-medium">287</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Cardiology</span>
                <span className="font-medium">312</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gold Card Eligible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-arka-green">
              <CountUp value={goldCardEligible} />
            </p>
            <p className="text-sm text-slate-600 mt-2">
              {((goldCardEligible / totalProviders) * 100).toFixed(1)}% of total
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-600">Target: 15% by Q4</span>
                <span className="text-xs font-semibold">
                  {((goldCardEligible / totalProviders) * 100 / 15 * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(goldCardEligible / totalProviders) * 100 / 15 * 100}%` }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-arka-green rounded-full"
                />
              </div>
            </div>
            <p className="text-xs text-arka-green mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              ↑ 2.1% this quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Near Eligible (85-89%)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-arka-amber">
              <CountUp value={nearEligible} />
            </p>
            <p className="text-sm text-slate-600 mt-2">Projected to qualify: 89 in next 90 days</p>
            <p className="text-sm text-arka-blue mt-2">Intervention opportunities: 223</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Qualifications This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-3xl font-bold text-arka-green"
            >
              <CountUp value={newQualifications} />
            </motion.div>
            <p className="text-sm text-slate-600 mt-2">Recently qualified providers</p>
            <div className="mt-3 space-y-1">
              {["Dr. Smith", "Dr. Johnson", "Dr. Williams"].map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xs text-slate-600 flex items-center gap-1"
                >
                  <Star className="h-3 w-3 text-arka-amber fill-arka-amber" />
                  {name}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Performance Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Provider Performance Leaderboard</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button size="sm" variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
                Export CSV
              </Button>
              <Button size="sm" variant="secondary" leftIcon={<Send className="h-4 w-4" />}>
                Send Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th
                    className="text-left py-3 px-4 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("name")}
                  >
                    Provider
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("specialty")}
                  >
                    Specialty
                  </th>
                  <th
                    className="text-right py-3 px-4 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("orders")}
                  >
                    Orders (6mo)
                  </th>
                  <th
                    className="text-right py-3 px-4 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("approvalRate")}
                  >
                    Approval Rate
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                    Gold Card Status
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {sortedProviders.map((provider, index) => (
                  <motion.tr
                    key={provider.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedProvider(provider)}
                  >
                    <td className="py-3 px-4 font-medium text-arka-navy">{provider.name}</td>
                    <td className="py-3 px-4 text-slate-700">{provider.specialty}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{provider.orders}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-arka-navy">{provider.approvalRate.toFixed(1)}%</span>
                    </td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(provider.goldCardStatus, provider.distanceFromThreshold)}</td>
                    <td className="py-3 px-4 text-center">{getTrendIcon(provider.trend)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Qualification Threshold Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Qualification Threshold Visualization</CardTitle>
            <div className="flex items-center gap-2">
              {payerThresholds.map((payer) => (
                <Button
                  key={payer.payer}
                  size="sm"
                  variant={selectedPayer === payer.payer ? "primary" : "secondary"}
                  onClick={() => setSelectedPayer(payer.payer)}
                >
                  {payer.payer}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Threshold:</span> {currentPayer.threshold}% over {currentPayer.period}
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Your providers meeting:</span> {currentPayer.providersMeeting}/
              {currentPayer.totalProviders} ({(currentPayer.providersMeeting / currentPayer.totalProviders * 100).toFixed(1)}%)
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentPayer.distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <ReferenceLine
                x={currentPayer.distribution.findIndex((d) => d.range.includes(`${currentPayer.threshold}`))}
                stroke="#36B37E"
                strokeDasharray="5 5"
                label="Threshold"
              />
              <Bar
                dataKey="count"
                fill="#0052CC"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              >
                {currentPayer.distribution.map((entry, index) => {
                  const rangeNum = parseInt(entry.range.split("-")[0]);
                  const isEligible = rangeNum >= currentPayer.threshold;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isEligible ? "#36B37E" : "#0052CC"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-arka-green/5 border border-arka-green/20 rounded-lg">
            <p className="text-xs text-slate-700">
              <span className="font-semibold">Eligible zone:</span> Providers with {currentPayer.threshold}%+ approval rate are highlighted in green
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Automated Notifications Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: "Notify when provider becomes eligible", checked: true },
              { label: "Notify when provider drops below threshold", checked: true },
              { label: "Weekly provider performance digest", checked: false },
              { label: "Monthly gold card program report", checked: true },
            ].map((item, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="w-4 h-4 text-arka-blue border-slate-300 rounded focus:ring-arka-blue"
                />
                <span className="text-sm text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ROI from Gold Card Program */}
      <Card>
        <CardHeader>
          <CardTitle>ROI from Gold Card Program</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">PA bypasses this month</p>
              <p className="text-2xl font-bold text-arka-navy">
                <CountUp value={1247} />
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Staff time saved</p>
              <p className="text-2xl font-bold text-arka-green">
                <CountUp value={312} /> hours
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Provider satisfaction increase</p>
              <p className="text-2xl font-bold text-arka-blue">+18%</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Processing cost reduction</p>
              <p className="text-2xl font-bold text-arka-green">
                $<CountUp value={38657} />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Deep Dive Modal */}
      {selectedProvider && (
        <Modal open={!!selectedProvider} onOpenChange={(open) => !open && setSelectedProvider(null)} size="xl">
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{selectedProvider.name} - Provider Profile</ModalTitle>
            </ModalHeader>
            <ModalBody scrollable>
              <div className="space-y-6">
                {/* Provider Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-arka-navy">{selectedProvider.name}</h3>
                      {getStatusBadge(selectedProvider.goldCardStatus, selectedProvider.distanceFromThreshold)}
                    </div>
                    <p className="text-sm text-slate-600">NPI: {selectedProvider.npi}</p>
                    <p className="text-sm text-slate-600">Specialty: {selectedProvider.specialty}</p>
                    <p className="text-sm text-slate-600">Facility: {selectedProvider.facility}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Overall Approval Rate</p>
                    <p className="text-3xl font-bold text-arka-navy">{selectedProvider.approvalRate.toFixed(1)}%</p>
                    {getTrendIcon(selectedProvider.trend)}
                  </div>
                </div>

                {/* Performance by Imaging Type */}
                <div>
                  <h4 className="font-semibold text-arka-navy mb-3">Performance by Imaging Type</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">Imaging Type</th>
                          <th className="text-right py-2 px-3 text-sm font-semibold text-slate-700">Orders</th>
                          <th className="text-right py-2 px-3 text-sm font-semibold text-slate-700">Approval Rate</th>
                          <th className="text-right py-2 px-3 text-sm font-semibold text-slate-700">vs Threshold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {providerPerformanceByType.map((item, index) => (
                          <tr key={index} className="border-b border-slate-100">
                            <td className="py-2 px-3 text-slate-700">{item.type}</td>
                            <td className="py-2 px-3 text-right text-slate-700">{item.orders}</td>
                            <td className="py-2 px-3 text-right font-semibold text-arka-navy">
                              {item.approvalRate.toFixed(1)}%
                            </td>
                            <td className="py-2 px-3 text-right">
                              {item.diff > 0 ? (
                                <span className="text-arka-green">+{item.diff.toFixed(1)}% ✓</span>
                              ) : (
                                <span className="text-arka-red">{item.diff.toFixed(1)}% ⚠</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Denial Analysis */}
                <div>
                  <h4 className="font-semibold text-arka-navy mb-3">Denial Analysis</h4>
                  <div className="space-y-2">
                    {denialReasons.map((reason, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-sm text-slate-700">{reason.reason}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">{reason.count} cases</span>
                          <span className="text-xs text-slate-500">({reason.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="secondary" className="mt-3">
                    Documentation coaching available
                  </Button>
                </div>

                {/* Qualification Projection */}
                <div className="p-4 bg-arka-blue/5 border border-arka-blue/20 rounded-lg">
                  <h4 className="font-semibold text-arka-navy mb-2">Qualification Projection</h4>
                  <p className="text-sm text-slate-700 mb-3">
                    At current trajectory, eligible in: <span className="font-bold text-arka-blue">47 days</span>
                  </p>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "68%" }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-arka-blue rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">68% of the way to eligibility threshold</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setSelectedProvider(null)}>
                Close
              </Button>
              <Button variant="primary">Send Improvement Report</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}

