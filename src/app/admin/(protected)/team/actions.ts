"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { teamMember } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

function fromForm(formData: FormData) {
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
  };
}

export async function createTeamMember(formData: FormData) {
  await requireAdmin();
  await db.insert(teamMember).values(fromForm(formData));
  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/team");
  redirect("/admin/team");
}

export async function updateTeamMember(id: number, formData: FormData) {
  await requireAdmin();
  await db.update(teamMember).set(fromForm(formData)).where(eq(teamMember.id, id));
  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/team");
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
