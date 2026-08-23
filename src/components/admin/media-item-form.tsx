import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import type { MediaItemRow } from "@/db/schema";

function toDateInputValue(value: Date | string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function MediaItemForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: MediaItemRow;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <Field label="Title">
        <input
          name="title"
          defaultValue={defaultValues?.title}
          required
          className="admin-input"
        />
      </Field>
      <Field label="Slug (URL)">
        <input
          name="slug"
          defaultValue={defaultValues?.slug}
          required
          className="admin-input"
        />
      </Field>
      <Field label="Type">
        <select
          name="type"
          defaultValue={defaultValues?.type ?? "photo_gallery"}
          className="admin-input"
        >
          <option value="photo_gallery">Photo Gallery</option>
          <option value="video">Video</option>
          <option value="press">Press Material</option>
        </select>
      </Field>
      <Field label="Short description (optional)">
        <textarea
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          rows={2}
          className="admin-input"
        />
      </Field>
      <ImageUpload
        name="thumbnail"
        defaultValue={defaultValues?.thumbnail}
        label="Thumbnail"
      />
      <Field label="Video URL (Video type only)">
        <input
          name="videoUrl"
          defaultValue={defaultValues?.videoUrl ?? ""}
          className="admin-input"
        />
      </Field>
      <Field label="Event date (optional)">
        <input
          name="eventDate"
          type="date"
          defaultValue={toDateInputValue(defaultValues?.eventDate)}
          className="admin-input"
        />
      </Field>
      <Field label="Status">
        <select
          name="status"
          defaultValue={defaultValues?.status ?? "draft"}
          className="admin-input"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
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
