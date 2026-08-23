import Link from "next/link";
import { Button, type buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "relume-icons";
import type { VariantProps } from "class-variance-authority";

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

type CtaSlot = {
  label?: string | null;
  href?: string | null;
  variant?: ButtonVariant;
};

type ResolvedCta = { label: string; href: string; variant: ButtonVariant };

function resolve(slot: CtaSlot | undefined, fallbackVariant: ButtonVariant): ResolvedCta | null {
  if (!slot?.label || !slot?.href) return null;
  return { label: slot.label, href: slot.href, variant: slot.variant ?? fallbackVariant };
}

// Every ported section pairs a filled/secondary button with a "link" style
// button carrying a trailing chevron — factored out once instead of
// duplicated per component. Reads straight off `section`'s flat
// cta{Primary,Secondary}{Label,Href} columns; a slot renders nothing unless
// both its label and href are set.
export function CtaGroup({
  primary,
  secondary,
  className,
}: {
  primary?: CtaSlot;
  secondary?: CtaSlot;
  className?: string;
}) {
  const slots = [resolve(primary, "secondary"), resolve(secondary, "link")].filter(
    (s): s is ResolvedCta => s !== null,
  );

  if (slots.length === 0) return null;

  return (
    <div className={className ?? "mt-6 flex flex-wrap items-center gap-4 md:mt-8"}>
      {slots.map((cta) => {
        const isLink = cta.variant === "link" || cta.variant === "link-alt";
        return (
          <Button
            key={cta.label}
            asChild
            title={cta.label}
            variant={cta.variant}
            size={isLink ? "link" : "default"}
            iconRight={isLink ? <ChevronRight className="text-scheme-text" /> : undefined}
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
