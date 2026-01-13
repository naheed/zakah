import { useState } from "react";
import { ZakatFormData, GOLD_PRICE_PER_OUNCE, SILVER_PRICE_PER_OUNCE } from "@/lib/zakatCalculations";
import { preciousMetalsContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { WeightConverter } from "../WeightConverter";
import { WhyTooltip, fiqhExplanations } from "../WhyTooltip";
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
  const [excludeWornJewelry, setExcludeWornJewelry] = useState(false);

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
      {/* Jewelry Exemption Toggle */}
      <div className="p-4 rounded-xl bg-surface-container border border-border mb-6">
        <div className="flex items-start gap-3">
          <Checkbox
            id="exclude-worn-jewelry"
            checked={excludeWornJewelry}
            onCheckedChange={(checked) => setExcludeWornJewelry(checked === true)}
            className="mt-0.5"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Label 
                htmlFor="exclude-worn-jewelry" 
                className="text-sm font-medium cursor-pointer"
              >
                Exclude regularly worn jewelry
              </Label>
              <WhyTooltip {...fiqhExplanations.jewelryExemption} />
            </div>
            <p className="text-xs text-muted-foreground">
              Majority view (Shafi'i, Maliki, Hanbali): Jewelry worn regularly is exempt like clothing.
            </p>
          </div>
        </div>
        
        <AnimatePresence>
          {excludeWornJewelry && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex gap-2">
                  <Info weight="duotone" className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Only enter gold/silver NOT worn regularly</p>
                    <p>Exclude: Daily-wear rings, bangles, necklaces you wear often.</p>
                    <p>Include: Investment gold, bullion, jewelry kept in storage.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Gold</span>
              <WhyTooltip {...fiqhExplanations.goldSilver} />
            </div>
            <WeightConverter
              label="Gold Weight"
              pricePerOunce={GOLD_PRICE_PER_OUNCE}
              value={data.goldValue}
              onChange={(value) => updateData({ goldValue: value })}
              isHousehold={isHousehold}
            />
          </div>
          
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Gold Value</span>
              <WhyTooltip {...fiqhExplanations.goldSilver} />
            </div>
            <CurrencyInput
              label="Gold Value"
              description="Melt value of gold items (not gemstones or craftsmanship)"
              householdDescription="Combined gold value for all family members"
              isHousehold={isHousehold}
              value={data.goldValue}
              onChange={(value) => updateData({ goldValue: value })}
              documentContributions={getDocumentContributionsForField(uploadedDocuments, 'goldValue')}
            />
          </div>
          
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
