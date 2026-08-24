"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";
import { MAX_IMAGE_SIZE_BYTES, MAX_DOCUMENT_SIZE_BYTES, formatFileSize } from "@/lib/upload-limits";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

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
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      error: `File is ${formatFileSize(file.size)} — maximum allowed size is ${formatFileSize(MAX_IMAGE_SIZE_BYTES)}.`,
    };
  }

  const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `${randomUUID()}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

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

const DOCUMENT_ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

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
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return {
      error: `File is ${formatFileSize(file.size)} — maximum allowed size is ${formatFileSize(MAX_DOCUMENT_SIZE_BYTES)}.`,
    };
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
