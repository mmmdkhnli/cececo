import { notFound } from "next/navigation";
import { RichText } from "@/components/shared/rich-text";
import { getHeroSlideBySlug } from "@/db/queries/hero";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slide = await getHeroSlideBySlug(slug);
  if (!slide || !slide.seeMoreEnabled) return {};
  return { title: `${slide.pageTitle || slide.title} — CECECO` };
}

export default async function HighlightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slide = await getHeroSlideBySlug(slug);
  if (!slide || !slide.seeMoreEnabled) notFound();

  return (
    <main>
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container max-w-2xl">
          <h1 className="mb-8 text-h1 font-bold">{slide.pageTitle || slide.title}</h1>
          <RichText html={slide.pageBody} className="text-medium" />
        </div>
      </section>
    </main>
  );
}
