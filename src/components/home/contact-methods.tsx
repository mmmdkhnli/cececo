import { Call, LocationOn, Mail } from "relume-icons";
import { RichText } from "@/components/shared/rich-text";
import type { SectionRow, ContactMethodRow } from "@/db/schema";

const ICONS = { email: Mail, phone: Call, office: LocationOn } as const;

function hrefFor(method: ContactMethodRow) {
  if (method.type === "email") return `mailto:${method.value}`;
  if (method.type === "phone") return `tel:${method.value.replace(/\s+/g, "")}`;
  return "#";
}

export function ContactMethods({
  section,
  methods,
  scheme,
}: {
  section: SectionRow;
  methods: ContactMethodRow[];
  scheme: string;
}) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} badge-alt`}>
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
          <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
          <RichText html={section.subtitle} className="text-medium" />
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-3 md:gap-y-16">
          {methods.map((method) => {
            const Icon = ICONS[method.type];
            return (
              <div key={method.id}>
                <div className="mb-5 lg:mb-6">
                  <Icon className="size-12 text-scheme-text" />
                </div>
                <h3 className="mb-3 text-h4 font-bold lg:mb-4">{method.title}</h3>
                <p className="mb-5 md:mb-6">{method.description}</p>
                <a className="underline" href={hrefFor(method)}>
                  {method.value}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
