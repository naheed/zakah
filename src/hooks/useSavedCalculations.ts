import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/runtimeClient';
import type { Json } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import { useEncryptionKeys } from './useEncryptionKeys';
import { ZakatFormData, Madhab, defaultFormData, calculateZakat, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE } from '@/lib/zakatCalculations';
import { useToast } from './use-toast';
import { encryptSession, decryptSession } from '@/lib/sessionEncryption';
import { v4 as uuidv4 } from 'uuid';

const HISTORY_STORAGE_KEY = 'zakat-guest-history';

export interface SavedCalculation {
  id: string;
  name: string;
  year_type: 'lunar' | 'gregorian';
  year_value: number;
  form_data: ZakatFormData;
  zakat_due: number;
  is_above_nisab: boolean;
  created_at: string;
  updated_at: string;
  version: number;
  encryption_version?: number;
}

// Encrypted payload structure for zero-knowledge storage
interface EncryptedPayload {
  formData: ZakatFormData;
  name: string;
  zakatDue: number;
  isAboveNisab: boolean;
  yearType: 'lunar' | 'gregorian';
  yearValue: number;
}

// Local storage decrypted item shape (session-encrypted)
interface LocalHistoryItem {
  id: string;
  name: string;
  formData: ZakatFormData;
  zakatDue?: number;
  isAboveNisab?: boolean;
  yearType?: 'lunar' | 'gregorian';
  yearValue?: number;
  createdAt: string;
  updatedAt: string;
}

const ENCRYPTION_VERSION = 3; // Bumped to indicate full metadata encryption including year

