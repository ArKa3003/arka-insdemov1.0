import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { 
  Patient, 
  ImagingOrder, 
  PreSubmissionAnalysis, 
  DenialPrediction,
  RBMCriteriaMatch,
  GeneratedJustification,
  GeneratedAppeal,
  RiskLevel,
} from "@/types";
import {
  patients,
  imagingOrders,
  preSubmissionAnalyses,
  denialPredictions,
  rbmCriteriaMatches,
  generatedJustifications,
  generatedAppeals,
} from "@/lib/mock-data";

// ============================================================================
// TYPES
// ============================================================================

interface ProcessingState {
  isAnalyzing: boolean;
  isGenerating: boolean;
  processingMessage: string | null;
  processingProgress: number; // 0-100
}

interface DemoStoreState {
  // Patient State
  selectedPatientId: string | null;
  selectedPatient: Patient | null;
  
  // Order State
  currentOrderId: string | null;
  currentOrder: Partial<ImagingOrder> | null;
  
  // Analysis State
  preSubmissionAnalysis: PreSubmissionAnalysis | null;
  denialPrediction: DenialPrediction | null;
  rbmCriteriaMatch: RBMCriteriaMatch | null;
  generatedJustification: GeneratedJustification | null;
  generatedAppeal: GeneratedAppeal | null;
  
  // Demo Flow State
  currentStep: number;
  completedSteps: number[];
  
  // Processing State
  processing: ProcessingState;
  
  // Error State
  error: string | null;
  
  // Timestamps
  demoStartedAt: string | null;
  lastUpdatedAt: string | null;
}

interface DemoStoreActions {
  // Patient Actions
  setSelectedPatient: (id: string | null) => void;
  clearPatient: () => void;
  
  // Order Actions
  setCurrentOrder: (orderId: string | null) => void;
  updateOrder: (fields: Partial<ImagingOrder>) => void;
  clearOrder: () => void;
  
  // Analysis Setters
  setPreSubmissionAnalysis: (analysis: PreSubmissionAnalysis | null) => void;
  setDenialPrediction: (prediction: DenialPrediction | null) => void;
  setRBMCriteriaMatch: (match: RBMCriteriaMatch | null) => void;
  setGeneratedJustification: (justification: GeneratedJustification | null) => void;
  setGeneratedAppeal: (appeal: GeneratedAppeal | null) => void;
  
  // Demo Flow Actions
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (step: number) => void;
  resetDemo: () => void;
  
  // Processing Actions
  setProcessing: (state: Partial<ProcessingState>) => void;
  clearProcessing: () => void;
  
  // Error Actions
  setError: (error: string | null) => void;
  
  // Simulation Actions
  simulatePreSubmissionAnalysis: () => Promise<void>;
  simulateDenialPrediction: () => Promise<void>;
  simulateCriteriaMatching: () => Promise<void>;
  simulateJustificationGeneration: () => Promise<void>;
  simulateAppealGeneration: () => Promise<void>;
  
  // Initialize demo with a scenario
  initializeScenario: (scenarioIndex: number) => void;

  // Session restore: repopulate selectedPatient/currentOrder from persisted IDs after rehydration
  rehydrateDerived: () => void;
}

interface ComputedValues {
  // Computed getters
  isReadyForSubmission: () => boolean;
  overallRiskLevel: () => RiskLevel | null;
  canProceedToNextStep: () => boolean;
  documentationScore: () => number | null;
  completionPercentage: () => number;
  currentPatient: () => Patient | null;
  currentImagingOrder: () => ImagingOrder | null;
}

type DemoStore = DemoStoreState & DemoStoreActions & ComputedValues;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialProcessingState: ProcessingState = {
  isAnalyzing: false,
  isGenerating: false,
  processingMessage: null,
  processingProgress: 0,
};

