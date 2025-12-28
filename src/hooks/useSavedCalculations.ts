import { useState, useEffect, useCallback } from 'react';
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

const ENCRYPTION_VERSION = 1;

export function useSavedCalculations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isReady, encrypt, decrypt } = useEncryptionKeys();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalculations = useCallback(async () => {
    if (!user) {
      setCalculations([]);
      return;
    }

    // Wait for encryption keys to be ready
    if (!isReady) {
      return;
    }

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
      return;
    }

    // Decrypt form_data for each calculation
    const decryptedData = await Promise.all(
      (data || []).map(async (calc) => {
        let formData: ZakatFormData;
        
        // Check if data is encrypted (encryption_version > 0)
        if (calc.encryption_version && calc.encryption_version > 0) {
          try {
            // form_data is stored as encrypted string
            const decrypted = await decrypt(calc.form_data as unknown as string);
            formData = decrypted as ZakatFormData;
          } catch (err) {
            console.error('Failed to decrypt calculation:', calc.id, err);
            // Return null to filter out failed decryptions
            return null;
          }
        } else {
          // Legacy unencrypted data
          formData = calc.form_data as unknown as ZakatFormData;
        }

        return {
          id: calc.id,
          name: calc.name,
          year_type: calc.year_type as 'lunar' | 'gregorian',
          year_value: calc.year_value,
          form_data: formData,
          zakat_due: calc.zakat_due ?? 0,
          is_above_nisab: calc.is_above_nisab ?? false,
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
  }, [user, toast, isReady, decrypt]);

  useEffect(() => {
    fetchCalculations();
  }, [fetchCalculations]);

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

    // Encrypt form data before saving
    const encryptedFormData = await encrypt(formData);
    if (!encryptedFormData) {
      toast({
        title: 'Encryption failed',
        description: 'Could not encrypt your data.',
        variant: 'destructive',
      });
      return null;
    }

    const { data, error } = await supabase
      .from('zakat_calculations')
      .insert({
        user_id: user.id,
        name,
        year_type: yearType,
        year_value: yearValue,
        form_data: encryptedFormData as any,
        zakat_due: result.zakatDue,
        is_above_nisab: result.isAboveNisab,
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
      title: 'Saved',
      description: `Calculation "${name}" has been saved securely.`,
    });

    await fetchCalculations();
    return data;
  };

  const updateCalculation = async (
    id: string,
    formData: ZakatFormData
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

    const result = calculateZakat(formData);

    // Encrypt form data before updating
    const encryptedFormData = await encrypt(formData);
    if (!encryptedFormData) {
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
        form_data: encryptedFormData as any,
        zakat_due: result.zakatDue,
        is_above_nisab: result.isAboveNisab,
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
