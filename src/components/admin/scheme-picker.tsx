"use client";

import { SCHEME_VALUES, type SchemeKey } from "@/db/schema";
import { SCHEME_META } from "@/lib/scheme-meta";
import { Label } from "@/components/admin/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/admin/ui/radio-group";

export function SchemePicker({ defaultValue }: { defaultValue: SchemeKey }) {
  return (
    <RadioGroup name="scheme" defaultValue={defaultValue} className="grid grid-cols-2 sm:grid-cols-3">
      {SCHEME_VALUES.map((key) => {
        const meta = SCHEME_META[key];
        return (
          <Label
            key={key}
            htmlFor={`scheme-${key}`}
            className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-border p-2 font-normal transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
          >
            <RadioGroupItem value={key} id={`scheme-${key}`} className="sr-only" />
            <span
              className="size-8 shrink-0 overflow-hidden rounded-full border border-border"
              style={{ background: `linear-gradient(135deg, ${meta.background} 50%, ${meta.foreground} 50%)` }}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{meta.label}</p>
              <p className="truncate text-xs text-muted-foreground">{meta.hint}</p>
            </div>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
