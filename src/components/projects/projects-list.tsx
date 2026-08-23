"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProjectRow } from "@/db/schema";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  completed: "Completed",
};

const FILTERS = ["All", "Ongoing", "Upcoming", "Completed"] as const;

function formatPeriod(start: Date | string | null, end: Date | string | null) {
  const fmt = (d: Date | string) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return fmt(start);
  if (end) return fmt(end);
  return null;
}

export function ProjectsList({ projects }: { projects: ProjectRow[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => STATUS_LABEL[p.status] === filter);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
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
            {f === "All" ? "All Projects" : f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-medium text-neutral">No projects in this category yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {visible.map((item) => {
            const period = formatPeriod(item.periodStart, item.periodEnd);
            return (
              <Card key={item.id} className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
                {item.coverImage && (
                  <img
                    src={item.coverImage}
                    alt=""
                    className="aspect-video w-full shrink-0 rounded-image object-cover md:w-64"
                  />
                )}
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>{STATUS_LABEL[item.status]}</Badge>
                    {period && <p className="text-small text-neutral">{period}</p>}
                    {item.applicationsOpen && item.applicationDeadline && (
                      <p className="text-small text-neutral">
                        Application deadline: {new Date(item.applicationDeadline).toLocaleDateString("en-US")}
                      </p>
                    )}
                  </div>
                  <h2 className="text-h4 font-bold">{item.title}</h2>
                  <p>{item.shortDescription}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button
                      asChild
                      title="View Details"
                      variant="link"
                      size="link"
                      className="flex items-center gap-x-2"
                    >
                      <Link href={`/projects/${item.slug}`}>View Details</Link>
                    </Button>
                    {item.applicationsOpen && item.applyUrl && (
                      <Button asChild variant="secondary">
                        <a href={item.applyUrl} target="_blank" rel="noopener noreferrer">
                          Apply Now
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
