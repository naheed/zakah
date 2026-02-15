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

import { useState, useEffect } from 'react';
import { CalendarBlank, ArrowsClockwise, Check, Info } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarType } from '@/types/donations';
import { toHijri, fromHijri, formatHijri, HIJRI_MONTHS, getDaysInHijriMonth } from '@/lib/dateUtils';

interface HawlDatePickerProps {
    /** Current Hawl start date (ISO string) */
    value?: string;
    /** Calendar type */
    calendarType?: CalendarType;
    /** Called when date or calendar type changes */
    onChange: (date: string, calendarType: CalendarType) => void;
    /** Compact mode for inline display */
    compact?: boolean;
    /** Show the "days remaining" calculation */
    showCountdown?: boolean;
    className?: string;
}

function HijriDateInput({ value, onChange }: { value: string, onChange: (date: string) => void }) {
    const date = new Date(value);
    const hijri = toHijri(date);

    const currentYear = hijri.year;
    // Generate years: current +/- 5 years
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    // Days in current selection
    const daysInMonth = getDaysInHijriMonth(hijri.month, hijri.year);
    const days = Array.from({ length: 30 }, (_, i) => i + 1); // Max 30 days always safer for UI range

    const updateDate = (d: number, m: number, y: number) => {
        try {
            const newGregorian = fromHijri(d, m, y);
            // Adjust for timezone offset to keep date string consistent "YYYY-MM-DD"
            // The fromHijri returns a date at 00:00 local time usually
            // We want ISO YYYY-MM-DD part
            const isoDate = newGregorian.toLocaleDateString('en-CA'); // 'en-CA' is YYYY-MM-DD
            onChange(isoDate);
        } catch (e) {
            console.error("Invalid Hijri Date", e);
        }
    };

    return (
        <div className="flex gap-2 w-full">
            {/* Day */}
            <Select
                value={hijri.day.toString()}
                onValueChange={(v) => updateDate(parseInt(v), hijri.month, hijri.year)}
            >
                <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                    {days.slice(0, daysInMonth).map(d => (
                        <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Month */}
            <Select
                value={hijri.month.toString()}
                onValueChange={(v) => updateDate(hijri.day, parseInt(v), hijri.year)}
            >
                <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                    {HIJRI_MONTHS.map((m, i) => (
                        <SelectItem key={i} value={i.toString()}>{i + 1}. {m}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Year */}
            <Select
                value={hijri.year.toString()}
                onValueChange={(v) => updateDate(hijri.day, hijri.month, parseInt(v))}
            >
                <SelectTrigger className="w-[90px]">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    {years.map(y => (
                        <SelectItem key={y} value={y.toString()}>{y} AH</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

/**
 * Calculate days remaining until next Hawl
 */
function calculateDaysRemaining(hawlStart: string): number {
    const start = new Date(hawlStart);
    const now = new Date();

    // Calculate the end of the current Hawl year
    const hawlEnd = new Date(start);
    hawlEnd.setFullYear(hawlEnd.getFullYear() + 1);

    // If we're past the end, calculate for next year
    if (now > hawlEnd) {
        hawlEnd.setFullYear(hawlEnd.getFullYear() + 1);
    }

    const diffMs = hawlEnd.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * HawlDatePicker - Set your Zakat year start date
 * 
 * Material 3 Expressive design with:
 * - Gregorian ↔ Hijri toggle
 * - Days remaining countdown
 * - Inline and modal modes
 */
export function HawlDatePicker({
    value,
    calendarType = 'gregorian',
    onChange,
    compact = false,
    showCountdown = true,
    className,
}: HawlDatePickerProps) {
    const [selectedDate, setSelectedDate] = useState(value || new Date().toISOString().split('T')[0]);
    const [activeCalendar, setActiveCalendar] = useState<CalendarType>(calendarType);

    // Update when props change
    useEffect(() => {
        if (value) setSelectedDate(value);
        setActiveCalendar(calendarType);
    }, [value, calendarType]);

    const daysRemaining = calculateDaysRemaining(selectedDate);

    const handleDateChange = (newDate: string) => {
        setSelectedDate(newDate);
        onChange(newDate, activeCalendar);
    };

    const handleCalendarToggle = (type: CalendarType) => {
        setActiveCalendar(type);
        onChange(selectedDate, type);
    };

    // Compact inline display
    if (compact) {
        return (
            <div className={cn("flex items-center gap-2 text-sm", className)}>
                <CalendarBlank className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                    Hawl: {activeCalendar === 'hijri' ? formatHijri(selectedDate) : new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {showCountdown && (
                    <span className="text-xs text-primary font-medium">
                        ({daysRemaining}d left)
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* Header */}
            <div className="space-y-1">
                <Label className="text-sm font-medium">Your Hawl Start Date</Label>
                <p className="text-xs text-muted-foreground">
                    The date you first became eligible to pay Zakat (owned nisab for a lunar year)
                </p>
            </div>

            {/* Calendar Type Toggle */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
                <button
                    type="button"
                    onClick={() => handleCalendarToggle('gregorian')}
                    className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                        activeCalendar === 'gregorian'
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Gregorian
                </button>
                <button
                    type="button"
                    onClick={() => handleCalendarToggle('hijri')}
                    className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                        activeCalendar === 'hijri'
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Hijri
                </button>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
                <div className="relative">
                    {activeCalendar === 'gregorian' ? (
                        <>
                            <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="pl-10"
                            />
                            {/* Hijri Preview */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                <ArrowsClockwise className="w-3 h-3" />
                                <span>≈ {formatHijri(selectedDate)}</span>
                            </div>
                        </>
                    ) : (
                        <HijriDateInput value={selectedDate} onChange={handleDateChange} />
                    )}
                </div>
            </div>

            {/* Countdown */}
            {showCountdown && (
                <div className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    daysRemaining <= 30 ? "bg-amber-50 dark:bg-amber-950/20" : "bg-primary/5"
                )}>
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                        daysRemaining <= 30
                            ? "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                            : "bg-primary/10 text-primary"
                    )}>
                        {daysRemaining}
                    </div>
                    <div>
                        <p className="font-medium text-foreground text-sm">days until your next Zakat is due</p>
                        <p className="text-xs text-muted-foreground">
                            Hawl ends {new Date(new Date(selectedDate).setFullYear(new Date(selectedDate).getFullYear() + 1)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="w-3 h-3 mt-0.5 shrink-0" />
                <span>
                    {activeCalendar === 'hijri'
                        ? "Note: Hijri dates may vary by ±1 day based on moon sighting. We use the Umm al-Qura approximate."
                        : "If unsure, use the date you first started earning income or the start of Ramadan."}
                </span>
            </div>
        </div>
    );
}
