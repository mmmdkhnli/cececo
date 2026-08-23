"use client";

import { useActionState } from "react";
import type { SectionRow } from "@/db/schema";
import { updateSection, type UpdateSectionState } from "@/app/admin/(protected)/pages/actions";
import { SECTION_FIELD_CONFIG, type SectionFieldKey } from "@/lib/section-field-config";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SchemePicker } from "@/components/admin/scheme-picker";
import { SubmitButton } from "@/components/admin/submit-button";

const initialState: UpdateSectionState = {};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-small font-semibold text-neutral-darkest">{label}</label>
      {children}
    </div>
  );
}

function FieldBlock({ field, section }: { field: SectionFieldKey; section: SectionRow }) {
  switch (field) {
    case "eyebrow":
      return (
        <Field label="Eyebrow">
          <input name="eyebrow" defaultValue={section.eyebrow ?? ""} className="admin-input" />
        </Field>
      );
    case "heading":
      return (
        <Field label="Heading">
          <input name="heading" defaultValue={section.heading ?? ""} className="admin-input" />
        </Field>
      );
    case "subtitle":
      return <RichTextEditor name="subtitle" defaultValue={section.subtitle} label="Subtitle" />;
    case "backgroundImage":
      return <ImageUpload name="backgroundImage" defaultValue={section.backgroundImage} label="Background image" />;
    case "icon":
      return <ImageUpload name="icon" defaultValue={section.icon} label="Icon" />;
    case "imagePosition":
      return (
        <Field label="Image position">
          <select name="imagePosition" defaultValue={section.imagePosition ?? "right"} className="admin-input">
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </Field>
      );
    case "disclaimer":
      return (
        <Field label="Disclaimer">
          <input name="disclaimer" defaultValue={section.disclaimer ?? ""} className="admin-input" />
        </Field>
      );
    case "ctaPrimary":
      return (
        <div className="grid grid-cols-2 gap-4 rounded-card border border-neutral-lighter p-4">
          <p className="col-span-2 text-small font-semibold text-neutral-darkest">Primary button</p>
          <Field label="Text">
            <input name="ctaPrimaryLabel" defaultValue={section.ctaPrimaryLabel ?? ""} className="admin-input" />
          </Field>
          <Field label="Link">
            <input name="ctaPrimaryHref" defaultValue={section.ctaPrimaryHref ?? ""} className="admin-input" />
          </Field>
        </div>
      );
    case "ctaSecondary":
      return (
        <div className="grid grid-cols-2 gap-4 rounded-card border border-neutral-lighter p-4">
          <p className="col-span-2 text-small font-semibold text-neutral-darkest">Secondary button</p>
          <Field label="Text">
            <input name="ctaSecondaryLabel" defaultValue={section.ctaSecondaryLabel ?? ""} className="admin-input" />
          </Field>
          <Field label="Link">
            <input name="ctaSecondaryHref" defaultValue={section.ctaSecondaryHref ?? ""} className="admin-input" />
          </Field>
        </div>
      );
    case "closingCta":
      return (
        <div className="grid grid-cols-2 gap-4 rounded-card border border-neutral-lighter p-4">
          <p className="col-span-2 text-small font-semibold text-neutral-darkest">Closing button</p>
          <Field label="Text">
            <input name="closingCtaLabel" defaultValue={section.closingCtaLabel ?? ""} className="admin-input" />
          </Field>
          <Field label="Link">
            <input name="closingCtaHref" defaultValue={section.closingCtaHref ?? ""} className="admin-input" />
          </Field>
        </div>
      );
    case "secondary":
      return (
        <div className="flex flex-col gap-4 rounded-card border border-neutral-lighter p-4">
          <p className="text-small font-semibold text-neutral-darkest">Secondary block</p>
          <Field label="Eyebrow">
            <input name="secondaryEyebrow" defaultValue={section.secondaryEyebrow ?? ""} className="admin-input" />
          </Field>
          <Field label="Heading">
            <input name="secondaryHeading" defaultValue={section.secondaryHeading ?? ""} className="admin-input" />
          </Field>
          <RichTextEditor name="secondaryBody" defaultValue={section.secondaryBody} label="Text" />
        </div>
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
      <div className="flex flex-col gap-1.5">
        <label className="text-small font-semibold text-neutral-darkest">Component</label>
        <p className="font-mono text-small text-neutral">{section.componentKey}</p>
      </div>
      <Field label="Order">
        <input name="order" type="number" defaultValue={section.order} className="admin-input w-24" />
      </Field>

      <div className="flex flex-col gap-1.5">
        <label className="text-small font-semibold text-neutral-darkest">Color scheme</label>
        <p className="text-tiny text-neutral">Choose the section&apos;s background and text color.</p>
        <SchemePicker defaultValue={section.scheme} />
      </div>

      {config.fields.map((field) => (
        <FieldBlock key={field} field={field} section={section} />
      ))}

      {config.fields.length === 0 && (
        <p className="text-small text-neutral">
          This section has no text fields — manage the list below.
        </p>
      )}

      {state.error && <p className="text-small text-red-violet">{state.error}</p>}
      {state.success && <p className="text-small text-mountain-meadow-dark">Saved.</p>}
      <div>
        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
}
