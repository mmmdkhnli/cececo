import { RichText } from "@/components/shared/rich-text";
import type { SectionRow } from "@/db/schema";

// Shared hero used as-is by About, Our Work, Partners, and Team pages.
export function PageHero({ section, scheme }: { section: SectionRow; scheme: string }) {
  return (
    <section className={`relative px-[5%] py-20 md:py-24 lg:py-28 ${scheme} btn-dark badge-alt alternate logo-alt`}>
      <div className="relative z-10 container max-w-lg text-center">
        <h1 className="mb-5 text-h1 font-bold text-white md:mb-6">{section.heading}</h1>
        <RichText html={section.subtitle} className="text-medium text-white" />
      </div>
      <div className="absolute inset-0 z-0">
        {section.backgroundImage && (
          <img src={section.backgroundImage} className="size-full object-cover" alt="" />
        )}
        <div className="absolute inset-0 bg-neutral-darkest/50" />
      </div>
    </section>
  );
}
