// ARKA Imaging Intelligence Engine - Insurance Build Constants

export const AIIE_FRAMEWORK = {
  name: "ARKA Imaging Intelligence Engine",
  acronym: "AIIE",
  version: "2.0.0",
  buildType: "INSURANCE",
  tagline: "Predict Denial Failures Before They Happen",
  
  // Insurance-specific value props
  valueProps: {
    appealReduction: { before: 81.7, after: 15.3, unit: '%' },
    complianceRate: { value: 99.2, unit: '%', metric: '72hr Compliance' },
    roi: { value: 4.2, unit: 'x', description: 'ROI for RBM Partners' }
  },
  
  // Scoring methodology
  scoring: {
    scale: { min: 1, max: 9 },
    denialRisk: {
      high: { range: [7, 9], color: '#22c55e', label: 'Low Denial Risk', action: 'AUTO-APPROVE' },
      medium: { range: [4, 6], color: '#f59e0b', label: 'Medium Risk', action: 'CLINICAL REVIEW' },
      low: { range: [1, 3], color: '#ef4444', label: 'High Denial Risk', action: 'LIKELY APPROVAL NEEDED' }
    }
  },
  
  // Evidence update info
  evidenceUpdate: "January 2026",
  methodologyRef: "RAND/UCLA + GRADE v2024"
};

export const FDA_COMPLIANCE = {
  status: "NON-DEVICE CDS",
  regulation: "21st Century Cures Act, Section 3060",
  codeRef: "FD&C Act § 520(o)(1)(E)",
  guidanceDate: "January 2026",
  
  bannerText: "FDA Non-Device CDS | 21st Century Cures Act § 3060 | For Authorized RBM Use Only",
  
  fullDisclaimer: `REGULATORY NOTICE: ARKA Imaging Intelligence Engine (AIIE) qualifies as Non-Device Clinical Decision Support software under FDA guidance pursuant to the 21st Century Cures Act, Section 3060 (FD&C Act § 520(o)(1)(E), January 2026 guidance).

This software meets ALL FOUR mandatory criteria for non-device CDS:

CRITERION 1 - DATA INPUT: This software does NOT acquire, process, or analyze medical images, diagnostic device signals, or signal patterns. It analyzes structured clinical information and prior authorization data only.

CRITERION 2 - MEDICAL INFORMATION: This software displays and analyzes medical information from well-understood, independently verified sources including peer-reviewed literature, clinical practice guidelines, and evidence-based methodologies.

CRITERION 3 - RECOMMENDATIONS: This software provides denial risk predictions to authorized utilization management professionals. It does NOT make autonomous approval/denial decisions.

CRITERION 4 - INDEPENDENT REVIEW: This software enables reviewers to independently assess the basis for all predictions through transparent scoring factors, evidence citations, and SHAP-based feature contributions.

This tool SUPPORTS but does NOT replace clinical and utilization management judgment.`,

  criteria: {
    criterion1: {
      title: "Data Input Criterion",
      status: "COMPLIANT",
      description: "Analyzes PA requests and clinical indications, NOT medical images"
    },
    criterion2: {
      title: "Medical Information Criterion",
      status: "COMPLIANT",
      description: "Uses peer-reviewed literature and validated clinical guidelines"
    },
    criterion3: {
      title: "Recommendations Criterion",
      status: "COMPLIANT",
      description: "Provides risk predictions to UM professionals, not autonomous decisions"
    },
    criterion4: {
      title: "Independent Review Criterion",
      status: "COMPLIANT",
      description: "Full algorithm transparency with SHAP explanations and evidence citations"
    }
  }
};

// Insurance-specific denial risk factors
export const DENIAL_RISK_FACTORS = {
  clinicalIndicators: [
    { id: 'red_flags', name: 'Clinical Red Flags Present', weight: 0.25, direction: 'reduces_denial_risk' },
    { id: 'prior_imaging', name: 'Appropriate Prior Imaging Pathway', weight: 0.20, direction: 'reduces_denial_risk' },
    { id: 'conservative_tx', name: 'Conservative Treatment Documented', weight: 0.15, direction: 'reduces_denial_risk' },
    { id: 'symptom_duration', name: 'Symptom Duration Meets Guidelines', weight: 0.15, direction: 'reduces_denial_risk' },
    { id: 'specialty_referral', name: 'Specialist Referral Present', weight: 0.10, direction: 'reduces_denial_risk' }
  ],
  documentationQuality: [
    { id: 'icd_specificity', name: 'ICD-10 Code Specificity', weight: 0.15, direction: 'reduces_denial_risk' },
    { id: 'clinical_notes', name: 'Clinical Notes Quality', weight: 0.10, direction: 'reduces_denial_risk' },
    { id: 'medical_necessity', name: 'Medical Necessity Statement', weight: 0.10, direction: 'reduces_denial_risk' }
  ],
  historicalPatterns: [
    { id: 'provider_history', name: 'Ordering Provider Approval Rate', weight: 0.10, direction: 'contextual' },
    { id: 'facility_patterns', name: 'Facility Utilization Patterns', weight: 0.05, direction: 'contextual' }
  ]
};

// Imaging modalities with baseline approval rates
export const MODALITY_BASELINES = {
  MRI: { baseApprovalRate: 0.78, avgAppealOverturn: 0.82, commonIndications: ['neurological', 'musculoskeletal', 'oncology'] },
  CT: { baseApprovalRate: 0.85, avgAppealOverturn: 0.79, commonIndications: ['trauma', 'pulmonary', 'abdominal'] },
  PET: { baseApprovalRate: 0.65, avgAppealOverturn: 0.88, commonIndications: ['oncology', 'cardiac', 'neurological'] },
  'Nuclear Medicine': { baseApprovalRate: 0.72, avgAppealOverturn: 0.84, commonIndications: ['cardiac', 'oncology', 'skeletal'] },
  Ultrasound: { baseApprovalRate: 0.88, avgAppealOverturn: 0.76, commonIndications: ['obstetric', 'vascular', 'abdominal'] },
};
