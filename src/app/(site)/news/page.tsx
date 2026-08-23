import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "relume-icons";
import { SimpleHero } from "@/components/shared/simple-hero";
import { getAllPublishedBlogPosts } from "@/db/queries/blog";
import { calculateReadingMinutes } from "@/lib/reading-time";

export const metadata = {
  title: "News — CECECO",
  description: "CECECO's latest insights, project updates, and clean energy developments.",
};

export default async function NewsPage() {
  const posts = await getAllPublishedBlogPosts();

  return (
    <main>
      <SimpleHero title="News" subtitle="Latest updates, project highlights, and articles." />
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          {posts.length === 0 ? (
            <p className="text-center text-medium text-neutral">No news posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="flex size-full flex-col items-center justify-start">
                  <Link href={`/news/${post.slug}`} className="w-full">
                    {post.coverImage && (
                      <img src={post.coverImage} alt="" className="aspect-[3/2] size-full object-cover" />
                    )}
                  </Link>
                  <div className="px-5 py-6 md:p-6">
                    <div className="mb-3 flex w-full items-center justify-start md:mb-4">
                      <Badge className="mr-4">{post.category}</Badge>
                      <p className="inline text-small font-semibold">
                        {calculateReadingMinutes(post.body)} min read
                      </p>
                    </div>
                    <Link className="mb-2 block" href={`/news/${post.slug}`}>
                      <h2 className="text-h5 font-bold">{post.title}</h2>
                    </Link>
                    <p>{post.excerpt}</p>
                    <Button
                      asChild
                      title="Read more"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      className="mt-5 flex items-center justify-center gap-x-2 md:mt-6"
                    >
                      <Link href={`/news/${post.slug}`}>Read more</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
