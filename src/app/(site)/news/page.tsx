import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { NewsList } from "@/components/news/news-list";
import { getNewsPage, getNewsMonths, NEWS_PAGE_SIZE } from "@/db/queries/blog";
import { getPageBySlug } from "@/db/queries/pages";
import { stripHtml } from "@/lib/utils";

export async function generateMetadata() {
  const data = await getPageBySlug("news");
  const hero = data?.sections.find((s) => s.componentKey === "page-hero");
  return {
    title: `${hero?.heading ?? "News"} — CECECO`,
    description: stripHtml(hero?.subtitle) || undefined,
  };
}

export default async function NewsPage() {
  const [data, { posts, hasMore }, months] = await Promise.all([
    getPageBySlug("news"),
    getNewsPage({ offset: 0, limit: NEWS_PAGE_SIZE }),
    getNewsMonths(),
  ]);
  if (!data) notFound();
  const hero = data.sections.find((s) => s.componentKey === "page-hero");

  return (
    <main>
      {hero && <PageHero scheme={hero.scheme} section={hero} />}
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          <NewsList initialPosts={posts} initialHasMore={hasMore} months={months} />
        </div>
      </section>
    </main>
  );
}
