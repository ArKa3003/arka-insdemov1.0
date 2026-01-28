'use client';

import { AIIEPrediction } from '@/types/insurance';
import { AIIE_FRAMEWORK } from '@/lib/constants/aiie-constants';

interface RiskScoreDisplayProps {
  prediction: AIIEPrediction;
}

export function RiskScoreDisplay({ prediction }: RiskScoreDisplayProps) {
  const { denialRisk } = AIIE_FRAMEWORK.scoring;

  // Determine which category the score falls into
  const getScoreCategory = (score: number) => {
    if (score >= 7) return denialRisk.high;
    if (score >= 4) return denialRisk.medium;
    return denialRisk.low;
  };

  const category = getScoreCategory(prediction.denialRiskScore);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Main Score */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-slate-400 mb-1">AIIE Denial Risk Score</p>
          <div className="flex items-baseline gap-2">
            <span
              className="text-5xl font-bold"
              style={{ color: category.color }}
            >
              {prediction.denialRiskScore.toFixed(1)}
            </span>
            <span className="text-slate-500 text-xl">/ 9</span>
          </div>
        </div>

        {/* Category Badge */}
        <div
          className="px-4 py-2 rounded-lg text-center"
          style={{
            backgroundColor: category.color + '20',
            borderColor: category.color,
            borderWidth: 1,
          }}
        >
          <p className="text-xs text-slate-400 mb-1">Risk Level</p>
          <p className="font-bold" style={{ color: category.color }}>
            {category.label}
          </p>
        </div>
      </div>

      {/* Recommended Action */}
      <div className="bg-slate-900 rounded-lg p-4 mb-4">
        <p className="text-xs text-slate-500 mb-1">RECOMMENDED ACTION</p>
        <p className="text-lg font-semibold text-white">
          {prediction.recommendedAction.replace(/_/g, ' ')}
        </p>
      </div>

      {/* Appeal Overturn Probability */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">Appeal Overturn Probability:</span>
        <span className="font-bold text-amber-400">
          {prediction.appealOverturnProbability.toFixed(0)}%
        </span>
      </div>

      {/* Confidence */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-slate-400">Prediction Confidence:</span>
        <span className="font-medium text-slate-300">
          {prediction.confidenceScore}%
        </span>
      </div>

      {/* Processing Time */}
      <p className="text-xs text-slate-600 mt-4 text-right">
        Processed in {prediction.processingTime}ms
      </p>
    </div>
  );
}
