import { getNavbarLinks, getSiteSettings } from "@/db/queries/site";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const [links, settings] = await Promise.all([getNavbarLinks(), getSiteSettings()]);
  return <NavbarClient links={links} logo={settings?.logoLight || "/logo/logo-light.png"} />;
}
