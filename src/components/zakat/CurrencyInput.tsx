import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseMathExpression } from "@/lib/zakatCalculations";
import { cn } from "@/lib/utils";
import { FileText, ChevronDown } from "lucide-react";
import { UploadedDocument, fieldDisplayNames } from "@/lib/documentTypes";
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
  label: string;
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

  const displayDescription = isHousehold && householdDescription 
    ? householdDescription 
    : description;

  const hasContributions = documentContributions.length > 0;
  const totalFromDocs = documentContributions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={label} className="text-base font-medium">
        {label}
      </Label>
      {displayDescription && (
        <p className="text-sm text-muted-foreground">{displayDescription}</p>
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
      
      {hasContributions ? (
        <Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
          <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-primary hover:underline w-full">
            <FileText className="w-3 h-3" />
            <span>
              Includes ${totalFromDocs.toLocaleString()} from {documentContributions.length} document{documentContributions.length > 1 ? 's' : ''}
            </span>
            <ChevronDown className={cn(
              "w-3 h-3 transition-transform ml-auto",
              showBreakdown && "rotate-180"
            )} />
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

// Helper function to get document contributions for a specific field
export function getDocumentContributionsForField(
  documents: UploadedDocument[],
  fieldName: keyof typeof fieldDisplayNames
): DocumentContribution[] {
  return documents
    .filter(doc => {
      const value = doc.extractedData[fieldName as keyof typeof doc.extractedData];
      return typeof value === 'number' && value > 0;
    })
    .map(doc => ({
      documentId: doc.id,
      documentName: doc.fileName,
      institutionName: doc.institutionName,
      amount: doc.extractedData[fieldName as keyof typeof doc.extractedData] as number,
    }));
}
