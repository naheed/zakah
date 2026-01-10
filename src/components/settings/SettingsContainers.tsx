
import React from "react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function SettingsSection({ title, children, className }: SettingsSectionProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {title && (
                <h2 className="px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
}

interface SettingsCardProps {
    children: React.ReactNode;
    className?: string;
}

export function SettingsCard({ children, className }: SettingsCardProps) {
    return (
        <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)}>
            {children}
        </div>
    );
}
