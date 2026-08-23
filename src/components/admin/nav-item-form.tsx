import { SubmitButton } from "@/components/admin/submit-button";
import type { NavItemRow } from "@/db/schema";

export function NavItemForm({
  action,
  defaultValues,
  parentOptions,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: NavItemRow;
  parentOptions: { id: number; label: string }[];
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <Field label="Label">
        <input name="label" defaultValue={defaultValues?.label} required className="admin-input" />
      </Field>
      <Field label="Link (href)">
        <input name="href" defaultValue={defaultValues?.href} required className="admin-input" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Location">
          <select name="location" defaultValue={defaultValues?.location ?? "navbar"} className="admin-input">
            <option value="navbar">Navbar</option>
            <option value="footer">Footer</option>
          </select>
        </Field>
        <Field label="Order">
          <input name="order" type="number" defaultValue={defaultValues?.order ?? 0} className="admin-input" />
        </Field>
      </div>
      <Field label="Footer group (footer only)">
        <select name="group" defaultValue={defaultValues?.group ?? ""} className="admin-input">
          <option value="">—</option>
          <option value="quick_links">quick_links</option>
          <option value="connect">connect</option>
        </select>
      </Field>
      <Field label="Icon ('connect' group only: x, linkedin)">
        <input name="icon" defaultValue={defaultValues?.icon ?? ""} className="admin-input" />
      </Field>
      <Field label="Parent menu (for a dropdown sub-link)">
        <select name="parentId" defaultValue={defaultValues?.parentId ?? ""} className="admin-input">
          <option value="">— Top-level link —</option>
          {parentOptions
            .filter((p) => p.id !== defaultValues?.id)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
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
