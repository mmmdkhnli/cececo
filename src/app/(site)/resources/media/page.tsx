import { SimpleHero } from "@/components/shared/simple-hero";
import { MediaList } from "@/components/resources/media-list";
import { getPublishedMediaItems } from "@/db/queries/media";

export const metadata = {
  title: "Media — CECECO",
  description:
    "Photos, videos, and multimedia materials from CECECO events and activities.",
};

export default async function MediaPage() {
  const items = await getPublishedMediaItems();

  return (
    <main>
      <SimpleHero
        title="Media"
        subtitle="Photos, videos, and multimedia materials from CECECO events and activities."
      />
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          <MediaList items={items} />
        </div>
      </section>
    </main>
  );
}
