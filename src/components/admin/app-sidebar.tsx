"use client";

import {
  LayoutDashboardIcon,
  FileTextIcon,
  UsersIcon,
  BriefcaseIcon,
  LibraryIcon,
  MailIcon,
  InboxIcon,
  UserPlusIcon,
  ListTreeIcon,
  SettingsIcon,
} from "lucide-react";

import { useAdminTheme } from "@/components/admin/dark-root";
import { NavMain, type NavMainItem } from "@/components/admin/nav-main";
import { NavSecondary } from "@/components/admin/nav-secondary";
import { NavUser } from "@/components/admin/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/admin/ui/sidebar";

export const NAV_MAIN: NavMainItem[] = [
  { title: "Dashboard", url: "/admin", exact: true, icon: <LayoutDashboardIcon /> },
  {
    title: "Pages",
    url: "/admin/pages",
    icon: <FileTextIcon />,
    items: [
      { title: "Home page", url: "/admin/pages/home" },
      { title: "About", url: "/admin/pages/about" },
      { title: "Team", url: "/admin/pages/team" },
      { title: "Our Work", url: "/admin/pages/our-work" },
      { title: "Partners", url: "/admin/pages/partners" },
      { title: "Vision and Mission", url: "/admin/pages/vision-and-mission" },
      { title: "Signatory Countries", url: "/admin/pages/signatory-countries" },
      { title: "Privacy Policy", url: "/admin/pages/privacy-policy" },
      { title: "Terms of Service", url: "/admin/pages/terms-of-service" },
      { title: "Cookie Settings", url: "/admin/pages/cookie-settings" },
    ],
  },
  {
    title: "Content",
    url: "/admin/team",
    icon: <UsersIcon />,
    items: [
      { title: "Team members", url: "/admin/team" },
      { title: "Blog / News", url: "/admin/blog" },
      { title: "Projects", url: "/admin/projects" },
      { title: "Partners & Countries", url: "/admin/partners" },
    ],
  },
  { title: "Work With Us", url: "/admin/work-with-us", icon: <BriefcaseIcon /> },
  {
    title: "Resources",
    url: "/admin/publications",
    icon: <LibraryIcon />,
    items: [
      { title: "Publications", url: "/admin/publications" },
      { title: "Media", url: "/admin/media" },
    ],
  },
];

export const NAV_SECONDARY = [
  { title: "Contact methods", url: "/admin/contact", icon: <MailIcon /> },
  { title: "Contact messages", url: "/admin/contact-messages", icon: <InboxIcon /> },
  { title: "Subscribers", url: "/admin/subscribers", icon: <UserPlusIcon /> },
  { title: "Navigation", url: "/admin/navigation", icon: <ListTreeIcon /> },
  { title: "Site settings", url: "/admin/settings", icon: <SettingsIcon /> },
];

export function AppSidebar({
  email,
  name,
  logoLight,
  logoDark,
  ...props
}: {
  email: string;
  name: string;
  logoLight: string;
  logoDark: string;
} & React.ComponentProps<typeof Sidebar>) {
  const { theme } = useAdminTheme();
  const logo = theme === "dark" ? logoDark : logoLight;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="group-data-[collapsible=icon]:items-center">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <img src={logo} alt="CECECO" className="h-7 w-auto shrink-0 object-contain group-data-[collapsible=icon]:hidden" />
          <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_MAIN} />
        <NavSecondary items={NAV_SECONDARY} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser name={name} email={email} />
      </SidebarFooter>
    </Sidebar>
  );
}
