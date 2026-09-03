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

const nullableTimestamp = (name: string) => timestamp(name).default(sql`NULL`);

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

export const adminUser = mysqlTable("admin_user", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  ...timestamps,
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").primaryKey().autoincrement(),
  logoLight: varchar("logo_light", { length: 512 }).notNull(),
  logoDark: varchar("logo_dark", { length: 512 }).notNull(),
  footerDescription: text("footer_description").notNull(),
  copyrightText: varchar("copyright_text", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 60 }),
  contactAddress: varchar("contact_address", { length: 500 }),
  contactWorkingHours: varchar("contact_working_hours", { length: 255 }),
  contactMapEmbedUrl: varchar("contact_map_embed_url", { length: 1000 }),
  ...timestamps,
});

export const navItem = mysqlTable(
  "nav_item",
  {
    id: int("id").primaryKey().autoincrement(),
    label: varchar("label", { length: 120 }).notNull(),
    href: varchar("href", { length: 512 }).notNull(),
    location: mysqlEnum("location", ["navbar", "footer"]).notNull(),
    group: varchar("group", { length: 60 }),
    icon: varchar("icon", { length: 60 }),
    parentId: int("parent_id"),
    order: int("order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("nav_item_location_idx").on(t.location, t.group)],
);

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

export const section = mysqlTable(
  "section",
  {
    id: int("id").primaryKey().autoincrement(),
    pageId: int("page_id").notNull(),
    componentKey: varchar("component_key", { length: 80 }).notNull(),
    scheme: mysqlEnum("scheme", SCHEME_VALUES).notNull(),
    order: int("order").notNull().default(0),

    eyebrow: varchar("eyebrow", { length: 120 }),
    heading: varchar("heading", { length: 255 }),
    subtitle: text("subtitle"),
    backgroundImage: varchar("background_image", { length: 512 }),
    icon: varchar("icon", { length: 512 }),
    imagePosition: mysqlEnum("image_position", ["left", "right"]),
    disclaimer: varchar("disclaimer", { length: 500 }),

    ctaPrimaryLabel: varchar("cta_primary_label", { length: 80 }),
    ctaPrimaryHref: varchar("cta_primary_href", { length: 512 }),
    ctaSecondaryLabel: varchar("cta_secondary_label", { length: 80 }),
    ctaSecondaryHref: varchar("cta_secondary_href", { length: 512 }),

    secondaryEyebrow: varchar("secondary_eyebrow", { length: 120 }),
    secondaryHeading: varchar("secondary_heading", { length: 255 }),
    secondaryBody: text("secondary_body"),
    closingCtaLabel: varchar("closing_cta_label", { length: 80 }),
    closingCtaHref: varchar("closing_cta_href", { length: 512 }),

    ...timestamps,
  },
  (t) => [index("section_page_order_idx").on(t.pageId, t.order)],
);

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

export const sectionTab = mysqlTable(
  "section_tab",
  {
    id: int("id").primaryKey().autoincrement(),
    sectionId: int("section_id").notNull(),
    order: int("order").notNull().default(0),
    icon: varchar("icon", { length: 512 }),
    tabLabel: varchar("tab_label", { length: 80 }),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
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

export const heroSlide = mysqlTable(
  "hero_slide",
  {
    id: int("id").primaryKey().autoincrement(),
    order: int("order").notNull().default(0),
    backgroundImage: varchar("background_image", { length: 512 }).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    seeMoreEnabled: boolean("see_more_enabled").notNull().default(false),
    pageSlug: varchar("page_slug", { length: 200 }).unique(),
    pageTitle: varchar("page_title", { length: 255 }),
    pageBody: text("page_body"),
    linkedHref: varchar("linked_href", { length: 512 }),
    linkedLabel: varchar("linked_label", { length: 255 }),
    ...timestamps,
  },
  (t) => [index("hero_slide_order_idx").on(t.order)],
);

export const subscriber = mysqlTable("subscriber", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  ...timestamps,
});

export const contactMethod = mysqlTable("contact_method", {
  id: int("id").primaryKey().autoincrement(),
  type: mysqlEnum("type", ["email", "phone", "office"]).notNull(),
  title: varchar("title", { length: 120 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  link: varchar("link", { length: 1000 }),
  order: int("order").notNull().default(0),
  ...timestamps,
});

export const contactMessage = mysqlTable("contact_message", {
  id: int("id").primaryKey().autoincrement(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  organization: varchar("organization", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  ...timestamps,
});

export const teamMember = mysqlTable(
  "team_member",
  {
    id: int("id").primaryKey().autoincrement(),
    slug: varchar("slug", { length: 200 }).unique(),
    name: varchar("name", { length: 160 }).notNull(),
    role: varchar("role", { length: 160 }).notNull(),
    bio: text("bio"),
    hasDetailPage: boolean("has_detail_page").notNull().default(false),
    detailBody: text("detail_body"),
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
  isEvent: boolean("is_event").notNull().default(false),
  eventDate: nullableTimestamp("event_date"),
  eventLocation: varchar("event_location", { length: 255 }),
  viewCount: int("view_count").notNull().default(0),
  ...timestamps,
});

export const memberState = mysqlTable("member_state", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 160 }).notNull(),
  flagImage: varchar("flag_image", { length: 512 }).notNull(),
  isSignatory: boolean("is_signatory").notNull().default(true),
  order: int("order").notNull().default(0),
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
  link: varchar("link", { length: 512 }),
  category: mysqlEnum("category", PARTNER_CATEGORY_VALUES)
    .notNull()
    .default("institutional_strategic"),
  statusLabel: varchar("status_label", { length: 120 }),
  badge: varchar("badge", { length: 160 }),
  description: varchar("description", { length: 500 }),
  viewMoreUrl: varchar("view_more_url", { length: 512 }),
  order: int("order").notNull().default(0),
  ...timestamps,
});

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
  aboutBody: text("about_body"),
  howToApplyBody: text("how_to_apply_body"),
  applyUrl: varchar("apply_url", { length: 512 }),
  isRegionalInitiative: boolean("is_regional_initiative")
    .notNull()
    .default(false),
  order: int("order").notNull().default(0),
  ...timestamps,
});

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

export const opportunity = mysqlTable("opportunity", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 200 }).unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  description: text("description").notNull(),
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
  body: text("body"),
  coverImage: varchar("cover_image", { length: 512 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["draft", "published"])
    .notNull()
    .default("draft"),
  publishedAt: nullableTimestamp("published_at"),
  fileUrl: varchar("file_url", { length: 512 }),
  fileFormat: varchar("file_format", { length: 20 }),
  fileSizeBytes: int("file_size_bytes"),
  language: varchar("language", { length: 60 }),
  pages: int("pages"),
  publishedBy: varchar("published_by", { length: 160 }),
  ...timestamps,
});

export const miscResource = mysqlTable("misc_resource", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  link: varchar("link", { length: 512 }).notNull(),
  order: int("order").notNull().default(0),
  ...timestamps,
});

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
export type ProjectRow = typeof project.$inferSelect;
export type ProjectObjectiveRow = typeof projectObjective.$inferSelect;
export type ContactMessageRow = typeof contactMessage.$inferSelect;
