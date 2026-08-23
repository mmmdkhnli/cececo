import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPost } from "@/db/schema";

// Ordered by publishedAt (not createdAt) — editorially, publishedAt is the
// date that actually matters (posts get backdated to their real publish
// date, which can be well before the row was created), so it has to drive
// the order. The bug this used to cause (a bare `type="date"` input
// silently zeroing the time-of-day on every save) is fixed at the source
// now — see PublishDateField — instead of by sorting on the wrong column.
export async function getPublishedBlogPosts(limit = 3) {
  return db
    .select()
    .from(blogPost)
    .where(eq(blogPost.status, "published"))
    .orderBy(desc(blogPost.publishedAt))
    .limit(limit);
}

export async function getAllPublishedBlogPosts() {
  return db.select().from(blogPost).where(eq(blogPost.status, "published")).orderBy(desc(blogPost.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const [post] = await db
    .select()
    .from(blogPost)
    .where(and(eq(blogPost.slug, slug), eq(blogPost.status, "published")));
  return post ?? null;
}

// News/Events unification: an event is just a published blog_post with
// isEvent=true — same row, same /news/[slug] detail page, just cross-listed
// here so it doesn't need to be authored twice.
export async function getEvents() {
  return db
    .select()
    .from(blogPost)
    .where(and(eq(blogPost.status, "published"), eq(blogPost.isEvent, true)))
    .orderBy(desc(blogPost.eventDate));
}
