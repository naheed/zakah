/**
 * Donation Tracking Types
 * 
 * Types for tracking Zakat donations across Hawl years.
 */

/**
 * 8 Quranic Categories of Zakat Recipients (Quran 9:60)
 */
export type ZakatRecipientCategory =
    | 'AL_FUQARAA'          // The Poor
    | 'AL_MASAKEEN'         // The Needy
    | 'AL_AMILINA'          // Zakat Administrators
    | 'AL_MUALLAFAH'        // Reconciling Hearts
    | 'AR_RIQAB'            // Those in Bondage
    | 'AL_GHARIMIN'         // Debt-Ridden
    | 'FI_SABILILLAH'       // In God's Cause
    | 'IBN_AL_SABIL';       // The Wayfarer

export const ZAKAT_RECIPIENT_CATEGORIES: Record<ZakatRecipientCategory, {
    arabic: string;
    english: string;
    description: string;
}> = {
    AL_FUQARAA: {
        arabic: "الفقراء",
        english: "The Poor",
        description: "Those with very little or no means to support themselves"
    },
    AL_MASAKEEN: {
        arabic: "المساكين",
        english: "The Needy",
        description: "Those in significant difficulty, with insufficient means"
    },
    AL_AMILINA: {
        arabic: "العاملين عليها",
        english: "Zakat Administrators",
        description: "Those appointed to collect and distribute Zakat"
    },
    AL_MUALLAFAH: {
        arabic: "المؤلفة قلوبهم",
        english: "Reconciling Hearts",
        description: "New converts or those whose hearts need strengthening"
    },
    AR_RIQAB: {
        arabic: "الرقاب",
        english: "Those in Bondage",
        description: "Slaves, captives, or prisoners needing funds for freedom"
    },
    AL_GHARIMIN: {
        arabic: "الغارمين",
        english: "The Debt-Ridden",
        description: "Individuals burdened by legitimate debt they cannot repay"
    },
    FI_SABILILLAH: {
        arabic: "في سبيل الله",
        english: "In God's Cause",
        description: "Those engaged in activities that benefit the community"
    },
    IBN_AL_SABIL: {
        arabic: "ابن السبيل",
        english: "The Wayfarer",
        description: "A traveler stranded far from home and resources"
    },
};

/**
 * Calendar type for Hawl date
 */
export type CalendarType = 'gregorian' | 'hijri';

/**
 * User's Hawl settings
 */
export interface HawlSettings {
    id: string;
    user_id: string;
    hawl_start_date: string;       // ISO date string
    calendar_type: CalendarType;
    created_at: string;
    updated_at: string;
}

/**
 * A Zakat Year window tied to a Hawl cycle
 */
export interface ZakatYear {
    id: string;
    user_id: string;
    hawl_start: string;            // Start of this Hawl year
    hawl_end: string;              // End of this Hawl year
    calculated_amount: number;     // Total Zakat due
    calculation_id?: string;       // FK to calculation record
    is_current: boolean;           // Is this the active Hawl year?
    is_superseded: boolean;        // Was this calculation replaced?
    superseded_at?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Individual donation record
 */
export interface Donation {
    id: string;
    user_id: string;
    zakat_year_id: string;         // FK to ZakatYear
    amount: number;
    recipient_name: string;        // "Islamic Relief USA"
    recipient_category: ZakatRecipientCategory;
    donation_date: string;         // When the donation was made
    notes?: string;
    receipt_url?: string;          // Uploaded receipt
    extracted_via_ai: boolean;     // Was this auto-filled from receipt?
    created_at: string;
    updated_at: string;
}

/**
 * Donation summary for a Zakat Year
 */
export interface DonationSummary {
    zakatYear: ZakatYear;
    totalDonated: number;
    remaining: number;
    percentComplete: number;
    donations: Donation[];
    daysRemaining: number;
}

/**
 * Curated charity for Zakat donations
 */
export interface ZakatCharity {
    id: string;
    name: string;
    website: string;
    categories: ZakatRecipientCategory[];
    description?: string;
    logo_url?: string;
    verified: boolean;
    location?: string;
}
