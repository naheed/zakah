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

/**
 * PersistenceChoiceModal
 * 
 * First-time user flow: Choose between Local (device-only) or Cloud (sync) storage.
 * Both options require setting up a recovery phrase.
 */

import { useState } from 'react';
import { Shield, Cloud, DeviceMobile, ArrowRight } from '@phosphor-icons/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PersistenceMode } from '@/lib/CryptoService';

interface PersistenceChoiceModalProps {
    open: boolean;
    onSelect: (mode: PersistenceMode) => void;
    onDismiss?: () => void;
}

export function PersistenceChoiceModal({ open, onSelect, onDismiss }: PersistenceChoiceModalProps) {
    const [selected, setSelected] = useState<PersistenceMode>(null);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDismiss?.()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield weight="duotone" className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">Secure Your Data</DialogTitle>
                    <DialogDescription className="text-center">
                        Choose how you want to save your Zakat calculations and donations.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 my-4">
                    {/* Local Option */}
                    <button
                        type="button"
                        onClick={() => setSelected('local')}
                        className={cn(
                            "w-full p-4 rounded-lg border-2 text-left transition-all",
                            selected === 'local'
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                selected === 'local' ? "bg-primary/10" : "bg-muted"
                            )}>
                                <DeviceMobile weight="duotone" className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground">This Device Only</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Data stays on this browser. Private by default.
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Cloud Option */}
                    <button
                        type="button"
                        onClick={() => setSelected('cloud')}
                        className={cn(
                            "w-full p-4 rounded-lg border-2 text-left transition-all",
                            selected === 'cloud'
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                selected === 'cloud' ? "bg-primary/10" : "bg-muted"
                            )}>
                                <Cloud weight="duotone" className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground">Sync Across Devices</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Access from any device. Requires sign-in.
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Security Note */}
                <div className="text-xs text-muted-foreground text-center bg-muted/50 p-3 rounded-lg">
                    <Shield weight="fill" className="w-4 h-4 inline mr-1 text-primary" />
                    Your data is <strong>end-to-end encrypted</strong>. We never see your financial information.
                </div>

                <Button
                    onClick={() => selected && onSelect(selected)}
                    disabled={!selected}
                    className="w-full mt-4"
                    size="lg"
                >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </DialogContent>
        </Dialog>
    );
}
