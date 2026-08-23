import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import type { PartnerRow } from "@/db/schema";

const CATEGORY_LABEL: Record<string, string> = {
  institutional_strategic: "Institutional & Strategic",
  knowledge_development: "Knowledge & Development",
  events_initiatives: "Events & Initiatives",
};

export function PartnerForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: PartnerRow;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <Field label="Name">
        <input
          name="name"
          defaultValue={defaultValues?.name}
          required
          className="admin-input"
        />
      </Field>
      <ImageUpload
        name="logoImage"
        defaultValue={defaultValues?.logoImage}
        label="Logo"
      />
      <Field label="Category">
        <select
          name="category"
          defaultValue={defaultValues?.category ?? "institutional_strategic"}
          className="admin-input"
        >
          {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Status (optional, e.g. Strategic Partner)">
        <input
          name="statusLabel"
          defaultValue={defaultValues?.statusLabel ?? ""}
          className="admin-input"
        />
      </Field>
      <Field label="Badge (optional, e.g. MoU Signed · 2 June 2026)">
        <input
          name="badge"
          defaultValue={defaultValues?.badge ?? ""}
          className="admin-input"
        />
      </Field>
      <Field label="Short description (optional, 2-3 lines)">
        <textarea
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          rows={2}
          className="admin-input"
        />
      </Field>
      <Field label="View More link (optional — related news/event page)">
        <input
          name="viewMoreUrl"
          defaultValue={defaultValues?.viewMoreUrl ?? ""}
          className="admin-input"
        />
      </Field>
      <Field label="Visit Website link (optional)">
        <input
          name="link"
          defaultValue={defaultValues?.link ?? ""}
          className="admin-input"
        />
      </Field>
      <Field label="Order">
        <input
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className="admin-input w-24"
        />
      </Field>
      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-small font-semibold text-neutral-darkest">
        {label}
      </label>
      {children}
    </div>
  );
}
