import { Card } from "@/components/ui/card";
import { RichText } from "@/components/shared/rich-text";
import {
  CalendarToday,
  Home,
  LocationOn,
  Person,
  Schedule,
} from "relume-icons";
import type { MemberStateRow } from "@/db/schema";

const KEY_FACTS: {
  key: keyof MemberStateRow;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "region", label: "Region", Icon: LocationOn },
  { key: "capital", label: "Capital", Icon: Home },
  { key: "population", label: "Population", Icon: Person },
  { key: "area", label: "Area", Icon: LocationOn },
  { key: "founded", label: "Founded", Icon: CalendarToday },
  { key: "timeZone", label: "Time Zone", Icon: Schedule },
];

export function CountryProfile({ country }: { country: MemberStateRow }) {
  const facts = KEY_FACTS.filter((f) => country[f.key]);

  return (
    <main>
      <section className="relative px-[5%] py-20 md:py-24 lg:py-28 scheme-4">
        <div className="relative z-10 container max-w-lg text-center">
          <img
            src={country.flagImage}
            alt={`${country.name} flag`}
            className="mx-auto mb-6 h-16 w-auto rounded-image object-cover"
          />
          <h1 className="text-h1 font-bold text-white">{country.name}</h1>
        </div>
        <div className="absolute inset-0 z-0">
          {country.heroImage && (
            <img src={country.heroImage} alt="" className="size-full object-cover" />
          )}
          <div className="absolute inset-0 bg-neutral-darkest/50" />
        </div>
      </section>

      {facts.length > 0 && (
        <section className="scheme-2 px-[5%] pt-16 pb-0 md:pt-24 lg:pt-28">
          <div className="container">
            <Card className="p-6 md:p-8">
              <h2 className="mb-6 text-h5 font-bold">Key Facts</h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                {facts.map(({ key, label, Icon }) => (
                  <div
                    key={key}
                    className="flex flex-col items-center gap-3 text-center"
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-mountain-meadow-lightest">
                      <Icon className="size-5 text-scheme-accent" />
                    </div>
                    <div>
                      <p className="text-tiny text-scheme-text-muted">{label}</p>
                      <p className="text-small font-bold text-scheme-text">
                        {String(country[key])}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      )}

      {country.description && (
        <section className="scheme-2 px-[5%] py-16 md:py-24 lg:py-28">
          <div className="container max-w-3xl">
            <RichText html={country.description} className="text-medium" />
          </div>
        </section>
      )}

      {country.renewableEnergySharesImage && (
        <section className="scheme-2 px-[5%] pb-16 md:pb-24 lg:pb-28">
          <div className="container">
            <Card className="p-6 md:p-8">
              <h2 className="mb-6 text-h5 font-bold">
                Renewable Energy Shares
              </h2>
              <img
                src={country.renewableEnergySharesImage}
                alt="Renewable Energy Shares"
                className="w-full"
              />
            </Card>
          </div>
        </section>
      )}

      {country.bySourceImage && (
        <section className="scheme-2 px-[5%] pb-16 md:pb-24 lg:pb-28">
          <div className="container">
            <Card className="p-6 md:p-8">
              <h2 className="mb-6 text-h5 font-bold">By Source</h2>
              <img
                src={country.bySourceImage}
                alt="By Source"
                className="w-full"
              />
            </Card>
          </div>
        </section>
      )}
    </main>
  );
}
