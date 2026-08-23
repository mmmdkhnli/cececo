"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { miscResource } from "@/db/schema";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

function fromForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    link: String(formData.get("link") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };
}

function revalidateMiscPages() {
  revalidatePath("/admin/resources-misc");
  revalidatePath("/resources/media");
}

export async function createMiscResource(formData: FormData) {
  await requireAdmin();
  await db.insert(miscResource).values(fromForm(formData));
  revalidateMiscPages();
  redirect("/admin/resources-misc");
}

export async function updateMiscResource(id: number, formData: FormData) {
  await requireAdmin();
  await db.update(miscResource).set(fromForm(formData)).where(eq(miscResource.id, id));
  revalidateMiscPages();
  redirect("/admin/resources-misc");
}

export async function deleteMiscResource(id: number) {
  await requireAdmin();
  await db.delete(miscResource).where(eq(miscResource.id, id));
  revalidateMiscPages();
}
