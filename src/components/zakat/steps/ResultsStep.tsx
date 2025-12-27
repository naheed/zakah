import { ZakatFormData, formatCurrency, formatPercent, CalculationMode } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Download, RotateCcw, Settings2, Save, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { generateZakatPDF } from "@/lib/generatePDF";
import { SaveCalculationDialog } from "../SaveCalculationDialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ZakatSankeyChart, SankeyChartData } from "../ZakatSankeyChart";

interface ResultsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
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
  calculationName?: string;
  savedCalculationId?: string;
  onCalculationSaved?: (id: string) => void;
}

export function ResultsStep({ data, updateData, calculations, calculationName, savedCalculationId, onCalculationSaved }: ResultsStepProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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

  const handleSignIn = () => {
    navigate('/auth');
  };
  
  const handleDownload = () => {
    setIsGeneratingPDF(true);
    try {
      generateZakatPDF(data, calculations, calculationName);
      toast({
        title: "PDF Downloaded",
        description: "Your Zakat calculation report has been downloaded.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
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
        
        {/* Sankey Flow Chart */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-accent flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Asset Flow to Zakat</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const newMode = data.calculationMode === 'conservative' ? 'optimized' : 'conservative';
                updateData({ calculationMode: newMode });
              }}
            >
              <Settings2 className="w-4 h-4 mr-1" />
              {data.calculationMode === 'conservative' ? 'Conservative' : 'Optimized'}
            </Button>
          </div>
          
          {showSettings && (
            <div className="p-4 bg-muted/50 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Conservative:</strong> Pay on full asset values (safer)
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Optimized:</strong> Apply 30% rule for passive investments, deduct taxes/penalties from retirement
              </p>
            </div>
          )}
          
          {/* Sankey Chart with Fullscreen */}
          <div className="p-4 flex justify-center relative">
            <ZakatSankeyChart 
              data={{
                liquidAssets: assetBreakdown.liquidAssets,
                investments: assetBreakdown.investments,
                retirement: assetBreakdown.retirement,
                realEstate: assetBreakdown.realEstate,
                business: assetBreakdown.business,
                otherAssets: assetBreakdown.otherAssets,
                totalLiabilities,
                zakatDue,
                netZakatableWealth,
                zakatRate,
              }}
              currency={currency}
              width={500}
              height={320}
              showFullscreenButton={true}
            />
          </div>
          
          {/* Legend with clear naming */}
          <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {assetBreakdown.liquidAssets > 0 && (
              <LegendItem label="Cash & Savings" value={formatCurrency(assetBreakdown.liquidAssets, currency)} color="hsl(142, 76%, 36%)" />
            )}
            {assetBreakdown.investments > 0 && (
              <LegendItem label="Investments" value={formatCurrency(assetBreakdown.investments, currency)} color="hsl(221, 83%, 53%)" />
            )}
            {assetBreakdown.retirement > 0 && (
              <LegendItem label="Retirement" value={formatCurrency(assetBreakdown.retirement, currency)} color="hsl(262, 83%, 58%)" />
            )}
            {assetBreakdown.realEstate > 0 && (
              <LegendItem label="Real Estate" value={formatCurrency(assetBreakdown.realEstate, currency)} color="hsl(25, 95%, 53%)" />
            )}
            {assetBreakdown.business > 0 && (
              <LegendItem label="Business" value={formatCurrency(assetBreakdown.business, currency)} color="hsl(340, 82%, 52%)" />
            )}
            {assetBreakdown.otherAssets > 0 && (
              <LegendItem label="Other Assets" value={formatCurrency(assetBreakdown.otherAssets, currency)} color="hsl(var(--primary))" />
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

        {/* Save Your Work Prompt - for non-authenticated users */}
        {!user && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Save Your Calculation</h3>
              <p className="text-muted-foreground text-sm">
                Create a free account to save this calculation and access it anytime. 
                You can also track your Zakat history across multiple years.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleSignIn} className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign In / Create Account
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Don't worry — your calculation is saved locally and will be available when you return.
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={handleDownload}
            disabled={isGeneratingPDF}
          >
            <Download className="w-4 h-4" />
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </Button>
          {user && (
            <SaveCalculationDialog 
              formData={data}
              onSaved={onCalculationSaved}
              trigger={
                <Button variant="outline" className="flex-1 gap-2">
                  <Save className="w-4 h-4" />
                  {savedCalculationId ? 'Save As New' : 'Save'}
                </Button>
              }
            />
          )}
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
  color,
}: { 
  label: string; 
  value: string; 
  variant?: 'positive' | 'negative' | 'neutral' | 'muted';
  bold?: boolean;
  color?: string;
}) {
  const valueColors = {
    positive: 'text-chart-1',
    negative: 'text-destructive',
    neutral: 'text-foreground',
    muted: 'text-muted-foreground',
  };
  
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        {color && (
          <span 
            className="w-3 h-3 rounded-full flex-shrink-0" 
            style={{ backgroundColor: color }}
          />
        )}
        <span className={`${bold ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
          {label}
        </span>
      </div>
      <span className={`font-mono ${bold ? 'font-bold text-lg' : ''} ${valueColors[variant]}`}>
        {value}
      </span>
    </div>
  );
}

function LegendItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-muted-foreground truncate">{label}</span>
      <span className="font-medium text-foreground ml-auto">{value}</span>
    </div>
  );
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

function AssetDonutChart({ 
  breakdown, 
  currency 
}: { 
  breakdown: ResultsStepProps['calculations']['assetBreakdown'];
  currency: string;
}) {
  const chartData: ChartData[] = [
    { name: 'Liquid Assets', value: breakdown.liquidAssets, color: 'hsl(var(--chart-1))' },
    { name: 'Investments', value: breakdown.investments, color: 'hsl(var(--chart-2))' },
    { name: 'Retirement', value: breakdown.retirement, color: 'hsl(var(--chart-3))' },
    { name: 'Real Estate', value: breakdown.realEstate, color: 'hsl(var(--chart-4))' },
    { name: 'Business', value: breakdown.business, color: 'hsl(var(--chart-5))' },
    { name: 'Other', value: breakdown.otherAssets, color: 'hsl(var(--primary))' },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        No assets to display
      </div>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatCurrency(value, currency)}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center -mt-4">
        <p className="text-sm text-muted-foreground">Total Zakatable</p>
        <p className="text-xl font-bold text-foreground">{formatCurrency(total, currency)}</p>
      </div>
    </div>
  );
}
