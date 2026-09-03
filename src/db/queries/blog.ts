import "server-only";
import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { blogPost } from "@/db/schema";

export const NEWS_PAGE_SIZE = 20;

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

/** Increments the view counter for a published post; fire-and-forget from the detail page. */
export async function recordBlogPostView(id: number) {
  await db
    .update(blogPost)
    .set({ viewCount: sql`${blogPost.viewCount} + 1` })
    .where(eq(blogPost.id, id));
}

/** Non-event news, paginated and optionally filtered to a "YYYY-MM" month, newest first. */
export async function getNewsPage({
  offset = 0,
  limit = NEWS_PAGE_SIZE,
  month,
}: {
  offset?: number;
  limit?: number;
  month?: string | null;
}) {
  const conditions = [eq(blogPost.status, "published")];
  if (month) {
    conditions.push(sql`date_format(${blogPost.publishedAt}, '%Y-%m') = ${month}`);
  }

  const rows = await db
    .select()
    .from(blogPost)
    .where(and(...conditions))
    .orderBy(desc(blogPost.publishedAt))
    .limit(limit + 1)
    .offset(offset);

  return { posts: rows.slice(0, limit), hasMore: rows.length > limit };
}

/** Published months (newest first) with post counts, for the news archive filter. */
export async function getNewsMonths() {
  return db
    .select({
      month: sql<string>`date_format(${blogPost.publishedAt}, '%Y-%m')`,
      count: sql<number>`count(*)`,
    })
    .from(blogPost)
    .where(and(eq(blogPost.status, "published"), isNotNull(blogPost.publishedAt)))
    .groupBy(sql`date_format(${blogPost.publishedAt}, '%Y-%m')`)
    .orderBy(sql`date_format(${blogPost.publishedAt}, '%Y-%m') desc`);
}

export async function getEvents() {
  return db
    .select()
    .from(blogPost)
    .where(and(eq(blogPost.status, "published"), eq(blogPost.isEvent, true)))
    .orderBy(desc(blogPost.eventDate));
}
