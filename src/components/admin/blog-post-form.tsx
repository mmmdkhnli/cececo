import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { PublishDateField } from "@/components/admin/publish-date-field";
import { SubmitButton } from "@/components/admin/submit-button";
import type { BlogPostRow } from "@/db/schema";

export function BlogPostForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: BlogPostRow;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <Field label="Title">
        <input name="title" defaultValue={defaultValues?.title} required className="admin-input" />
      </Field>
      <Field label="Slug (URL)">
        <input name="slug" defaultValue={defaultValues?.slug} required className="admin-input" />
      </Field>
      <Field label="Short description">
        <textarea name="excerpt" defaultValue={defaultValues?.excerpt} rows={2} required className="admin-input" />
      </Field>
      <RichTextEditor name="body" defaultValue={defaultValues?.body} label="Text" />
      <ImageUpload name="coverImage" defaultValue={defaultValues?.coverImage} label="Cover image" />
      <Field label="Category">
        <input name="category" defaultValue={defaultValues?.category} required className="admin-input" />
      </Field>
      <p className="text-tiny text-neutral">
        Read time is calculated automatically based on the text length.
      </p>
      <Field label="Status">
        <select name="status" defaultValue={defaultValues?.status ?? "draft"} className="admin-input">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </Field>
      <PublishDateField defaultValue={defaultValues?.publishedAt} />
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
