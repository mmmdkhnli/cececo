import { cache } from "react";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/db/queries/pages";
import { isCustomPage } from "@/lib/custom-pages";
import { isAuthenticated } from "@/lib/session";
import { PageHero } from "@/components/shared/page-hero";
import { RichContent } from "@/components/shared/rich-content";
import { ContentBlock } from "@/components/shared/content-block";

/**
 * Admin-created pages (Admin → Pages → New page). Hand-built routes win over this one, and system
 * page slugs are refused here so their rows can't be reached at a second address.
 */
const loadPage = cache(async (slug: string) => {
  if (!isCustomPage(slug)) return null;
  const data = await getPageBySlug(slug);
  if (!data) return null;
  // Drafts are only visible to a signed-in admin, as a preview.
  if (data.page.status !== "published" && !(await isAuthenticated())) return null;
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadPage(slug);
  if (!data) return {};
  return {
    title: data.page.title,
    description: data.page.metaDescription ?? undefined,
    alternates: { canonical: `/${slug}` },
  };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadPage(slug);
  if (!data) notFound();

  return (
    <main>
      {data.page.status !== "published" && (
        <p className="bg-yellow-100 px-[5%] py-2 text-center text-sm text-yellow-900">
          Draft preview — this page is not public yet.
        </p>
      )}
      {data.sections.map((s) => {
        switch (s.componentKey) {
          case "page-hero":
            return <PageHero key={s.id} scheme={s.scheme} section={s} />;
          case "rich-content":
            return <RichContent key={s.id} scheme={s.scheme} section={s} />;
          case "content-block":
            return <ContentBlock key={s.id} scheme={s.scheme} section={s} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
