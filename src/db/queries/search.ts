import "server-only";
import { sql, eq, and, desc, isNotNull, like } from "drizzle-orm";
import { db } from "@/db";
import { blogPost, opportunity, project, publication, memberState } from "@/db/schema";
import type { SearchResult } from "@/lib/search-types";

export { SEARCH_TYPE_LABEL, type SearchResultType, type SearchResult } from "@/lib/search-types";

function publicationBasePath(category: string) {
  if (category === "Report") return "/resources/reports";
  if (category === "Document") return "/resources/documents";
  return "/resources/publications";
}

export async function searchSite(query: string, limitPerType = 10): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const [newsRows, workRows, projectRows, pubRows, countryRows] = await Promise.all([
    db
      .select()
      .from(blogPost)
      .where(
        and(
          eq(blogPost.status, "published"),
          sql`MATCH(${blogPost.title}, ${blogPost.excerpt}, ${blogPost.body}) AGAINST (${q} IN NATURAL LANGUAGE MODE)`,
        ),
      )
      .orderBy(desc(blogPost.publishedAt))
      .limit(limitPerType * 2),
    db
      .select()
      .from(opportunity)
      .where(
        sql`MATCH(${opportunity.title}, ${opportunity.excerpt}, ${opportunity.description}) AGAINST (${q} IN NATURAL LANGUAGE MODE)`,
      )
      .limit(limitPerType),
    db
      .select()
      .from(project)
      .where(
        sql`MATCH(${project.title}, ${project.shortDescription}, ${project.aboutBody}) AGAINST (${q} IN NATURAL LANGUAGE MODE)`,
      )
      .limit(limitPerType),
    db
      .select()
      .from(publication)
      .where(
        and(
          eq(publication.status, "published"),
          sql`MATCH(${publication.title}, ${publication.excerpt}, ${publication.body}) AGAINST (${q} IN NATURAL LANGUAGE MODE)`,
        ),
      )
      .limit(limitPerType),
    db
      .select()
      .from(memberState)
      .where(and(isNotNull(memberState.slug), like(memberState.name, `%${q}%`)))
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
