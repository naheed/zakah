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

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { GOLD_PRICE_PER_OUNCE, GRAMS_PER_OUNCE } from "@/lib/zakatCalculations";
import { motion } from "framer-motion";

type WeightUnit = 'grams' | 'ounces' | 'tolas';

const GRAMS_PER_TOLA = 11.664; // Standard tola weight

interface WeightConverterProps {
  label: string;
  pricePerOunce: number;
  value: number; // USD value
  onChange: (value: number) => void;
  isHousehold?: boolean;
  className?: string;
}

export function WeightConverter({
  label,
  pricePerOunce,
  value,
  onChange,
  isHousehold = false,
  className,
}: WeightConverterProps) {
  const [unit, setUnit] = useState<WeightUnit>('grams');
  const [weightInput, setWeightInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Calculate USD value from weight and unit
  const calculateUsdValue = (weight: number, weightUnit: WeightUnit): number => {
    if (weight <= 0) return 0;
    
    let weightInOunces: number;
    switch (weightUnit) {
      case 'grams':
        weightInOunces = weight / GRAMS_PER_OUNCE;
        break;
      case 'tolas':
        weightInOunces = (weight * GRAMS_PER_TOLA) / GRAMS_PER_OUNCE;
        break;
      case 'ounces':
      default:
        weightInOunces = weight;
    }
    
    return weightInOunces * pricePerOunce;
  };
  
  // Calculate weight from USD value
  const calculateWeight = (usdValue: number, weightUnit: WeightUnit): number => {
    if (usdValue <= 0) return 0;
    
    const weightInOunces = usdValue / pricePerOunce;
    
    switch (weightUnit) {
      case 'grams':
        return weightInOunces * GRAMS_PER_OUNCE;
      case 'tolas':
        return (weightInOunces * GRAMS_PER_OUNCE) / GRAMS_PER_TOLA;
      case 'ounces':
      default:
        return weightInOunces;
    }
  };
  
  // Sync weight input when external value changes
  useEffect(() => {
    if (!isFocused && value > 0) {
      const weight = calculateWeight(value, unit);
      setWeightInput(weight.toFixed(2));
    } else if (!isFocused && value === 0) {
      setWeightInput('');
    }
  }, [value, unit, isFocused]);
  
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setWeightInput(input);
    
    const weight = parseFloat(input) || 0;
    const usdValue = calculateUsdValue(weight, unit);
    onChange(usdValue);
  };
  
  const handleUnitChange = (newUnit: WeightUnit) => {
    // Convert current weight to new unit for display
    const currentWeight = parseFloat(weightInput) || 0;
    if (currentWeight > 0) {
      // First get USD value in old unit
      const usdValue = calculateUsdValue(currentWeight, unit);
      // Then convert to new unit weight for display
      const newWeight = calculateWeight(usdValue, newUnit);
      setWeightInput(newWeight.toFixed(2));
    }
    setUnit(newUnit);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (weightInput) {
      const weight = parseFloat(weightInput) || 0;
      if (weight > 0) {
        setWeightInput(weight.toFixed(2));
      }
    }
  };

  const getUnitLabel = (u: WeightUnit) => {
    switch (u) {
      case 'grams': return 'g';
      case 'ounces': return 'oz';
      case 'tolas': return 'tola';
    }
  };

  const pricePerUnit = (() => {
    switch (unit) {
      case 'grams':
        return pricePerOunce / GRAMS_PER_OUNCE;
      case 'tolas':
        return (pricePerOunce / GRAMS_PER_OUNCE) * GRAMS_PER_TOLA;
      case 'ounces':
      default:
        return pricePerOunce;
    }
  })();

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {isHousehold && (
          <span className="text-xs text-muted-foreground">(combined household)</span>
        )}
      </div>
      
      <div className="flex gap-2">
        {/* Weight Input */}
        <motion.div 
          className={cn(
            "relative flex-1 bg-surface-container-high rounded-t-lg",
            "border-b-2",
            isFocused ? "border-primary bg-surface-container-highest" : "border-muted-foreground/30"
          )}
          initial={false}
          animate={isFocused ? { scale: 1.005 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Input
            type="number"
            step="0.01"
            min="0"
            value={weightInput}
            onChange={handleWeightChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder="Enter weight"
            className={cn(
              "pr-2 h-12 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              "font-mono tabular-nums"
            )}
          />
        </motion.div>
        
        {/* Unit Selector */}
        <Select value={unit} onValueChange={(v) => handleUnitChange(v as WeightUnit)}>
          <SelectTrigger className="w-24 h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grams">Grams</SelectItem>
            <SelectItem value="ounces">Ounces</SelectItem>
            <SelectItem value="tolas">Tolas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Live price calculation */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          @ ${pricePerUnit.toFixed(2)}/{getUnitLabel(unit)}
        </span>
        {value > 0 && (
          <motion.span 
            className="font-medium text-primary"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ≈ ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.span>
        )}
      </div>
    </div>
  );
}
