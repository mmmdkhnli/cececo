"use client";

import { useActionState } from "react";
import type { SectionRow } from "@/db/schema";
import { updateSection, type UpdateSectionState } from "@/app/admin/(protected)/pages/actions";
import { SECTION_FIELD_CONFIG, type SectionFieldKey } from "@/lib/section-field-config";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SchemePicker } from "@/components/admin/scheme-picker";
import { SubmitButton } from "@/components/admin/submit-button";
import { Card } from "@/components/admin/ui/card";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";

const initialState: UpdateSectionState = {};

function FieldBlock({ field, section }: { field: SectionFieldKey; section: SectionRow }) {
  switch (field) {
    case "eyebrow":
      return (
        <FormField label="Eyebrow">
          <Input name="eyebrow" defaultValue={section.eyebrow ?? ""} />
        </FormField>
      );
    case "heading":
      return (
        <FormField label="Heading">
          <Input name="heading" defaultValue={section.heading ?? ""} />
        </FormField>
      );
    case "subtitle":
      return <RichTextEditor name="subtitle" defaultValue={section.subtitle} label="Subtitle" />;
    case "backgroundImage":
      return <ImageUpload name="backgroundImage" defaultValue={section.backgroundImage} label="Background image" />;
    case "icon":
      return <ImageUpload name="icon" defaultValue={section.icon} label="Icon" />;
    case "imagePosition":
      return (
        <FormField label="Image position">
          <Select name="imagePosition" defaultValue={section.imagePosition ?? "right"}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      );
    case "disclaimer":
      return (
        <FormField label="Disclaimer">
          <Input name="disclaimer" defaultValue={section.disclaimer ?? ""} />
        </FormField>
      );
    case "ctaPrimary":
      return (
        <Card className="grid grid-cols-2 gap-4 p-4">
          <p className="col-span-2 text-sm font-semibold">Primary button</p>
          <FormField label="Text">
            <Input name="ctaPrimaryLabel" defaultValue={section.ctaPrimaryLabel ?? ""} />
          </FormField>
          <FormField label="Link">
            <Input name="ctaPrimaryHref" defaultValue={section.ctaPrimaryHref ?? ""} />
          </FormField>
        </Card>
      );
    case "ctaSecondary":
      return (
        <Card className="grid grid-cols-2 gap-4 p-4">
          <p className="col-span-2 text-sm font-semibold">Secondary button</p>
          <FormField label="Text">
            <Input name="ctaSecondaryLabel" defaultValue={section.ctaSecondaryLabel ?? ""} />
          </FormField>
          <FormField label="Link">
            <Input name="ctaSecondaryHref" defaultValue={section.ctaSecondaryHref ?? ""} />
          </FormField>
        </Card>
      );
    case "closingCta":
      return (
        <Card className="grid grid-cols-2 gap-4 p-4">
          <p className="col-span-2 text-sm font-semibold">Closing button</p>
          <FormField label="Text">
            <Input name="closingCtaLabel" defaultValue={section.closingCtaLabel ?? ""} />
          </FormField>
          <FormField label="Link">
            <Input name="closingCtaHref" defaultValue={section.closingCtaHref ?? ""} />
          </FormField>
        </Card>
      );
    case "secondary":
      return (
        <Card className="flex flex-col gap-4 p-4">
          <p className="text-sm font-semibold">Secondary block</p>
          <FormField label="Eyebrow">
            <Input name="secondaryEyebrow" defaultValue={section.secondaryEyebrow ?? ""} />
          </FormField>
          <FormField label="Heading">
            <Input name="secondaryHeading" defaultValue={section.secondaryHeading ?? ""} />
          </FormField>
          <RichTextEditor name="secondaryBody" defaultValue={section.secondaryBody} label="Text" />
        </Card>
      );
    default:
      return null;
  }
}

export function SectionForm({ section, pageSlug }: { section: SectionRow; pageSlug: string }) {
  const boundAction = updateSection.bind(null, section.id, pageSlug);
  const [state, formAction] = useActionState(boundAction, initialState);
  const config = SECTION_FIELD_CONFIG[section.componentKey] ?? { fields: [] };

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <FormField label="Component">
        <p className="font-mono text-sm text-muted-foreground">{section.componentKey}</p>
      </FormField>
      <FormField label="Order">
        <Input name="order" type="number" defaultValue={section.order} className="w-24" />
      </FormField>

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold">Color scheme</p>
        <p className="text-xs text-muted-foreground">Choose the section&apos;s background and text color.</p>
        <SchemePicker defaultValue={section.scheme} />
      </div>

      {config.fields.map((field) => (
        <FieldBlock key={field} field={field} section={section} />
      ))}

      {config.fields.length === 0 && (
        <p className="text-sm text-muted-foreground">This section has no text fields — manage the list below.</p>
      )}

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Saved.</p>}
      <div>
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
