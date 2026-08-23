"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import { Card } from "@/components/admin/ui/card";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { DatePicker } from "@/components/admin/ui/date-picker";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import type { ProjectRow } from "@/db/schema";

function dateValue(value: Date | string | null | undefined) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export function ProjectForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: ProjectRow;
}) {
  const [applicationsOpen, setApplicationsOpen] = useState(defaultValues?.applicationsOpen ?? false);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <FormField label="Title">
        <Input name="title" defaultValue={defaultValues?.title} required />
      </FormField>
      <FormField label="Slug (URL)">
        <Input name="slug" defaultValue={defaultValues?.slug} required />
      </FormField>
      <FormField label="Short description (shown on the card)">
        <Textarea name="shortDescription" defaultValue={defaultValues?.shortDescription} rows={2} required />
      </FormField>
      <ImageUpload name="coverImage" defaultValue={defaultValues?.coverImage} label="Cover image" />
      <RichTextEditor name="aboutBody" defaultValue={defaultValues?.aboutBody} label="About the project" />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Status">
          <Select name="status" defaultValue={defaultValues?.status ?? "upcoming"}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Order">
          <Input name="order" type="number" defaultValue={defaultValues?.order ?? 0} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Period start">
          <DatePicker name="periodStart" defaultValue={dateValue(defaultValues?.periodStart)} />
        </FormField>
        <FormField label="Period end">
          <DatePicker name="periodEnd" defaultValue={dateValue(defaultValues?.periodEnd)} />
        </FormField>
      </div>

      <Label className="flex items-center gap-2 font-normal">
        <Checkbox name="isRegionalInitiative" defaultChecked={defaultValues?.isRegionalInitiative ?? false} />
        Mark as Regional Initiative
      </Label>

      <Label className="flex items-center gap-2 font-normal">
        <Checkbox
          name="applicationsOpen"
          checked={applicationsOpen}
          onCheckedChange={(checked) => setApplicationsOpen(checked === true)}
        />
        Applications are open
      </Label>

      {applicationsOpen && (
        <Card className="flex flex-col gap-4 p-4">
          <p className="text-sm font-semibold">Application details</p>
          <FormField label="Application deadline">
            <DatePicker name="applicationDeadline" defaultValue={dateValue(defaultValues?.applicationDeadline)} />
          </FormField>
          <FormField label="Who can apply">
            <Input name="whoCanApply" defaultValue={defaultValues?.whoCanApply ?? ""} />
          </FormField>
          <RichTextEditor name="howToApplyBody" defaultValue={defaultValues?.howToApplyBody} label="How to apply" />
          <FormField label="Application link">
            <Input name="applyUrl" defaultValue={defaultValues?.applyUrl ?? ""} />
          </FormField>
        </Card>
      )}

      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
