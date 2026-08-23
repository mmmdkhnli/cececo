"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { uploadDocument, deleteDocument } from "@/app/admin/upload-action";

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function DocumentUpload({
  name,
  sizeFieldName,
  defaultValue,
  defaultSizeBytes,
  label,
}: {
  name: string;
  sizeFieldName: string;
  defaultValue?: string | null;
  defaultSizeBytes?: number | null;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [sizeBytes, setSizeBytes] = useState(defaultSizeBytes ?? 0);
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
      const result = await uploadDocument(fd);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setUrl(result.url);
        setSizeBytes(result.sizeBytes ?? 0);
      }
    });
  }

  function handleRemove() {
    if (!url) return;
    setError(null);
    const removedUrl = url;
    setUrl("");
    setSizeBytes(0);
    startTransition(async () => {
      const result = await deleteDocument(removedUrl);
      if (result.error) {
        setError(result.error);
        setUrl(removedUrl);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-small font-semibold text-neutral-darkest">
          {label}
        </label>
      )}
      {url && (
        <div className="flex items-center gap-3 rounded-button border border-neutral-lighter bg-neutral-lightest px-3 py-2">
          <span className="truncate text-small font-medium text-neutral-darkest">
            {url.split("/").pop()}
          </span>
          {sizeBytes > 0 && (
            <span className="shrink-0 text-tiny text-neutral">
              {formatSize(sizeBytes)}
            </span>
          )}
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="ml-auto shrink-0 rounded-button border border-red-violet-light px-3 py-1.5 text-small font-medium text-red-violet-dark transition-colors hover:bg-red-violet-lightest disabled:opacity-50"
          >
            Remove file
          </button>
        </div>
      )}
      <input type="hidden" name={name} value={url} />
      <input type="hidden" name={sizeFieldName} value={sizeBytes} />
      <input
        type="file"
        accept="application/pdf,.doc,.docx"
        onChange={handleFileChange}
        disabled={isPending}
        className="text-small text-neutral-dark file:mr-3 file:rounded-button file:border-0 file:bg-neutral-lightest file:px-3 file:py-1.5 file:text-small file:font-medium"
      />
      {isPending && <p className="text-tiny text-neutral">Please wait...</p>}
      {error && <p className="text-tiny text-red-violet">{error}</p>}
    </div>
  );
}
