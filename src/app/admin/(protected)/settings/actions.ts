"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { adminUser, siteSettings } from "@/db/schema";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

export type UpdateAccountState = { error?: string; success?: boolean };

export async function updateAccount(
  prevState: UpdateAccountState,
  formData: FormData,
): Promise<UpdateAccountState> {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword) return { error: "Enter your current password to make changes." };
  if (!name || !email) return { error: "Name and email are required." };
  if (newPassword && newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) return { error: "New passwords do not match." };

  const [user] = await db.select().from(adminUser).where(eq(adminUser.id, session.userId));
  if (!user) return { error: "Session expired, please sign in again." };

  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validPassword) return { error: "Current password is incorrect." };

  if (email !== user.email) {
    const [existing] = await db.select().from(adminUser).where(eq(adminUser.email, email));
    if (existing && existing.id !== user.id) return { error: "That email is already in use." };
  }

  const update: { name: string; email: string; passwordHash?: string } = { name, email };
  if (newPassword) update.passwordHash = await bcrypt.hash(newPassword, 12);

  await db.update(adminUser).set(update).where(eq(adminUser.id, user.id));

  session.name = name;
  session.email = email;
  await session.save();

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateSiteSettings(id: number, formData: FormData) {
  await requireAdmin();
  function str(key: string) {
    return String(formData.get(key) ?? "").trim() || null;
  }

  await db
    .update(siteSettings)
    .set({
      logoLight: String(formData.get("logoLight") ?? "").trim(),
      logoDark: String(formData.get("logoDark") ?? "").trim(),
      footerDescription: String(formData.get("footerDescription") ?? "").trim(),
      copyrightText: String(formData.get("copyrightText") ?? "").trim(),
      contactEmail: str("contactEmail"),
      contactPhone: str("contactPhone"),
      contactAddress: str("contactAddress"),
      contactWorkingHours: str("contactWorkingHours"),
      contactMapEmbedUrl: str("contactMapEmbedUrl"),
    })
    .where(eq(siteSettings.id, id));
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  revalidatePath("/contact");
}
