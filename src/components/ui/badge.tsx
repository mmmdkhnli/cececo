import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-badge px-2 py-1 text-sm font-semibold focus:outline-none",
  {
    variants: {
      variant: {
        // Colours follow the surrounding scheme, so a badge stays legible on both light and dark
        // sections. `badge-alt` remains an explicit override for surfaces that are dark regardless
        // of their scheme — the hero banners, which sit on a darkened background image.
        default:
          "bg-scheme-hover text-scheme-text backdrop-blur-[10px] badge-alt:border-white-10 badge-alt:bg-white-10 badge-alt:text-white",
        outline: "border border-scheme-border text-scheme-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
