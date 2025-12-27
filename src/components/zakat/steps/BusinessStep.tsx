import { ZakatFormData } from "@/lib/zakatCalculations";
import { businessContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";

interface BusinessStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function BusinessStep({ data, updateData }: BusinessStepProps) {
  return (
    <QuestionLayout content={businessContent}>
      <CurrencyInput
        label="Cash & Receivables"
        description="Business cash + accounts receivable"
        value={data.businessCashAndReceivables}
        onChange={(value) => updateData({ businessCashAndReceivables: value })}
      />
      
      <CurrencyInput
        label="Inventory"
        description="Goods for sale at current selling price"
        value={data.businessInventory}
        onChange={(value) => updateData({ businessInventory: value })}
      />
    </QuestionLayout>
  );
}
