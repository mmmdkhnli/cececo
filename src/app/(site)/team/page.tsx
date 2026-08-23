import { notFound } from "next/navigation";
import { getPageBySlug } from "@/db/queries/pages";
import { getTeamMembersByGroup } from "@/db/queries/team";

import { PageHero } from "@/components/shared/page-hero";
import { LeadershipTeam } from "@/components/team/leadership-team";
import { TechnicalTeam } from "@/components/team/technical-team";

export const metadata = {
  title: "Team — CECECO",
  description: "Our team leads the transformation of regional energy landscapes with expertise and commitment.",
};

export default async function TeamPage() {
  const [data, leadership, technical] = await Promise.all([
    getPageBySlug("team"),
    getTeamMembersByGroup("leadership"),
    getTeamMembersByGroup("technical"),
  ]);

  if (!data) notFound();

  return (
    <main>
      {data.sections.map((s) => {
        switch (s.componentKey) {
          case "page-hero":
            return <PageHero key={s.id} scheme={s.scheme} section={s} />;
          case "leadership-team":
            return <LeadershipTeam key={s.id} scheme={s.scheme} section={s} members={leadership} />;
          case "technical-team":
            return <TechnicalTeam key={s.id} scheme={s.scheme} section={s} members={technical} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
