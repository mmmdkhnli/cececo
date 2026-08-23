import { RichText } from "@/components/shared/rich-text";
import type { SectionRow } from "@/db/schema";

// Generic eyebrow + heading + rich text + image block, reusable by any page
// that just needs a simple content section (e.g. Vision and Mission).
export function ContentBlock({ section, scheme }: { section: SectionRow; scheme: string }) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme}`}>
      <div className="container flex flex-col items-center text-center">
        <div className="mx-auto w-full max-w-lg">
          {section.eyebrow && <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>}
          <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
          <RichText html={section.subtitle} className="text-medium" />
        </div>
        {section.backgroundImage && (
          <div className="mt-12 w-full md:mt-16">
            <img
              src={section.backgroundImage}
              className="aspect-video size-full rounded-image object-cover"
              alt=""
            />
          </div>
        )}
      </div>
    </section>
  );
}
