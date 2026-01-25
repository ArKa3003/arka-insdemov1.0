"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  GOLD_CARD_THRESHOLDS,
  projectEligibilityDate,
  calculateGoldCardEligibility,
  type GoldCardTrend,
} from "@/lib/gold-card-utils";
import { GOLD_CARD_PROVIDERS, type GoldCardProvider } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Search,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  FileCheck,
  DollarSign,
  BarChart3,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// --- Funnel & tier constants from prompt ---
const TOTAL_ACTIVE = 2901;
const MEET_MIN_ORDERS = 1847;
const MEET_APPROVAL_THRESHOLD = 412;
const CURRENTLY_ELIGIBLE = 127;
const NEARLY_ELIGIBLE = 285;
const ARKA_HELPING = 285;
const TARGET_PCT = 15;
const TARGET_ABSOLUTE = 435;
const GAP = 308;
const TREND_THIS_MONTH = 8;
const ELIGIBLE_APPROVAL_AVG = 94.8;

// Network eligibility count per payer (mock)
const PAYER_ELIGIBILITY_COUNTS: Record<string, number> = {
  UnitedHealthcare: 89,
  Aetna: 98,
  BCBS: 94,
  Humana: 76,
  Cigna: 72,
};

// Impact metrics (mock)
const IMPACT = {
  autoApprovalHoursSaved: 312,
  appealsAvoided: 89,
  satisfactionLift: 18,
  adminCostReduction: 38657,
};

// --- Helpers ---
function formatMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function inferTrend(history: { approvalRate: number }[]): GoldCardTrend {
  if (history.length < 2) return "stable";
  const first = history[0].approvalRate;
  const last = history[history.length - 1].approvalRate;
  if (last > first + 1) return "improving";
  if (last < first - 1) return "declining";
  return "stable";
}

// --- Component ---
export interface GoldCardDashboardProps {
  className?: string;
}

