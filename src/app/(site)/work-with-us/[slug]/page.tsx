import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/shared/rich-text";
import { getOpportunityBySlug } from "@/db/queries/resources";

const CATEGORY_LABEL: Record<string, string> = {
  internship: "Internship",
  vacancy: "Vacancy",
  young_professional_programme: "Young Professional Programme",
  other: "Other",
  // Legacy values, kept so any lingering old rows still render a label.
  job: "Job",
  grant: "Grant",
  tender: "Tender",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getOpportunityBySlug(slug);
  if (!item) return {};
  return { title: `${item.title} — CECECO`, description: item.excerpt ?? undefined };
}

export default async function WorkWithUsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getOpportunityBySlug(slug);
  if (!item) notFound();

  return (
    <main>
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container max-w-2xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge>{CATEGORY_LABEL[item.category]}</Badge>
            {item.status === "closed" && (
              <Badge variant="outline" className="opacity-60">
                Closed
              </Badge>
            )}
            {item.deadline && (
              <p className="text-small text-neutral">
                Deadline: {new Date(item.deadline).toLocaleDateString("en-US")}
              </p>
            )}
          </div>
          <h1 className="mb-8 text-h1 font-bold">{item.title}</h1>
          <RichText html={item.description} className="text-medium" />
          {item.status === "active" && (
            <div className="mt-8">
              <Button asChild variant="secondary">
                <a href={item.applyUrl} target="_blank" rel="noopener noreferrer">
                  Apply now
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
