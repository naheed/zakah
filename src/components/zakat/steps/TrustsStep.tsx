import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TrustsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function TrustsStep({ data, updateData }: TrustsStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="📜"
        title="Trusts & Estates"
        subtitle="Understanding ownership in trust structures"
      />
      
      <div className="space-y-8">
        <InfoCard variant="info">
          <p>
            Trust Zakat liability depends on <strong>who holds "ownership" (Milk)</strong> of 
            the assets. In Islamic jurisprudence, ownership must be settled — it cannot be in limbo.
          </p>
        </InfoCard>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Revocable Living Trusts</h3>
          
          <CurrencyInput
            label="📝 Revocable Trust Value"
            description="If you can revoke the trust at any time, these assets are FULLY Zakatable"
            value={data.revocableTrustValue}
            onChange={(value) => updateData({ revocableTrustValue: value })}
          />
          
          <InfoCard variant="tip" title="Revocable Trust = Personal Asset">
            <p>
              In a Revocable Trust, you retain full control and the ability to revoke at any time. 
              The trust is merely a legal shell or "alter ego." <strong>Ruling:</strong> Fully 
              Zakatable — treat all underlying assets as if in your personal name.
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Irrevocable Trusts</h3>
          
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <Label className="text-foreground">Can you withdraw the principal today?</Label>
              <p className="text-sm text-muted-foreground">
                Do you have actual access to these funds?
              </p>
            </div>
            <Switch
              checked={data.irrevocableTrustAccessible}
              onCheckedChange={(checked) => updateData({ irrevocableTrustAccessible: checked })}
            />
          </div>
          
          <CurrencyInput
            label="🔒 Irrevocable Trust Value"
            description="Value of assets in irrevocable trusts"
            value={data.irrevocableTrustValue}
            onChange={(value) => updateData({ irrevocableTrustValue: value })}
          />
          
          {data.irrevocableTrustValue > 0 && (
            <div className={`p-4 rounded-lg ${data.irrevocableTrustAccessible ? 'bg-primary/10 border border-primary/30' : 'bg-muted'}`}>
              <p className="text-sm font-medium">
                {data.irrevocableTrustAccessible 
                  ? "✓ This amount IS Zakatable (you have access)"
                  : "✗ This amount is EXEMPT (no access = no Milk Tam)"
                }
              </p>
            </div>
          )}
          
          <InfoCard variant="warning" title="Irrevocable Trust Analysis">
            <p>
              <strong>If you cannot access the principal:</strong> You lack Milk Tam (complete 
              possession). Neither Grantor nor Beneficiary pays Zakat until funds are actually 
              received.<br/><br/>
              <strong>Power of Substitution:</strong> If you can swap assets of equal value, 
              this may constitute a form of control — consult a scholar.
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Charitable Lead Annuity Trusts (CLATs)</h3>
          
          <CurrencyInput
            label="🤲 CLAT Value (Exempt)"
            description="Assets in a CLAT during the annuity term. This is NOT Zakatable until the term ends."
            value={data.clatValue}
            onChange={(value) => updateData({ clatValue: value })}
          />
          
          <InfoCard variant="info" title="CLAT Treatment">
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Charitable Portion:</strong> Funds irrevocably designated for charity 
                are not Zakatable — wealth transferred to Allah is no longer human property.
              </li>
              <li>
                <strong>Remainder Interest:</strong> Heirs have a "future interest" but no 
                access today. They cannot spend, borrow, or trade it.
              </li>
              <li>
                <strong>Verdict:</strong> No Zakat during the annuity term. Once the term ends 
                and assets transfer to heirs, they begin paying annually.
              </li>
            </ul>
          </InfoCard>
        </div>
        
        <InfoCard variant="warning" title="Warning: Zakat Avoidance">
          <p>
            Using trusts solely to evade Zakat (via legal tricks or Hila) is <strong>spiritually 
            impermissible</strong>, even if the technical ruling temporarily suspends liability.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
