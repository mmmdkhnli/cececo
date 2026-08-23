"use client";

import type { SectionTabRow } from "@/db/schema";
import type { TabStyle } from "@/lib/section-field-config";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-small font-semibold text-neutral-darkest">{label}</label>
      {children}
    </div>
  );
}

export function SectionTabForm({
  action,
  style,
  defaultValues,
  nextOrder,
}: {
  action: (formData: FormData) => Promise<void>;
  style: TabStyle;
  defaultValues?: SectionTabRow;
  nextOrder: number;
}) {
  return (
    <form action={action} className="flex max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        {style === "icon-objective" && (
          <Field label="Tab label">
            <input name="tabLabel" defaultValue={defaultValues?.tabLabel ?? ""} className="admin-input" />
          </Field>
        )}
        <Field label="Order">
          <input name="order" type="number" defaultValue={defaultValues?.order ?? nextOrder} className="admin-input" />
        </Field>
      </div>

      <Field label="Title">
        <input name="title" defaultValue={defaultValues?.title ?? ""} required className="admin-input" />
      </Field>

      <RichTextEditor name="body" defaultValue={defaultValues?.body} label="Text" />

      {style === "icon-objective" && (
        <>
          <ImageUpload name="icon" defaultValue={defaultValues?.icon} label="Icon" />
          <div className="grid grid-cols-2 gap-4 rounded-card border border-neutral-lighter p-4">
            <p className="col-span-2 text-small font-semibold text-neutral-darkest">Primary button</p>
            <Field label="Text">
              <input name="ctaPrimaryLabel" defaultValue={defaultValues?.ctaPrimaryLabel ?? ""} className="admin-input" />
            </Field>
            <Field label="Link">
              <input name="ctaPrimaryHref" defaultValue={defaultValues?.ctaPrimaryHref ?? ""} className="admin-input" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-card border border-neutral-lighter p-4">
            <p className="col-span-2 text-small font-semibold text-neutral-darkest">Secondary button</p>
            <Field label="Text">
              <input name="ctaSecondaryLabel" defaultValue={defaultValues?.ctaSecondaryLabel ?? ""} className="admin-input" />
            </Field>
            <Field label="Link">
              <input name="ctaSecondaryHref" defaultValue={defaultValues?.ctaSecondaryHref ?? ""} className="admin-input" />
            </Field>
          </div>
        </>
      )}

      {style === "media-tab" && (
        <>
          <ImageUpload name="image" defaultValue={defaultValues?.image} label="Image" />
          <Field label="Video URL (if any)">
            <input name="videoUrl" defaultValue={defaultValues?.videoUrl ?? ""} className="admin-input" />
          </Field>
        </>
      )}

      <div>
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
