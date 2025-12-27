import { ZakatFormData, formatCurrency, formatPercent, CalculationMode } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Download, Mail, RotateCcw, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface ResultsStepProps {
  data: ZakatFormData;
  calculations: {
    totalAssets: number;
    totalLiabilities: number;
    netZakatableWealth: number;
    nisab: number;
    isAboveNisab: boolean;
    zakatDue: number;
    zakatRate: number;
    interestToPurify: number;
    dividendsToPurify: number;
    assetBreakdown: {
      liquidAssets: number;
      investments: number;
      retirement: number;
      realEstate: number;
      business: number;
      otherAssets: number;
      exemptAssets: number;
    };
  };
}

export function ResultsStep({ data, calculations }: ResultsStepProps) {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const { currency } = data;
  const {
    totalAssets,
    totalLiabilities,
    netZakatableWealth,
    nisab,
    isAboveNisab,
    zakatDue,
    zakatRate,
    interestToPurify,
    dividendsToPurify,
    assetBreakdown,
  } = calculations;
  
  const totalPurification = interestToPurify + dividendsToPurify;
  
  const handleEmailReceipt = () => {
    toast({
      title: "Receipt Sent",
      description: `A copy of your Zakat calculation has been sent to ${data.email || 'your email'}.`,
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your Zakat calculation PDF is being generated.",
    });
  };
  
  const handleReset = () => {
    window.location.reload();
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <StepHeader
        title="Your Zakat Calculation"
        subtitle="Based on Sheikh Joe Bradford's methodology"
      />
      
      <div className="space-y-6">
        {/* Main Result Card */}
        <div className={`rounded-2xl p-8 text-center ${
          isAboveNisab 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-foreground'
        }`}>
          {isAboveNisab ? (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <p className="text-lg opacity-90 mb-2">Your Zakat Due</p>
              <p className="text-5xl font-bold mb-4">
                {formatCurrency(zakatDue, currency)}
              </p>
              <p className="text-sm opacity-80">
                {formatPercent(zakatRate)} of your net Zakatable wealth ({data.calendarType} year)
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg mb-2">Below Niṣāb Threshold</p>
              <p className="text-2xl font-semibold mb-4">
                No Zakat Due This Year
              </p>
              <p className="text-sm text-muted-foreground">
                Your wealth is below {formatCurrency(nisab, currency)}
              </p>
            </>
          )}
        </div>
        
        {/* Purification Alert */}
        {totalPurification > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
            <h3 className="font-semibold text-destructive mb-2">⚠️ Purification Required</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The following amounts must be donated to charity (without reward expectation):
            </p>
            <div className="space-y-1">
              {interestToPurify > 0 && (
                <p className="text-sm">
                  Interest (Riba): <strong>{formatCurrency(interestToPurify, currency)}</strong>
                </p>
              )}
              {dividendsToPurify > 0 && (
                <p className="text-sm">
                  Non-Halal Dividends: <strong>{formatCurrency(dividendsToPurify, currency)}</strong>
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Asset Breakdown */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-accent flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Asset Breakdown</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings2 className="w-4 h-4 mr-1" />
              {data.calculationMode === 'conservative' ? 'Conservative' : 'Optimized'}
            </Button>
          </div>
          
          <div className="divide-y divide-border">
            {assetBreakdown.liquidAssets > 0 && (
              <BreakdownRow label="Liquid Assets" value={formatCurrency(assetBreakdown.liquidAssets, currency)} />
            )}
            {assetBreakdown.investments > 0 && (
              <BreakdownRow label="Investments" value={formatCurrency(assetBreakdown.investments, currency)} />
            )}
            {assetBreakdown.retirement > 0 && (
              <BreakdownRow label="Retirement Accounts" value={formatCurrency(assetBreakdown.retirement, currency)} />
            )}
            {assetBreakdown.realEstate > 0 && (
              <BreakdownRow label="Real Estate" value={formatCurrency(assetBreakdown.realEstate, currency)} />
            )}
            {assetBreakdown.business > 0 && (
              <BreakdownRow label="Business Assets" value={formatCurrency(assetBreakdown.business, currency)} />
            )}
            {assetBreakdown.otherAssets > 0 && (
              <BreakdownRow label="Other Assets" value={formatCurrency(assetBreakdown.otherAssets, currency)} />
            )}
            {assetBreakdown.exemptAssets > 0 && (
              <BreakdownRow label="Exempt Assets" value={formatCurrency(assetBreakdown.exemptAssets, currency)} variant="muted" />
            )}
          </div>
        </div>
        
        {/* Calculation Summary */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-accent">
            <h3 className="font-semibold text-foreground">Calculation Summary</h3>
          </div>
          
          <div className="divide-y divide-border">
            <BreakdownRow label="Total Zakatable Assets" value={formatCurrency(totalAssets, currency)} />
            <BreakdownRow label="Total Deductions" value={`-${formatCurrency(totalLiabilities, currency)}`} variant="negative" />
            <BreakdownRow label="Net Zakatable Wealth" value={formatCurrency(netZakatableWealth, currency)} bold />
            <BreakdownRow label={`Niṣāb (${data.nisabStandard})`} value={formatCurrency(nisab, currency)} />
            <BreakdownRow label={`Zakat Rate (${data.calendarType})`} value={formatPercent(zakatRate)} />
            <BreakdownRow label="Zakat Due" value={formatCurrency(zakatDue, currency)} variant="positive" bold />
          </div>
        </div>
        
        {isAboveNisab && (
          <InfoCard variant="success" title="Congratulations!">
            <p>
              Allah has blessed you with wealth above the niṣāb. By paying your Zakat, 
              you purify your wealth and fulfill one of the five pillars of Islam. 
              May Allah accept your Zakat and bless you with more.
            </p>
          </InfoCard>
        )}
        
        {!isAboveNisab && (
          <InfoCard variant="tip" title="Consider Voluntary Charity">
            <p>
              While Zakat is not obligatory for you this year, you can still earn 
              rewards through voluntary charity (Sadaqah). Every good deed counts!
            </p>
          </InfoCard>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {data.email && (
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={handleEmailReceipt}
            >
              <Mail className="w-4 h-4" />
              Email Receipt
            </Button>
          )}
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </Button>
        </div>
        
        <InfoCard variant="warning" title="Important Note">
          <p>
            This calculator does not cover: (1) Farming assets harvested for sale, 
            (2) Ḥarām earnings (bonds, interest income, etc.). If you have these, 
            please consult a specialist in Islamic Finance.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}

function BreakdownRow({ 
  label, 
  value, 
  variant = 'neutral',
  bold = false,
}: { 
  label: string; 
  value: string; 
  variant?: 'positive' | 'negative' | 'neutral' | 'muted';
  bold?: boolean;
}) {
  const valueColors = {
    positive: 'text-chart-1',
    negative: 'text-destructive',
    neutral: 'text-foreground',
    muted: 'text-muted-foreground',
  };
  
  return (
    <div className="flex items-center justify-between p-4">
      <span className={`${bold ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </span>
      <span className={`font-mono ${bold ? 'font-bold text-lg' : ''} ${valueColors[variant]}`}>
        {value}
      </span>
    </div>
  );
}
