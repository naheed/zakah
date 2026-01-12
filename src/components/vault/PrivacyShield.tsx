import { useState } from 'react';
import { Lock, CloudCheck, ShieldCheck, X } from '@phosphor-icons/react';
import { usePrivacyVault } from '@/hooks/usePrivacyVault';
import { useAuth } from '@/hooks/useAuth';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export function PrivacyShield() {
    const { user } = useAuth();
    const { persistenceMode, status } = usePrivacyVault();
    const [isOpen, setIsOpen] = useState(false);

    // Determine state
    const isGuest = !user;
    const isCloud = persistenceMode === 'cloud';
    const isLocalUser = user && persistenceMode === 'local';

    // Icon & Color Logic
    let Icon = Lock;
    let colorClass = "text-muted-foreground";
    let bgClass = "bg-muted/10";
    let label = "Local Vault";

    if (isGuest) {
        Icon = Lock;
        colorClass = "text-tertiary";
        bgClass = "bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30";
        label = "Device Only";
    } else if (isCloud) {
        Icon = CloudCheck;
        colorClass = "text-success dark:text-success"; // Using design system success (green) for reassurance
        bgClass = "bg-success/10 hover:bg-success/20";
        label = "Encrypted Backup";
    } else if (isLocalUser) {
        Icon = ShieldCheck;
        colorClass = "text-muted-foreground"; // Using design system muted for neutral
        bgClass = "bg-muted/10 hover:bg-muted/20";
        label = "Local Profile";
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 gap-2 rounded-full border border-transparent transition-all",
                        bgClass,
                        colorClass
                    )}
                >
                    <Icon className="w-4 h-4" weight="fill" />
                    <span className="text-xs font-semibold hidden md:inline-block">{label}</span>
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="z-[100] rounded-t-3xl md:rounded-3xl md:mx-auto md:mb-4 md:max-w-sm h-auto min-h-[40vh] border-0 shadow-2xl ring-1 ring-border/10">
                <SheetHeader className="text-left space-y-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/20 mx-auto mb-2">
                        <Icon className={cn("w-6 h-6", colorClass)} weight="duotone" />
                    </div>

                    <SheetTitle className="text-center text-xl">
                        {isGuest ? 'Your data is on this device' : (isCloud ? 'Your data is backed up' : 'Your data is local')}
                    </SheetTitle>

                    <SheetDescription className="text-center text-base">
                        {isGuest && "You are using a temporary Guest Vault. If you clear your browser history, your data will be lost."}
                        {isCloud && "Your Zakat calculation is end-to-end encrypted and safely synced to the cloud."}
                        {isLocalUser && "You are logged in, but you've chosen to keep Zakat data on this device only."}
                    </SheetDescription>
                </SheetHeader>

                <div className="py-8 space-y-6">
                    {/* Status Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-muted/10 space-y-2 border border-border/5">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Storage</p>
                            <p className="font-medium flex items-center gap-2">
                                {isCloud ? <CloudCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                {isCloud ? 'Cloud' : 'Browser'}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/10 space-y-2 border border-border/5">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recovery</p>
                            <p className="font-medium flex items-center gap-2">
                                {isCloud ? <ShieldCheck className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-tertiary" />}
                                {isCloud ? 'Active' : 'None'}
                            </p>
                        </div>
                    </div>

                    {/* Hint */}
                    {isGuest && (
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-xs text-center text-primary">
                            💡 <strong>Tip:</strong> Sign in to enable cloud backup and sync across devices.
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <Button variant="outline" className="w-full rounded-full" onClick={() => setIsOpen(false)}>
                        Got it
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
