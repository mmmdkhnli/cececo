import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SimpleHero } from "@/components/shared/simple-hero";
import { searchSite, SEARCH_TYPE_LABEL, type SearchResultType } from "@/db/queries/search";

export const metadata = {
  title: "Search — CECECO",
};

const TYPE_ORDER: SearchResultType[] = ["news", "event", "project", "work-with-us", "publication"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchSite(query) : [];

  const grouped = TYPE_ORDER.map((type) => ({
    type,
    items: results.filter((r) => r.type === type),
  })).filter((group) => group.items.length > 0);

  return (
    <main>
      <SimpleHero
        title="Search"
        subtitle={query ? `Results for "${query}"` : "Search news, events, projects, opportunities, and publications."}
      />
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container max-w-3xl">
          {!query ? (
            <p className="text-center text-medium text-neutral">Enter a search term above to get started.</p>
          ) : grouped.length === 0 ? (
            <p className="text-center text-medium text-neutral">
              No results found for &quot;{query}&quot;. Try a different search term.
            </p>
          ) : (
            <div className="flex flex-col gap-12">
              {grouped.map((group) => (
                <div key={group.type}>
                  <h2 className="mb-5 text-h5 font-bold">{SEARCH_TYPE_LABEL[group.type]}</h2>
                  <div className="flex flex-col gap-4">
                    {group.items.map((item, i) => (
                      <Link key={`${group.type}-${i}`} href={item.href}>
                        <Card className="flex flex-col gap-2 p-5">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge>{SEARCH_TYPE_LABEL[group.type]}</Badge>
                            {item.date && (
                              <p className="text-small text-neutral">
                                {new Date(item.date).toLocaleDateString("en-US")}
                              </p>
                            )}
                          </div>
                          <h3 className="text-medium font-bold">{item.title}</h3>
                          {item.excerpt && <p className="text-small text-neutral">{item.excerpt}</p>}
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
