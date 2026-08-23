import { CtaGroup } from "@/components/shared/cta-group";
import { RichText } from "@/components/shared/rich-text";
import type { SectionRow, SectionBulletRow } from "@/db/schema";

export function OutcomeFeature({
  section,
  bullets,
  scheme,
}: {
  section: SectionRow;
  bullets: SectionBulletRow[];
  scheme: string;
}) {
  const imageFirst = section.imagePosition === "left";
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} badge-alt`}>
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-x-20">
          <div className={imageFirst ? "order-2 md:order-1" : ""}>
            {section.backgroundImage && (
              <img src={section.backgroundImage} className="w-full rounded-image object-cover" alt="" />
            )}
          </div>
          <div className={imageFirst ? "order-1 md:order-2" : ""}>
            <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
            <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
            <RichText html={section.subtitle} className={bullets.length ? "mb-5 text-medium md:mb-6" : "text-medium"} />
            {bullets.length > 0 && (
              <ul className="my-4 list-disc pl-5">
                {bullets.map((bullet) => (
                  <li key={bullet.id} className="my-1 self-start pl-2">
                    <p>{bullet.text}</p>
                  </li>
                ))}
              </ul>
            )}
            <CtaGroup
              className="mt-6 flex flex-wrap gap-4 md:mt-8"
              primary={{ label: section.ctaPrimaryLabel, href: section.ctaPrimaryHref, variant: "secondary" }}
              secondary={{ label: section.ctaSecondaryLabel, href: section.ctaSecondaryHref, variant: "link" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
