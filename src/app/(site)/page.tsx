import { getPageBySlug } from "@/db/queries/pages";
import { getHeroSlides } from "@/db/queries/hero";
import { getPublishedBlogPosts } from "@/db/queries/blog";
import { getContactMethods } from "@/db/queries/contact";
import { getPublishedCountries } from "@/db/queries/partners";

import { HeroCarousel } from "@/components/home/hero-carousel";
import { BlogList } from "@/components/home/blog-list";
import { ContactMethods } from "@/components/home/contact-methods";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { CountriesCarousel } from "@/components/home/countries-carousel";

export default async function HomePage() {
  const [data, slides, posts, methods, countries] = await Promise.all([
    getPageBySlug("home"),
    getHeroSlides(),
    getPublishedBlogPosts(3),
    getContactMethods(),
    getPublishedCountries(),
  ]);

  if (!data) {
    return (
      <main className="px-[5%] py-28 text-center">
        <p>
          Home page not found in the database yet — run{" "}
          <code>npm run db:seed</code> after <code>npm run db:push</code>.
        </p>
      </main>
    );
  }

  return (
    <main>
      <HeroCarousel slides={slides} />
      {data.sections.map((s) => {
        switch (s.componentKey) {
          case "countries-carousel":
            return (
              <CountriesCarousel
                key={s.id}
                scheme={s.scheme}
                section={s}
                countries={countries}
              />
            );
          case "blog-list":
            return (
              <BlogList
                key={s.id}
                scheme={s.scheme}
                section={s}
                posts={posts}
              />
            );
          case "contact-methods":
            return (
              <ContactMethods
                key={s.id}
                scheme={s.scheme}
                section={s}
                methods={methods}
              />
            );
          case "newsletter-cta":
            return <NewsletterCta key={s.id} scheme={s.scheme} section={s} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
