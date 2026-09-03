import "server-only";
import { eq, and, or, desc, isNotNull, like, type Column } from "drizzle-orm";
import { db } from "@/db";
import { blogPost, opportunity, project, publication, memberState } from "@/db/schema";
import { SEARCH_MIN_LENGTH, type SearchResult } from "@/lib/search-types";

export {
  SEARCH_TYPE_LABEL,
  SEARCH_MIN_LENGTH,
  type SearchResultType,
  type SearchResult,
} from "@/lib/search-types";

function publicationBasePath(category: string) {
  if (category === "Report") return "/resources/reports";
  if (category === "Document") return "/resources/documents";
  return "/resources/publications";
}

/**
 * Matches a row if ANY word from the query appears (case-insensitively, as a substring) in ANY of
 * the given columns — so "Azerbaijan Baku" finds rows about either, not just rows containing both.
 */
function anyWordIn(words: string[], columns: Column[]) {
  return or(...words.flatMap((w) => columns.map((c) => like(c, `%${w}%`))))!;
}

export async function searchSite(query: string, limitPerType = 10): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < SEARCH_MIN_LENGTH) return [];
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const [newsRows, workRows, projectRows, pubRows, countryRows] = await Promise.all([
    db
      .select()
      .from(blogPost)
      .where(and(eq(blogPost.status, "published"), anyWordIn(words, [blogPost.title, blogPost.excerpt, blogPost.body])))
      .orderBy(desc(blogPost.publishedAt))
      .limit(limitPerType * 2),
    db
      .select()
      .from(opportunity)
      .where(anyWordIn(words, [opportunity.title, opportunity.excerpt, opportunity.description]))
      .limit(limitPerType),
    db
      .select()
      .from(project)
      .where(anyWordIn(words, [project.title, project.shortDescription, project.aboutBody]))
      .limit(limitPerType),
    db
      .select()
      .from(publication)
      .where(
        and(eq(publication.status, "published"), anyWordIn(words, [publication.title, publication.excerpt, publication.body])),
      )
      .limit(limitPerType),
    db
      .select()
      .from(memberState)
      .where(and(isNotNull(memberState.slug), anyWordIn(words, [memberState.name])))
      .limit(limitPerType),
  ]);

  const results: SearchResult[] = [];

  for (const row of newsRows) {
    results.push({
      type: row.isEvent ? "event" : "news",
      title: row.title,
      excerpt: row.excerpt,
      href: `/news/${row.slug}`,
      date: row.publishedAt,
    });
  }
  for (const row of workRows) {
    results.push({
      type: "work-with-us",
      title: row.title,
      excerpt: row.excerpt ?? "",
      href: `/work-with-us/${row.slug}`,
      date: row.deadline,
    });
  }
  for (const row of projectRows) {
    results.push({
      type: "project",
      title: row.title,
      excerpt: row.shortDescription,
      href: `/projects/${row.slug}`,
      date: null,
    });
  }
  for (const row of pubRows) {
    results.push({
      type: "publication",
      title: row.title,
      excerpt: row.excerpt,
      href: `${publicationBasePath(row.category)}/${row.slug}`,
      date: row.publishedAt,
    });
  }
  for (const row of countryRows) {
    results.push({
      type: "country",
      title: row.name,
      excerpt: row.description ?? "",
      href: `/countries/${row.slug}`,
      date: null,
    });
  }

  return results;
}
