"use client";

import { useRef, useState, useTransition } from "react";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/admin/ui/attachment";

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

  const filename = url ? decodeURIComponent(url.split("/").pop() ?? "") : "";
  const state = error ? "error" : isPending ? "uploading" : url ? "done" : "idle";

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
      <Attachment
        state={state}
        className="w-full min-w-0"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        {url && preview === "image" ? (
          <AttachmentMedia variant="image">
            <img src={url} alt="" />
          </AttachmentMedia>
        ) : (
          <AttachmentMedia>{url ? <FileIcon /> : <UploadCloudIcon />}</AttachmentMedia>
        )}
        <AttachmentContent>
          <AttachmentTitle>{filename || "Click or drag a file to upload"}</AttachmentTitle>
          <AttachmentDescription>
            {error ?? (isPending ? "Uploading..." : url ? "Uploaded" : "No file selected")}
          </AttachmentDescription>
        </AttachmentContent>
        {url ? (
          <AttachmentActions>
            <AttachmentAction
              type="button"
              aria-label={`Remove ${filename}`}
              onClick={handleRemove}
              disabled={isPending}
            >
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        ) : (
          <AttachmentTrigger
            aria-label="Upload file"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
          />
        )}
      </Attachment>
    </div>
  );
}
