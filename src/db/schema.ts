import {
  mysqlTable,
  varchar,
  text,
  int,
  boolean,
  timestamp,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

// MariaDB (explicit_defaults_for_timestamp=OFF here) silently coerces any
// bare nullable TIMESTAMP column into NOT NULL DEFAULT CURRENT_TIMESTAMP
// (auto-updating on every row UPDATE) unless it has an explicit default —
// every nullable timestamp column in this schema must use this.
//
// Gotcha for next time this changes: `drizzle-kit generate` emits this as
// `timestamp DEFAULT NULL` (missing the `NULL` nullability keyword), which
// MariaDB rejects with "Invalid default value" — TIMESTAMP is NOT NULL by
// default unless the column definition also has an explicit `NULL` keyword,
// unlike every other column type. Hand-patch the generated .sql to
// `timestamp NULL DEFAULT NULL` before running it (checked once, on
// migration 0002 — see docs/architecture/03-migration-plan.md history).
const nullableTimestamp = (name: string) => timestamp(name).default(sql`NULL`);

/**
 * The 7 real color schemes rendered by the design system. These map 1:1 to the
 * `.scheme-1`..`.scheme-7` utility classes ported into src/app/globals.css.
 * `scheme-8` from the original Relume export docs was never implemented in CSS
 * and is intentionally omitted — see the design audit for details.
 */
export const SCHEME_VALUES = [
  "scheme-1",
  "scheme-2",
  "scheme-3",
  "scheme-4",
  "scheme-5",
  "scheme-6",
  "scheme-7",
] as const;
export type SchemeKey = (typeof SCHEME_VALUES)[number];

const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
};

// ---------------------------------------------------------------------------
// Admin users (dashboard login)
// ---------------------------------------------------------------------------
export const adminUser = mysqlTable("admin_user", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// Site-wide settings (singleton row, id always 1)
// ---------------------------------------------------------------------------
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").primaryKey().autoincrement(),
  logoLight: varchar("logo_light", { length: 512 }).notNull(),
  logoDark: varchar("logo_dark", { length: 512 }).notNull(),
  footerDescription: text("footer_description").notNull(),
  copyrightText: varchar("copyright_text", { length: 255 }).notNull(),
  // Fixed, single-instance Contact Information block for the /contact page
  // (distinct from contact_method below, which feeds the repeatable "Get in
  // touch" cards on the home page).
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 60 }),
  contactAddress: varchar("contact_address", { length: 500 }),
  contactWorkingHours: varchar("contact_working_hours", { length: 255 }),
  contactMapEmbedUrl: varchar("contact_map_embed_url", { length: 1000 }),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// Navigation — navbar links + dropdown, and the 3 footer link groups
