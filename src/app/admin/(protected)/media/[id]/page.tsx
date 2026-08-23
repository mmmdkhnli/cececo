import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { mediaItem, mediaGalleryImage } from "@/db/schema";
import { MediaItemForm } from "@/components/admin/media-item-form";
import { MediaGalleryManager } from "@/components/admin/media-gallery-manager";
import { updateMediaItem } from "../actions";

export default async function EditMediaItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mediaItemId = Number(id);
  const [item] = await db
    .select()
    .from(mediaItem)
    .where(eq(mediaItem.id, mediaItemId));
  if (!item) notFound();

  const galleryImages =
    item.type === "photo_gallery"
      ? await db
          .select()
          .from(mediaGalleryImage)
          .where(eq(mediaGalleryImage.mediaItemId, mediaItemId))
          .orderBy(asc(mediaGalleryImage.order))
      : [];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold">
          Edit {item.title}
        </h1>
        <div className="mt-8">
          <MediaItemForm
            key={item.id}
            action={updateMediaItem.bind(null, item.id)}
            defaultValues={item}
          />
        </div>
      </div>
      {item.type === "photo_gallery" && (
        <MediaGalleryManager mediaItemId={item.id} images={galleryImages} />
      )}
    </div>
  );
}
