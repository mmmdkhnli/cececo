import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/shared/rich-text";
import { getProjectBySlug } from "@/db/queries/projects";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  completed: "Completed",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getProjectBySlug(slug);
  if (!item) return {};
  return { title: `${item.title} — CECECO`, description: item.shortDescription };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getProjectBySlug(slug);
  if (!item) notFound();

  const period =
    item.periodStart || item.periodEnd
      ? [item.periodStart, item.periodEnd]
          .filter((d): d is Date => Boolean(d))
          .map((d) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }))
          .join(" – ")
      : null;

  return (
    <main>
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container max-w-3xl">
          <div className="mb-8 flex flex-col-reverse gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <Badge>{STATUS_LABEL[item.status]}</Badge>
              <h1 className="mt-4 text-h1 font-bold">{item.title}</h1>
              <p className="mt-3 text-medium text-neutral">{item.shortDescription}</p>
            </div>
            {item.coverImage && (
              <img
                src={item.coverImage}
                alt=""
                className="aspect-video w-full rounded-image object-cover md:w-80 md:shrink-0"
              />
            )}
          </div>

          <div className="mb-10 grid grid-cols-2 gap-6 rounded-card border border-scheme-border p-5 sm:grid-cols-4">
            <InfoItem label="Status" value={STATUS_LABEL[item.status]} />
            {period && <InfoItem label="Period" value={period} />}
            {item.applicationsOpen && item.applicationDeadline && (
              <InfoItem
                label="Application Deadline"
                value={new Date(item.applicationDeadline).toLocaleDateString("en-US")}
              />
            )}
            {item.applicationsOpen && item.whoCanApply && (
              <InfoItem label="Who Can Apply" value={item.whoCanApply} />
            )}
          </div>

          {item.aboutBody && (
            <div className="mb-10">
              <h2 className="mb-3 text-h4 font-bold">About the Project</h2>
              <RichText html={item.aboutBody} className="text-medium" />
            </div>
          )}

          {item.objectives.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-3 text-h4 font-bold">Objectives</h2>
              <ul className="flex flex-col gap-2">
                {item.objectives.map((o) => (
                  <li key={o.id} className="flex items-start gap-2">
                    <span className="mt-1 text-mountain-meadow-dark">✓</span>
                    <span>{o.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.applicationsOpen && item.howToApplyBody && (
            <div className="mb-10">
              <h2 className="mb-3 text-h4 font-bold">How to Apply</h2>
              <RichText html={item.howToApplyBody} className="text-medium" />
            </div>
          )}

          {item.applicationsOpen && item.applyUrl && (
            <Button asChild variant="secondary">
              <a href={item.applyUrl} target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-tiny font-semibold text-neutral uppercase">{label}</p>
      <p className="mt-1 text-small font-medium text-scheme-text">{value}</p>
    </div>
  );
}
