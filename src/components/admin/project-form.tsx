"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
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
      <Field label="Title">
        <input name="title" defaultValue={defaultValues?.title} required className="admin-input" />
      </Field>
      <Field label="Slug (URL)">
        <input name="slug" defaultValue={defaultValues?.slug} required className="admin-input" />
      </Field>
      <Field label="Short description (shown on the card)">
        <textarea
          name="shortDescription"
          defaultValue={defaultValues?.shortDescription}
          rows={2}
          required
          className="admin-input"
        />
      </Field>
      <ImageUpload name="coverImage" defaultValue={defaultValues?.coverImage} label="Cover image" />
      <RichTextEditor name="aboutBody" defaultValue={defaultValues?.aboutBody} label="About the project" />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <select name="status" defaultValue={defaultValues?.status ?? "upcoming"} className="admin-input">
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </Field>
        <Field label="Order">
          <input name="order" type="number" defaultValue={defaultValues?.order ?? 0} className="admin-input" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Period start">
          <input
            name="periodStart"
            type="date"
            defaultValue={dateValue(defaultValues?.periodStart)}
            className="admin-input"
          />
        </Field>
        <Field label="Period end">
          <input
            name="periodEnd"
            type="date"
            defaultValue={dateValue(defaultValues?.periodEnd)}
            className="admin-input"
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-small text-neutral-darkest">
        <input
          type="checkbox"
          name="isRegionalInitiative"
          defaultChecked={defaultValues?.isRegionalInitiative ?? false}
          className="size-4"
        />
        Mark as Regional Initiative
      </label>

      <label className="flex items-center gap-2 text-small text-neutral-darkest">
        <input
          type="checkbox"
          name="applicationsOpen"
          checked={applicationsOpen}
          onChange={(e) => setApplicationsOpen(e.target.checked)}
          className="size-4"
        />
        Applications are open
      </label>

      {applicationsOpen && (
        <div className="flex flex-col gap-4 rounded-card border border-neutral-lighter p-4">
          <p className="text-small font-semibold text-neutral-darkest">Application details</p>
          <Field label="Application deadline">
            <input
              name="applicationDeadline"
              type="date"
              defaultValue={dateValue(defaultValues?.applicationDeadline)}
              className="admin-input"
            />
          </Field>
          <Field label="Who can apply">
            <input name="whoCanApply" defaultValue={defaultValues?.whoCanApply ?? ""} className="admin-input" />
          </Field>
          <RichTextEditor name="howToApplyBody" defaultValue={defaultValues?.howToApplyBody} label="How to apply" />
          <Field label="Application link">
            <input name="applyUrl" defaultValue={defaultValues?.applyUrl ?? ""} className="admin-input" />
          </Field>
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
