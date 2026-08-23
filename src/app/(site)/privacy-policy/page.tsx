import { notFound } from "next/navigation";
import { getPageBySlug } from "@/db/queries/pages";
import { PageHero } from "@/components/shared/page-hero";
import { LegalContent } from "@/components/shared/legal-content";

export const metadata = {
  title: "Privacy Policy — CECECO",
  description:
    "How CECECO collects, uses, and protects information on this website.",
};

export default async function PrivacyPolicyPage() {
  const data = await getPageBySlug("privacy-policy");

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
