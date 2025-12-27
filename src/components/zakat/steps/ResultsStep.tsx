import { ZakatFormData, formatCurrency } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Download, Mail, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsStepProps {
  data: ZakatFormData;
  calculations: {
    totalAssets: number;
    totalLiabilities: number;
    netZakatableWealth: number;
    nisab: number;
    isAboveNisab: boolean;
    zakatDue: number;
  };
}

export function ResultsStep({ data, calculations }: ResultsStepProps) {
  const { toast } = useToast();
  const { currency } = data;
  const {
    totalAssets,
    totalLiabilities,
    netZakatableWealth,
    nisab,
    isAboveNisab,
    zakatDue,
  } = calculations;
  
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
                2.5% of your net Zakatable wealth
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
        
        {/* Breakdown */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-accent">
            <h3 className="font-semibold text-foreground">Calculation Breakdown</h3>
          </div>
          
          <div className="divide-y divide-border">
            <BreakdownRow
              label="Total Zakatable Assets"
              value={formatCurrency(totalAssets, currency)}
              variant="neutral"
            />
            <BreakdownRow
              label="Total Deductions"
              value={`-${formatCurrency(totalLiabilities, currency)}`}
              variant="negative"
            />
            <BreakdownRow
              label="Net Zakatable Wealth"
              value={formatCurrency(netZakatableWealth, currency)}
              variant="neutral"
              bold
            />
            <BreakdownRow
              label="Niṣāb Threshold"
              value={formatCurrency(nisab, currency)}
              variant="neutral"
            />
            <BreakdownRow
              label="Zakat Rate"
              value="2.5%"
              variant="neutral"
            />
            <BreakdownRow
              label="Zakat Due"
              value={formatCurrency(zakatDue, currency)}
              variant="positive"
              bold
            />
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
  variant,
  bold = false,
}: { 
  label: string; 
  value: string; 
  variant: 'positive' | 'negative' | 'neutral';
  bold?: boolean;
}) {
  const valueColors = {
    positive: 'text-chart-1',
    negative: 'text-destructive',
    neutral: 'text-foreground',
  };
  
  return (
    <div className="flex items-center justify-between p-4">
      <span className={`text-muted-foreground ${bold ? 'font-medium' : ''}`}>
        {label}
      </span>
      <span className={`font-mono ${bold ? 'font-bold text-lg' : ''} ${valueColors[variant]}`}>
        {value}
      </span>
    </div>
  );
}
