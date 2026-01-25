/**
 * ARKA Insurance Demo - Comprehensive Mock Data
 * Realistic healthcare prior authorization scenarios
 */

import type {
  Patient,
  InsurancePlan,
  ImagingOrder,
  Provider,
  PreSubmissionAnalysis,
  DenialPrediction,
  RBMCriteriaMatch,
  GeneratedJustification,
  GeneratedAppeal,
  DashboardMetrics,
  MonthlyMetrics,
  DemoScenario,
  MedicalHistoryItem,
  CriteriaItem,
  ConservativeTreatment,
} from "@/types";

// ============================================================================
// INSURANCE PLANS
// ============================================================================

export const insurancePlans: InsurancePlan[] = [
  {
    id: "INS-001",
    name: "BlueCross BlueShield PPO",
    type: "PPO",
    rbmVendor: "eviCore",
    priorAuthRequired: true,
    groupNumber: "BCBS-PPO-2024",
    effectiveDate: "2024-01-01",
  },
  {
    id: "INS-002",
    name: "Aetna HMO",
    type: "HMO",
    rbmVendor: "AIM",
    priorAuthRequired: true,
    groupNumber: "AETNA-HMO-500",
    effectiveDate: "2024-01-01",
  },
  {
    id: "INS-003",
    name: "UnitedHealthcare Choice Plus",
    type: "Commercial",
    rbmVendor: "Carelon",
    priorAuthRequired: true,
    groupNumber: "UHC-COMM-750",
    effectiveDate: "2024-01-01",
  },
  {
    id: "INS-004",
    name: "Medicare Advantage - Humana Gold",
    type: "Medicare Advantage",
    rbmVendor: "Internal",
    priorAuthRequired: true,
    groupNumber: "H5216-042",
    effectiveDate: "2024-01-01",
  },
  {
    id: "INS-005",
    name: "Humana Commercial",
    type: "Commercial",
    rbmVendor: "Cohere",
    priorAuthRequired: true,
    groupNumber: "HUM-COMM-300",
    effectiveDate: "2024-01-01",
  },
];

// ============================================================================
// PROVIDERS
// ============================================================================

export const providers: Provider[] = [
  {
    id: "PROV-001",
    name: "Dr. Sarah Mitchell",
    npi: "1234567890",
    specialty: "Orthopedic Surgery",
    facility: "Metro Spine & Orthopedics",
    phone: "(555) 123-4567",
    fax: "(555) 123-4568",
  },
  {
    id: "PROV-002",
    name: "Dr. James Chen",
    npi: "0987654321",
    specialty: "Neurology",
    facility: "Neuroscience Associates",
    phone: "(555) 234-5678",
    fax: "(555) 234-5679",
  },
  {
    id: "PROV-003",
    name: "Dr. Maria Rodriguez",
    npi: "1122334455",
    specialty: "Pulmonology/Oncology",
    facility: "Regional Cancer Center",
    phone: "(555) 345-6789",
    fax: "(555) 345-6790",
  },
];

// ============================================================================
// SAMPLE PATIENTS
// ============================================================================

// Patient A: Good candidate for MRI approval
const patientAMedicalHistory: MedicalHistoryItem[] = [
  {
    id: "MH-A1",
    condition: "Chronic Low Back Pain",
    icdCode: "M54.5",
    diagnosedDate: "2022-03-15",
    status: "chronic",
    treatingProvider: "Dr. Sarah Mitchell",
    notes: "Ongoing management with conservative treatment",
  },
  {
    id: "MH-A2",
    condition: "Lumbar Disc Herniation L4-L5",
    icdCode: "M51.16",
    diagnosedDate: "2023-06-20",
    status: "active",
    treatingProvider: "Dr. Sarah Mitchell",
    notes: "Confirmed on previous imaging, progressing despite treatment",
  },
  {
    id: "MH-A3",
    condition: "Lumbar Radiculopathy",
    icdCode: "M54.16",
    diagnosedDate: "2023-08-10",
    status: "active",
    treatingProvider: "Dr. Sarah Mitchell",
    notes: "Left L5 distribution, positive straight leg raise",
  },
  {
    id: "MH-A4",
    condition: "Hypertension",
    icdCode: "I10",
    diagnosedDate: "2019-05-01",
    status: "chronic",
    notes: "Well controlled on medication",
  },
];

// Patient B: Likely denial case
const patientBMedicalHistory: MedicalHistoryItem[] = [
  {
    id: "MH-B1",
    condition: "Tension-type Headache",
    icdCode: "G44.209",
    diagnosedDate: "2024-11-01",
    status: "active",
    treatingProvider: "Dr. James Chen",
    notes: "New onset, 3 weeks duration",
  },
  {
    id: "MH-B2",
    condition: "Anxiety Disorder",
    icdCode: "F41.9",
    diagnosedDate: "2023-02-15",
    status: "active",
    notes: "Managed with counseling",
  },
];

// Patient C: PET-CT staging case
const patientCMedicalHistory: MedicalHistoryItem[] = [
  {
    id: "MH-C1",
    condition: "Lung Nodule - Suspicious",
    icdCode: "R91.1",
    diagnosedDate: "2024-12-01",
    status: "active",
    treatingProvider: "Dr. Maria Rodriguez",
    notes: "2.3cm RUL nodule on chest X-ray, spiculated margins",
  },
  {
    id: "MH-C2",
    condition: "Suspected Lung Malignancy",
    icdCode: "C34.90",
    diagnosedDate: "2024-12-10",
    status: "active",
    treatingProvider: "Dr. Maria Rodriguez",
    notes: "High suspicion based on imaging characteristics and risk factors",
  },
  {
    id: "MH-C3",
    condition: "COPD",
    icdCode: "J44.9",
    diagnosedDate: "2018-04-20",
    status: "chronic",
    notes: "40 pack-year smoking history, quit 2020",
  },
  {
    id: "MH-C4",
    condition: "Type 2 Diabetes",
    icdCode: "E11.9",
    diagnosedDate: "2015-08-10",
    status: "chronic",
    notes: "Well controlled, A1c 6.8",
  },
];

export const patients: Patient[] = [
  {
    id: "PAT-001",
    firstName: "Robert",
    lastName: "Thompson",
    dateOfBirth: "1966-04-12",
    gender: "male",
    memberId: "BCBS-558742190",
    insurancePlan: insurancePlans[0], // BCBS PPO
    medicalHistory: patientAMedicalHistory,
    contactInfo: {
      phone: "(555) 111-2222",
      email: "r.thompson@email.com",
      address: {
        street: "1234 Oak Street",
        city: "Springfield",
        state: "IL",
        zipCode: "62701",
      },
    },
  },
  {
    id: "PAT-002",
    firstName: "Jennifer",
    lastName: "Martinez",
    dateOfBirth: "1989-08-23",
    gender: "female",
    memberId: "AETNA-334521876",
    insurancePlan: insurancePlans[1], // Aetna HMO
    medicalHistory: patientBMedicalHistory,
    contactInfo: {
      phone: "(555) 333-4444",
      email: "j.martinez@email.com",
      address: {
        street: "567 Maple Avenue",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
      },
    },
  },
  {
    id: "PAT-003",
    firstName: "William",
    lastName: "Anderson",
    dateOfBirth: "1957-11-30",
    gender: "male",
    memberId: "H5216-887432156",
    insurancePlan: insurancePlans[3], // Medicare Advantage
    medicalHistory: patientCMedicalHistory,
    contactInfo: {
      phone: "(555) 555-6666",
      email: "w.anderson@email.com",
      address: {
        street: "890 Pine Road",
        city: "Naperville",
        state: "IL",
        zipCode: "60540",
      },
    },
  },
];

// ============================================================================
// CONSERVATIVE TREATMENTS
// ============================================================================

