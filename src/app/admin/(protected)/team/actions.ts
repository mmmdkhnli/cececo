"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { teamMember, type TeamMemberRow } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";
import { resolveSlug } from "@/lib/slug";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

const SLUG_TARGET = {
  table: teamMember,
  slugColumn: teamMember.slug,
  idColumn: teamMember.id,
  fallback: "team-member",
};

function fromForm(formData: FormData) {
  const hasDetailPage = formData.get("hasDetailPage") === "on";
  return {
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim() || null,
    photo: String(formData.get("photo") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    linkedinUrl: String(formData.get("linkedinUrl") ?? "").trim() || null,
    xUrl: String(formData.get("xUrl") ?? "").trim() || null,
    dribbbleUrl: String(formData.get("dribbbleUrl") ?? "").trim() || null,
    group: String(formData.get("group") ?? "leadership") as "leadership" | "technical",
    status: String(formData.get("status") ?? "active") as "active" | "vacant",
    order: Number(formData.get("order") ?? 0),
    hasDetailPage,
    detailBody: hasDetailPage ? String(formData.get("detailBody") ?? "").trim() || null : null,
  };
}

async function withSlug(formData: FormData, existing?: TeamMemberRow | null) {
  const values = fromForm(formData);
  if (!values.hasDetailPage) return { ...values, slug: null };

  const slug = await resolveSlug({
    ...SLUG_TARGET,
    source: values.name,
    current: existing?.slug ? { id: existing.id, slug: existing.slug, source: existing.name } : null,
  });
  return { ...values, slug };
}

export async function createTeamMember(formData: FormData) {
  await requireAdmin();
  await db.insert(teamMember).values(await withSlug(formData));
  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/team");
  redirect("/admin/team");
}

export async function updateTeamMember(id: number, formData: FormData) {
  await requireAdmin();
  const [existing] = await db.select().from(teamMember).where(eq(teamMember.id, id));
  await db
    .update(teamMember)
    .set(await withSlug(formData, existing ?? null))
    .where(eq(teamMember.id, id));
  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/team");
  revalidatePath("/team/[slug]", "page");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: number) {
  await requireAdmin();
  const [existing] = await db.select().from(teamMember).where(eq(teamMember.id, id));
  await db.delete(teamMember).where(eq(teamMember.id, id));
  if (existing) await deleteUploadedFile(existing.photo);
  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/team");
}
