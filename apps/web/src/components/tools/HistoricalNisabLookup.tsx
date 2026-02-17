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

import { useState } from "react";
import { useNisab } from "@/hooks/useNisab";
import { formatCurrency, calculateNisab, NisabStandard } from "@zakatflow/core";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Spinner } from "@phosphor-icons/react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function HistoricalNisabLookup() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const { data: nisabData, isLoading } = useNisab(date);

    const silverNisab = nisabData ? calculateNisab(nisabData.silver_price, nisabData.gold_price, 'silver') : 0;
    const goldNisab = nisabData ? calculateNisab(nisabData.silver_price, nisabData.gold_price, 'gold') : 0;

    return (
        <div className="p-6 border rounded-xl space-y-4 bg-card">
            <h3 className="text-lg font-medium">Historical Niṣāb Lookup</h3>
            <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Select a Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="mt-6 space-y-4">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Spinner className="animate-spin" /> Loading data...
                    </div>
                ) : nisabData ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                            <p className="text-sm text-muted-foreground">Silver Standard (Recommended)</p>
                            <p className="text-2xl font-bold text-secondary-foreground">{formatCurrency(silverNisab)}</p>
                            <p className="text-xs text-muted-foreground mt-1">Price: {formatCurrency(nisabData.silver_price, 'USD', 2)}/oz</p>
                        </div>
                        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                            <p className="text-sm text-muted-foreground">Gold Standard</p>
                            <p className="text-2xl font-bold text-primary-foreground">{formatCurrency(goldNisab)}</p>
                            <p className="text-xs text-muted-foreground mt-1">Price: {formatCurrency(nisabData.gold_price, 'USD', 2)}/oz</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 rounded-lg border border-dashed text-center text-muted-foreground">
                        No data available for this date.
                    </div>
                )}
            </div>
        </div>
    );
}
