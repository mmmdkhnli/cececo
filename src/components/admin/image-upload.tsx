"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { uploadImage, deleteImage } from "@/app/admin/upload-action";

export function ImageUpload({
  name,
  defaultValue,
  label,
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    if (url) fd.set("previousUrl", url);
    startTransition(async () => {
      const result = await uploadImage(fd);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setUrl(result.url);
      }
    });
  }

  function handleRemove() {
    if (!url) return;
    setError(null);
    const removedUrl = url;
    setUrl("");
    startTransition(async () => {
      const result = await deleteImage(removedUrl);
      if (result.error) {
        setError(result.error);
        setUrl(removedUrl);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-small font-semibold text-neutral-darkest">{label}</label>}
      {url && (
        <div className="flex items-start gap-3">
          <img
            src={url}
            alt=""
            className="h-24 w-auto max-w-full rounded-image border border-neutral-lighter bg-white object-contain p-1"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="rounded-button border border-red-violet-light px-3 py-1.5 text-small font-medium text-red-violet-dark transition-colors hover:bg-red-violet-lightest disabled:opacity-50"
          >
            Remove image
          </button>
        </div>
      )}
      <input type="hidden" name={name} value={url} />
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        disabled={isPending}
        className="text-small text-neutral-dark file:mr-3 file:rounded-button file:border-0 file:bg-neutral-lightest file:px-3 file:py-1.5 file:text-small file:font-medium"
      />
      {isPending && <p className="text-tiny text-neutral">Please wait...</p>}
      {error && <p className="text-tiny text-red-violet">{error}</p>}
    </div>
  );
}
