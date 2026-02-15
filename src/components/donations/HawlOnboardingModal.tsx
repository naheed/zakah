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

import { useState } from 'react';
import { CalendarBlank, X, Check } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { HawlDatePicker } from './HawlDatePicker';
import { CalendarType } from '@/types/donations';

interface HawlOnboardingModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (date: string, calendarType: CalendarType) => void;
}

/**
 * HawlOnboardingModal - First-time setup for Hawl date
 * 
 * Shown when user first visits Donations page without a Hawl set
 */
export function HawlOnboardingModal({ open, onClose, onSave }: HawlOnboardingModalProps) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [calendarType, setCalendarType] = useState<CalendarType>('gregorian');

    const handleChange = (date: string, type: CalendarType) => {
        setSelectedDate(date);
        setCalendarType(type);
    };

    const handleSave = () => {
        onSave(selectedDate, calendarType);
        onClose();
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative p-6 pb-4 bg-gradient-to-br from-primary/10 to-primary/5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </Button>

                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <CalendarBlank className="w-6 h-6 text-primary" weight="duotone" />
                        </div>

                        <h2 className="text-xl font-bold text-foreground mb-1">
                            When does your Zakat year start?
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Your <strong>Hawl</strong> is the lunar year cycle for Zakat.
                            We'll use this to track your donation progress.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <HawlDatePicker
                            value={selectedDate}
                            calendarType={calendarType}
                            onChange={handleChange}
                            showCountdown={true}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 pt-0">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            Skip for now
                        </Button>
                        <Button className="flex-1" onClick={handleSave}>
                            <Check className="w-4 h-4 mr-2" />
                            Save Hawl Date
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
