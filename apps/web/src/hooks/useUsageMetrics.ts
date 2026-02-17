/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/runtimeClient';

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


