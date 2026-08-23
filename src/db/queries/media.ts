import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  mediaItem,
  mediaGalleryImage,
  type MediaItemRow,
  type MediaGalleryImageRow,
} from "@/db/schema";

export type MediaItemWithGallery = MediaItemRow & {
  galleryImages: MediaGalleryImageRow[];
};

export async function getPublishedMediaItems() {
  return db
    .select()
    .from(mediaItem)
    .where(eq(mediaItem.status, "published"))
    .orderBy(desc(mediaItem.eventDate), asc(mediaItem.order));
}

export async function getMediaItemBySlug(
  slug: string,
): Promise<MediaItemWithGallery | null> {
  const [row] = await db
    .select()
    .from(mediaItem)
    .where(eq(mediaItem.slug, slug));
  if (!row || row.status !== "published") return null;

  const galleryImages =
    row.type === "photo_gallery"
      ? await db
          .select()
          .from(mediaGalleryImage)
          .where(eq(mediaGalleryImage.mediaItemId, row.id))
          .orderBy(asc(mediaGalleryImage.order))
      : [];

  return { ...row, galleryImages };
}
