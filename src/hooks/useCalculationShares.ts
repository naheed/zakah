import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEncryptionKeys } from './useEncryptionKeys';
import { ZakatFormData } from '@/lib/zakatCalculations';

export interface CalculationShare {
  id: string;
  calculation_id: string;
  owner_id: string;
  shared_with_email: string;
  shared_with_user_id: string | null;
  created_at: string;
  accepted_at: string | null;
  encrypted_form_data: string | null;
  encrypted_symmetric_key: string | null;
}

export function useCalculationShares(calculationId?: string) {
  const { user } = useAuth();
  const { isReady, encrypt, encryptForSharing } = useEncryptionKeys();
  const [shares, setShares] = useState<CalculationShare[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShares = async () => {
    if (!calculationId || !user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('zakat_calculation_shares')
        .select('*')
        .eq('calculation_id', calculationId);
      
      if (fetchError) throw fetchError;
      setShares((data || []) as CalculationShare[]);
    } catch (err: any) {
      console.error('Error fetching shares:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShares();
  }, [calculationId, user]);

  const createShare = async (calculationId: string, email: string, formData?: ZakatFormData) => {
    if (!user) throw new Error('Must be logged in to share');
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Don't allow sharing with yourself
    if (normalizedEmail === user.email?.toLowerCase()) {
      throw new Error('Cannot share with yourself');
    }

    // Try to get recipient's public key to encrypt data for them
    let encryptedData: string | null = null;
    let encryptedKey: string | null = null;

    // Note: We'll encrypt data when recipient logs in and we have their public key
    // For now, just create the share - encryption happens on recipient's first access
    
    const { data, error } = await supabase
      .from('zakat_calculation_shares')
      .insert({
        calculation_id: calculationId,
        owner_id: user.id,
        shared_with_email: normalizedEmail,
        encrypted_form_data: encryptedData,
        encrypted_symmetric_key: encryptedKey,
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        throw new Error('Already shared with this email');
      }
      throw error;
    }
    
    await fetchShares();
    return data;
  };

  const removeShare = async (shareId: string) => {
    if (!user) throw new Error('Must be logged in');
    
    const { error } = await supabase
      .from('zakat_calculation_shares')
      .delete()
      .eq('id', shareId);
    
    if (error) throw error;
    await fetchShares();
  };

  // Update encrypted data for existing share when recipient's public key becomes available
  const updateShareEncryption = useCallback(async (
    shareId: string, 
    formData: ZakatFormData,
    recipientPublicKey: string
  ) => {
    if (!isReady) return false;

    const encrypted = await encryptForSharing(formData, recipientPublicKey);
    if (!encrypted) return false;

    const { error } = await supabase
      .from('zakat_calculation_shares')
      .update({
        encrypted_form_data: encrypted.encryptedData,
        encrypted_symmetric_key: encrypted.encryptedKey,
      })
      .eq('id', shareId);

    if (error) {
      console.error('Error updating share encryption:', error);
      return false;
    }

    await fetchShares();
    return true;
  }, [isReady, encryptForSharing]);

  return {
    shares,
    loading,
    error,
    createShare,
    removeShare,
    updateShareEncryption,
    refetch: fetchShares,
  };
}

export function useSharedCalculations() {
  const { user } = useAuth();
  const { isReady, decryptShared } = useEncryptionKeys();
  const [calculations, setCalculations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedCalculations = async () => {
      if (!user) {
        setCalculations([]);
        setLoading(false);
        return;
      }

      try {
        // Get calculations shared with me (through the shares table)
        const { data: shares, error: sharesError } = await supabase
          .from('zakat_calculation_shares')
          .select(`
            id,
            calculation_id,
            owner_id,
            created_at,
            accepted_at,
            encrypted_form_data,
            encrypted_symmetric_key
          `)
          .or(`shared_with_user_id.eq.${user.id},shared_with_email.eq.${user.email}`);
        
        if (sharesError) throw sharesError;
        
        if (!shares || shares.length === 0) {
          setCalculations([]);
          setLoading(false);
          return;
        }

        // Get the actual calculations
        const calculationIds = shares.map(s => s.calculation_id);
        const { data: calcs, error: calcsError } = await supabase
          .from('zakat_calculations')
          .select('*')
          .in('id', calculationIds);
        
        if (calcsError) throw calcsError;
        
        // Combine with share info and decrypt if possible
        const combined = await Promise.all(
          (calcs || []).map(async (calc) => {
            const shareInfo = shares.find(s => s.calculation_id === calc.id);
            let decryptedFormData = null;

            // Try to decrypt the shared data
            if (
              isReady &&
              shareInfo?.encrypted_form_data &&
              shareInfo?.encrypted_symmetric_key
            ) {
              try {
                decryptedFormData = await decryptShared(
                  shareInfo.encrypted_form_data,
                  shareInfo.encrypted_symmetric_key
                );
              } catch (err) {
                console.error('Failed to decrypt shared calculation:', err);
              }
            }

            return {
              ...calc,
              form_data: decryptedFormData || calc.form_data,
              shareInfo,
              isShared: true,
              isDecrypted: !!decryptedFormData,
            };
          })
        );
        
        setCalculations(combined);
      } catch (err) {
        console.error('Error fetching shared calculations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedCalculations();
  }, [user, isReady, decryptShared]);

  return { calculations, loading };
}
