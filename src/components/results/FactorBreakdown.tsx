'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { ScoringFactor } from '@/types/insurance';

interface FactorBreakdownProps {
  factors: ScoringFactor[];
  baselineScore?: number;
}

export function FactorBreakdown({
  factors,
  baselineScore = 5.0,
}: FactorBreakdownProps) {
  const [expanded, setExpanded] = useState(true);
  const [showCitations, setShowCitations] = useState(false);

  const maxAbsContribution =
    factors.length > 0
      ? Math.max(
          0.001,
          ...factors.map((f) => Math.abs(f.contribution))
        )
      : 1;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">AIIE Scoring Factors</span>
          <span className="text-xs text-slate-500">(SHAP-style explanation)</span>
        </div>
        {expanded ? (
          <ChevronUp className="text-slate-400" />
        ) : (
          <ChevronDown className="text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="p-6 space-y-4">
          {/* Baseline indicator */}
          <div className="flex items-center justify-between text-sm text-slate-400 pb-4 border-b border-slate-700">
            <span>Baseline Score:</span>
            <span className="font-mono">{baselineScore.toFixed(1)}</span>
          </div>

          {/* Factor visualization */}
          <div className="space-y-3">
            {factors.map((factor, idx) => (
              <div key={factor.id ?? idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-medium">
                    {factor.name}
                  </span>
                  <span
                    className={`font-mono text-sm ${factor.contribution >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {factor.contribution >= 0 ? '+' : ''}
                    {(factor.contribution * 4).toFixed(2)}
                  </span>
                </div>

                {/* SHAP-style bar */}
                <div className="relative h-6 bg-slate-900 rounded flex items-center">
                  {/* Center line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600" />

                  {/* Contribution bar */}
                  <div
                    className={`absolute h-4 rounded ${factor.contribution >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{
                      width: `${(Math.abs(factor.contribution) / maxAbsContribution) * 45}%`,
                      left: factor.contribution >= 0 ? '50%' : 'auto',
                      right: factor.contribution < 0 ? '50%' : 'auto',
                    }}
                  />
                </div>

                {/* Value and explanation */}
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs text-slate-400">{factor.explanation}</p>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {factor.value}
                  </span>
                </div>

                {/* Citation */}
                {showCitations && factor.evidenceCitation && (
                  <p className="text-xs text-cyan-400 flex items-center gap-1 mt-1">
                    <BookOpen className="h-3 w-3" />
                    {factor.evidenceCitation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Toggle citations */}
          <button
            type="button"
            onClick={() => setShowCitations(!showCitations)}
            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <BookOpen className="h-4 w-4" />
            {showCitations ? 'Hide' : 'Show'} evidence citations
          </button>

          {/* Methodology note */}
          <p className="text-xs text-slate-600 pt-4 border-t border-slate-700">
            <strong>Methodology:</strong> Scores derived from peer-reviewed
            medical literature using RAND/UCLA appropriateness methodology. AIIE
            is proprietary technology - not ACR criteria.
          </p>
        </div>
      )}
    </div>
  );
}
