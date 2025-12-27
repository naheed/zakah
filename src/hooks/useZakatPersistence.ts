import { useState, useEffect, useCallback } from 'react';
import { ZakatFormData, defaultFormData } from '@/lib/zakatCalculations';
import { UploadedDocument, generateDocumentId } from '@/lib/documentTypes';

const STORAGE_KEY = 'zakat-calculator-data';

interface PersistedData {
  formData: ZakatFormData;
  stepIndex: number;
  lastUpdated: string;
  uploadedDocuments: UploadedDocument[];
}

export function useZakatPersistence() {
  const [formData, setFormData] = useState<ZakatFormData>(defaultFormData);
  const [stepIndex, setStepIndex] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
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
        setUploadedDocuments(parsed.uploadedDocuments || []);
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
      uploadedDocuments,
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }, [formData, stepIndex, uploadedDocuments, isLoaded]);

  const updateFormData = useCallback((updates: Partial<ZakatFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const addDocument = useCallback((doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: UploadedDocument = {
      ...doc,
      id: generateDocumentId(),
      uploadedAt: new Date().toISOString(),
    };
    setUploadedDocuments(prev => [...prev, newDoc]);
    return newDoc;
  }, []);

  const removeDocument = useCallback((docId: string) => {
    setUploadedDocuments(prev => prev.filter(d => d.id !== docId));
  }, []);

  const continueSession = useCallback(() => {
    setHasExistingSession(false);
    // stepIndex is already loaded
  }, []);

  const startFresh = useCallback(() => {
    setFormData(defaultFormData);
    setStepIndex(0);
    setUploadedDocuments([]);
    setHasExistingSession(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const resetCalculator = useCallback(() => {
    setFormData(defaultFormData);
    setStepIndex(0);
    setUploadedDocuments([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    formData,
    stepIndex,
    setStepIndex,
    updateFormData,
    uploadedDocuments,
    addDocument,
    removeDocument,
    hasExistingSession,
    lastUpdated,
    continueSession,
    startFresh,
    resetCalculator,
    isLoaded,
  };
}
