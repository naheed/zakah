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

interface StepHeaderProps {
  questionNumber?: number;
  emoji?: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function StepHeader({ questionNumber, emoji, title, subtitle }: StepHeaderProps) {
  return (
    <div className="space-y-2 mb-8">
      {questionNumber && (
        <span className="text-sm font-medium text-muted-foreground">
          Question {questionNumber}
        </span>
      )}
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
        {emoji && <span className="mr-2">{emoji}</span>}
        {title}
      </h1>
      {subtitle && (
        <p className="text-base text-muted-foreground leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
