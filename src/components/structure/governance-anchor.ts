import type { SectionRow } from "@/db/schema";
import { slugify } from "@/lib/custom-pages";

export function governanceAnchor(section: SectionRow) {
  return slugify(section.heading ?? "") || `section-${section.id}`;
}
