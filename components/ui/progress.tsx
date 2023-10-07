"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva(
  "w-full h-full bg-primary flex-1 transition-all ",
  {
    variants: {
      variant: {
        default: "bg-sky-600",
        success: "bg-emerald-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {}

type combinedProductRef = ProgressProps &
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>;

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  combinedProductRef
>(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
