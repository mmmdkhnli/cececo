import Link from "next/link";
import { LinkedinLogo, XLogo } from "relume-icons";
import { getFooterGroups, getSiteSettings } from "@/db/queries/site";

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  x: XLogo,
  linkedin: LinkedinLogo,
};

export async function Footer() {
  const [settings, groups] = await Promise.all([getSiteSettings(), getFooterGroups()]);
  const quickLinks = groups.find((g) => g.group === "quick_links")?.links ?? [];
  const connect = groups.find((g) => g.group === "connect")?.links ?? [];

  return (
    <footer className="px-[5%] py-12 md:py-18 lg:py-20 scheme-6 badge-alt alternate logo-alt">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-[8vw] gap-y-12 pb-12 md:gap-y-16 md:pb-18 lg:grid-cols-[0.75fr_1fr] lg:gap-y-4 lg:pb-20">
          <div className="flex flex-col">
            <Link href="/" className="mb-5 md:mb-6">
              <img
                src={settings?.logoDark || "/logo/logo-dark.png"}
                alt="CECECO"
                className="inline-block h-8 w-auto"
              />
            </Link>
            <p className="mb-5 md:mb-6">
              {settings?.footerDescription ??
                "Stay updated with our latest insights, projects, and clean energy developments."}
            </p>
          </div>
          <div className="grid grid-cols-1 items-start gap-y-10 sm:grid-cols-2 sm:gap-x-6 md:gap-x-8 md:gap-y-4">
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4">Quick links</h2>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.id} className="text-small py-2">
                    <a href={link.href} className="flex items-center gap-3">
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4">Connect</h2>
              <ul className="flex flex-col items-start">
                {connect.map((link) => {
                  const Icon = link.icon ? SOCIAL_ICONS[link.icon] : null;
                  return (
                    <li key={link.id} className="text-small py-2">
                      <a href={link.href} className="flex items-center gap-3">
                        {Icon && <Icon className="size-6 text-scheme-text" />}
                        <span>{link.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-scheme-border" />
        <div className="text-small flex flex-col-reverse items-start justify-between pt-6 pb-4 md:flex-row md:items-center md:pt-8 md:pb-0">
          <p className="mt-6 md:mt-0">{settings?.copyrightText ?? "© 2026 CECECO. All rights reserved."}</p>
          <ul className="text-small grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 md:grid-flow-col md:gap-x-6 md:gap-y-0">
            <li className="underline">
              <a href="/privacy-policy">Privacy policy</a>
            </li>
            <li className="underline">
              <a href="/terms-of-service">Terms of service</a>
            </li>
            <li className="underline">
              <a href="/cookie-settings">Cookie settings</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
