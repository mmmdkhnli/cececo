"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendContactMessage, type SendMessageState } from "@/app/actions/contact";

const initialState: SendMessageState = { status: "idle" };

export function WriteUsForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Field label="Full Name">
        <Input name="fullName" required />
      </Field>
      <Field label="Organization">
        <Input name="organization" />
      </Field>
      <Field label="Email Address">
        <Input name="email" type="email" required />
      </Field>
      <Field label="Subject">
        <Input name="subject" required />
      </Field>
      <Field label="Message">
        <textarea
          name="message"
          required
          rows={5}
          className="w-full resize-none border-b border-scheme-border bg-transparent py-2 align-middle text-scheme-text transition-all duration-200 placeholder:text-scheme-text placeholder:opacity-60 focus-visible:outline-none"
        />
      </Field>
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Sending..." : "Send Message"}
      </Button>
      {state.status === "success" && <p className="text-small text-scheme-accent">{state.message}</p>}
      {state.status === "error" && <p className="text-small text-red-violet">{state.message}</p>}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-small font-semibold text-scheme-text">{label}</label>
      {children}
    </div>
  );
}
