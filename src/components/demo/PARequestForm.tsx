'use client';

import { useState } from 'react';
import { PARequest } from '@/types/insurance';
import { DEMO_SCENARIOS } from '@/lib/aiie/demo-scenarios';

interface PARequestFormProps {
  onSubmit: (request: PARequest) => void;
}

export function PARequestForm({ onSubmit }: PARequestFormProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('');

  const handleScenarioSelect = (scenarioId: string, scenario: PARequest) => {
    setSelectedScenario(scenarioId);
    onSubmit(scenario);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-white mb-4">
        Select Demo Scenario
      </h2>

      <div className="grid gap-4">
        {Object.entries(DEMO_SCENARIOS).map(([id, scenario]) => (
          <button
            key={id}
            type="button"
            onClick={() => handleScenarioSelect(id, scenario)}
            className={`p-4 rounded-lg border text-left transition-all ${
              selectedScenario === id
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-slate-600 hover:border-slate-500 bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">
                {scenario.modality} - {scenario.bodyRegion}
              </span>
              <span className="text-xs text-slate-400">{scenario.urgency}</span>
            </div>
            <p className="text-sm text-slate-400">
              {scenario.primaryDiagnosis.description}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              ICD-10: {scenario.primaryDiagnosis.icd10}
            </p>
            {scenario.redFlags && scenario.redFlags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {scenario.redFlags.map((flag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
