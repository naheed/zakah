import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";

interface CryptoStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function CryptoStep({ data, updateData }: CryptoStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="₿"
        title="Cryptocurrency & Digital Assets"
        subtitle="Bitcoin, Ethereum, altcoins, and DeFi"
      />
      
      <div className="space-y-8">
        <InfoCard variant="info">
          <p>
            Cryptocurrency classification depends on <strong>Usage and Intent</strong>. 
            Major cryptocurrencies treated as currency vs. speculative tokens treated as trade goods.
          </p>
        </InfoCard>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Crypto as Currency</h3>
          
          <CurrencyInput
            label="₿ Bitcoin, Ethereum & Major Crypto"
            description="BTC, ETH, and stablecoins (USDC, USDT) held as store of value. Use spot price on Zakat date."
            value={data.cryptoCurrency}
            onChange={(value) => updateData({ cryptoCurrency: value })}
          />
          
          <InfoCard variant="tip" title="Currency Treatment">
            <p>
              Major cryptocurrencies like Bitcoin and Ethereum are treated as <strong>currency 
              (thaman)</strong>. Zakat is due on 100% of their market value, regardless of 
              intention to sell or hold.
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Crypto as Trade Goods</h3>
          
          <CurrencyInput
            label="🎰 Altcoins, Tokens & NFTs (Trading)"
            description="Altcoins, tokens, or NFTs purchased for capital appreciation and resale (flipping)"
            value={data.cryptoTrading}
            onChange={(value) => updateData({ cryptoTrading: value })}
          />
          
          <InfoCard variant="info">
            <p>
              These are classified as <strong>trade goods (urud al-tijarah)</strong>. 
              The entire market value on the Zakat Due Date is Zakatable.
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Staking & DeFi</h3>
          
          <CurrencyInput
            label="🔐 Staked Assets (Principal)"
            description="Principal amount of crypto locked in staking contracts. You retain ownership."
            value={data.stakedAssets}
            onChange={(value) => updateData({ stakedAssets: value })}
          />
          
          <CurrencyInput
            label="🎁 Vested Staking Rewards"
            description="Staking rewards that are vested and accessible to you. Unvested rewards are exempt."
            value={data.stakedRewardsVested}
            onChange={(value) => updateData({ stakedRewardsVested: value })}
          />
          
          <InfoCard variant="tip" title="Staking Treatment">
            <p>
              The <strong>principal</strong> remains Zakatable even when locked (the lock is voluntary 
              for growth). <strong>Rewards</strong> are only Zakatable once vested and accessible.
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <CurrencyInput
            label="💧 Liquidity Pool Value"
            description="Current redeemable value of your LP positions (not historical deposit)"
            value={data.liquidityPoolValue}
            onChange={(value) => updateData({ liquidityPoolValue: value })}
          />
          
          <InfoCard variant="warning" title="Liquidity Pool Calculation">
            <p>
              Calculate Zakat on the <strong>current withdrawal value</strong> of the underlying 
              assets, not the historical deposit. Due to "impermanent loss," the ratio may have 
              shifted. Query your LP position's redeemable value on the Zakat Due Date.
            </p>
          </InfoCard>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Zakat Treatment of Digital Assets</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground">Asset Type</th>
                  <th className="text-left py-2 text-muted-foreground">Treatment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2">Bitcoin (BTC)</td>
                  <td className="py-2">Currency - 100%</td>
                </tr>
                <tr>
                  <td className="py-2">Stablecoins (USDC)</td>
                  <td className="py-2">Currency - Face Value</td>
                </tr>
                <tr>
                  <td className="py-2">Altcoins (Trading)</td>
                  <td className="py-2">Trade Goods - 100%</td>
                </tr>
                <tr>
                  <td className="py-2">Staked Assets</td>
                  <td className="py-2">Principal + Vested Rewards</td>
                </tr>
                <tr>
                  <td className="py-2">Liquidity Pool</td>
                  <td className="py-2">Redeemable Value</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
