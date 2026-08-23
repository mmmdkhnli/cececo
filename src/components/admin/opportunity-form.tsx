import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import { DatePicker } from "@/components/admin/ui/date-picker";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import type { OpportunityRow } from "@/db/schema";

export function OpportunityForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: OpportunityRow;
}) {
  const deadlineValue = defaultValues?.deadline
    ? new Date(defaultValues.deadline).toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <FormField label="Title">
        <Input name="title" defaultValue={defaultValues?.title} required />
      </FormField>
      <FormField label="Slug (URL)">
        <Input name="slug" defaultValue={defaultValues?.slug ?? ""} required />
      </FormField>
      <FormField label="Short description">
        <Textarea name="excerpt" defaultValue={defaultValues?.excerpt ?? ""} rows={2} required />
      </FormField>
      <RichTextEditor name="description" defaultValue={defaultValues?.description} label="Full description" />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Category">
          <Select name="category" defaultValue={defaultValues?.category ?? "vacancy"}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="vacancy">Vacancy</SelectItem>
              <SelectItem value="young_professional_programme">Young Professional Programme</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Application deadline">
          <DatePicker name="deadline" defaultValue={deadlineValue} />
        </FormField>
      </div>
      <FormField label="Application link">
        <Input name="applyUrl" defaultValue={defaultValues?.applyUrl} required />
      </FormField>
      <FormField label="Status">
        <Select name="status" defaultValue={defaultValues?.status ?? "active"}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
