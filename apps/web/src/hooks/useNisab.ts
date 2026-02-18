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
            // 1. Try to get most recent entry on or before the requested date
            // This handles weekends, holidays, and days before market updates
            const { data, error } = await supabase
                .from('nisab_values')
                .select('*')
                .lte('date', dateStr)
                .order('date', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (data) {
                return data as NisabData;
            }

            // 2. No data at all in DB — trigger Edge Function to seed initial data
            const { data: funcData, error: funcError } = await supabase.functions.invoke('fetch-daily-nisab', {
                body: { mode: 'daily' }
            });

            if (funcError) {
                console.error("Failed to fetch latest nisab from Edge Function", funcError);
                return null;
            }

            if (funcData?.latest) {
                return funcData.latest as NisabData;
            }

            return null;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
