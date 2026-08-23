"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
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
