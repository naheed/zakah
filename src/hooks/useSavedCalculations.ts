import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
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
}

export function useSavedCalculations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalculations = useCallback(async () => {
    if (!user) {
      setCalculations([]);
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
    } else {
      // Cast form_data from Json to ZakatFormData
      const typedData = (data || []).map(calc => ({
        ...calc,
        year_type: calc.year_type as 'lunar' | 'gregorian',
        form_data: calc.form_data as unknown as ZakatFormData,
        version: (calc as { version?: number }).version ?? 1,
      }));
      setCalculations(typedData);
    }
    setLoading(false);
  }, [user, toast]);

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

    const result = calculateZakat(formData);

    const { data, error } = await supabase
      .from('zakat_calculations')
      .insert({
        user_id: user.id,
        name,
        year_type: yearType,
        year_value: yearValue,
        form_data: formData as any,
        zakat_due: result.zakatDue,
        is_above_nisab: result.isAboveNisab,
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
      description: `Calculation "${name}" has been saved.`,
    });

    await fetchCalculations();
    return data;
  };

  const updateCalculation = async (
    id: string,
    formData: ZakatFormData
  ) => {
    if (!user) return null;

    const result = calculateZakat(formData);

    const { error } = await supabase
      .from('zakat_calculations')
      .update({
        form_data: formData as any,
        zakat_due: result.zakatDue,
        is_above_nisab: result.isAboveNisab,
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
