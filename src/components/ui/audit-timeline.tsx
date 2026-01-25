"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Bot, User, Server } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { AuditEntry, AuditActor } from "@/hooks/use-audit-trail";

export interface AuditTimelineProps {
  entries: AuditEntry[];
  expandable?: boolean;
  highlightAI?: boolean;
  className?: string;
}

const actorConfig: Record<
  AuditActor,
  { icon: React.ElementType; bg: string; border: string; label: string }
> = {
  system: {
    icon: Server,
    bg: "bg-slate-100",
    border: "border-slate-300",
    label: "System",
  },
  ai: {
    icon: Bot,
    bg: "bg-violet-100",
    border: "border-violet-400",
    label: "AI",
  },
  human: {
    icon: User,
    bg: "bg-sky-100",
    border: "border-sky-400",
    label: "Human",
  },
};

function AuditNode({
  entry,
  expandable,
  highlightAI,
}: {
  entry: AuditEntry;
  expandable: boolean;
  highlightAI: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const config = actorConfig[entry.actor];
  const Icon = config.icon;
  const isAI = entry.actor === "ai";
  const showHighlight = highlightAI && isAI;

  const detail = (
    <div className="mt-2 space-y-1 rounded-md bg-slate-50 p-2 text-xs">
      {entry.actorDetails && (
        <div>
          <span className="font-medium text-slate-600">Actor:</span>{" "}
          {entry.actorDetails.name ?? config.label}
          {entry.actorDetails.credentials && ` (${entry.actorDetails.credentials})`}
        </div>
      )}
      {entry.aiInvolvement && (
        <div className="space-y-0.5">
          {entry.aiInvolvement.model && <div>Model: {entry.aiInvolvement.model}</div>}
          {entry.aiInvolvement.confidence != null && (
            <div>Confidence: {Math.round(entry.aiInvolvement.confidence * 100)}%</div>
          )}
          {entry.aiInvolvement.recommendation && <div>{entry.aiInvolvement.recommendation}</div>}
        </div>
      )}
      {Object.keys(entry.data).length > 0 && (
        <pre className="max-h-32 overflow-auto rounded border border-slate-200 bg-white p-1.5 text-[10px]">
          {JSON.stringify(entry.data, null, 2)}
        </pre>
      )}
    </div>
  );

  const hasDetail =
    (entry.actorDetails && Object.keys(entry.actorDetails).length > 0) ||
    entry.aiInvolvement ||
    (entry.data && Object.keys(entry.data).filter((k) => !k.startsWith("_")).length > 0);

  return (
    <motion.li
      className="relative pl-6"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* vertical line to next */}
      <div
        className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-slate-200"
        aria-hidden
      />

      {/* node dot */}
      <div
        className={cn(
          "absolute left-0 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2",
          config.bg,
          config.border,
          showHighlight && "ring-2 ring-violet-400 ring-offset-2"
        )}
      >
        <Icon size={10} className="text-slate-700" />
      </div>

      <div
        className={cn(
          "rounded-lg border border-slate-200 bg-white pb-1 pr-2",
          showHighlight && "border-violet-300 bg-violet-50/30"
        )}
      >
        <div
          className={cn(
            "flex items-start gap-2 py-2 pl-2",
            expandable && hasDetail && "cursor-pointer",
            "rounded-t-lg"
          )}
          onClick={() => expandable && hasDetail && setExpanded((e) => !e)}
        >
          {expandable && hasDetail && (
            <span className="mt-0.5 text-slate-400">
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-medium text-slate-800">{entry.action}</span>
              <span className="text-[10px] uppercase text-slate-400">{config.label}</span>
              {isAI && highlightAI && (
                <span className="rounded bg-violet-200 px-1.5 py-0.5 text-[10px] font-medium text-violet-800">
                  AI
                </span>
              )}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              {format(entry.timestamp, "MMM d, yyyy HH:mm:ss")}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && hasDetail && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pl-2"
            >
              {detail}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}

export function AuditTimeline({
  entries,
  expandable = true,
  highlightAI = true,
  className,
}: AuditTimelineProps) {
  return (
    <ul className={cn("audit-timeline relative list-none space-y-0", className)}>
      {entries.map((entry, i) => (
        <AuditNode
          key={`${entry.timestamp.getTime()}-${i}-${entry.action}`}
          entry={entry}
          expandable={expandable}
          highlightAI={highlightAI}
        />
      ))}
    </ul>
  );
}
