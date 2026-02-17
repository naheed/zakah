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

interface NisabData {
    date: string;
    gold_price: number;
    silver_price: number;
    currency: string;
}

export function useNisab(date?: Date) {
    // ISO date string YYYY-MM-DD
    const dateStr = (date || new Date()).toISOString().split('T')[0];

    return useQuery({
        queryKey: ['nisab', dateStr],
        queryFn: async (): Promise<NisabData | null> => {
            // 1. Try to get from DB
            const { data, error } = await supabase
                .from('nisab_values')
                .select('*')
                .eq('date', dateStr)
                .single();

            if (data) {
                return data as NisabData;
            }

            // 2. If for today and missing, trigger Edge Function (Lazy Load)
            // Only do this if we are looking for TODAY or a recent past date that should exist?
            // For now, let's just trigger it if it's today.
            const todayStr = new Date().toISOString().split('T')[0];
            if (dateStr === todayStr) {
                const { data: funcData, error: funcError } = await supabase.functions.invoke('fetch-daily-nisab', {
                    body: { mode: 'daily' }
                });

                if (funcError) {
                    console.error("Failed to fetch latest nisab from Edge Function", funcError);
                    return null;
                }

                // The function returns { success: true, latest: { ... } }
                if (funcData?.latest) {
                    return funcData.latest as NisabData;
                }
            }

            return null;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
