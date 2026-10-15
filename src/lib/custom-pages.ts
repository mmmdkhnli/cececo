/**
 * Custom pages are admin-created pages served by the `(site)/[slug]` catch route. Every other row in
 * the `page` table backs a hand-built route and is a "system" page: its sections are fixed by code,
 * so it can't be deleted, renamed, or given new sections from the admin.
 */
export const SYSTEM_PAGE_SLUGS = [
  "home",
  "about",
  "contact",
  "cookie-settings",
  "news",
  "our-work",
  "partners",
  "privacy-policy",
  "signatory-countries",
  "structure",
  "team",
  "terms-of-service",
  "vision-and-mission",
] as const;

/** System pages whose hand-built route honours the page's draft/published status. */
export const STATUS_AWARE_SYSTEM_SLUGS = ["structure"] as const;

export function hasEditableStatus(slug: string) {
  return isCustomPage(slug) || (STATUS_AWARE_SYSTEM_SLUGS as readonly string[]).includes(slug);
}

/** Top-level route folders (and other reserved paths) a custom page's slug must not shadow. */
const RESERVED_SLUGS = new Set<string>([
  ...SYSTEM_PAGE_SLUGS,
  "admin",
  "api",
  "countries",
  "events",
  "highlights",
  "new", // /admin/pages/new
  "projects",
  "resources",
  "search",
  "structure",
  "work-with-us",
  "sitemap.xml",
  "robots.txt",
]);

/** First path segments served by hand-built routes ("" is the home page). */
const CODE_ROUTE_SEGMENTS = new Set<string>([
  "",
  "about",
  "contact",
  "cookie-settings",
  "countries",
  "events",
  "highlights",
  "news",
  "partners",
  "privacy-policy",
  "projects",
  "resources",
  "search",
  "structure",
  "team",
  "terms-of-service",
  "vision-and-mission",
  "work-with-us",
]);

/**
 * Whether a nav link must be kept (hidden at most) rather than deleted: dropdown parents ("#") and
 * links to pages that exist in code. Links to admin-created pages and external URLs can be deleted.
 */
export function isLockedNavHref(href: string) {
  const value = href.trim();
  if (value === "" || value.startsWith("#")) return true;
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  const firstSegment = value.slice(1).split(/[/?#]/)[0];
  return CODE_ROUTE_SEGMENTS.has(firstSegment);
}

/** Section types an admin can add to a custom page. */
export const CUSTOM_SECTION_TYPES = ["page-hero", "rich-content", "content-block"] as const;
export type CustomSectionType = (typeof CUSTOM_SECTION_TYPES)[number];

/** Section types that can be added to (and removed from) a page in the admin, or none. */
const SYSTEM_PAGE_SECTION_TYPES: Record<string, readonly string[]> = {
  structure: ["governance-body", "governance-meeting", "rich-content", "governance-overview", "page-hero"],
};

export function addableSectionTypes(slug: string): readonly string[] {
  return isCustomPage(slug) ? CUSTOM_SECTION_TYPES : (SYSTEM_PAGE_SECTION_TYPES[slug] ?? []);
}

export function isCustomPage(slug: string) {
  return !(SYSTEM_PAGE_SLUGS as readonly string[]).includes(slug);
}

export function isReservedSlug(slug: string) {
  return RESERVED_SLUGS.has(slug);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}
