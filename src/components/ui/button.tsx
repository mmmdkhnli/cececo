import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 rounded-button whitespace-nowrap transition-all duration-200 ease-in-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-mountain-meadow bg-mountain-meadow font-medium text-scheme-btn-text hover:border-mountain-meadow-dark hover:bg-mountain-meadow-dark btn-dark:border-neutral-darkest btn-dark:bg-neutral-darkest btn-dark:text-white btn-dark:hover:border-neutral-darker btn-dark:hover:bg-neutral-darker btn-light:border-white btn-light:bg-white btn-light:text-neutral-darkest btn-light:hover:border-neutral-lighter btn-light:hover:bg-neutral-lighter",
        alternate:
          "border border-white bg-white font-medium text-neutral-darkest hover:border-neutral-lighter hover:bg-neutral-lighter",
        secondary:
          "border border-transparent bg-neutral-darkest-5 font-medium backdrop-blur-[10px] hover:bg-neutral-darkest-15 alternate:border-transparent alternate:bg-white-10 alternate:hover:border-neutral-lighter alternate:hover:bg-white-20",
        "secondary-alt":
          "border border-transparent bg-white-10 font-medium backdrop-blur-[10px] hover:border-neutral-lighter hover:bg-white-20",
        link: "gap-2 text-scheme-text",
        "link-alt": "gap-2 text-white",
        ghost: "hover:bg-neutral-darkest hover:text-white",
        none: "",
      },
      size: {
        default: "px-3 py-1.5",
        sm: "px-2.5 py-1",
        link: "p-0",
        icon: "size-10",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  iconLeft,
  iconRight,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant || "default"}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {iconLeft && iconLeft}
      <Slottable>{children}</Slottable>
      {iconRight && iconRight}
    </Comp>
  );
}

export { Button, buttonVariants };
