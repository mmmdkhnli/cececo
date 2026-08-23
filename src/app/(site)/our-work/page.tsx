import { getPageBySlug } from "@/db/queries/pages";

import { PageHero } from "@/components/shared/page-hero";
import { OutcomeIntro } from "@/components/work/outcome-intro";
import { OutcomeFeature } from "@/components/work/outcome-feature";

export const metadata = {
  title: "Our Work — CECECO",
  description:
    "CECECO drives regional integration through targeted energy programmes that transform economic cooperation across the ECO region.",
};

export default async function OurWorkPage() {
  const data = await getPageBySlug("our-work");

  if (!data) {
    return (
      <main className="px-[5%] py-28 text-center">
        <p>
          Our Work page not found in the database yet — run <code>npm run db:seed</code> after{" "}
          <code>npm run db:push</code>.
        </p>
      </main>
    );
  }

  return (
    <main>
      {data.sections.map((s) => {
        switch (s.componentKey) {
          case "page-hero":
            return <PageHero key={s.id} scheme={s.scheme} section={s} />;
          case "outcome-intro":
            return <OutcomeIntro key={s.id} scheme={s.scheme} section={s} />;
          case "outcome-feature":
            return <OutcomeFeature key={s.id} scheme={s.scheme} section={s} bullets={s.bullets} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
