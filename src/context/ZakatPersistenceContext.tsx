import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ZakatFormData, defaultFormData } from '@/lib/zakatCalculations';
import { UploadedDocument, generateDocumentId, sanitizeDocumentForStorage } from '@/lib/documentTypes';
import { encryptData, decryptData, isVaultEncrypted, shouldUpgradeToVault, reEncryptWithVault } from '@/lib/unifiedEncryption';
import { isSessionEncrypted, deobfuscateLegacy } from '@/lib/sessionEncryption';

const STORAGE_KEY = 'zakat-calculator-data';
const HISTORY_STORAGE_KEY = 'zakat-guest-history';
import { v4 as uuidv4 } from 'uuid';

interface PersistedData {
    formData: ZakatFormData;
    stepIndex: number;
    lastUpdated: string;
    uploadedDocuments: UploadedDocument[];
    reportReady?: boolean;
    savedCalculationId?: string;
}

interface ZakatPersistenceContextType {
    formData: ZakatFormData;
    setFormData: React.Dispatch<React.SetStateAction<ZakatFormData>>;
    stepIndex: number;
    updateFormData: (updates: Partial<ZakatFormData>) => void;
    setStepIndex: React.Dispatch<React.SetStateAction<number>>;
    uploadedDocuments: UploadedDocument[];
    addDocument: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => UploadedDocument;
    removeDocument: (docId: string) => void;
    hasExistingSession: boolean;
    lastUpdated: Date | null;
    continueSession: () => void;
    startFresh: () => void;
    resetCalculator: () => void;
    isLoaded: boolean;
    reportReady: boolean;
    markReportReady: () => void;
    savedCalculationId?: string;
    setSavedCalculationId: React.Dispatch<React.SetStateAction<string | undefined>>;
    loadCalculation: (data: ZakatFormData, id: string) => void;
    saveToLocalHistory: (currentFormData: ZakatFormData, currentId?: string) => Promise<string>;
}

const ZakatPersistenceContext = createContext<ZakatPersistenceContextType | null>(null);

