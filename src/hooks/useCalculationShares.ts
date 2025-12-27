import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CalculationShare {
  id: string;
  calculation_id: string;
  owner_id: string;
  shared_with_email: string;
  shared_with_user_id: string | null;
  created_at: string;
  accepted_at: string | null;
}

export function useCalculationShares(calculationId?: string) {
  const { user } = useAuth();
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
      setShares(data || []);
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

  const createShare = async (calculationId: string, email: string) => {
    if (!user) throw new Error('Must be logged in to share');
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Don't allow sharing with yourself
    if (normalizedEmail === user.email?.toLowerCase()) {
      throw new Error('Cannot share with yourself');
    }
    
    const { data, error } = await supabase
      .from('zakat_calculation_shares')
      .insert({
        calculation_id: calculationId,
        owner_id: user.id,
        shared_with_email: normalizedEmail,
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

  return {
    shares,
    loading,
    error,
    createShare,
    removeShare,
    refetch: fetchShares,
  };
}

export function useSharedCalculations() {
  const { user } = useAuth();
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
            accepted_at
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
        
        // Combine with share info
        const combined = (calcs || []).map(calc => ({
          ...calc,
          shareInfo: shares.find(s => s.calculation_id === calc.id),
          isShared: true,
        }));
        
        setCalculations(combined);
      } catch (err) {
        console.error('Error fetching shared calculations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedCalculations();
  }, [user]);

  return { calculations, loading };
}
