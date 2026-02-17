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

import { ZakatFormData, CalendarType } from "@zakatflow/core";
import { hawlContent } from "@/content/steps";
import { QuestionLayout } from "../QuestionLayout";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface HawlStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  questionNumber?: number;
}

export function HawlStep({ data, updateData, questionNumber }: HawlStepProps) {
  return (
    <QuestionLayout content={hawlContent} questionNumber={questionNumber}>
      <RadioGroup
        value={data.calendarType}
        onValueChange={(value) => updateData({ calendarType: value as CalendarType })}
        className="space-y-3"
      >
        <label 
          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            data.calendarType === 'lunar' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
        >
          <RadioGroupItem value="lunar" id="lunar" />
          <div className="flex-1">
            <span className="font-medium text-foreground">Lunar Year (Islamic)</span>
            <p className="text-sm text-muted-foreground mt-1">
              354 days • 2.5% Zakat rate
            </p>
          </div>
        </label>
        
        <label 
          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            data.calendarType === 'solar' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
        >
          <RadioGroupItem value="solar" id="solar" />
          <div className="flex-1">
            <span className="font-medium text-foreground">Solar Year (Gregorian)</span>
            <p className="text-sm text-muted-foreground mt-1">
              365 days • 2.577% Zakat rate (adjusted)
            </p>
          </div>
        </label>
      </RadioGroup>
      
      {/* Selected Rate Display */}
      <div className="text-center p-6 bg-card border border-border rounded-xl">
        <p className="text-sm text-muted-foreground mb-1">Your Zakat Rate</p>
        <p className="text-4xl font-bold text-primary">
          {data.calendarType === 'lunar' ? '2.5%' : '2.577%'}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {data.calendarType === 'lunar' ? 'Traditional Islamic calendar' : 'Adjusted for longer year'}
        </p>
      </div>
    </QuestionLayout>
  );
}
