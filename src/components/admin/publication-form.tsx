import { ImageUpload } from "@/components/admin/image-upload";
import { DocumentUpload } from "@/components/admin/document-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { PublishDateField } from "@/components/admin/publish-date-field";
import { SubmitButton } from "@/components/admin/submit-button";
import type { PublicationRow } from "@/db/schema";

export function PublicationForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: PublicationRow;
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
      <Field label="Short description">
        <textarea
          name="excerpt"
          defaultValue={defaultValues?.excerpt}
          rows={2}
          required
          className="admin-input"
        />
      </Field>
      <ImageUpload
        name="coverImage"
        defaultValue={defaultValues?.coverImage}
        label="Cover image"
      />
      <Field label="Category">
        <select
          name="category"
          defaultValue={defaultValues?.category ?? "Publication"}
          className="admin-input"
        >
          <option value="Publication">Publication</option>
          <option value="Report">Report</option>
          <option value="Document">Document</option>
        </select>
      </Field>

      <div className="mt-2 border-t border-neutral-lighter pt-5">
        <h2 className="mb-1 text-medium font-bold text-neutral-darkest">
          File
        </h2>
        <p className="mb-5 text-small text-neutral">
          This file enables the &quot;Download PDF&quot; / &quot;View
          Online&quot; buttons on the site.
        </p>
        <div className="flex flex-col gap-5">
          <DocumentUpload
            name="fileUrl"
            sizeFieldName="fileSizeBytes"
            defaultValue={defaultValues?.fileUrl}
            defaultSizeBytes={defaultValues?.fileSizeBytes}
            label="Document (PDF, DOC, DOCX)"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Format">
              <select
                name="fileFormat"
                defaultValue={defaultValues?.fileFormat ?? "PDF"}
                className="admin-input"
              >
                <option value="PDF">PDF</option>
                <option value="Word">Word</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Language">
              <input
                name="language"
                defaultValue={defaultValues?.language ?? ""}
                className="admin-input"
              />
            </Field>
            <Field label="Page count">
              <input
                name="pages"
                type="number"
                defaultValue={defaultValues?.pages ?? ""}
                className="admin-input"
              />
            </Field>
            <Field label="Published by">
              <input
                name="publishedBy"
                defaultValue={defaultValues?.publishedBy ?? ""}
                className="admin-input"
              />
            </Field>
          </div>
        </div>
      </div>

      <RichTextEditor
        name="body"
        defaultValue={defaultValues?.body}
        label="Additional text (optional)"
      />

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
      <PublishDateField defaultValue={defaultValues?.publishedAt} />
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