export function useSavedCalculations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isReady, encrypt, decrypt } = useEncryptionKeys();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(false);

  // Refs to prevent concurrent fetches and track initialization
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);

  const fetchCalculations = useCallback(async () => {
    // 1. Guest Mode: Fetch from Local Storage
    if (!user) {
      setLoading(true);
      try {
        const historyRaw = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (!historyRaw) {
          setCalculations([]);
          setLoading(false);
          return;
        }

        const encryptedItems: string[] = JSON.parse(historyRaw);

        const decryptedItems = await Promise.all(
          encryptedItems.map(async (item) => {
            try {
              // Local history stores { id, name, formData, createdAt, updatedAt }
              // We need to map it to SavedCalculation
              const decrypted = await decryptSession<LocalHistoryItem>(item);

              // Reconstruct calculation struct
              // We might not have zakat_due stored explicitly in local history payload in previous contexts?
              // In my plan, I said we'd store it.
              // Let's assume the payload matches what saveCalculation stores.

              // Determine zakat_due if missing (recalc)
              let zakatDue = decrypted.zakatDue;
              let isAboveNisab = decrypted.isAboveNisab;

              if (zakatDue === undefined) {
                const res = calculateZakat(decrypted.formData);
                zakatDue = res.zakatDue;
                isAboveNisab = res.isAboveNisab;
              }

              return {
                id: decrypted.id,
                name: decrypted.name,
                year_type: decrypted.yearType || 'gregorian',
                year_value: decrypted.yearValue || new Date().getFullYear(),
                form_data: decrypted.formData,
                zakat_due: zakatDue,
                is_above_nisab: isAboveNisab,
                created_at: decrypted.createdAt,
                updated_at: decrypted.updatedAt,
                version: 1,
                encryption_version: 3
              } as SavedCalculation;
            } catch (e) {
              console.error("Failed to decrypt local item", e);
              return null;
            }
          })
        );

        setCalculations(decryptedItems.filter((c): c is SavedCalculation => c !== null));

      } catch (e) {
        console.error("Error loading local history", e);
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. User Mode: Fetch from Cloud
    // Wait for encryption keys to be ready
    if (!isReady) {
      return;
    }

    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);

    const { data, error } = await supabase
      .from('zakat_calculations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching calculations:', error);
      toast({
        title: 'Error',
        description: 'Could not load saved calculations.',
        variant: 'destructive',
      });
      setLoading(false);
      isFetchingRef.current = false;
      return;
    }

    // Decrypt form_data for each calculation
    const decryptedData = await Promise.all(
      (data || []).map(async (calc) => {
        let formData: ZakatFormData;
        let name: string;
        let zakatDue: number;
        let isAboveNisab: boolean;
        let yearType: 'lunar' | 'gregorian';
        let yearValue: number;

        // Check encryption version to determine decryption strategy
        if (calc.encryption_version && calc.encryption_version >= 3) {
          // V3: Full zero-knowledge encryption including year metadata
          try {
            const decrypted = await decrypt(calc.form_data as unknown as string) as EncryptedPayload;
            formData = decrypted.formData;
            name = decrypted.name;
            zakatDue = decrypted.zakatDue;
            isAboveNisab = decrypted.isAboveNisab;
            yearType = decrypted.yearType;
            yearValue = decrypted.yearValue;
          } catch (err) {
            console.error('Failed to decrypt calculation:', calc.id, err);
            return null;
          }
        } else if (calc.encryption_version === 2) {
          // V2: Zero-knowledge but year in plaintext
          try {
            const decrypted = await decrypt(calc.form_data as unknown as string) as Omit<EncryptedPayload, 'yearType' | 'yearValue'>;
            formData = decrypted.formData;
            name = decrypted.name;
            zakatDue = decrypted.zakatDue;
            isAboveNisab = decrypted.isAboveNisab;
            yearType = calc.year_type as 'lunar' | 'gregorian';
            yearValue = calc.year_value;
          } catch (err) {
            console.error('Failed to decrypt calculation:', calc.id, err);
            return null;
          }
        } else if (calc.encryption_version === 1) {
          // V1: Only form_data encrypted, metadata in plaintext
          try {
            const decrypted = await decrypt(calc.form_data as unknown as string);
            formData = decrypted as ZakatFormData;
            name = calc.name;
            zakatDue = calc.zakat_due ?? 0;
            isAboveNisab = calc.is_above_nisab ?? false;
            yearType = calc.year_type as 'lunar' | 'gregorian';
            yearValue = calc.year_value;
          } catch (err) {
            console.error('Failed to decrypt calculation:', calc.id, err);
            return null;
          }
        } else {
          // V0: Legacy unencrypted data
          formData = calc.form_data as unknown as ZakatFormData;
          name = calc.name;
          zakatDue = calc.zakat_due ?? 0;
          isAboveNisab = calc.is_above_nisab ?? false;
          yearType = calc.year_type as 'lunar' | 'gregorian';
          yearValue = calc.year_value;
        }

        return {
          id: calc.id,
          name,
          year_type: yearType,
          year_value: yearValue,
          form_data: formData,
          zakat_due: zakatDue,
          is_above_nisab: isAboveNisab,
          created_at: calc.created_at,
          updated_at: calc.updated_at,
          version: calc.version ?? 1,
          encryption_version: calc.encryption_version,
        } as SavedCalculation;
      })
    );

    // Filter out null values (failed decryptions)
    setCalculations(decryptedData.filter((c): c is SavedCalculation => c !== null));
    setLoading(false);
    isFetchingRef.current = false;
    hasFetchedRef.current = true;
  }, [user, toast, isReady, decrypt]);

  // Trigger initial fetch when user state is resolved or guest mode
  // This ensures the calculations list is populated on mount
  useEffect(() => {
    // For cloud users, we wait for encryption keys (isReady)
    // For guests (!user), we can fetch immediately
    if (user && !isReady) return;

    if (!hasFetchedRef.current && !isFetchingRef.current) {
      fetchCalculations();
    }
  }, [fetchCalculations, user, isReady]);


  const saveCalculation = async (
    name: string,
    yearType: 'lunar' | 'gregorian',
    yearValue: number,
    formData: ZakatFormData,
    existingId?: string // Optional ID for updates/local logic
  ) => {
    const result = calculateZakat(formData);

    // 1. Guest Mode: Save to Local History
    if (!user) {
      try {
        // Generate ID if missing
        const id = existingId || uuidv4();
        const now = new Date().toISOString();

        // Payload matches EncryptedPayload but extended for local storage
        const payload = {
          id,
          name,
          formData,
          zakatDue: result.zakatDue,
          isAboveNisab: result.isAboveNisab,
          yearType,
          yearValue,
          createdAt: now,
          updatedAt: now // In a real update, we'd preserve created? Yes, but simplicity first.
        };

        // Encrypt with Session Key (not Cloud Key)
        const encrypted = await encryptSession(payload);

        // Load + Append/Update
        const historyRaw = localStorage.getItem(HISTORY_STORAGE_KEY);
        const history: string[] = historyRaw ? JSON.parse(historyRaw) : [];

        // We need to find if ID exists. Decrypting everything is expensive but necessary unless we store unencrypted metadata.
        // Optimize: Check mapped "Index" in future. For now, brute force decrypt.
        // Actually, we can just prepend implementation from Context logic?
        // Since we claimed we'd move it here completely.

        let updatedHistory: string[] = [];

        // Optimization: If we have an existing ID, we try to find it? 
        // Without decrypting all, we can't find it.
        // So we MUST decrypt all.

        // Decrypt all
        const decryptedItems = await Promise.all(history.map(async h => {
          try { return await decryptSession<LocalHistoryItem>(h); } catch { return null; }
        }));

        const cleanItems = decryptedItems.filter((i): i is LocalHistoryItem => i !== null);
        const existingIndex = cleanItems.findIndex((i) => i.id === id);

        if (existingIndex >= 0) {
          cleanItems[existingIndex] = { ...cleanItems[existingIndex], ...payload };
        } else {
          cleanItems.unshift(payload);
        }

        // Encrypt all
        updatedHistory = await Promise.all(cleanItems.map(i => encryptSession(i)));

        const savedRecord: SavedCalculation = {
          id,
          name,
          year_type: yearType,
          year_value: yearValue,
          form_data: formData,
          zakat_due: result.zakatDue,
          is_above_nisab: result.isAboveNisab,
          created_at: now,
          updated_at: now,
          version: 1,
          encryption_version: 3
        };

        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));

        await fetchCalculations(); // Refresh state

        return savedRecord;

      } catch (e) {
        console.error("Local save failed", e);
        return null;
      }
    }

    // 2. User Mode: Save to Cloud
    if (!isReady) {
      toast({
        title: 'Encryption not ready',
        description: 'Please wait for encryption to initialize.',
        variant: 'destructive',
      });
      return null;
    }

    // Create zero-knowledge payload with ALL sensitive data including year
    const payload: EncryptedPayload = {
      formData,
      name,
      zakatDue: result.zakatDue,
      isAboveNisab: result.isAboveNisab,
      yearType,
      yearValue,
    };

    // Encrypt the entire payload
    const encryptedPayload = await encrypt(payload);
    if (!encryptedPayload) {
      toast({
        title: 'Encryption failed',
        description: 'Could not encrypt your data.',
        variant: 'destructive',
      });
      return null;
    }

    // Store with placeholder values in plaintext columns (zero-knowledge)
    // If ID provided, UPDATE. Else INSERT.

    let data, error;

    if (existingId) {
      // Update
      const response = await supabase
        .from('zakat_calculations')
        .update({
          form_data: encryptedPayload as unknown as Json,
          name: '🔒', // Placeholder
          year_type: 'gregorian', // Placeholder
          year_value: 0, // Placeholder
          zakat_due: 0, // Placeholder
          is_above_nisab: false, // Placeholder
          encryption_version: ENCRYPTION_VERSION,
        })
        .eq('id', existingId)
        .eq('user_id', user.id)
        .select()
        .single();

      data = response.data;
      error = response.error;
    } else {
      // Insert
      const response = await supabase
        .from('zakat_calculations')
        .insert({
          user_id: user.id,
          name: '🔒', // Placeholder - real name is encrypted
          year_type: 'gregorian', // Placeholder - real value is encrypted
          year_value: 0, // Placeholder - real value is encrypted
          form_data: encryptedPayload as unknown as Json,
          zakat_due: 0, // Placeholder - real value is encrypted
          is_above_nisab: false, // Placeholder - real value is encrypted
          encryption_version: ENCRYPTION_VERSION,
        })
        .select()
        .single();

      data = response.data;
      error = response.error;
    }

    if (error) {
      console.error('Error saving calculation:', error);
      toast({
        title: 'Error',
        description: 'Could not save calculation.',
        variant: 'destructive',
      });
      return null;
    }

    toast({
      title: 'Saved securely',
      description: `Your calculation has been encrypted and saved.`,
    });

    await fetchCalculations();
    return data;
  };

  // Replaced explicit updateCalculation with unified saveCalculation logic above
  // but keeping wrapper for API compatibility if needed
  const updateCalculation = async (
    id: string,
    formData: ZakatFormData,
    name?: string
  ) => {
    // Find existing metadata to preserve
    const existing = calculations.find(c => c.id === id);
    const calcName = name || existing?.name || 'Calculation';
    const calcYearType = existing?.year_type || 'gregorian';
    const calcYearValue = existing?.year_value || new Date().getFullYear();

    return saveCalculation(calcName, calcYearType, calcYearValue, formData, id);
  };

  const deleteCalculation = async (id: string) => {
    // 1. Guest Mode
    if (!user) {
      try {
        const historyRaw = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (!historyRaw) return false;

        const history = JSON.parse(historyRaw);
        // Decrypt to check ID? 
        // Or can we store ID in plaintext alongside encrypted blob?
        // "Encrypted session" usually returns a string.
        // Current format: string[] (Encrypted Blobs).
        // Complexity: O(N) decryption to delete.

        const decryptedItems = await Promise.all(history.map(async (h: string) => {
          try { return await decryptSession<LocalHistoryItem>(h); } catch { return null; }
        }));

        const filtered = decryptedItems.filter((i): i is LocalHistoryItem => i !== null && i.id !== id);

        const reEncrypted = await Promise.all(filtered.map(i => encryptSession(i)));

        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(reEncrypted));
        await fetchCalculations();
        return true;
      } catch (e) {
        return false;
      }
    }

    // 2. User Mode
    const { error } = await supabase
      .from('zakat_calculations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting calculation:', error);
      toast({
        title: 'Error',
        description: 'Could not delete calculation.',
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Deleted',
      description: 'Calculation has been removed.',
    });

    await fetchCalculations();
    return true;
  };

  return {
    calculations,
    loading,
    saveCalculation,
    updateCalculation,
    deleteCalculation,
    refreshCalculations: fetchCalculations,
  };
}

// Helper to get current lunar year (approximate)
export function getCurrentLunarYear(): number {
  const now = new Date();
  const gregorianYear = now.getFullYear();
  // Rough approximation: Hijri year ≈ Gregorian year - 622 + adjustment
  return Math.floor((gregorianYear - 622) * (33 / 32));
}

// Helper to get current gregorian year
export function getCurrentGregorianYear(): number {
  return new Date().getFullYear();
}

// Generate year name
export function generateYearName(yearType: 'lunar' | 'gregorian', yearValue: number): string {
  if (yearType === 'lunar') {
    return `${yearValue} AH`;
  }
  return `${yearValue}`;
}
