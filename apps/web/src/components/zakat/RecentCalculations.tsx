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

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Calculator, CaretRight, Clock, Sparkle } from '@phosphor-icons/react';
import { useSavedCalculations, SavedCalculation } from '@/hooks/useSavedCalculations';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@zakatflow/core';

interface RecentCalculationsProps {
  onLoadCalculation: (calculation: SavedCalculation) => void;
  currency?: string;
  limit?: number;
}

export function RecentCalculations({
  onLoadCalculation,
  currency = 'USD',
  limit = 3
}: RecentCalculationsProps) {
  const { calculations, loading, refreshCalculations } = useSavedCalculations();
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    refreshCalculations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recentCalcs = calculations.slice(0, limit);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Calculations</h3>
        </div>
        {[1, 2].map((i) => (
          <Card key={i} className="bg-card/50">
            <CardContent className="p-4">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (recentCalcs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Recent Calculations
        </h3>
        {calculations.length > limit && (
          <Link
            to="/calculations"
            className="text-xs text-primary hover:underline flex items-center gap-0.5"
          >
            View all
            <CaretRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="space-y-2">
        {recentCalcs.map((calc) => (
          <Card
            key={calc.id}
            className="bg-card/50 hover:bg-card/80 transition-colors cursor-pointer group"
            onClick={() => onLoadCalculation(calc)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-full bg-primary/10 shrink-0">
                  <Calculator className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{calc.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {formatDistanceToNow(new Date(calc.updated_at), { addSuffix: true })}
                    </span>
                    {calc.zakat_due !== null && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-primary">
                          <Sparkle className="w-3 h-3" />
                          {formatCurrency(calc.zakat_due, currency)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <CaretRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
