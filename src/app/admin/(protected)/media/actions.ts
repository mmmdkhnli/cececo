"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { mediaItem, mediaGalleryImage, type MediaType } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim() || null;
}

function fromForm(formData: FormData) {
  const eventDateRaw = str(formData, "eventDate");
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    type: String(formData.get("type") ?? "photo_gallery") as MediaType,
    description: str(formData, "description"),
    thumbnail: String(formData.get("thumbnail") ?? "").trim(),
    eventDate: eventDateRaw ? new Date(eventDateRaw) : null,
    videoUrl: str(formData, "videoUrl"),
    status: String(formData.get("status") ?? "draft") as "draft" | "published",
    order: Number(formData.get("order") ?? 0),
  };
}

function revalidateMediaPages() {
  revalidatePath("/admin/media");
  revalidatePath("/resources/media");
  revalidatePath("/resources/media/[slug]", "page");
  revalidatePath("/search");
}

export async function createMediaItem(formData: FormData) {
  await requireAdmin();
  await db.insert(mediaItem).values(fromForm(formData));
  revalidateMediaPages();
  redirect("/admin/media");
}

export async function updateMediaItem(id: number, formData: FormData) {
  await requireAdmin();
  await db
    .update(mediaItem)
    .set(fromForm(formData))
    .where(eq(mediaItem.id, id));
  revalidateMediaPages();
  redirect("/admin/media");
}

export async function deleteMediaItem(id: number) {
  await requireAdmin();
  const [existing] = await db
    .select()
    .from(mediaItem)
    .where(eq(mediaItem.id, id));
  const images = await db
    .select()
    .from(mediaGalleryImage)
    .where(eq(mediaGalleryImage.mediaItemId, id));
  await db
    .delete(mediaGalleryImage)
    .where(eq(mediaGalleryImage.mediaItemId, id));
  await db.delete(mediaItem).where(eq(mediaItem.id, id));
  if (existing) await deleteUploadedFile(existing.thumbnail);
  for (const img of images) await deleteUploadedFile(img.image);
  revalidateMediaPages();
}

// --- Gallery images (type="photo_gallery") ---------------------------------

export async function addGalleryImage(mediaItemId: number, formData: FormData) {
  await requireAdmin();
  const image = str(formData, "image");
  if (!image) return;
  await db
    .insert(mediaGalleryImage)
    .values({ mediaItemId, image, order: Number(formData.get("order") ?? 0) });
  revalidateMediaPages();
}

export async function deleteGalleryImage(id: number) {
  await requireAdmin();
  const [existing] = await db
    .select()
    .from(mediaGalleryImage)
    .where(eq(mediaGalleryImage.id, id));
  await db.delete(mediaGalleryImage).where(eq(mediaGalleryImage.id, id));
  if (existing) await deleteUploadedFile(existing.image);
  revalidateMediaPages();
}
