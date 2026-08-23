import { ImageUpload } from "@/components/admin/image-upload";
import { DocumentUpload } from "@/components/admin/document-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { PublishDateField } from "@/components/admin/publish-date-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
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
      <FormField label="Title">
        <Input name="title" defaultValue={defaultValues?.title} required />
      </FormField>
      <FormField label="Slug (URL)">
        <Input name="slug" defaultValue={defaultValues?.slug} required />
      </FormField>
      <FormField label="Short description">
        <Textarea name="excerpt" defaultValue={defaultValues?.excerpt} rows={2} required />
      </FormField>
      <ImageUpload name="coverImage" defaultValue={defaultValues?.coverImage} label="Cover image" />
      <FormField label="Category">
        <Select name="category" defaultValue={defaultValues?.category ?? "Publication"}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Publication">Publication</SelectItem>
            <SelectItem value="Report">Report</SelectItem>
            <SelectItem value="Document">Document</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <div className="mt-2 border-t border-border pt-5">
        <h2 className="mb-1 text-lg font-bold">File</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          This file enables the &quot;Download PDF&quot; / &quot;View Online&quot; buttons on the site.
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
            <FormField label="Format">
              <Select name="fileFormat" defaultValue={defaultValues?.fileFormat ?? "PDF"}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Word">Word</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Language">
              <Input name="language" defaultValue={defaultValues?.language ?? ""} />
            </FormField>
            <FormField label="Page count">
              <Input name="pages" type="number" defaultValue={defaultValues?.pages ?? ""} />
            </FormField>
            <FormField label="Published by">
              <Input name="publishedBy" defaultValue={defaultValues?.publishedBy ?? ""} />
            </FormField>
          </div>
        </div>
      </div>

      <RichTextEditor name="body" defaultValue={defaultValues?.body} label="Additional text (optional)" />

      <FormField label="Status">
        <Select name="status" defaultValue={defaultValues?.status ?? "draft"}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <PublishDateField defaultValue={defaultValues?.publishedAt} />
      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
