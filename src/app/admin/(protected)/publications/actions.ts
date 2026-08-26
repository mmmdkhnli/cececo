"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { publication } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";
import { resolvePublishedAt } from "@/lib/publish-date";
import { resolveSlug } from "@/lib/slug";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

const SLUG_TARGET = {
  table: publication,
  slugColumn: publication.slug,
  idColumn: publication.id,
  fallback: "publication",
};

function fromForm(formData: FormData) {
  return {
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
  const values = fromForm(formData);
  const slug = await resolveSlug({ ...SLUG_TARGET, source: values.title });
  await db.insert(publication).values({ ...values, slug });
  revalidatePublicationPages();
  redirect("/admin/publications");
}

export async function updatePublication(id: number, formData: FormData) {
  await requireAdmin();
  const values = fromForm(formData);
  const [existing] = await db.select().from(publication).where(eq(publication.id, id));
  const slug = await resolveSlug({
    ...SLUG_TARGET,
    source: values.title,
    current: existing ? { id, slug: existing.slug, source: existing.title } : null,
  });
  await db
    .update(publication)
    .set({ ...values, slug })
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
