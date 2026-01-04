import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSavedCalculations, getCurrentLunarYear, getCurrentGregorianYear, generateYearName } from '@/hooks/useSavedCalculations';
import { ZakatFormData } from '@/lib/zakatCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FloppyDisk, Spinner } from '@phosphor-icons/react';
import { useToast } from '@/hooks/use-toast';

interface SaveCalculationDialogProps {
  formData: ZakatFormData;
  trigger?: React.ReactNode;
  onSaved?: (calculationId: string) => void;
}

export function SaveCalculationDialog({ formData, trigger, onSaved }: SaveCalculationDialogProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveCalculation } = useSavedCalculations();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [yearType, setYearType] = useState<'lunar' | 'gregorian'>(
    formData.calendarType === 'lunar' ? 'lunar' : 'gregorian'
  );
  const [yearValue, setYearValue] = useState(
    formData.calendarType === 'lunar' ? getCurrentLunarYear() : getCurrentGregorianYear()
  );
  const [customName, setCustomName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const generatedName = generateYearName(yearType, yearValue);
  const displayName = customName || `Zakat ${generatedName}`;

  const handleYearTypeChange = (value: 'lunar' | 'gregorian') => {
    setYearType(value);
    if (value === 'lunar') {
      setYearValue(getCurrentLunarYear());
    } else {
      setYearValue(getCurrentGregorianYear());
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save your calculation.',
        variant: 'destructive',
      });
      setOpen(false);
      navigate('/auth');
      return;
    }

    setIsSaving(true);
    const result = await saveCalculation(displayName, yearType, yearValue, formData);
    setIsSaving(false);

    if (result) {
      onSaved?.(result.id);
      setOpen(false);
      setCustomName('');
    }
  };

  // Generate year options
  const currentGregorianYear = getCurrentGregorianYear();
  const currentLunarYear = getCurrentLunarYear();

  const yearOptions = yearType === 'gregorian'
    ? [currentGregorianYear - 1, currentGregorianYear, currentGregorianYear + 1]
    : [currentLunarYear - 1, currentLunarYear, currentLunarYear + 1];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <FloppyDisk className="w-4 h-4" />
            Save Calculation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Calculation</DialogTitle>
          <DialogDescription>
            Save this Zakat calculation for future reference. You can name it by year.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Year Type</Label>
            <Select value={yearType} onValueChange={handleYearTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lunar">Lunar (Hijri)</SelectItem>
                <SelectItem value="gregorian">Gregorian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={yearValue.toString()} onValueChange={(v) => setYearValue(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {yearType === 'lunar' ? `${year} AH` : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-name">Custom Name (optional)</Label>
            <Input
              id="custom-name"
              placeholder={`Zakat ${generatedName}`}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Will be saved as: <strong>{displayName}</strong>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Spinner className="w-4 h-4 animate-spin mr-2" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
