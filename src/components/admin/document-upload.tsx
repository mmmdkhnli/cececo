"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";

import { uploadDocument, deleteDocument } from "@/app/admin/upload-action";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { FormField } from "@/components/admin/ui/form-field";

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
  const inputRef = useRef<HTMLInputElement>(null);

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

  const body = (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={url} />
      <input type="hidden" name={sizeFieldName} value={sizeBytes} />
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.doc,.docx"
        className="sr-only"
        disabled={isPending}
        onChange={handleFileChange}
      />
      {url ? (
        <Card className="flex items-center gap-3 p-3">
          <FileText className="size-5 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{url.split("/").pop()}</span>
          {sizeBytes > 0 && (
            <span className="shrink-0 text-xs text-muted-foreground">{formatSize(sizeBytes)}</span>
          )}
          <Button type="button" variant="ghost" size="icon" onClick={handleRemove} disabled={isPending}>
            <X className="size-4" />
          </Button>
        </Card>
      ) : (
        <Card
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary"
        >
          {isPending ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          ) : (
            <UploadCloud className="size-6 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {isPending ? "Uploading..." : "Click to upload a PDF, DOC, or DOCX"}
          </p>
        </Card>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );

  return label ? <FormField label={label}>{body}</FormField> : body;
}
