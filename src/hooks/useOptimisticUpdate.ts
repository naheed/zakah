import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ZakatFormData } from '@/lib/zakatCalculations';
import { Json } from '@/integrations/supabase/types';

interface UpdateResult {
  success: boolean;
  newVersion: number;
  conflictData?: ZakatFormData;
}

export function useOptimisticUpdate() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<number>(1);

  const updateCalculation = useCallback(async (
    calculationId: string,
    userId: string,
    formData: ZakatFormData,
    name: string,
    zakatDue: number,
    isAboveNisab: boolean,
    expectedVersion: number
  ): Promise<UpdateResult> => {
    setIsUpdating(true);
    
    try {
      const { data, error } = await supabase.rpc('update_calculation_with_version', {
        p_id: calculationId,
        p_user_id: userId,
        p_form_data: formData as unknown as Json,
        p_name: name,
        p_zakat_due: zakatDue,
        p_is_above_nisab: isAboveNisab,
        p_expected_version: expectedVersion,
      });

      if (error) {
        console.error('Error updating calculation:', error);
        toast({
          title: "Update failed",
          description: "Could not save changes. Please try again.",
          variant: "destructive",
        });
        return { success: false, newVersion: expectedVersion };
      }

      const result = data?.[0];
      
      if (!result?.success) {
        // Version conflict - another user updated the document
        console.log('Version conflict detected:', result);
        toast({
          title: "Changes conflict",
          description: "Someone else updated this calculation. Please review the latest changes.",
          variant: "destructive",
        });
        
        setCurrentVersion(result?.new_version || expectedVersion);
        
        return {
          success: false,
          newVersion: result?.new_version || expectedVersion,
          conflictData: result?.current_data as unknown as ZakatFormData,
        };
      }

      setCurrentVersion(result.new_version);
      return { success: true, newVersion: result.new_version };
      
    } catch (error) {
      console.error('Error in optimistic update:', error);
      return { success: false, newVersion: expectedVersion };
    } finally {
      setIsUpdating(false);
    }
  }, [toast]);

  const fetchVersion = useCallback(async (calculationId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('zakat_calculations')
      .select('version')
      .eq('id', calculationId)
      .single();

    if (error || !data) {
      console.error('Error fetching version:', error);
      return 1;
    }

    const version = (data as { version?: number }).version ?? 1;
    setCurrentVersion(version);
    return version;
  }, []);

  return {
    updateCalculation,
    fetchVersion,
    currentVersion,
    setCurrentVersion,
    isUpdating,
  };
}
