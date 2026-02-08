import { useState } from "react";
import { CaretDown, Lightbulb, Info } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";

interface BalancedTipProps {
    /** Short summary that's always visible */
    summary: string;
    /** Detailed content shown when expanded */
    details?: string;
    /** Source citation */
    source?: string;
    /** Visual variant */
    variant?: "tip" | "info" | "warning";
    /** Whether the tip starts expanded */
    defaultOpen?: boolean;
}

/**
 * A balanced tip component that shows a summary immediately visible
 * with expandable details for users who want more information.
 * 
 * Addresses the UX feedback that tips should be visible without interaction.
 */
export function BalancedTip({
    summary,
    details,
    source,
    variant = "tip",
    defaultOpen = false,
}: BalancedTipProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const Icon = variant === "info" ? Info : Lightbulb;
    const hasExpandable = !!details || !!source;

    const colorClasses = {
        tip: {
            bg: "bg-amber-50 dark:bg-amber-950/30",
            border: "border-amber-200 dark:border-amber-800",
            icon: "text-amber-600 dark:text-amber-400",
            accent: "border-l-amber-400",
        },
        info: {
            bg: "bg-blue-50 dark:bg-blue-950/30",
            border: "border-blue-200 dark:border-blue-800",
            icon: "text-blue-600 dark:text-blue-400",
            accent: "border-l-blue-400",
        },
        warning: {
            bg: "bg-orange-50 dark:bg-orange-950/30",
            border: "border-orange-200 dark:border-orange-800",
            icon: "text-orange-600 dark:text-orange-400",
            accent: "border-l-orange-400",
        },
    };

    const colors = colorClasses[variant];

    if (!hasExpandable) {
        // Simple display without expandable content
        return (
            <div
                className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border-l-4",
                    colors.bg,
                    colors.border,
                    colors.accent
                )}
            >
                <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", colors.icon)} weight="duotone" />
                <p className="text-sm text-foreground/90 leading-relaxed">{summary}</p>
            </div>
        );
    }

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div
                className={cn(
                    "rounded-lg border-l-4 overflow-hidden",
                    colors.bg,
                    colors.border,
                    colors.accent
                )}
            >
                {/* Always visible summary */}
                <CollapsibleTrigger asChild>
                    <button
                        className={cn(
                            "w-full flex items-start gap-3 p-3 text-left transition-colors",
                            "hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", colors.icon)} weight="duotone" />
                        <span className="flex-1 text-sm text-foreground/90 leading-relaxed">
                            {summary}
                        </span>
                        <CaretDown
                            className={cn(
                                "w-4 h-4 mt-0.5 shrink-0 text-muted-foreground transition-transform",
                                isOpen && "rotate-180"
                            )}
                            weight="bold"
                        />
                    </button>
                </CollapsibleTrigger>

                {/* Expandable details */}
                <CollapsibleContent>
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-3 pb-3 pt-0"
                        >
                            <div className="pl-7 border-t border-current/10 pt-2 space-y-2">
                                {details && (
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {details}
                                    </p>
                                )}
                                {source && (
                                    <p className="text-xs text-muted-foreground/70 italic">
                                        Source: {source}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}

/**
 * A stack of balanced tips for a step
 */
interface BalancedTipsProps {
    tips: Array<{
        summary: string;
        details?: string;
        source?: string;
        variant?: "tip" | "info" | "warning";
    }>;
}

export function BalancedTips({ tips }: BalancedTipsProps) {
    if (!tips || tips.length === 0) return null;

    return (
        <div className="space-y-2">
            {tips.map((tip, index) => (
                <BalancedTip key={index} {...tip} />
            ))}
        </div>
    );
}
