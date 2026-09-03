import { SimpleHero } from "@/components/shared/simple-hero";
import { NewsList } from "@/components/news/news-list";
import { getNewsPage, getNewsMonths, NEWS_PAGE_SIZE } from "@/db/queries/blog";

export const metadata = {
  title: "News — CECECO",
  description: "CECECO's latest insights, project updates, and clean energy developments.",
};

export default async function NewsPage() {
  const [{ posts, hasMore }, months] = await Promise.all([
    getNewsPage({ offset: 0, limit: NEWS_PAGE_SIZE }),
    getNewsMonths(),
  ]);

  return (
    <main>
      <SimpleHero title="News" subtitle="Latest updates, project highlights, and articles." />
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          <NewsList initialPosts={posts} initialHasMore={hasMore} months={months} />
        </div>
      </section>
    </main>
  );
}
