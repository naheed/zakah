import { IconProps as PhosphorIconProps, IconWeight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface IconProps extends Omit<PhosphorIconProps, 'weight'> {
  weight?: IconWeight;
}

// Default icon weight for M3 Expressive design
export const defaultWeight: IconWeight = "duotone";

// Helper to create consistent icon styling
export function getIconClasses(className?: string) {
  return cn("shrink-0", className);
}
