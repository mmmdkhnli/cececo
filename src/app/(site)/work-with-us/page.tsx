import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "relume-icons";
import { SimpleHero } from "@/components/shared/simple-hero";
import { getOpportunities } from "@/db/queries/resources";

export const metadata = {
  title: "Work With Us — CECECO",
  description: "Internships, vacancies, and the Young Professional Programme at CECECO.",
};

const CATEGORY_LABEL: Record<string, string> = {
  internship: "Internship",
  vacancy: "Vacancy",
  young_professional_programme: "Young Professional Programme",
  other: "Other",
  job: "Job",
  grant: "Grant",
  tender: "Tender",
};

export default async function WorkWithUsPage() {
  const opportunities = await getOpportunities();

  return (
    <main>
      <SimpleHero
        title="Work With Us"
        subtitle="Internships, vacancies, and opportunities to help shape CECECO's mission."
      />
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container max-w-3xl">
          {opportunities.length === 0 ? (
            <p className="text-center text-medium text-neutral">No open opportunities right now.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {opportunities.map((item) => (
                <Card key={item.id} className="flex flex-col gap-4 p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3">
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
                  <Link href={`/work-with-us/${item.slug}`}>
                    <h2 className="text-h4 font-bold">{item.title}</h2>
                  </Link>
                  <p>{item.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Button
                      asChild
                      title="Read more"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      className="flex items-center gap-x-2"
                    >
                      <Link href={`/work-with-us/${item.slug}`}>Read more</Link>
                    </Button>
                    {item.status === "active" && (
                      <Button asChild variant="secondary">
                        <a href={item.applyUrl} target="_blank" rel="noopener noreferrer">
                          Apply now
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
