/**
 * Mock data for demonstration purposes
 */

import { CLAIM_STATUS, RISK_LEVELS } from "./constants";

// Sample patient data
export const mockPatients = [
  {
    id: "P001",
    name: "John Smith",
    dob: "1965-03-15",
    memberId: "MBR-12345-A",
    insuranceProvider: "BlueCross BlueShield",
    planType: "PPO",
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    dob: "1978-07-22",
    memberId: "MBR-67890-B",
    insuranceProvider: "Aetna",
    planType: "HMO",
  },
  {
    id: "P003",
    name: "Michael Williams",
    dob: "1952-11-08",
    memberId: "MBR-11111-C",
    insuranceProvider: "UnitedHealthcare",
    planType: "EPO",
  },
];

// Sample claims data
export const mockClaims = [
  {
    id: "CLM-001",
    patientId: "P001",
    procedureCode: "72148",
    procedureName: "MRI Lumbar Spine",
    status: CLAIM_STATUS.PENDING,
    submissionDate: "2024-01-15",
    amount: 2500,
    riskLevel: RISK_LEVELS.MEDIUM,
    denialProbability: 0.35,
  },
  {
    id: "CLM-002",
    patientId: "P002",
    procedureCode: "70553",
    procedureName: "MRI Brain with Contrast",
    status: CLAIM_STATUS.APPROVED,
    submissionDate: "2024-01-10",
    amount: 3200,
    riskLevel: RISK_LEVELS.LOW,
    denialProbability: 0.12,
  },
  {
    id: "CLM-003",
    patientId: "P003",
    procedureCode: "74177",
    procedureName: "CT Abdomen/Pelvis with Contrast",
    status: CLAIM_STATUS.DENIED,
    submissionDate: "2024-01-08",
    amount: 1800,
    riskLevel: RISK_LEVELS.HIGH,
    denialProbability: 0.78,
    denialReason: "Medical necessity not established",
  },
];

// Sample analytics data
export const mockAnalytics = {
  totalClaims: 1234,
  approvalRate: 87.5,
  averageProcessingDays: 2.3,
  totalSavings: 124000,
  denialsByReason: [
    { reason: "Medical Necessity", count: 45, percentage: 38 },
    { reason: "Missing Documentation", count: 32, percentage: 27 },
    { reason: "Prior Auth Required", count: 22, percentage: 18 },
    { reason: "Not Covered", count: 12, percentage: 10 },
    { reason: "Other", count: 8, percentage: 7 },
  ],
  monthlyTrends: [
    { month: "Jul", approved: 145, denied: 23 },
    { month: "Aug", approved: 152, denied: 21 },
    { month: "Sep", approved: 148, denied: 25 },
    { month: "Oct", approved: 167, denied: 19 },
    { month: "Nov", approved: 178, denied: 18 },
    { month: "Dec", approved: 189, denied: 15 },
  ],
};

// Sample provider data
export const mockProviders = [
  {
    id: "PRV-001",
    name: "Dr. Emily Smith",
    specialty: "Radiology",
    approvalRate: 92,
    totalClaims: 156,
  },
  {
    id: "PRV-002",
    name: "Dr. Robert Johnson",
    specialty: "Orthopedics",
    approvalRate: 89,
    totalClaims: 134,
  },
  {
    id: "PRV-003",
    name: "Dr. Lisa Williams",
    specialty: "Neurology",
    approvalRate: 78,
    totalClaims: 98,
  },
];

// Sample RBM criteria
export const mockRBMCriteria = [
  {
    id: "RBM-001",
    procedureCode: "72148",
    criteria: [
      "Conservative treatment for 6 weeks",
      "Documented radiculopathy",
      "Failed physical therapy",
      "Pain > 4 weeks duration",
    ],
    matchedCriteria: ["Conservative treatment for 6 weeks", "Pain > 4 weeks duration"],
    score: 0.65,
  },
];
