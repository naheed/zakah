import { ZakatFormData } from "@/lib/zakatCalculations";
import { debtOwedContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";

interface DebtOwedToYouStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function DebtOwedToYouStep({ data, updateData }: DebtOwedToYouStepProps) {
  return (
    <QuestionLayout content={debtOwedContent}>
      <CurrencyInput
        label="Good Debt (Collectible)"
        description="Borrower is willing and able to pay"
        value={data.goodDebtOwedToYou}
        onChange={(value) => updateData({ goodDebtOwedToYou: value })}
      />
      
      <CurrencyInput
        label="Bad Debt Recovered This Year"
        description="Previously uncollectible debt you actually received"
        value={data.badDebtRecovered}
        onChange={(value) => updateData({ badDebtRecovered: value })}
      />
    </QuestionLayout>
  );
}
