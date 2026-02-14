import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // Assuming we have types, if not I'll use any for now or generate them
// Since I don't have the generated types file handy in the file list (I see tsconfig but not types), I'll mock the return type for now.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
