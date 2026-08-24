"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { FileTextIcon, UploadCloudIcon, XIcon } from "lucide-react";

import { uploadDocument, deleteDocument } from "@/app/admin/upload-action";
import { MAX_DOCUMENT_SIZE_BYTES, formatFileSize, UPLOAD_NETWORK_ERROR } from "@/lib/upload-limits";
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
import { FormField } from "@/components/admin/ui/form-field";

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
    if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      setError(`File is ${formatFileSize(file.size)} — maximum allowed size is ${formatFileSize(MAX_DOCUMENT_SIZE_BYTES)}.`);
      return;
    }
    const fd = new FormData();
    fd.set("file", file);
    if (url) fd.set("previousUrl", url);
    startTransition(async () => {
      try {
        const result = await uploadDocument(fd);
        if (result.error) {
          setError(result.error);
        } else if (result.url) {
          setUrl(result.url);
          setSizeBytes(result.sizeBytes ?? 0);
        }
      } catch {
        setError(UPLOAD_NETWORK_ERROR);
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
      try {
        const result = await deleteDocument(removedUrl);
        if (result.error) {
          setError(result.error);
          setUrl(removedUrl);
        }
      } catch {
        setError(UPLOAD_NETWORK_ERROR);
        setUrl(removedUrl);
      }
    });
  }

  const filename = url ? decodeURIComponent(url.split("/").pop() ?? "") : "";
  const state = error ? "error" : isPending ? "uploading" : url ? "done" : "idle";

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
      <Attachment state={state} className="w-full min-w-0">
        <AttachmentMedia>{url ? <FileTextIcon /> : <UploadCloudIcon />}</AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{filename || "Click to upload a PDF, DOC, or DOCX"}</AttachmentTitle>
          <AttachmentDescription>
            {error ?? (isPending ? "Uploading..." : sizeBytes > 0 ? formatFileSize(sizeBytes) : url ? "Uploaded" : "No file selected")}
          </AttachmentDescription>
        </AttachmentContent>
        {url ? (
          <AttachmentActions>
            <AttachmentAction type="button" aria-label={`Remove ${filename}`} onClick={handleRemove} disabled={isPending}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        ) : (
          <AttachmentTrigger aria-label="Upload document" onClick={() => inputRef.current?.click()} disabled={isPending} />
        )}
      </Attachment>
    </div>
  );

  return label ? <FormField label={label}>{body}</FormField> : body;
}