const patientAConservativeTreatments: ConservativeTreatment[] = [
  {
    type: "Physical Therapy",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    duration: "12 weeks",
    outcome: "no-change",
    provider: "ProHealth Physical Therapy",
    notes: "Completed 24 sessions, minimal improvement in symptoms",
  },
  {
    type: "NSAIDs (Meloxicam 15mg)",
    startDate: "2023-09-01",
    endDate: "2024-06-01",
    duration: "9 months",
    outcome: "no-change",
    provider: "Dr. Sarah Mitchell",
    notes: "Daily use with gastric protection, inadequate pain relief",
  },
  {
    type: "Epidural Steroid Injection",
    startDate: "2024-05-20",
    duration: "Single injection",
    outcome: "no-change",
    provider: "Metro Pain Management",
    notes: "L4-L5 transforaminal approach, provided 3 weeks relief only",
  },
  {
    type: "Chiropractic Care",
    startDate: "2024-02-01",
    endDate: "2024-03-15",
    duration: "6 weeks",
    outcome: "worsened",
    provider: "Spine Wellness Center",
    notes: "Discontinued due to symptom exacerbation",
  },
];

// ============================================================================
// IMAGING ORDERS
// ============================================================================

export const imagingOrders: ImagingOrder[] = [
  // Order for Patient A - Lumbar MRI (good candidate)
  {
    id: "ORD-001",
    patientId: "PAT-001",
    orderingProvider: providers[0],
    imagingType: "MRI",
    cptCode: "72148",
    cptDescription: "MRI Lumbar Spine without Contrast",
    bodyPart: "Lumbar Spine",
    laterality: "n/a",
    contrast: false,
    clinicalIndication: "Chronic low back pain with left lower extremity radiculopathy. Failed 12 weeks of physical therapy, 9 months of NSAIDs, and one epidural steroid injection. Progressive neurological symptoms with positive straight leg raise. Need to evaluate for surgical candidacy.",
    icdCodes: ["M54.5", "M51.16", "M54.16"],
    icdDescriptions: [
      "Low back pain",
      "Intervertebral disc degeneration, lumbar region",
      "Radiculopathy, lumbar region",
    ],
    urgency: "routine",
    clinicalNotes: `58-year-old male with 18-month history of chronic low back pain radiating to left leg. 
    
Physical Exam Findings:
- Decreased sensation L5 dermatome left
- Positive straight leg raise at 45 degrees left
- Decreased ankle reflex left
- Antalgic gait

Failed Conservative Treatment:
- Physical therapy x 12 weeks (24 sessions)
- NSAIDs (Meloxicam 15mg daily) x 9 months
- Epidural steroid injection x 1 (temporary relief only)
- Chiropractic care x 6 weeks (discontinued due to worsening)

Patient reports 7/10 pain affecting daily activities and sleep. Unable to work full duties. Considering surgical evaluation if anatomic correlation confirmed.`,
    status: "analyzing",
    createdAt: "2024-12-15T09:30:00Z",
    priorImagingDates: ["2023-06-20"],
    conservativeTreatments: patientAConservativeTreatments,
  },

  // Order for Patient B - Brain MRI (likely denial)
  {
    id: "ORD-002",
    patientId: "PAT-002",
    orderingProvider: providers[1],
    imagingType: "MRI",
    cptCode: "70553",
    cptDescription: "MRI Brain with and without Contrast",
    bodyPart: "Brain",
    laterality: "n/a",
    contrast: true,
    clinicalIndication: "New onset headaches for evaluation",
    icdCodes: ["G44.209"],
    icdDescriptions: ["Tension-type headache, unspecified, not intractable"],
    urgency: "routine",
    clinicalNotes: `35-year-old female with new onset headaches x 3 weeks. 

Headache characteristics: bilateral, pressure-like, mild to moderate intensity, no photophobia or phonophobia, no nausea/vomiting.

Neurological exam: Normal
- No papilledema
- Cranial nerves II-XII intact
- Motor strength 5/5 all extremities
- Sensation intact
- Reflexes 2+ symmetric

No red flag symptoms identified.`,
    status: "analyzing",
    createdAt: "2024-12-16T14:15:00Z",
    conservativeTreatments: [],
  },

  // Order for Patient C - PET-CT (staging case)
  {
    id: "ORD-003",
    patientId: "PAT-003",
    orderingProvider: providers[2],
    imagingType: "PET-CT",
    cptCode: "78815",
    cptDescription: "PET-CT Skull Base to Mid-Thigh",
    bodyPart: "Whole Body",
    laterality: "n/a",
    contrast: false,
    clinicalIndication: "Staging for suspected primary lung malignancy. 2.3cm spiculated RUL nodule identified on chest X-ray. CT chest confirms suspicious characteristics. PET-CT needed for staging prior to tissue diagnosis and treatment planning.",
    icdCodes: ["C34.90", "R91.1"],
    icdDescriptions: [
      "Malignant neoplasm of unspecified part of bronchus or lung",
      "Solitary pulmonary nodule",
    ],
    urgency: "urgent",
    clinicalNotes: `67-year-old male with 40 pack-year smoking history (quit 2020) presenting with incidentally discovered lung nodule.

Imaging History:
- Chest X-ray (12/1/24): 2.3cm RUL nodule, spiculated
- CT Chest (12/8/24): Confirms 2.3cm spiculated nodule RUL, no mediastinal lymphadenopathy on CT

Risk Assessment:
- High risk for malignancy based on:
  - Size >2cm
  - Spiculated margins
  - Upper lobe location
  - Significant smoking history
  - Age >65

Biopsy scheduled for 12/20/24. PET-CT needed for staging to guide surgical vs. systemic therapy approach.

No symptoms of metastatic disease. ECOG performance status 1.`,
    status: "analyzing",
    createdAt: "2024-12-14T11:00:00Z",
    priorImagingDates: ["2024-12-01", "2024-12-08"],
  },
];

// ============================================================================
// PRE-SUBMISSION ANALYSIS
// ============================================================================

