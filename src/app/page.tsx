"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Clock,
  FileStack,
  Shield,
  CalendarCheck,
  Award,
  Eye,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { AnimatedTransition } from "@/components/ui/AnimatedTransition";
import { ANIMATION_DURATION } from "@/lib/constants";
import { trackROICalculation } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// --- ROI Calculator logic ---
const APPEAL_COST = 127;
const STAFF_HOURS_PER_APPEAL = 2.5;
const ARKA_OVERTURN_RATE = 15.3;

function useROI(volume: number, appealRate: number, overturnRate: number) {
  const appealsPrevented = Math.round(
    volume *
      (appealRate / 100) *
      Math.max(0, (overturnRate - ARKA_OVERTURN_RATE) / 100)
  );
  const savings = appealsPrevented * APPEAL_COST;
  const staffHoursSaved = Math.round(appealsPrevented * STAFF_HOURS_PER_APPEAL);
  return { appealsPrevented, savings, staffHoursSaved };
}

// --- Section wrapper: fade in on scroll ---
function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// --- Animated mesh background orbs ---
function AnimatedMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(0,82,204,0.5) 0%, transparent 70%)",
          left: "10%",
          top: "20%",
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(0,163,191,0.5) 0%, transparent 70%)",
          right: "5%",
          bottom: "15%",
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(54,179,126,0.4) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

