import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseMathExpression } from "@/lib/zakatCalculations";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
  placeholder?: string;
  currency?: string;
  className?: string;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  description,
  placeholder = "0",
  currency = "$",
  className,
}: CurrencyInputProps) {
  const [inputValue, setInputValue] = useState(value > 0 ? value.toString() : "");
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const parsed = parseMathExpression(newValue);
    onChange(parsed);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue) {
      const parsed = parseMathExpression(inputValue);
      setInputValue(parsed > 0 ? parsed.toString() : "");
    }
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={label} className="text-base font-medium">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {currency}
        </span>
        <Input
          id={label}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "pl-7 h-12 text-lg",
            isFocused && "ring-2 ring-primary"
          )}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        You can do math here e.g. 100 + 200
      </p>
    </div>
  );
}
