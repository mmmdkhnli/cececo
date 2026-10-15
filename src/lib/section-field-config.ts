export type SectionFieldKey =
  | "eyebrow"
  | "heading"
  | "subtitle"
  | "backgroundImage"
  | "icon"
  | "ctaPrimary"
  | "ctaSecondary"
  | "secondary"
  | "closingCta"
  | "disclaimer"
  | "imagePosition"
  | "listHeading";

export type SectionRepeater = "images" | "tabs" | "bullets";

export type SectionFieldConfig = {
  fields: SectionFieldKey[];
  repeater?: SectionRepeater;
};

export const SECTION_FIELD_CONFIG: Record<string, SectionFieldConfig> = {
  "blog-list": { fields: ["eyebrow", "heading", "subtitle", "ctaPrimary"] },
  "contact-methods": { fields: ["eyebrow", "heading", "subtitle"] },
  "newsletter-cta": { fields: ["heading", "subtitle", "disclaimer"] },
  "page-hero": { fields: ["heading", "subtitle", "backgroundImage"] },
  origin: {
    fields: [
      "eyebrow",
      "heading",
      "subtitle",
      "backgroundImage",
      "ctaPrimary",
      "ctaSecondary",
    ],
  },
  purpose: {
    fields: [
      "icon",
      "eyebrow",
      "heading",
      "subtitle",
      "backgroundImage",
      "ctaPrimary",
      "ctaSecondary",
    ],
  },
  "objectives-tabs": {
    fields: ["eyebrow", "heading", "subtitle"],
    repeater: "tabs",
  },
  "leadership-team": {
    fields: ["eyebrow", "heading", "subtitle", "secondary", "closingCta"],
  },
  "technical-team": {
    fields: ["eyebrow", "heading", "subtitle", "secondary", "closingCta"],
  },
  "member-states-grid": { fields: ["eyebrow", "heading", "subtitle"] },
  "partners-grid": { fields: ["eyebrow", "heading", "subtitle"] },
  "content-block": {
    fields: ["eyebrow", "heading", "subtitle", "backgroundImage"],
  },
  "legal-content": { fields: ["subtitle"] },
  "contact-scheme": { fields: [] },
  "rich-content": {
    fields: ["eyebrow", "heading", "subtitle", "backgroundImage"],
  },
  "governance-overview": { fields: ["eyebrow", "heading", "subtitle"] },
  "governance-body": { fields: ["heading", "eyebrow", "disclaimer", "subtitle"] },
  "governance-meeting": {
    fields: ["eyebrow", "heading", "subtitle", "listHeading", "disclaimer"],
    repeater: "bullets",
  },
};

/** Per-component wording for generic fields whose default label would be misleading. */
export const SECTION_FIELD_LABELS: Record<string, Partial<Record<SectionFieldKey, string>>> = {
  "governance-overview": { subtitle: "Introduction" },
  "governance-body": {
    eyebrow: "Source reference (e.g. Charter, Article IV, paragraph 1)",
    disclaimer: "Short summary (shown on the overview card)",
    subtitle: "Mandate, composition and meetings",
  },
  "governance-meeting": {
    eyebrow: "Meeting details (date, format)",
    subtitle: "Summary",
    listHeading: "List heading (shown above the list items below)",
    disclaimer: "Source note (e.g. based on the draft report)",
  },
};

export type TabStyle = "icon-objective" | "media-tab";

export const TAB_STYLE_BY_COMPONENT: Record<string, TabStyle> = {
  "objectives-tabs": "icon-objective",
};

export const SECTION_LABELS: Record<string, string> = {
  "page-hero": "Hero banner",
  "blog-list": "News",
  "contact-methods": "Contact (Get in touch)",
  "newsletter-cta": "Stay informed",
  origin: "Origin",
  purpose: "Purpose",
  "objectives-tabs": "Objectives",
  "leadership-team": "Leadership",
  "technical-team": "Technical team",
  "member-states-grid": "Member states",
  "partners-grid": "Partners",
  "content-block": "Content block",
  "legal-content": "Legal text",
  "contact-scheme": "Color scheme",
  "rich-content": "Rich content",
  "governance-overview": "Governance introduction",
  "governance-body": "Governance body",
  "governance-meeting": "Meeting summary",
};
