import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import type { OpportunityRow } from "@/db/schema";

export function OpportunityForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: OpportunityRow;
}) {
  const deadlineValue = defaultValues?.deadline
    ? new Date(defaultValues.deadline).toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <Field label="Title">
        <input name="title" defaultValue={defaultValues?.title} required className="admin-input" />
      </Field>
      <Field label="Slug (URL)">
        <input name="slug" defaultValue={defaultValues?.slug ?? ""} required className="admin-input" />
      </Field>
      <Field label="Short description">
        <textarea name="excerpt" defaultValue={defaultValues?.excerpt ?? ""} rows={2} required className="admin-input" />
      </Field>
      <RichTextEditor name="description" defaultValue={defaultValues?.description} label="Full description" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <select name="category" defaultValue={defaultValues?.category ?? "vacancy"} className="admin-input">
            <option value="internship">Internship</option>
            <option value="vacancy">Vacancy</option>
            <option value="young_professional_programme">Young Professional Programme</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Application deadline">
          <input name="deadline" type="date" defaultValue={deadlineValue} className="admin-input" />
        </Field>
      </div>
      <Field label="Application link">
        <input name="applyUrl" defaultValue={defaultValues?.applyUrl} required className="admin-input" />
      </Field>
      <Field label="Status">
        <select name="status" defaultValue={defaultValues?.status ?? "active"} className="admin-input">
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </Field>
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
