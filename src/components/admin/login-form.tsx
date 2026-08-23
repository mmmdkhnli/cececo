"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";
import { SubmitButton } from "@/components/admin/submit-button";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-small font-semibold text-neutral-darkest">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="rounded-form border border-neutral-lighter px-3 py-2 text-neutral-darkest outline-none focus-visible:border-mountain-meadow"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-small font-semibold text-neutral-darkest">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-form border border-neutral-lighter px-3 py-2 text-neutral-darkest outline-none focus-visible:border-mountain-meadow"
        />
      </div>
      {state.error && <p className="text-small text-red-violet">{state.error}</p>}
      <SubmitButton pendingText="Signing in..." className="mt-2">
        Sign in
      </SubmitButton>
    </form>
  );
}
