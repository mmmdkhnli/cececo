import { SimpleHero } from "@/components/shared/simple-hero";
import { ProjectsList } from "@/components/projects/projects-list";
import { getProjects } from "@/db/queries/projects";

export const metadata = {
  title: "Projects — CECECO",
  description: "Regional initiatives and projects CECECO implements and supports across the ECO region.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const allProjects = await getProjects();
  const projects = type === "regional-initiative" ? allProjects.filter((p) => p.isRegionalInitiative) : allProjects;
  const isRegional = type === "regional-initiative";

  return (
    <main>
      <SimpleHero
        title={isRegional ? "Regional Initiatives" : "Projects"}
        subtitle="CECECO implements and supports regional initiatives that drive clean energy transition and sustainable development across the ECO region."
      />
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          <ProjectsList projects={projects} />
        </div>
      </section>
    </main>
  );
}
