import { notFound } from "next/navigation";
import { ResourceDetail } from "@/components/resources/resource-detail";
import { getPublicationBySlug } from "@/db/queries/resources";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicationBySlug(slug);
  if (!item) return {};
  return { title: `${item.title} — CECECO`, description: item.excerpt };
}

export default async function ReportDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicationBySlug(slug);
  if (!item) notFound();

  return (
    <main>
      <ResourceDetail item={item} />
    </main>
  );
}