export const preSubmissionAnalyses: PreSubmissionAnalysis[] = [
  // Analysis for Patient A - High score, low risk
  {
    orderId: "ORD-001",
    timestamp: "2024-12-15T09:35:00Z",
    documentationScore: 92,
    gaps: [
      {
        id: "GAP-001-1",
        category: "diagnostic",
        severity: "minor",
        description: "Previous imaging report not attached",
        requiredFor: ["RAD-MSK-001.4"],
        suggestedAction: "Attach the June 2023 lumbar X-ray or MRI report to demonstrate prior imaging workup",
        autoFixAvailable: false,
      },
    ],
    suggestions: [
      "Consider adding specific pain scores (VAS/NRS) to quantify symptom severity",
      "Include functional impact assessment (Oswestry Disability Index if available)",
      "Document specific work limitations for medical necessity",
    ],
    estimatedDenialRisk: 15,
    readyForSubmission: true,
    analysisDetails: {
      clinicalIndicationScore: 95,
      historyDocumentationScore: 90,
      priorTreatmentScore: 98,
      diagnosticWorkupScore: 85,
    },
  },

  // Analysis for Patient B - Low score, high risk
  {
    orderId: "ORD-002",
    timestamp: "2024-12-16T14:20:00Z",
    documentationScore: 58,
    gaps: [
      {
        id: "GAP-002-1",
        category: "prior-treatment",
        severity: "critical",
        description: "No conservative treatment documented",
        requiredFor: ["RAD-NEURO-002.1", "RAD-NEURO-002.2"],
        suggestedAction: "Document trial of OTC analgesics, lifestyle modifications, or stress management. Most RBMs require 4-6 weeks of conservative treatment before imaging for non-emergent headaches.",
        autoFixAvailable: false,
      },
      {
        id: "GAP-002-2",
        category: "clinical",
        severity: "critical",
        description: "No red flag symptoms documented to justify urgent imaging",
        requiredFor: ["RAD-NEURO-002.3"],
        suggestedAction: "If present, document any: thunderclap onset, worst headache of life, fever, neck stiffness, focal neurological deficits, papilledema, or immunocompromised status",
        autoFixAvailable: false,
      },
      {
        id: "GAP-002-3",
        category: "symptoms",
        severity: "major",
        description: "Headache duration too short for routine imaging",
        requiredFor: ["RAD-NEURO-002.1"],
        suggestedAction: "Most guidelines require 4-12 weeks of symptoms before advanced imaging for primary headache disorders",
        autoFixAvailable: false,
      },
      {
        id: "GAP-002-4",
        category: "physical-exam",
        severity: "major",
        description: "Neurological examination is normal - reduces medical necessity",
        requiredFor: ["RAD-NEURO-002.4"],
        suggestedAction: "If any subtle findings exist, document them specifically. Normal exam with recent onset primary headache typically does not meet imaging criteria.",
        autoFixAvailable: false,
      },
    ],
    suggestions: [
      "RECOMMEND: Trial of conservative treatment for 4-6 weeks before resubmitting",
      "Consider headache diary to document pattern and triggers",
      "If symptoms persist or worsen, re-evaluate for red flags",
      "Document impact on daily function and work if significant",
      "Consider neurology consultation for headache management",
    ],
    estimatedDenialRisk: 85,
    readyForSubmission: false,
    analysisDetails: {
      clinicalIndicationScore: 45,
      historyDocumentationScore: 60,
      priorTreatmentScore: 20,
      diagnosticWorkupScore: 75,
    },
  },

  // Analysis for Patient C - Good score, medium risk
  {
    orderId: "ORD-003",
    timestamp: "2024-12-14T11:05:00Z",
    documentationScore: 85,
    gaps: [
      {
        id: "GAP-003-1",
        category: "diagnostic",
        severity: "major",
        description: "Tissue diagnosis pending - some payers require pathology before PET",
        requiredFor: ["ONC-LUNG-001.2"],
        suggestedAction: "Note that biopsy is scheduled for 12/20. Some RBMs allow PET prior to biopsy for staging purposes. Include rationale for pre-biopsy PET (surgical planning, determining if operable).",
        autoFixAvailable: false,
      },
      {
        id: "GAP-003-2",
        category: "clinical",
        severity: "minor",
        description: "Lung-RADS or Fleischner category not specified",
        requiredFor: ["ONC-LUNG-001.1"],
        suggestedAction: "Add Lung-RADS 4B classification or equivalent risk stratification",
        autoFixAvailable: true,
        fixedText: "Lung-RADS Category 4B: Suspicious nodule >15mm with spiculated margins. Fleischner high-risk category.",
      },
    ],
    suggestions: [
      "Emphasize that PET-CT is for staging to determine surgical candidacy",
      "Note that results will guide treatment approach (surgery vs. systemic therapy)",
      "Include multidisciplinary tumor board recommendation if available",
      "Document ECOG performance status for treatment planning context",
    ],
    estimatedDenialRisk: 35,
    readyForSubmission: true,
    analysisDetails: {
      clinicalIndicationScore: 90,
      historyDocumentationScore: 85,
      priorTreatmentScore: 100,
      diagnosticWorkupScore: 80,
    },
  },
];

// ============================================================================
// DENIAL PREDICTIONS
// ============================================================================

export const denialPredictions: DenialPrediction[] = [
  // Prediction for Patient A - Low risk
  {
    orderId: "ORD-001",
    timestamp: "2024-12-15T09:36:00Z",
    overallRisk: 15,
    riskLevel: "low",
    confidenceScore: 89,
    factors: [
      {
        id: "RF-001-1",
        name: "Conservative Treatment Documentation",
        impact: -25,
        weight: 0.3,
        description: "Extensive conservative treatment documented exceeds RBM requirements",
        mitigationStrategy: "N/A - This is a strength",
        isAddressable: false,
      },
      {
        id: "RF-001-2",
        name: "Clinical Indication Strength",
        impact: -20,
        weight: 0.25,
        description: "Clear radiculopathy with objective neurological findings",
        mitigationStrategy: "N/A - This is a strength",
        isAddressable: false,
      },
      {
        id: "RF-001-3",
        name: "Prior Imaging Documentation",
        impact: 10,
        weight: 0.15,
        description: "Previous imaging mentioned but report not attached",
        mitigationStrategy: "Attach prior imaging reports to submission",
        isAddressable: true,
      },
      {
        id: "RF-001-4",
        name: "Symptom Duration",
        impact: -15,
        weight: 0.2,
        description: "18-month history demonstrates chronic condition",
        mitigationStrategy: "N/A - This is a strength",
        isAddressable: false,
      },
    ],
    historicalDenialRate: 12,
    similarCasesApproved: 847,
    similarCasesDenied: 115,
    recommendations: [
      "Attach prior lumbar imaging reports",
      "Consider adding Oswestry Disability Index score",
      "Strong case - proceed with submission",
    ],
    predictedOutcome: "likely-approved",
  },

  // Prediction for Patient B - High risk
  {
    orderId: "ORD-002",
    timestamp: "2024-12-16T14:21:00Z",
    overallRisk: 85,
    riskLevel: "critical",
    confidenceScore: 92,
    factors: [
      {
        id: "RF-002-1",
        name: "Missing Conservative Treatment",
        impact: 35,
        weight: 0.35,
        description: "No documented trial of conservative management before imaging",
        mitigationStrategy: "Document trial of OTC medications, lifestyle modifications for 4-6 weeks",
        isAddressable: true,
      },
      {
        id: "RF-002-2",
        name: "Imaging Too Early",
        impact: 25,
        weight: 0.25,
        description: "3-week symptom duration insufficient for routine imaging",
        mitigationStrategy: "Wait for 4-6 weeks of symptoms or document red flags",
        isAddressable: true,
      },
      {
        id: "RF-002-3",
        name: "No Red Flag Symptoms",
        impact: 20,
        weight: 0.2,
        description: "Normal neurological exam without concerning features",
        mitigationStrategy: "Re-evaluate for red flags; if none, imaging not indicated per guidelines",
        isAddressable: false,
      },
      {
        id: "RF-002-4",
        name: "Primary Headache Characteristics",
        impact: 15,
        weight: 0.15,
        description: "Presentation consistent with tension-type headache - benign",
        mitigationStrategy: "Trial conservative management before imaging",
        isAddressable: true,
      },
    ],
    historicalDenialRate: 78,
    similarCasesApproved: 156,
    similarCasesDenied: 554,
    recommendations: [
      "STRONGLY RECOMMEND: Delay submission until conservative treatment trial completed",
      "Document headache diary for 4-6 weeks",
      "If red flags develop, resubmit immediately with documentation",
      "Consider neurology referral for headache management",
      "Current submission has very high denial probability",
    ],
    predictedOutcome: "likely-denied",
  },

  // Prediction for Patient C - Medium risk
  {
    orderId: "ORD-003",
    timestamp: "2024-12-14T11:06:00Z",
    overallRisk: 35,
    riskLevel: "medium",
    confidenceScore: 78,
    factors: [
      {
        id: "RF-003-1",
        name: "Pending Tissue Diagnosis",
        impact: 20,
        weight: 0.3,
        description: "Some payers require pathological confirmation before PET staging",
        mitigationStrategy: "Document pre-biopsy staging rationale for surgical planning",
        isAddressable: true,
      },
      {
        id: "RF-003-2",
        name: "Strong Clinical Indication",
        impact: -20,
        weight: 0.25,
        description: "High-risk nodule with appropriate prior workup",
        mitigationStrategy: "N/A - This is a strength",
        isAddressable: false,
      },
      {
        id: "RF-003-3",
        name: "Prior Imaging Completed",
        impact: -15,
        weight: 0.2,
        description: "CT chest already performed showing suspicious findings",
        mitigationStrategy: "N/A - This is a strength",
        isAddressable: false,
      },
      {
        id: "RF-003-4",
        name: "Risk Classification Missing",
        impact: 10,
        weight: 0.15,
        description: "Lung-RADS or Fleischner category not explicitly stated",
        mitigationStrategy: "Add formal risk classification to documentation",
        isAddressable: true,
      },
    ],
    historicalDenialRate: 28,
    similarCasesApproved: 423,
    similarCasesDenied: 165,
    recommendations: [
      "Add Lung-RADS 4B classification to documentation",
      "Emphasize surgical planning rationale for pre-biopsy PET",
      "Note multidisciplinary tumor board recommendation if available",
      "Good chance of approval with minor documentation enhancements",
    ],
    predictedOutcome: "likely-approved",
  },
];

