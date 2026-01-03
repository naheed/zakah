import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEncryptionKeys } from './useEncryptionKeys';
import { ZakatFormData, calculateZakat } from '@/lib/zakatCalculations';
import { useToast } from './use-toast';

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
    if (!user) {
      setCalculations([]);
      return;
    }

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

  const saveCalculation = async (
    name: string,
    yearType: 'lunar' | 'gregorian',
    yearValue: number,
    formData: ZakatFormData
  ) => {
    if (!user) {
      toast({
        title: 'Not signed in',
        description: 'Please sign in to save your calculation.',
        variant: 'destructive',
      });
      return null;
    }

    if (!isReady) {
      toast({
        title: 'Encryption not ready',
        description: 'Please wait for encryption to initialize.',
        variant: 'destructive',
      });
      return null;
    }

    const result = calculateZakat(formData);

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
    const { data, error } = await supabase
      .from('zakat_calculations')
      .insert({
        user_id: user.id,
        name: '🔒', // Placeholder - real name is encrypted
        year_type: 'gregorian', // Placeholder - real value is encrypted
        year_value: 0, // Placeholder - real value is encrypted
        form_data: encryptedPayload as any,
        zakat_due: 0, // Placeholder - real value is encrypted
        is_above_nisab: false, // Placeholder - real value is encrypted
        encryption_version: ENCRYPTION_VERSION,
      })
      .select()
      .single();

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

  const updateCalculation = async (
    id: string,
    formData: ZakatFormData,
    name?: string
  ) => {
    if (!user) return null;

    if (!isReady) {
      toast({
        title: 'Encryption not ready',
        description: 'Please wait for encryption to initialize.',
        variant: 'destructive',
      });
      return null;
    }

    // Get existing calculation to preserve name and year if not provided
    const existing = calculations.find(c => c.id === id);
    const calcName = name || existing?.name || 'Calculation';
    const calcYearType = existing?.year_type || 'gregorian';
    const calcYearValue = existing?.year_value || new Date().getFullYear();

    const result = calculateZakat(formData);

    // Create zero-knowledge payload with year metadata
    const payload: EncryptedPayload = {
      formData,
      name: calcName,
      zakatDue: result.zakatDue,
      isAboveNisab: result.isAboveNisab,
      yearType: calcYearType,
      yearValue: calcYearValue,
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

    const { error } = await supabase
      .from('zakat_calculations')
      .update({
        form_data: encryptedPayload as any,
        name: '🔒', // Placeholder
        year_type: 'gregorian', // Placeholder
        year_value: 0, // Placeholder
        zakat_due: 0, // Placeholder
        is_above_nisab: false, // Placeholder
        encryption_version: ENCRYPTION_VERSION,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating calculation:', error);
      toast({
        title: 'Error',
        description: 'Could not update calculation.',
        variant: 'destructive',
      });
      return null;
    }

    await fetchCalculations();
    return true;
  };

  const deleteCalculation = async (id: string) => {
    if (!user) return false;

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
