"use server";

import { and, eq, inArray, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { page, section, sectionImage, sectionTab, sectionBullet, SCHEME_VALUES, type SchemeKey } from "@/db/schema";
import { CUSTOM_SECTION_TYPES, isCustomPage, isReservedSlug, slugify, type CustomSectionType } from "@/lib/custom-pages";
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

export type PageSettingsState = { error?: string; success?: boolean };

async function validatePageFields(formData: FormData, currentId?: number) {
  const title = str(formData, "title");
  if (!title) return { error: "Title is required." } as const;
  const slug = slugify(str(formData, "slug") ?? title);
  if (!slug) return { error: "The address must contain at least one letter or number." } as const;
  if (isReservedSlug(slug)) return { error: `"/${slug}" is already used by the site — choose another address.` } as const;
  const [clash] = await db
    .select({ id: page.id })
    .from(page)
    .where(currentId ? and(eq(page.slug, slug), ne(page.id, currentId)) : eq(page.slug, slug));
  if (clash) return { error: `A page at "/${slug}" already exists.` } as const;
  const status = str(formData, "status") === "published" ? "published" : "draft";
  return { values: { title, slug, metaDescription: str(formData, "metaDescription"), status } } as const;
}

export async function createPage(_prevState: PageSettingsState, formData: FormData): Promise<PageSettingsState> {
  await requireAdmin();
  const result = await validatePageFields(formData);
  if ("error" in result) return { error: result.error };

  const [inserted] = await db.insert(page).values(result.values).$returningId();
  await db.insert(section).values([
    { pageId: inserted.id, componentKey: "page-hero", scheme: "scheme-1", order: 0, heading: result.values.title },
    { pageId: inserted.id, componentKey: "rich-content", scheme: "scheme-2", order: 1 },
  ]);

  revalidateForPage(result.values.slug);
  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${result.values.slug}`);
}

export async function updatePageSettings(
  id: number,
  _prevState: PageSettingsState,
  formData: FormData,
): Promise<PageSettingsState> {
  await requireAdmin();
  const [existing] = await db.select().from(page).where(eq(page.id, id));
  if (!existing || !isCustomPage(existing.slug)) return { error: "This page can't be edited here." };

  const result = await validatePageFields(formData, id);
  if ("error" in result) return { error: result.error };

  await db.update(page).set(result.values).where(eq(page.id, id));
  revalidateForPage(existing.slug);
  revalidatePath("/admin/pages");
  if (result.values.slug !== existing.slug) {
    revalidateForPage(result.values.slug);
    redirect(`/admin/pages/${result.values.slug}`);
  }
  return { success: true };
}

async function deleteSectionRows(sectionIds: number[]) {
  if (sectionIds.length === 0) return;
  const [rows, images, tabs] = await Promise.all([
    db.select().from(section).where(inArray(section.id, sectionIds)),
    db.select().from(sectionImage).where(inArray(sectionImage.sectionId, sectionIds)),
    db.select().from(sectionTab).where(inArray(sectionTab.sectionId, sectionIds)),
  ]);
  await db.delete(sectionImage).where(inArray(sectionImage.sectionId, sectionIds));
  await db.delete(sectionTab).where(inArray(sectionTab.sectionId, sectionIds));
  await db.delete(sectionBullet).where(inArray(sectionBullet.sectionId, sectionIds));
  await db.delete(section).where(inArray(section.id, sectionIds));
  for (const r of rows) {
    await deleteUploadedFile(r.backgroundImage);
    await deleteUploadedFile(r.icon);
  }
  for (const img of images) await deleteUploadedFile(img.url);
  for (const t of tabs) {
    await deleteUploadedFile(t.icon);
    await deleteUploadedFile(t.image);
  }
}

export async function deletePage(id: number) {
  await requireAdmin();
  const [existing] = await db.select().from(page).where(eq(page.id, id));
  if (!existing || !isCustomPage(existing.slug)) return;
  const sectionRows = await db.select({ id: section.id }).from(section).where(eq(section.pageId, id));
  await deleteSectionRows(sectionRows.map((r) => r.id));
  await db.delete(page).where(eq(page.id, id));
  revalidateForPage(existing.slug);
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function addPageSection(pageId: number, formData: FormData) {
  await requireAdmin();
  const [existing] = await db.select().from(page).where(eq(page.id, pageId));
  if (!existing || !isCustomPage(existing.slug)) return;
  const componentKey = String(formData.get("componentKey") ?? "");
  if (!CUSTOM_SECTION_TYPES.includes(componentKey as CustomSectionType)) return;

  const siblings = await db.select({ order: section.order }).from(section).where(eq(section.pageId, pageId));
  const order = siblings.reduce((max, s) => Math.max(max, s.order), -1) + 1;
  const [inserted] = await db
    .insert(section)
    .values({ pageId, componentKey, scheme: componentKey === "page-hero" ? "scheme-1" : "scheme-2", order })
    .$returningId();

  revalidateForPage(existing.slug);
  redirect(`/admin/pages/${existing.slug}/${inserted.id}`);
}

export async function deletePageSection(sectionId: number) {
  await requireAdmin();
  const [row] = await db.select().from(section).where(eq(section.id, sectionId));
  if (!row) return;
  const [owner] = await db.select().from(page).where(eq(page.id, row.pageId));
  if (!owner || !isCustomPage(owner.slug)) return;
  await deleteSectionRows([sectionId]);
  revalidateForPage(owner.slug);
}