// ============================================================================
// RBM CRITERIA DATA
// ============================================================================

// eviCore-style criteria for Lumbar Spine MRI
const lumbarMRICriteria: CriteriaItem[] = [
  {
    id: "RAD-MSK-001.1",
    criteriaCode: "LSP-MRI-001",
    description: "Low back pain with radiculopathy (radiating leg pain in dermatomal distribution)",
    category: "clinical-indication",
    matched: true,
    evidenceProvided: "Left lower extremity radiculopathy in L5 distribution, positive straight leg raise",
    evidenceRequired: "Documentation of radicular symptoms with dermatomal pattern",
    isRequired: true,
  },
  {
    id: "RAD-MSK-001.2",
    criteriaCode: "LSP-MRI-002",
    description: "Failed conservative treatment for minimum 6 weeks",
    category: "conservative-treatment",
    matched: true,
    evidenceProvided: "12 weeks PT, 9 months NSAIDs, ESI with temporary relief, chiropractic care",
    evidenceRequired: "Documentation of 6+ weeks of conservative management",
    isRequired: true,
  },
  {
    id: "RAD-MSK-001.3",
    criteriaCode: "LSP-MRI-003",
    description: "Objective neurological findings on examination",
    category: "physical-exam",
    matched: true,
    evidenceProvided: "Decreased L5 sensation, positive SLR at 45°, decreased ankle reflex",
    evidenceRequired: "Motor weakness, sensory changes, or reflex abnormalities",
    isRequired: false,
  },
  {
    id: "RAD-MSK-001.4",
    criteriaCode: "LSP-MRI-004",
    description: "Prior imaging within 12 months OR documented clinical progression",
    category: "prior-imaging",
    matched: true,
    evidenceProvided: "Prior imaging June 2023 referenced (report attachment recommended)",
    evidenceRequired: "Prior imaging report OR documentation of worsening symptoms",
    isRequired: false,
    alternativesMet: ["Clinical progression documented"],
  },
  {
    id: "RAD-MSK-001.5",
    criteriaCode: "LSP-MRI-005",
    description: "Symptoms duration > 4 weeks",
    category: "duration",
    matched: true,
    evidenceProvided: "18-month history documented",
    evidenceRequired: "Symptoms present for minimum 4 weeks",
    isRequired: true,
  },
  {
    id: "RAD-MSK-001.6",
    criteriaCode: "LSP-MRI-006",
    description: "No contraindications to MRI",
    category: "contraindication",
    matched: true,
    evidenceProvided: "No contraindications noted",
    evidenceRequired: "Absence of pacemaker, metallic implants, severe claustrophobia",
    isRequired: true,
  },
];

// eviCore-style criteria for Brain MRI
const brainMRICriteria: CriteriaItem[] = [
  {
    id: "RAD-NEURO-002.1",
    criteriaCode: "BRN-MRI-001",
    description: "Headache duration > 4 weeks with failed conservative treatment OR red flag symptoms",
    category: "clinical-indication",
    matched: false,
    evidenceProvided: "3-week duration, no conservative treatment documented",
    evidenceRequired: "Minimum 4-week duration with treatment failure, OR presence of red flags",
    isRequired: true,
  },
  {
    id: "RAD-NEURO-002.2",
    criteriaCode: "BRN-MRI-002",
    description: "Trial of conservative treatment (OTC analgesics, lifestyle modification)",
    category: "conservative-treatment",
    matched: false,
    evidenceProvided: null,
    evidenceRequired: "Documentation of 4-6 weeks analgesic trial or lifestyle modifications",
    isRequired: true,
  },
  {
    id: "RAD-NEURO-002.3",
    criteriaCode: "BRN-MRI-003",
    description: "Presence of red flag symptoms (thunderclap onset, worst headache, fever, neuro deficits)",
    category: "red-flags",
    matched: false,
    evidenceProvided: "No red flags documented - normal neurological examination",
    evidenceRequired: "Any red flag symptom present",
    isRequired: false,
  },
  {
    id: "RAD-NEURO-002.4",
    criteriaCode: "BRN-MRI-004",
    description: "Abnormal neurological examination",
    category: "physical-exam",
    matched: false,
    evidenceProvided: "Neurological exam documented as normal",
    evidenceRequired: "Focal neurological deficits, papilledema, or other abnormalities",
    isRequired: false,
  },
  {
    id: "RAD-NEURO-002.5",
    criteriaCode: "BRN-MRI-005",
    description: "Change in headache pattern in patient with known headache disorder",
    category: "clinical-indication",
    matched: false,
    evidenceProvided: "New onset headache, no prior headache history",
    evidenceRequired: "Documented change from baseline pattern",
    isRequired: false,
  },
  {
    id: "RAD-NEURO-002.6",
    criteriaCode: "BRN-MRI-006",
    description: "Immunocompromised status",
    category: "clinical-indication",
    matched: false,
    evidenceProvided: null,
    evidenceRequired: "HIV, transplant, chemotherapy, immunosuppressive therapy",
    isRequired: false,
  },
];

// Criteria for PET-CT Oncology
const petCTOncologyCriteria: CriteriaItem[] = [
  {
    id: "ONC-LUNG-001.1",
    criteriaCode: "PET-LUNG-001",
    description: "Suspicious pulmonary nodule/mass on CT (>8mm solid or >6mm part-solid)",
    category: "clinical-indication",
    matched: true,
    evidenceProvided: "2.3cm spiculated RUL nodule on CT chest",
    evidenceRequired: "CT imaging demonstrating suspicious lung lesion meeting size criteria",
    isRequired: true,
  },
  {
    id: "ONC-LUNG-001.2",
    criteriaCode: "PET-LUNG-002",
    description: "For staging purposes in known or suspected lung malignancy",
    category: "clinical-indication",
    matched: true,
    evidenceProvided: "Staging for suspected primary lung malignancy, surgical planning",
    evidenceRequired: "Documentation of staging intent or treatment planning",
    isRequired: true,
  },
  {
    id: "ONC-LUNG-001.3",
    criteriaCode: "PET-LUNG-003",
    description: "Prior CT chest completed",
    category: "prior-imaging",
    matched: true,
    evidenceProvided: "CT Chest 12/8/24 confirming suspicious nodule characteristics",
    evidenceRequired: "Recent CT chest imaging report",
    isRequired: true,
  },
  {
    id: "ONC-LUNG-001.4",
    criteriaCode: "PET-LUNG-004",
    description: "Patient is candidate for curative treatment",
    category: "clinical-indication",
    matched: true,
    evidenceProvided: "ECOG performance status 1, surgical evaluation planned",
    evidenceRequired: "Documentation of treatment candidacy",
    isRequired: true,
  },
  {
    id: "ONC-LUNG-001.5",
    criteriaCode: "PET-LUNG-005",
    description: "Not for screening purposes",
    category: "clinical-indication",
    matched: true,
    evidenceProvided: "Diagnostic/staging study for identified suspicious lesion",
    evidenceRequired: "Clear clinical indication beyond screening",
    isRequired: true,
  },
  {
    id: "ONC-LUNG-001.6",
    criteriaCode: "PET-LUNG-006",
    description: "Minimum 4 weeks since any prior PET-CT",
    category: "prior-imaging",
    matched: true,
    evidenceProvided: "No prior PET-CT on record",
    evidenceRequired: "4-week interval from prior PET if applicable",
    isRequired: false,
  },
];

