import { notFound } from "next/navigation";
import { MediaDetail } from "@/components/resources/media-detail";
import { getMediaItemBySlug } from "@/db/queries/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getMediaItemBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.title} — CECECO`,
    description: item.description ?? undefined,
  };
}

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getMediaItemBySlug(slug);
  if (!item) notFound();

  return (
    <main>
      <MediaDetail item={item} />
    </main>
  );
}
