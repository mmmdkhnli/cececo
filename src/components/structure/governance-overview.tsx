import { RichText } from "@/components/shared/rich-text";
import type { SectionRow } from "@/db/schema";
import { governanceAnchor } from "@/components/structure/governance-anchor";

/** Charter introduction plus a numbered jump-list of the governance bodies further down the page. */
export function GovernanceOverview({
  section,
  scheme,
  bodies,
}: {
  section: SectionRow;
  scheme: string;
  bodies: SectionRow[];
}) {
  return (
    <section className={`px-[5%] py-16 md:py-24 lg:py-28 ${scheme}`}>
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          {section.eyebrow && <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>}
          {section.heading && <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>}
          <RichText html={section.subtitle} className="text-medium" />
        </div>
        {bodies.length > 0 && (
          <nav aria-label="Governance bodies">
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {bodies.map((body, i) => (
                <li key={body.id}>
                  <a
                    href={`#${governanceAnchor(body)}`}
                    className="group flex h-full flex-col rounded-card border border-scheme-border p-6 transition-colors hover:bg-scheme-hover md:p-8"
                  >
                    <span className="text-h4 font-bold text-scheme-accent" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-h5 font-bold">{body.heading}</h3>
                    {body.disclaimer && <p className="mt-2 text-scheme-text-muted">{body.disclaimer}</p>}
                    <span className="mt-auto pt-6 font-semibold text-scheme-accent" aria-hidden="true">
                      Read more <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
}
