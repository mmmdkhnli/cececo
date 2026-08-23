"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { blogPost } from "@/db/schema";
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
  };
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  await db.insert(blogPost).values(fromForm(formData));
  revalidatePath("/admin/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: number, formData: FormData) {
  await requireAdmin();
  await db.update(blogPost).set(fromForm(formData)).where(eq(blogPost.id, id));
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
