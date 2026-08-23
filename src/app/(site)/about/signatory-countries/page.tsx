import { notFound } from "next/navigation";
import { getPageBySlug } from "@/db/queries/pages";
import { getSignatoryStates } from "@/db/queries/partners";

import { PageHero } from "@/components/shared/page-hero";
import { MemberStatesGrid } from "@/components/partners/member-states-grid";

export const metadata = {
  title: "Signatory Countries — CECECO",
  description: "The founding signatory states driving CECECO's mandate across the ECO region.",
};

export default async function SignatoryCountriesPage() {
  const [data, states] = await Promise.all([getPageBySlug("signatory-countries"), getSignatoryStates()]);

  if (!data) notFound();

  return (
    <main>
      {data.sections.map((s) => {
        switch (s.componentKey) {
          case "page-hero":
            return <PageHero key={s.id} scheme={s.scheme} section={s} />;
          case "member-states-grid":
            return <MemberStatesGrid key={s.id} scheme={s.scheme} section={s} states={states} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
