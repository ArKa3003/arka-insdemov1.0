'use client';

import { useState } from 'react';
import { FDABanner } from '@/components/fda/FDABanner';
import { PARequestForm } from '@/components/demo/PARequestForm';
import { RiskScoreDisplay } from '@/components/results/RiskScoreDisplay';
import { FactorBreakdown } from '@/components/results/FactorBreakdown';
import { RecommendationDisclaimer } from '@/components/fda/RecommendationDisclaimer';
import { calculateDenialRisk } from '@/lib/aiie/scoring-engine';
import { PARequest, AIIEPrediction } from '@/types/insurance';

export default function AIIEDemoPage() {
  const [prediction, setPrediction] = useState<AIIEPrediction | null>(null);

  const handleSubmit = (request: PARequest) => {
    const result = calculateDenialRisk(request);
    setPrediction(result);
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <FDABanner />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Request Form */}
          <div>
            <PARequestForm onSubmit={handleSubmit} />
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            {prediction ? (
              <>
                <RiskScoreDisplay prediction={prediction} />
                <FactorBreakdown factors={prediction.factors} />
                <RecommendationDisclaimer className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-700" />
              </>
            ) : (
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
                <p className="text-slate-400">
                  Select a demo scenario to see AIIE predictions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
