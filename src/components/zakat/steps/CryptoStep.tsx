import { ZakatFormData } from "@/lib/zakatCalculations";
import { cryptoContent } from "@/lib/zakatContent";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";

export function CryptoStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;

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
        label="Bitcoin, Ethereum & Major Crypto" 
        description="Treated as currency—100% Zakatable" 
        householdDescription="Combined major crypto holdings for all family members"
        isHousehold={isHousehold}
        value={data.cryptoCurrency} 
        onChange={(value) => updateData({ cryptoCurrency: value })} 
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'cryptoCurrency')}
      />
      <CurrencyInput 
        label="Altcoins, Tokens & NFTs (Trading)" 
        description="Held for trading/flipping—100% Zakatable" 
        householdDescription="Combined altcoins/NFTs for all family members"
        isHousehold={isHousehold}
        value={data.cryptoTrading} 
        onChange={(value) => updateData({ cryptoTrading: value })} 
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'cryptoTrading')}
      />
      
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-foreground">Staking & DeFi</h3>
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
          label="Liquidity Pool Value" 
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
