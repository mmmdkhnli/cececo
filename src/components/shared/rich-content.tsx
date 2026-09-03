import { RichText } from "@/components/shared/rich-text";
import type { SectionRow } from "@/db/schema";

/**
 * Long-form section: one rich-text body at a comfortable reading width, with nothing forcing an
 * alignment, so the editor's own alignment controls decide how each paragraph sits.
 */
export function RichContent({ section, scheme }: { section: SectionRow; scheme: string }) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme}`}>
      <div className="container max-w-3xl">
        {section.eyebrow && <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>}
        {section.heading && <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>}
        <RichText html={section.subtitle} className="text-medium" />
        {section.backgroundImage && (
          <img
            src={section.backgroundImage}
            alt=""
            className="mt-12 aspect-video w-full rounded-image object-cover md:mt-16"
          />
        )}
      </div>
    </section>
  );
}
