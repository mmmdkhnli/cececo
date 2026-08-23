import { getPageBySlug } from "@/db/queries/pages";
import { PageHero } from "@/components/shared/page-hero";
import { ContentBlock } from "@/components/shared/content-block";

export const metadata = {
  title: "Vision and Mission — CECECO",
  description: "The principles and long-term goals guiding CECECO's work across the ECO region.",
};

export default async function VisionMissionPage() {
  const data = await getPageBySlug("vision-and-mission");

  if (!data) {
    return (
      <main className="px-[5%] py-28 text-center">
        <p>
          Vision and Mission page not found in the database yet — run <code>npm run db:seed</code> after{" "}
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
          case "content-block":
            return <ContentBlock key={s.id} scheme={s.scheme} section={s} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
