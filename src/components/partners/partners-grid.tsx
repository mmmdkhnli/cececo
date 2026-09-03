"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RichText } from "@/components/shared/rich-text";
import { CalendarToday, ImportContacts, Layers, Mail } from "relume-icons";
import type { SectionRow, PartnerRow, PartnerCategory } from "@/db/schema";

const CATEGORY_LABEL: Record<PartnerCategory, string> = {
  institutional_strategic: "Institutional & Strategic Partners",
  knowledge_development: "Knowledge & Development Partners",
  events_initiatives: "Events & Initiatives",
};

const CATEGORY_ICON: Record<
  PartnerCategory,
  React.ComponentType<{ className?: string }>
> = {
  institutional_strategic: Layers,
  knowledge_development: ImportContacts,
  events_initiatives: CalendarToday,
};

const CATEGORY_ORDER: PartnerCategory[] = [
  "institutional_strategic",
  "knowledge_development",
  "events_initiatives",
];

const FILTERS = [
  "All Partners",
  ...CATEGORY_ORDER.map((c) => CATEGORY_LABEL[c]),
] as const;

function PartnerCard({ partner }: { partner: PartnerRow }) {
  return (
    <Card className="flex h-full flex-col gap-4 p-6">
      <div className="flex h-12 items-center">
        {partner.logoImage && (
          <img
            src={partner.logoImage}
            alt={partner.name}
            className="max-h-12 max-w-full object-contain"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-medium font-bold text-scheme-text">
          {partner.name}
        </h3>
        {partner.statusLabel && (
          <p className="text-small font-semibold text-scheme-accent">
            {partner.statusLabel}
          </p>
        )}
        {partner.badge && (
          <Badge variant="outline" className="mt-1 w-fit">
            {partner.badge}
          </Badge>
        )}
      </div>
      {partner.description && (
        <p className="text-small text-scheme-text-muted">{partner.description}</p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
        {partner.viewMoreUrl && (
          <Button asChild variant="link" size="link" className="text-small">
            <Link href={partner.viewMoreUrl}>View More →</Link>
          </Button>
        )}
        {partner.link && (
          <a
            href={partner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-small font-semibold text-scheme-text underline-offset-4 hover:underline"
          >
            Visit Website ↗
          </a>
        )}
      </div>
    </Card>
  );
}

function CategoryGroup({
  category,
  partners,
}: {
  category: PartnerCategory;
  partners: PartnerRow[];
}) {
  if (partners.length === 0) return null;
  const Icon = CATEGORY_ICON[category];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Icon className="size-6 text-scheme-accent" />
        <h3 className="text-h5 font-bold text-scheme-text">
          {CATEGORY_LABEL[category]}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) => (
          <PartnerCard key={p.id} partner={p} />
        ))}
      </div>
    </div>
  );
}

export function PartnersGrid({
  section,
  partners,
  scheme,
}: {
  section: SectionRow;
  partners: PartnerRow[];
  scheme: string;
}) {
  const [filter, setFilter] =
    useState<(typeof FILTERS)[number]>("All Partners");
  const activeCategory =
    CATEGORY_ORDER.find((c) => CATEGORY_LABEL[c] === filter) ?? null;

  return (
    <section
      className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} logo-alt`}
    >
      <div className="container">
        <div className="mb-10 max-w-lg md:mb-12">
          <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
          <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
          <RichText html={section.subtitle} className="text-medium" />
        </div>

        <div className="mb-12 flex flex-wrap gap-2 md:mb-16">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-button px-4 py-2 text-small font-medium transition-colors ${
                filter === f
                  ? "bg-mountain-meadow text-white"
                  : "border border-scheme-border text-scheme-text hover:bg-scheme-hover"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {partners.length === 0 ? (
          <p className="text-center text-medium text-scheme-text-muted">
            No partners added yet.
          </p>
        ) : activeCategory ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners
              .filter((p) => p.category === activeCategory)
              .map((p) => (
                <PartnerCard key={p.id} partner={p} />
              ))}
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {CATEGORY_ORDER.map((category) => (
              <CategoryGroup
                key={category}
                category={category}
                partners={partners.filter((p) => p.category === category)}
              />
            ))}
          </div>
        )}

        <Card className="mt-16 flex flex-col items-center gap-4 p-8 text-center md:mt-20">
          <Mail className="size-8 text-scheme-accent" />
          <h3 className="text-h5 font-bold text-scheme-text">
            Interested in partnering with CECECO?
          </h3>
          <p className="max-w-md text-medium text-scheme-text-muted">
            We are always open to new partnerships for a cleaner and sustainable
            future.
          </p>
          <Button asChild variant="secondary">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}
