import { notFound } from "next/navigation";
import { getPageBySlug } from "@/db/queries/pages";
import { getPartners, getSignatoryStates } from "@/db/queries/partners";

import { PageHero } from "@/components/shared/page-hero";
import { PartnersGrid } from "@/components/partners/partners-grid";
import { MemberStatesGrid } from "@/components/partners/member-states-grid";

export const metadata = {
  title: "Partners — CECECO",
  description:
    "CECECO's impact is built on strong partnerships — with international organisations and technical institutions working toward a shared clean energy future.",
};

export default async function PartnersPage() {
  const [data, partners, states] = await Promise.all([
    getPageBySlug("partners"),
    getPartners(),
    getSignatoryStates(),
  ]);

  if (!data) notFound();

  return (
    <main>
      {data.sections.map((s) => {
        switch (s.componentKey) {
          case "page-hero":
            return <PageHero key={s.id} scheme={s.scheme} section={s} />;
          case "member-states-grid":
            return <MemberStatesGrid key={s.id} scheme={s.scheme} section={s} states={states} />;
          case "partners-grid":
            return <PartnersGrid key={s.id} scheme={s.scheme} section={s} partners={partners} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
