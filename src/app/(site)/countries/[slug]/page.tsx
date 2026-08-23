import { notFound } from "next/navigation";
import { CountryProfile } from "@/components/countries/country-profile";
import { getCountryBySlug } from "@/db/queries/partners";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) return {};
  return {
    title: `${country.name} — CECECO`,
    description:
      country.description ??
      `${country.name}'s clean energy profile within the ECO region.`,
  };
}

export default async function CountryProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) notFound();

  return <CountryProfile country={country} />;
}
