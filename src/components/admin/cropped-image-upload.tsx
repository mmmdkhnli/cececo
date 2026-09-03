"use client";

import { useRef, useState, useTransition } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { UploadCloudIcon, XIcon } from "lucide-react";
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
import { Button } from "@/components/admin/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog";
import { FormField } from "@/components/admin/ui/form-field";
import { getCroppedImageBlob } from "@/lib/crop-image";
import { deleteImage, uploadImage } from "@/app/admin/upload-action";
import { MAX_IMAGE_SIZE_BYTES, formatFileSize, UPLOAD_NETWORK_ERROR } from "@/lib/upload-limits";

export function CroppedImageUpload({
  name,
  defaultValue,
  label,
  aspect = 1,
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
  aspect?: number;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(
        `File is ${formatFileSize(file.size)} — maximum allowed size is ${formatFileSize(MAX_IMAGE_SIZE_BYTES)}.`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setCropSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function confirmCrop() {
    if (!cropSrc || !croppedAreaPixels) return;
    startTransition(async () => {
      try {
        const blob = await getCroppedImageBlob(cropSrc, croppedAreaPixels);
        const fd = new FormData();
        fd.set("file", blob, "photo.jpg");
        if (url) fd.set("previousUrl", url);
        const result = await uploadImage(fd);
        if (result.error) setError(result.error);
        else if (result.url) setUrl(result.url);
      } catch {
        setError(UPLOAD_NETWORK_ERROR);
      } finally {
        setCropSrc(null);
      }
    });
  }

  function handleRemove() {
    if (!url) return;
    setError(null);
    const removedUrl = url;
    setUrl("");
    startTransition(async () => {
      try {
        const result = await deleteImage(removedUrl);
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
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        disabled={isPending}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <Attachment state={state} className="w-full min-w-0">
        {url ? (
          <AttachmentMedia variant="image">
            <img src={url} alt="" />
          </AttachmentMedia>
        ) : (
          <AttachmentMedia>
            <UploadCloudIcon />
          </AttachmentMedia>
        )}
        <AttachmentContent>
          <AttachmentTitle>{filename || "Click or drag a photo to upload"}</AttachmentTitle>
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
          <AttachmentTrigger aria-label="Upload photo" onClick={() => inputRef.current?.click()} disabled={isPending} />
        )}
      </Attachment>

      <Dialog open={!!cropSrc} onOpenChange={(open) => !open && setCropSrc(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adjust the photo</DialogTitle>
          </DialogHeader>
          {cropSrc && (
            <div className="relative h-80 w-full overflow-hidden rounded-lg bg-muted">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
              />
            </div>
          )}
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-primary"
            aria-label="Zoom"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCropSrc(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmCrop} disabled={isPending}>
              {isPending ? "Uploading..." : "Save photo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return label ? <FormField label={label}>{body}</FormField> : body;
}
