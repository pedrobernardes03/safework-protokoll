import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";

// Checkmark draws itself in on check (stroke-dasharray/offset) instead of the
// instant lucide <Check> pop-in, with a small spring-eased scale on the box —
// adapted from a Uiverse.io checkbox pattern, recolored to the brand token.
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer grid h-4 w-4 shrink-0 place-content-center rounded-[4px] border-2 border-primary bg-background shadow-sm transition-[transform,background-color] duration-200 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:scale-[1.06] data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "[&[data-state=checked]_svg]:opacity-100 [&[data-state=checked]_path]:[stroke-dashoffset:0]",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator forceMount className="grid place-content-center text-current">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 opacity-0 transition-opacity duration-150">
        <path
          d="M2 6.2 4.8 9 10 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[stroke-dasharray:12] [stroke-dashoffset:12] transition-[stroke-dashoffset] duration-300 ease-out"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
