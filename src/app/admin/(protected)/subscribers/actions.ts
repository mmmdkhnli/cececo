"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { subscriber } from "@/db/schema";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) redirect("/admin/login");
}

export async function deleteSubscriber(id: number) {
  await requireAdmin();
  await db.delete(subscriber).where(eq(subscriber.id, id));
  revalidatePath("/admin/subscribers");
}
