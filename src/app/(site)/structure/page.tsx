import { notFound } from "next/navigation";
import { getPageBySlug } from "@/db/queries/pages";
import { isAuthenticated } from "@/lib/session";
import { PageHero } from "@/components/shared/page-hero";
import { RichContent } from "@/components/shared/rich-content";
import { GovernanceOverview } from "@/components/structure/governance-overview";
import { GovernanceBody } from "@/components/structure/governance-body";
import { GovernanceMeeting } from "@/components/structure/governance-meeting";

export const metadata = {
  title: "Governance Structure",
  description:
    "The four governance bodies of the Economic Cooperation Organization Clean Energy Center (CECECO) under its Charter: Board of Governors, Executive Board, Technical Committee and Secretariat.",
  alternates: { canonical: "/structure" },
};

export default async function StructurePage() {
  const data = await getPageBySlug("structure");
  if (!data) notFound();

  // Published only after Secretariat review; until then admins see a preview.
  const isDraft = data.page.status !== "published";
  if (isDraft && !(await isAuthenticated())) notFound();

  const bodies = data.sections.filter((s) => s.componentKey === "governance-body");

  return (
    <main>
      {isDraft && (
        <p className="bg-yellow-100 px-[5%] py-2 text-center text-sm text-yellow-900">
          Draft preview — this page is not public yet.
        </p>
      )}
      {data.sections.map((s) => {
        switch (s.componentKey) {
          case "page-hero":
            return <PageHero key={s.id} scheme={s.scheme} section={s} />;
          case "governance-overview":
            return <GovernanceOverview key={s.id} scheme={s.scheme} section={s} bodies={bodies} />;
          case "governance-body":
            return <GovernanceBody key={s.id} scheme={s.scheme} section={s} index={bodies.indexOf(s)} />;
          case "governance-meeting":
            return <GovernanceMeeting key={s.id} scheme={s.scheme} section={s} bullets={s.bullets} />;
          case "rich-content":
            return <RichContent key={s.id} scheme={s.scheme} section={s} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
