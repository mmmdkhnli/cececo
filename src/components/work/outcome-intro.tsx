import { Card } from "@/components/ui/card";
import { CtaGroup } from "@/components/shared/cta-group";
import { RichText } from "@/components/shared/rich-text";
import type { SectionRow } from "@/db/schema";

export function OutcomeIntro({ section, scheme }: { section: SectionRow; scheme: string }) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme}`}>
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
            <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
            <RichText html={section.subtitle} className="text-medium" />
          </div>
        </div>
        <Card className="grid auto-cols-fr grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center p-6 md:p-8 lg:p-12">
            <div>
              <p className="mb-2 text-small font-semibold">{section.secondaryEyebrow}</p>
              <h3 className="mb-5 text-h3 font-bold md:mb-6">{section.secondaryHeading}</h3>
              <RichText html={section.secondaryBody} />
            </div>
            <CtaGroup
              primary={{ label: section.ctaPrimaryLabel, href: section.ctaPrimaryHref, variant: "secondary" }}
              secondary={{ label: section.ctaSecondaryLabel, href: section.ctaSecondaryHref, variant: "link" }}
            />
          </div>
          <div className="flex items-center justify-center">
            {section.backgroundImage && (
              <img src={section.backgroundImage} className="size-full object-cover" alt="" />
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
