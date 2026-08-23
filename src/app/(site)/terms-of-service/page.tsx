import { notFound } from "next/navigation";
import { getPageBySlug } from "@/db/queries/pages";
import { PageHero } from "@/components/shared/page-hero";
import { LegalContent } from "@/components/shared/legal-content";

export const metadata = {
  title: "Terms of Service — CECECO",
  description: "The terms and conditions governing use of the CECECO website.",
};

export default async function TermsOfServicePage() {
  const data = await getPageBySlug("terms-of-service");

  if (!data) notFound();

  return (
    <main>
      {data.sections.map((s) => {
        switch (s.componentKey) {
          case "page-hero":
            return <PageHero key={s.id} scheme={s.scheme} section={s} />;
          case "legal-content":
            return <LegalContent key={s.id} scheme={s.scheme} section={s} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
