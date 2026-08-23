import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { opportunity, publication, miscResource } from "@/db/schema";

export async function getOpportunities() {
  return db.select().from(opportunity).orderBy(desc(opportunity.deadline));
}

export async function getOpportunityBySlug(slug: string) {
  const [item] = await db.select().from(opportunity).where(eq(opportunity.slug, slug));
  return item ?? null;
}

export async function getPublishedPublications() {
  return db
    .select()
    .from(publication)
    .where(eq(publication.status, "published"))
    .orderBy(desc(publication.publishedAt));
}

// Resources dropdown taxonomy: Publications / Reports / Documents each list
// the same `publication` table filtered by its `category` value.
export async function getPublishedPublicationsByCategory(category: string) {
  return db
    .select()
    .from(publication)
    .where(and(eq(publication.status, "published"), eq(publication.category, category)))
    .orderBy(desc(publication.publishedAt));
}

export async function getPublicationBySlug(slug: string) {
  const [item] = await db
    .select()
    .from(publication)
    .where(and(eq(publication.slug, slug), eq(publication.status, "published")));
  return item ?? null;
}

export async function getMiscResources() {
  return db.select().from(miscResource).orderBy(asc(miscResource.order));
}
