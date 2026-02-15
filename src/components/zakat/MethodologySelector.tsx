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
 * MethodologySelector Component
 * 
 * Material 3 Expressive chip group for selecting Zakat calculation methodology.
 * Shows 4 options: Bradford, Hanafi, Maliki/Shafi'i, Hanbali
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Check, Info } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Madhab } from '@/lib/zakatCalculations';
import { getMethodologyDisplayName, getMethodologyDescription } from '@/lib/madhahRules';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MODE_RULES } from '@/lib/zakatCalculations';

interface MethodologySelectorProps {
    value: Madhab;
    onChange: (mode: Madhab) => void;
    onSave?: (mode: Madhab) => void;
    className?: string;
}

const MODES = Object.keys(MODE_RULES) as Madhab[];

export function MethodologySelector({
    value,
    onChange,
    onSave,
    className
}: MethodologySelectorProps) {
    const [pendingSave, setPendingSave] = useState<Madhab | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced save (2 seconds)
    const debouncedSave = useCallback((mode: Madhab) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        setPendingSave(mode);
        saveTimeoutRef.current = setTimeout(() => {
            onSave?.(mode);
            setPendingSave(null);
        }, 2000);
    }, [onSave]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const handleSelect = (mode: Madhab) => {
        if (mode === value) return;
        onChange(mode);
        if (onSave) {
            debouncedSave(mode);
        }
    };

    return (
        <TooltipProvider>
            <div className={cn("space-y-3", className)}>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Methodology</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[250px]">
                            <p className="text-xs">
                                Select a specific methodology now for tailored guidance. You can compare outputs from other scholars in the final report.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="flex flex-wrap gap-2">
                    {MODES.map((mode) => {
                        const isSelected = mode === value;
                        const isPending = pendingSave === mode;

                        return (
                            <Tooltip key={mode}>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(mode)}
                                        className={cn(
                                            // Base styles - Material 3 Expressive
                                            "relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all",
                                            "text-sm font-medium",

                                            // Default state
                                            !isSelected && "border-border bg-card text-muted-foreground hover:bg-muted/50 hover:border-primary/30",

                                            // Selected state
                                            isSelected && "border-primary bg-primary/10 text-primary",

                                            // Pending save indicator
                                            isPending && "animate-pulse"
                                        )}
                                    >
                                        {isSelected && (
                                            <Check weight="bold" className="w-4 h-4" />
                                        )}
                                        <span>{getMethodologyDisplayName(mode)}</span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-[200px]">
                                    <p className="text-xs">{getMethodologyDescription(mode)}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>

                {/* Description of selected mode */}
                <p className="text-xs text-muted-foreground">
                    {getMethodologyDescription(value)}
                </p>
            </div>
        </TooltipProvider>
    );
}
