import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import type { PartnerRow } from "@/db/schema";

const CATEGORY_LABEL: Record<string, string> = {
  institutional_strategic: "Institutional & Strategic",
  knowledge_development: "Knowledge & Development",
  events_initiatives: "Events & Initiatives",
};

export function PartnerForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: PartnerRow;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <FormField label="Name">
        <Input name="name" defaultValue={defaultValues?.name} required />
      </FormField>
      <ImageUpload name="logoImage" defaultValue={defaultValues?.logoImage} label="Logo" />
      <FormField label="Category">
        <Select name="category" defaultValue={defaultValues?.category ?? "institutional_strategic"}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Status (optional, e.g. Strategic Partner)">
        <Input name="statusLabel" defaultValue={defaultValues?.statusLabel ?? ""} />
      </FormField>
      <FormField label="Badge (optional, e.g. MoU Signed · 2 June 2026)">
        <Input name="badge" defaultValue={defaultValues?.badge ?? ""} />
      </FormField>
      <FormField label="Short description (optional, 2-3 lines)">
        <Textarea name="description" defaultValue={defaultValues?.description ?? ""} rows={2} />
      </FormField>
      <FormField label="View More link (optional — related news/event page)">
        <Input name="viewMoreUrl" defaultValue={defaultValues?.viewMoreUrl ?? ""} />
      </FormField>
      <FormField label="Visit Website link (optional)">
        <Input name="link" defaultValue={defaultValues?.link ?? ""} />
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
