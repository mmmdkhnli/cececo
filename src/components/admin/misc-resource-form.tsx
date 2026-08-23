import { SubmitButton } from "@/components/admin/submit-button";
import type { MiscResourceRow } from "@/db/schema";

export function MiscResourceForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: MiscResourceRow;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <Field label="Title">
        <input name="title" defaultValue={defaultValues?.title} required className="admin-input" />
      </Field>
      <Field label="Short description">
        <textarea name="description" defaultValue={defaultValues?.description} rows={3} required className="admin-input" />
      </Field>
      <Field label="Link">
        <input name="link" defaultValue={defaultValues?.link} required className="admin-input" />
      </Field>
      <Field label="Order">
        <input name="order" type="number" defaultValue={defaultValues?.order ?? 0} className="admin-input w-24" />
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
