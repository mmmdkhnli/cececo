"use client";

import type { SectionTabRow } from "@/db/schema";
import type { TabStyle } from "@/lib/section-field-config";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import { Card } from "@/components/admin/ui/card";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";

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
          <FormField label="Tab label">
            <Input name="tabLabel" defaultValue={defaultValues?.tabLabel ?? ""} />
          </FormField>
        )}
        <FormField label="Order">
          <Input name="order" type="number" defaultValue={defaultValues?.order ?? nextOrder} />
        </FormField>
      </div>

      <FormField label="Title">
        <Input name="title" defaultValue={defaultValues?.title ?? ""} required />
      </FormField>

      <RichTextEditor name="body" defaultValue={defaultValues?.body} label="Text" />

      {style === "icon-objective" && (
        <>
          <ImageUpload name="icon" defaultValue={defaultValues?.icon} label="Icon" />
          <Card className="grid grid-cols-2 gap-4 p-4">
            <p className="col-span-2 text-sm font-semibold">Primary button</p>
            <FormField label="Text">
              <Input name="ctaPrimaryLabel" defaultValue={defaultValues?.ctaPrimaryLabel ?? ""} />
            </FormField>
            <FormField label="Link">
              <Input name="ctaPrimaryHref" defaultValue={defaultValues?.ctaPrimaryHref ?? ""} />
            </FormField>
          </Card>
          <Card className="grid grid-cols-2 gap-4 p-4">
            <p className="col-span-2 text-sm font-semibold">Secondary button</p>
            <FormField label="Text">
              <Input name="ctaSecondaryLabel" defaultValue={defaultValues?.ctaSecondaryLabel ?? ""} />
            </FormField>
            <FormField label="Link">
              <Input name="ctaSecondaryHref" defaultValue={defaultValues?.ctaSecondaryHref ?? ""} />
            </FormField>
          </Card>
        </>
      )}

      {style === "media-tab" && (
        <>
          <ImageUpload name="image" defaultValue={defaultValues?.image} label="Image" />
          <FormField label="Video URL (if any)">
            <Input name="videoUrl" defaultValue={defaultValues?.videoUrl ?? ""} />
          </FormField>
        </>
      )}

      <div>
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
