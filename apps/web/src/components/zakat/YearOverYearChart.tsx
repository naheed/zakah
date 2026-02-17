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

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { formatCurrency } from "@zakatflow/core";
import { SavedCalculation } from "@/hooks/useSavedCalculations";
import { TrendUp, TrendDown, Equals } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface YearOverYearChartProps {
  calculations: SavedCalculation[];
  currentZakatDue: number;
  currency: string;
  className?: string;
}

export function YearOverYearChart({ 
  calculations, 
  currentZakatDue, 
  currency,
  className 
}: YearOverYearChartProps) {
  const chartData = useMemo(() => {
    // Sort by year and get unique years
    const sortedCalcs = [...calculations]
      .sort((a, b) => a.year_value - b.year_value);
    
    // Group by year and take the latest calculation per year
    const yearMap = new Map<number, SavedCalculation>();
    sortedCalcs.forEach(calc => {
      yearMap.set(calc.year_value, calc);
    });
    
    // Convert to chart data
    const data = Array.from(yearMap.entries()).map(([year, calc]) => ({
      year: year.toString(),
      zakatDue: calc.zakat_due,
      name: calc.name,
    }));
    
    return data;
  }, [calculations]);

  // Calculate trend
  const trend = useMemo(() => {
    if (chartData.length < 2) return null;
    
    const lastYear = chartData[chartData.length - 1]?.zakatDue || 0;
    const previousYear = chartData[chartData.length - 2]?.zakatDue || 0;
    
    if (previousYear === 0) return null;
    
    const percentChange = ((lastYear - previousYear) / previousYear) * 100;
    
    return {
      direction: percentChange > 5 ? "up" : percentChange < -5 ? "down" : "stable",
      percentage: Math.abs(percentChange).toFixed(1),
    };
  }, [chartData]);

  if (chartData.length < 2) {
    return (
      <div className={cn("p-6 text-center bg-muted/30 rounded-xl border border-border", className)}>
        <TrendUp weight="duotone" className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Save calculations across multiple years to see your Zakat trend over time.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Year-over-Year Trend</h3>
        
        {trend && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
              trend.direction === "up" && "bg-tertiary/15 text-tertiary",
              trend.direction === "down" && "bg-destructive/15 text-destructive",
              trend.direction === "stable" && "bg-muted text-muted-foreground"
            )}
          >
            {trend.direction === "up" && <TrendUp weight="bold" className="w-4 h-4" />}
            {trend.direction === "down" && <TrendDown weight="bold" className="w-4 h-4" />}
            {trend.direction === "stable" && <Equals weight="bold" className="w-4 h-4" />}
            <span>
              {trend.direction === "stable" ? "Stable" : `${trend.percentage}%`}
            </span>
          </motion.div>
        )}
      </div>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="zakatGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              formatter={(value: number) => [formatCurrency(value, currency), "Zakat Due"]}
            />
            <Area
              type="monotone"
              dataKey="zakatDue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#zakatGradient)"
              dot={{ 
                fill: "hsl(var(--primary))", 
                strokeWidth: 2, 
                stroke: "hsl(var(--background))",
                r: 4
              }}
              activeDot={{ 
                r: 6, 
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Based on {chartData.length} saved calculations
      </p>
    </div>
  );
}
