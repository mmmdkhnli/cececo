import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DribbbleLogo, LinkedinLogo, XLogo } from "relume-icons";
import { RichText } from "@/components/shared/rich-text";
import type { SectionRow, TeamMemberRow } from "@/db/schema";

export function TechnicalTeam({
  section,
  members,
  scheme,
}: {
  section: SectionRow;
  members: TeamMemberRow[];
  scheme: string;
}) {
  return (
    <section className={`px-[5%] py-20 md:py-24 lg:py-28 ${scheme} badge-alt`}>
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{section.eyebrow}</p>
          <h2 className="mb-5 text-h2 font-bold md:mb-6">{section.heading}</h2>
          <RichText html={section.subtitle} className="text-medium" />
        </div>
        <div className="grid grid-cols-1 items-start justify-center gap-x-8 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          {members.map((member) => (
            <div key={member.id} className="flex flex-col text-center">
              <div className="mb-5 flex flex-col flex-nowrap text-center md:mb-6">
                <div className="mx-auto w-full">
                  <img
                    src={member.photo ?? "/logo/logo-dark.png"}
                    alt=""
                    className="aspect-square size-full rounded-image object-cover"
                  />
                </div>
              </div>
              <div className="mb-3 md:mb-4">
                <h5 className="text-large font-semibold">{member.name}</h5>
                <h6 className="text-medium">{member.role}</h6>
              </div>
              <p>{member.bio}</p>
              <div className="mt-5 grid grid-flow-col grid-cols-[max-content] gap-3.5 self-center md:mt-6">
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl}>
                    <LinkedinLogo className="size-6 text-scheme-text" />
                  </a>
                )}
                {member.xUrl && (
                  <a href={member.xUrl}>
                    <XLogo className="size-6 p-0.5 text-scheme-text" />
                  </a>
                )}
                {member.dribbbleUrl && (
                  <a href={member.dribbbleUrl}>
                    <DribbbleLogo className="size-6 text-scheme-text" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {section.secondaryHeading && (
          <div className="mx-auto mt-14 w-full max-w-md text-center md:mt-20 lg:mt-24">
            <h4 className="mb-3 text-h4 font-bold md:mb-4">{section.secondaryHeading}</h4>
            <RichText html={section.secondaryBody} className="text-medium" />
            {section.closingCtaLabel && section.closingCtaHref && (
              <div className="mt-5 grid grid-flow-col grid-cols-[max-content] gap-3.5 justify-self-center md:mt-6">
                <Button asChild title={section.closingCtaLabel} variant="secondary">
                  <Link href={section.closingCtaHref}>{section.closingCtaLabel}</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
