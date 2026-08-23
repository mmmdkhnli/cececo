import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "relume-icons";
import { SimpleHero } from "@/components/shared/simple-hero";
import { getEvents } from "@/db/queries/blog";

export const metadata = {
  title: "Events — CECECO",
  description: "Upcoming and past events hosted or supported by CECECO across the ECO region.",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main>
      <SimpleHero title="Events" subtitle="Conferences, summits, and gatherings across the ECO region." />
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          {events.length === 0 ? (
            <p className="text-center text-medium text-neutral">No events scheduled yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="flex size-full flex-col items-center justify-start">
                  <Link href={`/news/${event.slug}`} className="w-full">
                    {event.coverImage && (
                      <img src={event.coverImage} alt="" className="aspect-[3/2] size-full object-cover" />
                    )}
                  </Link>
                  <div className="px-5 py-6 md:p-6">
                    <div className="mb-3 flex w-full flex-wrap items-center gap-3 md:mb-4">
                      <Badge>{event.category}</Badge>
                      {event.eventDate && (
                        <p className="text-small font-semibold">
                          {new Date(event.eventDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <Link className="mb-2 block" href={`/news/${event.slug}`}>
                      <h2 className="text-h5 font-bold">{event.title}</h2>
                    </Link>
                    {event.eventLocation && <p className="mb-2 text-small text-neutral">{event.eventLocation}</p>}
                    <p>{event.excerpt}</p>
                    <Button
                      asChild
                      title="Read more"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      className="mt-5 flex items-center justify-center gap-x-2 md:mt-6"
                    >
                      <Link href={`/news/${event.slug}`}>Read more</Link>
                    </Button>
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
