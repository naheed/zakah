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

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/zakatCalculations';
import { ArrowRight, Warning } from '@phosphor-icons/react';

interface UpdateGoalModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    currentAmount: number;
    newAmount: number;
    currency?: string;
}

export function UpdateGoalModal({
    open,
    onClose,
    onConfirm,
    currentAmount,
    newAmount,
    currency = 'USD'
}: UpdateGoalModalProps) {
    const diff = newAmount - currentAmount;
    const isIncrease = diff > 0;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Zakat Goal?</DialogTitle>
                    <DialogDescription>
                        You have a new calculation result. Do you want to update your current donation tracking target?
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-center gap-4 py-6">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Current Goal</p>
                        <p className="text-xl font-bold text-muted-foreground">{formatCurrency(currentAmount, currency)}</p>
                    </div>

                    <ArrowRight className="w-5 h-5 text-muted-foreground" />

                    <div className="text-center">
                        <p className="text-xs text-primary mb-1 uppercase tracking-wider font-bold">New Goal</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(newAmount, currency)}</p>
                    </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg flex items-start gap-3 border border-amber-100 dark:border-amber-900/30">
                    <Warning className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                        This will update your remaining balance. Your past donation history will be preserved.
                    </p>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose}>
                        Keep Current Goal
                    </Button>
                    <Button onClick={onConfirm}>
                        Update to {formatCurrency(newAmount, currency)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
