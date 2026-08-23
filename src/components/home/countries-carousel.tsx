"use client";

import { useRef } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RichText } from "@/components/shared/rich-text";
import { ChevronLeft, ChevronRight } from "relume-icons";
import type { SectionRow, MemberStateRow } from "@/db/schema";

export function CountriesCarousel({
  section,
  countries,
  scheme,
}: {
  section: SectionRow;
  countries: MemberStateRow[];
  scheme: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (countries.length === 0) return null;

  function scrollByCard(direction: 1 | -1) {
    trackRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} badge-alt`}>
      <div className="container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div className="max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
            <h2 className="mb-5 text-h2 font-bold md:mb-0">
              {section.heading}
            </h2>
            <RichText html={section.subtitle} className="text-medium" />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByCard(-1)}
              className="flex size-10 items-center justify-center rounded-button border border-scheme-border hover:bg-neutral-lightest"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByCard(1)}
              className="flex size-10 items-center justify-center rounded-button border border-scheme-border hover:bg-neutral-lightest"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
        >
          {countries.map((country) => (
            <Card key={country.id} className="w-72 shrink-0 snap-start p-6">
              <img
                src={country.flagImage}
                alt={`${country.name} flag`}
                className="mb-5 aspect-video w-full rounded-image object-cover"
              />
              <h3 className="mb-2 text-medium font-bold text-neutral-darkest">
                {country.name}
              </h3>
              {country.description && (
                <p className="mb-5 line-clamp-3 text-small text-neutral">
                  {country.description}
                </p>
              )}
              <Link
                href={`/countries/${country.slug}`}
                className="text-small font-semibold text-mountain-meadow-dark hover:underline"
              >
                See More →
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
