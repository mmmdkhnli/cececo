import { RichText } from "@/components/shared/rich-text";
import type { SectionBulletRow, SectionRow } from "@/db/schema";

/**
 * A meeting summary that sits under its governance body. Kept as its own section so meeting
 * information can change without touching the Charter-based description above it.
 */
export function GovernanceMeeting({
  section,
  scheme,
  bullets,
}: {
  section: SectionRow;
  scheme: string;
  bullets: SectionBulletRow[];
}) {
  return (
    <section className={`px-[5%] pb-16 md:pb-24 lg:pb-28 ${scheme}`}>
      <div className="container grid grid-cols-1 lg:grid-cols-[1fr_2fr] lg:gap-x-20">
        <article className="rounded-card border-l-4 border-scheme-accent bg-scheme-foreground p-6 md:p-8 lg:col-start-2">
          {section.eyebrow && <p className="mb-2 text-small font-semibold uppercase tracking-wide text-scheme-text-muted">{section.eyebrow}</p>}
          {section.heading && <h3 className="mb-4 text-h5 font-bold md:text-h4">{section.heading}</h3>}
          <RichText html={section.subtitle} className="text-medium" />
          {bullets.length > 0 && (
            <div className="mt-6">
              {section.secondaryHeading && <h4 className="mb-3 text-h6 font-bold">{section.secondaryHeading}</h4>}
              <ul className="grid list-disc grid-cols-1 gap-x-8 gap-y-2 pl-5 md:grid-cols-2">
                {bullets.map((b) => (
                  <li key={b.id}>{b.text}</li>
                ))}
              </ul>
            </div>
          )}
          {section.disclaimer && <p className="mt-6 text-small text-scheme-text-muted">{section.disclaimer}</p>}
        </article>
      </div>
    </section>
  );
}