export const rbmCriteriaMatches: RBMCriteriaMatch[] = [
  {
    orderId: "ORD-001",
    rbmVendor: "eviCore",
    guidelineVersion: "2024.1",
    guidelineDate: "2024-01-01",
    matchedCriteria: lumbarMRICriteria.filter(c => c.matched),
    unmatchedCriteria: lumbarMRICriteria.filter(c => !c.matched),
    overallMatchScore: 100,
    specificGuideline: "RAD-MSK: Lumbar Spine MRI",
    guidelineReference: "eviCore Musculoskeletal Imaging Guidelines v2024.1",
    guidelineCategory: "Musculoskeletal Radiology",
    requirementsMetCount: 6,
    requirementsTotalCount: 6,
  },
  {
    orderId: "ORD-002",
    rbmVendor: "AIM",
    guidelineVersion: "2024.2",
    guidelineDate: "2024-07-01",
    matchedCriteria: brainMRICriteria.filter(c => c.matched),
    unmatchedCriteria: brainMRICriteria.filter(c => !c.matched),
    overallMatchScore: 0,
    specificGuideline: "RAD-NEURO: Brain MRI for Headache",
    guidelineReference: "AIM Specialty Health Neuroimaging Guidelines v2024.2",
    guidelineCategory: "Neurological Radiology",
    requirementsMetCount: 0,
    requirementsTotalCount: 6,
  },
  {
    orderId: "ORD-003",
    rbmVendor: "Internal",
    guidelineVersion: "2024.3",
    guidelineDate: "2024-10-01",
    matchedCriteria: petCTOncologyCriteria.filter(c => c.matched),
    unmatchedCriteria: petCTOncologyCriteria.filter(c => !c.matched),
    overallMatchScore: 100,
    specificGuideline: "ONC-LUNG: PET-CT for Lung Cancer Staging",
    guidelineReference: "Medicare LCD L35013 - PET Scans",
    guidelineCategory: "Oncology Imaging",
    requirementsMetCount: 6,
    requirementsTotalCount: 6,
  },
];

// ============================================================================
// GENERATED JUSTIFICATIONS
// ============================================================================

export const generatedJustifications: GeneratedJustification[] = [
  {
    orderId: "ORD-001",
    narrative: `CLINICAL JUSTIFICATION FOR LUMBAR MRI WITHOUT CONTRAST

Patient: Robert Thompson, 58-year-old male
Date of Service: 12/15/2024
Ordering Provider: Dr. Sarah Mitchell, Orthopedic Surgery

CLINICAL PRESENTATION:
Mr. Thompson presents with an 18-month history of chronic low back pain with left lower extremity radiculopathy in an L5 dermatomal distribution. The patient reports progressive symptoms with pain rated 7/10, significantly impacting his daily activities, sleep quality, and ability to perform work duties.

PHYSICAL EXAMINATION FINDINGS:
- Positive straight leg raise test at 45 degrees on the left
- Decreased sensation in the L5 dermatome of the left lower extremity
- Diminished left ankle reflex
- Antalgic gait pattern observed

CONSERVATIVE TREATMENT HISTORY:
The patient has undergone extensive conservative management over the past 18 months:

1. Physical Therapy: Completed 24 sessions over 12 weeks (January - April 2024) with minimal symptomatic improvement despite good compliance

2. Pharmacological Management: 9-month trial of Meloxicam 15mg daily with gastric protection, providing inadequate pain relief

3. Interventional Treatment: L4-L5 transforaminal epidural steroid injection (May 2024) with only 3 weeks of temporary relief before symptom recurrence

4. Chiropractic Care: 6-week trial (February - March 2024) discontinued due to symptom exacerbation

MEDICAL NECESSITY:
Given the failure of comprehensive conservative management, the presence of objective neurological findings, and the significant functional impairment, MRI of the lumbar spine is medically necessary to:
1. Evaluate the anatomic correlation with clinical radiculopathy
2. Assess for surgical candidacy given failed conservative treatment
3. Rule out other structural pathology requiring intervention

This imaging request meets eviCore RAD-MSK criteria for lumbar spine MRI with documented radiculopathy, failed conservative treatment exceeding 6 weeks, and objective neurological findings on examination.`,
    keyPoints: [
      "18-month chronic low back pain with L5 radiculopathy",
      "Objective neurological findings: positive SLR, sensory deficit, reflex change",
      "Failed 12 weeks physical therapy (24 sessions)",
      "Failed 9 months NSAID therapy",
      "Failed epidural steroid injection with only temporary relief",
      "Significant functional impairment affecting work and daily activities",
      "Imaging needed for surgical evaluation",
    ],
    supportingEvidence: [
      "Physical therapy notes documenting 24 sessions with minimal improvement",
      "Medication records showing 9-month NSAID trial",
      "Pain management records for ESI with documented temporary relief",
      "Physical examination findings with objective neurological deficits",
      "Prior imaging from June 2023 showing disc herniation",
    ],
    clinicalRationale: "MRI is indicated to correlate anatomic findings with clinical radiculopathy in a patient who has exhausted conservative treatment options, demonstrating objective neurological deficits that suggest structural pathology amenable to surgical intervention.",
    wordCount: 387,
    generatedAt: "2024-12-15T09:40:00Z",
    version: 1,
    tone: "clinical",
  },
];

// ============================================================================
// GENERATED APPEALS
// ============================================================================

export const generatedAppeals: GeneratedAppeal[] = [
  {
    orderId: "ORD-002",
    appealType: "first-level",
    letterContent: `[SAMPLE APPEAL - FOR DEMONSTRATION PURPOSES]

Date: December 18, 2024
Re: Appeal of Prior Authorization Denial
Patient: Jennifer Martinez
Member ID: AETNA-334521876
Denied Service: MRI Brain with and without Contrast (CPT 70553)
Denial Date: December 17, 2024
Original Auth Request #: PA-2024-789456

Dear Medical Director,

I am writing to appeal the denial of MRI Brain imaging for my patient, Jennifer Martinez. While I understand the initial review determined the request did not meet medical necessity criteria, I respectfully request reconsideration based on the following additional clinical information.

UPDATED CLINICAL PRESENTATION:
Since the initial submission, Ms. Martinez has returned for follow-up with the following developments:
- Headache frequency has increased from intermittent to daily
- New symptom: Visual disturbances described as transient blurring
- Trial of acetaminophen 1000mg TID for 2 weeks with no relief
- Trial of ibuprofen 600mg TID for 2 weeks with no relief
- Headache diary completed showing progressive pattern

CLINICAL RATIONALE FOR IMAGING:
While the initial presentation appeared consistent with tension-type headache, the progressive nature of symptoms and emergence of visual disturbances warrants further evaluation to exclude secondary causes.

The American Headache Society guidelines recommend neuroimaging when:
1. Headaches show a change in pattern (progression noted)
2. New neurological symptoms emerge (visual disturbances)
3. Conservative treatment fails adequately

SUPPORTING MEDICAL LITERATURE:
Evans RW, et al. "Diagnostic Testing for the Evaluation of Headaches." Neurol Clin. 2019;37(4):707-725.
- Recommends imaging for progressive headache patterns

American College of Radiology ACR Appropriateness Criteria® Headache. 2019.
- Supports imaging for headaches with new features or treatment resistance

REQUEST:
Based on the updated clinical information demonstrating treatment failure and symptom progression, I respectfully request approval of MRI Brain with and without contrast to evaluate for secondary headache etiology.

I am available for peer-to-peer review at your convenience.

Respectfully,

Dr. James Chen, MD
Neurology
NPI: 0987654321
Phone: (555) 234-5678`,
    citedGuidelines: [
      "American Headache Society Guidelines for Neuroimaging in Headache",
      "ACR Appropriateness Criteria® Headache (2019)",
      "AIM Specialty Health Neuroimaging Guidelines - Exceptions for Progression",
    ],
    supportingLiterature: [
      {
        title: "Diagnostic Testing for the Evaluation of Headaches",
        authors: "Evans RW, et al.",
        journal: "Neurologic Clinics",
        year: 2019,
        doi: "10.1016/j.ncl.2019.06.003",
        relevance: "Establishes criteria for when neuroimaging is indicated in headache evaluation",
      },
      {
        title: "ACR Appropriateness Criteria® Headache",
        authors: "American College of Radiology Expert Panel",
        journal: "Journal of the American College of Radiology",
        year: 2019,
        doi: "10.1016/j.jacr.2019.05.030",
        relevance: "Provides evidence-based imaging guidelines for headache evaluation",
      },
    ],
    peerToPeerRequested: true,
    generatedAt: "2024-12-18T10:00:00Z",
    denialReason: "Does not meet medical necessity criteria - insufficient conservative treatment trial",
    denialDate: "2024-12-17",
    originalAuthNumber: "PA-2024-789456",
  },
];

// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export const monthlyMetricsData: MonthlyMetrics[] = [
  {
    month: "July",
    year: 2024,
    totalOrders: 245,
    approved: 198,
    denied: 47,
    appealed: 28,
    appealWon: 15,
    approvalRate: 80.8,
    avgDocScore: 78,
    savings: 45200,
  },
  {
    month: "August",
    year: 2024,
    totalOrders: 268,
    approved: 221,
    denied: 47,
    appealed: 32,
    appealWon: 19,
    approvalRate: 82.5,
    avgDocScore: 81,
    savings: 52800,
  },
  {
    month: "September",
    year: 2024,
    totalOrders: 289,
    approved: 245,
    denied: 44,
    appealed: 30,
    appealWon: 21,
    approvalRate: 84.8,
    avgDocScore: 83,
    savings: 61400,
  },
  {
    month: "October",
    year: 2024,
    totalOrders: 312,
    approved: 271,
    denied: 41,
    appealed: 29,
    appealWon: 22,
    approvalRate: 86.9,
    avgDocScore: 85,
    savings: 72100,
  },
  {
    month: "November",
    year: 2024,
    totalOrders: 298,
    approved: 262,
    denied: 36,
    appealed: 25,
    appealWon: 20,
    approvalRate: 87.9,
    avgDocScore: 87,
    savings: 78500,
  },
  {
    month: "December",
    year: 2024,
    totalOrders: 276,
    approved: 248,
    denied: 28,
    appealed: 19,
    appealWon: 16,
    approvalRate: 89.9,
    avgDocScore: 89,
    savings: 85200,
  },
];

export const dashboardMetrics: DashboardMetrics = {
  period: "December 2024",
  periodStart: "2024-12-01",
  periodEnd: "2024-12-31",
  totalOrders: 276,
  submittedOrders: 256,
  approvalRate: 89.9,
  denialRate: 10.1,
  pendingCount: 20,
  appealCount: 19,
  appealSuccessRate: 84.2,
  averageProcessingTime: 18.5,
  estimatedSavings: 85200,
  documentationScoreAvg: 89,
  topDenialReasons: [
    { reason: "Missing conservative treatment documentation", code: "DEN-001", count: 8, percentage: 28.6 },
    { reason: "Insufficient clinical indication", code: "DEN-002", count: 6, percentage: 21.4 },
    { reason: "Imaging too early in treatment course", code: "DEN-003", count: 5, percentage: 17.9 },
    { reason: "Missing required prior imaging", code: "DEN-004", count: 4, percentage: 14.3 },
    { reason: "Documentation gaps", code: "DEN-005", count: 3, percentage: 10.7 },
    { reason: "Non-compliance with step therapy", code: "DEN-006", count: 2, percentage: 7.1 },
  ],
  ordersByStatus: [
    { status: "approved", count: 248, percentage: 89.9 },
    { status: "denied", count: 28, percentage: 10.1 },
    { status: "pending", count: 20, percentage: 0 },
    { status: "appealing", count: 19, percentage: 0 },
  ],
  ordersByImagingType: [
    { imagingType: "MRI", count: 142, approvalRate: 91.5 },
    { imagingType: "CT", count: 78, approvalRate: 88.5 },
    { imagingType: "PET-CT", count: 28, approvalRate: 85.7 },
    { imagingType: "Ultrasound", count: 18, approvalRate: 94.4 },
    { imagingType: "Nuclear", count: 10, approvalRate: 80.0 },
  ],
  trendsComparison: {
    ordersChange: -7.4,
    approvalRateChange: 2.3,
    processingTimeChange: -12.5,
    savingsChange: 8.5,
  },
};

// ============================================================================
// DEMO SCENARIOS
// ============================================================================

export const demoScenarios: DemoScenario[] = [
  {
    id: "SCENARIO-001",
    name: "Ideal Approval Case",
    description: "Lumbar MRI for chronic radiculopathy with extensive conservative treatment documentation. Demonstrates high approval probability workflow.",
    difficulty: "easy",
    expectedOutcome: "approval",
    patient: patients[0],
    order: imagingOrders[0],
    learningObjectives: [
      "Understand key documentation elements for approval",
      "See how conservative treatment documentation impacts scoring",
      "Learn the relationship between clinical findings and RBM criteria",
    ],
  },
  {
    id: "SCENARIO-002",
    name: "High Denial Risk Case",
    description: "Brain MRI for new onset headaches without red flags or conservative treatment. Demonstrates denial prediction and gap analysis.",
    difficulty: "medium",
    expectedOutcome: "denial",
    patient: patients[1],
    order: imagingOrders[1],
    learningObjectives: [
      "Identify documentation gaps that lead to denials",
      "Understand RBM criteria for headache imaging",
      "Learn when to delay submission vs. proceed",
    ],
  },
  {
    id: "SCENARIO-003",
    name: "Oncology Staging Case",
    description: "PET-CT for suspected lung malignancy staging. Demonstrates oncology pathway with Medicare guidelines.",
    difficulty: "medium",
    expectedOutcome: "approval",
    patient: patients[2],
    order: imagingOrders[2],
    learningObjectives: [
      "Understand oncology-specific criteria",
      "Learn staging study documentation requirements",
      "See urgency pathway handling",
    ],
  },
];

// ============================================================================
// RBM: APPEAL RISK SCENARIOS
// ============================================================================

export interface AppealRiskScenarioRiskFactor {
  id: string;
  name: string;
  impact: number; // 0-100
  description: string;
  mitigation: string;
}

export interface AppealRiskScenario {
  id: string;
  name: string;
  documentationScore: number; // 0-100
  criteriaMatchScore: number; // 0-100
  acrRating: number; // 1-9
  historicalApprovalRate: number; // 0-1
  overturnProbability: number; // 0-1
  recommendation: "approve" | "deny" | "pend";
  riskFactors: AppealRiskScenarioRiskFactor[];
}

export const APPEAL_RISK_SCENARIOS: AppealRiskScenario[] = [
  {
    id: "ARS-001",
    name: "High Documentation, Low Risk",
    documentationScore: 94,
    criteriaMatchScore: 92,
    acrRating: 8,
    historicalApprovalRate: 0.91,
    overturnProbability: 0.12,
    recommendation: "approve",
    riskFactors: [
      {
        id: "RF-001-A",
        name: "Prior imaging report attachment",
        impact: 6,
        description: "Prior lumbar MRI report not attached; referenced in notes.",
        mitigation: "Attach prior imaging report to strengthen documentation.",
      },
    ],
  },
  {
    id: "ARS-002",
    name: "Documentation Appears Complete But…",
    documentationScore: 78,
    criteriaMatchScore: 71,
    acrRating: 7,
    historicalApprovalRate: 0.89,
    overturnProbability: 0.73,
    recommendation: "pend",
    riskFactors: [
      {
        id: "RF-002-A",
        name: "Conservative treatment duration ambiguity",
        impact: 28,
        description: "PT and NSAID trials documented but exact weeks/dates unclear; RBM may not count full 6 weeks.",
        mitigation: "Clarify start/end dates and total weeks for each conservative modality; resubmit with explicit duration.",
      },
      {
        id: "RF-002-B",
        name: "Symptom-documentation mismatch",
        impact: 22,
        description: "Clinical notes describe radiculopathy but ICD and indication emphasize axial pain only; criteria require radicular component.",
        mitigation: "Align ICD codes and clinical indication with radiculopathy (e.g., M54.16); document dermatomal distribution and SLR.",
      },
      {
        id: "RF-002-C",
        name: "Prior imaging recency",
        impact: 18,
        description: "Last lumbar imaging 14 months ago; some payers require within 12 months or clear progression.",
        mitigation: "Obtain updated imaging or document specific clinical progression with dates to justify new study.",
      },
    ],
  },
  {
    id: "ARS-003",
    name: "Low Documentation, High Denial Risk",
    documentationScore: 52,
    criteriaMatchScore: 48,
    acrRating: 5,
    historicalApprovalRate: 0.64,
    overturnProbability: 0.31,
    recommendation: "deny",
    riskFactors: [
      {
        id: "RF-003-A",
        name: "No conservative treatment documented",
        impact: 38,
        description: "No trial of PT, NSAIDs, or injections documented; does not meet RBM step-therapy.",
        mitigation: "Complete and document 6+ weeks of conservative treatment before resubmitting.",
      },
      {
        id: "RF-003-B",
        name: "Insufficient clinical indication",
        impact: 30,
        description: "Indication is generic; no objective findings, duration, or functional impact.",
        mitigation: "Document exam findings, symptom duration, and functional limitations; use structured indication.",
      },
    ],
  },
];

