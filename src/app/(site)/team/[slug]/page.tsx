import { notFound } from "next/navigation";
import { RichText } from "@/components/shared/rich-text";
import { getTeamMemberBySlug } from "@/db/queries/team";
import { DribbbleLogo, LinkedinLogo, XLogo } from "relume-icons";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) return {};
  return { title: `${member.name} — CECECO` };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) notFound();

  return (
    <main>
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container max-w-3xl">
          <div className="mb-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="size-28 shrink-0 overflow-hidden rounded-full">
              <img src={member.photo ?? "/logo/logo-dark.png"} alt="" className="size-full object-cover" />
            </div>
            <div>
              <h1 className="text-h2 font-bold">{member.name}</h1>
              <p className="mt-1 text-medium text-scheme-text-muted">{member.role}</p>
              <div className="mt-4 flex items-center justify-center gap-3.5 sm:justify-start">
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
          </div>

          <RichText html={member.detailBody} className="text-medium" />
        </div>
      </section>
    </main>
  );
}
