import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DiagnosisEntry, MedicalTerminology } from '@/types/medical';

interface MedicalState {
  selectedDiagnoses: DiagnosisEntry[];
  searchResults: MedicalTerminology[];
  isLoading: boolean;
  error: string | null;
  demoMode: boolean;
}

type MedicalAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_RESULTS'; payload: MedicalTerminology[] }
  | { type: 'ADD_DIAGNOSIS'; payload: MedicalTerminology }
  | { type: 'REMOVE_DIAGNOSIS'; payload: string }
  | { type: 'CLEAR_DIAGNOSES' }
  | { type: 'UPDATE_DIAGNOSIS'; payload: DiagnosisEntry }
  | { type: 'SET_DEMO_MODE'; payload: boolean };

const initialState: MedicalState = {
  selectedDiagnoses: [],
  searchResults: [],
  isLoading: false,
  error: null,
  demoMode: true, // Default to demo mode
};

function medicalReducer(state: MedicalState, action: MedicalAction): MedicalState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'ADD_DIAGNOSIS':
      const newDiagnosis: DiagnosisEntry = {
        ...action.payload,
        id: crypto.randomUUID(),
        dateAdded: new Date().toISOString(),
      };
      return {
        ...state,
        selectedDiagnoses: [...state.selectedDiagnoses, newDiagnosis],
      };
    case 'REMOVE_DIAGNOSIS':
      return {
        ...state,
        selectedDiagnoses: state.selectedDiagnoses.filter(d => d.id !== action.payload),
      };
    case 'CLEAR_DIAGNOSES':
      return { ...state, selectedDiagnoses: [] };
    case 'UPDATE_DIAGNOSIS':
      return {
        ...state,
        selectedDiagnoses: state.selectedDiagnoses.map(d =>
          d.id === action.payload.id ? action.payload : d
        ),
      };
    case 'SET_DEMO_MODE':
      return { ...state, demoMode: action.payload };
    default:
      return state;
  }
}

interface MedicalContextType extends MedicalState {
  addDiagnosis: (diagnosis: MedicalTerminology) => void;
  removeDiagnosis: (id: string) => void;
  clearDiagnoses: () => void;
  updateDiagnosis: (diagnosis: DiagnosisEntry) => void;
  setSearchResults: (results: MedicalTerminology[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDemoMode: (demoMode: boolean) => void;
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export function MedicalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(medicalReducer, initialState);

  const contextValue: MedicalContextType = {
    ...state,
    addDiagnosis: (diagnosis) => dispatch({ type: 'ADD_DIAGNOSIS', payload: diagnosis }),
    removeDiagnosis: (id) => dispatch({ type: 'REMOVE_DIAGNOSIS', payload: id }),
    clearDiagnoses: () => dispatch({ type: 'CLEAR_DIAGNOSES' }),
    updateDiagnosis: (diagnosis) => dispatch({ type: 'UPDATE_DIAGNOSIS', payload: diagnosis }),
    setSearchResults: (results) => dispatch({ type: 'SET_SEARCH_RESULTS', payload: results }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    setDemoMode: (demoMode) => dispatch({ type: 'SET_DEMO_MODE', payload: demoMode }),
  };

  return (
    <MedicalContext.Provider value={contextValue}>
      {children}
    </MedicalContext.Provider>
  );
}

export function useMedical() {
  const context = useContext(MedicalContext);
  if (context === undefined) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return context;
}