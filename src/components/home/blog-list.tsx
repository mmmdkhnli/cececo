import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "relume-icons";
import { RichText } from "@/components/shared/rich-text";
import { calculateReadingMinutes } from "@/lib/reading-time";
import type { SectionRow, BlogPostRow } from "@/db/schema";

export function BlogList({
  section,
  posts,
  scheme,
}: {
  section: SectionRow;
  posts: BlogPostRow[];
  scheme: string;
}) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} alternate logo-alt`}>
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
            <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
            <RichText html={section.subtitle} className="text-medium" />
          </div>
        </div>
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
        {section.ctaPrimaryLabel && section.ctaPrimaryHref && (
          <div className="flex items-center justify-end">
            <Button asChild variant="secondary" className="mt-12 md:mt-18 lg:mt-20">
              <Link href={section.ctaPrimaryHref}>{section.ctaPrimaryLabel}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
