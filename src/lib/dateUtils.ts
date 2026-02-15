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

/**
 * Robust Date Utilities for ZakatFlow
 * 
 * Handles conversion between Gregorian and Hijri calendars.
 * Source of Truth: All dates are stored as Gregorian ISO strings (YYYY-MM-DD).
 * UI: Converts to/from Hijri for display and input.
 */

// Hijri Month Names (English)
export const HIJRI_MONTHS = [
    'Muharram', 'Safar', 'Rabi Al-Awwal', 'Rabi Al-Thani',
    'Jumada Al-Awwal', 'Jumada Al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhul-Qa\'dah', 'Dhul-Hijjah'
];

export interface HijriDate {
    day: number;
    month: number; // 0-indexed (0 = Muharram)
    year: number;
}

/**
 * Converts a Gregorian Date object to Hijri
 * Uses Intl.DateTimeFormat for accurate browser-native conversion (Umm al-Qura usually)
 */
export function toHijri(date: Date): HijriDate {
    // using 'en-TN-u-ca-islamic' or similar can force algorithmic, but 'islamic-umalqura' is best
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });

    const parts = formatter.formatToParts(date);
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '1') - 1; // Make 0-indexed
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '1445');

    return { day, month, year };
}

/**
 * Converts Hijri components back to a Gregorian Date
 * Since JS doesn't have a native "fromHijri", we use an iterative approach or formula.
 * For robustness without heavy libraries, we use the Kuwaiti Algorithm (Tabular) approximation
 * which is standard for most Islamic software when Umm al-Qura API is not available implementation-side.
 * 
 * Note: This may vary by +/- 1 day from local sighting.
 */
export function fromHijri(day: number, month: number, year: number): Date {
    // Basic validity check
    if (month < 0 || month > 11) throw new Error("Invalid Hijri Month");
    if (day < 1 || day > 30) throw new Error("Invalid Hijri Day");

    // Algorithm to estimate JD (Julian Day) from Hijri
    // Source: Widely used Tabular Islamic Calendar algorithm
    const iYear = year;
    const iMonth = month;
    const iDay = day;

    const m = iMonth + 1;
    const y = iYear;

    const jd = Math.floor((11 * y + 3) / 30) +
        354 * y +
        30 * m -
        Math.floor((m - 1) / 2) +
        iDay +
        1948440 - 385;

    // Convert JD to Gregorian
    let l = jd + 68569;
    const n = Math.floor((4 * l) / 146097);
    l = l - Math.floor((146097 * n + 3) / 4);
    const i = Math.floor((4000 * (l + 1)) / 1461001);
    l = l - Math.floor((1461 * i) / 4) + 31;
    const j = Math.floor((80 * l) / 2447);
    const d = l - Math.floor((2447 * j) / 80);
    l = Math.floor(j / 11);
    const mm = j + 2 - 12 * l;
    const yy = 100 * (n - 49) + i + l;

    return new Date(yy, mm - 1, d);
}

const formatters: Record<string, Intl.DateTimeFormat> = {};

/**
 * Formats a Gregorian date as a Hijri string
 * string: "18 Rajab 1447 AH"
 */
export function formatHijri(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    // Cache formatter
    if (!formatters['hijri']) {
        formatters['hijri'] = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    const formatted = formatters['hijri'].format(d);
    return formatted.includes('AH') ? formatted : `${formatted} AH`;
}

/**
 * Returns number of days in a Hijri month (Alternates 30/29 usually)
 * This is an approximation.
 */
export function getDaysInHijriMonth(month: number, year: number): number {
    // Tabular approximation: Odd months are 30, Even are 29. 
    // Month 12 varies in leap years.
    // Index: 0=Muharram (Odd, 30), 1=Safar (Even, 29)...
    // So Even index = 30, Odd index = 29

    if (month === 11) { // Dhul-Hijjah
        // Check for leap year
        const isLeap = (year * 11 + 14) % 30 < 11;
        return isLeap ? 30 : 29;
    }

    return month % 2 === 0 ? 30 : 29;
}
