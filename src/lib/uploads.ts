import "server-only";
import { unlink } from "fs/promises";
import path from "path";

/**
 * Deletes a file previously written by the admin upload action. Only ever
 * touches files under /public/uploads — seed/reference assets under
 * /public/images, /public/logo etc. are never deleted, even if a URL
 * pointing at one is passed in.
 */
export async function deleteUploadedFile(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", url);
  try {
    await unlink(filePath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Failed to delete uploaded file ${url}:`, err);
    }
  }
}

/** Deletes `nextUrl`'s predecessor when it's being replaced by a new upload. */
export async function replaceUploadedFile(previousUrl: string | null | undefined, nextUrl: string | null | undefined) {
  if (previousUrl && previousUrl !== nextUrl) {
    await deleteUploadedFile(previousUrl);
  }
}
