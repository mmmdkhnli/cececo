"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateAccount, type UpdateAccountState } from "@/app/admin/(protected)/settings/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Separator } from "@/components/admin/ui/separator";

const initialState: UpdateAccountState = {};

export function AccountForm({ name, email }: { name: string; email: string }) {
  const [state, formAction] = useActionState(updateAccount, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Your account</CardTitle>
        <CardDescription>Update your name, email, or password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="flex flex-col gap-5">
          <FormField label="Name">
            <Input name="name" defaultValue={name} required />
          </FormField>
          <FormField label="Email">
            <Input name="email" type="email" defaultValue={email} required />
          </FormField>

          <Separator />

          <FormField label="New password (leave blank to keep current)">
            <Input name="newPassword" type="password" autoComplete="new-password" />
          </FormField>
          <FormField label="Confirm new password">
            <Input name="confirmPassword" type="password" autoComplete="new-password" />
          </FormField>

          <Separator />

          <FormField label="Current password" error={state.error}>
            <Input name="currentPassword" type="password" required autoComplete="current-password" />
          </FormField>

          {state.success && <p className="text-sm text-primary">Account updated.</p>}

          <div>
            <SubmitButton pendingText="Saving...">Save account</SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
