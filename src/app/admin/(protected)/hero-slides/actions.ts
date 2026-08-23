"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { heroSlide } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

function fromForm(formData: FormData) {
  const seeMoreEnabled = formData.get("seeMoreEnabled") === "on";
  return {
    backgroundImage: String(formData.get("backgroundImage") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0),
    seeMoreEnabled,
    pageSlug: seeMoreEnabled ? String(formData.get("pageSlug") ?? "").trim() || null : null,
    pageTitle: seeMoreEnabled ? String(formData.get("pageTitle") ?? "").trim() || null : null,
    pageBody: seeMoreEnabled ? String(formData.get("pageBody") ?? "").trim() || null : null,
  };
}

function revalidateHeroPages() {
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  revalidatePath("/highlights/[slug]", "page");
}

export async function createHeroSlide(formData: FormData) {
  await requireAdmin();
  await db.insert(heroSlide).values(fromForm(formData));
  revalidateHeroPages();
  redirect("/admin/hero-slides");
}

export async function updateHeroSlide(id: number, formData: FormData) {
  await requireAdmin();
  await db.update(heroSlide).set(fromForm(formData)).where(eq(heroSlide.id, id));
  revalidateHeroPages();
  redirect("/admin/hero-slides");
}

export async function deleteHeroSlide(id: number) {
  await requireAdmin();
  const [existing] = await db.select().from(heroSlide).where(eq(heroSlide.id, id));
  await db.delete(heroSlide).where(eq(heroSlide.id, id));
  if (existing) await deleteUploadedFile(existing.backgroundImage);
  revalidateHeroPages();
}
