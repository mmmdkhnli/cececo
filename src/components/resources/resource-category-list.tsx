"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Search } from "relume-icons";
import type { PublicationRow } from "@/db/schema";

function formatSize(bytes: number | null) {
  if (!bytes) return null;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function ResourceCategoryList({
  items,
  basePath,
  emptyMessage,
}: {
  items: PublicationRow[];
  basePath: string;
  emptyMessage: string;
}) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = q
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q),
      )
    : items;

  return (
    <div>
      <div className="mb-8 flex items-center gap-3 rounded-button border border-scheme-border px-4 py-2.5">
        <Search className="size-5 shrink-0 text-neutral" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent text-medium text-scheme-text placeholder:text-neutral focus-visible:outline-none"
        />
      </div>

      {items.length === 0 ? (
        <p className="text-center text-medium text-neutral">{emptyMessage}</p>
      ) : visible.length === 0 ? (
        <p className="text-center text-medium text-neutral">
          No results found for &quot;{query.trim()}&quot;.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-scheme-border rounded-card border border-scheme-border">
          {visible.map((item) => (
            <Link
              key={item.id}
              href={`${basePath}/${item.slug}`}
              className="flex flex-col gap-3 p-5 transition-colors hover:bg-neutral-lightest sm:flex-row sm:items-center sm:justify-between md:p-6"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{item.category}</Badge>
                  {item.publishedAt && (
                    <p className="text-small text-neutral">
                      {new Date(item.publishedAt).toLocaleDateString("en-US")}
                    </p>
                  )}
                </div>
                <h2 className="text-medium font-bold text-scheme-text">
                  {item.title}
                </h2>
                <p className="text-small text-neutral">{item.excerpt}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-small text-neutral sm:flex-col sm:items-end sm:gap-1">
                {(item.fileFormat || formatSize(item.fileSizeBytes)) && (
                  <p className="font-semibold text-scheme-text">
                    {[item.fileFormat, formatSize(item.fileSizeBytes)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                <p className="font-semibold text-mountain-meadow-dark">
                  View Details →
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
