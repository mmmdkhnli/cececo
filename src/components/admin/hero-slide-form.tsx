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
      <RichTextEditor name="title" defaultValue={defaultValues?.title} label="Title" allowImage={false} />
      <RichTextEditor
        name="description"
        defaultValue={defaultValues?.description}
        label="Description"
        allowImage={false}
      />
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
          <FormField label="Page title">
            <Input name="pageTitle" defaultValue={defaultValues?.pageTitle ?? ""} />
          </FormField>
          <p className="-mt-2 text-xs text-muted-foreground">
            The address is generated from the page title, or from the slide title when this is left empty
            {defaultValues?.pageSlug ? (
              <> — currently <code>/highlights/{defaultValues.pageSlug}</code></>
            ) : null}
            .
          </p>
          <RichTextEditor name="pageBody" defaultValue={defaultValues?.pageBody} label="Page text" />
        </Card>
      )}

      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
