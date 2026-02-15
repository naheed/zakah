import { ZakatFormData } from "@/lib/zakatCalculations";
import { liabilitiesContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { WhyTooltip, fiqhExplanations } from "../WhyTooltip";

import { ZAKAT_PRESETS } from "@/lib/config/presets";

export function LiabilitiesStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;

  // Determine expense period from methodology
  const methodId = data.madhab || 'balanced';
  const config = ZAKAT_PRESETS[methodId] || ZAKAT_PRESETS['balanced'];
  const liabMethod = config.liabilities.method;
  const isAnnual = liabMethod === '12_month_rule' || liabMethod === 'full_deduction';

  // Dynamic Content for AssetStepWrapper
  const dynamicContent = {
    ...liabilitiesContent,
    introByMethodology: {
      ...liabilitiesContent.introByMethodology,
      [methodId]: {
        ...liabilitiesContent.introByMethodology?.[methodId as keyof typeof liabilitiesContent.introByMethodology],
        summary: isAnnual
          ? "Only immediate debts due within 12 months are deductible. Long-term mortgage principal and deferred loans don't reduce your Zakatable wealth."
          : "Only debts due this month are deductible. Future obligations do not reduce your current Zakatable wealth."
      }
    }
  };

  const livingExpensesDesc = isAnnual
    ? "Rent, utilities, groceries, transport — we multiply by 12"
    : "Rent, utilities, groceries, transport — calculated for current month only";

  const mortgageDesc = isAnnual
    ? "12 months deductible per AMJA opinion"
    : "Current month deductible only";

  return (
    <AssetStepWrapper
      content={dynamicContent}
      stepId="liabilities"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={true}
      uploadLabel="Upload Financial Statement"
      uploadDescription="Credit card, mortgage, or loan statements"
      householdReminder="Include expenses and liabilities for your entire household."
    >
      <CurrencyInput
        label={
          <span className="flex items-center gap-2">
            Monthly Living Expenses
            <WhyTooltip {...fiqhExplanations.monthlyLiving} />
          </span>
        }
        description={livingExpensesDesc}
        householdDescription="Combined living expenses for all family members"
        isHousehold={isHousehold}
        value={data.monthlyLivingExpenses}
        onChange={(value) => updateData({ monthlyLivingExpenses: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'monthlyLivingExpenses')}
        testId="monthly-living-expenses-input"
      />

      <CurrencyInput
        label={
          <span className="flex items-center gap-2">
            Monthly Mortgage Payment
            <WhyTooltip {...fiqhExplanations.mortgageDeduction} />
          </span>
        }
        description={mortgageDesc}
        householdDescription="Combined mortgage for your household"
        isHousehold={isHousehold}
        value={data.monthlyMortgage}
        onChange={(value) => updateData({ monthlyMortgage: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'monthlyMortgage')}
        testId="monthly-mortgage-input"
      />
      {isAnnual && data.monthlyMortgage > 20000 && (
        <div className="p-3 mb-4 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm flex gap-2 items-start animate-fade-in">
          <span className="text-xl">⚠️</span>
          <div>
            <strong>High Amount Detected:</strong> Are you entering your <em>total</em> mortgage balance?
            <br />
            Please only enter <strong>ONE month's payment</strong>. We automatically multiply this by 12 for the calculation.
          </div>
        </div>
      )}
      {!isAnnual && data.monthlyMortgage > 20000 && (
        <div className="p-3 mb-4 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm flex gap-2 items-start animate-fade-in">
          <span className="text-xl">⚠️</span>
          <div>
            <strong>High Amount Detected:</strong> Are you entering your <em>total</em> mortgage balance?
          </div>
        </div>
      )}

      <CurrencyInput
        label="Insurance Expenses"
        description="Home, auto, medical insurance due"
        householdDescription="Combined insurance for all family members"
        isHousehold={isHousehold}
        value={data.insuranceExpenses}
        onChange={(value) => updateData({ insuranceExpenses: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'insuranceExpenses')}
        testId="insurance-expenses-input"
      />

      <CurrencyInput
        label="Credit Card Balance"
        description="Total balance due immediately"
        householdDescription="Combined credit card balances for all family members"
        isHousehold={isHousehold}
        value={data.creditCardBalance}
        onChange={(value) => updateData({ creditCardBalance: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'creditCardBalance')}
        testId="credit-card-debt-input"
      />

      <CurrencyInput
        label="Unpaid Bills"
        description="Utility, medical, or other bills due"
        householdDescription="Combined unpaid bills for all family members"
        isHousehold={isHousehold}
        value={data.unpaidBills}
        onChange={(value) => updateData({ unpaidBills: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'unpaidBills')}
        testId="unpaid-bills-input"
      />

      <CurrencyInput
        label={
          <span className="flex items-center gap-2">
            Student Loan Payments Due
            <WhyTooltip {...fiqhExplanations.studentLoans} />
          </span>
        }
        description="Only current installment, not total balance"
        householdDescription="Combined student loan payments for all family members"
        isHousehold={isHousehold}
        value={data.studentLoansDue}
        onChange={(value) => updateData({ studentLoansDue: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'studentLoansDue')}
        testId="student-loans-due-input"
      />
    </AssetStepWrapper>
  );
}
