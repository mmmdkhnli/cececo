"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter, type SubscribeState } from "@/app/actions/newsletter";
import type { VariantProps } from "class-variance-authority";

type NewsletterFormProps = {
  buttonSize?: "sm" | "default";
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
  formClassName?: string;
  buttonClassName?: string;
};

const initialState: SubscribeState = { status: "idle" };

export function NewsletterForm({
  buttonSize = "sm",
  buttonVariant = "secondary",
  formClassName,
  buttonClassName,
}: NewsletterFormProps) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <div>
      <form
        ref={formRef}
        action={formAction}
        className={cn(
          "mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] md:gap-y-4",
          formClassName,
        )}
      >
        <Input id="email" name="email" type="email" placeholder="Enter your email address" required />
        <Button
          title="Subscribe"
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClassName}
          disabled={pending}
        >
          {pending ? "..." : "Subscribe"}
        </Button>
      </form>
      {state.status === "success" && (
        <p className="text-small text-mountain-meadow-dark">{state.message}</p>
      )}
      {state.status === "error" && <p className="text-small text-red-violet">{state.message}</p>}
    </div>
  );
}
