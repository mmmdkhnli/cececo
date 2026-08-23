import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import type { TeamMemberRow } from "@/db/schema";

export function TeamMemberForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: TeamMemberRow;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <Field label="Full name">
        <input name="name" defaultValue={defaultValues?.name} required className="admin-input" />
      </Field>
      <Field label="Role">
        <input name="role" defaultValue={defaultValues?.role} required className="admin-input" />
      </Field>
      <Field label="Bio">
        <textarea name="bio" defaultValue={defaultValues?.bio ?? ""} rows={3} className="admin-input" />
      </Field>
      <ImageUpload name="photo" defaultValue={defaultValues?.photo} label="Photo" />
      <Field label="Email">
        <input name="email" type="email" defaultValue={defaultValues?.email ?? ""} className="admin-input" />
      </Field>
      <Field label="LinkedIn URL">
        <input name="linkedinUrl" defaultValue={defaultValues?.linkedinUrl ?? ""} className="admin-input" />
      </Field>
      <Field label="X (Twitter) URL">
        <input name="xUrl" defaultValue={defaultValues?.xUrl ?? ""} className="admin-input" />
      </Field>
      <Field label="Dribbble URL">
        <input name="dribbbleUrl" defaultValue={defaultValues?.dribbbleUrl ?? ""} className="admin-input" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Group">
          <select name="group" defaultValue={defaultValues?.group ?? "leadership"} className="admin-input">
            <option value="leadership">Leadership</option>
            <option value="technical">Technical</option>
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={defaultValues?.status ?? "active"} className="admin-input">
            <option value="active">Active</option>
            <option value="vacant">Vacant</option>
          </select>
        </Field>
      </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-small font-semibold text-neutral-darkest">{label}</label>
      {children}
    </div>
  );
}
