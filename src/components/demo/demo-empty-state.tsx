"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { UserPlus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface DemoEmptyStateProps {
  title?: string;
  description?: string;
  onGoToStep1: () => void;
  className?: string;
}

const DEFAULT_TITLE = "No patient selected";
const DEFAULT_DESCRIPTION =
  "A patient and order are required for this step. Go to Step 1 to select a scenario and patient.";

export function DemoEmptyState({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  onGoToStep1,
  className,
}: DemoEmptyStateProps) {
  return (
    <motion.div
      className={cn("w-full max-w-md mx-auto", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card variant="default" className="border-2 border-dashed border-slate-200">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <UserPlus className="h-7 w-7 text-slate-500" />
          </div>
          <h3 className="font-display text-lg font-semibold text-arka-navy mb-2">
            {title}
          </h3>
          <p className="text-slate-600 text-sm mb-5">{description}</p>
          <Button
            variant="primary"
            size="md"
            onClick={onGoToStep1}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Go to Step 1 — Patient Selection
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default DemoEmptyState;
