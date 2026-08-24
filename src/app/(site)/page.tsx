import { notFound } from "next/navigation";
import { getPageBySlug } from "@/db/queries/pages";
import { getHeroSlides } from "@/db/queries/hero";
import { getPublishedBlogPosts } from "@/db/queries/blog";
import { getContactMethods } from "@/db/queries/contact";

import { HeroCarousel } from "@/components/home/hero-carousel";
import { BlogList } from "@/components/home/blog-list";
import { ContactMethods } from "@/components/home/contact-methods";
import { NewsletterCta } from "@/components/home/newsletter-cta";

export default async function HomePage() {
  const [data, slides, posts, methods] = await Promise.all([
    getPageBySlug("home"),
    getHeroSlides(),
    getPublishedBlogPosts(3),
    getContactMethods(),
  ]);

  if (!data) notFound();

  return (
    <main>
      <HeroCarousel slides={slides} />
      {data.sections.map((s) => {
        switch (s.componentKey) {
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
