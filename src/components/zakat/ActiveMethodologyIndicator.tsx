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

import { Madhab } from "@/lib/zakatTypes";
import { ZAKAT_PRESETS } from "@/lib/config/presets";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BookOpen, CaretDown, Check } from "@phosphor-icons/react";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface ActiveMethodologyIndicatorProps {
    currentMadhab: Madhab;
    className?: string;
    onSelect: (madhab: Madhab) => void;
}

export function ActiveMethodologyIndicator({
    currentMadhab,
    className,
    onSelect
}: ActiveMethodologyIndicatorProps) {
    const [open, setOpen] = useState(false);

    // safe fallback lookup
    let config = ZAKAT_PRESETS[currentMadhab];
    let activeKey = currentMadhab;

    // 1. If not found by key, try finding by meta.id (recovery from bug)
    if (!config) {
        const foundEntry = Object.entries(ZAKAT_PRESETS).find(([_, c]) => c.meta.id === currentMadhab);
        if (foundEntry) {
            activeKey = foundEntry[0] as Madhab;
            config = foundEntry[1];
        } else {
            // 2. Total failure fallback -> Default to Bradford
            activeKey = 'bradford';
            config = ZAKAT_PRESETS['bradford'];
        }
    }

    if (!config) return null; // Should theoretically never happen now

    const displayName = config.meta.ui_label || config.meta.name;

    // Group options if needed, or just flat list
    const options = Object.entries(ZAKAT_PRESETS).map(([key, preset]) => ({
        id: key as Madhab,
        label: preset.meta.ui_label || preset.meta.name,
        description: preset.meta.description
    }));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-8 rounded-full gap-1.5 px-3 text-xs font-medium border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50 transition-all",
                        open && "bg-muted border-primary/50",
                        className
                    )}
                >
                    <BookOpen className="w-3.5 h-3.5 text-primary" weight="duotone" />
                    <span className="hidden xs:inline text-muted-foreground">Methodology:</span>
                    <span className="text-primary font-semibold">{displayName}</span>
                    <CaretDown className={cn("w-3 h-3 text-muted-foreground transition-transform", open && "rotate-180")} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
                <Command>
                    <div className="px-3 py-2 border-b">
                        <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Select Methodology</h4>
                    </div>
                    <CommandList>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.label}
                                    onSelect={() => {
                                        onSelect(option.id);
                                        setOpen(false);
                                    }}
                                    className="flex items-start gap-2 py-3"
                                >
                                    <div className={cn(
                                        "mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                                        activeKey === option.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                                    )}>
                                        {activeKey === option.id && <Check className="w-2.5 h-2.5" weight="bold" />}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className={cn("font-medium", activeKey === option.id ? "text-primary" : "text-foreground")}>
                                            {option.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                                            {option.description}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
