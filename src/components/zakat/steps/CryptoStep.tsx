import { ZakatFormData } from "@/lib/zakatCalculations";
import { cryptoContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";

interface CryptoStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function CryptoStep({ data, updateData }: CryptoStepProps) {
  return (
    <QuestionLayout content={cryptoContent}>
      <CurrencyInput
        label="Bitcoin, Ethereum & Major Crypto"
        description="Treated as currency—100% Zakatable"
        value={data.cryptoCurrency}
        onChange={(value) => updateData({ cryptoCurrency: value })}
      />
      
      <CurrencyInput
        label="Altcoins, Tokens & NFTs (Trading)"
        description="Held for trading/flipping—100% Zakatable"
        value={data.cryptoTrading}
        onChange={(value) => updateData({ cryptoTrading: value })}
      />
      
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-foreground">Staking & DeFi</h3>
        
        <CurrencyInput
          label="Staked Assets (Principal)"
          description="Your staked principal—fully Zakatable"
          value={data.stakedAssets}
          onChange={(value) => updateData({ stakedAssets: value })}
        />
        
        <CurrencyInput
          label="Vested Staking Rewards"
          description="Only accessible/vested rewards"
          value={data.stakedRewardsVested}
          onChange={(value) => updateData({ stakedRewardsVested: value })}
        />
        
        <CurrencyInput
          label="Liquidity Pool Value"
          description="Current redeemable value of LP positions"
          value={data.liquidityPoolValue}
          onChange={(value) => updateData({ liquidityPoolValue: value })}
        />
      </div>
    </QuestionLayout>
  );
}
