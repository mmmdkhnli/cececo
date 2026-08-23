import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { PublishDateField } from "@/components/admin/publish-date-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
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
      <FormField label="Title">
        <Input name="title" defaultValue={defaultValues?.title} required />
      </FormField>
      <FormField label="Slug (URL)">
        <Input name="slug" defaultValue={defaultValues?.slug} required />
      </FormField>
      <FormField label="Short description">
        <Textarea name="excerpt" defaultValue={defaultValues?.excerpt} rows={2} required />
      </FormField>
      <RichTextEditor name="body" defaultValue={defaultValues?.body} label="Text" />
      <ImageUpload name="coverImage" defaultValue={defaultValues?.coverImage} label="Cover image" />
      <FormField label="Category">
        <Input name="category" defaultValue={defaultValues?.category} required />
      </FormField>
      <p className="text-xs text-muted-foreground">
        Read time is calculated automatically based on the text length.
      </p>
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
