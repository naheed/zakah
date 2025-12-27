import { familyContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { Users, User } from "lucide-react";

export function FamilyStep() {
  return (
    <QuestionLayout content={familyContent}>
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-primary bg-primary/5">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Just myself</p>
            <p className="text-sm text-muted-foreground">Calculate Zakat on my assets only</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">My household</p>
            <p className="text-sm text-muted-foreground">Include spouse and/or children's assets</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-accent rounded-lg">
        <p className="text-sm text-foreground font-medium mb-1">Example</p>
        <p className="text-sm text-muted-foreground">
          If your spouse has $5,000 in savings and you have $10,000, enter $15,000 total for savings accounts.
        </p>
      </div>
    </QuestionLayout>
  );
}
