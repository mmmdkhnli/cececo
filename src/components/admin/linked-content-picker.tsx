"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { SEARCH_TYPE_LABEL, type SearchResult } from "@/lib/search-types";

const DEBOUNCE_MS = 250;

export function LinkedContentPicker({
  defaultHref,
  defaultLabel,
}: {
  defaultHref?: string | null;
  defaultLabel?: string | null;
}) {
  const [selected, setSelected] = useState<{ href: string; label: string } | null>(
    defaultHref && defaultLabel ? { href: defaultHref, label: defaultLabel } : null,
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing stale results when the query is emptied, not derivable from render
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []))
        .catch((err) => {
          if ((err as Error).name !== "AbortError") throw err;
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="linkedHref" value={selected?.href ?? ""} />
      <input type="hidden" name="linkedLabel" value={selected?.label ?? ""} />

      {selected ? (
        <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{selected.label}</p>
            <p className="truncate text-xs text-muted-foreground">{selected.href}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setSelected(null)}>
            Change
          </Button>
        </div>
      ) : (
        <div ref={containerRef} className="relative">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search news, projects, opportunities, publications..."
          />
          {open && query.trim() && (
            <div className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-md">
              {results.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">No matches.</p>
              ) : (
                results.map((item) => (
                  <button
                    key={`${item.type}-${item.href}`}
                    type="button"
                    className="flex w-full flex-col items-start gap-0.5 p-3 text-left hover:bg-muted"
                    onClick={() => {
                      setSelected({ href: item.href, label: item.title });
                      setQuery("");
                      setResults([]);
                      setOpen(false);
                    }}
                  >
                    <span className="text-xs font-semibold text-muted-foreground">
                      {SEARCH_TYPE_LABEL[item.type]}
                    </span>
                    <span className="text-sm font-medium">{item.title}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
