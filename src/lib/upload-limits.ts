export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_DOCUMENT_SIZE_BYTES = 30 * 1024 * 1024;

export function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return `${mb % 1 === 0 ? mb.toFixed(0) : mb.toFixed(1)}MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

export const UPLOAD_NETWORK_ERROR =
  "Upload failed — the connection was interrupted or the server rejected the request. Check your connection and try again with a smaller file if the problem continues.";
