/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ZakatFormData } from "@zakatflow/core";
import { familyContent } from "@/content/steps";
import { QuestionLayout } from "../QuestionLayout";
import { Users, User, CheckCircle } from "@phosphor-icons/react";
import { HouseholdMemberInput } from "../HouseholdMemberInput";

interface FamilyStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  questionNumber?: number;
}

export function FamilyStep({ data, updateData, questionNumber }: FamilyStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <QuestionLayout content={familyContent} questionNumber={questionNumber}>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => updateData({ isHousehold: false })}
          className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left min-h-[72px] ${
            !isHousehold 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            !isHousehold ? "bg-primary/10" : "bg-accent"
          }`}>
            <User className={`w-5 h-5 ${!isHousehold ? "text-primary" : "text-muted-foreground"}`} weight="fill" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Just myself</p>
            <p className="text-sm text-muted-foreground">Calculate Zakat on my assets only</p>
          </div>
          {!isHousehold && (
            <CheckCircle className="w-5 h-5 text-primary shrink-0" weight="fill" />
          )}
        </button>
        
        <button
          type="button"
          onClick={() => updateData({ isHousehold: true })}
          className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left min-h-[72px] ${
            isHousehold 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isHousehold ? "bg-primary/10" : "bg-accent"
          }`}>
            <Users className={`w-5 h-5 ${isHousehold ? "text-primary" : "text-muted-foreground"}`} weight="fill" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">My household</p>
            <p className="text-sm text-muted-foreground">Include spouse and/or children's assets</p>
          </div>
          {isHousehold && (
            <CheckCircle className="w-5 h-5 text-primary shrink-0" weight="fill" />
          )}
        </button>
      </div>
      
      {isHousehold && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground font-medium mb-1">Household Mode</p>
            <p className="text-sm text-muted-foreground">
              In following questions, include the combined assets of your spouse and children. For example, if your spouse has $5,000 in savings and you have $10,000, enter $15,000 total.
            </p>
          </div>
          
          <HouseholdMemberInput
            members={data.householdMembers}
            onMembersChange={(members) => updateData({ householdMembers: members })}
          />
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
