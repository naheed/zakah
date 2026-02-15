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

import { useState, useEffect, useRef, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { parseMathExpression } from "@/lib/zakatCalculations";
import { cn } from "@/lib/utils";
import { FileDoc, CaretDown } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DocumentContribution {
  documentId: string;
  documentName: string;
  institutionName: string;
  amount: number;
}

interface CurrencyInputProps {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  description?: string;
  householdDescription?: string;
  isHousehold?: boolean;
  placeholder?: string;
  currency?: string;
  className?: string;
  fieldName?: string;
  documentContributions?: DocumentContribution[];
  testId?: string;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  description,
  householdDescription,
  isHousehold = false,
  placeholder = "0",
  currency = "$",
  className,
  fieldName,
  documentContributions = [],
  testId,
}: CurrencyInputProps) {
  const [inputValue, setInputValue] = useState(value > 0 ? value.toString() : "");
  const [isFocused, setIsFocused] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastExternalValue = useRef(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine if label should float (focused or has value)
  const shouldFloat = isFocused || inputValue.length > 0;

  // Sync inputValue when external value changes (from document upload)
  useEffect(() => {
    // Only update if the value was changed externally (not by user input)
    if (value !== lastExternalValue.current && !isFocused) {
      setInputValue(value > 0 ? value.toString() : "");
      setError(null);
      lastExternalValue.current = value;
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Strict Validation: Allow only numbers, math operators, parens, decimal, and spaces
    // Regex: Start to end must be valid chars
    const isValid = /^[0-9+\-*/().\s]*$/.test(newValue);

    if (!isValid) {
      setError("Invalid character: Only numbers and math symbols allowed");
      // Still allow typing so they can delete, but don't parse result yet or maybe handle gracefully?
      // Actually, we usually want to let them type but show error.
      // We do NOT update the parent with invalid data, or pass 0?
      // Let's pass 0 if invalid to stay safe, or keep prior value?
      // Passing 0 avoids breaking calculations downstream with NaNs
      onChange(0);
      return;
    }

    setError(null);
    const parsed = parseMathExpression(newValue);
    onChange(parsed);
    lastExternalValue.current = parsed;
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue) {
      const parsed = parseMathExpression(inputValue);
      setInputValue(parsed > 0 ? parsed.toString() : "");
      lastExternalValue.current = parsed;
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const displayDescription = isHousehold && householdDescription
    ? householdDescription
    : description;

  const hasContributions = documentContributions.length > 0;
  const totalFromDocs = documentContributions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className={cn("space-y-2", className)}>
      {displayDescription && (
        <p className="text-sm text-muted-foreground">{displayDescription}</p>
      )}

      {/* M3 Filled Text Field Container */}
      <motion.div
        onClick={handleContainerClick}
        className={cn(
          "relative bg-surface-container-high rounded-xl overflow-hidden cursor-text transition-all duration-200",
          error
            ? "ring-2 ring-destructive bg-destructive/5"
            : isFocused
              ? "ring-2 ring-ring bg-primary-container"
              : "ring-1 ring-border hover:bg-surface-container-highest"
        )}
        initial={false}
        animate={isFocused ? { scale: 1.005 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Always-Floating Label (Stripe/Wise pattern) */}
        <label
          htmlFor={typeof label === 'string' ? label : undefined}
          className={cn(
            "absolute left-5 top-2 text-xs font-medium pointer-events-none z-10 transition-colors duration-200",
            isFocused ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </label>

        {/* Input Row: Flexbox with baseline alignment */}
        <div className="flex items-baseline pt-8 pb-3 px-5">
          {/* Currency Symbol */}
          <span className={cn(
            "shrink-0 text-lg font-mono transition-colors mr-2",
            isFocused ? "text-primary" : "text-muted-foreground"
          )}>
            {currency}
          </span>

          {/* Input */}
          <Input
            ref={inputRef}
            id={typeof label === 'string' ? label : undefined}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder={shouldFloat ? placeholder : undefined}
            aria-label={typeof label === 'string' ? label : fieldName || 'Currency input'}
            aria-invalid={!!error}
            autoComplete="off"
            className={cn(
              "flex-1 font-mono tabular-nums tracking-wide text-lg",
              "h-auto p-0 bg-transparent border-none rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
              className
            )}
            data-testid={testId}
          />
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-destructive font-medium ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {hasContributions && (
        <Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
          <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-primary hover:underline w-full">
            <FileDoc className="w-3 h-3" weight="fill" />
            <span>
              Includes ${totalFromDocs.toLocaleString()} from {documentContributions.length} document{documentContributions.length > 1 ? 's' : ''}
            </span>
            <CaretDown className={cn(
              "w-3 h-3 transition-transform ml-auto",
              showBreakdown && "rotate-180"
            )} weight="bold" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              {documentContributions.map((contribution) => (
                <div
                  key={contribution.documentId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground truncate mr-2">
                    {contribution.institutionName || contribution.documentName}
                  </span>
                  <span className="font-medium text-foreground shrink-0">
                    ${contribution.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground">Total from documents</span>
                <span className="font-medium text-foreground">
                  ${totalFromDocs.toLocaleString()}
                </span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
