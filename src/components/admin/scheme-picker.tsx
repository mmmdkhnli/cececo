import { SCHEME_VALUES, type SchemeKey } from "@/db/schema";
import { SCHEME_META } from "@/lib/scheme-meta";

// Native radios + peer-checked styling — no client JS needed for the
// selection highlight to work.
export function SchemePicker({ defaultValue }: { defaultValue: SchemeKey }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {SCHEME_VALUES.map((key) => {
        const meta = SCHEME_META[key];
        return (
          <label key={key} className="group relative cursor-pointer">
            <input
              type="radio"
              name="scheme"
              value={key}
              defaultChecked={key === defaultValue}
              className="peer sr-only"
            />
            <div className="flex items-center gap-2 rounded-form border-2 border-neutral-lighter p-2 transition-colors peer-checked:border-mountain-meadow peer-checked:bg-mountain-meadow-lightest">
              <span
                className="size-8 shrink-0 overflow-hidden rounded-full border border-neutral-lighter"
                style={{ background: `linear-gradient(135deg, ${meta.background} 50%, ${meta.foreground} 50%)` }}
              />
              <div className="min-w-0">
                <p className="text-small font-semibold text-neutral-darkest">{meta.label}</p>
                <p className="truncate text-tiny text-neutral">{meta.hint}</p>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
