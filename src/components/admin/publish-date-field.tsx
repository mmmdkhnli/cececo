"use client";

import { useState } from "react";

import { DateTimePicker } from "@/components/admin/ui/date-picker";
import { FormField } from "@/components/admin/ui/form-field";
import { Label } from "@/components/admin/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/admin/ui/radio-group";

export function PublishDateField({ defaultValue }: { defaultValue?: Date | string | null }) {
  const [mode, setMode] = useState<"now" | "manual">(defaultValue ? "manual" : "now");
  const manualDefault = (defaultValue ? new Date(defaultValue) : new Date()).toISOString();

  return (
    <FormField label="Publish date">
      <RadioGroup
        name="publishMode"
        value={mode}
        onValueChange={(v) => setMode(v as "now" | "manual")}
        className="flex flex-row gap-4"
      >
        <Label className="flex items-center gap-1.5 font-normal">
          <RadioGroupItem value="now" />
          Now
        </Label>
        <Label className="flex items-center gap-1.5 font-normal">
          <RadioGroupItem value="manual" />
          Pick manually
        </Label>
      </RadioGroup>
      {mode === "manual" && <DateTimePicker name="publishedAt" defaultValue={manualDefault} />}
    </FormField>
  );
}
