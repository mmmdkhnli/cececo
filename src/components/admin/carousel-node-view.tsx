"use client";

import { useRef, useState } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { ImageIcon, Loader2, XIcon } from "lucide-react";
import { uploadImage } from "@/app/admin/upload-action";
import { MAX_IMAGE_SIZE_BYTES, formatFileSize } from "@/lib/upload-limits";

const WIDTH_OPTIONS = [
  { value: "50", label: "50%" },
  { value: "75", label: "75%" },
  { value: "100", label: "Full width" },
] as const;

export function CarouselNodeView({ node, updateAttributes }: NodeViewProps) {
  const images: string[] = node.attrs.images ?? [];
  const width: string = node.attrs.width ?? "100";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    const selected = Array.from(files ?? []);
    if (selected.length === 0) return;
    setError(null);

    const oversized = selected.find((f) => f.size > MAX_IMAGE_SIZE_BYTES);
    if (oversized) {
      setError(`"${oversized.name}" is ${formatFileSize(oversized.size)} — maximum allowed size is ${formatFileSize(MAX_IMAGE_SIZE_BYTES)}.`);
      return;
    }

    setPending(true);
    try {
      const uploaded: string[] = [];
      for (const file of selected) {
        const fd = new FormData();
        fd.set("file", file);
        const result = await uploadImage(fd);
        if (result.error) {
          setError(result.error);
          break;
        }
        if (result.url) uploaded.push(result.url);
      }
      if (uploaded.length > 0) {
        updateAttributes({ images: [...images, ...uploaded] });
      }
    } finally {
      setPending(false);
    }
  }

  function removeImage(url: string) {
    updateAttributes({ images: images.filter((src) => src !== url) });
  }

  return (
    <NodeViewWrapper className="content-carousel-editor" contentEditable={false}>
      <div className="rounded-lg border border-dashed border-input p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-muted-foreground">
            Carousel · {images.length} image{images.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border border-input">
              {WIDTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateAttributes({ width: opt.value })}
                  className={`px-2 py-1 text-xs font-medium ${
                    width === opt.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={pending}
              className="flex items-center gap-1.5 rounded-md border border-input px-2 py-1 text-xs font-medium hover:bg-muted disabled:opacity-50"
            >
              {pending ? <Loader2 className="size-3.5 animate-spin" /> : <ImageIcon className="size-3.5" />}
              Add images
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {error && <p className="mb-2 text-xs text-destructive">{error}</p>}

        {images.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">No images yet — add some above.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {images.map((src) => (
              <div key={src} className="group relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                <img src={src} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => removeImage(src)}
                  className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
