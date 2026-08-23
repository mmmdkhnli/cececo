import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  prefix?: React.ReactNode;
  prefixPosition?: "left" | "right";
  variant?: "primary" | "secondary";
};

function Input({
  className,
  type,
  icon,
  iconPosition = "left",
  prefix,
  prefixPosition = "left",
  variant = "primary",
  ...props
}: InputProps) {
  return (
    <div className="relative flex w-full items-center">
      {icon && iconPosition === "left" && <div className="absolute left-3">{icon}</div>}
      {prefix && prefixPosition === "left" && (
        <div className="min-h-11 shrink-0 border-y border-l border-scheme-border px-3 py-2">
          {prefix}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex size-full align-middle transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          // Both variants read scheme-text/scheme-border instead of a fixed
          // light- or dark-mode color — each of the 7 admin-selectable
          // schemes already defines the correct-contrast value for its own
          // background, so this is what actually stays legible regardless
          // of which scheme ends up applied (a hardcoded "always white"
          // color went invisible the moment a light scheme was picked).
          variant === "primary" &&
            "border-b border-scheme-border bg-transparent text-scheme-text placeholder:text-scheme-text placeholder:opacity-60",
          variant === "secondary" &&
            "border-b border-scheme-border bg-transparent text-scheme-text placeholder:text-scheme-text placeholder:opacity-60",
          "min-h-8 py-2",
          icon && (iconPosition === "left" ? "pr-3 pl-11" : "pr-11 pl-3"),
          prefix && "grow-1",
          className,
        )}
        {...props}
      />
      {icon && iconPosition === "right" && <div className="absolute right-3">{icon}</div>}
      {prefix && prefixPosition === "right" && (
        <div className="min-h-11 shrink-0 border-y border-r border-scheme-border px-3 py-2">
          {prefix}
        </div>
      )}
    </div>
  );
}

export { Input };
