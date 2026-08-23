import "server-only";
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  page,
  section,
  sectionImage,
  sectionTab,
  sectionBullet,
  type SectionRow,
  type SectionImageRow,
  type SectionTabRow,
  type SectionBulletRow,
} from "@/db/schema";

export type SectionWithRelations = SectionRow & {
  images: SectionImageRow[];
  tabs: SectionTabRow[];
  bullets: SectionBulletRow[];
};

export async function getPageBySlug(slug: string) {
  const [pageRow] = await db.select().from(page).where(eq(page.slug, slug)).limit(1);
  if (!pageRow) return null;

  const sectionRows = await db
    .select()
    .from(section)
    .where(eq(section.pageId, pageRow.id))
    .orderBy(asc(section.order));

  if (sectionRows.length === 0) {
    return { page: pageRow, sections: [] as SectionWithRelations[] };
  }

  const sectionIds = sectionRows.map((s) => s.id);
  const [allImages, allTabs, allBullets] = await Promise.all([
    db.select().from(sectionImage).where(inArray(sectionImage.sectionId, sectionIds)).orderBy(asc(sectionImage.order)),
    db.select().from(sectionTab).where(inArray(sectionTab.sectionId, sectionIds)).orderBy(asc(sectionTab.order)),
    db.select().from(sectionBullet).where(inArray(sectionBullet.sectionId, sectionIds)).orderBy(asc(sectionBullet.order)),
  ]);

  const sections: SectionWithRelations[] = sectionRows.map((s) => ({
    ...s,
    images: allImages.filter((x) => x.sectionId === s.id),
    tabs: allTabs.filter((x) => x.sectionId === s.id),
    bullets: allBullets.filter((x) => x.sectionId === s.id),
  }));

  return { page: pageRow, sections };
}
