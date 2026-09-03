"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function openLightbox(images: HTMLImageElement[], startIndex: number) {
  let index = startIndex;
  const overlay = document.createElement("div");
  overlay.className = "content-lightbox-overlay";

  const img = document.createElement("img");
  img.className = "content-lightbox-image";
  img.src = images[index].currentSrc || images[index].src;
  img.alt = "";
  overlay.appendChild(img);

  function show(i: number) {
    index = (i + images.length) % images.length;
    img.src = images[index].currentSrc || images[index].src;
  }

  function close() {
    overlay.remove();
    document.body.classList.remove("has-lightbox-open");
    document.removeEventListener("keydown", onKeyDown);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") show(index + 1);
    else if (e.key === "ArrowLeft") show(index - 1);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.className = "content-lightbox-close";
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", close);
  overlay.appendChild(closeBtn);

  if (images.length > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Previous image");
    prevBtn.className = "content-lightbox-nav content-lightbox-prev";
    prevBtn.textContent = "‹";
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      show(index - 1);
    });

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Next image");
    nextBtn.className = "content-lightbox-nav content-lightbox-next";
    nextBtn.textContent = "›";
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      show(index + 1);
    });

    overlay.appendChild(prevBtn);
    overlay.appendChild(nextBtn);
  }

  document.addEventListener("keydown", onKeyDown);
  document.body.classList.add("has-lightbox-open");
  document.body.appendChild(overlay);
}

/**
 * Wires up prev/next scrolling and a full-size lightbox for any `.content-carousel` blocks in the
 * HTML. Structural state (does a `.content-carousel-track` already exist?) decides whether the DOM
 * needs restructuring, rather than a marker attribute — React Strict Mode runs effects (and their
 * cleanup) twice in dev, which would otherwise mark a carousel "done" and skip re-attaching listeners
 * the cleanup had just removed.
 */
function enhanceCarousels(container: HTMLElement) {
  const carousels = container.querySelectorAll<HTMLDivElement>(".content-carousel");
  const cleanups: Array<() => void> = [];

  carousels.forEach((el) => {
    let track = el.querySelector<HTMLElement>(".content-carousel-track");
    let images: HTMLImageElement[];

    if (!track) {
      images = Array.from(el.querySelectorAll("img"));
      if (images.length === 0) return;
      track = document.createElement("div");
      track.className = "content-carousel-track";
      images.forEach((img) => track!.appendChild(img));
      el.innerHTML = "";
      el.appendChild(track);
    } else {
      images = Array.from(track.querySelectorAll("img"));
      if (images.length === 0) return;
    }

    el.querySelectorAll(".content-carousel-nav").forEach((btn) => btn.remove());

    images.forEach((img) => {
      const onClick = () => openLightbox(images, images.indexOf(img));
      img.addEventListener("click", onClick);
      cleanups.push(() => img.removeEventListener("click", onClick));
    });

    if (images.length > 1) {
      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.setAttribute("aria-label", "Previous image");
      prevBtn.className = "content-carousel-nav content-carousel-prev";
      prevBtn.textContent = "‹";
      const onPrev = () => track.scrollBy({ left: -track.clientWidth, behavior: "smooth" });
      prevBtn.addEventListener("click", onPrev);

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.setAttribute("aria-label", "Next image");
      nextBtn.className = "content-carousel-nav content-carousel-next";
      nextBtn.textContent = "›";
      const onNext = () => track.scrollBy({ left: track.clientWidth, behavior: "smooth" });
      nextBtn.addEventListener("click", onNext);

      cleanups.push(() => prevBtn.removeEventListener("click", onPrev), () => nextBtn.removeEventListener("click", onNext));
      el.appendChild(prevBtn);
      el.appendChild(nextBtn);
    }
  });

  return () => cleanups.forEach((fn) => fn());
}

export function RichText({
  html,
  className,
  ...rest
}: { html: string | null | undefined; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enhanceCarousels(ref.current);
  }, [html]);

  if (!html) return null;
  return (
    <div ref={ref} className={cn("rich-text", className)} dangerouslySetInnerHTML={{ __html: html }} {...rest} />
  );
}
