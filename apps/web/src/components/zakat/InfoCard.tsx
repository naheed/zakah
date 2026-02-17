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

import { cn } from "@/lib/utils";
import { Info, WarningCircle, CheckCircle, Lightbulb } from "@phosphor-icons/react";

type InfoCardVariant = 'info' | 'warning' | 'success' | 'tip' | 'celebration';

interface InfoCardProps {
  title?: string;
  children: React.ReactNode;
  variant?: InfoCardVariant;
  className?: string;
}

const variantStyles = {
  info: {
    container: 'bg-primary/10 border-primary/20',
    icon: Info,
    iconColor: 'text-primary',
    weight: 'duotone' as const,
  },
  warning: {
    container: 'bg-destructive/10 border-destructive/20',
    icon: WarningCircle,
    iconColor: 'text-destructive',
    weight: 'duotone' as const,
  },
  success: {
    container: 'bg-success/10 border-success/20',
    icon: CheckCircle,
    iconColor: 'text-success',
    weight: 'duotone' as const,
  },
  tip: {
    container: 'bg-accent border-border',
    icon: Lightbulb,
    iconColor: 'text-tertiary',
    weight: 'duotone' as const,
  },
  celebration: {
    container: 'bg-tertiary/10 border-tertiary/20',
    icon: CheckCircle,
    iconColor: 'text-tertiary',
    weight: 'fill' as const,
  },
};

export function InfoCard({ title, children, variant = 'info', className }: InfoCardProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;
  
  return (
    <div className={cn(
      "rounded-lg border p-4",
      styles.container,
      className
    )}>
      <div className="flex gap-3">
        <Icon weight={styles.weight} className={cn("h-5 w-5 shrink-0 mt-0.5", styles.iconColor)} />
        <div className="space-y-1">
          {title && (
            <h4 className="font-medium text-foreground">{title}</h4>
          )}
          <div className="text-sm text-foreground/80">{children}</div>
        </div>
      </div>
    </div>
  );
}
