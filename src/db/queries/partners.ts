import "server-only";
import { and, asc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { memberState, partner } from "@/db/schema";

export async function getSignatoryStates() {
  return db
    .select()
    .from(memberState)
    .where(eq(memberState.isSignatory, true))
    .orderBy(asc(memberState.order));
}

// Countries with a published profile page (slug set) — feeds the homepage
// "CECECO Countries" carousel. A signatory state without a slug yet still
// shows in the plain About flag grid, just without a "See More" link.
export async function getPublishedCountries() {
  return db
    .select()
    .from(memberState)
    .where(and(eq(memberState.isSignatory, true), isNotNull(memberState.slug)))
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
