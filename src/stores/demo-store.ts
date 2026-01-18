import { create } from "zustand";

// Types for the demo store
interface Patient {
  id: string;
  name: string;
  dob: string;
  memberId: string;
  insuranceProvider: string;
  planType: string;
}

interface Claim {
  id: string;
  patientId: string;
  procedureCode: string;
  procedureName: string;
  status: string;
  submissionDate: string;
  amount: number;
  riskLevel: string;
  denialProbability: number;
  denialReason?: string;
}

interface DemoState {
  // Current workflow step
  currentStep: number;
  
  // Selected patient
  selectedPatient: Patient | null;
  
  // Current claim being processed
  currentClaim: Claim | null;
  
  // Demo mode flags
  isPlaying: boolean;
  isPaused: boolean;
  
  // Analysis results
  analysisResults: {
    denialProbability: number;
    riskFactors: string[];
    recommendations: string[];
  } | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setCurrentClaim: (claim: Claim | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setAnalysisResults: (results: DemoState["analysisResults"]) => void;
  resetDemo: () => void;
}

const initialState = {
  currentStep: 1,
  selectedPatient: null,
  currentClaim: null,
  isPlaying: false,
  isPaused: false,
  analysisResults: null,
};

export const useDemoStore = create<DemoState>((set) => ({
  ...initialState,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 7),
    })),
  
  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),
  
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  
  setCurrentClaim: (claim) => set({ currentClaim: claim }),
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  setIsPaused: (isPaused) => set({ isPaused }),
  
  setAnalysisResults: (results) => set({ analysisResults: results }),
  
  resetDemo: () => set(initialState),
}));

export default useDemoStore;
