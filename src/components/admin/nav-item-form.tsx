import { SubmitButton } from "@/components/admin/submit-button";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import type { NavItemRow } from "@/db/schema";

export function NavItemForm({
  action,
  defaultValues,
  parentOptions,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: NavItemRow;
  parentOptions: { id: number; label: string }[];
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <FormField label="Label">
        <Input name="label" defaultValue={defaultValues?.label} required />
      </FormField>
      <FormField label="Link (href)">
        <Input name="href" defaultValue={defaultValues?.href} required />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Location">
          <Select name="location" defaultValue={defaultValues?.location ?? "navbar"}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="navbar">Navbar</SelectItem>
              <SelectItem value="footer">Footer</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Order">
          <Input name="order" type="number" defaultValue={defaultValues?.order ?? 0} />
        </FormField>
      </div>
      <FormField label="Footer group (footer only)">
        <Select name="group" defaultValue={defaultValues?.group ?? "none"}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            <SelectItem value="quick_links">quick_links</SelectItem>
            <SelectItem value="connect">connect</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Icon ('connect' group only: x, linkedin)">
        <Input name="icon" defaultValue={defaultValues?.icon ?? ""} />
      </FormField>
      <FormField label="Parent menu (for a dropdown sub-link)">
        <Select name="parentId" defaultValue={defaultValues?.parentId ? String(defaultValues.parentId) : "none"}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">— Top-level link —</SelectItem>
            {parentOptions
              .filter((p) => p.id !== defaultValues?.id)
              .map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </FormField>
      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
