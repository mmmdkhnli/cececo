"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { cn } from "@/lib/utils";

type UploadResult = { url?: string; error?: string };
type DeleteResult = { error?: string };

export function FileUpload({
  name,
  defaultValue,
  accept,
  uploadAction,
  deleteAction,
  preview = "image",
}: {
  name: string;
  defaultValue?: string | null;
  accept: string;
  uploadAction: (formData: FormData) => Promise<UploadResult>;
  deleteAction: (url: string) => Promise<DeleteResult>;
  preview?: "image" | "none";
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    if (url) fd.set("previousUrl", url);
    startTransition(async () => {
      const result = await uploadAction(fd);
      if (result.error) setError(result.error);
      else if (result.url) setUrl(result.url);
    });
  }

  function handleRemove() {
    if (!url) return;
    setError(null);
    const removedUrl = url;
    setUrl("");
    startTransition(async () => {
      const result = await deleteAction(removedUrl);
      if (result.error) {
        setError(result.error);
        setUrl(removedUrl);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={isPending}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {url ? (
        <Card className="flex items-center gap-3 p-3">
          {preview === "image" && (
            <img
              src={url}
              alt=""
              className="h-16 w-auto max-w-24 rounded-md border border-border object-contain p-1"
            />
          )}
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            {url.split("/").pop()}
          </span>
          <Button type="button" variant="ghost" size="icon" onClick={handleRemove} disabled={isPending}>
            <X className="size-4" />
          </Button>
        </Card>
      ) : (
        <Card
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-6 text-center transition-colors",
            dragOver ? "border-primary bg-accent" : "border-border",
          )}
        >
          {isPending ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          ) : (
            <UploadCloud className="size-6 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {isPending ? "Uploading..." : "Click or drag a file to upload"}
          </p>
        </Card>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
