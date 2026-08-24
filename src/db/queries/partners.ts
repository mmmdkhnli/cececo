import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { memberState, partner } from "@/db/schema";

export async function getSignatoryStates() {
  return db
    .select()
    .from(memberState)
    .where(eq(memberState.isSignatory, true))
    .orderBy(asc(memberState.order));
}

export async function getCountryBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(memberState)
    .where(eq(memberState.slug, slug));
  return row ?? null;
}

export async function getPartners() {
  return db.select().from(partner).orderBy(asc(partner.order));
}
