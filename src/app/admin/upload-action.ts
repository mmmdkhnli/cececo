"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export async function uploadImage(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const session = await getSession();
  if (!session.userId) {
    return { error: "Session expired, please sign in again." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Only PNG, JPEG, WEBP, GIF, or SVG is allowed." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "File cannot be larger than 8MB." };
  }

  const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `${randomUUID()}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  // Replacing an existing upload — the old file is no longer referenced by
  // anything once this action returns, so it can go immediately.
  const previousUrl = formData.get("previousUrl");
  if (typeof previousUrl === "string" && previousUrl) {
    await deleteUploadedFile(previousUrl);
  }

  return { url: `/uploads/${filename}` };
}

export async function deleteImage(url: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session.userId) {
    return { error: "Session expired, please sign in again." };
  }
  await deleteUploadedFile(url);
  return {};
}

// Publications/Reports/Documents (Əmr 4 §1-3) — separate from uploadImage
// since PDFs/Word docs are a different type+size class (fileSizeBytes is
// returned so the admin form can auto-fill it, not have the admin type it).
const DOCUMENT_ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const DOCUMENT_MAX_SIZE_BYTES = 20 * 1024 * 1024;

export async function uploadDocument(
  formData: FormData,
): Promise<{ url?: string; sizeBytes?: number; error?: string }> {
  const session = await getSession();
  if (!session.userId) {
    return { error: "Session expired, please sign in again." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }
  if (!DOCUMENT_ALLOWED_TYPES.includes(file.type)) {
    return { error: "Only PDF, DOC, or DOCX is allowed." };
  }
  if (file.size > DOCUMENT_MAX_SIZE_BYTES) {
    return { error: "File cannot be larger than 20MB." };
  }

  const ext = path.extname(file.name) || ".pdf";
  const filename = `${randomUUID()}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  const previousUrl = formData.get("previousUrl");
  if (typeof previousUrl === "string" && previousUrl) {
    await deleteUploadedFile(previousUrl);
  }

  return { url: `/uploads/${filename}`, sizeBytes: file.size };
}

export async function deleteDocument(url: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session.userId) {
    return { error: "Session expired, please sign in again." };
  }
  await deleteUploadedFile(url);
  return {};
}
