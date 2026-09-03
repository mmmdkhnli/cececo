"use client";

import { useState } from "react";
import { CroppedImageUpload } from "@/components/admin/cropped-image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import type { TeamMemberRow } from "@/db/schema";

export function TeamMemberForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: TeamMemberRow;
}) {
  const [hasDetailPage, setHasDetailPage] = useState(defaultValues?.hasDetailPage ?? false);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <FormField label="Full name">
        <Input name="name" defaultValue={defaultValues?.name} required />
      </FormField>
      <FormField label="Role">
        <Input name="role" defaultValue={defaultValues?.role} required />
      </FormField>
      <FormField label="Bio">
        <Textarea name="bio" defaultValue={defaultValues?.bio ?? ""} rows={3} />
      </FormField>
      <CroppedImageUpload name="photo" defaultValue={defaultValues?.photo} label="Photo" aspect={1} />
      <FormField label="Email">
        <Input name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
      </FormField>
      <FormField label="LinkedIn URL">
        <Input name="linkedinUrl" defaultValue={defaultValues?.linkedinUrl ?? ""} />
      </FormField>
      <FormField label="X (Twitter) URL">
        <Input name="xUrl" defaultValue={defaultValues?.xUrl ?? ""} />
      </FormField>
      <FormField label="Dribbble URL">
        <Input name="dribbbleUrl" defaultValue={defaultValues?.dribbbleUrl ?? ""} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Group">
          <Select name="group" defaultValue={defaultValues?.group ?? "leadership"}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leadership">Leadership</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Status">
          <Select name="status" defaultValue={defaultValues?.status ?? "active"}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="vacant">Vacant</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <FormField label="Order">
        <Input name="order" type="number" defaultValue={defaultValues?.order ?? 0} className="w-24" />
      </FormField>

      <Label className="flex items-center gap-2 font-normal">
        <Checkbox
          name="hasDetailPage"
          checked={hasDetailPage}
          onCheckedChange={(checked) => setHasDetailPage(checked === true)}
        />
        Give this person a detail page
      </Label>

      {hasDetailPage && (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
          <RichTextEditor name="detailBody" defaultValue={defaultValues?.detailBody} label="Detail page content" />
          {defaultValues?.slug && (
            <p className="-mt-2 text-xs text-muted-foreground">
              Currently at <code>/team/{defaultValues.slug}</code>
            </p>
          )}
        </div>
      )}

      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