export function GoldCardDashboard({ className }: GoldCardDashboardProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [lookupResult, setLookupResult] = React.useState<GoldCardProvider | null>(null);
  const [showLookupCard, setShowLookupCard] = React.useState(false);

  const doLookup = React.useCallback(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setLookupResult(null);
      setShowLookupCard(false);
      return;
    }
    const found = GOLD_CARD_PROVIDERS.find(
      (p) =>
        p.npi.includes(q) || p.name.toLowerCase().includes(q)
    );
    setLookupResult(found ?? null);
    setShowLookupCard(true);
  }, [searchQuery]);

  const payerRows = React.useMemo(
    () =>
      Object.entries(GOLD_CARD_THRESHOLDS).map(([payer, t]) => ({
        payer,
        threshold: `${t.approvalRatePercent}% over ${t.lookbackMonths} months`,
        minOrders: t.minOrderCount,
        networkEligible: PAYER_ELIGIBILITY_COUNTS[payer] ?? 0,
      })),
    []
  );

  return (
    <div className={cn("space-y-8", className)}>
      {/* HEADER */}
      <header>
        <h2 className="font-display text-3xl font-bold text-arka-navy">
          Gold Card Program Performance
        </h2>
        <p className="text-slate-600 mt-1">
          Help more providers qualify for PA bypass
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
          <span className="font-medium text-arka-navy">
            Current eligible: <strong>{CURRENTLY_ELIGIBLE}</strong> providers (4.4% of network)
          </span>
          <span className="text-slate-500">|</span>
          <span>
            Target: <strong>{TARGET_PCT}%</strong> of network ({TARGET_ABSOLUTE} providers)
          </span>
          <span className="text-slate-500">|</span>
          <span>Gap: <strong>{GAP}</strong> providers</span>
          <span className="text-slate-500">|</span>
          <span className="inline-flex items-center gap-1 text-arka-green font-medium">
            <TrendingUp className="h-4 w-4" />
            ↑ {TREND_THIS_MONTH} providers this month
          </span>
        </div>
      </header>

      {/* ELIGIBILITY FUNNEL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Eligibility Funnel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-sm text-slate-600">Total Active Providers</p>
              <p className="text-2xl font-bold text-arka-navy">{TOTAL_ACTIVE.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-sm text-slate-600">Meet Minimum Orders</p>
              <p className="text-2xl font-bold text-arka-navy">{MEET_MIN_ORDERS.toLocaleString()}</p>
              <p className="text-xs text-slate-500">64%</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-sm text-slate-600">Meet Approval Threshold</p>
              <p className="text-2xl font-bold text-arka-navy">{MEET_APPROVAL_THRESHOLD.toLocaleString()}</p>
              <p className="text-xs text-slate-500">22% of those with min orders</p>
            </div>
            <div className="rounded-lg border border-arka-green/30 bg-arka-green/5 p-4">
              <p className="text-sm text-slate-600">Currently Eligible</p>
              <p className="text-2xl font-bold text-arka-navy">{CURRENTLY_ELIGIBLE.toLocaleString()}</p>
              <p className="text-xs text-slate-500">3% (filtered by time in network, specialty, etc.)</p>
            </div>
          </div>
          <p className="text-sm text-arka-blue font-medium">
            ARKA is helping {ARKA_HELPING} additional providers move toward eligibility
          </p>
        </CardContent>
      </Card>

      {/* PROVIDER PERFORMANCE TIERS */}
      <section>
        <h3 className="font-display text-xl font-semibold text-arka-navy mb-4">
          Provider Performance Tiers
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tier 1: Gold Card Eligible */}
          <Card className="overflow-hidden border-2 border-arka-green/40 bg-gradient-to-br from-arka-green/5 to-emerald-50/50">
            <div className="h-1 gold-shimmer" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="gold-shimmer inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-arka-navy">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Tier 1
                </span>
                <span className="text-2xl font-bold text-arka-navy">{CURRENTLY_ELIGIBLE}</span>
              </div>
              <CardTitle className="text-base">Gold Card Eligible</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-arka-green font-medium">Auto-approval active</p>
              <p className="text-slate-600">Average approval rate: {ELIGIBLE_APPROVAL_AVG}%</p>
            </CardContent>
          </Card>

          {/* Tier 2: Nearly Eligible */}
          <Card className="border-2 border-arka-amber/50 bg-amber-50/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge status="warning" variant="subtle">Tier 2</Badge>
                <span className="text-2xl font-bold text-arka-navy">{NEARLY_ELIGIBLE}</span>
              </div>
              <CardTitle className="text-base">Nearly Eligible</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-amber-800 font-medium">Within 5% of threshold</p>
              <p className="text-slate-600">Gap ~2–5% · Projected: Q2 2025</p>
              <Button size="sm" variant="secondary" className="w-full" leftIcon={<MessageSquare className="h-3.5 w-3.5" />}>
                Provide feedback to improve
              </Button>
            </CardContent>
          </Card>

          {/* Tier 3: On Track */}
          <Card className="border-2 border-arka-blue/40 bg-blue-50/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge status="info" variant="subtle">Tier 3</Badge>
                <span className="text-2xl font-bold text-arka-navy">{MEET_APPROVAL_THRESHOLD}</span>
              </div>
              <CardTitle className="text-base">On Track</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-arka-blue font-medium">75–90% approval rate</p>
              <p className="text-slate-600">Continue current performance</p>
            </CardContent>
          </Card>

          {/* Tier 4: Needs Support (remainder) */}
          <Card className="border border-slate-200 bg-slate-50/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge status="neutral" variant="subtle">Tier 4</Badge>
                <span className="text-2xl font-bold text-arka-navy">
                  {TOTAL_ACTIVE - CURRENTLY_ELIGIBLE - NEARLY_ELIGIBLE - MEET_APPROVAL_THRESHOLD}
                </span>
              </div>
              <CardTitle className="text-base">Needs Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-slate-700 font-medium">Below 75% approval</p>
              <p className="text-slate-600">Educational resources recommended</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* INDIVIDUAL PROVIDER LOOKUP */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Individual Provider Lookup</CardTitle>
          <p className="text-sm text-slate-500">Search by NPI or name</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="NPI or provider name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doLookup()}
                className="pl-10"
              />
            </div>
            <Button onClick={doLookup}>Search</Button>
          </div>

          {showLookupCard && (
            <ProviderLookupCard
              provider={lookupResult}
              onViewImprovementPlan={() => {}}
            />
          )}
        </CardContent>
      </Card>

      {/* PAYER-SPECIFIC THRESHOLDS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payer-Specific Gold Card Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Payer</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Requirements</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Min Orders</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Your network eligible</th>
                </tr>
              </thead>
              <tbody>
                {payerRows.map((r) => (
                  <tr key={r.payer} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium text-arka-navy">{r.payer}</td>
                    <td className="py-3 px-4 text-slate-600">{r.threshold}</td>
                    <td className="py-3 px-4 text-slate-600">{r.minOrders}</td>
                    <td className="py-3 px-4 text-right font-medium">{r.networkEligible}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* IMPACT METRICS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Impact Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-arka-blue/10 p-2">
                <Clock className="h-5 w-5 text-arka-blue" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Auto-approval time savings</p>
                <p className="text-xl font-bold text-arka-navy">{IMPACT.autoApprovalHoursSaved} hours/month</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-arka-green/10 p-2">
                <FileCheck className="h-5 w-5 text-arka-green" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Appeals avoided from gold card providers</p>
                <p className="text-xl font-bold text-arka-navy">{IMPACT.appealsAvoided}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-arka-amber/10 p-2">
                <Users className="h-5 w-5 text-arka-amber" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Provider satisfaction lift</p>
                <p className="text-xl font-bold text-arka-navy">+{IMPACT.satisfactionLift}%</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-arka-green/10 p-2">
                <DollarSign className="h-5 w-5 text-arka-green" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Admin cost reduction</p>
                <p className="text-xl font-bold text-arka-navy">
                  ${IMPACT.adminCostReduction.toLocaleString()}/month
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Provider Lookup Card (and optional modal for Improvement Plan) ---
function ProviderLookupCard({
  provider,
  onViewImprovementPlan,
}: {
  provider: GoldCardProvider | null;
  onViewImprovementPlan: () => void;
}) {
  const [showModal, setShowModal] = React.useState(false);

  if (!provider) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-slate-400" />
        <p className="mt-2 font-medium text-slate-600">No provider found</p>
        <p className="text-sm text-slate-500">Try a different NPI or name.</p>
      </div>
    );
  }

  const payers = Object.keys(GOLD_CARD_THRESHOLDS);
  const byPayer = payers.map((p) => {
    const rate = provider.approvalRates.byPayer[p] ?? provider.approvalRates.overall;
    const th = GOLD_CARD_THRESHOLDS[p];
    const status = calculateGoldCardEligibility(rate, 80, p);
    return { payer: p, rate, threshold: th.approvalRatePercent, gap: status.gapToRate, eligible: status.eligible };
  });

  const history = provider.orderHistory;
  const trend = inferTrend(history);
  const maxThreshold = Math.max(...byPayer.map((x) => x.threshold));
  const projected = projectEligibilityDate(provider.approvalRates.overall, trend, maxThreshold);
  const ordersInPeriod = history.reduce((s, h) => s + h.orders, 0);

  const chartData = history.map((h) => ({
    month: formatMonth(h.month),
    rate: h.approvalRate,
    orders: h.orders,
  }));

  return (
    <>
      <Card className="border-2 border-arka-blue/20">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h4 className="font-display text-lg font-semibold text-arka-navy">{provider.name}</h4>
              <p className="text-sm text-slate-600">NPI: {provider.npi} · {provider.specialty}</p>
              <p className="text-sm text-slate-500">{provider.facility}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Current approval rate</p>
              <p className="text-2xl font-bold text-arka-navy">{provider.approvalRates.overall.toFixed(1)}%</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gold card threshold per payer */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Gold card threshold by payer</p>
            <div className="flex flex-wrap gap-2">
              {byPayer.map((x) =>
                x.eligible ? (
                  <span
                    key={x.payer}
                    className="gold-shimmer inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-arka-navy"
                  >
                    {x.payer}: {x.rate.toFixed(1)}% ✓
                  </span>
                ) : (
                  <Badge key={x.payer} status="neutral" variant="subtle">
                    {x.payer}: {x.rate.toFixed(1)}% (need {x.threshold}%){x.gap > 0 ? ` · ${x.gap}% gap` : ""}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Orders in evaluation period</p>
              <p className="font-semibold">{ordersInPeriod}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Gap to threshold (worst payer)</p>
              <p className="font-semibold">
                {Math.max(0, ...byPayer.filter((x) => !x.eligible).map((x) => x.gap)).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Projected eligibility date</p>
              <p className="font-semibold">
                {projected ? projected.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
              </p>
            </div>
          </div>

          {/* Trend chart 6–12 months */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Approval rate trend (6 months)</p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[70, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                    formatter={(v: number | undefined) => [`${v != null ? v.toFixed(1) : "--"}%`, "Approval rate"]}
                  />
                  <ReferenceLine y={maxThreshold} stroke="#ca8a04" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="rate" stroke="#0052CC" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Button
            size="sm"
            variant="primary"
            rightIcon={<ChevronRight className="h-4 w-4" />}
            onClick={() => setShowModal(true)}
          >
            View Improvement Plan
          </Button>
        </CardContent>
      </Card>

      <Modal open={showModal} onOpenChange={setShowModal}>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle>Improvement Plan — {provider.name}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-slate-600">
                Based on approval rates by payer and common denial reasons, we recommend:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                <li>Focus documentation on conservative treatment and objective findings for borderline payers.</li>
                <li>Use ARKA pre-submission checks before sending to payers where you are within 5% of threshold.</li>
                <li>Review denial patterns in the last 90 days to address recurring gaps.</li>
              </ul>
              <div className="flex items-center gap-2 rounded-lg bg-arka-blue/5 border border-arka-blue/20 p-3">
                <BarChart3 className="h-5 w-5 text-arka-blue flex-shrink-0" />
                <p className="text-sm text-slate-700">
                  At current trajectory, eligibility is projected for{" "}
                  <strong>{projected ? projected.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}</strong>.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" onClick={() => { onViewImprovementPlan(); setShowModal(false); }}>
              Open in ARKA
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
