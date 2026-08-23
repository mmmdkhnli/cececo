"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import { Card } from "@/components/admin/ui/card";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
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
      <FormField label="Title">
        <Input name="title" defaultValue={defaultValues?.title} required />
      </FormField>
      <FormField label="Description">
        <Textarea name="description" defaultValue={defaultValues?.description ?? ""} rows={3} />
      </FormField>
      <FormField label="Order">
        <Input name="order" type="number" defaultValue={defaultValues?.order ?? 0} className="w-24" />
      </FormField>

      <Label className="flex items-center gap-2 font-normal">
        <Checkbox
          name="seeMoreEnabled"
          checked={seeMoreEnabled}
          onCheckedChange={(checked) => setSeeMoreEnabled(checked === true)}
        />
        Show the &quot;See more&quot; button (with its own page)
      </Label>

      {seeMoreEnabled && (
        <Card className="flex flex-col gap-4 p-4">
          <p className="text-sm font-semibold">Linked page</p>
          <FormField label="Slug (URL) — /highlights/...">
            <Input name="pageSlug" defaultValue={defaultValues?.pageSlug ?? ""} required={seeMoreEnabled} />
          </FormField>
          <FormField label="Page title">
            <Input name="pageTitle" defaultValue={defaultValues?.pageTitle ?? ""} />
          </FormField>
          <RichTextEditor name="pageBody" defaultValue={defaultValues?.pageBody} label="Page text" />
        </Card>
      )}

      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
