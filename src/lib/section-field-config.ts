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
  | "imagePosition";

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
  "outcome-intro": {
    fields: [
      "eyebrow",
      "heading",
      "subtitle",
      "backgroundImage",
      "ctaPrimary",
      "ctaSecondary",
      "secondary",
    ],
  },
  "outcome-feature": {
    fields: [
      "eyebrow",
      "heading",
      "subtitle",
      "backgroundImage",
      "ctaPrimary",
      "ctaSecondary",
      "imagePosition",
    ],
    repeater: "bullets",
  },
  "member-states-grid": { fields: ["eyebrow", "heading", "subtitle"] },
  "partners-grid": { fields: ["eyebrow", "heading", "subtitle"] },
  "content-block": {
    fields: ["eyebrow", "heading", "subtitle", "backgroundImage"],
  },
  "legal-content": { fields: ["subtitle"] },
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
  "outcome-intro": "Intro",
  "outcome-feature": "Feature block",
  "member-states-grid": "Member states",
  "partners-grid": "Partners",
  "content-block": "Content block",
  "legal-content": "Legal text",
};
