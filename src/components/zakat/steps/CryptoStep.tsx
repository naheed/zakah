import { ZakatFormData } from "@/lib/zakatCalculations";
import { cryptoContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { WhyTooltip } from "../WhyTooltip";
import { getFiqhExplanations } from "@/content/fiqhExplanations";
import { ZAKAT_PRESETS } from "@/lib/config/presets";

export function CryptoStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;
  const config = ZAKAT_PRESETS[data.madhab] || ZAKAT_PRESETS['bradford'];
  const fiqhExplanations = getFiqhExplanations(config);

  return (
    <AssetStepWrapper
      content={cryptoContent}
      stepId="crypto"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      uploadLabel="Upload Crypto Statement"
      uploadDescription="Auto-fill from your exchange statement"
      householdReminder="Include crypto holdings for yourself, spouse, and children."
    >
      <CurrencyInput
        label={
          <span className="flex items-center gap-2">
            Bitcoin, Ethereum & Major Crypto
            <WhyTooltip {...fiqhExplanations.cryptoCurrency} />
          </span>
        }
        description="Treated as currency—100% Zakatable"
        householdDescription="Combined major crypto holdings for all family members"
        isHousehold={isHousehold}
        value={data.cryptoCurrency}
        onChange={(value) => updateData({ cryptoCurrency: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'cryptoCurrency')}
      />
      <CurrencyInput
        label={
          <span className="flex items-center gap-2">
            Altcoins, Tokens & NFTs (Trading)
            <WhyTooltip {...fiqhExplanations.cryptoTrading} />
          </span>
        }
        description="Held for trading/flipping—100% Zakatable"
        householdDescription="Combined altcoins/NFTs for all family members"
        isHousehold={isHousehold}
        value={data.cryptoTrading}
        onChange={(value) => updateData({ cryptoTrading: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'cryptoTrading')}
      />

      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">Staking & DeFi</h3>
          <WhyTooltip {...fiqhExplanations.stakedAssets} />
        </div>
        <CurrencyInput
          label="Staked Assets (Principal)"
          description="Your staked principal—fully Zakatable"
          householdDescription="Combined staked assets for all family members"
          isHousehold={isHousehold}
          value={data.stakedAssets}
          onChange={(value) => updateData({ stakedAssets: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'stakedAssets')}
        />
        <CurrencyInput
          label="Vested Staking Rewards"
          description="Only accessible/vested rewards"
          householdDescription="Combined staking rewards for all family members"
          isHousehold={isHousehold}
          value={data.stakedRewardsVested}
          onChange={(value) => updateData({ stakedRewardsVested: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'stakedRewardsVested')}
        />
        <CurrencyInput
          label={
            <span className="flex items-center gap-2">
              Liquidity Pool Value
              <WhyTooltip {...fiqhExplanations.defiLiquidity} />
            </span>
          }
          description="Current redeemable value of LP positions"
          householdDescription="Combined LP positions for all family members"
          isHousehold={isHousehold}
          value={data.liquidityPoolValue}
          onChange={(value) => updateData({ liquidityPoolValue: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'liquidityPoolValue')}
        />
      </div>
    </AssetStepWrapper>
  );
}
