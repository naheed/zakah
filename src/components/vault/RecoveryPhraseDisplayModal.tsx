/**
 * RecoveryPhraseDisplayModal
 * 
 * Shows the 12-word recovery phrase during vault initialization.
 * User MUST acknowledge they've saved it before continuing.
 */

import { useState } from 'react';
import { Key, Warning, Copy, CheckCircle, Eye, EyeSlash } from '@phosphor-icons/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RecoveryPhraseDisplayModalProps {
    open: boolean;
    phrase: string;
    onConfirm: () => void;
}

export function RecoveryPhraseDisplayModal({
    open,
    phrase,
    onConfirm
}: RecoveryPhraseDisplayModalProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);
    const [hasAcknowledged, setHasAcknowledged] = useState(false);
    const { toast } = useToast();

    const words = phrase.split(' ');

    const handleCopy = async () => {
        await navigator.clipboard.writeText(phrase);
        setHasCopied(true);
        toast({
            title: "Copied to clipboard",
            description: "Make sure to save this somewhere safe!",
        });
        setTimeout(() => setHasCopied(false), 3000);
    };

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-lg" hideCloseButton>
                <DialogHeader>
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Key weight="duotone" className="w-6 h-6 text-amber-600" />
                    </div>
                    <DialogTitle className="text-center text-xl">Your Recovery Phrase</DialogTitle>
                    <DialogDescription className="text-center">
                        Write down these 12 words and keep them safe. This is the <strong>only way</strong> to recover your data.
                    </DialogDescription>
                </DialogHeader>

                {/* Warning Banner */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <Warning weight="fill" className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <strong>Never share this phrase.</strong> Anyone with these words can access your data. We cannot recover it for you.
                    </div>
                </div>

                {/* Phrase Grid */}
                <div className="relative my-4">
                    <div className={cn(
                        "grid grid-cols-3 gap-2 p-4 bg-muted rounded-lg transition-all",
                        !isRevealed && "blur-md select-none"
                    )}>
                        {words.map((word, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-background rounded px-2 py-1.5 text-sm font-mono"
                            >
                                <span className="text-muted-foreground text-xs w-4">{index + 1}.</span>
                                <span>{word}</span>
                            </div>
                        ))}
                    </div>

                    {/* Reveal Overlay */}
                    {!isRevealed && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Button
                                variant="secondary"
                                onClick={() => setIsRevealed(true)}
                                className="shadow-lg"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Reveal Words
                            </Button>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {isRevealed && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCopy}
                            className="flex-1"
                        >
                            {hasCopied ? (
                                <>
                                    <CheckCircle weight="fill" className="w-4 h-4 mr-2 text-green-500" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy to Clipboard
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsRevealed(false)}
                        >
                            <EyeSlash className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Acknowledgment */}
                <div className="flex items-start space-x-3 mt-4 p-3 bg-muted/50 rounded-lg">
                    <Checkbox
                        id="acknowledge"
                        checked={hasAcknowledged}
                        onCheckedChange={(checked) => setHasAcknowledged(checked === true)}
                        className="mt-0.5"
                    />
                    <label htmlFor="acknowledge" className="text-sm text-muted-foreground cursor-pointer">
                        I have written down my recovery phrase and stored it in a safe place.
                    </label>
                </div>

                <Button
                    onClick={onConfirm}
                    disabled={!hasAcknowledged || !isRevealed}
                    className="w-full mt-4"
                    size="lg"
                >
                    I've Saved My Phrase
                </Button>
            </DialogContent>
        </Dialog>
    );
}
