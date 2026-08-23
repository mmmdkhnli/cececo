"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { HeroSlideRow } from "@/db/schema";

const AUTOPLAY_MS = 6000;

export function HeroCarousel({ slides }: { slides: HeroSlideRow[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;
  const slide = slides[index];

  return (
    <section className="relative h-[70vh] min-h-[520px] overflow-hidden lg:h-screen">
      {slides.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {s.backgroundImage && (
            <img src={s.backgroundImage} alt="" className="size-full object-cover" />
          )}
          <div className="absolute inset-0 bg-neutral-darkest/50" />
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-[5%] text-center">
        <h1 className="mb-5 max-w-3xl text-h1 font-bold text-white md:mb-6">{slide.title}</h1>
        {slide.description && (
          <p className="max-w-2xl text-medium text-white">{slide.description}</p>
        )}
        {slide.seeMoreEnabled && slide.pageSlug && (
          <div className="mt-8">
            <Button asChild variant="alternate">
              <Link href={`/highlights/${slide.pageSlug}`}>See more</Link>
            </Button>
          </div>
        )}
      </div>

      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
