"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, type DayButton } from "react-day-picker";
import { format } from "date-fns";
import { CalendarToday, Close } from "relume-icons";
import { cn } from "@/lib/utils";

function PublicDayButton({ className, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  return (
    <button
      type="button"
      data-selected={modifiers.selected || undefined}
      data-today={modifiers.today || undefined}
      className={cn(
        "flex size-8 items-center justify-center rounded-button text-small text-scheme-text transition-colors hover:bg-scheme-hover disabled:cursor-not-allowed disabled:text-scheme-text-muted/40 disabled:hover:bg-transparent",
        "data-[selected]:bg-scheme-accent data-[selected]:text-white data-[selected]:hover:bg-scheme-accent",
        "data-[today]:font-bold",
        className,
      )}
      {...props}
    />
  );
}

export function NewsDatePicker({
  month,
  availableMonths,
  onSelectMonth,
}: {
  month: string | null;
  availableMonths: string[];
  onSelectMonth: (month: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = month ? new Date(`${month}-02T00:00:00`) : undefined;
  const availableSet = new Set(availableMonths);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-button border border-scheme-border px-4 py-2.5 text-small text-scheme-text hover:bg-scheme-hover"
      >
        <CalendarToday className="size-4 text-scheme-text-muted" />
        {selected ? format(selected, "MMMM yyyy") : "All dates"}
        {selected && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date filter"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMonth(null);
              setOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onSelectMonth(null);
                setOpen(false);
              }
            }}
            className="ml-1 text-scheme-text-muted hover:text-scheme-text"
          >
            <Close className="size-3.5" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 rounded-card border border-scheme-border bg-scheme-background p-3 shadow-lg">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) onSelectMonth(format(date, "yyyy-MM"));
              setOpen(false);
            }}
            disabled={(date) => !availableSet.has(format(date, "yyyy-MM"))}
            showOutsideDays
            classNames={{
              root: "w-fit",
              months: "flex flex-col gap-3",
              month: "relative flex flex-col gap-3",
              nav: "absolute inset-x-0 top-0 flex h-7 items-center justify-between",
              button_previous: "flex size-7 items-center justify-center rounded-button hover:bg-scheme-hover",
              button_next: "flex size-7 items-center justify-center rounded-button hover:bg-scheme-hover",
              month_caption: "flex h-7 items-center justify-center text-small font-semibold text-scheme-text",
              month_grid: "mt-2 w-full border-collapse",
              weekdays: "flex",
              weekday: "w-8 text-center text-tiny font-normal text-scheme-text-muted",
              week: "mt-1 flex w-full",
              day: "p-0 text-center",
              outside: "text-scheme-text-muted/40",
              disabled: "opacity-40",
              hidden: "invisible",
            }}
            components={{ DayButton: PublicDayButton }}
          />
        </div>
      )}
    </div>
  );
}
