import { 
  Banknote, 
  TrendingUp, 
  Landmark, 
  Building2, 
  Briefcase, 
  Coins,
  Bitcoin,
  CreditCard
} from "lucide-react";

const assetTypes = [
  { icon: Banknote, label: "Cash & Savings", description: "Bank accounts, checking, savings" },
  { icon: TrendingUp, label: "Stocks & Funds", description: "Brokerage, mutual funds, ETFs" },
  { icon: Bitcoin, label: "Cryptocurrency", description: "Bitcoin, Ethereum, and others" },
  { icon: Landmark, label: "Retirement", description: "401(k), IRA, pension plans" },
  { icon: Building2, label: "Real Estate", description: "Investment & rental properties" },
  { icon: Briefcase, label: "Business Assets", description: "Inventory, receivables, cash" },
  { icon: Coins, label: "Precious Metals", description: "Gold, silver holdings" },
  { icon: CreditCard, label: "Debts & Liabilities", description: "Deductible obligations" },
];

export function AssetTypeGrid() {
  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-foreground text-center mb-2">
          We Handle the Complexity
        </h2>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          Modern asset types covered with scholarly guidance
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {assetTypes.map((asset, index) => (
            <div 
              key={index}
              className="group p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                <asset.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm mb-1">
                {asset.label}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {asset.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
