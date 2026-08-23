"use client";

import { useState } from "react";
import { Close } from "relume-icons";
import type { MediaItemWithGallery } from "@/db/queries/media";

export function MediaDetail({ item }: { item: MediaItemWithGallery }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
      <div className="container max-w-4xl">
        <h1 className="mb-3 text-h1 font-bold">{item.title}</h1>
        {item.eventDate && (
          <p className="mb-8 text-medium text-neutral">
            {new Date(item.eventDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
        {item.description && (
          <p className="mb-10 text-medium text-neutral">{item.description}</p>
        )}

        {item.type === "video" && item.videoUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-image bg-neutral-darkest">
            <iframe
              src={item.videoUrl}
              title={item.title}
              className="size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {item.type === "photo_gallery" && (
          <>
            {item.galleryImages.length === 0 ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full rounded-image object-cover"
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {item.galleryImages.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setLightbox(img.image)}
                    className="aspect-square overflow-hidden rounded-image"
                  >
                    <img
                      src={img.image}
                      alt=""
                      className="size-full object-cover transition-transform hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {item.type === "press" && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full rounded-image object-cover"
          />
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-neutral-darkest/90 p-[5%]"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt=""
            className="max-h-full max-w-full rounded-image object-contain"
          />
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightbox(null)}
            className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Close className="size-5" />
          </button>
        </div>
      )}
    </section>
  );
}
