import { getPageBySlug } from "@/db/queries/pages";
import { getPartners } from "@/db/queries/partners";

import { PageHero } from "@/components/shared/page-hero";
import { PartnersGrid } from "@/components/partners/partners-grid";

export const metadata = {
  title: "Partners — CECECO",
  description:
    "CECECO's impact is built on strong partnerships — with international organisations and technical institutions working toward a shared clean energy future.",
};

export default async function PartnersPage() {
  const [data, partners] = await Promise.all([getPageBySlug("partners"), getPartners()]);

  if (!data) {
    return (
      <main className="px-[5%] py-28 text-center">
        <p>
          Partners page not found in the database yet — run <code>npm run db:seed</code> after{" "}
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
          case "partners-grid":
            return <PartnersGrid key={s.id} scheme={s.scheme} section={s} partners={partners} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