const initialState: DemoStoreState = {
  selectedPatientId: null,
  selectedPatient: null,
  currentOrderId: null,
  currentOrder: null,
  preSubmissionAnalysis: null,
  denialPrediction: null,
  rbmCriteriaMatch: null,
  generatedJustification: null,
  generatedAppeal: null,
  currentStep: 1,
  completedSteps: [],
  processing: initialProcessingState,
  error: null,
  demoStartedAt: null,
  lastUpdatedAt: null,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getPatientById = (id: string): Patient | null => {
  return patients.find(p => p.id === id) || null;
};

const getOrderById = (id: string): ImagingOrder | null => {
  return imagingOrders.find(o => o.id === id) || null;
};

const getAnalysisForOrder = (orderId: string): PreSubmissionAnalysis | null => {
  return preSubmissionAnalyses.find(a => a.orderId === orderId) || null;
};

const getPredictionForOrder = (orderId: string): DenialPrediction | null => {
  return denialPredictions.find(p => p.orderId === orderId) || null;
};

const getCriteriaMatchForOrder = (orderId: string): RBMCriteriaMatch | null => {
  return rbmCriteriaMatches.find(c => c.orderId === orderId) || null;
};

const getJustificationForOrder = (orderId: string): GeneratedJustification | null => {
  return generatedJustifications.find(j => j.orderId === orderId) || null;
};

const getAppealForOrder = (orderId: string): GeneratedAppeal | null => {
  return generatedAppeals.find(a => a.orderId === orderId) || null;
};

// ============================================================================
// STORE
// ============================================================================

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      // Initial State
      ...initialState,

      // ========================================================================
      // PATIENT ACTIONS
      // ========================================================================
      
      setSelectedPatient: (id) => {
        const patient = id ? getPatientById(id) : null;
        set({ 
          selectedPatientId: id, 
          selectedPatient: patient,
          lastUpdatedAt: new Date().toISOString(),
        });
      },
      
      clearPatient: () => {
        set({ 
          selectedPatientId: null, 
          selectedPatient: null,
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      // ========================================================================
      // ORDER ACTIONS
      // ========================================================================
      
      setCurrentOrder: (orderId) => {
        const order = orderId ? getOrderById(orderId) : null;
        set({ 
          currentOrderId: orderId, 
          currentOrder: order,
          lastUpdatedAt: new Date().toISOString(),
        });
      },
      
      updateOrder: (fields) => {
        set((state) => ({
          currentOrder: state.currentOrder 
            ? { ...state.currentOrder, ...fields }
            : fields,
          lastUpdatedAt: new Date().toISOString(),
        }));
      },
      
      clearOrder: () => {
        set({ 
          currentOrderId: null, 
          currentOrder: null,
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      // ========================================================================
      // ANALYSIS SETTERS
      // ========================================================================
      
      setPreSubmissionAnalysis: (analysis) => {
        set({ 
          preSubmissionAnalysis: analysis,
          lastUpdatedAt: new Date().toISOString(),
        });
      },
      
      setDenialPrediction: (prediction) => {
        set({ 
          denialPrediction: prediction,
          lastUpdatedAt: new Date().toISOString(),
        });
      },
      
      setRBMCriteriaMatch: (match) => {
        set({ 
          rbmCriteriaMatch: match,
          lastUpdatedAt: new Date().toISOString(),
        });
      },
      
      setGeneratedJustification: (justification) => {
        set({ 
          generatedJustification: justification,
          lastUpdatedAt: new Date().toISOString(),
        });
      },
      
      setGeneratedAppeal: (appeal) => {
        set({ 
          generatedAppeal: appeal,
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      // ========================================================================
      // DEMO FLOW ACTIONS
      // ========================================================================
      
      goToStep: (step) => {
        if (step >= 1 && step <= 10) {
          set({ 
            currentStep: step,
            lastUpdatedAt: new Date().toISOString(),
          });
        }
      },
      
      nextStep: () => {
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 10),
          lastUpdatedAt: new Date().toISOString(),
        }));
      },
      
      previousStep: () => {
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
          lastUpdatedAt: new Date().toISOString(),
        }));
      },
      
      completeStep: (step) => {
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step].sort((a, b) => a - b),
          lastUpdatedAt: new Date().toISOString(),
        }));
      },
      
      resetDemo: () => {
        set({
          ...initialState,
          demoStartedAt: null,
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      // ========================================================================
      // PROCESSING ACTIONS
      // ========================================================================
      
      setProcessing: (processingState) => {
        set((state) => ({
          processing: { ...state.processing, ...processingState },
          lastUpdatedAt: new Date().toISOString(),
        }));
      },
      
      clearProcessing: () => {
        set({ 
          processing: initialProcessingState,
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      // ========================================================================
      // ERROR ACTIONS
      // ========================================================================
      
      setError: (error) => {
        set({ 
          error,
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      // ========================================================================
      // SIMULATION ACTIONS
      // ========================================================================
      
      simulatePreSubmissionAnalysis: async () => {
        const { currentOrderId } = get();
        if (!currentOrderId) return;

        set({
          processing: {
            isAnalyzing: true,
            isGenerating: false,
            processingMessage: "Analyzing documentation completeness...",
            processingProgress: 0,
          },
        });

        // Simulate progress updates
        await delay(500);
        set((state) => ({
          processing: { ...state.processing, processingProgress: 25, processingMessage: "Checking clinical indication..." },
        }));

        await delay(500);
        set((state) => ({
          processing: { ...state.processing, processingProgress: 50, processingMessage: "Evaluating treatment history..." },
        }));

        await delay(500);
        set((state) => ({
          processing: { ...state.processing, processingProgress: 75, processingMessage: "Identifying documentation gaps..." },
        }));

        await delay(500);
        const analysis = getAnalysisForOrder(currentOrderId);
        
        set({
          preSubmissionAnalysis: analysis,
          processing: {
            isAnalyzing: false,
            isGenerating: false,
            processingMessage: null,
            processingProgress: 100,
          },
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      simulateDenialPrediction: async () => {
        const { currentOrderId } = get();
        if (!currentOrderId) return;

        set({
          processing: {
            isAnalyzing: true,
            isGenerating: false,
            processingMessage: "Running AI denial risk prediction...",
            processingProgress: 0,
          },
        });

        await delay(600);
        set((state) => ({
          processing: { ...state.processing, processingProgress: 33, processingMessage: "Analyzing historical patterns..." },
        }));

        await delay(600);
        set((state) => ({
          processing: { ...state.processing, processingProgress: 66, processingMessage: "Calculating risk factors..." },
        }));

        await delay(600);
        set((state) => ({
          processing: { ...state.processing, processingProgress: 90, processingMessage: "Generating recommendations..." },
        }));

        await delay(400);
        const prediction = getPredictionForOrder(currentOrderId);
        
        set({
          denialPrediction: prediction,
          processing: initialProcessingState,
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      simulateCriteriaMatching: async () => {
        const { currentOrderId } = get();
        if (!currentOrderId) return;

        set({
          processing: {
            isAnalyzing: true,
            isGenerating: false,
            processingMessage: "Loading RBM criteria guidelines...",
            processingProgress: 0,
          },
        });

        await delay(500);
        set((state) => ({
          processing: { ...state.processing, processingProgress: 25, processingMessage: "Identifying applicable guideline..." },
        }));

        await delay(500);
        set((state) => ({
          processing: { ...state.processing, processingProgress: 50, processingMessage: "Matching clinical documentation to criteria..." },
        }));

        await delay(500);
        set((state) => ({
          processing: { ...state.processing, processingProgress: 75, processingMessage: "Calculating match score..." },
        }));

        await delay(500);
        const criteriaMatch = getCriteriaMatchForOrder(currentOrderId);
        
        set({
          rbmCriteriaMatch: criteriaMatch,
          processing: initialProcessingState,
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      simulateJustificationGeneration: async () => {
        const { currentOrderId } = get();
        if (!currentOrderId) return;

        set({
          processing: {
            isAnalyzing: false,
            isGenerating: true,
            processingMessage: "Initializing AI justification generator...",
            processingProgress: 0,
          },
        });

        const typingMessages = [
          "Analyzing clinical presentation...",
          "Reviewing treatment history...",
          "Extracting key evidence points...",
          "Composing clinical narrative...",
          "Structuring medical justification...",
          "Adding supporting evidence...",
          "Formatting final document...",
          "Finalizing justification...",
        ];

        for (let i = 0; i < typingMessages.length; i++) {
          await delay(375);
          set((state) => ({
            processing: {
              ...state.processing,
              processingProgress: Math.round(((i + 1) / typingMessages.length) * 100),
              processingMessage: typingMessages[i],
            },
          }));
        }

        const justification = getJustificationForOrder(currentOrderId);
        
        set({
          generatedJustification: justification,
          processing: initialProcessingState,
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      simulateAppealGeneration: async () => {
        const { currentOrderId } = get();
        if (!currentOrderId) return;

        set({
          processing: {
            isAnalyzing: false,
            isGenerating: true,
            processingMessage: "Initializing appeal letter generator...",
            processingProgress: 0,
          },
        });

        const typingMessages = [
          "Reviewing denial reason...",
          "Gathering supporting evidence...",
          "Searching medical literature...",
          "Citing clinical guidelines...",
          "Composing appeal introduction...",
          "Writing clinical rationale...",
          "Adding literature references...",
          "Formatting appeal letter...",
          "Adding closing arguments...",
          "Finalizing appeal document...",
        ];

        for (let i = 0; i < typingMessages.length; i++) {
          await delay(350);
          set((state) => ({
            processing: {
              ...state.processing,
              processingProgress: Math.round(((i + 1) / typingMessages.length) * 100),
              processingMessage: typingMessages[i],
            },
          }));
        }

        const appeal = getAppealForOrder(currentOrderId);
        
        set({
          generatedAppeal: appeal,
          processing: initialProcessingState,
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      // ========================================================================
      // SCENARIO INITIALIZATION
      // ========================================================================
      
      initializeScenario: (scenarioIndex) => {
        const patient = patients[scenarioIndex];
        const order = imagingOrders[scenarioIndex];
        
        if (!patient || !order) {
          set({ error: "Invalid scenario index" });
          return;
        }

        set({
          ...initialState,
          selectedPatientId: patient.id,
          selectedPatient: patient,
          currentOrderId: order.id,
          currentOrder: order,
          demoStartedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
        });
      },

      rehydrateDerived: () => {
        const { selectedPatientId, currentOrderId } = get();
        const updates: Partial<DemoStoreState> = {};
        if (selectedPatientId) {
          updates.selectedPatient = getPatientById(selectedPatientId);
        }
        if (currentOrderId) {
          updates.currentOrder = getOrderById(currentOrderId);
        }
        if (Object.keys(updates).length > 0) {
          set(updates);
        }
      },

      // ========================================================================
      // COMPUTED VALUES
      // ========================================================================
      
      isReadyForSubmission: () => {
        const { preSubmissionAnalysis } = get();
        if (!preSubmissionAnalysis) return false;
        return preSubmissionAnalysis.readyForSubmission && 
               preSubmissionAnalysis.documentationScore >= 70;
      },
      
      overallRiskLevel: () => {
        const { denialPrediction } = get();
        return denialPrediction?.riskLevel || null;
      },
      
      canProceedToNextStep: () => {
        const { currentStep, selectedPatientId, currentOrderId, preSubmissionAnalysis } = get();
        
        switch (currentStep) {
          case 1: // Patient & Payer Selection
            return !!selectedPatientId;
          case 2: // Order Entry
            return !!currentOrderId;
          case 3: // Pre-Submission Analysis
            return !!preSubmissionAnalysis;
          case 4: // Appeal Risk Prediction
          case 5: // Documentation Assistant
          case 6: // RBM Criteria Mapping
          case 7: // Gold Card Check
          case 8: // CMS Compliance Verification
          case 9: // Human-in-the-Loop Review
          case 10: // Submit / Appeal Generator
            return true;
          default:
            return false;
        }
      },
      
      documentationScore: () => {
        const { preSubmissionAnalysis } = get();
        return preSubmissionAnalysis?.documentationScore || null;
      },
      
      completionPercentage: () => {
        const { completedSteps } = get();
        return Math.round((completedSteps.length / 10) * 100);
      },
      
      currentPatient: () => {
        const { selectedPatientId } = get();
        return selectedPatientId ? getPatientById(selectedPatientId) : null;
      },
      
      currentImagingOrder: () => {
        const { currentOrderId } = get();
        return currentOrderId ? getOrderById(currentOrderId) : null;
      },
    }),
    {
      name: "arka-demo-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // Only persist essential state
        selectedPatientId: state.selectedPatientId,
        currentOrderId: state.currentOrderId,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        demoStartedAt: state.demoStartedAt,
      }),
      onRehydrateStorage: () => (state, err) => {
        if (err) return;
        // Repopulate selectedPatient and currentOrder from persisted IDs after session restore
        const store = useDemoStore.getState();
        store.rehydrateDerived?.();
      },
    }
  )
);

// ============================================================================
// SELECTORS (for optimized re-renders)
// ============================================================================

export const selectPatient = (state: DemoStore) => state.selectedPatient;
export const selectOrder = (state: DemoStore) => state.currentOrder;
export const selectCurrentStep = (state: DemoStore) => state.currentStep;
export const selectCompletedSteps = (state: DemoStore) => state.completedSteps;
export const selectProcessing = (state: DemoStore) => state.processing;
export const selectAnalysis = (state: DemoStore) => state.preSubmissionAnalysis;
export const selectPrediction = (state: DemoStore) => state.denialPrediction;
export const selectCriteriaMatch = (state: DemoStore) => state.rbmCriteriaMatch;
export const selectJustification = (state: DemoStore) => state.generatedJustification;
export const selectAppeal = (state: DemoStore) => state.generatedAppeal;

export default useDemoStore;
