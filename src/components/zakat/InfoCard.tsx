import { cn } from "@/lib/utils";
import { Info, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";

type InfoCardVariant = 'info' | 'warning' | 'success' | 'tip';

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
  },
  warning: {
    container: 'bg-destructive/10 border-destructive/20',
    icon: AlertCircle,
    iconColor: 'text-destructive',
  },
  success: {
    container: 'bg-chart-1/10 border-chart-1/20',
    icon: CheckCircle,
    iconColor: 'text-chart-1',
  },
  tip: {
    container: 'bg-accent border-border',
    icon: Lightbulb,
    iconColor: 'text-chart-4',
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
        <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", styles.iconColor)} />
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
