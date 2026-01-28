'use client';

import { Shield, Info } from 'lucide-react';
import { useState } from 'react';
import { FDA_COMPLIANCE } from '@/lib/constants/aiie-constants';

interface FDABannerProps {
  variant?: 'full' | 'compact';
}

export function FDABanner({ variant = 'full' }: FDABannerProps) {
  const [showModal, setShowModal] = useState(false);

  if (variant === 'compact') {
    return (
      <div className="bg-slate-800 text-slate-300 py-1.5 px-4 text-xs flex items-center justify-center gap-2">
        <Shield className="h-3 w-3 text-cyan-400" />
        <span>FDA Non-Device CDS | § 3060 Compliant</span>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
          <Shield className="h-4 w-4" />
          <span className="font-medium">{FDA_COMPLIANCE.bannerText}</span>
          <button
            onClick={() => setShowModal(true)}
            className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="View FDA compliance details"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* FDA Compliance Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fda-modal-title"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 id="fda-modal-title" className="text-xl font-bold text-gray-900">FDA Regulatory Classification</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <p className="font-semibold text-cyan-800">Non-Device Clinical Decision Support</p>
                  <p className="text-sm text-cyan-700 mt-1">
                    21st Century Cures Act, Section 3060 | FD&C Act § 520(o)(1)(E)
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Compliance Criteria</h3>
                  {Object.values(FDA_COMPLIANCE.criteria).map((criterion, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{criterion.title}</p>
                        <p className="text-sm text-gray-600">{criterion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    AIIE v2.0 | RAND/UCLA + GRADE Methodology | Evidence: January 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
