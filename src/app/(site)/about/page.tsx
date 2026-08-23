import { getPageBySlug } from "@/db/queries/pages";

import { PageHero } from "@/components/shared/page-hero";
import { Origin } from "@/components/about/origin";
import { Purpose } from "@/components/about/purpose";
import { ObjectivesTabs } from "@/components/about/objectives-tabs";

export const metadata = {
  title: "About — CECECO",
  description:
    "Clean energy catalyst driving sustainable transformation across the Economic Cooperation Organisation region.",
};

export default async function AboutPage() {
  const data = await getPageBySlug("about");

  if (!data) {
    return (
      <main className="px-[5%] py-28 text-center">
        <p>
          About page not found in the database yet — run <code>npm run db:seed</code> after{" "}
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
          case "origin":
            return <Origin key={s.id} scheme={s.scheme} section={s} />;
          case "purpose":
            return <Purpose key={s.id} scheme={s.scheme} section={s} />;
          case "objectives-tabs":
            return <ObjectivesTabs key={s.id} scheme={s.scheme} section={s} objectives={s.tabs} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
