"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { heroSlide, type HeroSlideRow } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";
import { resolveSlug } from "@/lib/slug";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

const SLUG_TARGET = {
  table: heroSlide,
  slugColumn: heroSlide.pageSlug,
  idColumn: heroSlide.id,
  fallback: "highlight",
};

function fromForm(formData: FormData) {
  const seeMoreEnabled = formData.get("seeMoreEnabled") === "on";
  const isLink = seeMoreEnabled && formData.get("seeMoreMode") === "link";
  const isCustom = seeMoreEnabled && !isLink;
  return {
    backgroundImage: String(formData.get("backgroundImage") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0),
    seeMoreEnabled,
    pageTitle: isCustom ? String(formData.get("pageTitle") ?? "").trim() || null : null,
    pageBody: isCustom ? String(formData.get("pageBody") ?? "").trim() || null : null,
    linkedHref: isLink ? String(formData.get("linkedHref") ?? "").trim() || null : null,
    linkedLabel: isLink ? String(formData.get("linkedLabel") ?? "").trim() || null : null,
  };
}

/**
 * "See more" targets either a linked existing page (linkedHref, picked from site search) or a
 * standalone /highlights page generated from this slide (addressed by its own title, falling back
 * to the slide title). Switching modes clears whichever fields the other mode owns.
 */
async function withPageSlug(formData: FormData, existing?: HeroSlideRow | null) {
  const values = fromForm(formData);
  if (!values.seeMoreEnabled || values.linkedHref) return { ...values, pageSlug: null };

  const pageSlug = await resolveSlug({
    ...SLUG_TARGET,
    source: values.pageTitle || values.title,
    current: existing?.pageSlug
      ? { id: existing.id, slug: existing.pageSlug, source: existing.pageTitle || existing.title }
      : null,
  });
  return { ...values, pageSlug };
}

function revalidateHeroPages() {
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
  revalidatePath("/highlights/[slug]", "page");
}

export async function createHeroSlide(formData: FormData) {
  await requireAdmin();
  await db.insert(heroSlide).values(await withPageSlug(formData));
  revalidateHeroPages();
  redirect("/admin/hero-slides");
}

export async function updateHeroSlide(id: number, formData: FormData) {
  await requireAdmin();
  const [existing] = await db.select().from(heroSlide).where(eq(heroSlide.id, id));
  await db
    .update(heroSlide)
    .set(await withPageSlug(formData, existing ?? null))
    .where(eq(heroSlide.id, id));
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
