import { SimpleHero } from "@/components/shared/simple-hero";
import { ResourceCategoryList } from "@/components/resources/resource-category-list";
import { getPublishedPublicationsByCategory } from "@/db/queries/resources";

export const metadata = {
  title: "Publications — CECECO",
  description: "Reports, research, and publications from CECECO.",
};

export default async function PublicationsPage() {
  const publications = await getPublishedPublicationsByCategory("Publication");

  return (
    <main>
      <SimpleHero title="Publications" subtitle="Reports, research, and publications." />
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          <ResourceCategoryList
            items={publications}
            basePath="/resources/publications"
            emptyMessage="No publications yet."
          />
        </div>
      </section>
    </main>
  );
}
