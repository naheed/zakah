import { ZakatFormData } from "@/lib/zakatCalculations";
import { familyContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { Users, User, CheckCircle } from "lucide-react";

interface FamilyStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function FamilyStep({ data, updateData }: FamilyStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <QuestionLayout content={familyContent}>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => updateData({ isHousehold: false })}
          className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
            !isHousehold 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            !isHousehold ? "bg-primary/10" : "bg-accent"
          }`}>
            <User className={`w-5 h-5 ${!isHousehold ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Just myself</p>
            <p className="text-sm text-muted-foreground">Calculate Zakat on my assets only</p>
          </div>
          {!isHousehold && (
            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
          )}
        </button>
        
        <button
          type="button"
          onClick={() => updateData({ isHousehold: true })}
          className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
            isHousehold 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isHousehold ? "bg-primary/10" : "bg-accent"
          }`}>
            <Users className={`w-5 h-5 ${isHousehold ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">My household</p>
            <p className="text-sm text-muted-foreground">Include spouse and/or children's assets</p>
          </div>
          {isHousehold && (
            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
          )}
        </button>
      </div>
      
      {isHousehold && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground font-medium mb-1">Household Mode</p>
          <p className="text-sm text-muted-foreground">
            In following questions, include the combined assets of your spouse and children. For example, if your spouse has $5,000 in savings and you have $10,000, enter $15,000 total.
          </p>
        </div>
      )}

      {!isHousehold && (
        <div className="p-4 bg-accent rounded-lg">
          <p className="text-sm text-foreground font-medium mb-1">Individual Mode</p>
          <p className="text-sm text-muted-foreground">
            Enter only your personal assets. Your spouse and children would calculate their Zakat separately if applicable.
          </p>
        </div>
      )}
    </QuestionLayout>
  );
}
