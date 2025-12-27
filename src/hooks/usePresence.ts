import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface PresenceUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  lastSeen: string;
  currentStep?: string;
}

interface PresenceState {
  [key: string]: PresenceUser[];
}

export function usePresence(calculationId: string | undefined) {
  const { user } = useAuth();
  const [presentUsers, setPresentUsers] = useState<PresenceUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const updatePresence = useCallback(async (currentStep?: string) => {
    if (!channelRef.current || !user) return;

    const presenceData: PresenceUser = {
      id: user.id,
      email: user.email || '',
      fullName: user.user_metadata?.full_name,
      avatarUrl: user.user_metadata?.avatar_url,
      lastSeen: new Date().toISOString(),
      currentStep,
    };

    try {
      await channelRef.current.track(presenceData);
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!calculationId || !user) {
      setPresentUsers([]);
      setIsConnected(false);
      return;
    }

    const channelName = `presence:calculation:${calculationId}`;
    console.log('Joining presence channel:', channelName);

    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceUser>();
        console.log('Presence sync:', state);
        
        // Flatten presence state and filter out current user
        const users: PresenceUser[] = [];
        Object.values(state).forEach((presences) => {
          presences.forEach((presence) => {
            if (presence.id !== user.id) {
              users.push(presence);
            }
          });
        });
        
        setPresentUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        console.log('Presence channel status:', status);
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          // Track initial presence
          await updatePresence();
        }
      });

    // Heartbeat to keep presence active
    const heartbeatInterval = setInterval(() => {
      if (channelRef.current) {
        updatePresence();
      }
    }, 30000); // Every 30 seconds

    return () => {
      console.log('Leaving presence channel:', channelName);
      clearInterval(heartbeatInterval);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [calculationId, user, updatePresence]);

  return {
    presentUsers,
    isConnected,
    updatePresence,
  };
}
