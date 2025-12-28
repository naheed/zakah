import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PeriodMetrics {
  calculations: number;
  totalAssets: number;
  totalZakat: number;
  uniqueSessions: number;
}

interface UsageMetrics {
  allTime: PeriodMetrics;
  currentMonth: PeriodMetrics;
  currentYear: PeriodMetrics;
  lastUpdated: string;
}

async function fetchUsageMetrics(): Promise<UsageMetrics> {
  const { data, error } = await supabase.functions.invoke('get-usage-metrics');
  
  if (error) {
    throw new Error('Failed to fetch usage metrics');
  }
  
  return data as UsageMetrics;
}

export function useUsageMetrics() {
  return useQuery({
    queryKey: ['usage-metrics'],
    queryFn: fetchUsageMetrics,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Format large numbers nicely (e.g., 1.2M, 450K)
export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B+`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M+`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K+`;
  }
  return `$${value.toLocaleString()}`;
}

export function formatCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M+`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K+`;
  }
  return value.toLocaleString();
}
