import React from "react";
import { cn } from "@/lib/utils";
import { Lock } from "@phosphor-icons/react";

interface DeviceFrameProps extends React.HTMLAttributes<HTMLDivElement> {
    url?: string;
}

export function DeviceFrame({
    children,
    className,
    url = "zakatflow.org",
    ...props
}: DeviceFrameProps) {
    return (
        <div
            className={cn(
                "relative rounded-xl overflow-hidden border border-border/40 shadow-2xl bg-background flex flex-col",
                className
            )}
            {...props}
        >
            {/* Title Bar (Safari Style) - Forced Light Theme for reliability */}
            <div className="h-9 bg-gray-100/80 backdrop-blur-md border-b border-gray-200 flex items-center px-3 gap-3 shrink-0 z-20">
                {/* Traffic Lights */}
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] border border-[#E0443E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] border border-[#D89E24]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] border border-[#1AAB29]" />
                </div>

                {/* Address Bar */}
                <div className="flex-1 max-w-md mx-auto h-6 bg-white/60 rounded flex items-center justify-center px-2 text-[10px] text-gray-600 gap-1.5 shadow-sm border border-gray-200/50">
                    <Lock className="w-2.5 h-2.5 opacity-70" weight="fill" />
                    <span className="opacity-90 font-medium">{url}</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative isolate flex-1 w-full overflow-hidden">
                {children}
            </div>
        </div>
    );
}
