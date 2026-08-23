"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

import { logout } from "@/app/admin/login/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/admin/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/admin/ui/sidebar";

type NavItem = { href: string; label: string; exact?: boolean };
type NavGroup = { key: string; label: string; items: NavItem[] };

const ROOT_ITEM: NavItem = { href: "/admin", label: "Dashboard", exact: true };

const NAV_GROUPS: NavGroup[] = [
  {
    key: "pages",
    label: "Pages",
    items: [
      { href: "/admin/pages/home", label: "Home page" },
      { href: "/admin/pages/about", label: "About" },
      { href: "/admin/pages/team", label: "Team" },
      { href: "/admin/pages/our-work", label: "Our Work" },
      { href: "/admin/pages/partners", label: "Partners" },
      { href: "/admin/pages/vision-and-mission", label: "Vision and Mission" },
      { href: "/admin/pages/signatory-countries", label: "Signatory Countries" },
      { href: "/admin/pages/privacy-policy", label: "Privacy Policy" },
      { href: "/admin/pages/terms-of-service", label: "Terms of Service" },
      { href: "/admin/pages/cookie-settings", label: "Cookie Settings" },
    ],
  },
  {
    key: "content",
    label: "Content",
    items: [
      { href: "/admin/team", label: "Team members" },
      { href: "/admin/blog", label: "Blog / News" },
      { href: "/admin/projects", label: "Projects" },
      { href: "/admin/partners", label: "Partners & Countries" },
    ],
  },
  {
    key: "work-with-us",
    label: "Work With Us",
    items: [{ href: "/admin/work-with-us", label: "Work With Us" }],
  },
  {
    key: "resources",
    label: "Resources",
    items: [
      { href: "/admin/publications", label: "Publications" },
      { href: "/admin/media", label: "Media" },
    ],
  },
  {
    key: "site",
    label: "Site",
    items: [
      { href: "/admin/contact", label: "Contact methods" },
      { href: "/admin/contact-messages", label: "Contact messages" },
      { href: "/admin/subscribers", label: "Subscribers" },
      { href: "/admin/navigation", label: "Navigation" },
      { href: "/admin/settings", label: "Site settings" },
    ],
  },
];

function isItemActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function AdminSidebar({
  email,
  name,
  logoDark,
}: {
  email: string;
  name: string;
  logoDark: string;
}) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <img
          src={logoDark}
          alt="CECECO"
          className="h-7 w-auto group-data-[collapsible=icon]:hidden"
        />
        <p className="mt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase group-data-[collapsible=icon]:hidden">
          Admin panel
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isItemActive(pathname, ROOT_ITEM)} tooltip={ROOT_ITEM.label}>
                  <Link href={ROOT_ITEM.href}>
                    <LayoutDashboard />
                    <span>{ROOT_ITEM.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {NAV_GROUPS.map((group) => {
          const groupActive = group.items.some((i) => isItemActive(pathname, i));
          return (
            <Collapsible key={group.key} defaultOpen={groupActive} className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between">
                    {group.label}
                    <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={isItemActive(pathname, item)} tooltip={item.label}>
                            <Link href={item.href}>
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <p className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">{name || "Admin"}</p>
        <p className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">{email}</p>
        <form action={logout} className="mt-3">
          <SubmitButton pendingText="Signing out..." variant="outline" className="w-full">
            <LogOut className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
          </SubmitButton>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
