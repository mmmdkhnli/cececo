import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RichText } from "@/components/shared/rich-text";
import type { SectionRow, MemberStateRow } from "@/db/schema";

export function MemberStatesGrid({
  section,
  states,
  scheme,
}: {
  section: SectionRow;
  states: MemberStateRow[];
  scheme: string;
}) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme}`}>
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
          <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
          <RichText html={section.subtitle} className="text-medium" />
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
          {states.map((state) => {
            const card = (
              <Card className="flex flex-col items-center gap-3 p-5 text-center transition-opacity hover:opacity-90">
                <img
                  src={state.flagImage}
                  alt={state.name}
                  className="aspect-video w-full rounded-image object-cover"
                />
                <p className="text-small font-semibold">{state.name}</p>
              </Card>
            );
            return state.slug ? (
              <Link key={state.id} href={`/countries/${state.slug}`}>
                {card}
              </Link>
            ) : (
              <div key={state.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
