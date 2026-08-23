"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import type { HeroSlideRow } from "@/db/schema";

export function HeroSlideForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: HeroSlideRow;
}) {
  const [seeMoreEnabled, setSeeMoreEnabled] = useState(defaultValues?.seeMoreEnabled ?? false);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <ImageUpload name="backgroundImage" defaultValue={defaultValues?.backgroundImage} label="Background image" />
      <Field label="Title">
        <input name="title" defaultValue={defaultValues?.title} required className="admin-input" />
      </Field>
      <Field label="Description">
        <textarea name="description" defaultValue={defaultValues?.description ?? ""} rows={3} className="admin-input" />
      </Field>
      <Field label="Order">
        <input name="order" type="number" defaultValue={defaultValues?.order ?? 0} className="admin-input w-24" />
      </Field>

      <label className="flex items-center gap-2 text-small text-neutral-darkest">
        <input
          type="checkbox"
          name="seeMoreEnabled"
          checked={seeMoreEnabled}
          onChange={(e) => setSeeMoreEnabled(e.target.checked)}
          className="size-4"
        />
        Show the &quot;See more&quot; button (with its own page)
      </label>

      {seeMoreEnabled && (
        <div className="flex flex-col gap-4 rounded-card border border-neutral-lighter p-4">
          <p className="text-small font-semibold text-neutral-darkest">Linked page</p>
          <Field label="Slug (URL) — /highlights/...">
            <input name="pageSlug" defaultValue={defaultValues?.pageSlug ?? ""} required={seeMoreEnabled} className="admin-input" />
          </Field>
          <Field label="Page title">
            <input name="pageTitle" defaultValue={defaultValues?.pageTitle ?? ""} className="admin-input" />
          </Field>
          <RichTextEditor name="pageBody" defaultValue={defaultValues?.pageBody} label="Page text" />
        </div>
      )}

      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-small font-semibold text-neutral-darkest">{label}</label>
      {children}
    </div>
  );
}
