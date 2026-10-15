"use client";

import { useActionState } from "react";
import type { PageRow } from "@/db/schema";
import type { PageSettingsState } from "@/app/admin/(protected)/pages/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";

const initialState: PageSettingsState = {};

export function PageSettingsForm({
  action,
  defaultValues,
}: {
  action: (prevState: PageSettingsState, formData: FormData) => Promise<PageSettingsState>;
  defaultValues?: PageRow;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <FormField label="Title">
        <Input name="title" defaultValue={defaultValues?.title} required />
      </FormField>
      <FormField label="Address (slug)">
        <Input name="slug" defaultValue={defaultValues?.slug} placeholder="Generated from the title if left empty" />
      </FormField>
      <p className="-mt-3 text-xs text-muted-foreground">
        The page opens at <code>/{defaultValues?.slug ?? "your-slug"}</code> — use the same address as the
        navbar link&apos;s href. Changing it later breaks existing links to the old address.
      </p>
      <FormField label="Meta description (search engines)">
        <Textarea name="metaDescription" defaultValue={defaultValues?.metaDescription ?? ""} rows={2} />
      </FormField>
      <FormField label="Status">
        <Select name="status" defaultValue={defaultValues?.status ?? "draft"}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft (only visible to admins)</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Saved.</p>}
      <div>
        <SubmitButton>{defaultValues ? "Save" : "Create page"}</SubmitButton>
      </div>
    </form>
  );
}
