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
  "team",
  "terms-of-service",
  "vision-and-mission",
] as const;

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

/** Section types an admin can add to a custom page. */
export const CUSTOM_SECTION_TYPES = ["page-hero", "rich-content", "content-block"] as const;
export type CustomSectionType = (typeof CUSTOM_SECTION_TYPES)[number];

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
