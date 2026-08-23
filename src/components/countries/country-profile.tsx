import { Card } from "@/components/ui/card";
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
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <img
                src={country.flagImage}
                alt={`${country.name} flag`}
                className="mb-6 h-16 w-auto rounded-image object-cover"
              />
              <h1 className="mb-5 text-h1 font-bold">{country.name}</h1>
              {country.description && (
                <p className="text-medium text-scheme-text-muted">
                  {country.description}
                </p>
              )}
            </div>
            {country.heroImage && (
              <img
                src={country.heroImage}
                alt={country.name}
                className="aspect-video w-full rounded-image object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {facts.length > 0 && (
        <section className="scheme-2 px-[5%] pb-16 md:pb-24 lg:pb-28">
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
