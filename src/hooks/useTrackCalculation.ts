import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/runtimeClient';

// Generate a stable session ID stored in sessionStorage
function getOrCreateSessionId(): string {
  const key = 'zakat_session_id';
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    // Generate a random session ID
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    sessionId = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem(key, sessionId);
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

const REFERRAL_CODE_KEY = 'zakat_referred_by';

interface TrackCalculationParams {
  totalAssets: number;
  zakatDue: number;
}

export function useTrackCalculation() {
  const hasTrackedRef = useRef(false);

  const trackCalculation = useCallback(async ({ totalAssets, zakatDue }: TrackCalculationParams) => {
    // Only track once per session
    if (hasTrackedRef.current) {
      return;
    }

    // Only track meaningful calculations (above 0)
    if (totalAssets <= 0) {
      return;
    }

    hasTrackedRef.current = true;

    try {
      const sessionId = getOrCreateSessionId();
      const sessionHash = await hashSessionId(sessionId);
      
      // Check if user came from a referral link
      const referredBy = sessionStorage.getItem(REFERRAL_CODE_KEY);

      // Fire and forget - don't wait for response
      supabase.functions.invoke('track-zakat-calculation', {
        body: {
          sessionHash,
          totalAssets,
          zakatDue,
          referredBy: referredBy || undefined,
        },
      }).then(({ error }) => {
        if (error) {
          console.error('Failed to track calculation:', error);
        }
      });
    } catch (error) {
      // Silently fail - tracking should never block the user
      console.error('Error in trackCalculation:', error);
    }
  }, []);

  return { trackCalculation };
}
