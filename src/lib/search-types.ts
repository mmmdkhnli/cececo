export type SearchResultType = "news" | "event" | "work-with-us" | "project" | "publication" | "country";

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
