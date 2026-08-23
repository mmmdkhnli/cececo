import { SimpleHero } from "@/components/shared/simple-hero";
import { ResourceCategoryList } from "@/components/resources/resource-category-list";
import { getPublishedPublicationsByCategory } from "@/db/queries/resources";

export const metadata = {
  title: "Documents — CECECO",
  description: "Policy and legal documents published by CECECO.",
};

export default async function DocumentsPage() {
  const documents = await getPublishedPublicationsByCategory("Document");

  return (
    <main>
      <SimpleHero title="Documents" subtitle="Policy and legal documents." />
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          <ResourceCategoryList items={documents} basePath="/resources/documents" emptyMessage="No documents yet." />
        </div>
      </section>
    </main>
  );
}
