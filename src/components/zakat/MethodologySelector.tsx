/**
 * MethodologySelector Component
 * 
 * Material 3 Expressive chip group for selecting Zakat calculation methodology.
 * Shows 4 options: Bradford, Hanafi, Maliki/Shafi'i, Hanbali
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Check, Info } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { CalculationMode } from '@/lib/zakatCalculations';
import { getModeDisplayName, getModeDescription } from '@/lib/madhahRules';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MethodologySelectorProps {
    value: CalculationMode;
    onChange: (mode: CalculationMode) => void;
    onSave?: (mode: CalculationMode) => void;
    className?: string;
}

const MODES: CalculationMode[] = ['bradford', 'hanafi', 'maliki-shafii', 'hanbali'];

export function MethodologySelector({
    value,
    onChange,
    onSave,
    className
}: MethodologySelectorProps) {
    const [pendingSave, setPendingSave] = useState<CalculationMode | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced save (2 seconds)
    const debouncedSave = useCallback((mode: CalculationMode) => {
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

    const handleSelect = (mode: CalculationMode) => {
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
                                Different scholars interpret Zakat rules differently.
                                Select a methodology to see how it affects your calculation.
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
                                        <span>{getModeDisplayName(mode)}</span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-[200px]">
                                    <p className="text-xs">{getModeDescription(mode)}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>

                {/* Description of selected mode */}
                <p className="text-xs text-muted-foreground">
                    {getModeDescription(value)}
                </p>
            </div>
        </TooltipProvider>
    );
}
