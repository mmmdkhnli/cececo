"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { memberState, partner, type PartnerCategory } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";
import { resolveSlug } from "@/lib/slug";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

function revalidatePartnersPages() {
  revalidatePath("/admin/partners");
  revalidatePath("/");
  revalidatePath("/partners");
  revalidatePath("/about/signatory-countries");
  revalidatePath("/countries/[slug]", "page");
}

function partnerFromForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    logoImage: String(formData.get("logoImage") ?? "").trim(),
    link: String(formData.get("link") ?? "").trim() || null,
    category: String(
      formData.get("category") ?? "institutional_strategic",
    ) as PartnerCategory,
    statusLabel: String(formData.get("statusLabel") ?? "").trim() || null,
    badge: String(formData.get("badge") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    viewMoreUrl: String(formData.get("viewMoreUrl") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0),
  };
}

export async function createPartner(formData: FormData) {
  await requireAdmin();
  await db.insert(partner).values(partnerFromForm(formData));
  revalidatePartnersPages();
  redirect("/admin/partners");
}

export async function updatePartner(id: number, formData: FormData) {
  await requireAdmin();
  await db
    .update(partner)
    .set(partnerFromForm(formData))
    .where(eq(partner.id, id));
  revalidatePartnersPages();
  redirect("/admin/partners");
}

export async function deletePartner(id: number) {
  await requireAdmin();
  const [existing] = await db.select().from(partner).where(eq(partner.id, id));
  await db.delete(partner).where(eq(partner.id, id));
  if (existing) await deleteUploadedFile(existing.logoImage);
  revalidatePartnersPages();
}

const MEMBER_STATE_SLUG_TARGET = {
  table: memberState,
  slugColumn: memberState.slug,
  idColumn: memberState.id,
  fallback: "country",
};

/**
 * The slug both addresses and gates the /countries page: no slug means the country only shows up in
 * the flag list. So the checkbox decides whether there is one, and the name decides what it is.
 */
async function memberStateSlug(
  name: string,
  formData: FormData,
  existing?: { id: number; slug: string | null; name: string } | null,
) {
  if (formData.get("profilePublished") !== "on") return null;
  return resolveSlug({
    ...MEMBER_STATE_SLUG_TARGET,
    source: name,
    current: existing ? { id: existing.id, slug: existing.slug, source: existing.name } : null,
  });
}

function memberStateFromForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    flagImage: String(formData.get("flagImage") ?? "").trim(),
    isSignatory: formData.get("isSignatory") === "on",
    order: Number(formData.get("order") ?? 0),
    description: String(formData.get("description") ?? "").trim() || null,
    heroImage: String(formData.get("heroImage") ?? "").trim() || null,
    region: String(formData.get("region") ?? "").trim() || null,
    capital: String(formData.get("capital") ?? "").trim() || null,
    population: String(formData.get("population") ?? "").trim() || null,
    area: String(formData.get("area") ?? "").trim() || null,
    founded: String(formData.get("founded") ?? "").trim() || null,
    timeZone: String(formData.get("timeZone") ?? "").trim() || null,
    renewableEnergySharesImage:
      String(formData.get("renewableEnergySharesImage") ?? "").trim() || null,
    bySourceImage: String(formData.get("bySourceImage") ?? "").trim() || null,
  };
}

export async function createMemberState(formData: FormData) {
  await requireAdmin();
  const values = memberStateFromForm(formData);
  const slug = await memberStateSlug(values.name, formData);
  await db.insert(memberState).values({ ...values, slug });
  revalidatePartnersPages();
  redirect("/admin/partners");
}

export async function updateMemberState(id: number, formData: FormData) {
  await requireAdmin();
  const values = memberStateFromForm(formData);
  const [existing] = await db.select().from(memberState).where(eq(memberState.id, id));
  const slug = await memberStateSlug(values.name, formData, existing ?? null);
  await db
    .update(memberState)
    .set({ ...values, slug })
    .where(eq(memberState.id, id));
  revalidatePartnersPages();
  redirect("/admin/partners");
}

export async function deleteMemberState(id: number) {
  await requireAdmin();
  const [existing] = await db
    .select()
    .from(memberState)
    .where(eq(memberState.id, id));
  await db.delete(memberState).where(eq(memberState.id, id));
  if (existing) {
    await deleteUploadedFile(existing.flagImage);
    if (existing.heroImage) await deleteUploadedFile(existing.heroImage);
    if (existing.renewableEnergySharesImage)
      await deleteUploadedFile(existing.renewableEnergySharesImage);
    if (existing.bySourceImage)
      await deleteUploadedFile(existing.bySourceImage);
  }
  revalidatePartnersPages();
}