// ============================================================================
// RBM: GOLD CARD PROVIDERS
// ============================================================================

export interface GoldCardProviderOrderHistory {
  month: string;
  orders: number;
  approvalRate: number; // 0-100
}

export type GoldCardStatusValue = "eligible" | "near" | "in-progress" | "not-eligible";

export interface GoldCardProvider {
  id: string;
  name: string;
  npi: string;
  specialty: string;
  facility: string;
  approvalRates: {
    overall: number; // 0-100
    byPayer: Record<string, number>;
    byImagingType: Record<string, number>;
  };
  goldCardStatus: Record<string, GoldCardStatusValue>;
  orderHistory: GoldCardProviderOrderHistory[];
}

export const GOLD_CARD_PROVIDERS: GoldCardProvider[] = [
  {
    id: "GCP-001",
    name: "Dr. Sarah Johnson",
    npi: "1345678901",
    specialty: "Orthopedic Surgery",
    facility: "Metro Spine & Orthopedics",
    approvalRates: {
      overall: 94.2,
      byPayer: {
        UnitedHealthcare: 95.1,
        Aetna: 93.8,
        BCBS: 94.0,
        Humana: 93.5,
        Cigna: 94.6,
      },
      byImagingType: {
        MRI: 95.8,
        CT: 92.1,
        "PET-CT": 91.0,
      },
    },
    goldCardStatus: {
      UnitedHealthcare: "eligible",
      Aetna: "eligible",
      BCBS: "eligible",
      Humana: "eligible",
      Cigna: "eligible",
    },
    orderHistory: [
      { month: "2024-07", orders: 42, approvalRate: 92.9 },
      { month: "2024-08", orders: 48, approvalRate: 93.8 },
      { month: "2024-09", orders: 51, approvalRate: 94.1 },
      { month: "2024-10", orders: 47, approvalRate: 95.7 },
      { month: "2024-11", orders: 52, approvalRate: 94.2 },
      { month: "2024-12", orders: 44, approvalRate: 94.3 },
    ],
  },
  {
    id: "GCP-002",
    name: "Dr. Michael Chen",
    npi: "1876543210",
    specialty: "Neurology",
    facility: "Neuroscience Associates",
    approvalRates: {
      overall: 89.1,
      byPayer: {
        UnitedHealthcare: 89.1, // 2.9% gap to 92% gold threshold
        Aetna: 90.2,
        BCBS: 88.5,
        Humana: 89.8,
        Cigna: 87.9,
      },
      byImagingType: {
        MRI: 90.2,
        CT: 87.5,
        "PET-CT": 85.0,
      },
    },
    goldCardStatus: {
      UnitedHealthcare: "near", // 2.9% gap to 92%
      Aetna: "eligible",
      BCBS: "in-progress",
      Humana: "near",
      Cigna: "not-eligible",
    },
    orderHistory: [
      { month: "2024-07", orders: 38, approvalRate: 86.8 },
      { month: "2024-08", orders: 41, approvalRate: 87.8 },
      { month: "2024-09", orders: 44, approvalRate: 88.6 },
      { month: "2024-10", orders: 46, approvalRate: 89.1 },
      { month: "2024-11", orders: 43, approvalRate: 90.7 },
      { month: "2024-12", orders: 45, approvalRate: 89.1 },
    ],
  },
];

// ============================================================================
// RBM: COMPLIANCE METRICS
// ============================================================================

export interface ComplianceMetrics {
  urgentDecisions: {
    total: number;
    withinSLA: number;
    complianceRate: number; // 0-100
    averageTime: number; // hours
  };
  standardDecisions: {
    total: number;
    withinSLA: number;
    complianceRate: number;
    averageTime: number;
  };
  apiReadiness: {
    crdImplemented: boolean;
    dtrImplemented: boolean;
    pasImplemented: boolean;
    x12BridgeReady: boolean;
    overallReadiness: number; // 0-100
  };
  publicReportingReady: {
    approvalRates: boolean;
    denialRates: boolean;
    appealOutcomes: boolean;
    averageDecisionTimes: boolean;
  };
}

export const COMPLIANCE_METRICS: ComplianceMetrics = {
  urgentDecisions: {
    total: 1247,
    withinSLA: 1241,
    complianceRate: 99.52,
    averageTime: 18.3, // hours (well under 72h)
  },
  standardDecisions: {
    total: 8321,
    withinSLA: 8278,
    complianceRate: 99.48,
    averageTime: 96.2, // hours (~4 days, under 168h)
  },
  apiReadiness: {
    crdImplemented: true,
    dtrImplemented: true,
    pasImplemented: true,
    x12BridgeReady: true,
    overallReadiness: 97,
  },
  publicReportingReady: {
    approvalRates: true,
    denialRates: true,
    appealOutcomes: true,
    averageDecisionTimes: true,
  },
};

// ============================================================================
// RBM: SAMPLE AUDIT TRAIL
// ============================================================================

export type AuditTrailActor = "system" | "ai" | "human";

export interface AuditTrailActorDetails {
  name?: string;
  credentials?: string;
  specialty?: string;
  role?: string;
}

export interface AuditTrailAIInvolvement {
  model?: string;
  confidence?: number;
  recommendation?: string;
  rationale?: string;
  processingTimeMs?: number;
  documentationScore?: number;
  criteriaMatchScore?: number;
  matchedCriteria?: string[];
}

export interface AuditTrailEntry {
  timestamp: string; // ISO 8601
  action: string;
  actor: AuditTrailActor;
  data: Record<string, unknown>;
  aiInvolvement?: AuditTrailAIInvolvement;
  actorDetails?: AuditTrailActorDetails;
}

export interface SampleAuditTrail {
  requestId: string;
  entries: AuditTrailEntry[];
}

