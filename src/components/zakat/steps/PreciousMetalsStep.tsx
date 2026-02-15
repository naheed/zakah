import { useState } from "react";
import { ZakatFormData, GOLD_PRICE_PER_OUNCE, SILVER_PRICE_PER_OUNCE } from "@/lib/zakatCalculations";
import { preciousMetalsContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { WeightConverter } from "../WeightConverter";
import { WhyTooltip } from "../WhyTooltip";
import { getFiqhExplanations } from "@/content/fiqhExplanations";
import { ZAKAT_PRESETS } from "@/lib/config/presets";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Scales, CurrencyDollar, Info } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function PreciousMetalsStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;
  const [inputMode, setInputMode] = useState<'weight' | 'value'>('weight');
  const config = ZAKAT_PRESETS[data.madhab] || ZAKAT_PRESETS['balanced'];
  const fiqhExplanations = getFiqhExplanations(config);

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

        <TabsContent value="weight" className="mt-8 space-y-8">
          {/* Gold Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="text-base font-semibold text-foreground">Gold</span>
              <WhyTooltip {...fiqhExplanations.goldSilver} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <WeightConverter
                label="Investment Gold (Coins/Bars)"
                pricePerOunce={GOLD_PRICE_PER_OUNCE}
                value={data.goldInvestmentValue}
                onChange={(value) => updateData({ goldInvestmentValue: value })}
                isHousehold={isHousehold}
              />
              <WeightConverter
                label="Gold Jewelry (Wearable)"
                pricePerOunce={GOLD_PRICE_PER_OUNCE}
                value={data.goldJewelryValue}
                onChange={(value) => updateData({ goldJewelryValue: value })}
                isHousehold={isHousehold}
              />
            </div>
          </div>

          {/* Silver Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="text-base font-semibold text-foreground">Silver</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <WeightConverter
                label="Investment Silver"
                pricePerOunce={SILVER_PRICE_PER_OUNCE}
                value={data.silverInvestmentValue}
                onChange={(value) => updateData({ silverInvestmentValue: value })}
                isHousehold={isHousehold}
              />
              <WeightConverter
                label="Silver Jewelry"
                pricePerOunce={SILVER_PRICE_PER_OUNCE}
                value={data.silverJewelryValue}
                onChange={(value) => updateData({ silverJewelryValue: value })}
                isHousehold={isHousehold}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <strong>Note on Jewelry:</strong> Enter the full weight/value. If your selected methodology (e.g. Shafi'i) exempts jewelry, the calculator will automatically exclude it from your Zakat total.
          </p>
        </TabsContent>

        <TabsContent value="value" className="mt-8 space-y-8">
          {/* Gold Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="text-base font-semibold text-foreground">Gold Value</span>
              <WhyTooltip {...fiqhExplanations.goldSilver} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <CurrencyInput
                label="Investment Gold"
                description="Bullion, coins, bars"
                householdDescription="Combined investment gold"
                isHousehold={isHousehold}
                value={data.goldInvestmentValue}
                onChange={(value) => updateData({ goldInvestmentValue: value })}
                documentContributions={getDocumentContributionsForField(uploadedDocuments, 'goldInvestmentValue')}
                testId="gold-investment-input"
              />
              <CurrencyInput
                label="Gold Jewelry"
                description="Melt value of wearable items"
                householdDescription="Combined gold jewelry"
                isHousehold={isHousehold}
                value={data.goldJewelryValue}
                onChange={(value) => updateData({ goldJewelryValue: value })}
                documentContributions={getDocumentContributionsForField(uploadedDocuments, 'goldJewelryValue')}
                testId="gold-jewelry-input"
              />
            </div>
          </div>

          {/* Silver Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="text-base font-semibold text-foreground">Silver Value</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <CurrencyInput
                label="Investment Silver"
                description="Bullion, coins, bars"
                householdDescription="Combined investment silver"
                isHousehold={isHousehold}
                value={data.silverInvestmentValue}
                onChange={(value) => updateData({ silverInvestmentValue: value })}
                documentContributions={getDocumentContributionsForField(uploadedDocuments, 'silverInvestmentValue')}
                testId="silver-investment-input"
              />
              <CurrencyInput
                label="Silver Jewelry"
                description="Melt value of wearable items"
                householdDescription="Combined silver jewelry"
                isHousehold={isHousehold}
                value={data.silverJewelryValue}
                onChange={(value) => updateData({ silverJewelryValue: value })}
                documentContributions={getDocumentContributionsForField(uploadedDocuments, 'silverJewelryValue')}
                testId="silver-jewelry-input"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AssetStepWrapper>
  );
}
