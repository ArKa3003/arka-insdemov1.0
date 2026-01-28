import { PARequest } from '@/types/insurance';

export const DEMO_SCENARIOS: Record<string, PARequest> = {
  'high-risk-approval': {
    id: 'demo-001',
    memberId: 'MEM-123456',
    requestDate: '2026-01-27',
    modality: 'MRI',
    bodyRegion: 'Lumbar Spine',
    primaryDiagnosis: {
      icd10: 'M54.5',
      description: 'Low back pain',
    },
    clinicalIndication: 'Chronic low back pain, 6 weeks duration',
    orderingProvider: {
      npi: '1234567890',
      specialty: 'Family Medicine',
      historicalApprovalRate: 0.72,
    },
    urgency: 'routine',
    priorImaging: [],
    redFlags: [],
    conservativeTreatment: [],
  },
  'low-risk-approval': {
    id: 'demo-002',
    memberId: 'MEM-789012',
    requestDate: '2026-01-27',
    modality: 'MRI',
    bodyRegion: 'Lumbar Spine',
    primaryDiagnosis: {
      icd10: 'M54.17',
      description: 'Radiculopathy, lumbosacral region',
    },
    clinicalIndication:
      'Progressive neurological deficit with saddle anesthesia',
    orderingProvider: {
      npi: '0987654321',
      specialty: 'Neurology',
      historicalApprovalRate: 0.91,
    },
    urgency: 'urgent',
    priorImaging: [
      {
        modality: 'X-ray',
        date: '2026-01-15',
        findings: 'Degenerative changes L4-L5',
        relevance: 'directly_related',
      },
    ],
    redFlags: [
      'Progressive neurological deficit',
      'Saddle anesthesia',
      'Bladder dysfunction',
    ],
    conservativeTreatment: [
      'Physical therapy x 6 weeks',
      'NSAIDs',
      'Muscle relaxants',
    ],
  },
  'medium-risk': {
    id: 'demo-003',
    memberId: 'MEM-345678',
    requestDate: '2026-01-27',
    modality: 'CT',
    bodyRegion: 'Abdomen/Pelvis',
    primaryDiagnosis: {
      icd10: 'R10.9',
      description: 'Unspecified abdominal pain',
    },
    clinicalIndication:
      'Abdominal pain with elevated inflammatory markers',
    orderingProvider: {
      npi: '5678901234',
      specialty: 'Internal Medicine',
      historicalApprovalRate: 0.78,
    },
    urgency: 'routine',
    priorImaging: [],
    redFlags: [],
    conservativeTreatment: ['Trial of PPI therapy'],
  },
};
