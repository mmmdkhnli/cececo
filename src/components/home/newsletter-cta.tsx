import { NewsletterForm } from "@/components/shared/newsletter-form";
import { RichText } from "@/components/shared/rich-text";
import type { SectionRow } from "@/db/schema";

export function NewsletterCta({ section, scheme }: { section: SectionRow; scheme: string }) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} alternate logo-alt`}>
      <div className="container max-w-lg text-center">
        <div>
          <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
          <RichText html={section.subtitle} className="text-medium" />
          <div className="mx-auto mt-6 w-full max-w-sm md:mt-8">
            <NewsletterForm
              buttonVariant="default"
              formClassName="mb-4 grid max-w-sm grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4"
              buttonClassName="items-center justify-center px-6 py-3"
            />
            <p className="text-tiny">{section.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
