"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarToday, Close } from "relume-icons";

function monthLabel(month: string) {
  const [year, mo] = month.split("-").map(Number);
  return new Date(year, mo - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
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
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing a previous search when the dropdown reopens, not derivable from render
    setQuery("");
    inputRef.current?.focus();
  }, [open]);

  const q = query.trim().toLowerCase();
  const options = q ? availableMonths.filter((m) => monthLabel(m).toLowerCase().includes(q)) : availableMonths;

  function select(next: string | null) {
    onSelectMonth(next);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-button border border-scheme-border px-4 py-2.5 text-small text-scheme-text hover:bg-scheme-hover"
      >
        <CalendarToday className="size-4 text-scheme-text-muted" />
        {month ? monthLabel(month) : "All dates"}
        {month && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date filter"
            onClick={(e) => {
              e.stopPropagation();
              select(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                select(null);
              }
            }}
            className="ml-1 text-scheme-text-muted hover:text-scheme-text"
          >
            <Close className="size-3.5" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-64 rounded-card border border-scheme-border bg-scheme-background shadow-lg">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search month, e.g. September"
            className="w-full border-b border-scheme-border bg-transparent px-4 py-2.5 text-small text-scheme-text placeholder:text-scheme-text-muted focus-visible:outline-none"
          />
          <div className="max-h-64 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => select(null)}
              className={`block w-full px-4 py-2 text-left text-small hover:bg-scheme-hover ${
                month === null ? "font-semibold text-scheme-text" : "text-scheme-text-muted"
              }`}
            >
              All dates
            </button>
            {options.length === 0 ? (
              <p className="px-4 py-2 text-small text-scheme-text-muted">No matching month.</p>
            ) : (
              options.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => select(m)}
                  className={`block w-full px-4 py-2 text-left text-small hover:bg-scheme-hover ${
                    month === m ? "font-semibold text-scheme-text" : "text-scheme-text-muted"
                  }`}
                >
                  {monthLabel(m)}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
