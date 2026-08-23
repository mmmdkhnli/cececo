import { RichText } from "@/components/shared/rich-text";
import type { SectionRow } from "@/db/schema";

export function LegalContent({
  section,
  scheme,
}: {
  section: SectionRow;
  scheme: string;
}) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme}`}>
      <div className="container max-w-3xl">
        <RichText html={section.subtitle} className="text-medium" />
      </div>
    </section>
  );
}