export function ZakatPersistenceProvider({ children }: { children: ReactNode }) {
    const [formData, setFormData] = useState<ZakatFormData>(defaultFormData);
    const [stepIndex, setStepIndex] = useState(0);
    const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
    const [reportReady, setReportReady] = useState(false);
    const [hasExistingSession, setHasExistingSession] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [sessionDismissed, setSessionDismissed] = useState(false);
    const [savedCalculationId, setSavedCalculationId] = useState<string | undefined>();

    // Load from localStorage on mount (async due to encryption)
    useEffect(() => {
        async function loadData() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                console.debug('[Persistence] Loading data from storage. Exists?', !!stored);
                if (!stored) {
                    setIsLoaded(true);
                    return;
                }

                let parsed: PersistedData | null = null;

                // Try to decrypt with unified encryption (handles both vault and session)
                if (isVaultEncrypted(stored) || isSessionEncrypted(stored)) {
                    console.debug('[Persistence] Detected encrypted session');
                    parsed = await decryptData<PersistedData>(stored);
                }

                // If decryption failed or data is legacy format, try legacy decode
                if (!parsed) {
                    console.debug('[Persistence] Attempting legacy decode (or decryption failed)');
                    parsed = deobfuscateLegacy<PersistedData>(stored);
                }

                if (parsed) {
                    console.debug('[Persistence] Data parsed successfully. StepIndex:', parsed.stepIndex, 'ReportReady:', parsed.reportReady);
                    // Check if there's meaningful progress (beyond step 0)
                    if (parsed.stepIndex > 0 || parsed.reportReady) {
                        setHasExistingSession(true);
                        setLastUpdated(new Date(parsed.lastUpdated));
                    }
                    setFormData(parsed.formData);
                    setStepIndex(parsed.stepIndex);
                    setUploadedDocuments(parsed.uploadedDocuments || []);
                    setReportReady(parsed.reportReady || false);
                    setSavedCalculationId(parsed.savedCalculationId);
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
                reportReady,
                savedCalculationId
            };

            try {
                // console.debug('[Persistence] Saving data. StepIndex:', stepIndex, 'ReportReady:', reportReady);
                const encrypted = await encryptData(data);
                localStorage.setItem(STORAGE_KEY, encrypted);
            } catch (e) {
                console.error('Failed to save data:', e);
            }
        }

        saveData();
    }, [formData, stepIndex, uploadedDocuments, isLoaded, reportReady, savedCalculationId]);

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
        setSessionDismissed(true);
        // stepIndex is already loaded
    }, []);

    const startFresh = useCallback(() => {
        setFormData(defaultFormData);
        setStepIndex(0);
        setUploadedDocuments([]);
        setHasExistingSession(false);
        setSessionDismissed(true);
        setReportReady(false);
        setSavedCalculationId(undefined); // Clear ID to start new report
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const resetCalculator = useCallback(() => {
        setFormData(defaultFormData);
        setStepIndex(0);
        setUploadedDocuments([]);
        setReportReady(false);
        setSavedCalculationId(undefined);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // Only show dialog on initial load, not when navigating within active session
    const showSessionDialog = hasExistingSession && !sessionDismissed;

    // Internal helper to save report to local history (Guest)
    const saveToLocalHistory = useCallback(async (currentFormData: ZakatFormData, currentId?: string) => {
        try {
            // 1. Generate ID if needed
            const id = currentId || uuidv4();
            const now = new Date();

            // 2. Prepare payload
            const payload = {
                id,
                name: `Calculation ${now.toLocaleDateString()}`,
                formData: currentFormData,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
            };

            // 3. Encrypt payload
            const encryptedPayload = await encryptData(payload);

            // 4. Load history
            const historyRaw = localStorage.getItem(HISTORY_STORAGE_KEY);
            let history: string[] = [];
            if (historyRaw) {
                try {
                    history = JSON.parse(historyRaw);
                } catch (e) {
                    console.error("Failed to parse history", e);
                }
            }

            // 5. Update or Append
            const decryptedHistoryPromises = history.map(async (item) => {
                try {
                    return await decryptData<any>(item);
                } catch { return null; }
            });

            const decryptedHistory = (await Promise.all(decryptedHistoryPromises)).filter(Boolean);

            const existingIndex = decryptedHistory.findIndex((h: any) => h.id === id);

            if (existingIndex >= 0) {
                // Update existing
                decryptedHistory[existingIndex] = payload;
            } else {
                // Append new
                decryptedHistory.unshift(payload); // Newest first
            }

            // 6. Re-encrypt all
            const reEncryptedHistoryPromises = decryptedHistory.map(item => encryptData(item));
            const reEncryptedHistory = await Promise.all(reEncryptedHistoryPromises);

            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(reEncryptedHistory));

            return id;

        } catch (e) {
            console.error("Failed to save local history", e);
            return currentId || '';
        }
    }, []);

    const markReportReady = useCallback(() => {
        console.debug('[Persistence] Marking report ready');
        setReportReady(true);
    }, []);

    // Explicitly load a calculation into the active session
    const loadCalculation = useCallback((data: ZakatFormData, id: string) => {
        setFormData(data);
        setSavedCalculationId(id);
        setStepIndex(0);
        setReportReady(true);
        setHasExistingSession(false);
        setSessionDismissed(true);
    }, []);

    const value = {
        formData,
        setFormData,
        stepIndex,
        updateFormData,
        setStepIndex,
        uploadedDocuments,
        addDocument,
        removeDocument,
        hasExistingSession: showSessionDialog,
        lastUpdated,
        continueSession,
        startFresh,
        resetCalculator,
        isLoaded,
        reportReady,
        markReportReady,
        savedCalculationId,
        setSavedCalculationId,
        loadCalculation,
        saveToLocalHistory
    };

    return (
        <ZakatPersistenceContext.Provider value={value}>
            {children}
        </ZakatPersistenceContext.Provider>
    );
}

export function useZakatPersistence() {
    const context = useContext(ZakatPersistenceContext);
    if (!context) {
        throw new Error('useZakatPersistence must be used within a ZakatPersistenceProvider');
    }
    return context;
}