export default function Home() {
  const [vol, setVol] = React.useState(75000);
  const [appealRate, setAppealRate] = React.useState(18);
  const [overturnRate, setOverturnRate] = React.useState(65);

  const roi = useROI(vol, appealRate, overturnRate);

  React.useEffect(() => {
    trackROICalculation(
      { volume: vol, appealRate, overturnRate },
      { appealsPrevented: roi.appealsPrevented, savings: roi.savings, staffHoursSaved: roi.staffHoursSaved }
    );
  }, [vol, appealRate, overturnRate, roi.appealsPrevented, roi.savings, roi.staffHoursSaved]);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <div className="min-h-screen bg-white">
      {/* --- 1. HERO (full viewport) --- */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-b from-arka-navy via-[#0b1a2d] to-[#051525]">
        {/* Parallax mesh + gradients */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <AnimatedMesh />
        </motion.div>
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 opacity-30"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,82,204,0.2) 0%, transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,163,191,0.1) 0%, transparent 40%)`,
            }}
          />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-arka-amber/15 text-arka-amber text-sm font-medium mb-6 border border-arka-amber/20"
          >
            The #1 Pain Point for RBMs—Solved
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight"
          >
            Stop Issuing Denials You Can&apos;t Defend
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto"
          >
            81.7% of Medicare Advantage denials get overturned on appeal. ARKA&apos;s
            AI predicts which denials will fail—before you issue them.
          </motion.p>

          {/* Statistics ticker (smooth animated count-up) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            <div className="stat-card bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-gray-400 mb-1">Appeal overturn:</p>
              <AnimatedTransition
                fromValue={81.7}
                toValue={15.3}
                duration={2000}
                decimals={1}
                suffix="%"
                fromClassName="text-red-400 font-bold text-lg"
                toClassName="text-green-400 font-bold text-lg"
                arrowClassName="text-slate-400 mx-2"
              />
            </div>
            <div className="stat-card bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-gray-400 mb-1">72hr Compliance:</p>
              <AnimatedNumber
                value={99.2}
                duration={2000}
                decimals={1}
                suffix="%"
                className="text-green-400 font-bold text-lg"
              />
            </div>
            <div className="stat-card bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-gray-400 mb-1">ROI for RBM Partners:</p>
              <AnimatedNumber
                value={4.2}
                duration={2000}
                decimals={1}
                suffix="x"
                className="text-cyan-400 font-bold text-lg"
              />
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/demo">
              <Button
                variant="primary"
                size="lg"
                className="shadow-lg shadow-arka-blue/30 hover:shadow-arka-blue/40 min-w-[180px]"
              >
                See Live Demo
              </Button>
            </Link>
            <a href="#roi-calculator">
              <Button
                variant="secondary"
                size="lg"
                className="min-w-[200px] border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                Calculate Your Savings
              </Button>
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-slate-400"
            >
              <ChevronDown className="h-8 w-8" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. PROBLEM STATEMENT --- */}
      <Section
        id="problem"
        className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-arka-navy text-center">
            The Prior Authorization Crisis Is Getting Worse
          </h2>
          <div className="mt-14 grid sm:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Clock,
                title: "Regulatory Tsunami",
                items: [
                  "CMS-0057-F deadlines: Jan 2026, Jan 2027",
                  "FHIR APIs mandatory",
                  "Public reporting of denial rates",
                ],
                iconBg: "bg-arka-amber/10",
                iconCl: "text-arka-amber",
              },
              {
                icon: FileStack,
                title: "Appeal Avalanche",
                items: [
                  "81.7% of MA denials overturned on appeal",
                  "$127 average cost per appeal",
                  "Staff overwhelmed with P2P and appeals",
                ],
                iconBg: "bg-arka-red/10",
                iconCl: "text-arka-red",
              },
              {
                icon: AlertTriangle,
                title: "Provider Revolt",
                items: [
                  "Only 16% say P2P reviewers are qualified",
                  "93% report PA delays necessary care",
                  "89% experiencing PA-related burnout",
                ],
                iconBg: "bg-arka-amber/10",
                iconCl: "text-arka-amber",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
                  transition: { duration: ANIMATION_DURATION.NORMAL / 1000 },
                }}
                className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div
                  className={cn(
                    "p-3 rounded-lg w-fit mb-4",
                    card.iconBg,
                    card.iconCl
                  )}
                >
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-arka-navy mb-2">
                  {card.title}
                </h3>
                <ul className="text-sm text-slate-600 space-y-1.5">
                  {card.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <a href="#" className="hover:text-arka-blue underline">
              HHS OIG 2022
            </a>
            <a href="#" className="hover:text-arka-blue underline">
              AMA Survey 2024
            </a>
            <a href="#" className="hover:text-arka-blue underline">
              ProPublica 2024
            </a>
          </div>
        </div>
      </Section>

      {/* --- 3. SOLUTION --- */}
      <Section id="solution" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-arka-navy text-center">
            ARKA: Your Compliance &amp; Quality Partner
          </h2>
          <p className="mt-4 text-center text-slate-600 max-w-2xl mx-auto">
            ARKA doesn&apos;t replace your clinical judgment—we enhance it. Our AI
            works alongside your reviewers to ensure every decision is
            defensible, timely, and appropriate.
          </p>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Pre-Denial Intelligence",
                desc: "Predict appeal outcomes before issuing denials",
                stat: "94% prediction accuracy",
                iconBg: "bg-arka-green/10",
                iconCl: "text-arka-green",
              },
              {
                icon: CalendarCheck,
                title: "CMS Compliance Engine",
                desc: "Meet 72-hour and 7-day deadlines automatically",
                stat: "99.2% SLA compliance",
                iconBg: "bg-arka-blue/10",
                iconCl: "text-arka-blue",
              },
              {
                icon: Award,
                title: "Gold Card Acceleration",
                desc: "Help more providers qualify for PA bypass",
                stat: "3% → 15% eligible providers",
                iconBg: "bg-arka-amber/10",
                iconCl: "text-arka-amber",
              },
              {
                icon: Eye,
                title: "Human-in-the-Loop Transparency",
                desc: "Full audit trail for every decision",
                stat: "100% defensibility",
                iconBg: "bg-arka-teal/10",
                iconCl: "text-arka-teal",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 16px 32px -8px rgba(0,0,0,0.12)",
                  transition: { duration: 0.2 },
                }}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all"
              >
                <div
                  className={cn(
                    "p-3 rounded-lg w-fit mb-4",
                    item.iconBg,
                    item.iconCl
                  )}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-arka-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                <p className="mt-3 text-sm font-semibold text-arka-blue">
                  {item.stat}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* --- 4. TRUST --- */}
      <Section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-arka-navy text-center">
            Trusted &amp; Integration-Ready
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["HIPAA", "SOC 2 Type II", "HITRUST", "NCQA"].map((b) => (
              <motion.span
                key={b}
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-arka-green" />
                {b}
              </motion.span>
            ))}
          </div>
          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Integrations
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-6 sm:gap-10">
            {["Epic", "Cerner", "eviCore", "Carelon", "HealthHelp", "Da Vinci FHIR"].map(
              (name) => (
                <motion.span
                  key={name}
                  whileHover={{ color: "#0A1628" }}
                  className="text-slate-400 font-medium transition-colors"
                >
                  {name}
                </motion.span>
              )
            )}
          </div>
        </div>
      </Section>

      {/* --- 5. ROI CALCULATOR TEASER --- */}
      <Section id="roi-calculator" className="py-20 sm:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-arka-navy text-center">
            ROI Calculator
          </h2>
          <p className="mt-2 text-center text-slate-600">
            See your projected savings with ARKA
          </p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly volume
                </label>
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={5000}
                  value={vol}
                  onChange={(e) => setVol(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-slate-200 accent-arka-blue"
                />
                <p className="mt-1 text-sm text-slate-500">
                  {vol.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Appeal rate (%)
                </label>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={appealRate}
                  onChange={(e) => setAppealRate(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-slate-200 accent-arka-blue"
                />
                <p className="mt-1 text-sm text-slate-500">{appealRate}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Overturn rate (%)
                </label>
                <input
                  type="range"
                  min={20}
                  max={85}
                  step={1}
                  value={overturnRate}
                  onChange={(e) => setOverturnRate(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-slate-200 accent-arka-blue"
                />
                <p className="mt-1 text-sm text-slate-500">{overturnRate}%</p>
              </div>
            </div>
            <motion.div
              key={`${roi.savings}-${roi.appealsPrevented}`}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="mt-8 p-4 rounded-xl bg-arka-navy text-white"
            >
              <p className="text-sm text-slate-300">Projected annual savings</p>
              <p className="text-2xl font-bold font-mono mt-1">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(roi.savings * 12)}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Appeals prevented: {roi.appealsPrevented.toLocaleString()} · Staff
                hours saved: {roi.staffHoursSaved.toLocaleString()}
              </p>
            </motion.div>
            <div className="mt-6 text-center">
              <Button variant="primary" size="lg" className="min-w-[220px]">
                Get Detailed ROI Analysis
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* --- 6. TESTIMONIALS --- */}
      <Section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-arka-navy text-center">
            What RBM Leaders Say
          </h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "ARKA's pre-denial risk scores have fundamentally changed how we train our reviewers. We're issuing fewer denials that would be overturned, and our appeal costs are down 40%.",
                role: "VP of Utilization Management, Regional Health Plan",
              },
              {
                quote:
                  "The CMS compliance engine keeps us ahead of every deadline. We went from constant fire drills to 99%+ SLA compliance. Game-changer for our operations.",
                role: "Chief Medical Officer, National RBM",
              },
              {
                quote:
                  "Gold card visibility alone has improved our provider relations. We can show exactly what it takes to qualify and help high performers get there faster.",
                role: "Director of Clinical Operations, Medicare Advantage Plan",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 32px -8px rgba(0,0,0,0.1)",
                }}
                className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm"
              >
                <Quote className="h-8 w-8 text-arka-blue/30 mb-3" />
                <p className="text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm text-slate-500">— {t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* --- 7. FINAL CTA --- */}
      <Section className="py-20 sm:py-24 bg-gradient-to-b from-arka-navy to-[#061120]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold text-white"
          >
            Ready to Transform Your Authorization Process?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/demo">
              <Button
                variant="primary"
                size="lg"
                className="min-w-[200px] shadow-lg shadow-arka-blue/30"
              >
                Launch Interactive Demo
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 min-w-[220px]"
            >
              Schedule Executive Briefing
            </Button>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
