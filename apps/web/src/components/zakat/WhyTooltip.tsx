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

import { Question } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface WhyTooltipProps {
  title?: string;
  explanation: string;
  className?: string;
}

/**
 * WhyTooltip - Inline fiqh explanation component
 * Shows a "?" icon that reveals scholarly reasoning on hover/tap
 * Uses Tooltip on desktop, Popover on mobile for better touch UX
 */
export function WhyTooltip({ title, explanation, className }: WhyTooltipProps) {
  const isMobile = useIsMobile();

  const content = (
    <div className="space-y-1.5 max-w-[280px]">
      {title && <p className="font-medium text-foreground text-sm">{title}</p>}
      <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
    </div>
  );

  const trigger = (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 rounded-full",
        "bg-primary/10 hover:bg-primary/20 transition-colors",
        "text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "touch-manipulation pointer-events-auto",
        className
      )}
      aria-label={title || "Why?"}
      onClick={(e) => e.stopPropagation()}
    >
      <Question weight="bold" className="w-3 h-3" />
    </button>
  );

  // Use Popover on mobile for better touch experience
  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent side="top" className="w-auto p-3">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  // Use Tooltip on desktop with Portal for proper layering
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipPrimitive.Portal>
          <TooltipContent side="top" className="p-3 pointer-events-auto">
            {content}
          </TooltipContent>
        </TooltipPrimitive.Portal>
      </Tooltip>
    </TooltipProvider>
  );
}
