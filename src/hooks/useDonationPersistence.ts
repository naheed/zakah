/**
 * Donation Persistence Hook
 * 
 * Provides encrypted storage for donation tracking:
 * - Guest users: localStorage with session encryption
 * - Logged-in users: Supabase with E2E encryption
 * 
 * Follows same privacy patterns as ZakatPersistenceContext.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { encryptSession, decryptSession } from '@/lib/sessionEncryption';
import { Donation, ZakatYear, HawlSettings, DonationSummary, CalendarType } from '@/types/donations';
import { supabase } from '@/integrations/supabase/runtimeClient';
import { v4 as uuidv4 } from 'uuid';

const DONATIONS_STORAGE_KEY = 'zakat-donations';
const HAWL_STORAGE_KEY = 'zakat-hawl-settings';

interface LocalDonationData {
    donations: Donation[];
    hawlSettings?: HawlSettings;
    zakatYears: ZakatYear[];
    lastUpdated: string;
}

interface UseDonationPersistenceReturn {
    // Data
    donations: Donation[];
    hawlSettings: HawlSettings | null;
    currentZakatYear: ZakatYear | null;
    summary: DonationSummary | null;
    loading: boolean;

    // Actions
    addDonation: (donation: Omit<Donation, 'id' | 'user_id' | 'zakat_year_id' | 'created_at' | 'updated_at'>) => Promise<Donation>;
    updateDonation: (id: string, updates: Partial<Donation>) => Promise<void>;
    deleteDonation: (id: string) => Promise<void>;
    setHawlSettings: (date: string, calendarType: CalendarType) => Promise<void>;
    setCalculatedAmount: (amount: number, calculationId?: string) => Promise<void>;
    startNewYear: () => Promise<void>;
    refreshData: () => Promise<void>;
}

/**
 * Calculate days remaining until Hawl end
 */
/**
 * Calculate days remaining until Hawl end
 */
