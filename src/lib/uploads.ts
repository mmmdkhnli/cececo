import "server-only";
import { unlink } from "fs/promises";
import path from "path";

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

export async function replaceUploadedFile(previousUrl: string | null | undefined, nextUrl: string | null | undefined) {
  if (previousUrl && previousUrl !== nextUrl) {
    await deleteUploadedFile(previousUrl);
  }
}
