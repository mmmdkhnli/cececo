"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { contactMethod } from "@/db/schema";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

export async function updateContactMethod(id: number, formData: FormData) {
  await requireAdmin();
  await db
    .update(contactMethod)
    .set({
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      value: String(formData.get("value") ?? "").trim(),
      link: String(formData.get("link") ?? "").trim() || null,
    })
    .where(eq(contactMethod.id, id));
  revalidatePath("/admin/contact");
  revalidatePath("/");
}

export async function createContactMethod(formData: FormData) {
  await requireAdmin();
  await db.insert(contactMethod).values({
    type: String(formData.get("type") ?? "email") as "email" | "phone" | "office",
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    value: String(formData.get("value") ?? "").trim(),
    link: String(formData.get("link") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0),
  });
  revalidatePath("/admin/contact");
  revalidatePath("/");
}

export async function deleteContactMethod(id: number) {
  await requireAdmin();
  await db.delete(contactMethod).where(eq(contactMethod.id, id));
  revalidatePath("/admin/contact");
  revalidatePath("/");
}
