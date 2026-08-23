import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import type { MemberStateRow } from "@/db/schema";

export function MemberStateForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: MemberStateRow;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <Field label="Country name">
        <input
          name="name"
          defaultValue={defaultValues?.name}
          required
          className="admin-input"
        />
      </Field>
      <ImageUpload
        name="flagImage"
        defaultValue={defaultValues?.flagImage}
        label="Flag"
      />
      <Field label="Order">
        <input
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className="admin-input w-24"
        />
      </Field>
      <label className="flex items-center gap-2 text-small text-neutral-darkest">
        <input
          type="checkbox"
          name="isSignatory"
          defaultChecked={defaultValues?.isSignatory ?? true}
          className="size-4"
        />
        Signatory state
      </label>

      <div className="mt-4 border-t border-neutral-lighter pt-5">
        <h2 className="mb-1 text-medium font-bold text-neutral-darkest">
          Country Profile page
        </h2>
        <p className="mb-5 text-small text-neutral">
          These fields create the <code>/countries/[slug]</code> page. If slug
          is left empty, the page won&apos;t be published (it will only appear
          in the flag list).
        </p>

        <div className="flex flex-col gap-5">
          <Field label="Slug (URL, optional — e.g. kazakhstan)">
            <input
              name="slug"
              defaultValue={defaultValues?.slug ?? ""}
              className="admin-input"
            />
          </Field>
          <Field label="Description (optional)">
            <textarea
              name="description"
              defaultValue={defaultValues?.description ?? ""}
              rows={4}
              className="admin-input"
            />
          </Field>
          <ImageUpload
            name="heroImage"
            defaultValue={defaultValues?.heroImage ?? ""}
            label="Hero background image"
          />

          <h3 className="mt-2 text-small font-bold text-neutral-darkest">
            Key Facts
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Region">
              <input
                name="region"
                defaultValue={defaultValues?.region ?? ""}
                className="admin-input"
              />
            </Field>
            <Field label="Capital">
              <input
                name="capital"
                defaultValue={defaultValues?.capital ?? ""}
                className="admin-input"
              />
            </Field>
            <Field label="Population">
              <input
                name="population"
                defaultValue={defaultValues?.population ?? ""}
                className="admin-input"
              />
            </Field>
            <Field label="Area">
              <input
                name="area"
                defaultValue={defaultValues?.area ?? ""}
                className="admin-input"
              />
            </Field>
            <Field label="Founded">
              <input
                name="founded"
                defaultValue={defaultValues?.founded ?? ""}
                className="admin-input"
              />
            </Field>
            <Field label="Time Zone">
              <input
                name="timeZone"
                defaultValue={defaultValues?.timeZone ?? ""}
                className="admin-input"
              />
            </Field>
          </div>

          <ImageUpload
            name="renewableEnergySharesImage"
            defaultValue={defaultValues?.renewableEnergySharesImage ?? ""}
            label="Renewable Energy Shares image"
          />
          <ImageUpload
            name="bySourceImage"
            defaultValue={defaultValues?.bySourceImage ?? ""}
            label="By Source image"
          />
        </div>
      </div>

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
