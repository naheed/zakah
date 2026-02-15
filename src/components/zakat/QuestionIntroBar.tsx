import { Link } from "react-router-dom";
import { Lightbulb, ArrowRight } from "@phosphor-icons/react";
import { StepContent } from "@/content/zakatGuide";
import { Madhab } from "@/lib/zakatTypes";
import { cn } from "@/lib/utils";

interface QuestionIntroBarProps {
    content: StepContent;
    madhab: Madhab;
    className?: string;
}

/**
 * Displays methodology-specific guidance immediately below the question header.
 * Part of the 3-tier content model: Intro Bar (Tier 1) → Contextual Tips (Tier 2) → Deep Dive (Tier 3)
 */
export function QuestionIntroBar({ content, madhab, className }: QuestionIntroBarProps) {
    const intro = content.introByMethodology?.[madhab as keyof typeof content.introByMethodology];

    // Fall back to balanced methodology if specific one not available
    const displayIntro = intro || content.introByMethodology?.balanced;

    if (!displayIntro) return null;

    // Build deep link with methodology query param
    // URL format: /methodology?methodology=x#section (query before hash)
    let deepLinkWithMethodology: string | null = null;
    if (displayIntro.deepLink) {
        const hashIndex = displayIntro.deepLink.indexOf('#');
        if (hashIndex !== -1) {
            // Split path and hash, insert query param between them
            const path = displayIntro.deepLink.substring(0, hashIndex);
            const hash = displayIntro.deepLink.substring(hashIndex);
            deepLinkWithMethodology = `${path}?methodology=${madhab}${hash}`;
        } else {
            // No hash, just append query param
            deepLinkWithMethodology = `${displayIntro.deepLink}?methodology=${madhab}`;
        }
    }

    return (
        <div
            className={cn(
                "flex items-start gap-3 p-4 rounded-xl",
                "bg-primary/5 border border-primary/20",
                className
            )}
        >
            <Lightbulb className="w-5 h-5 text-primary mt-0.5 shrink-0" weight="duotone" />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {displayIntro.summary}
                </p>
                {deepLinkWithMethodology && (
                    <Link
                        to={deepLinkWithMethodology}
                        className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary hover:underline"
                    >
                        Learn more about this ruling
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                )}
            </div>
        </div>
    );
}
