"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PlayCircle, Search } from "relume-icons";
import type { MediaItemRow, MediaType } from "@/db/schema";

const TYPE_LABEL: Record<MediaType, string> = {
  photo_gallery: "Photo Gallery",
  video: "Video",
  press: "Press Material",
};

const FILTERS = ["All", "Photos", "Videos", "Press Materials"] as const;
const FILTER_TYPE: Record<(typeof FILTERS)[number], MediaType | null> = {
  All: null,
  Photos: "photo_gallery",
  Videos: "video",
  "Press Materials": "press",
};

export function MediaList({ items }: { items: MediaItemRow[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const type = FILTER_TYPE[filter];
  const q = query.trim().toLowerCase();
  const visible = items.filter((item) => {
    if (type && item.type !== type) return false;
    if (q && !item.title.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-button px-4 py-2 text-small font-medium transition-colors ${
                filter === f
                  ? "bg-mountain-meadow text-white"
                  : "border border-scheme-border text-scheme-text hover:bg-neutral-lightest"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-button border border-scheme-border px-4 py-2.5 sm:w-64">
          <Search className="size-4 shrink-0 text-neutral" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search media..."
            className="w-full bg-transparent text-small text-scheme-text placeholder:text-neutral focus-visible:outline-none"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-medium text-neutral">No media yet.</p>
      ) : visible.length === 0 ? (
        <p className="text-center text-medium text-neutral">
          No results found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <Link key={item.id} href={`/resources/media/${item.slug}`}>
              <Card className="flex h-full flex-col">
                <div className="relative aspect-video w-full">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="size-full object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-darkest/30">
                      <PlayCircle className="size-12 text-white" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-badge bg-neutral-darkest/70 px-2 py-1 text-tiny font-semibold text-white">
                    {TYPE_LABEL[item.type]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-5">
                  <h2 className="text-medium font-bold text-neutral-darkest">
                    {item.title}
                  </h2>
                  {item.eventDate && (
                    <p className="text-small text-neutral">
                      {new Date(item.eventDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
