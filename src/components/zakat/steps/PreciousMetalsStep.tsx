import { useState } from "react";
import { ZakatFormData, GOLD_PRICE_PER_OUNCE, SILVER_PRICE_PER_OUNCE } from "@/lib/zakatCalculations";
import { preciousMetalsContent } from "@/lib/zakatContent";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { WeightConverter } from "../WeightConverter";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scales, CurrencyDollar } from "@phosphor-icons/react";

export function PreciousMetalsStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;
  const [inputMode, setInputMode] = useState<'weight' | 'value'>('weight');

  return (
    <AssetStepWrapper
      content={preciousMetalsContent}
      stepId="precious-metals"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include gold and silver owned by yourself, spouse, and children."
    >
      {/* Input Mode Toggle */}
      <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'weight' | 'value')} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="weight" className="gap-2 h-10 min-h-[40px] touch-manipulation">
            <Scales weight="duotone" className="w-4 h-4" />
            Enter by Weight
          </TabsTrigger>
          <TabsTrigger value="value" className="gap-2 h-10 min-h-[40px] touch-manipulation">
            <CurrencyDollar weight="duotone" className="w-4 h-4" />
            Enter USD Value
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weight" className="mt-6 space-y-6">
          <WeightConverter
            label="Gold"
            pricePerOunce={GOLD_PRICE_PER_OUNCE}
            value={data.goldValue}
            onChange={(value) => updateData({ goldValue: value })}
            isHousehold={isHousehold}
          />
          
          <WeightConverter
            label="Silver"
            pricePerOunce={SILVER_PRICE_PER_OUNCE}
            value={data.silverValue}
            onChange={(value) => updateData({ silverValue: value })}
            isHousehold={isHousehold}
          />
          
          <p className="text-xs text-muted-foreground">
            Prices are approximate. For jewelry, use melt value only (exclude gemstones & craftsmanship).
          </p>
        </TabsContent>
        
        <TabsContent value="value" className="mt-6 space-y-6">
          <CurrencyInput
            label="Gold Value"
            description="Melt value of gold items (not gemstones or craftsmanship)"
            householdDescription="Combined gold value for all family members"
            isHousehold={isHousehold}
            value={data.goldValue}
            onChange={(value) => updateData({ goldValue: value })}
            documentContributions={getDocumentContributionsForField(uploadedDocuments, 'goldValue')}
          />
          
          <CurrencyInput
            label="Silver Value"
            description="Melt value of silver items"
            householdDescription="Combined silver value for all family members"
            isHousehold={isHousehold}
            value={data.silverValue}
            onChange={(value) => updateData({ silverValue: value })}
            documentContributions={getDocumentContributionsForField(uploadedDocuments, 'silverValue')}
          />
        </TabsContent>
      </Tabs>
    </AssetStepWrapper>
  );
}
