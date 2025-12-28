import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const REFERRAL_CODE_KEY = 'zakat_referred_by';
const SESSION_ID_KEY = 'zakat_session_id';

// Get or create session ID (same as in useTrackCalculation)
function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    sessionId = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
}

// Hash the session ID using SHA-256
async function hashSessionId(sessionId: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(sessionId);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export interface ReferralStats {
  referralCode: string | null;
  totalReferrals: number;
  totalZakatCalculated: number;
  totalAssetsCalculated: number;
}

export function useReferral() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const hasGeneratedRef = useRef(false);

  // Get the referral code this user came from (if any)
  const getReferredBy = useCallback((): string | null => {
    return sessionStorage.getItem(REFERRAL_CODE_KEY);
  }, []);

  // Store a referral code when user arrives via invite link
  const storeReferralCode = useCallback((code: string) => {
    sessionStorage.setItem(REFERRAL_CODE_KEY, code);
  }, []);

  // Generate or fetch the user's own referral code for sharing
  const generateReferralCode = useCallback(async (): Promise<string | null> => {
    if (referralCode) return referralCode;
    if (isGenerating || hasGeneratedRef.current) return null;
    
    setIsGenerating(true);
    hasGeneratedRef.current = true;
    
    try {
      const sessionId = getOrCreateSessionId();
      const sessionHash = await hashSessionId(sessionId);

      const { data, error } = await supabase.functions.invoke('generate-referral-code', {
        body: {
          sessionHash,
          userId: user?.id || null,
        },
      });

      if (error) {
        console.error('Error generating referral code:', error);
        hasGeneratedRef.current = false;
        return null;
      }

      if (data?.code) {
        setReferralCode(data.code);
        return data.code;
      }

      hasGeneratedRef.current = false;
      return null;
    } catch (error) {
      console.error('Error in generateReferralCode:', error);
      hasGeneratedRef.current = false;
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [referralCode, isGenerating, user?.id]);

  // Fetch referral stats
  const fetchStats = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const sessionId = getOrCreateSessionId();
      const sessionHash = await hashSessionId(sessionId);

      const { data, error } = await supabase.functions.invoke('get-referral-stats', {
        body: {
          sessionHash,
          referralCode: referralCode || undefined,
        },
      });

      if (error) {
        console.error('Error fetching referral stats:', error);
        return;
      }

      if (data) {
        setStats({
          referralCode: data.referralCode,
          totalReferrals: data.totalReferrals || 0,
          totalZakatCalculated: data.totalZakatCalculated || 0,
          totalAssetsCalculated: data.totalAssetsCalculated || 0,
        });

        // If we got a referral code from stats, store it
        if (data.referralCode && !referralCode) {
          setReferralCode(data.referralCode);
        }
      }
    } catch (error) {
      console.error('Error in fetchStats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, referralCode]);

  // Get the invite URL for sharing
  const getInviteUrl = useCallback((code: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/invite/${code}`;
  }, []);

  return {
    referralCode,
    stats,
    isLoading,
    isGenerating,
    getReferredBy,
    storeReferralCode,
    generateReferralCode,
    fetchStats,
    getInviteUrl,
  };
}
