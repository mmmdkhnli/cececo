"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { navItem } from "@/db/schema";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

function revalidateNav() {
  revalidatePath("/admin/navigation");
  revalidatePath("/", "layout");
}

function fromForm(formData: FormData) {
  const parentIdRaw = String(formData.get("parentId") ?? "").trim();
  const groupRaw = String(formData.get("group") ?? "").trim();
  const iconRaw = String(formData.get("icon") ?? "").trim();
  return {
    label: String(formData.get("label") ?? "").trim(),
    href: String(formData.get("href") ?? "").trim(),
    location: String(formData.get("location") ?? "navbar") as "navbar" | "footer",
    group: groupRaw && groupRaw !== "none" ? groupRaw : null,
    icon: iconRaw || null,
    parentId: parentIdRaw && parentIdRaw !== "none" ? Number(parentIdRaw) : null,
    order: Number(formData.get("order") ?? 0),
  };
}

export async function createNavItem(formData: FormData) {
  await requireAdmin();
  await db.insert(navItem).values(fromForm(formData));
  revalidateNav();
  redirect("/admin/navigation");
}

export async function updateNavItem(id: number, formData: FormData) {
  await requireAdmin();
  await db.update(navItem).set(fromForm(formData)).where(eq(navItem.id, id));
  revalidateNav();
  redirect("/admin/navigation");
}

export async function deleteNavItem(id: number) {
  await requireAdmin();
  await db.delete(navItem).where(eq(navItem.id, id));
  revalidateNav();
}
