import { useState, useEffect, useCallback } from 'react';
import { ZakatFormData, defaultFormData } from '@/lib/zakatCalculations';
import { UploadedDocument, generateDocumentId, sanitizeDocumentForStorage } from '@/lib/documentTypes';
import { encryptSession, decryptSession, isSessionEncrypted, deobfuscateLegacy } from '@/lib/sessionEncryption';

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

  // Load from localStorage on mount (async due to encryption)
  useEffect(() => {
    async function loadData() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          setIsLoaded(true);
          return;
        }

        let parsed: PersistedData | null = null;

        // Try to decrypt with session encryption (v2)
        if (isSessionEncrypted(stored)) {
          parsed = await decryptSession<PersistedData>(stored);
        }

        // If decryption failed or data is legacy format, try legacy decode
        if (!parsed) {
          parsed = deobfuscateLegacy<PersistedData>(stored);
        }

        if (parsed) {
          // Check if there's meaningful progress (beyond step 0)
          if (parsed.stepIndex > 0) {
            setHasExistingSession(true);
            setLastUpdated(new Date(parsed.lastUpdated));
          }
          setFormData(parsed.formData);
          setStepIndex(parsed.stepIndex);
          setUploadedDocuments(parsed.uploadedDocuments || []);
        } else {
          // Data couldn't be decrypted (likely session key was cleared)
          // Start fresh - this is a privacy feature
          console.log('Session data could not be decrypted, starting fresh');
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.error('Failed to load saved data:', e);
        localStorage.removeItem(STORAGE_KEY);
      }
      setIsLoaded(true);
    }

    loadData();
  }, []);

  // Save to localStorage whenever data changes (encrypted)
  useEffect(() => {
    if (!isLoaded) return;

    async function saveData() {
      // Sanitize documents before storing (remove sensitive metadata)
      const sanitizedDocuments = uploadedDocuments.map(sanitizeDocumentForStorage);

      const data: PersistedData = {
        formData,
        stepIndex,
        lastUpdated: new Date().toISOString(),
        uploadedDocuments: sanitizedDocuments,
      };

      try {
        const encrypted = await encryptSession(data);
        localStorage.setItem(STORAGE_KEY, encrypted);
      } catch (e) {
        console.error('Failed to save data:', e);
      }
    }

    saveData();
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
    setFormData,
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
