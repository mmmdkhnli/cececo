export type SearchResultType = "news" | "event" | "work-with-us" | "project" | "publication" | "country";

/** Mirrors the server-side minimum in `@/db/queries/search` — kept here too since this file has no
 * `server-only` import and can be shared with client components that gate their own fetches on it. */
export const SEARCH_MIN_LENGTH = 3;

export const SEARCH_TYPE_LABEL: Record<SearchResultType, string> = {
  news: "News",
  event: "Events",
  "work-with-us": "Work With Us",
  project: "Projects",
  publication: "Publications",
  country: "Countries",
};

export type SearchResult = {
  type: SearchResultType;
  title: string;
  excerpt: string;
  href: string;
  date: Date | null;
};
