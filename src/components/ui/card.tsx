import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("group relative overflow-hidden rounded-card", {
  variants: {
    variant: {
      default: "border-0 bg-scheme-foreground text-scheme-text",
      transparent: "border border-white bg-transparent text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>;

function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      data-slot="card-flat"
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  );
}

function BackgroundCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bg-card"
      className={cn("overflow-hidden rounded-card", className)}
      {...props}
    />
  );
}

export { Card, BackgroundCard, cardVariants };
