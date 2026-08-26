"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { blogPost } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";
import { resolvePublishedAt } from "@/lib/publish-date";
import { resolveSlug } from "@/lib/slug";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

const SLUG_TARGET = {
  table: blogPost,
  slugColumn: blogPost.slug,
  idColumn: blogPost.id,
  fallback: "post",
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
  };
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  const values = fromForm(formData);
  const slug = await resolveSlug({ ...SLUG_TARGET, source: values.title });
  await db.insert(blogPost).values({ ...values, slug });
  revalidatePath("/admin/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: number, formData: FormData) {
  await requireAdmin();
  const values = fromForm(formData);
  const [existing] = await db.select().from(blogPost).where(eq(blogPost.id, id));
  const slug = await resolveSlug({
    ...SLUG_TARGET,
    source: values.title,
    current: existing ? { id, slug: existing.slug, source: existing.title } : null,
  });
  await db.update(blogPost).set({ ...values, slug }).where(eq(blogPost.id, id));
  revalidatePath("/admin/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: number) {
  await requireAdmin();
  const [existing] = await db.select().from(blogPost).where(eq(blogPost.id, id));
  await db.delete(blogPost).where(eq(blogPost.id, id));
  if (existing) await deleteUploadedFile(existing.coverImage);
  revalidatePath("/admin/blog");
  revalidatePath("/");
}
