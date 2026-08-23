import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { DatePicker } from "@/components/admin/ui/date-picker";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
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
      <FormField label="Title">
        <Input name="title" defaultValue={defaultValues?.title} required />
      </FormField>
      <FormField label="Slug (URL)">
        <Input name="slug" defaultValue={defaultValues?.slug} required />
      </FormField>
      <FormField label="Type">
        <Select name="type" defaultValue={defaultValues?.type ?? "photo_gallery"}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="photo_gallery">Photo Gallery</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="press">Press Material</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Short description (optional)">
        <Textarea name="description" defaultValue={defaultValues?.description ?? ""} rows={2} />
      </FormField>
      <ImageUpload name="thumbnail" defaultValue={defaultValues?.thumbnail} label="Thumbnail" />
      <FormField label="Video URL (Video type only)">
        <Input name="videoUrl" defaultValue={defaultValues?.videoUrl ?? ""} />
      </FormField>
      <FormField label="Event date (optional)">
        <DatePicker name="eventDate" defaultValue={toDateInputValue(defaultValues?.eventDate)} />
      </FormField>
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
      <FormField label="Order">
        <Input name="order" type="number" defaultValue={defaultValues?.order ?? 0} className="w-24" />
      </FormField>
      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
