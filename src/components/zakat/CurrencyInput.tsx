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
}: CurrencyInputProps) {
  const [inputValue, setInputValue] = useState(value > 0 ? value.toString() : "");
  const [isFocused, setIsFocused] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const lastExternalValue = useRef(value);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Determine if label should float (focused or has value)
  const shouldFloat = isFocused || inputValue.length > 0;
  
  // Sync inputValue when external value changes (from document upload)
  useEffect(() => {
    // Only update if the value was changed externally (not by user input)
    if (value !== lastExternalValue.current && !isFocused) {
      setInputValue(value > 0 ? value.toString() : "");
      lastExternalValue.current = value;
    }
  }, [value, isFocused]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
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
          "relative bg-surface-container-high rounded-t-lg cursor-text transition-colors",
          "border-b-2",
          isFocused ? "border-primary bg-surface-container-highest" : "border-muted-foreground/30 hover:bg-surface-container-highest"
        )}
        initial={false}
        animate={isFocused ? { scale: 1.005 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Floating Label */}
        <motion.label
          htmlFor={typeof label === 'string' ? label : undefined}
          className={cn(
            "absolute left-10 pointer-events-none transition-colors",
            shouldFloat 
              ? "text-xs font-medium" 
              : "text-base",
            isFocused 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
          initial={false}
          animate={{
            top: shouldFloat ? 8 : 20,
            fontSize: shouldFloat ? "0.75rem" : "1rem",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {label}
        </motion.label>
        
        {/* Currency Symbol */}
        <span className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
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
          placeholder={shouldFloat ? placeholder : ""}
          className={cn(
            "pl-10 pt-6 pb-2 h-14 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            "font-mono tabular-nums tracking-wide",
          )}
        />
        
        {/* Active Indicator Line Animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-center"
          initial={false}
          animate={{ 
            scaleX: isFocused ? 1 : 0,
            opacity: isFocused ? 1 : 0 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </motion.div>
      
      {hasContributions ? (
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
      ) : (
        <p className="text-xs text-muted-foreground">
          You can do math here e.g. 100 + 200
        </p>
      )}
    </div>
  );
}
