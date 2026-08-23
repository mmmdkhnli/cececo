"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { section, sectionImage, sectionTab, sectionBullet, SCHEME_VALUES, type SchemeKey } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim() || null;
}

function revalidateForPage(pageSlug: string) {
  revalidatePath(`/admin/pages/${pageSlug}`);
  revalidatePath("/", "layout");
  revalidatePath(`/${pageSlug === "home" ? "" : pageSlug}`);
}

// --- Section (scalar fields) --------------------------------------------

export type UpdateSectionState = { error?: string; success?: boolean };

export async function updateSection(
  id: number,
  pageSlug: string,
  _prevState: UpdateSectionState,
  formData: FormData,
): Promise<UpdateSectionState> {
  await requireAdmin();

  const scheme = String(formData.get("scheme") ?? "");
  if (!SCHEME_VALUES.includes(scheme as SchemeKey)) {
    return { error: "Invalid scheme value." };
  }

  await db
    .update(section)
    .set({
      scheme: scheme as SchemeKey,
      order: Number(formData.get("order") ?? 0),
      eyebrow: str(formData, "eyebrow"),
      heading: str(formData, "heading"),
      subtitle: str(formData, "subtitle"),
      backgroundImage: str(formData, "backgroundImage"),
      icon: str(formData, "icon"),
      imagePosition: (str(formData, "imagePosition") as "left" | "right" | null) ?? null,
      disclaimer: str(formData, "disclaimer"),
      ctaPrimaryLabel: str(formData, "ctaPrimaryLabel"),
      ctaPrimaryHref: str(formData, "ctaPrimaryHref"),
      ctaSecondaryLabel: str(formData, "ctaSecondaryLabel"),
      ctaSecondaryHref: str(formData, "ctaSecondaryHref"),
      secondaryEyebrow: str(formData, "secondaryEyebrow"),
      secondaryHeading: str(formData, "secondaryHeading"),
      secondaryBody: str(formData, "secondaryBody"),
      closingCtaLabel: str(formData, "closingCtaLabel"),
      closingCtaHref: str(formData, "closingCtaHref"),
    })
    .where(eq(section.id, id));

  revalidateForPage(pageSlug);
  return { success: true };
}

// --- Images (ParallaxGallery) --------------------------------------------

export async function addSectionImage(sectionId: number, pageSlug: string, formData: FormData) {
  await requireAdmin();
  const url = str(formData, "url");
  if (!url) return;
  await db.insert(sectionImage).values({
    sectionId,
    url,
    altText: str(formData, "altText"),
    order: Number(formData.get("order") ?? 0),
  });
  revalidateForPage(pageSlug);
}

export async function deleteSectionImage(id: number, pageSlug: string) {
  await requireAdmin();
  const [existing] = await db.select().from(sectionImage).where(eq(sectionImage.id, id));
  await db.delete(sectionImage).where(eq(sectionImage.id, id));
  if (existing) await deleteUploadedFile(existing.url);
  revalidateForPage(pageSlug);
}

// --- Bullets (OutcomeFeature) ---------------------------------------------

export async function addSectionBullet(sectionId: number, pageSlug: string, formData: FormData) {
  await requireAdmin();
  const text = str(formData, "text");
  if (!text) return;
  await db.insert(sectionBullet).values({ sectionId, text, order: Number(formData.get("order") ?? 0) });
  revalidateForPage(pageSlug);
}

export async function updateSectionBullet(id: number, pageSlug: string, formData: FormData) {
  await requireAdmin();
  await db
    .update(sectionBullet)
    .set({ text: str(formData, "text") ?? "", order: Number(formData.get("order") ?? 0) })
    .where(eq(sectionBullet.id, id));
  revalidateForPage(pageSlug);
}

export async function deleteSectionBullet(id: number, pageSlug: string) {
  await requireAdmin();
  await db.delete(sectionBullet).where(eq(sectionBullet.id, id));
  revalidateForPage(pageSlug);
}

// --- Tabs (FeatureTabsMedia / ObjectivesTabs) ------------------------------

function tabFromForm(formData: FormData) {
  return {
    order: Number(formData.get("order") ?? 0),
    icon: str(formData, "icon"),
    tabLabel: str(formData, "tabLabel"),
    title: str(formData, "title") ?? "",
    body: str(formData, "body") ?? "",
    image: str(formData, "image"),
    videoUrl: str(formData, "videoUrl"),
    ctaPrimaryLabel: str(formData, "ctaPrimaryLabel"),
    ctaPrimaryHref: str(formData, "ctaPrimaryHref"),
    ctaSecondaryLabel: str(formData, "ctaSecondaryLabel"),
    ctaSecondaryHref: str(formData, "ctaSecondaryHref"),
  };
}

export async function createSectionTab(sectionId: number, pageSlug: string, formData: FormData) {
  await requireAdmin();
  await db.insert(sectionTab).values({ sectionId, ...tabFromForm(formData) });
  revalidateForPage(pageSlug);
  redirect(`/admin/pages/${pageSlug}/${sectionId}`);
}

export async function updateSectionTab(id: number, sectionId: number, pageSlug: string, formData: FormData) {
  await requireAdmin();
  await db.update(sectionTab).set(tabFromForm(formData)).where(eq(sectionTab.id, id));
  revalidateForPage(pageSlug);
  redirect(`/admin/pages/${pageSlug}/${sectionId}`);
}

export async function deleteSectionTab(id: number, pageSlug: string) {
  await requireAdmin();
  const [existing] = await db.select().from(sectionTab).where(eq(sectionTab.id, id));
  await db.delete(sectionTab).where(eq(sectionTab.id, id));
  if (existing) {
    await deleteUploadedFile(existing.icon);
    await deleteUploadedFile(existing.image);
  }
  revalidateForPage(pageSlug);
}
