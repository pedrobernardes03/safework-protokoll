import * as React from "react";

import { cn } from "@/lib/utils";

// Two-tone ring spinner (solid arc over a faint track) instead of lucide's
// Loader2 — a compact, less "generic icon library" loading indicator,
// inspired by a Uiverse.io loader and recolored to the brand token.
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "default" | "lg";
}

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-3.5 w-3.5 border-[2px]",
  default: "h-4 w-4 border-[2px]",
  lg: "h-6 w-6 border-[3px]",
};

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = "default", ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="Carregando"
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-primary/25 border-t-primary",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);
Spinner.displayName = "Spinner";

export { Spinner };
