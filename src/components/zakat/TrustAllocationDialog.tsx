import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/zakatCalculations";

interface TrustAllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extractedValue: number;
  documentName: string;
  onConfirm: (allocation: { revocable: number; irrevocable: number }) => void;
}

export function TrustAllocationDialog({
  open,
  onOpenChange,
  extractedValue,
  documentName,
  onConfirm,
}: TrustAllocationDialogProps) {
  const [trustType, setTrustType] = useState<"revocable" | "irrevocable" | "split">("revocable");
  const [revocableAmount, setRevocableAmount] = useState(extractedValue);
  const [irrevocableAmount, setIrrevocableAmount] = useState(0);

  const handleTypeChange = (value: string) => {
    const type = value as "revocable" | "irrevocable" | "split";
    setTrustType(type);
    
    if (type === "revocable") {
      setRevocableAmount(extractedValue);
      setIrrevocableAmount(0);
    } else if (type === "irrevocable") {
      setRevocableAmount(0);
      setIrrevocableAmount(extractedValue);
    }
  };

  const handleConfirm = () => {
    onConfirm({
      revocable: trustType === "revocable" ? extractedValue : trustType === "split" ? revocableAmount : 0,
      irrevocable: trustType === "irrevocable" ? extractedValue : trustType === "split" ? irrevocableAmount : 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Categorize Trust Document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-3 bg-accent rounded-lg">
            <p className="text-sm font-medium">{documentName}</p>
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(extractedValue)}
            </p>
          </div>

          <div className="space-y-3">
            <Label>What type of trust is this?</Label>
            <RadioGroup value={trustType} onValueChange={handleTypeChange}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="revocable" id="revocable" />
                <div className="flex-1">
                  <Label htmlFor="revocable" className="cursor-pointer font-medium">
                    Revocable Trust
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    You retain control — fully Zakatable
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="irrevocable" id="irrevocable" />
                <div className="flex-1">
                  <Label htmlFor="irrevocable" className="cursor-pointer font-medium">
                    Irrevocable Trust
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    May not be Zakatable if you can't access principal
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="split" id="split" />
                <div className="flex-1">
                  <Label htmlFor="split" className="cursor-pointer font-medium">
                    Split Between Both
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allocate amounts to each type
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {trustType === "split" && (
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="space-y-2">
                <Label htmlFor="revocable-amount">Revocable Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="revocable-amount"
                    type="number"
                    className="pl-7"
                    value={revocableAmount || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setRevocableAmount(val);
                      setIrrevocableAmount(Math.max(0, extractedValue - val));
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="irrevocable-amount">Irrevocable Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="irrevocable-amount"
                    type="number"
                    className="pl-7"
                    value={irrevocableAmount || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setIrrevocableAmount(val);
                      setRevocableAmount(Math.max(0, extractedValue - val));
                    }}
                  />
                </div>
              </div>
              
              {revocableAmount + irrevocableAmount !== extractedValue && (
                <p className="text-sm text-destructive">
                  Amounts should total {formatCurrency(extractedValue)}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Allocation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
