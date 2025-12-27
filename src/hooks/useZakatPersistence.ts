import { useState, useEffect, useCallback } from 'react';
import { ZakatFormData, defaultFormData } from '@/lib/zakatCalculations';

const STORAGE_KEY = 'zakat-calculator-data';
const STEP_KEY = 'zakat-calculator-step';

interface PersistedData {
  formData: ZakatFormData;
  stepIndex: number;
  lastUpdated: string;
}

export function useZakatPersistence() {
  const [formData, setFormData] = useState<ZakatFormData>(defaultFormData);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: PersistedData = JSON.parse(stored);
        // Check if there's meaningful progress (beyond step 0)
        if (parsed.stepIndex > 0) {
          setHasExistingSession(true);
          setLastUpdated(new Date(parsed.lastUpdated));
        }
        setFormData(parsed.formData);
        setStepIndex(parsed.stepIndex);
      }
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoaded) return;
    
    const data: PersistedData = {
      formData,
      stepIndex,
      lastUpdated: new Date().toISOString(),
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }, [formData, stepIndex, isLoaded]);

  const updateFormData = useCallback((updates: Partial<ZakatFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const continueSession = useCallback(() => {
    setHasExistingSession(false);
    // stepIndex is already loaded
  }, []);

  const startFresh = useCallback(() => {
    setFormData(defaultFormData);
    setStepIndex(0);
    setHasExistingSession(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const resetCalculator = useCallback(() => {
    setFormData(defaultFormData);
    setStepIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    formData,
    stepIndex,
    setStepIndex,
    updateFormData,
    hasExistingSession,
    lastUpdated,
    continueSession,
    startFresh,
    resetCalculator,
    isLoaded,
  };
}
