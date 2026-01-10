
import React from "react";
import { CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SettingsRowProps {
    icon?: React.ReactNode;
    label: string;
    value?: string | React.ReactNode;
    description?: string;
    onClick?: () => void;
    action?: React.ReactNode;
    className?: string;
    hasChevron?: boolean;
    destructive?: boolean;
}

export function SettingsRow({
    icon,
    label,
    value,
    description,
    onClick,
    action,
    className,
    hasChevron = true,
    destructive = false,
}: SettingsRowProps) {
    const Component = onClick ? "button" : "div";

    return (
        <Component
            type={onClick ? "button" : undefined}
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between p-4 min-h-[64px] transition-colors relative group",
                onClick && "hover:bg-accent/50 cursor-pointer text-left",
                // Separator line logic could be handled by parent or CSS, but simple border-b on all except last is common.
                // For simplicity, we'll let parent enforce dividers or separate this.
                "border-b border-border/50 last:border-0",
                className
            )}
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Icon Container */}
                {icon && (
                    <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50 text-foreground",
                        destructive && "bg-destructive/10 text-destructive"
                    )}>
                        {icon}
                    </div>
                )}

                {/* Text Content */}
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className={cn(
                        "text-base font-medium truncate",
                        destructive ? "text-destructive" : "text-foreground"
                    )}>
                        {label}
                    </span>
                    {description && (
                        <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {description}
                        </span>
                    )}
                </div>
            </div>

            {/* Right Side: Value + Action/Chevron */}
            <div className="flex items-center gap-3 pl-4 shrink-0">
                {value && (
                    <span className="text-sm text-muted-foreground font-medium text-right">
                        {value}
                    </span>
                )}

                {action}

                {onClick && hasChevron && (
                    <CaretRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                )}
            </div>
        </Component>
    );
}