// ---------------------------------------------------------------------------
export const navItem = mysqlTable(
  "nav_item",
  {
    id: int("id").primaryKey().autoincrement(),
    label: varchar("label", { length: 120 }).notNull(),
    href: varchar("href", { length: 512 }).notNull(),
    location: mysqlEnum("location", ["navbar", "footer"]).notNull(),
    group: varchar("group", { length: 60 }), // e.g. "quick_links" | "connect" (footer only)
    icon: varchar("icon", { length: 60 }), // e.g. "linkedin" | "x" (footer "Connect" group only)
    parentId: int("parent_id"), // self-reference, navbar dropdown ("Resources") only
    order: int("order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("nav_item_location_idx").on(t.location, t.group)],
);

// ---------------------------------------------------------------------------
// Pages + generic sections (banner-style content with no dedicated entity)
// ---------------------------------------------------------------------------
export const page = mysqlTable("page", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  metaDescription: varchar("meta_description", { length: 500 }),
  status: mysqlEnum("status", ["draft", "published"])
    .notNull()
    .default("draft"),
  ...timestamps,
});

// Every section's own copy lives directly on this table as real, typed
// columns — no JSON blob. A given component only ever reads the subset of
// these it needs (e.g. Hero reads heading/subtitle/backgroundImage/the two
// primary CTAs and ignores the rest); unused columns stay null for that row.
// Sections that repeat an arbitrary number of images/tabs/bullets (parallax
// gallery, feature tabs, objective tabs, bullet lists) get their items from
// the three child tables below instead of a fixed column count.
export const section = mysqlTable(
  "section",
  {
    id: int("id").primaryKey().autoincrement(),
    pageId: int("page_id").notNull(),
    // Component key this section renders as, e.g. "hero", "stats".
    componentKey: varchar("component_key", { length: 80 }).notNull(),
    scheme: mysqlEnum("scheme", SCHEME_VALUES).notNull(),
    order: int("order").notNull().default(0),

    eyebrow: varchar("eyebrow", { length: 120 }),
    heading: varchar("heading", { length: 255 }),
    subtitle: text("subtitle"), // rich text (HTML), edited via the admin's rich text editor
    backgroundImage: varchar("background_image", { length: 512 }),
    icon: varchar("icon", { length: 512 }),
    imagePosition: mysqlEnum("image_position", ["left", "right"]),
    disclaimer: varchar("disclaimer", { length: 500 }),

    ctaPrimaryLabel: varchar("cta_primary_label", { length: 80 }),
    ctaPrimaryHref: varchar("cta_primary_href", { length: 512 }),
    ctaSecondaryLabel: varchar("cta_secondary_label", { length: 80 }),
    ctaSecondaryHref: varchar("cta_secondary_href", { length: 512 }),

    // A second, smaller text+CTA block some sections close with — e.g.
    // FeaturedTeam/LeadershipTeam/TechnicalTeam's "Open positions" /
    // "Join our team" block, OutcomeIntro's boxed card copy.
    secondaryEyebrow: varchar("secondary_eyebrow", { length: 120 }),
    secondaryHeading: varchar("secondary_heading", { length: 255 }),
    secondaryBody: text("secondary_body"), // rich text (HTML)
    closingCtaLabel: varchar("closing_cta_label", { length: 80 }),
    closingCtaHref: varchar("closing_cta_href", { length: 512 }),

    ...timestamps,
  },
  (t) => [index("section_page_order_idx").on(t.pageId, t.order)],
);

// Ordered image list for sections with an arbitrary number of images
// (ParallaxGallery's 6 parallax photos).
export const sectionImage = mysqlTable(
  "section_image",
  {
    id: int("id").primaryKey().autoincrement(),
    sectionId: int("section_id").notNull(),
    url: varchar("url", { length: 512 }).notNull(),
    altText: varchar("alt_text", { length: 255 }),
    order: int("order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("section_image_section_idx").on(t.sectionId, t.order)],
);

// Repeating tab/card items — FeatureTabsMedia's 3 image-or-video tabs and
// ObjectivesTabs' N objectives both use this shape (icon is only used by
// ObjectivesTabs, video only by FeatureTabsMedia's video tab; both stay
// null for the sections that don't use them).
export const sectionTab = mysqlTable(
  "section_tab",
  {
    id: int("id").primaryKey().autoincrement(),
    sectionId: int("section_id").notNull(),
    order: int("order").notNull().default(0),
    icon: varchar("icon", { length: 512 }),
    tabLabel: varchar("tab_label", { length: 80 }),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(), // rich text (HTML)
    image: varchar("image", { length: 512 }),
    videoUrl: varchar("video_url", { length: 512 }),
    ctaPrimaryLabel: varchar("cta_primary_label", { length: 80 }),
    ctaPrimaryHref: varchar("cta_primary_href", { length: 512 }),
    ctaSecondaryLabel: varchar("cta_secondary_label", { length: 80 }),
    ctaSecondaryHref: varchar("cta_secondary_href", { length: 512 }),
    ...timestamps,
  },
  (t) => [index("section_tab_section_idx").on(t.sectionId, t.order)],
);

// Short bullet-list lines (OutcomeFeature's 3-item lists).
export const sectionBullet = mysqlTable(
  "section_bullet",
  {
    id: int("id").primaryKey().autoincrement(),
    sectionId: int("section_id").notNull(),
    text: varchar("text", { length: 255 }).notNull(),
    order: int("order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("section_bullet_section_idx").on(t.sectionId, t.order)],
);

// ---------------------------------------------------------------------------
// Home hero carousel — each slide is a full-height background image + title
// + description; "See more" optionally links to a rich-text page authored
// entirely from these same columns (no separate page table needed since a
// slide has at most one linked page).
// ---------------------------------------------------------------------------
export const heroSlide = mysqlTable(
  "hero_slide",
  {
    id: int("id").primaryKey().autoincrement(),
    order: int("order").notNull().default(0),
    backgroundImage: varchar("background_image", { length: 512 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    seeMoreEnabled: boolean("see_more_enabled").notNull().default(false),
    pageSlug: varchar("page_slug", { length: 200 }).unique(),
    pageTitle: varchar("page_title", { length: 255 }),
    pageBody: text("page_body"), // rich text (HTML), mixed text + images
    ...timestamps,
  },
  (t) => [index("hero_slide_order_idx").on(t.order)],
);

// ---------------------------------------------------------------------------
// Newsletter subscribers (Stay informed section)
// ---------------------------------------------------------------------------
export const subscriber = mysqlTable("subscriber", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// Contact methods (contact-methods section — email / phone / office)
// ---------------------------------------------------------------------------
export const contactMethod = mysqlTable("contact_method", {
  id: int("id").primaryKey().autoincrement(),
  type: mysqlEnum("type", ["email", "phone", "office"]).notNull(),
  title: varchar("title", { length: 120 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  order: int("order").notNull().default(0),
  ...timestamps,
});

// "Write Us" submissions from the /contact page.
export const contactMessage = mysqlTable("contact_message", {
  id: int("id").primaryKey().autoincrement(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  organization: varchar("organization", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// Team members — one table for all 3 rosters (Home featured, About, Team page)
// ---------------------------------------------------------------------------
export const teamMember = mysqlTable(
  "team_member",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 160 }).notNull(),
    role: varchar("role", { length: 160 }).notNull(),
    bio: text("bio"),
    photo: varchar("photo", { length: 512 }),
    email: varchar("email", { length: 255 }),
    linkedinUrl: varchar("linkedin_url", { length: 512 }),
    xUrl: varchar("x_url", { length: 512 }),
    dribbbleUrl: varchar("dribbble_url", { length: 512 }),
    group: mysqlEnum("group", ["leadership", "technical"]).notNull(),
    status: mysqlEnum("status", ["active", "vacant"])
      .notNull()
      .default("active"),
    order: int("order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("team_member_group_idx").on(t.group, t.order)],
);

// ---------------------------------------------------------------------------
// Blog posts (blog-list section)
// ---------------------------------------------------------------------------
export const blogPost = mysqlTable("blog_post", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: varchar("excerpt", { length: 500 }).notNull(),
  body: text("body"),
  coverImage: varchar("cover_image", { length: 512 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["draft", "published"])
    .notNull()
    .default("draft"),
  publishedAt: nullableTimestamp("published_at"),
  // News/Events unification: one item, shown on /news always and on /events
  // too when flagged — avoids creating the same content twice.
  isEvent: boolean("is_event").notNull().default(false),
  eventDate: nullableTimestamp("event_date"),
  eventLocation: varchar("event_location", { length: 255 }),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// Member states ("Signatory States") + partners ("Core Partners")
// ---------------------------------------------------------------------------
export const memberState = mysqlTable("member_state", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 160 }).notNull(),
  flagImage: varchar("flag_image", { length: 512 }).notNull(),
  isSignatory: boolean("is_signatory").notNull().default(true),
  order: int("order").notNull().default(0),
  // --- Country Profile page (/countries/[slug]) — all nullable: a country
  // only gets a public profile page once `slug` is set ("published"); until
  // then it still renders in the plain flag grid as before. ---
  slug: varchar("slug", { length: 200 }).unique(),
  description: text("description"),
  heroImage: varchar("hero_image", { length: 512 }),
  region: varchar("region", { length: 120 }),
  capital: varchar("capital", { length: 120 }),
  population: varchar("population", { length: 60 }),
  area: varchar("area", { length: 60 }),
  founded: varchar("founded", { length: 120 }),
  timeZone: varchar("time_zone", { length: 60 }),
  renewableEnergySharesImage: varchar("renewable_energy_shares_image", {
    length: 512,
  }),
  bySourceImage: varchar("by_source_image", { length: 512 }),
  ...timestamps,
});

export const PARTNER_CATEGORY_VALUES = [
  "institutional_strategic",
  "knowledge_development",
  "events_initiatives",
] as const;
export type PartnerCategory = (typeof PARTNER_CATEGORY_VALUES)[number];

export const partner = mysqlTable("partner", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 160 }).notNull(),
  logoImage: varchar("logo_image", { length: 512 }).notNull(),
  link: varchar("link", { length: 512 }), // "Visit Website" action
  category: mysqlEnum("category", PARTNER_CATEGORY_VALUES)
    .notNull()
    .default("institutional_strategic"),
  statusLabel: varchar("status_label", { length: 120 }), // e.g. "Strategic Partner"
  badge: varchar("badge", { length: 160 }), // e.g. "MoU Signed · 2 June 2026"
  description: varchar("description", { length: 500 }),
  viewMoreUrl: varchar("view_more_url", { length: 512 }), // "View More" action — related CECECO news/event page
  order: int("order").notNull().default(0),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// Projects — status-driven listing + detail pages, with conditionally-shown
// application fields (applicationsOpen gates Apply Now/How to Apply/apply_url).
// ---------------------------------------------------------------------------
export const project = mysqlTable("project", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  shortDescription: varchar("short_description", { length: 500 }).notNull(),
  coverImage: varchar("cover_image", { length: 512 }).notNull(),
  status: mysqlEnum("status", ["ongoing", "upcoming", "completed"]).notNull(),
  periodStart: nullableTimestamp("period_start"),
  periodEnd: nullableTimestamp("period_end"),
  applicationsOpen: boolean("applications_open").notNull().default(false),
  applicationDeadline: nullableTimestamp("application_deadline"),
  whoCanApply: varchar("who_can_apply", { length: 255 }),
  aboutBody: text("about_body"), // rich text (HTML)
  howToApplyBody: text("how_to_apply_body"), // rich text (HTML), shown only when applicationsOpen
  applyUrl: varchar("apply_url", { length: 512 }),
  isRegionalInitiative: boolean("is_regional_initiative")
    .notNull()
    .default(false),
  order: int("order").notNull().default(0),
  ...timestamps,
});

// Short bullet-list lines (Project Detail's "Objectives") — same shape as
// section_bullet, kept separate since it belongs to project, not section.
export const projectObjective = mysqlTable(
  "project_objective",
  {
    id: int("id").primaryKey().autoincrement(),
    projectId: int("project_id").notNull(),
    text: varchar("text", { length: 255 }).notNull(),
    order: int("order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("project_objective_project_idx").on(t.projectId, t.order)],
);

// ---------------------------------------------------------------------------
// Resources — Opportunities ("Work With Us": internships/vacancies/YPP/
// other — job/grant/tender are legacy values kept in the enum only so old
// rows stay valid, not offered for new rows), Publications (own detail
// page, same shape as blog_post), Misc (plain link cards).
// ---------------------------------------------------------------------------
export const opportunity = mysqlTable("opportunity", {
  id: int("id").primaryKey().autoincrement(),
  // Nullable at the DB level (not backed by a NOT NULL constraint) purely to
  // keep this an additive, zero-risk migration on top of existing rows —
  // the admin form requires both, so in practice they're always set.
  slug: varchar("slug", { length: 200 }).unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  description: text("description").notNull(), // rich text (HTML)
  category: mysqlEnum("category", [
    "job",
    "grant",
    "tender",
    "internship",
    "vacancy",
    "young_professional_programme",
    "other",
  ]).notNull(),
  deadline: nullableTimestamp("deadline"),
  applyUrl: varchar("apply_url", { length: 512 }).notNull(),
  status: mysqlEnum("status", ["active", "closed"]).notNull().default("active"),
  ...timestamps,
});

export const publication = mysqlTable("publication", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: varchar("excerpt", { length: 500 }).notNull(),
  body: text("body"), // rich text (HTML) — secondary context now; fileUrl + excerpt carry the listing/detail UI
  coverImage: varchar("cover_image", { length: 512 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["draft", "published"])
    .notNull()
    .default("draft"),
  publishedAt: nullableTimestamp("published_at"),
  // --- Feedback round 2 (Əmr 4 §1-3): the actual document + its metadata.
  // All nullable — existing rows predate this and the Download/View Online
  // block just hides gracefully until an admin backfills fileUrl. ---
  fileUrl: varchar("file_url", { length: 512 }),
  fileFormat: varchar("file_format", { length: 20 }), // "PDF" | "Word" | "Other"
  fileSizeBytes: int("file_size_bytes"),
  language: varchar("language", { length: 60 }),
  pages: int("pages"),
  publishedBy: varchar("published_by", { length: 160 }),
  ...timestamps,
});

// Not used by the live Media page anymore (see media_item below, added for
// Əmr 4 §4) — kept as-is, un-dropped, per the DB safety rule (no DROP TABLE
// without explicit confirmation). Nothing currently references it.
export const miscResource = mysqlTable("misc_resource", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  link: varchar("link", { length: 512 }).notNull(),
  order: int("order").notNull().default(0),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// Media (Əmr 4 §4) — Photos/Videos/Press Materials for /resources/media.
// Distinct from Publications/Reports/Documents: the point isn't a
// downloadable file, it's a gallery of images or an embedded video.
// ---------------------------------------------------------------------------
export const MEDIA_TYPE_VALUES = ["photo_gallery", "video", "press"] as const;
export type MediaType = (typeof MEDIA_TYPE_VALUES)[number];

export const mediaItem = mysqlTable("media_item", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("type", MEDIA_TYPE_VALUES).notNull(),
  description: varchar("description", { length: 500 }),
  thumbnail: varchar("thumbnail", { length: 512 }).notNull(),
  eventDate: nullableTimestamp("event_date"),
  videoUrl: varchar("video_url", { length: 512 }), // type="video" only
  status: mysqlEnum("status", ["draft", "published"])
    .notNull()
    .default("draft"),
  order: int("order").notNull().default(0),
  ...timestamps,
});

// type="photo_gallery" items' images — project_objective/section_image
// pattern (ordered child rows, not a fixed column count).
export const mediaGalleryImage = mysqlTable(
  "media_gallery_image",
  {
    id: int("id").primaryKey().autoincrement(),
    mediaItemId: int("media_item_id").notNull(),
    image: varchar("image", { length: 512 }).notNull(),
    order: int("order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("media_gallery_image_media_idx").on(t.mediaItemId, t.order)],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------
export const mediaItemRelations = relations(mediaItem, ({ many }) => ({
  galleryImages: many(mediaGalleryImage),
}));

export const mediaGalleryImageRelations = relations(
  mediaGalleryImage,
  ({ one }) => ({
    mediaItem: one(mediaItem, {
      fields: [mediaGalleryImage.mediaItemId],
      references: [mediaItem.id],
    }),
  }),
);
export const pageRelations = relations(page, ({ many }) => ({
  sections: many(section),
}));

export const sectionRelations = relations(section, ({ one, many }) => ({
  page: one(page, { fields: [section.pageId], references: [page.id] }),
  images: many(sectionImage),
  tabs: many(sectionTab),
  bullets: many(sectionBullet),
}));

export const sectionImageRelations = relations(sectionImage, ({ one }) => ({
  section: one(section, {
    fields: [sectionImage.sectionId],
    references: [section.id],
  }),
}));

export const sectionTabRelations = relations(sectionTab, ({ one }) => ({
  section: one(section, {
    fields: [sectionTab.sectionId],
    references: [section.id],
  }),
}));

export const sectionBulletRelations = relations(sectionBullet, ({ one }) => ({
  section: one(section, {
    fields: [sectionBullet.sectionId],
    references: [section.id],
  }),
}));

export const projectRelations = relations(project, ({ many }) => ({
  objectives: many(projectObjective),
}));

export const projectObjectiveRelations = relations(
  projectObjective,
  ({ one }) => ({
    project: one(project, {
      fields: [projectObjective.projectId],
      references: [project.id],
    }),
  }),
);

// ---------------------------------------------------------------------------
// Row types, for query functions and components to import instead of
// redeclaring shapes by hand.
// ---------------------------------------------------------------------------
export type SectionRow = typeof section.$inferSelect;
export type SectionImageRow = typeof sectionImage.$inferSelect;
export type SectionTabRow = typeof sectionTab.$inferSelect;
export type SectionBulletRow = typeof sectionBullet.$inferSelect;
export type NavItemRow = typeof navItem.$inferSelect;
export type HeroSlideRow = typeof heroSlide.$inferSelect;
export type SubscriberRow = typeof subscriber.$inferSelect;
export type BlogPostRow = typeof blogPost.$inferSelect;
export type TeamMemberRow = typeof teamMember.$inferSelect;
export type ContactMethodRow = typeof contactMethod.$inferSelect;
export type MemberStateRow = typeof memberState.$inferSelect;
export type PartnerRow = typeof partner.$inferSelect;
export type OpportunityRow = typeof opportunity.$inferSelect;
export type PublicationRow = typeof publication.$inferSelect;
export type MiscResourceRow = typeof miscResource.$inferSelect;
export type MediaItemRow = typeof mediaItem.$inferSelect;
export type MediaGalleryImageRow = typeof mediaGalleryImage.$inferSelect;
export type ProjectRow = typeof project.$inferSelect;
export type ProjectObjectiveRow = typeof projectObjective.$inferSelect;
export type ContactMessageRow = typeof contactMessage.$inferSelect;
