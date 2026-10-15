import { RichText } from "@/components/shared/rich-text";
import type { SectionRow } from "@/db/schema";
import { governanceAnchor } from "@/components/structure/governance-anchor";

/** One Charter-defined governance body: number + heading on the left, mandate and composition on the right. */
export function GovernanceBody({ section, scheme, index }: { section: SectionRow; scheme: string; index: number }) {
  return (
    <section
      id={governanceAnchor(section)}
      className={`scroll-mt-28 px-[5%] pt-16 pb-8 md:pt-24 md:pb-12 lg:pt-28 ${scheme}`}
    >
      <div className="container grid grid-cols-1 gap-y-6 border-t border-scheme-border pt-12 md:pt-16 lg:grid-cols-[1fr_2fr] lg:gap-x-20">
        <div>
          <span className="text-h4 font-bold text-scheme-accent" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="mt-3 text-h3 font-bold md:text-h2">{section.heading}</h2>
          {section.eyebrow && <p className="mt-3 text-scheme-text-muted">{section.eyebrow}</p>}
        </div>
        <RichText html={section.subtitle} className="text-medium" />
      </div>
    </section>
  );
}
