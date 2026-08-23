"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { publication } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";
import { resolvePublishedAt } from "@/lib/publish-date";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

function fromForm(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim() || null,
    coverImage: String(formData.get("coverImage") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    status: String(formData.get("status") ?? "draft") as "draft" | "published",
    publishedAt: resolvePublishedAt(formData),
    fileUrl: String(formData.get("fileUrl") ?? "").trim() || null,
    fileFormat: String(formData.get("fileFormat") ?? "").trim() || null,
    fileSizeBytes: Number(formData.get("fileSizeBytes") ?? 0) || null,
    language: String(formData.get("language") ?? "").trim() || null,
    pages: Number(formData.get("pages") ?? 0) || null,
    publishedBy: String(formData.get("publishedBy") ?? "").trim() || null,
  };
}

function revalidatePublicationPages() {
  revalidatePath("/admin/publications");
  revalidatePath("/resources/publications");
  revalidatePath("/resources/publications/[slug]", "page");
  revalidatePath("/resources/reports");
  revalidatePath("/resources/reports/[slug]", "page");
  revalidatePath("/resources/documents");
  revalidatePath("/resources/documents/[slug]", "page");
  revalidatePath("/search");
}

export async function createPublication(formData: FormData) {
  await requireAdmin();
  await db.insert(publication).values(fromForm(formData));
  revalidatePublicationPages();
  redirect("/admin/publications");
}

export async function updatePublication(id: number, formData: FormData) {
  await requireAdmin();
  await db
    .update(publication)
    .set(fromForm(formData))
    .where(eq(publication.id, id));
  revalidatePublicationPages();
  redirect("/admin/publications");
}

export async function deletePublication(id: number) {
  await requireAdmin();
  const [existing] = await db
    .select()
    .from(publication)
    .where(eq(publication.id, id));
  await db.delete(publication).where(eq(publication.id, id));
  if (existing) {
    await deleteUploadedFile(existing.coverImage);
    if (existing.fileUrl) await deleteUploadedFile(existing.fileUrl);
  }
  revalidatePublicationPages();
}
