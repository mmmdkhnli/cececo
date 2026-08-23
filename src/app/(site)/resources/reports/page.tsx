import { SimpleHero } from "@/components/shared/simple-hero";
import { ResourceCategoryList } from "@/components/resources/resource-category-list";
import { getPublishedPublicationsByCategory } from "@/db/queries/resources";

export const metadata = {
  title: "Reports — CECECO",
  description: "Reports published by CECECO on clean energy and regional cooperation.",
};

export default async function ReportsPage() {
  const reports = await getPublishedPublicationsByCategory("Report");

  return (
    <main>
      <SimpleHero title="Reports" subtitle="Activity reports and data-driven publications." />
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          <ResourceCategoryList items={reports} basePath="/resources/reports" emptyMessage="No reports yet." />
        </div>
      </section>
    </main>
  );
}
