import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@/components/shared/rich-text";
import { getBlogPostBySlug } from "@/db/queries/blog";
import { calculateReadingMinutes } from "@/lib/reading-time";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} — CECECO`, description: post.excerpt };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <main>
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container max-w-2xl">
          <div className="mb-6 flex items-center gap-4">
            <Badge>{post.category}</Badge>
            <p className="text-small font-semibold text-neutral">
              {calculateReadingMinutes(post.body)} min read
            </p>
            {post.publishedAt && (
              <p className="text-small text-neutral">
                {new Date(post.publishedAt).toLocaleDateString("en-US")}
              </p>
            )}
          </div>
          <h1 className="mb-8 text-h1 font-bold">{post.title}</h1>
          {post.coverImage && (
            <img src={post.coverImage} alt="" className="mb-10 aspect-[16/9] w-full rounded-image object-cover" />
          )}
          <RichText html={post.body} className="text-medium" />
        </div>
      </section>
    </main>
  );
}
