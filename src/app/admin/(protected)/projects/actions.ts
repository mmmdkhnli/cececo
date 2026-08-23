"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { project, projectObjective } from "@/db/schema";
import { getSession } from "@/lib/session";
import { deleteUploadedFile } from "@/lib/uploads";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim() || null;
}

function fromForm(formData: FormData) {
  const periodStartRaw = str(formData, "periodStart");
  const periodEndRaw = str(formData, "periodEnd");
  const applicationsOpen = formData.get("applicationsOpen") === "on";
  const applicationDeadlineRaw = str(formData, "applicationDeadline");

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    coverImage: String(formData.get("coverImage") ?? "").trim(),
    status: String(formData.get("status") ?? "upcoming") as "ongoing" | "upcoming" | "completed",
    periodStart: periodStartRaw ? new Date(periodStartRaw) : null,
    periodEnd: periodEndRaw ? new Date(periodEndRaw) : null,
    applicationsOpen,
    applicationDeadline: applicationsOpen && applicationDeadlineRaw ? new Date(applicationDeadlineRaw) : null,
    whoCanApply: applicationsOpen ? str(formData, "whoCanApply") : null,
    howToApplyBody: applicationsOpen ? str(formData, "howToApplyBody") : null,
    applyUrl: applicationsOpen ? str(formData, "applyUrl") : null,
    aboutBody: str(formData, "aboutBody"),
    isRegionalInitiative: formData.get("isRegionalInitiative") === "on",
    order: Number(formData.get("order") ?? 0),
  };
}

function revalidateProjectPages() {
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  await db.insert(project).values(fromForm(formData));
  revalidateProjectPages();
  redirect("/admin/projects");
}

export async function updateProject(id: number, formData: FormData) {
  await requireAdmin();
  await db.update(project).set(fromForm(formData)).where(eq(project.id, id));
  revalidateProjectPages();
  redirect("/admin/projects");
}

export async function deleteProject(id: number) {
  await requireAdmin();
  const [existing] = await db.select().from(project).where(eq(project.id, id));
  await db.delete(project).where(eq(project.id, id));
  if (existing) await deleteUploadedFile(existing.coverImage);
  revalidateProjectPages();
}

export async function addProjectObjective(projectId: number, formData: FormData) {
  await requireAdmin();
  const text = str(formData, "text");
  if (!text) return;
  await db.insert(projectObjective).values({ projectId, text, order: Number(formData.get("order") ?? 0) });
  revalidateProjectPages();
}

export async function updateProjectObjective(id: number, formData: FormData) {
  await requireAdmin();
  await db
    .update(projectObjective)
    .set({ text: str(formData, "text") ?? "", order: Number(formData.get("order") ?? 0) })
    .where(eq(projectObjective.id, id));
  revalidateProjectPages();
}

export async function deleteProjectObjective(id: number) {
  await requireAdmin();
  await db.delete(projectObjective).where(eq(projectObjective.id, id));
  revalidateProjectPages();
}
