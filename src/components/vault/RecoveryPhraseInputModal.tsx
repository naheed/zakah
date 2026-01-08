/**
 * RecoveryPhraseInputModal
 * 
 * Prompts user to enter their 12-word recovery phrase to unlock the vault.
 * Used when accessing from a new device or after clearing browser data.
 */

import { useState } from 'react';
import { Key, Warning, ArrowRight, Spinner } from '@phosphor-icons/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateRecoveryPhrase } from '@/lib/CryptoService';

interface RecoveryPhraseInputModalProps {
    open: boolean;
    onSubmit: (phrase: string) => Promise<void>;
    onCancel?: () => void;
}

export function RecoveryPhraseInputModal({
    open,
    onSubmit,
    onCancel
}: RecoveryPhraseInputModalProps) {
    const [phrase, setPhrase] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const wordCount = phrase.trim().split(/\s+/).filter(w => w).length;
    const isValidFormat = wordCount === 12;

    const handleSubmit = async () => {
        setError(null);

        // Validate format
        const cleanPhrase = phrase.trim().toLowerCase();
        if (!validateRecoveryPhrase(cleanPhrase)) {
            setError('Invalid recovery phrase. Please check your words and try again.');
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit(cleanPhrase);
        } catch (err) {
            setError('Incorrect recovery phrase. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-md" hideCloseButton={!onCancel}>
                <DialogHeader>
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Key weight="duotone" className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">Enter Recovery Phrase</DialogTitle>
                    <DialogDescription className="text-center">
                        Enter your 12-word recovery phrase to unlock your encrypted data.
                    </DialogDescription>
                </DialogHeader>

                {/* Input Area */}
                <div className="space-y-3 my-4">
                    <Textarea
                        placeholder="Enter your 12 words separated by spaces..."
                        value={phrase}
                        onChange={(e) => {
                            setPhrase(e.target.value);
                            setError(null);
                        }}
                        className="min-h-[100px] font-mono text-sm"
                        disabled={isLoading}
                    />

                    {/* Word Count */}
                    <div className="flex justify-between items-center text-xs">
                        <span className={wordCount === 12 ? "text-green-500" : "text-muted-foreground"}>
                            {wordCount}/12 words
                        </span>
                        {wordCount > 0 && wordCount !== 12 && (
                            <span className="text-amber-500">
                                {12 - wordCount} more words needed
                            </span>
                        )}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <Alert variant="destructive">
                        <Warning weight="fill" className="w-4 h-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Info */}
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <strong>New device?</strong> Enter the recovery phrase you saved when you first set up ZakatFlow.
                </div>

                <div className="flex gap-2 mt-4">
                    {onCancel && (
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={!isValidFormat || isLoading}
                        className="flex-1"
                        size="lg"
                    >
                        {isLoading ? (
                            <>
                                <Spinner className="w-4 h-4 mr-2 animate-spin" />
                                Unlocking...
                            </>
                        ) : (
                            <>
                                Unlock
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
