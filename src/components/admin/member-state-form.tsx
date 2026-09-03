import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
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
      <FormField label="Country name">
        <Input name="name" defaultValue={defaultValues?.name} required />
      </FormField>
      <ImageUpload name="flagImage" defaultValue={defaultValues?.flagImage} label="Flag" />
      <FormField label="Order">
        <Input name="order" type="number" defaultValue={defaultValues?.order ?? 0} className="w-24" />
      </FormField>
      <Label className="flex items-center gap-2 font-normal">
        <Checkbox name="isSignatory" defaultChecked={defaultValues?.isSignatory ?? true} />
        Signatory state
      </Label>

      <div className="mt-4 border-t border-border pt-5">
        <h2 className="mb-1 text-lg font-bold">Country Profile page</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          These fields fill the <code>/countries/...</code> page, whose address is generated from the
          country name. While it stays unpublished the country only appears in the flag list.
        </p>

        <div className="flex flex-col gap-5">
          <Label className="flex items-center gap-2 font-normal">
            <Checkbox name="profilePublished" defaultChecked={Boolean(defaultValues?.slug)} />
            Publish the country profile page
            {defaultValues?.slug ? (
              <code className="text-xs text-muted-foreground">/countries/{defaultValues.slug}</code>
            ) : null}
          </Label>
          <RichTextEditor name="description" defaultValue={defaultValues?.description} label="Description (optional)" />
          <ImageUpload name="heroImage" defaultValue={defaultValues?.heroImage ?? ""} label="Hero background image" />

          <h3 className="mt-2 text-sm font-bold">Key Facts</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Region">
              <Input name="region" defaultValue={defaultValues?.region ?? ""} />
            </FormField>
            <FormField label="Capital">
              <Input name="capital" defaultValue={defaultValues?.capital ?? ""} />
            </FormField>
            <FormField label="Population">
              <Input name="population" defaultValue={defaultValues?.population ?? ""} />
            </FormField>
            <FormField label="Area">
              <Input name="area" defaultValue={defaultValues?.area ?? ""} />
            </FormField>
            <FormField label="Founded">
              <Input name="founded" defaultValue={defaultValues?.founded ?? ""} />
            </FormField>
            <FormField label="Time Zone">
              <Input name="timeZone" defaultValue={defaultValues?.timeZone ?? ""} />
            </FormField>
          </div>

          <ImageUpload
            name="renewableEnergySharesImage"
            defaultValue={defaultValues?.renewableEnergySharesImage ?? ""}
            label="Renewable Energy Shares image"
          />
          <ImageUpload name="bySourceImage" defaultValue={defaultValues?.bySourceImage ?? ""} label="By Source image" />
        </div>
      </div>

      <div className="mt-2">
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