export const SAMPLE_AUDIT_TRAIL: SampleAuditTrail[] = [
  {
    requestId: "PA-2025-847291",
    entries: [
      {
        timestamp: "2025-01-14T08:02:33Z",
        action: "Request Received",
        actor: "system",
        data: {
          source: "Epic EHR via FHIR API",
          documentationAttached: "12 pages",
          imagingType: "MRI",
          cptCode: "72148",
          bodyPart: "Lumbar Spine",
          urgency: "standard",
        },
      },
      {
        timestamp: "2025-01-14T08:02:41Z",
        action: "AI Analysis Initiated",
        actor: "ai",
        data: { trigger: "auto", ruleSet: "RAD-MSK-2025.1", model: "ARKA-Clinical-v2.4", confidenceThreshold: "95%" },
      },
      {
        timestamp: "2025-01-14T08:03:17Z",
        action: "AI Analysis Complete",
        actor: "ai",
        data: {
          recommendation: "approve",
          routedToHuman: true,
          reason: "High criteria match; human review required per policy for all AI-recommended approvals.",
        },
        aiInvolvement: {
          model: "ARKA-RBM-2025.1",
          confidence: 0.94,
          recommendation: "approve",
          rationale: "Documentation meets RAD-MSK criteria: radiculopathy, 6+ weeks conservative treatment, objective findings. Minor gap: prior imaging report not attached.",
          processingTimeMs: 36200,
          documentationScore: 92,
          criteriaMatchScore: 95,
          matchedCriteria: ["RAD-MSK-001.a", "RAD-MSK-001.c", "RAD-MSK-001.f"],
        },
      },
      {
        timestamp: "2025-01-14T08:03:18Z",
        action: "Routed for Human Review",
        actor: "system",
        data: {
          queue: "standard-approval",
          reason: "AI-recommended approval; human sign-off required.",
          assignedTo: "Dr. Sarah Chen, MD (Radiology)",
          reviewerSpecialtyMatch: "✓ MSK Radiology",
        },
      },
      {
        timestamp: "2025-01-14T09:41:22Z",
        action: "Human Reviewer Action",
        actor: "human",
        data: {
          decision: "approved",
          authNumber: "AUTH-2025-847291",
          note: "AI analysis accurate. Clinical documentation supports medical necessity. Appropriate imaging for chronic low back pain with failed conservative management.",
          timeSpentReviewing: "4m 23s",
          license: "CA-RAD-28471",
        },
        actorDetails: {
          name: "Dr. Sarah Chen",
          credentials: "MD",
          specialty: "Radiology",
          role: "Prior Authorization Medical Director",
        },
      },
      {
        timestamp: "2025-01-14T09:41:25Z",
        action: "Decision Finalized",
        actor: "system",
        data: {
          outcome: "approved",
          authNumber: "AUTH-2025-847291",
          notified: ["ordering_provider", "member_portal"],
          notificationSent: "Provider notified",
          decisionLetterGenerated: true,
        },
      },
    ],
  },
  {
    requestId: "PA-2025-847292",
    entries: [
      {
        timestamp: "2025-01-15T10:00:00Z",
        action: "Request Received",
        actor: "system",
        data: {
          source: "Epic EHR via FHIR API",
          documentationAttached: "4 pages",
          imagingType: "MRI",
          cptCode: "70553",
          bodyPart: "Brain",
          urgency: "standard",
        },
      },
      {
        timestamp: "2025-01-15T10:00:05Z",
        action: "AI Analysis Initiated",
        actor: "ai",
        data: { trigger: "auto", ruleSet: "RAD-NEURO-2025.1" },
      },
      {
        timestamp: "2025-01-15T10:00:42Z",
        action: "AI Analysis Complete",
        actor: "ai",
        data: {
          recommendation: "deny",
          routedToHuman: true,
          reason: "Insufficient conservative treatment; human review required.",
        },
        aiInvolvement: {
          model: "ARKA-RBM-2025.1",
          confidence: 0.91,
          recommendation: "deny",
          rationale: "Does not meet RAD-NEURO criteria: 3-week headache duration, no conservative treatment documented, normal neurological exam.",
          processingTimeMs: 37000,
          documentationScore: 58,
          criteriaMatchScore: 25,
        },
      },
      {
        timestamp: "2025-01-15T10:00:43Z",
        action: "Routed for Human Review",
        actor: "system",
        data: {
          queue: "denial-review",
          assignedTo: "Dr. Sarah Chen, MD (Radiology)",
          reviewerSpecialtyMatch: "✓ MSK Radiology",
        },
      },
      {
        timestamp: "2025-01-15T14:22:10Z",
        action: "Human Reviewer Action",
        actor: "human",
        data: {
          decision: "denied",
          reasonCode: "DEN-002",
          clinicalCriteriaNotMet: "Insufficient conservative treatment; headache duration < 4 weeks",
          documentationReviewed: ["Clinical notes", "ICD codes"],
          documentationMissing: ["Conservative treatment records", "Prior imaging"],
          timeSpentReviewing: "6m 15s",
          peerToPeerOffered: true,
          appealRightsNotified: true,
          reviewerNote: "AI analysis accurate. Criteria not met; recommend 4–6 weeks conservative treatment before re-imaging.",
          license: "CA-RAD-28471",
        },
        actorDetails: {
          name: "Dr. Sarah Chen",
          credentials: "MD",
          specialty: "Radiology",
          role: "Prior Authorization Medical Director",
        },
      },
      {
        timestamp: "2025-01-15T14:22:18Z",
        action: "Decision Finalized",
        actor: "system",
        data: {
          outcome: "denied",
          reasonCode: "DEN-002",
          notified: ["ordering_provider", "member_portal"],
          decisionLetterGenerated: true,
        },
      },
    ],
  },
];

// ============================================================================
// RBM: DASHBOARD TRENDS
// ============================================================================

export interface DashboardTrends {
  appealOverturnRate: Array<{ month: string; rate: number; industry: number }>;
  goldCardEligibility: Array<{ month: string; eligible: number; total: number }>;
  /** Optional: prior auth approval rate over time (0-1). */
  approvalRate?: Array<{ month: string; rate: number }>;
  /** Optional: average decision time in hours. */
  averageDecisionTime?: Array<{ month: string; hours: number }>;
}

export const DASHBOARD_TRENDS: DashboardTrends = {
  appealOverturnRate: [
    { month: "2024-07", rate: 0.45, industry: 0.42 },
    { month: "2024-08", rate: 0.38, industry: 0.41 },
    { month: "2024-09", rate: 0.31, industry: 0.39 },
    { month: "2024-10", rate: 0.24, industry: 0.38 },
    { month: "2024-11", rate: 0.18, industry: 0.36 },
    { month: "2024-12", rate: 0.153, industry: 0.35 },
  ],
  goldCardEligibility: [
    { month: "2024-07", eligible: 45, total: 312 },
    { month: "2024-08", eligible: 58, total: 318 },
    { month: "2024-09", eligible: 72, total: 325 },
    { month: "2024-10", eligible: 89, total: 331 },
    { month: "2024-11", eligible: 108, total: 338 },
    { month: "2024-12", eligible: 127, total: 342 },
  ],
  approvalRate: [
    { month: "2024-07", rate: 0.808 },
    { month: "2024-08", rate: 0.825 },
    { month: "2024-09", rate: 0.848 },
    { month: "2024-10", rate: 0.869 },
    { month: "2024-11", rate: 0.879 },
    { month: "2024-12", rate: 0.899 },
  ],
  averageDecisionTime: [
    { month: "2024-07", hours: 28.2 },
    { month: "2024-08", hours: 24.1 },
    { month: "2024-09", hours: 21.8 },
    { month: "2024-10", hours: 19.4 },
    { month: "2024-11", hours: 18.9 },
    { month: "2024-12", hours: 18.5 },
  ],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

export const getOrderById = (id: string): ImagingOrder | undefined => {
  return imagingOrders.find((o) => o.id === id);
};

export const getAnalysisByOrderId = (orderId: string): PreSubmissionAnalysis | undefined => {
  return preSubmissionAnalyses.find((a) => a.orderId === orderId);
};

export const getPredictionByOrderId = (orderId: string): DenialPrediction | undefined => {
  return denialPredictions.find((p) => p.orderId === orderId);
};

export const getCriteriaMatchByOrderId = (orderId: string): RBMCriteriaMatch | undefined => {
  return rbmCriteriaMatches.find((c) => c.orderId === orderId);
};

export const getJustificationByOrderId = (orderId: string): GeneratedJustification | undefined => {
  return generatedJustifications.find((j) => j.orderId === orderId);
};

export const getAppealByOrderId = (orderId: string): GeneratedAppeal | undefined => {
  return generatedAppeals.find((a) => a.orderId === orderId);
};

export const getScenarioById = (id: string): DemoScenario | undefined => {
  return demoScenarios.find((s) => s.id === id);
};
