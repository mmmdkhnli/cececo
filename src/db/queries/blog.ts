import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPost } from "@/db/schema";

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

export async function getEvents() {
  return db
    .select()
    .from(blogPost)
    .where(and(eq(blogPost.status, "published"), eq(blogPost.isEvent, true)))
    .orderBy(desc(blogPost.eventDate));
}
