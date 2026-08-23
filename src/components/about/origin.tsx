import { CtaGroup } from "@/components/shared/cta-group";
import { RichText } from "@/components/shared/rich-text";
import type { SectionRow } from "@/db/schema";

export function Origin({ section, scheme }: { section: SectionRow; scheme: string }) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} badge-alt alternate logo-alt`}>
      <div className="container flex flex-col items-center text-center">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
            <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
            <RichText html={section.subtitle} className="text-medium" />
            <CtaGroup
              className="mt-6 flex items-center justify-center gap-x-4 md:mt-8"
              primary={{ label: section.ctaPrimaryLabel, href: section.ctaPrimaryHref, variant: "secondary" }}
              secondary={{ label: section.ctaSecondaryLabel, href: section.ctaSecondaryHref, variant: "link" }}
            />
          </div>
        </div>
        <div className="w-full">
          {section.backgroundImage && (
            <img
              src={section.backgroundImage}
              className="aspect-video size-full rounded-image object-cover"
              alt=""
            />
          )}
        </div>
      </div>
    </section>
  );
}
