export interface PARequest {
  id: string;
  memberId: string;
  requestDate: string;
  modality: 'MRI' | 'CT' | 'PET' | 'Nuclear Medicine' | 'Ultrasound';
  bodyRegion: string;
  primaryDiagnosis: {
    icd10: string;
    description: string;
  };
  clinicalIndication: string;
  orderingProvider: {
    npi: string;
    specialty: string;
    historicalApprovalRate?: number;
  };
  urgency: 'routine' | 'urgent' | 'emergent';
  priorImaging?: PriorImaging[];
  redFlags?: string[];
  conservativeTreatment?: string[];
}

export interface PriorImaging {
  modality: string;
  date: string;
  findings: string;
  relevance: 'directly_related' | 'possibly_related' | 'unrelated';
}

export interface AIIEPrediction {
  denialRiskScore: number; // 1-9 (higher = safer to approve)
  riskCategory: 'high_risk' | 'medium_risk' | 'low_risk';
  recommendedAction: 'AUTO_APPROVE' | 'CLINICAL_REVIEW' | 'LIKELY_APPROVE';
  appealOverturnProbability: number; // 0-100%
  confidenceScore: number;
  factors: ScoringFactor[];
  evidenceBasis: EvidenceCitation[];
  processingTime: number; // ms
}

export interface ScoringFactor {
  id: string;
  name: string;
  contribution: number; // -1 to +1 (SHAP-style)
  value: string;
  explanation: string;
  evidenceCitation?: string;
}

export interface EvidenceCitation {
  source: string;
  year: number;
  finding: string;
  pmid?: string;
}
