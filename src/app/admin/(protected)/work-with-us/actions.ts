"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { opportunity } from "@/db/schema";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

function fromForm(formData: FormData) {
  const deadlineRaw = String(formData.get("deadline") ?? "").trim();
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? "vacancy") as
      | "internship"
      | "vacancy"
      | "young_professional_programme"
      | "other",
    deadline: deadlineRaw ? new Date(deadlineRaw) : null,
    applyUrl: String(formData.get("applyUrl") ?? "").trim(),
    status: String(formData.get("status") ?? "active") as "active" | "closed",
  };
}

function revalidateWorkWithUsPages() {
  revalidatePath("/admin/work-with-us");
  revalidatePath("/work-with-us");
}

export async function createOpportunity(formData: FormData) {
  await requireAdmin();
  await db.insert(opportunity).values(fromForm(formData));
  revalidateWorkWithUsPages();
  redirect("/admin/work-with-us");
}

export async function updateOpportunity(id: number, formData: FormData) {
  await requireAdmin();
  await db.update(opportunity).set(fromForm(formData)).where(eq(opportunity.id, id));
  revalidateWorkWithUsPages();
  redirect("/admin/work-with-us");
}

export async function deleteOpportunity(id: number) {
  await requireAdmin();
  await db.delete(opportunity).where(eq(opportunity.id, id));
  revalidateWorkWithUsPages();
}
