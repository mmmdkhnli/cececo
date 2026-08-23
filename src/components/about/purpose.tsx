import { CtaGroup } from "@/components/shared/cta-group";
import { RichText } from "@/components/shared/rich-text";
import type { SectionRow } from "@/db/schema";

export function Purpose({ section, scheme }: { section: SectionRow; scheme: string }) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} badge-alt`}>
      <div className="container flex flex-col items-center text-center">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg">
            {section.icon && (
              <div className="mb-5 inline-block md:mb-6">
                <img className="size-20 text-scheme-text" src={section.icon} alt="" />
              </div>
            )}
            <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
            <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
            <RichText html={section.subtitle} className="text-medium" />
            <CtaGroup
              className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8"
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