function calculateDaysRemaining(hawlEndStr: string): number {
    const hawlEnd = new Date(hawlEndStr);
    const now = new Date(); // local time
    // Do not auto-advance. Respect the DB's hawl_end.
    const diffMs = hawlEnd.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Generate a unique ID for local storage
 */
function generateLocalId(): string {
    return `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useDonationPersistence(): UseDonationPersistenceReturn {
    const { user } = useAuth();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [hawlSettings, setHawlSettingsState] = useState<HawlSettings | null>(null);
    const [currentZakatYear, setCurrentZakatYear] = useState<ZakatYear | null>(null);
    const [loading, setLoading] = useState(true);

    // Load data on mount and when user changes
    /**
     * Load from Supabase
     */
    const loadFromSupabase = useCallback(async () => {
        try {
            if (!user) return;
            const userId = user.id;

            // 1. Load Hawl Settings
            const { data: hawlData, error: hawlError } = await supabase
                .from('hawl_settings' as any)
                .select('*')
                .eq('user_id', userId)
                .single();

            if (hawlError && hawlError.code !== 'PGRST116') { // PGRST116 = no rows found
                console.error('[DonationPersistence] Error loading hawl settings:', hawlError);
            }

            // 2. Load Zakat Years
            const { data: yearsData, error: yearsError } = await supabase
                .from('zakat_years' as any)
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (yearsError) console.error('[DonationPersistence] Error loading zakat years:', yearsError);

            // 3. Load Donations
            const { data: donationsData, error: donationsError } = await supabase
                .from('donations' as any)
                .select('*')
                .eq('user_id', userId)
                .order('donation_date', { ascending: false });

            if (donationsError) console.error('[DonationPersistence] Error loading donations:', donationsError);

            // Set State
            if (hawlData) {
                setHawlSettingsState(hawlData as unknown as HawlSettings);
            }

            // Find current year
            const years = (yearsData || []) as unknown as ZakatYear[];
            const current = years.find(y => y.is_current) || years[0] || null;
            setCurrentZakatYear(current);

            setDonations((donationsData || []) as unknown as Donation[]);

            // --- MIGRATION LOGIC (Guest -> Cloud) ---
            // If local data exists, migrate it to Supabase
            const localRaw = localStorage.getItem(DONATIONS_STORAGE_KEY);
            if (localRaw) {
                try {
                    const localData = await decryptSession<LocalDonationData>(localRaw);
                    if (localData && (localData.donations.length > 0 || localData.hawlSettings)) {
                        console.log('[DonationPersistence] Migrating local data to cloud...');

                        // 1. Migrate Hawl Settings (if not already on server)
                        if (!hawlData && localData.hawlSettings) {
                            await setHawlSettings(localData.hawlSettings.hawl_start_date, localData.hawlSettings.calendar_type);
                        }

                        // 2. Migrate Zakat Years (if useful)
                        // Ideally we find the corresponding year or create new ones.
                        // For simplicity, we just link donations to the current zakat year we just loaded/created.
                        const yearId = current?.id || years[0]?.id; // Use loaded year ID

                        // 3. Migrate Donations
                        if (localData.donations.length > 0) {
                            const donationsToInsert = localData.donations.map(d => ({
                                user_id: userId,
                                zakat_year_id: yearId, // Link to cloud year ID
                                amount: d.amount,
                                recipient_name: d.recipient_name,
                                recipient_category: d.recipient_category,
                                donation_date: d.donation_date,
                                notes: d.notes,
                                receipt_url: d.receipt_url,
                                extracted_via_ai: d.extracted_via_ai
                            }));

                            const { error: migrationError } = await supabase
                                .from('donations' as any)
                                .insert(donationsToInsert);

                            if (migrationError) {
                                console.error("Migration failed", migrationError);
                            } else {
                                console.log("Migration successful, clearing local storage");
                                localStorage.removeItem(DONATIONS_STORAGE_KEY);
                                // Reload to reflect changes
                                return loadFromSupabase(); // Recursivetly call (safe as local storage is cleared)
                            }
                        } else {
                            // Just clear if only settings/metadata found
                            localStorage.removeItem(DONATIONS_STORAGE_KEY);
                        }
                    }
                } catch (e) {
                    console.error("Migration check failed", e);
                }
            }

        } catch (error) {
            console.error('[DonationPersistence] Error loading from Supabase:', error);
        }
    }, [user]);

    /**
     * Load from encrypted localStorage
     */
    const loadFromLocalStorage = useCallback(async () => {
        try {
            const encryptedData = localStorage.getItem(DONATIONS_STORAGE_KEY);

            if (encryptedData) {
                const data = await decryptSession<LocalDonationData>(encryptedData);

                if (data) {
                    setDonations(data.donations || []);
                    setHawlSettingsState(data.hawlSettings || null);

                    // Find current Zakat Year
                    const currentYear = data.zakatYears?.find(y => y.is_current);
                    setCurrentZakatYear(currentYear || null);
                }
            }
        } catch (error) {
            console.error('[DonationPersistence] Error loading from localStorage:', error);
        }
    }, []);

    /**
     * Load donations from local storage or Supabase
     */
    const loadData = useCallback(async () => {
        setLoading(true);

        try {
            if (user) {
                await loadFromSupabase();
            } else {
                await loadFromLocalStorage();
            }
        } catch (error) {
            console.error('[DonationPersistence] Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [user, loadFromSupabase, loadFromLocalStorage]);

    // Load data on mount and when user changes
    useEffect(() => {
        loadData();
    }, [loadData]);

    /**
     * Save to encrypted localStorage
     */
    const saveToLocalStorage = async (
        newDonations: Donation[],
        newHawlSettings: HawlSettings | null,
        newZakatYear: ZakatYear | null
    ) => {
        try {
            const data: LocalDonationData = {
                donations: newDonations,
                hawlSettings: newHawlSettings || undefined,
                zakatYears: newZakatYear ? [newZakatYear] : [],
                lastUpdated: new Date().toISOString(),
            };

            const encrypted = await encryptSession(data);
            localStorage.setItem(DONATIONS_STORAGE_KEY, encrypted);
        } catch (error) {
            console.error('[DonationPersistence] Error saving to localStorage:', error);
            throw error;
        }
    };

    /**
     * Add a new donation
     */
    const addDonation = useCallback(async (
        donation: Omit<Donation, 'id' | 'user_id' | 'zakat_year_id' | 'created_at' | 'updated_at'>
    ): Promise<Donation> => {
        const now = new Date().toISOString();
        const userId = user?.id || 'guest';

        // Optimistic Update
        const tempId = user ? uuidv4() : generateLocalId();

        // Ensure we have a valid Zakat Year ID
        let zakatYearId = currentZakatYear?.id;

        // If logged in and no Zakat Year, we might need to create one (handled in setCalculatedAmount/setHawl usually)
        if (!zakatYearId) {
            zakatYearId = 'default-year'; // Should ideally force creation of year first
        }

        const newDonation: Donation = {
            ...donation,
            id: tempId,
            user_id: userId,
            zakat_year_id: zakatYearId,
            created_at: now,
            updated_at: now,
        };

        // Update State locally first
        const updatedDonations = [newDonation, ...donations]; // Newest first for UI
        setDonations(updatedDonations);

        if (user) {
            // Persist to Supabase
            // Note: omitting ID to let DB generate it, or usage of UUID v4 works too.
            // Let's use the ID we generated if it's a valid UUID, otherwise let DB gen it.
            // Ideally we insert exactly what we have.

            const { data, error } = await supabase
                .from('donations' as any)
                .insert({
                    user_id: userId,
                    zakat_year_id: currentZakatYear?.id, // Important: link to real DB ID
                    amount: donation.amount,
                    recipient_name: donation.recipient_name,
                    recipient_category: donation.recipient_category,
                    donation_date: donation.donation_date,
                    notes: donation.notes,
                    receipt_url: donation.receipt_url,
                    extracted_via_ai: donation.extracted_via_ai
                })
                .select()
                .single();

            if (error) {
                console.error("Supabase insert error", error);
                // Revert state? Or show toast.
                // For MVP, we assume success or user refreshes.
            } else if (data) {
                // Update the local item with the real ID from server
                setDonations(prev => prev.map(d => d.id === tempId ? (data as unknown as Donation) : d));
                return data as unknown as Donation;
            }
        } else {
            // Persist to Local Storage
            await saveToLocalStorage(updatedDonations, hawlSettings, currentZakatYear);
        }

        return newDonation;
    }, [donations, hawlSettings, currentZakatYear, user]);

    /**
     * Update an existing donation
     */
    const updateDonation = useCallback(async (id: string, updates: Partial<Donation>) => {
        const now = new Date().toISOString();

        const updatedDonations = donations.map(d =>
            d.id === id
                ? { ...d, ...updates, updated_at: now }
                : d
        );

        setDonations(updatedDonations);

        if (user) {
            const { error } = await supabase
                .from('donations' as any)
                .update({
                    ...updates,
                    updated_at: now
                })
                .eq('id', id);

            if (error) console.error("Supabase update error", error);
        } else {
            await saveToLocalStorage(updatedDonations, hawlSettings, currentZakatYear);
        }
    }, [donations, hawlSettings, currentZakatYear, user]);

    /**
     * Delete a donation
     */
    const deleteDonation = useCallback(async (id: string) => {
        const updatedDonations = donations.filter(d => d.id !== id);
        setDonations(updatedDonations);

        if (user) {
            const { error } = await supabase
                .from('donations' as any)
                .delete()
                .eq('id', id);

            if (error) console.error("Supabase delete error", error);
        } else {
            await saveToLocalStorage(updatedDonations, hawlSettings, currentZakatYear);
        }
    }, [donations, hawlSettings, currentZakatYear, user]);

    /**
     * Set Hawl settings
     */
    const setHawlSettings = useCallback(async (date: string, calendarType: CalendarType) => {
        const now = new Date().toISOString();
        const userId = user?.id || 'guest';

        // new settings object
        const newHawlSettings: HawlSettings = {
            id: hawlSettings?.id || (user ? uuidv4() : generateLocalId()),
            user_id: userId,
            hawl_start_date: date,
            calendar_type: calendarType,
            created_at: hawlSettings?.created_at || now,
            updated_at: now,
        };

        // Create or update Zakat Year
        const hawlEnd = new Date(date);
        hawlEnd.setFullYear(hawlEnd.getFullYear() + 1);

        const newZakatYear: ZakatYear = {
            id: currentZakatYear?.id || (user ? uuidv4() : generateLocalId()),
            user_id: userId,
            hawl_start: date,
            hawl_end: hawlEnd.toISOString().split('T')[0],
            calculated_amount: currentZakatYear?.calculated_amount || 0,
            calculation_id: currentZakatYear?.calculation_id,
            is_current: true,
            is_superseded: false,
            created_at: currentZakatYear?.created_at || now,
            updated_at: now,
        };

        setHawlSettingsState(newHawlSettings);
        setCurrentZakatYear(newZakatYear);

        if (user) {
            // Upsert Hawl Settings
            const { error: hawlError } = await supabase
                .from('hawl_settings' as any)
                .upsert({
                    user_id: userId,
                    hawl_start_date: date,
                    calendar_type: calendarType,
                    updated_at: now
                } as any, { onConflict: 'user_id' });

            if (hawlError) console.error("Hawl settings save error", hawlError);

            // Upsert Zakat Year
            // Note: If no ID exists for year, we insert. If ID exists, we update.
            // Since we generated ID client side or used existing:
            const { error: yearError } = await supabase
                .from('zakat_years' as any)
                .upsert({
                    id: newZakatYear.id, // Important if updating existing year
                    user_id: userId,
                    hawl_start: newZakatYear.hawl_start,
                    hawl_end: newZakatYear.hawl_end,
                    calculated_amount: newZakatYear.calculated_amount,
                    is_current: true,
                    updated_at: now
                } as any);

            if (yearError) console.error("Zakat year save error", yearError);

        } else {
            await saveToLocalStorage(donations, newHawlSettings, newZakatYear);
        }
    }, [donations, hawlSettings, currentZakatYear, user]);

    /**
     * Set calculated Zakat amount for current year
     */
    const setCalculatedAmount = useCallback(async (amount: number, calculationId?: string) => {
        if (!currentZakatYear) {
            // Create a default Zakat Year if none exists
            const now = new Date();
            const hawlStart = now.toISOString().split('T')[0];
            await setHawlSettings(hawlStart, 'gregorian');
            // after await, currentZakatYear should be set?
            // actually logic continues below, so we need to fetch the *new* year or assume it's created.
            // Recursive call might be safer but risk of loop. 
            // Better to just inline logic or rely on state update (which is async).
            // For now, let's just proceed with creating objects.
        }

        // Grab potentially updated state? No, closure stale.
        // We construct the updated year object manually.

        const targetYearId = currentZakatYear?.id || (user ? uuidv4() : generateLocalId());

        const updatedYear: ZakatYear = currentZakatYear ? {
            ...currentZakatYear,
            calculated_amount: amount,
            calculation_id: calculationId,
            updated_at: new Date().toISOString(),
        } : {
            // Fallback if year didn't exist (edge case)
            // DEFAULT: Retrospective (Tax Model). 
            // If creating now, we assume it's for the year ending NOW.
            id: targetYearId,
            user_id: user?.id || 'guest',
            hawl_start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
            hawl_end: new Date().toISOString().split('T')[0],
            calculated_amount: amount,
            calculation_id: calculationId,
            is_current: true,
            is_superseded: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        setCurrentZakatYear(updatedYear);

        if (user) {
            const { error } = await supabase
                .from('zakat_years' as any)
                .upsert({
                    id: updatedYear.id,
                    user_id: user.id,
                    calculated_amount: amount,
                    calculation_id: calculationId,
                    hawl_start: updatedYear.hawl_start, // Ensure required fields
                    hawl_end: updatedYear.hawl_end,
                    is_current: true,
                    updated_at: new Date().toISOString()
                } as any);

            if (error) console.error("Set calculated amount error", error);
        } else {
            await saveToLocalStorage(donations, hawlSettings, updatedYear);
        }
    }, [donations, hawlSettings, currentZakatYear, user, setHawlSettings]);

    /**
     * Archive current year and start new one
     */
    const startNewYear = useCallback(async () => {
        if (!currentZakatYear) return;

        const now = new Date().toISOString();
        const oldEnd = currentZakatYear.hawl_end;

        // 1. Update old year to not current
        const archivedYear: ZakatYear = {
            ...currentZakatYear,
            is_current: false,
            updated_at: now
        };

        // 2. Create new year
        // Start = Old End. End = Old End + 1 Year (Gregorian approximation or simple +1)
        // Since we are retrospective, the "New Year" is the one starting NOW (or rather, just started accumulating).
        // Wait, if we use Retrospective logic, the "Active" year is the one "Just Ended".
        // If we "Start New Year", we are effectively waiting for the NEXT one to end.
        // So we are in "Accumulation Mode".
        // Let's set Start = Old End. End = Old End + 1 Year.
        // And reset Amount to 0.    
        const nextEnd = new Date(oldEnd);
        nextEnd.setFullYear(nextEnd.getFullYear() + 1);

        const newYearId = user ? uuidv4() : generateLocalId();

        const newYear: ZakatYear = {
            id: newYearId,
            user_id: user?.id || 'guest',
            hawl_start: oldEnd,
            hawl_end: nextEnd.toISOString().split('T')[0],
            calculated_amount: 0, // Reset
            is_current: true,
            is_superseded: false,
            created_at: now,
            updated_at: now
        };

        // State update - showing new year immediately
        setCurrentZakatYear(newYear);

        // Also update Hawl Settings to reflect the new Start Date
        const updatedHawlSettings = hawlSettings ? {
            ...hawlSettings,
            hawl_start_date: oldEnd,
            updated_at: now
        } : null;
        if (updatedHawlSettings) setHawlSettingsState(updatedHawlSettings);

        if (user) {
            // Archive old
            await supabase.from('zakat_years' as any).upsert(archivedYear as any);
            // Create new
            await supabase.from('zakat_years' as any).upsert(newYear as any);
            // Update settings
            if (updatedHawlSettings) {
                await supabase.from('hawl_settings' as any).upsert(updatedHawlSettings as any);
            }
        } else {
            // Local Storage: update list of years
            // Need to load full list first? 
            // We only have current in state. Ideally we should have full list in state.
            // But we can just append new and update old in the raw list if we had it.
            // For MVP local storage, we might lose history if we don't load all.
            // But `saveToLocalStorage` accepts `newZakatYear`. 
            // It replaces the list? No, line 243 `zakatYears: newZakatYear ? [newZakatYear] : []`.
            // Currently local storage only persists ONE year in the array?
            // "zakatYears: newZakatYear ? [newZakatYear] : []," in saveToLocalStorage.
            // Yes. So history is lost locally. This is a known limitation.
            // So just saving newYear is fine.
            await saveToLocalStorage(donations, updatedHawlSettings, newYear);
        }

    }, [currentZakatYear, hawlSettings, user, donations]);

    /**
     * Refresh data from storage
     */
    const refreshData = useCallback(async () => {
        await loadData();
    }, [loadData]);

    /**
     * Calculate summary
     */
    const summary: DonationSummary | null = currentZakatYear ? (() => {
        // Filter donations relevant to this Hawl year
        // strictly those on or after the start date + associated with this year ID
        const hawlStart = new Date(currentZakatYear.hawl_start);
        const hawlEnd = new Date(currentZakatYear.hawl_end);

        // Extend the window slightly? No, keep strictly to logic. 
        // If user changed Hawl to Start now, they imply previous donations are history.

        const relevantDonations = donations.filter(d =>
            d.zakat_year_id === currentZakatYear.id &&
            new Date(d.donation_date) >= hawlStart
        );

        const totalDonated = relevantDonations.reduce((sum, d) => sum + d.amount, 0);

        const remaining = Math.max(0, currentZakatYear.calculated_amount - totalDonated);
        const percentComplete = currentZakatYear.calculated_amount > 0
            ? Math.round((totalDonated / currentZakatYear.calculated_amount) * 100)
            : 0;

        return {
            zakatYear: currentZakatYear,
            totalDonated,
            remaining,
            percentComplete,
            donations: relevantDonations, // Only show relevant ones in the summary list? 
            // Wait, "Donation History" UI (in Donations.tsx) uses summary.donations.
            // If we filter here, they disappear from the list!
            // Maybe we WANT them to disappear from the "Current Year" list?
            // Yes. They are part of history but not *this* year's tracking.
            // But if they disappear, the user might panic "Where did my donations go?".
            // The Donation History should probably show ALL donations but indicate which ones counted?
            // Or just show strictly what's in the year.
            // Given the user wants to "take into account the new target" (progress bar), filtering is correct for progress.
            // For the list, maybe we should show all?
            // "summary.donations" is presumably used for the list in Donations.tsx.
            // Let's verify Donation.tsx usage.
            // It maps `summary.donations`. 
            // So if I filter here, they vanish from the page.
            // This is arguably correct behavior for "Hawl Summary Page".
            // If I want to see *all* history, I might need a "View All History" button later.
            // For now, removing them from the calculation AND the list ensures consistency.
            daysRemaining: calculateDaysRemaining(currentZakatYear.hawl_end),
        };
    })() : null;

    return {
        donations,
        hawlSettings,
        currentZakatYear,
        summary,
        loading,
        addDonation,
        updateDonation,
        deleteDonation,
        setHawlSettings,
        setCalculatedAmount,
        startNewYear,
        refreshData,
    };
}
