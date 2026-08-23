import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CtaGroup } from "@/components/shared/cta-group";
import { RichText } from "@/components/shared/rich-text";
import type { SectionRow, SectionTabRow } from "@/db/schema";

export function ObjectivesTabs({
  section,
  objectives,
  scheme,
}: {
  section: SectionRow;
  objectives: SectionTabRow[];
  scheme: string;
}) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} badge-alt`}>
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
          <h1 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h1>
          <RichText html={section.subtitle} className="text-medium" />
        </div>
        <Card>
          <Tabs
            defaultValue="obj-0"
            orientation="vertical"
            className="relative grid auto-cols-fr grid-cols-1 md:grid-cols-[1fr_1.5fr]"
          >
            <TabsList className="relative grid h-full auto-cols-fr grid-cols-1 border-b border-scheme-border group-data-[slot=card-flat]:border-0 md:border-r md:border-b-0 md:group-data-[slot=card-flat]:border-0">
              {objectives.map((obj, i) => (
                <TabsTrigger
                  key={obj.id}
                  value={`obj-${i}`}
                  className="items-start justify-start rounded-none border-0 border-b p-6 text-h5 font-bold group-data-[slot=card-flat]:border-0 last-of-type:border-0 data-[state=active]:bg-scheme-foreground data-[state=inactive]:border-scheme-border data-[state=inactive]:bg-scheme-background group-data-[slot=card-flat]:data-[state=inactive]:border-0 md:px-8"
                >
                  {obj.tabLabel}
                </TabsTrigger>
              ))}
            </TabsList>
            <div>
              {objectives.map((obj, i) => (
                <TabsContent key={obj.id} value={`obj-${i}`} className="data-[state=active]:animate-tabs">
                  <div className="flex h-full flex-col justify-center p-6 md:p-8 lg:p-16">
                    {obj.icon && (
                      <div className="mb-5 md:mb-6">
                        <img className="size-12 text-scheme-text" src={obj.icon} alt="" />
                      </div>
                    )}
                    <h2 className="mb-5 text-h3 font-bold md:mb-6">{obj.title}</h2>
                    <RichText html={obj.body} />
                    <CtaGroup
                      primary={{ label: obj.ctaPrimaryLabel, href: obj.ctaPrimaryHref, variant: "secondary" }}
                      secondary={{ label: obj.ctaSecondaryLabel, href: obj.ctaSecondaryHref, variant: "link" }}
                    />
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </Card>
      </div>
    </section>
  );
}
