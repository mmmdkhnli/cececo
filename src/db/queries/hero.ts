import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { heroSlide } from "@/db/schema";

export async function getHeroSlides() {
  return db.select().from(heroSlide).orderBy(asc(heroSlide.order));
}

export async function getHeroSlideBySlug(slug: string) {
  const [row] = await db.select().from(heroSlide).where(eq(heroSlide.pageSlug, slug));
  return row ?? null;
}
